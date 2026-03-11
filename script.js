const API = "/api/tasks";

document.addEventListener("DOMContentLoaded", loadTasks);

// READ - Get all tasks
async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  const container = document.getElementById("taskList");
  container.innerHTML = tasks.map(t => `
    <div class="task-item ${t.completed ? 'done' : ''}">
      <div>
        <strong>${t.title}</strong><br>
        <small>${t.description || ''}</small>
      </div>
      <div>
        <button onclick="toggleComplete('${t._id}', ${!t.completed})">${t.completed ? 'Undo' : 'Done'}</button>
        <button onclick="openEdit('${t._id}', '${t.title}', '${t.description || ''}', ${t.completed})">Edit</button>
        <button onclick="deleteTask('${t._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// CREATE - Add new task
async function createTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  if (!title) return alert("Title required!");

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  });

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  loadTasks();
}

// UPDATE - Toggle complete
async function toggleComplete(id, completed) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
  loadTasks();
}

// UPDATE - Open edit modal
function openEdit(id, title, description, completed) {
  document.getElementById("editId").value = id;
  document.getElementById("editTitle").value = title;
  document.getElementById("editDesc").value = description;
  document.getElementById("editCompleted").checked = completed;
  document.getElementById("editModal").style.display = "block";
}

// UPDATE - Save changes
async function updateTask() {
  const id = document.getElementById("editId").value;
  const title = document.getElementById("editTitle").value;
  const description = document.getElementById("editDesc").value;
  const completed = document.getElementById("editCompleted").checked;

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, completed })
  });

  closeModal();
  loadTasks();
}

// DELETE - Remove task
async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadTasks();
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}
