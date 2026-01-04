// ==UserScript==
// @name         Flowyer List View
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add button to transform tasks table into a Kanban board
// @author       Your name
// @match        https://www.flowyer.hu/tasks*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533387/Flowyer%20List%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/533387/Flowyer%20List%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Flag to track if Kanban view is active
    let kanbanViewActive = false;

    // Function to add the Kanban View button
    function addKanbanViewButton() {
        const buttonContainer = document.querySelector('.col-6.float-start');
        if (!buttonContainer) return;

        // Update the last button's classes to maintain layout
        const buttonContainers = buttonContainer.querySelectorAll('.col-sm-2.col-md-auto');
        const lastButtonContainer = buttonContainers[buttonContainers.length - 1];
        if (lastButtonContainer) {
            lastButtonContainer.className = 'col-sm-2 col-md-auto float-start pe-3 mb-1';
        }

        // Create the Kanban View button
        const newButton = document.createElement('div');
        newButton.className = 'col-sm-2 col-md-auto float-start pe-3 mb-1';
        newButton.innerHTML = `
            <button id="kanban-view-btn" type="button" class="btn btn-secondary btn-filter-custom">
                Lista nézet
            </button>
        `;
        buttonContainer.appendChild(newButton);

        // Add event handler for the Kanban View button
        const kanbanButton = newButton.querySelector('#kanban-view-btn');
        kanbanButton.addEventListener('click', toggleKanbanView);
    }

    // Create a container for the Kanban board
    function createKanbanContainer() {
        // Check if container already exists
        if (document.getElementById('kanban-container')) return;

        const tasksTable = document.getElementById('tasks');
        if (!tasksTable) return;

        const kanbanContainer = document.createElement('div');
        kanbanContainer.id = 'kanban-container';
        kanbanContainer.style.display = 'none';
        kanbanContainer.style.overflowX = 'auto';
        kanbanContainer.style.padding = '20px';
        kanbanContainer.style.fontFamily = 'Arial, sans-serif';
        kanbanContainer.style.backgroundColor = '#f9f9f9';
        kanbanContainer.style.borderRadius = '5px';
        kanbanContainer.style.marginTop = '20px';

        // Insert the container after the table
        tasksTable.parentNode.insertBefore(kanbanContainer, tasksTable.nextSibling);

        return kanbanContainer;
    }

    // Toggle between table and Kanban view
    function toggleKanbanView() {
        const tasksTable = document.getElementById('tasks');
        const tableParent = tasksTable.parentElement;
        let kanbanContainer = document.getElementById('kanban-container');

        if (!kanbanContainer) {
            kanbanContainer = createKanbanContainer();
        }

        const kanbanButton = document.getElementById('kanban-view-btn');

        if (tasksTable.style.display !== 'none') {
            // Switch to Kanban view
            kanbanViewActive = true;
            kanbanButton.textContent = 'Táblázat nézet';
            kanbanButton.classList.remove('btn-info');
            kanbanButton.classList.add('btn-secondary');

            // Hide table and show Kanban
            tasksTable.style.display = 'none';
            kanbanContainer.style.display = 'flex';

            // Create the Kanban board
            createKanbanBoard(kanbanContainer, tasksTable);

            // Hide pagination and other table controls
            const pagination = document.querySelector('.pagination-container');
            if (pagination) pagination.style.display = 'none';

        } else {
            // Switch back to table view
            kanbanViewActive = false;
            kanbanButton.textContent = 'Lista nézet';
            kanbanButton.classList.remove('btn-secondary');
            kanbanButton.classList.add('btn-info');

            // Hide Kanban and show table
            tasksTable.style.display = '';
            kanbanContainer.style.display = 'none';

            // Show pagination and other table controls
            const pagination = document.querySelector('.pagination-container');
            if (pagination) pagination.style.display = '';
        }
    }

    // Create the Kanban board
    function createKanbanBoard(container, tasksTable) {
        // Clear the container first
        container.innerHTML = '';

        // Get all rows from the table
        const rows = Array.from(tasksTable.querySelectorAll('tbody tr'));

        // Find the index of important columns
        const headerCells = tasksTable.querySelectorAll('thead th');
        let colleagueIndex = -1;
        let deadlineIndex = -1;
        let idIndex = -1;
        let clientIndex = -1;
        let subjectIndex = -1;
        let caseSubjectIndex = -1;
        let caseNumberIndex = -1;

        headerCells.forEach((cell, index) => {
            const headerText = cell.textContent.trim();
            if (headerText === 'Munkatárs') colleagueIndex = index;
            if (headerText === 'Határidő') deadlineIndex = index;
            if (headerText === 'id') idIndex = index;
            if (headerText === 'Megbízó') clientIndex = index;
            if (headerText === 'Tárgy') subjectIndex = index;
            if (headerText === 'Ügy tárgy') caseSubjectIndex = index;
            if (headerText === 'Ügyszám') caseNumberIndex = index;
        });

        if (colleagueIndex === -1 || deadlineIndex === -1) {
            console.error('Nem találhatók a szükséges oszlopok');
            return;
        }

        // Group tasks by colleague
        const colleagueGroups = {};

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const colleague = cells[colleagueIndex].textContent.trim();

            if (!colleagueGroups[colleague]) {
                colleagueGroups[colleague] = [];
            }

            colleagueGroups[colleague].push({
                id: cells[idIndex]?.textContent.trim() || '',
                client: cells[clientIndex]?.innerHTML || '', // Using innerHTML to preserve links
                subject: cells[subjectIndex]?.textContent.trim() || '',
                caseSubject: cells[caseSubjectIndex]?.textContent.trim() || '',
                caseNumber: cells[caseNumberIndex]?.innerHTML || '',
                deadline: cells[deadlineIndex]?.textContent.trim() || '',
                rowElement: row
            });
        });

        // Sort tasks by deadline (parse Hungarian date format)
        const parseHungarianDate = (dateStr) => {
            if (dateStr === '-') return new Date(9999, 11, 31); // Far future for items with no deadline

            // Hungarian format: YYYY.MM.DD
            const parts = dateStr.split('.');
            if (parts.length === 3) {
                return new Date(parts[0], parts[1] - 1, parts[2]);
            }
            return new Date(9999, 11, 31); // Default to far future if invalid
        };

        // Current date for highlighting
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Create a container for columns
        const columnsContainer = document.createElement('div');
        columnsContainer.style.display = 'flex';
        columnsContainer.style.gap = '15px';
        columnsContainer.style.overflowX = 'auto';
        columnsContainer.style.padding = '10px 0';
        container.appendChild(columnsContainer);

        // Create a column for each colleague
        Object.keys(colleagueGroups).sort().forEach(colleague => {
            // Sort tasks by deadline
            colleagueGroups[colleague].sort((a, b) => {
                return parseHungarianDate(a.deadline) - parseHungarianDate(b.deadline);
            });

            // Create column
            const column = document.createElement('div');
            column.className = 'kanban-column';
            column.dataset.colleague = colleague; // Add data attribute for updates
            column.style.minWidth = '300px';
            column.style.maxWidth = '300px';
            column.style.margin = '0 5px';
            column.style.display = 'flex';
            column.style.flexDirection = 'column';

            // Add column header
            const header = document.createElement('div');
            header.className = 'kanban-column-header';
            header.textContent = colleague;
            header.style.padding = '10px';
            header.style.backgroundColor = '#2980b9';
            header.style.color = 'white';
            header.style.fontWeight = 'bold';
            header.style.textAlign = 'center';

            // Add task count
            const taskCount = document.createElement('span');
            taskCount.className = 'task-count';
            taskCount.textContent = ` (${colleagueGroups[colleague].length})`;
            header.appendChild(taskCount);

            column.appendChild(header);

            // Add tasks
            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'kanban-tasks';
            tasksContainer.style.paddingTop = '10px';
            tasksContainer.style.flexGrow = '1';
            tasksContainer.style.overflowY = 'auto';

            colleagueGroups[colleague].forEach(task => {
                const taskCard = createTaskCard(task, currentDate, parseHungarianDate);
                tasksContainer.appendChild(taskCard);
            });

            column.appendChild(tasksContainer);
            columnsContainer.appendChild(column);
        });
    }

    // Create a task card for the Kanban board
    function createTaskCard(task, currentDate, parseHungarianDate) {
        const taskCard = document.createElement('div');
        taskCard.className = 'kanban-task';
        taskCard.dataset.taskId = task.id; // Add data attribute for updates
        taskCard.style.backgroundColor = 'white';
        taskCard.style.padding = '10px';
        taskCard.style.margin = '0 0 10px 0';
        taskCard.style.borderRadius = '3px';
        taskCard.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
        taskCard.style.transition = 'transform 0.2s';
        taskCard.style.cursor = 'pointer'; // Show pointer cursor for the entire card

        // Add hover effect
        taskCard.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });

        taskCard.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
        });

        // Highlight tasks with upcoming or past deadlines
        const deadlineDate = parseHungarianDate(task.deadline);

        if (task.deadline === '-') {
            // No deadline set
            taskCard.style.borderLeft = '4px solid #95a5a6';
        } else if (deadlineDate < currentDate) {
            // Overdue task
            taskCard.style.borderLeft = '4px solid #e74c3c';
        } else if ((deadlineDate - currentDate) <= 3 * 24 * 60 * 60 * 1000) {
            // Due within 3 days
            taskCard.style.borderLeft = '4px solid #f39c12';
        } else {
            // Regular task
            taskCard.style.borderLeft = '4px solid #2ecc71';
        }

        // Add task content
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.style.marginBottom = '10px';

        const taskId = document.createElement('div');
        taskId.style.fontSize = '12px';
        taskId.style.color = '#7f8c8d';
        taskId.style.display = 'none';
        taskId.textContent = `#${task.id}`;

        const taskClient = document.createElement('div');
        taskClient.style.fontWeight = 'bold';
        taskClient.style.marginTop = '5px';
        taskClient.innerHTML = task.client; // Using innerHTML to preserve links

        const taskCaseSubject = document.createElement('div');
        taskCaseSubject.style.fontSize = '14px';
        taskCaseSubject.style.marginTop = '5px';
        taskCaseSubject.textContent = task.caseSubject;

        const taskCaseNumber = document.createElement('div');
        taskCaseNumber.style.fontSize = '12px';
        taskCaseNumber.style.marginTop = '5px';
        taskCaseNumber.style.color = '#3498db';
        taskCaseNumber.innerHTML = task.caseNumber;

        const taskSubject = document.createElement('div');
        taskSubject.style.marginTop = '5px';
        taskSubject.style.fontSize = '13px';
        taskSubject.style.color = '#34495e';
        taskSubject.textContent = task.subject;

        const taskDeadline = document.createElement('div');
        taskDeadline.style.marginTop = '10px';
        taskDeadline.style.fontSize = '12px';

        if (task.deadline === '-') {
            taskDeadline.style.color = '#95a5a6';
            taskDeadline.textContent = 'Nincs határidő';
        } else {
            taskDeadline.style.color = deadlineDate < currentDate ? '#e74c3c' : '#7f8c8d';
            taskDeadline.textContent = `Határidő: ${task.deadline}`;
        }

        taskContent.appendChild(taskId);
        taskContent.appendChild(taskClient);
        taskContent.appendChild(taskCaseSubject);
        taskContent.appendChild(taskCaseNumber);
        taskContent.appendChild(taskSubject);
        taskContent.appendChild(taskDeadline);

        // Find the original action links from the dropdown
        const dropdownLinks = task.rowElement.querySelectorAll('.dropdown-menu .dropdown-item');

        // Find the "Megtekintés" link for whole card click
        const viewLink = Array.from(dropdownLinks).find(link =>
            link.textContent.trim() === 'Megtekintés'
        );

        // Make the entire content area clickable for view action
        taskContent.addEventListener('click', function(event) {
            event.stopPropagation();
            if (viewLink) {
                viewLink.click();
            }
        });

        // Create action buttons container
        const actionButtons = document.createElement('div');
        actionButtons.style.display = 'flex';
        actionButtons.style.gap = '10px';
        actionButtons.style.justifyContent = 'right';
        actionButtons.style.borderTop = '1px solid #eee';
        actionButtons.style.paddingTop = '10px';
        actionButtons.style.marginTop = '5px';

        // Create a small note about clicking the card to view
        const viewNote = document.createElement('div');
        viewNote.style.fontSize = '10px';
        viewNote.style.fontStyle = 'italic';
        viewNote.style.color = '#7f8c8d';
        viewNote.style.position = 'absolute';
        viewNote.style.right = '10px';
        viewNote.style.top = '10px';
        viewNote.style.opacity = '0.7';

        // Create only the three action buttons: Szerkesztés, Lezárás, Törlés
        const actionTypes = ['Szerkesztés', 'Lezárás', 'Törlés'];

        actionTypes.forEach((actionType) => {
            // Find the corresponding link by text
            const originalLink = Array.from(dropdownLinks).find(link =>
                link.textContent.trim() === actionType
            );

            if (originalLink) {
                const btn = document.createElement('button');
                btn.className = 'btn';
                btn.style.padding = '3px 8px';
                btn.style.fontSize = '12px';
                btn.textContent = actionType;

                // Style buttons according to action type
                if (actionType === 'Szerkesztés') {
                    btn.classList.add('btn-success');
                } else if (actionType === 'Lezárás') {
                    btn.classList.add('btn-warning');
                } else if (actionType === 'Törlés') {
                    btn.classList.add('btn-danger');
                }

                btn.addEventListener('click', function(event) {
                    event.stopPropagation();
                    originalLink.click();
                });

                actionButtons.appendChild(btn);
            }
        });

        taskCard.appendChild(taskContent);
        taskCard.appendChild(viewNote);
        taskCard.appendChild(actionButtons);

        taskCard.style.position = 'relative'; // For positioning the view note

        return taskCard;
    }

    // Observer to watch for changes in the table
    function setupTableObserver() {
        const tasksTable = document.getElementById('tasks');
        if (!tasksTable) return;

        // Create an observer instance
        const observer = new MutationObserver((mutations) => {
            // If the Kanban view is active, update it when table changes
            if (kanbanViewActive) {
                const kanbanContainer = document.getElementById('kanban-container');
                if (kanbanContainer) {
                    createKanbanBoard(kanbanContainer, tasksTable);
                }
            }
        });

        // Observer configuration: watch for changes to the entire table
        const config = { 
            childList: true, 
            subtree: true,
            attributes: true,
            characterData: true 
        };

        // Start observing the target node for configured mutations
        observer.observe(tasksTable, config);
    }

    // Wait for the page to load before adding the button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addKanbanViewButton();
            createKanbanContainer();
            setupTableObserver();
        });
    } else {
        addKanbanViewButton();
        createKanbanContainer();
        setupTableObserver();
    }

    // Add styles for better scrolling and button hover effects
    const style = document.createElement('style');
    style.textContent = `
        #kanban-container::-webkit-scrollbar {
            height: 8px;
        }
        #kanban-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        #kanban-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        #kanban-container::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        .task-content {
            cursor: pointer;
        }
        .kanban-task .btn {
            transition: all 0.2s;
        }
        .kanban-task .btn:hover {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
})();