// ==UserScript==
// @name         YouTube Distraction Lock
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Lock YouTube with a Todo list, so you're forced into doing all your tasks before you can continue watching YouTube :)
// @author       Cryptic1526
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490189/YouTube%20Distraction%20Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/490189/YouTube%20Distraction%20Lock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
        .todo-label-large {
            font-size: 120%;
        }
    `;
    document.head.appendChild(style);

    function loadTasks() {
        const tasks = localStorage.getItem('todoTasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    function allTasksChecked() {
        const tasks = loadTasks();
        return tasks.every(task => task.completed);
    }

    function handleTaskCompletion() {
        const tasks = loadTasks();
        const taskIndex = tasks.findIndex(task => task.text === this.nextSibling.textContent);
        tasks[taskIndex].completed = this.checked;
        saveTasks(tasks);

        if (allTasksChecked()) {
            document.body.removeChild(document.querySelector('.todo-overlay'));
            localStorage.removeItem('todoTasks');

            const xButton = document.querySelector('.x-button');
            if (xButton) {
                document.body.removeChild(xButton);
            }
        }
    }

    function createAndAppendXButton() {
        const xButton = document.createElement('button');
        xButton.textContent = '❌';
        xButton.className = 'x-button'; 
        xButton.style.position = 'fixed';
        xButton.style.top = '10px';
        xButton.style.right = '10px';
        xButton.style.zIndex = '10000';
        xButton.style.fontFamily = 'Ubuntu, sans-serif'; 
        xButton.addEventListener('click', function() {
            document.body.removeChild(document.querySelector('.todo-overlay'));
            localStorage.removeItem('todoTasks');
            document.body.removeChild(xButton);
        });
        document.body.appendChild(xButton);
    }

    const todoList = document.createElement('div');
    todoList.className = 'todo-overlay';
    todoList.style.position = 'fixed';
    todoList.style.top = '0';
    todoList.style.left = '0';
    todoList.style.width = '100%';
    todoList.style.height = '100%';
    todoList.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; 
    todoList.style.color = 'white'; 
    todoList.style.display = 'flex';
    todoList.style.flexDirection = 'column';
    todoList.style.alignItems = 'center';
    todoList.style.justifyContent = 'center';
    todoList.style.zIndex = '9999';
    todoList.style.backdropFilter = 'blur(10px)'; 
    todoList.style.fontFamily = 'Ubuntu, sans-serif'; 

    const todoTitle = document.createElement('h1');
    todoTitle.textContent = 'Todo List';
    todoTitle.style.fontFamily = 'Ubuntu, sans-serif'; 
    todoTitle.style.color = 'white'; 
    todoTitle.style.padding = '15px'; 
    todoList.appendChild(todoTitle);

    const todoInput = document.createElement('input');
    todoInput.type = 'text';
    todoInput.placeholder = 'Add a task...';
    todoInput.style.fontFamily = 'Ubuntu, sans-serif'; 
    todoInput.style.width = '9%';
    todoInput.style.border = '2px solid #aaa';
    todoInput.style.borderRadius = '4px';
    todoInput.style.margin = '8px 0';
    todoInput.style.outline = 'none';
    todoInput.style.padding = '8px';
    todoInput.style.boxSizing = 'border-box';
    todoInput.style.transition = '.3s';

    todoList.appendChild(todoInput);

    todoInput.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 8px 0 black';
    });

    todoInput.addEventListener('blur', function() {
        this.style.borderColor = '#aaa';
        this.style.boxShadow = 'none';
    });

    const todoListContainer = document.createElement('div');
    todoListContainer.style.marginTop = '20px';
    todoList.appendChild(todoListContainer);

    const tasks = loadTasks();
    tasks.forEach(task => {
        const todoItem = document.createElement('input');
        todoItem.type = 'checkbox';
        todoItem.className = 'todo-item';
        todoItem.checked = task.completed;
        todoItem.addEventListener('change', handleTaskCompletion);

        const todoLabel = document.createElement('label');
        todoLabel.textContent = task.text;
        todoLabel.style.marginLeft = '5px';
        todoLabel.style.fontFamily = 'Ubuntu, sans-serif'; 
        todoLabel.className = 'todo-label-large'; 

        todoListContainer.appendChild(todoItem);
        todoListContainer.appendChild(todoLabel);
        todoListContainer.appendChild(document.createElement('br'));
    });

    todoInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && this.value.trim() !== '') {
            const todoItem = document.createElement('input');
            todoItem.type = 'checkbox';
            todoItem.className = 'todo-item';
            todoItem.addEventListener('change', handleTaskCompletion);

            const todoLabel = document.createElement('label');
            todoLabel.textContent = this.value;
            todoLabel.style.marginLeft = '5px';
            todoLabel.style.fontFamily = 'Ubuntu, sans-serif'; 
            todoListContainer.appendChild(todoItem);
            todoListContainer.appendChild(todoLabel);
            todoListContainer.appendChild(document.createElement('br'));

            const tasks = loadTasks();
            tasks.push({ text: this.value, completed: false });
            saveTasks(tasks);

            this.value = '';

            const xButton = document.querySelector('.x-button');
            if (xButton) {
                document.body.removeChild(xButton);
            }
        }
    });

    if (tasks.length === 0) {
        createAndAppendXButton();
    }

    document.body.appendChild(todoList);
})();