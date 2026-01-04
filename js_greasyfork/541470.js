// ==UserScript==
// @name         Torn City Company Trainer Tracker (Working Version)
// @namespace    https://www.torn.com/profiles.php?XID=2302951
// @version      0.2.0
// @description  Track and manage company training in Torn City (guaranteed to work)
// @author       Obliviondrift1 [2302951]
// @match        https://www.torn.com/companies.php*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541470/Torn%20City%20Company%20Trainer%20Tracker%20%28Working%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541470/Torn%20City%20Company%20Trainer%20Tracker%20%28Working%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎯 Trainer Tracker: Starting...');

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'trainer_employees',
        RETRY_ATTEMPTS: 10,
        RETRY_DELAY: 500,
        OVERLAY_ID: 'trainer-tracker-overlay'
    };

    // Data management
    function getEmployees() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading employees:', e);
            return [];
        }
    }

    function saveEmployees(employees) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(employees));
            console.log('Employees saved:', employees.length);
        } catch (e) {
            console.error('Error saving employees:', e);
        }
    }

    // Robust initialization with multiple retry attempts
    function initializeTracker() {
        let attempts = 0;

        function tryInit() {
            attempts++;
            console.log(`🎯 Trainer Tracker: Attempt ${attempts}/${CONFIG.RETRY_ATTEMPTS}`);

            // Check if we're on the right page
            if (!window.location.href.includes('/companies.php')) {
                console.log('🎯 Trainer Tracker: Not on companies page, skipping');
                return;
            }

            // Check if document is ready
            if (document.readyState !== 'complete') {
                console.log('🎯 Trainer Tracker: Document not ready, retrying...');
                setTimeout(tryInit, CONFIG.RETRY_DELAY);
                return;
            }

            // Check if body exists
            if (!document.body) {
                console.log('🎯 Trainer Tracker: Body not found, retrying...');
                if (attempts < CONFIG.RETRY_ATTEMPTS) {
                    setTimeout(tryInit, CONFIG.RETRY_DELAY);
                }
                return;
            }

            // Try to create the tracker
            try {
                createTracker();
                console.log('🎯 Trainer Tracker: Successfully created!');
            } catch (error) {
                console.error('🎯 Trainer Tracker: Error creating tracker:', error);
                if (attempts < CONFIG.RETRY_ATTEMPTS) {
                    setTimeout(tryInit, CONFIG.RETRY_DELAY * 2);
                }
            }
        }

        // Start initialization
        tryInit();
    }

    function createTracker() {
        // Remove existing tracker
        const existing = document.getElementById(CONFIG.OVERLAY_ID);
        if (existing) {
            existing.remove();
            console.log('🎯 Trainer Tracker: Removed existing overlay');
        }

        // Create main container
        const overlay = document.createElement('div');
        overlay.id = CONFIG.OVERLAY_ID;

        // Apply styles directly to avoid CSP issues
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '350px',
            minHeight: '200px',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            border: '2px solid #444444',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '13px',
            zIndex: '2147483647', // Maximum z-index
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            overflow: 'hidden'
        };

        Object.assign(overlay.style, styles);

        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #333333;
            padding: 12px 15px;
            border-bottom: 1px solid #555555;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        `;

        const title = document.createElement('span');
        title.textContent = '🎯 Trainer Tracker';
        title.style.fontWeight = 'bold';

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            cursor: pointer;
            font-size: 16px;
            padding: 2px 6px;
            border-radius: 3px;
            background: #ff4444;
            color: white;
        `;
        closeBtn.title = 'Close Tracker';

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Create navigation
        const nav = document.createElement('div');
        nav.style.cssText = `
            display: flex;
            background: #2a2a2a;
            border-bottom: 1px solid #555555;
        `;

        const queueBtn = document.createElement('button');
        queueBtn.textContent = 'Queue';
        queueBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #0066cc;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 12px;
        `;

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add Employee';
        addBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #444444;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 12px;
        `;

        nav.appendChild(queueBtn);
        nav.appendChild(addBtn);

        // Create content area
        const content = document.createElement('div');
        content.id = 'tracker-content';
        content.style.cssText = `
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
            background: #1a1a1a;
        `;

        // Assemble the overlay
        overlay.appendChild(header);
        overlay.appendChild(nav);
        overlay.appendChild(content);

        // Add to page
        document.body.appendChild(overlay);
        console.log('🎯 Trainer Tracker: Overlay added to DOM');

        // Add event listeners
        closeBtn.addEventListener('click', () => {
            overlay.remove();
            console.log('🎯 Trainer Tracker: Closed by user');
        });

        queueBtn.addEventListener('click', () => {
            queueBtn.style.background = '#0066cc';
            addBtn.style.background = '#444444';
            showQueue(content);
        });

        addBtn.addEventListener('click', () => {
            queueBtn.style.background = '#444444';
            addBtn.style.background = '#0066cc';
            showAddForm(content);
        });

        // Make draggable
        makeDraggable(overlay, header);

        // Show queue by default
        showQueue(content);

        // Add a visible indicator that the script is working
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 5px;
            right: 5px;
            background: #00ff00;
            color: #000000;
            padding: 2px 6px;
            font-size: 10px;
            border-radius: 3px;
            z-index: 2147483646;
        `;
        indicator.textContent = 'TRACKER ACTIVE';
        document.body.appendChild(indicator);

        // Remove indicator after 3 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 3000);
    }

    function makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newLeft = Math.max(0, Math.min(startLeft + deltaX, window.innerWidth - element.offsetWidth));
            const newTop = Math.max(0, Math.min(startTop + deltaY, window.innerHeight - element.offsetHeight));

            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
            element.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    function showQueue(content) {
        const employees = getEmployees();

        let html = '<div style="color: #cccccc;">';

        if (employees.length === 0) {
            html += '<div style="text-align: center; padding: 20px; color: #888888;">No employees added yet.<br>Use "Add Employee" to get started.</div>';
        } else {
            html += '<div style="margin-bottom: 10px; font-weight: bold;">Employee Queue (' + employees.length + ')</div>';

            employees.forEach((emp, index) => {
                const remaining = Math.max(0, emp.total_training_target - emp.trainings_completed);
                const progress = emp.total_training_target > 0 ? (emp.trainings_completed / emp.total_training_target * 100).toFixed(1) : 0;
                const statusColor = remaining === 0 ? '#00ff00' : emp.status === 'In Paid Training' ? '#ffaa00' : '#00aaff';

                html += `
                    <div style="background: #333333; margin-bottom: 8px; padding: 10px; border-radius: 5px; border-left: 3px solid ${statusColor};">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>${escapeHtml(emp.torn_name)}</strong>
                            <span style="color: ${statusColor}; font-weight: bold;">${remaining} left</span>
                        </div>
                        <div style="font-size: 11px; color: #aaaaaa; margin-bottom: 8px;">
                            ID: ${escapeHtml(emp.torn_id)} | Progress: ${progress}% (${emp.trainings_completed}/${emp.total_training_target})
                        </div>
                        <div style="margin-bottom: 8px;">
                            <select class="status-select" data-index="${index}" style="width: 100%; padding: 4px; background: #222222; color: white; border: 1px solid #555555;">
                                <option value="In Rotational Queue"${emp.status === 'In Rotational Queue' ? ' selected' : ''}>In Rotational Queue</option>
                                <option value="In Paid Training"${emp.status === 'In Paid Training' ? ' selected' : ''}>In Paid Training</option>
                                <option value="Completed"${emp.status === 'Completed' ? ' selected' : ''}>Completed</option>
                            </select>
                        </div>
                        <div style="display: flex; gap: 4px;">
                            <button class="add-train-btn" data-index="${index}" style="flex: 1; padding: 5px; background: #00aa00; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 10px;">+1 Train</button>
                            <button class="edit-total-btn" data-index="${index}" style="flex: 1; padding: 5px; background: #aa6600; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 10px;">Edit Total</button>
                            <button class="remove-employee-btn" data-index="${index}" style="flex: 1; padding: 5px; background: #aa0000; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 10px;">Remove</button>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';
        content.innerHTML = html;

        // Attach event listeners for all action buttons and selects
        content.querySelectorAll('.add-train-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(btn.getAttribute('data-index'));
                addTraining(index);
            });
        });
        content.querySelectorAll('.edit-total-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(btn.getAttribute('data-index'));
                editEmployeeTotal(index);
            });
        });
        content.querySelectorAll('.remove-employee-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(btn.getAttribute('data-index'));
                removeEmployee(index);
            });
        });
        content.querySelectorAll('.status-select').forEach(sel => {
            sel.addEventListener('change', function() {
                const index = parseInt(sel.getAttribute('data-index'));
                updateEmployeeStatus(index, sel.value);
            });
        });
    }

    function showAddForm(content) {
        const html = `
            <div style="color: #cccccc;">
                <div style="margin-bottom: 15px; font-weight: bold;">Add New Employee</div>
                <form id="add-employee-form">
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaaaaa;">Torn ID:</label>
                        <input type="number" id="emp-torn-id" required style="width: 100%; padding: 8px; background: #333333; color: white; border: 1px solid #555555; border-radius: 3px;" placeholder="Enter player ID">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaaaaa;">Player Name:</label>
                        <input type="text" id="emp-torn-name" required style="width: 100%; padding: 8px; background: #333333; color: white; border: 1px solid #555555; border-radius: 3px;" placeholder="Enter player name">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaaaaa;">Training Target:</label>
                        <input type="number" id="emp-training-target" required min="1" style="width: 100%; padding: 8px; background: #333333; color: white; border: 1px solid #555555; border-radius: 3px;" placeholder="Number of trainings needed">
                    </div>
                    <button type="submit" style="width: 100%; padding: 10px; background: #0066cc; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">Add Employee</button>
                </form>
            </div>
        `;

        content.innerHTML = html;

        document.getElementById('add-employee-form').addEventListener('submit', function(e) {
            e.preventDefault();

            const tornId = document.getElementById('emp-torn-id').value.trim();
            const tornName = document.getElementById('emp-torn-name').value.trim();
            const trainingTarget = parseInt(document.getElementById('emp-training-target').value);

            if (!tornId || !tornName || !trainingTarget || trainingTarget < 1) {
                alert('Please fill in all fields correctly.');
                return;
            }

            const employees = getEmployees();

            // Check for duplicate
            if (employees.some(emp => emp.torn_id === tornId)) {
                alert('An employee with this Torn ID already exists.');
                return;
            }

            // Add new employee
            employees.push({
                torn_id: tornId,
                torn_name: tornName,
                total_training_target: trainingTarget,
                trainings_completed: 0,
                status: 'In Rotational Queue'
            });

            saveEmployees(employees);
            alert(`${tornName} has been added to the tracker!`);

            // Switch back to queue view
            const queueBtn = document.querySelector('#trainer-tracker-overlay button');
            if (queueBtn) queueBtn.click();
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Replace global window functions with local ones
    function updateEmployeeStatus(index, status) {
        const employees = getEmployees();
        if (employees[index]) {
            employees[index].status = status;
            saveEmployees(employees);
            console.log(`Updated ${employees[index].torn_name} status to: ${status}`);
        }
    }

    function addTraining(index) {
        const employees = getEmployees();
        const emp = employees[index];
        if (!emp) return;

        const add = parseInt(prompt(`Add trainings for ${emp.torn_name}:`, '1'));
        if (isNaN(add) || add < 1) return;

        emp.trainings_completed = Math.min(emp.trainings_completed + add, emp.total_training_target);
        saveEmployees(employees);

        // Refresh the display
        const content = document.getElementById('tracker-content');
        if (content) showQueue(content);
    }

    function editEmployeeTotal(index) {
        const employees = getEmployees();
        const emp = employees[index];
        if (!emp) return;

        // Show options
        const action = prompt(
            `Edit Training Target for ${emp.torn_name}:\n` +
            `1. Add To Total\n` +
            `2. Subtract From Total\n` +
            `3. Change Total\n\n` +
            `Enter 1, 2, or 3:`
        );

        if (!['1', '2', '3'].includes(action)) return;

        let value;
        switch (action) {
            case '1':
                value = parseInt(prompt('How much to add to total?', '1'));
                if (isNaN(value) || value < 1) return;
                emp.total_training_target += value;
                break;
            case '2':
                value = parseInt(prompt('How much to subtract from total?', '1'));
                if (isNaN(value) || value < 1) return;
                emp.total_training_target = Math.max(1, emp.total_training_target - value);
                emp.trainings_completed = Math.min(emp.trainings_completed, emp.total_training_target);
                break;
            case '3':
                value = parseInt(prompt('Enter new total:', emp.total_training_target));
                if (isNaN(value) || value < 1) return;
                emp.total_training_target = value;
                emp.trainings_completed = Math.min(emp.trainings_completed, value);
                break;
        }

        saveEmployees(employees);

        // Refresh the display
        const content = document.getElementById('tracker-content');
        if (content) showQueue(content);
    }

    function removeEmployee(index) {
        const employees = getEmployees();
        const emp = employees[index];
        if (!emp) return;

        if (confirm(`Remove ${emp.torn_name} from the tracker?`)) {
            employees.splice(index, 1);
            saveEmployees(employees);

            // Refresh the display
            const content = document.getElementById('tracker-content');
            if (content) showQueue(content);
        }
    }

    // Start the initialization process
    console.log('🎯 Trainer Tracker: Script loaded, initializing...');

    // Multiple initialization strategies
    if (document.readyState === 'complete') {
        initializeTracker();
    } else {
        document.addEventListener('DOMContentLoaded', initializeTracker);
        window.addEventListener('load', initializeTracker);
    }

    // Fallback initialization after a delay
    setTimeout(initializeTracker, 2000);

})();