// ==UserScript==
// @name         BJ's Torn PDA - Notes & To-Do List
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simple, persistent notepad and to-do list in a slide-out panel for Torn PDA.
// @author       BazookaJoe
// @match        https://www.torn.com/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/540918/BJ%27s%20Torn%20PDA%20-%20Notes%20%20To-Do%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/540918/BJ%27s%20Torn%20PDA%20-%20Notes%20%20To-Do%20List.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use-strict';

    // --- 1. CONFIGURATION & STORAGE KEYS ---
    const STORAGE_KEYS = {
        PANEL_OPEN: 'pda_notes_panel_isOpen',
        NOTES_CONTENT: 'pda_notes_content_v1',
        TODO_LIST: 'pda_todo_list_v1'
    };

    let todoItems = []; // This will hold our list of to-do objects

    // --- 2. STYLING ---
    function addStyles() {
        const styles = `
            #pda-notes-container {
                position: fixed;
                top: 70px; /* Position it high on the page */
                right: -320px; /* Start off-screen */
                width: 320px;
                z-index: 10005;
                transition: right 0.3s ease-in-out;
                font-family: Arial, sans-serif;
                color: #333;
            }
            #pda-notes-container.expanded {
                right: 0;
            }
            #pda-notes-panel {
                background: #f7f7f7;
                border: 2px solid #6c757d; /* Grey theme */
                border-right: none;
                padding: 0;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                box-shadow: -2px 2px 10px rgba(0,0,0,0.4);
                height: calc(100vh - 90px);
                display: flex;
                flex-direction: column;
            }
            #pda-notes-panel h4 {
                margin: 0; padding: 10px; font-size: 16px;
                background-color: #e9ecef; border-bottom: 1px solid #dee2e6;
                flex-shrink: 0;
            }
            .pda-notes-section {
                padding: 10px;
                border-bottom: 1px solid #dee2e6;
            }
            #pda-notes-textarea {
                width: 100%;
                height: 150px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 8px;
                font-size: 14px;
                resize: vertical;
            }
            #pda-todo-list {
                flex-grow: 1;
                overflow-y: auto;
                min-height: 100px;
                background: #fff;
                border: 1px solid #ccc;
                padding: 5px;
                margin-bottom: 10px;
            }
            .pda-todo-item {
                display: flex;
                align-items: center;
                padding: 6px;
                border-bottom: 1px solid #eee;
            }
            .pda-todo-item:last-child {
                border-bottom: none;
            }
            .pda-todo-item input[type="checkbox"] {
                margin-right: 10px;
            }
            .pda-todo-item.completed span {
                text-decoration: line-through;
                color: #888;
            }
            #pda-todo-input-area { display: flex; gap: 5px; margin-bottom: 10px; }
            #pda-todo-new-item { flex-grow: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; }
            .pda-notes-button {
                padding: 5px 10px; border: 1px solid #999;
                background-color: #ddd; border-radius: 3px; cursor: pointer;
            }

            #pda-notes-toggle {
                position: fixed;
                top: 70px; /* Match panel top */
                right: 0;
                width: 35px;
                height: 50px;
                background-color: #6c757d;
                color: white;
                border: 2px solid #6c757d;
                border-right: none;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
                z-index: 10006;
            }
        `;
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    // --- 3. CORE LOGIC ---

    function loadData() {
        // Load panel state
        if (localStorage.getItem(STORAGE_KEYS.PANEL_OPEN) === 'true') {
            $('#pda-notes-container').addClass('expanded');
            $('#pda-notes-toggle').text('»');
        }

        // Load notes
        const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES_CONTENT);
        if (savedNotes) {
            $('#pda-notes-textarea').val(savedNotes);
        }

        // Load To-Do list
        const savedTodos = localStorage.getItem(STORAGE_KEYS.TODO_LIST);
        todoItems = savedTodos ? JSON.parse(savedTodos) : [];
        renderTodoList();
    }

    function renderTodoList() {
        const listContainer = $('#pda-todo-list');
        listContainer.empty(); // Clear existing items before re-rendering

        if (todoItems.length === 0) {
            listContainer.html('<div style="color: #888; text-align: center; padding: 20px;">No to-do items yet.</div>');
            return;
        }

        todoItems.forEach((item, index) => {
            const itemEl = $(`
                <div class="pda-todo-item ${item.completed ? 'completed' : ''}" data-index="${index}">
                    <input type="checkbox" ${item.completed ? 'checked' : ''}>
                    <span></span>
                </div>
            `);
            itemEl.find('span').text(item.text); // Use .text() to prevent HTML injection
            listContainer.append(itemEl);
        });
    }

    function saveTodoList() {
        localStorage.setItem(STORAGE_KEYS.TODO_LIST, JSON.stringify(todoItems));
    }

    // --- 4. UI CREATION & EVENT HANDLERS ---
    function createPanel() {
        if (document.getElementById('pda-notes-container')) return;

        const panelHTML = `
            <div id="pda-notes-container">
                <div id="pda-notes-panel">
                    <div class="pda-notes-section">
                        <h4>Notes</h4>
                        <textarea id="pda-notes-textarea" placeholder="Your notes here..."></textarea>
                    </div>
                    <div class="pda-notes-section" style="display:flex; flex-direction:column; flex-grow: 1;">
                        <h4>To-Do List</h4>
                        <div id="pda-todo-list"></div>
                        <div id="pda-todo-input-area">
                            <input type="text" id="pda-todo-new-item" placeholder="Add a new task...">
                            <button id="pda-todo-add-btn" class="pda-notes-button">Add</button>
                        </div>
                        <button id="pda-todo-clear-btn" class="pda-notes-button">Clear Checked Items</button>
                    </div>
                </div>
            </div>
        `;
        const toggleButtonHTML = `<div id="pda-notes-toggle">N</div>`;

        $('body').append(panelHTML).append(toggleButtonHTML);

        // --- Event Handlers ---
        // Toggle panel visibility
        $('#pda-notes-toggle').on('click', function() {
            const container = $('#pda-notes-container');
            const isOpen = container.toggleClass('expanded').hasClass('expanded');
            $(this).text(isOpen ? '»' : 'N');
            localStorage.setItem(STORAGE_KEYS.PANEL_OPEN, isOpen);
        });

        // Save notes on input
        $('#pda-notes-textarea').on('input', function() {
            localStorage.setItem(STORAGE_KEYS.NOTES_CONTENT, $(this).val());
        });

        // Add a to-do item
        $('#pda-todo-add-btn').on('click', function() {
            const inputEl = $('#pda-todo-new-item');
            const newText = inputEl.val().trim();
            if (newText) {
                todoItems.push({ text: newText, completed: false });
                saveTodoList();
                renderTodoList();
                inputEl.val('').focus();
            }
        });
        // Allow adding with Enter key
        $('#pda-todo-new-item').on('keypress', function(e) {
            if (e.which === 13) { // Enter key
                $('#pda-todo-add-btn').click();
            }
        });


        // Toggle completion status of a to-do item
        $('#pda-todo-list').on('change', 'input[type="checkbox"]', function() {
            const itemDiv = $(this).closest('.pda-todo-item');
            const itemIndex = itemDiv.data('index');
            if (typeof itemIndex !== 'undefined' && todoItems[itemIndex]) {
                todoItems[itemIndex].completed = this.checked;
                itemDiv.toggleClass('completed', this.checked);
                saveTodoList();
            }
        });

        // Clear checked items
        $('#pda-todo-clear-btn').on('click', function() {
            todoItems = todoItems.filter(item => !item.completed);
            saveTodoList();
            renderTodoList();
        });
    }

    // --- 5. INITIALIZATION ---
    function main() {
        addStyles();
        createPanel();
        loadData();
    }

    // Use a timeout to ensure the Torn page is fully loaded before the script runs
    setTimeout(main, 500);

})();
