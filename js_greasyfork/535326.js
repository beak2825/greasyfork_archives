// ==UserScript==
// @name         To-Do List
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A stylish dark-themed to-do list with keyboard toggle (Right Shift), due dates, cool animations, favorite tasks, and help instructions
// @author       GREGDGamer1
// @match        *://*/*
// @grant        none
// @license You can modify as long as you credit me
// @downloadURL https://update.greasyfork.org/scripts/535326/To-Do%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/535326/To-Do%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Append Google Fonts link for Fredoka
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Append Font Awesome for icons
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    fontAwesomeLink.rel = 'stylesheet';
    document.head.appendChild(fontAwesomeLink);

    // Styles for the modal (dark theme by default)
    const styles = `
        body {
            font-family: 'Fredoka', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #181818;
            color: #ffffff;
        }
        #blur-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: none;
        }
        #todo-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -100%);
            background-color: #2c2c2c;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            z-index: 1001;
            width: 300px;
            opacity: 0;
            transition: transform 0.4s ease, opacity 0.4s ease;
            display: none;
        }
        #todo-modal.show {
            display: block;
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            padding: 10px;
            border: 1px solid #444;
            margin: 5px 0;
            border-radius: 5px;
            opacity: 0;
            transform: translateX(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            cursor: pointer;
        }
        li.show {
            opacity: 1;
            transform: translateX(0);
        }
        li.fade-out {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .favorite-icon {
            cursor: pointer;
            margin-right: 10px;
        }
        .help-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 18px;
            color: #ffffff;
            transition: transform 0.3s ease, color 0.3s ease; /* Add color transition */
        }
        .help-icon:hover {
            transform: scale(1.5); /* Scale up on hover */
            color: #ffdd57; /* Change color on hover */
        }
        .help-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #333;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            z-index: 1002;
            display: none;
            width: 300px;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .help-modal.show {
            display: block;
            opacity: 1;
        }
        input, input[type="date"] {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #444;
            border-radius: 5px;
            background-color: #444;
            color: #ffffff;
            font-family: 'Fredoka', sans-serif;
        }
        button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s, transform 0.2s;
            font-family: 'Fredoka', sans-serif;
        }
        button:hover {
            transform: translateY(-2px);
        }
        button.add-task {
            background-color: #28a745;
            color: white;
        }
        button.add-task:hover {
            background-color: #218838;
        }
        button.clear-tasks {
            background-color: #dc3545;
            color: white;
            margin-top: 10px;
        }
        button.clear-tasks:hover {
            background-color: #c82333;
        }
        button.export-tasks, button.import-tasks {
            background-color: #007bff;
            color: white;
            margin-top: 10px;
        }
        button.export-tasks:hover, button.import-tasks:hover {
            background-color: #0056b3;
        }
        select {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #444;
            border-radius: 5px;
            background-color: #444;
            color: #ffffff;
            font-family: 'Fredoka', sans-serif;
        }
    `;

    // Append styles to the head
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create blur background
    const blurBackground = document.createElement('div');
    blurBackground.id = 'blur-background';
    document.body.appendChild(blurBackground);

    // Create modal
    const todoModal = document.createElement('div');
    todoModal.id = 'todo-modal';
    document.body.appendChild(todoModal);

    // Help modal
    const helpModal = document.createElement('div');
    helpModal.className = 'help-modal';
    document.body.appendChild(helpModal);
    const helpTitle = document.createElement('h3');
    helpTitle.textContent = 'Help Instructions';
    helpModal.appendChild(helpTitle);
    const helpText = document.createElement('p');
    helpText.innerHTML = `
        <strong>Instructions:</strong><br>
        1. Use the input field to add a new task.<br>
        2. Set a due date (optional) using the date picker.<br>
        3. Choose a category for your task.<br>
        4. Click the star icon to mark tasks as favorites.<br>
        5. Double-click the star in the task to edit it.(then dont click the input or else youll remove it, its automaticly focused)<br>
        6. Click on a task to remove it from the list.<br>
        7. Use the export/import buttons to backup tasks.<br>
        8. Press the right Shift key to toggle this to-do list.<br>
        9. some websites break the menu or the menu will break them
    `;
    helpModal.appendChild(helpText);
    const helpCloseButton = document.createElement('button');
    helpCloseButton.textContent = 'Close';
    helpModal.appendChild(helpCloseButton);
    helpCloseButton.onclick = () => {
        helpModal.classList.remove('show');
        helpModal.style.display = 'none';
        helpIcon.classList.remove('animate'); // Remove animation class when closed
    };

    const title = document.createElement('h2');
    title.textContent = 'To-Do List';
    todoModal.appendChild(title);

    // Help icon
    const helpIcon = document.createElement('span');
    helpIcon.className = 'help-icon';
    helpIcon.innerHTML = '?';
    helpIcon.onclick = () => {
        helpModal.classList.add('show');
        helpModal.style.display = 'block';
        helpModal.style.opacity = 1;
        helpIcon.classList.add('animate'); // Add animation class when opened
    };
    todoModal.appendChild(helpIcon);

    const todoList = document.createElement('ul');
    todoModal.appendChild(todoList);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add a new task';
    todoModal.appendChild(input);

    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    todoModal.appendChild(dueDateInput);

    const categorySelect = document.createElement('select');
    const categories = ['Work', 'Personal', 'School', 'Other'];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    todoModal.appendChild(categorySelect);

    const addButton = document.createElement('button');
    addButton.className = 'add-task';
    addButton.textContent = 'Add Task';
    todoModal.appendChild(addButton);

    const clearButton = document.createElement('button');
    clearButton.className = 'clear-tasks';
    clearButton.textContent = 'Clear All Tasks';
    todoModal.appendChild(clearButton);

    const exportButton = document.createElement('button');
    exportButton.className = 'export-tasks';
    exportButton.textContent = 'Export Tasks';
    todoModal.appendChild(exportButton);

    const importButton = document.createElement('button');
    importButton.className = 'import-tasks';
    importButton.textContent = 'Import Tasks';
    todoModal.appendChild(importButton);

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        tasks.forEach(task => addTaskToList(task.text, task.dueDate, task.category));
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = Array.from(todoList.children).map(li => {
            const text = li.querySelector('.task-text').textContent;
            const dueDate = li.querySelector('.task-date') ? li.querySelector('.task-date').textContent : '';
            const category = li.querySelector('.task-category') ? li.querySelector('.task-category').textContent : '';
            return { text, dueDate, category: category.replace(' (Category: ', '').replace(')', '') };
        });
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    // Add a task to the list
    function addTaskToList(task, dueDate, category) {
        const listItem = document.createElement('li');

        const favoriteIcon = document.createElement('i');
        favoriteIcon.className = 'favorite-icon fas fa-star'; // Font Awesome star icon
        favoriteIcon.onclick = (event) => {
            event.stopPropagation(); // Prevent task click event
            favoriteIcon.classList.toggle('fas');
            favoriteIcon.classList.toggle('far'); // Toggle filled and outlined star
            saveTasks();
        };

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task;

        const taskDate = document.createElement('span');
        taskDate.className = 'task-date';
        taskDate.textContent = dueDate ? ` (Due: ${new Date(dueDate).toLocaleDateString()})` : '';

        const taskCategory = document.createElement('span');
        taskCategory.className = 'task-category';
        taskCategory.textContent = category ? ` (Category: ${category})` : '';

        // Add click event to remove the task
        listItem.onclick = () => {
            listItem.classList.add('fade-out');
            setTimeout(() => {
                todoList.removeChild(listItem);
                saveTasks();
            }, 300);
        };

        // Add double-click event for editing tasks
        listItem.ondblclick = () => {
            const currentText = taskText.textContent;
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = currentText;
            listItem.replaceChild(editInput, taskText);

            editInput.onblur = () => {
                const newText = editInput.value.trim();
                if (newText) {
                    taskText.textContent = newText;
                    listItem.replaceChild(taskText, editInput);
                    saveTasks();
                } else {
                    listItem.replaceChild(taskText, editInput);
                }
            };

            editInput.focus();
        };

        listItem.appendChild(favoriteIcon); // Append favorite icon
        listItem.appendChild(taskText);
        listItem.appendChild(taskDate);
        listItem.appendChild(taskCategory);
        todoList.appendChild(listItem);

        // Trigger animation
        setTimeout(() => listItem.classList.add('show'), 10);

        // Save tasks to localStorage
        saveTasks();
    }

    // Event listeners
    addButton.onclick = () => {
        const taskValue = input.value.trim();
        const dueDateValue = dueDateInput.value;
        const categoryValue = categorySelect.value;
        if (taskValue) {
            addTaskToList(taskValue, dueDateValue, categoryValue);
            input.value = '';
            dueDateInput.value = '';
        }
    };

    clearButton.onclick = () => {
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
        saveTasks();
    };

    // Export tasks function
    exportButton.onclick = () => {
        const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Import tasks function
    importButton.onclick = () => {
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = '.json';
        inputFile.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const tasks = JSON.parse(e.target.result);
                        clearTasks(); // Clear current tasks
                        tasks.forEach(task => {
                            addTaskToList(task.text, task.dueDate, task.category);
                        });
                    } catch (error) {
                        alert('Error importing tasks. Please ensure the file is valid.');
                    }
                };
                reader.readAsText(file);
            }
        };
        inputFile.click();
    };

    // Function to clear tasks (for import)
    function clearTasks() {
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
        saveTasks();
    }

    // Keyboard toggle for the modal with animation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Shift' && event.code === 'ShiftRight') {
            const isVisible = todoModal.classList.toggle('show');
            blurBackground.style.display = isVisible ? 'block' : 'none';

            // Apply fade animation
            if (isVisible) {
                todoModal.style.display = 'block';
                setTimeout(() => {
                    todoModal.style.opacity = 1;
                    todoModal.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 10);
            } else {
                todoModal.style.opacity = 0;
                todoModal.style.transform = 'translate(-50%, -50%) scale(0)';
                setTimeout(() => {
                    todoModal.style.display = 'none';
                }, 400);
            }
        }
    });

    // Load existing tasks on startup
    loadTasks();

})();
// ==UserScript==
// @name         Advanced School Helper To-Do List backup
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  A stylish dark-themed to-do list with keyboard toggle (Right Shift), due dates, cool animations, right-click editing, favorite tasks, and help instructions
// @author       GREGDGamer1
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Append Google Fonts link for Fredoka
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Append Font Awesome for icons
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    fontAwesomeLink.rel = 'stylesheet';
    document.head.appendChild(fontAwesomeLink);

    // Styles for the modal (dark theme by default)
    const styles = `
        body {
            font-family: 'Fredoka', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #181818;
            color: #ffffff;
        }
        #blur-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: none;
        }
        #todo-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -100%);
            background-color: #2c2c2c;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            z-index: 1001;
            width: 300px;
            opacity: 0;
            transition: transform 0.4s ease, opacity 0.4s ease;
            display: none;
        }
        #todo-modal.show {
            display: block;
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            padding: 10px;
            border: 1px solid #444;
            margin: 5px 0;
            border-radius: 5px;
            opacity: 0;
            transform: translateX(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            cursor: pointer;
        }
        li.show {
            opacity: 1;
            transform: translateX(0);
        }
        li.fade-out {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .favorite-icon {
            cursor: pointer;
            margin-right: 10px;
        }
        .help-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 18px;
            color: #ffffff;
            transition: transform 0.3s ease, color 0.3s ease; /* Add color transition */
        }
        .help-icon:hover {
            transform: scale(1.5); /* Scale up on hover */
            color: #ffdd57; /* Change color on hover */
        }
        .help-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #333;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            z-index: 1002;
            display: none;
            width: 300px;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .help-modal.show {
            display: block;
            opacity: 1;
        }
        input, input[type="date"] {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #444;
            border-radius: 5px;
            background-color: #444;
            color: #ffffff;
            font-family: 'Fredoka', sans-serif;
        }
        button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s, transform 0.2s;
            font-family: 'Fredoka', sans-serif;
        }
        button:hover {
            transform: translateY(-2px);
        }
        button.add-task {
            background-color: #28a745;
            color: white;
        }
        button.add-task:hover {
            background-color: #218838;
        }
        button.clear-tasks {
            background-color: #dc3545;
            color: white;
            margin-top: 10px;
        }
        button.clear-tasks:hover {
            background-color: #c82333;
        }
        button.export-tasks, button.import-tasks {
            background-color: #007bff;
            color: white;
            margin-top: 10px;
        }
        button.export-tasks:hover, button.import-tasks:hover {
            background-color: #0056b3;
        }
        select {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #444;
            border-radius: 5px;
            background-color: #444;
            color: #ffffff;
            font-family: 'Fredoka', sans-serif;
        }
    `;

    // Append styles to the head
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create blur background
    const blurBackground = document.createElement('div');
    blurBackground.id = 'blur-background';
    document.body.appendChild(blurBackground);

    // Create modal
    const todoModal = document.createElement('div');
    todoModal.id = 'todo-modal';
    document.body.appendChild(todoModal);

    // Help modal
    const helpModal = document.createElement('div');
    helpModal.className = 'help-modal';
    document.body.appendChild(helpModal);
    const helpTitle = document.createElement('h3');
    helpTitle.textContent = 'Help Instructions';
    helpModal.appendChild(helpTitle);
    const helpText = document.createElement('p');
    helpText.innerHTML = `
        <strong>Instructions:</strong><br>
        1. Use the input field to add a new task.<br>
        2. Set a due date (optional) using the date picker.<br>
        3. Choose a category for your task.<br>
        4. Click the star icon to mark tasks as favorites.<br>
        5. Double-click the star in the task to edit it.(then dont click the input or else youll remove it, its automaticly focused)<br>
        6. Click on a task to remove it from the list.<br>
        7. Use the export/import buttons to backup tasks.<br>
        8. Press the right Shift key to toggle this to-do list.<br>
        9. some websites break the menu or the menu will break them
    `;
    helpModal.appendChild(helpText);
    const helpCloseButton = document.createElement('button');
    helpCloseButton.textContent = 'Close';
    helpModal.appendChild(helpCloseButton);
    helpCloseButton.onclick = () => {
        helpModal.classList.remove('show');
        helpModal.style.display = 'none';
        helpIcon.classList.remove('animate'); // Remove animation class when closed
    };

    const title = document.createElement('h2');
    title.textContent = 'To-Do List';
    todoModal.appendChild(title);

    // Help icon
    const helpIcon = document.createElement('span');
    helpIcon.className = 'help-icon';
    helpIcon.innerHTML = '?';
    helpIcon.onclick = () => {
        helpModal.classList.add('show');
        helpModal.style.display = 'block';
        helpModal.style.opacity = 1;
        helpIcon.classList.add('animate'); // Add animation class when opened
    };
    todoModal.appendChild(helpIcon);

    const todoList = document.createElement('ul');
    todoModal.appendChild(todoList);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add a new task';
    todoModal.appendChild(input);

    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    todoModal.appendChild(dueDateInput);

    const categorySelect = document.createElement('select');
    const categories = ['Work', 'Personal', 'School', 'Other'];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    todoModal.appendChild(categorySelect);

    const addButton = document.createElement('button');
    addButton.className = 'add-task';
    addButton.textContent = 'Add Task';
    todoModal.appendChild(addButton);

    const clearButton = document.createElement('button');
    clearButton.className = 'clear-tasks';
    clearButton.textContent = 'Clear All Tasks';
    todoModal.appendChild(clearButton);

    const exportButton = document.createElement('button');
    exportButton.className = 'export-tasks';
    exportButton.textContent = 'Export Tasks';
    todoModal.appendChild(exportButton);

    const importButton = document.createElement('button');
    importButton.className = 'import-tasks';
    importButton.textContent = 'Import Tasks';
    todoModal.appendChild(importButton);

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        tasks.forEach(task => addTaskToList(task.text, task.dueDate, task.category));
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = Array.from(todoList.children).map(li => {
            const text = li.querySelector('.task-text').textContent;
            const dueDate = li.querySelector('.task-date') ? li.querySelector('.task-date').textContent : '';
            const category = li.querySelector('.task-category') ? li.querySelector('.task-category').textContent : '';
            return { text, dueDate, category: category.replace(' (Category: ', '').replace(')', '') };
        });
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    // Add a task to the list
    function addTaskToList(task, dueDate, category) {
        const listItem = document.createElement('li');

        const favoriteIcon = document.createElement('i');
        favoriteIcon.className = 'favorite-icon fas fa-star'; // Font Awesome star icon
        favoriteIcon.onclick = (event) => {
            event.stopPropagation(); // Prevent task click event
            favoriteIcon.classList.toggle('fas');
            favoriteIcon.classList.toggle('far'); // Toggle filled and outlined star
            saveTasks();
        };

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task;

        const taskDate = document.createElement('span');
        taskDate.className = 'task-date';
        taskDate.textContent = dueDate ? ` (Due: ${new Date(dueDate).toLocaleDateString()})` : '';

        const taskCategory = document.createElement('span');
        taskCategory.className = 'task-category';
        taskCategory.textContent = category ? ` (Category: ${category})` : '';

        // Add click event to remove the task
        listItem.onclick = () => {
            listItem.classList.add('fade-out');
            setTimeout(() => {
                todoList.removeChild(listItem);
                saveTasks();
            }, 300);
        };

        // Add double-click event for editing tasks
        listItem.ondblclick = () => {
            const currentText = taskText.textContent;
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = currentText;
            listItem.replaceChild(editInput, taskText);

            editInput.onblur = () => {
                const newText = editInput.value.trim();
                if (newText) {
                    taskText.textContent = newText;
                    listItem.replaceChild(taskText, editInput);
                    saveTasks();
                } else {
                    listItem.replaceChild(taskText, editInput);
                }
            };

            editInput.focus();
        };

        listItem.appendChild(favoriteIcon); // Append favorite icon
        listItem.appendChild(taskText);
        listItem.appendChild(taskDate);
        listItem.appendChild(taskCategory);
        todoList.appendChild(listItem);

        // Trigger animation
        setTimeout(() => listItem.classList.add('show'), 10);

        // Save tasks to localStorage
        saveTasks();
    }

    // Event listeners
    addButton.onclick = () => {
        const taskValue = input.value.trim();
        const dueDateValue = dueDateInput.value;
        const categoryValue = categorySelect.value;
        if (taskValue) {
            addTaskToList(taskValue, dueDateValue, categoryValue);
            input.value = '';
            dueDateInput.value = '';
        }
    };

    clearButton.onclick = () => {
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
        saveTasks();
    };

    // Export tasks function
    exportButton.onclick = () => {
        const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Import tasks function
    importButton.onclick = () => {
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = '.json';
        inputFile.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const tasks = JSON.parse(e.target.result);
                        clearTasks(); // Clear current tasks
                        tasks.forEach(task => {
                            addTaskToList(task.text, task.dueDate, task.category);
                        });
                    } catch (error) {
                        alert('Error importing tasks. Please ensure the file is valid.');
                    }
                };
                reader.readAsText(file);
            }
        };
        inputFile.click();
    };

    // Function to clear tasks (for import)
    function clearTasks() {
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
        saveTasks();
    }

    // Keyboard toggle for the modal with animation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Shift' && event.code === 'ShiftRight') {
            const isVisible = todoModal.classList.toggle('show');
            blurBackground.style.display = isVisible ? 'block' : 'none';

            // Apply fade animation
            if (isVisible) {
                todoModal.style.display = 'block';
                setTimeout(() => {
                    todoModal.style.opacity = 1;
                    todoModal.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 10);
            } else {
                todoModal.style.opacity = 0;
                todoModal.style.transform = 'translate(-50%, -50%) scale(0)';
                setTimeout(() => {
                    todoModal.style.display = 'none';
                }, 400);
            }
        }
    });

    // Load existing tasks on startup
    loadTasks();

})();
