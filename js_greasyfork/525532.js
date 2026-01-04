// ==UserScript==
// @name         TORN To-Do List
// @namespace    https://github.com/sternenklinge/TORN-ToDo-List
// @author       zuko [2620008]
// @license      MIT
// @version      1.0
// @description  Adds a To-Do list with settings, per-task schedule, drag & drop reordering, and import/export functionality.
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/525532/TORN%20To-Do%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/525532/TORN%20To-Do%20List.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let tasks = JSON.parse(GM_getValue("torn_todo_tasks", "[]"));
    let settings = JSON.parse(GM_getValue("torn_todo_settings", '{"hidden": false}'));
    let lastCheckedTime = GM_getValue("last_checked_time", "Never");
    let draggedTaskIndex = null;
    let currentModalTaskIndex = null; // stores the task index currently being edited

    function formatTimestamp(timestamp) {
        if (timestamp === "Never") return "Never";
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function addToggleButton() {
        if (document.getElementById("todo-toggle-button")) return;
        const button = document.createElement("div");
        button.id = "todo-toggle-button";
        Object.assign(button.style, {
            position: "fixed",
            bottom: "40px",
            right: "5px",
            backgroundColor: "#2c2f33",
            color: "#ffffff",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: "1000",
        });
        button.textContent = settings.hidden ? "Show To-Do List" : "Hide To-Do List";
        button.onclick = toggleTodoListVisibility;
        document.body.appendChild(button);
    }

    function toggleTodoListVisibility() {
        settings.hidden = !settings.hidden;
        GM_setValue("torn_todo_settings", JSON.stringify(settings));
        const todoWindow = document.getElementById("todo-list-window");
        if (todoWindow) todoWindow.style.display = settings.hidden ? "none" : "block";
        // Always close other windows when toggling the todo list
        const settingsPanel = document.getElementById("todo-settings-panel");
        if (settingsPanel) { settingsPanel.style.display = "none"; }
        const modal = document.getElementById("task-schedule-modal");
        if (modal) { modal.remove(); }
        updateToggleButton();
    }

    function updateToggleButton() {
        const toggleButton = document.getElementById("todo-toggle-button");
        if (toggleButton) toggleButton.textContent = settings.hidden ? "Show To-Do List" : "Hide To-Do List";
    }

    function createTodoListWindow() {
        if (document.getElementById("todo-list-window")) return;
        const windowDiv = document.createElement("div");
        windowDiv.id = "todo-list-window";
        Object.assign(windowDiv.style, {
            position: "fixed",
            bottom: "70px",
            right: "5px",
            width: "300px",
            height: "400px",
            backgroundColor: "#2c2f33",
            color: "#ffffff",
            border: "1px solid #444",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
            display: settings.hidden ? "none" : "block",
            zIndex: "1000",
        });

        windowDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; background-color: #23272a; padding: 5px 10px; border-radius: 8px 8px 0 0; border-bottom: 1px solid #444;">
                <span>To-Do List</span>
                <div style="display: flex; gap: 5px;">
                    <button id="open-settings" style="background: none; border: none; color: white; cursor: pointer;">⚙️</button>
                    <button id="close-todo-window" style="background: none; border: none; color: white; cursor: pointer;">X</button>
                </div>
            </div>
            <div id="todo-body" style="padding: 10px; overflow-y: auto; height: 300px;"></div>
            <div style="padding: 10px; border-top: 1px solid #444; display: flex; gap: 5px;">
                <input type="text" id="new-task" placeholder="New Task" style="flex: 1; padding: 5px; border: 1px solid #444; border-radius: 4px; background-color: #2c2f33; color: #ffffff;">
                <button id="add-task" style="padding: 5px 10px; background-color: #7289da; color: white; border: none; border-radius: 4px; cursor: pointer;">Add</button>
            </div>
        `;
        document.body.appendChild(windowDiv);
        document.getElementById("add-task").onclick = addTask;
        // Allow adding a task by pressing Enter in the input field
        document.getElementById("new-task").addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                addTask();
            }
        });
        document.getElementById("close-todo-window").onclick = closeTodoWindow;
        document.getElementById("open-settings").onclick = openSettingsPanel;
        renderTasks();
    }

    function closeTodoWindow() {
        const todoWindow = document.getElementById("todo-list-window");
        if (todoWindow) todoWindow.style.display = "none";
        settings.hidden = true;
        GM_setValue("torn_todo_settings", JSON.stringify(settings));
        updateToggleButton();
        // Also close any open settings panel or task schedule modal
        const settingsPanel = document.getElementById("todo-settings-panel");
        if (settingsPanel) { settingsPanel.style.display = "none"; }
        const modal = document.getElementById("task-schedule-modal");
        if (modal) { modal.remove(); }
    }

    function renderTasks() {
        const taskContainer = document.getElementById("todo-body");
        if (!taskContainer) return;
        taskContainer.innerHTML = "";
        tasks.forEach((task, index) => {
            const taskDiv = document.createElement("div");
            taskDiv.style.display = "flex";
            taskDiv.style.justifyContent = "space-between";
            taskDiv.style.marginBottom = "5px";
            taskDiv.setAttribute("draggable", "true");
            taskDiv.setAttribute("data-index", index);

            taskDiv.addEventListener("dragstart", function(e) {
                draggedTaskIndex = index;
                e.dataTransfer.effectAllowed = "move";
            });
            taskDiv.addEventListener("dragover", function(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            });
            taskDiv.addEventListener("drop", function(e) {
                e.preventDefault();
                const targetIndex = parseInt(taskDiv.getAttribute("data-index"));
                if (draggedTaskIndex === null || draggedTaskIndex === targetIndex) return;
                const draggedTask = tasks.splice(draggedTaskIndex, 1)[0];
                tasks.splice(targetIndex, 0, draggedTask);
                GM_setValue("torn_todo_tasks", JSON.stringify(tasks));
                renderTasks();
            });

            const label = document.createElement("label");
            label.style.flex = "1";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.done;
            checkbox.setAttribute("data-index", index);
            checkbox.style.marginRight = "5px";
            checkbox.onchange = toggleTask;

            const span = document.createElement("span");
            span.textContent = task.text;
            // Increase clickable area for right-click by adding padding and making the span a block-level element
            span.style.display = "inline-block";
            span.style.padding = "5px";
            if (task.done) {
                span.style.textDecoration = "line-through";
                span.style.color = "gray";
            }
            // Right-click on task text opens the edit modal
            span.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                openTaskScheduleEditor(index);
            });

            label.appendChild(checkbox);
            label.appendChild(span);

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "X";
            removeBtn.style.background = "none";
            removeBtn.style.border = "none";
            removeBtn.style.color = "#f04747";
            removeBtn.style.cursor = "pointer";
            removeBtn.setAttribute("data-index", index);
            removeBtn.onclick = removeTask;

            taskDiv.appendChild(label);
            taskDiv.appendChild(removeBtn);
            taskContainer.appendChild(taskDiv);
        });
    }

    function addTask() {
        const input = document.getElementById("new-task");
        if (!input || !input.value.trim()) return;
        tasks.push({ text: input.value.trim(), done: false });
        GM_setValue("torn_todo_tasks", JSON.stringify(tasks));
        input.value = "";
        renderTasks();
    }

    function removeTask(event) {
        const index = event.target.dataset.index;
        tasks.splice(index, 1);
        GM_setValue("torn_todo_tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function toggleTask(event) {
        const index = event.target.dataset.index;
        tasks[index].done = event.target.checked;
        GM_setValue("torn_todo_tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function openSettingsPanel() {
        let existingPanel = document.getElementById("todo-settings-panel");
        if (existingPanel) {
            existingPanel.style.display = "block"; // Open settings if it exists
            updateLastCheckedInfo();
            return;
        }
        const settingsPanel = document.createElement("div");
        settingsPanel.id = "todo-settings-panel";
        Object.assign(settingsPanel.style, {
            position: "fixed",
            bottom: "70px",
            right: "310px",
            width: "300px",
            height: "400px",
            backgroundColor: "#2c2f33",
            color: "#ffffff",
            border: "1px solid #444",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
            zIndex: "1000",
            display: "flex",
            flexDirection: "column"
        });

        settingsPanel.innerHTML = `
            <div style="flex: 0 0 auto; display: flex; justify-content: space-between; align-items: center; background-color: #23272a; padding: 5px 10px; border-radius: 8px 8px 0 0; border-bottom: 1px solid #444;">
                <span>Settings</span>
                <button id="close-settings" style="background: none; border: none; color: white; cursor: pointer;">X</button>
            </div>
            <div id="settings-body" style="flex: 1 1 auto; overflow-y: auto; padding: 10px;">
                <div id="last-checked-info" style="margin-bottom: 15px;">
                    <p style="margin: 0; font-size: 0.9em;">Last Check: <span id="last-checked-time">${formatTimestamp(lastCheckedTime)}</span></p>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="font-weight: bold; margin-bottom: 5px;">Import/Export Data</p>
                    <textarea id="import-export-text" style="width: 280px; height: 80px; resize: none; background-color: #2c2f33; color: #ffffff; border: 1px solid #444; border-radius: 4px;"></textarea>
                    <div style="display: flex; gap: 5px; margin-top: 5px;">
                        <button id="export-data" style="padding: 5px 10px; background-color: #7289da; color: white; border: none; border-radius: 4px; cursor: pointer;">Export</button>
                        <button id="copy-data" style="padding: 5px 10px; background-color: #7289da; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy</button>
                        <button id="import-data" style="padding: 5px 10px; background-color: #7289da; color: white; border: none; border-radius: 4px; cursor: pointer;">Import</button>
                    </div>
                </div>
            </div>
            <div style="flex: 0 0 auto; padding: 10px; border-top: 1px solid #444; display: flex; justify-content: flex-end;">
                <button id="save-settings" style="padding: 5px 10px; background-color: #7289da; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
            </div>
        `;
        document.body.appendChild(settingsPanel);
        document.getElementById("close-settings").onclick = () => settingsPanel.style.display = "none";
        document.getElementById("save-settings").onclick = saveSettings;
        document.getElementById("export-data").onclick = exportData;
        document.getElementById("copy-data").onclick = copyData;
        document.getElementById("import-data").onclick = importData;
    }

    function saveSettings() {
        GM_setValue("torn_todo_settings", JSON.stringify(settings));
        const settingsPanel = document.getElementById("todo-settings-panel");
        if (settingsPanel) settingsPanel.style.display = "none";
    }

    function updateLastCheckedInfo() {
        const lastCheckedElement = document.getElementById("last-checked-time");
        if (lastCheckedElement) lastCheckedElement.textContent = formatTimestamp(lastCheckedTime);
    }

    function exportData() {
        const data = {
            tasks: tasks,
            settings: settings,
            lastCheckedTime: lastCheckedTime,
        };
        document.getElementById("import-export-text").value = JSON.stringify(data, null, 2);
    }

    function copyData() {
        const text = document.getElementById("import-export-text").value;
        navigator.clipboard.writeText(text);
    }

    function importData() {
        try {
            const data = JSON.parse(document.getElementById("import-export-text").value);
            if (data.tasks) tasks = data.tasks;
            if (data.settings) settings = data.settings;
            if (data.lastCheckedTime) lastCheckedTime = data.lastCheckedTime;
            GM_setValue("torn_todo_tasks", JSON.stringify(tasks));
            GM_setValue("torn_todo_settings", JSON.stringify(settings));
            GM_setValue("last_checked_time", lastCheckedTime);
            renderTasks();
            updateLastCheckedInfo();
            alert("Data imported successfully.");
        } catch (e) {
            alert("Import failed: Invalid JSON.");
        }
    }

    // --- Modal for editing task details (text and schedule) ---
    function updateModalSchedule(modal, taskIndex) {
        const timeInput = modal.querySelector('input[type="time"]');
        const daysContainer = modal.querySelector('#schedule-days-container');
        const dayButtons = daysContainer.querySelectorAll('button');
        const newDayStates = {};
        dayButtons.forEach(btn => {
            newDayStates[btn.dataset.day] = (btn.dataset.active === "true");
        });
        tasks[taskIndex].schedule = {
            time: timeInput.value,
            days: newDayStates
        };
        GM_setValue("torn_todo_tasks", JSON.stringify(tasks));
    }

    function openTaskScheduleEditor(index) {
        // If a modal is already open, auto-save its changes and remove it
        const existingModal = document.getElementById("task-schedule-modal");
        if (existingModal && currentModalTaskIndex !== null) {
            updateModalSchedule(existingModal, currentModalTaskIndex);
            existingModal.remove();
            currentModalTaskIndex = null;
        }
        currentModalTaskIndex = index;
        const task = tasks[index];

        const modal = document.createElement("div");
        modal.id = "task-schedule-modal";
        Object.assign(modal.style, {
            position: "fixed",
            bottom: "480px",
            right: "5px",
            width: "260px",
            backgroundColor: "#2c2f33",
            color: "#ffffff",
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "20px",
            zIndex: "2000"
        });

        // Editable task content with larger input and an edit icon
        const taskContainer = document.createElement("div");
        taskContainer.style.display = "flex";
        taskContainer.style.alignItems = "center";
        taskContainer.style.marginBottom = "10px";

        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.value = task.text;
        Object.assign(taskInput.style, {
            fontSize: "16px",
            width: "100%",
            backgroundColor: "#2c2f33",
            border: "1px solid #444",
            color: "#ffffff",
            borderRadius: "4px",
            padding: "5px"
        });
        taskInput.onchange = function () {
            task.text = taskInput.value;
            GM_setValue("torn_todo_tasks", JSON.stringify(tasks));
            renderTasks();
        };

        const editIcon = document.createElement("button");
        editIcon.innerHTML = "&#9998;"; // pencil icon
        Object.assign(editIcon.style, {
            background: "none",
            border: "none",
            color: "#7289da",
            cursor: "pointer",
            fontSize: "18px",
            marginLeft: "5px"
        });
        editIcon.onclick = function () {
            taskInput.focus();
        };

        taskContainer.appendChild(taskInput);
        taskContainer.appendChild(editIcon);
        modal.appendChild(taskContainer);

        // Schedule settings
        const timeLabel = document.createElement("label");
        timeLabel.textContent = "Time (TCT):";
        modal.appendChild(timeLabel);

        const timeInput = document.createElement("input");
        timeInput.type = "time";
        timeInput.value = task.schedule && task.schedule.time ? task.schedule.time : "00:00";
        timeInput.style.marginLeft = "10px";
        Object.assign(timeInput.style, {
            backgroundColor: "#2c2f33",
            border: "1px solid #444",
            color: "#ffffff",
            borderRadius: "4px",
            padding: "5px"
        });
        timeInput.onchange = function () {
            updateModalSchedule(modal, currentModalTaskIndex);
        };
        modal.appendChild(timeInput);

        modal.appendChild(document.createElement("br"));
        modal.appendChild(document.createElement("br"));

        const daysContainer = document.createElement("div");
        daysContainer.id = "schedule-days-container";
        const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
        dayKeys.forEach((day, i) => {
            const btn = document.createElement("button");
            btn.textContent = dayLabels[i];
            btn.style.marginRight = "5px";
            btn.style.width = "30px";
            const active = task.schedule && task.schedule.days && task.schedule.days[day] ? true : false;
            btn.style.backgroundColor = active ? "#7289da" : "#444";
            btn.style.color = "#fff";
            btn.style.border = "none";
            btn.style.borderRadius = "4px";
            btn.style.cursor = "pointer";
            btn.dataset.day = day;
            btn.dataset.active = active ? "true" : "false";
            btn.onclick = function () {
                const current = btn.dataset.active === "true";
                btn.dataset.active = (!current).toString();
                btn.style.backgroundColor = (!current) ? "#7289da" : "#444";
                updateModalSchedule(modal, currentModalTaskIndex);
            };
            daysContainer.appendChild(btn);
        });
        modal.appendChild(daysContainer);

        modal.appendChild(document.createElement("br"));
        modal.appendChild(document.createElement("br"));

        const btnContainer = document.createElement("div");
        btnContainer.style.textAlign = "right";

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove Schedule";
        removeBtn.style.marginRight = "5px";
        removeBtn.style.padding = "5px 10px";
        removeBtn.style.backgroundColor = "#f04747";
        removeBtn.style.border = "none";
        removeBtn.style.borderRadius = "4px";
        removeBtn.style.cursor = "pointer";
        removeBtn.onclick = function () {
            delete tasks[currentModalTaskIndex].schedule;
            GM_setValue("torn_todo_tasks", JSON.stringify(tasks));
            modal.remove();
            currentModalTaskIndex = null;
        };
        btnContainer.appendChild(removeBtn);

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.padding = "5px 10px";
        closeBtn.style.backgroundColor = "#7289da";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "4px";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = function () {
            updateModalSchedule(modal, currentModalTaskIndex);
            modal.remove();
            currentModalTaskIndex = null;
        };
        btnContainer.appendChild(closeBtn);

        modal.appendChild(btnContainer);
        document.body.appendChild(modal);
    }

    function checkResetTime() {
        const now = new Date();
        const currentTime = `${now.getUTCHours().toString().padStart(2, "0")}:${now.getUTCMinutes().toString().padStart(2, "0")}`;
        const dayMapping = {0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat"};
        const currentDayKey = dayMapping[now.getUTCDay()];
        lastCheckedTime = now.toISOString();
        GM_setValue("last_checked_time", lastCheckedTime);

        tasks.forEach(task => {
            if (task.schedule && task.done) {
                if (currentTime === task.schedule.time && task.schedule.days && task.schedule.days[currentDayKey]) {
                    task.done = false;
                }
            }
        });
        GM_setValue("torn_todo_tasks", JSON.stringify(tasks));
        renderTasks();
        updateLastCheckedInfo();
    }

    addToggleButton();
    createTodoListWindow();
    checkResetTime();
    setInterval(checkResetTime, 60000);
})();
