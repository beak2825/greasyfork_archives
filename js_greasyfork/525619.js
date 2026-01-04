// ==UserScript==
// @name         Enhanced Wyze Group Selector & Camera Management
// @namespace    http://ptelectronics.net
// @version      2.3
// @description  Adds camera group management with persistent settings, minimizable UI, and person detection toggle for Wyze Events page
// @author       Math Shamenson
// @match        https://my.wyze.com/events*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @homepageURL  https://greasyfork.org/scripts/SCRIPT_ID
// @supportURL   https://greasyfork.org/scripts/SCRIPT_ID/feedback
// @downloadURL https://update.greasyfork.org/scripts/525619/Enhanced%20Wyze%20Group%20Selector%20%20Camera%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/525619/Enhanced%20Wyze%20Group%20Selector%20%20Camera%20Management.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Enhanced state management with validation
    class GroupManager {
        constructor() {
            this.groups = this.loadGroups();
            this.uiState = this.loadUIState();
        }

        loadGroups() {
            try {
                const stored = localStorage.getItem('cameraGroups');
                return stored ? JSON.parse(stored) : {
                    "Group 1: Back Yard": ["2CAA8E86C673", "2CAA8E09C409"],
                    "Group 2: Front Yard": ["2CAA8E59E1AA", "2CAA8E6E0638"],
                    "Group 3: Misc Cameras": ["2CAA8E778175", "2CAA8E52C9FA"]
                };
            } catch (error) {
                console.error('Error loading groups:', error);
                return {};
            }
        }

        loadUIState() {
            try {
                const stored = localStorage.getItem('cameraGroupsUIState');
                return stored ? JSON.parse(stored) : { minimized: false };
            } catch (error) {
                console.error('Error loading UI state:', error);
                return { minimized: false };
            }
        }

        saveUIState(state) {
            try {
                localStorage.setItem('cameraGroupsUIState', JSON.stringify(state));
                this.uiState = state;
            } catch (error) {
                console.error('Error saving UI state:', error);
            }
        }

        saveGroups() {
            try {
                localStorage.setItem('cameraGroups', JSON.stringify(this.groups));
            } catch (error) {
                console.error('Error saving groups:', error);
                alert('Failed to save groups. Please check console for details.');
            }
        }

        addGroup(name, cameras) {
            if (!name || !cameras || !Array.isArray(cameras)) {
                throw new Error('Invalid group data');
            }
            this.groups[name] = cameras;
            this.saveGroups();
        }

        updateGroup(oldName, newName, cameras) {
            if (!oldName || !newName || !cameras || !Array.isArray(cameras)) {
                throw new Error('Invalid group update data');
            }
            delete this.groups[oldName];
            this.groups[newName] = cameras;
            this.saveGroups();
        }

        deleteGroup(name) {
            if (!name || !this.groups[name]) {
                throw new Error('Invalid group name');
            }
            delete this.groups[name];
            this.saveGroups();
        }
    }

    // UI Component with improved styling
    class ControlPanel {
        constructor(groupManager) {
            this.groupManager = groupManager;
            this.position = this.loadPosition();
            this.createPanel();

            // Initialize minimized state from persistent storage
            if (this.groupManager.uiState.minimized) {
                this.toggleMinimize(false); // Don't save state on initial load
            }
        }

        loadPosition() {
            const stored = localStorage.getItem('controlPanelPosition');
            if (stored) {
                return JSON.parse(stored);
            }
            // Calculate initial position from right side
            const initialLeft = window.innerWidth - 260; // 250px width + 10px margin
            return { top: '50px', left: `${initialLeft}px` };
        }

        savePosition() {
            localStorage.setItem('controlPanelPosition', JSON.stringify({
                top: this.container.style.top,
                left: this.container.style.left
            }));
        }

        createPanel() {
            const existingPanel = document.getElementById('wyze-control-panel');
            if (existingPanel) existingPanel.remove();

            this.container = document.createElement('div');
            this.container.id = 'wyze-control-panel';
            this.applyStyles();
            this.setupDraggable();
            this.createContent();
            document.body.appendChild(this.container);
        }

        applyStyles() {
            Object.assign(this.container.style, {
                position: 'fixed',
                top: this.position.top,
                left: this.position.left,
                background: 'white',
                border: '2px solid #4a90e2',
                borderRadius: '8px',
                padding: '15px',
                zIndex: '10000',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '250px' // Fixed width instead of minWidth
            });
        }

        setupDraggable() {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;

            this.container.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON') return;
                isDragging = true;
                initialX = e.clientX - this.container.offsetLeft;
                initialY = e.clientY - this.container.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();

                // Calculate new position
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // Constrain to window bounds
                const maxX = window.innerWidth - this.container.offsetWidth;
                const maxY = window.innerHeight - this.container.offsetHeight;

                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                this.container.style.left = `${currentX}px`;
                this.container.style.top = `${currentY}px`;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.savePosition();
                }
            });
        }

        createContent() {
            // Header (outside of content div)
            const header = this.createHeader();
            this.container.appendChild(header);

            // Main content
            const content = document.createElement('div');
            content.id = 'control-panel-content';
            content.style.display = 'block'; // Ensure initial state is visible

            // Groups
            Object.entries(this.groupManager.groups).forEach(([groupName, cameras]) => {
                const groupElement = this.createGroupElement(groupName, cameras);
                content.appendChild(groupElement);
            });

            // Control buttons
            const controls = this.createControls();
            content.appendChild(controls);

            this.container.appendChild(content);
        }

        createHeader() {
            const header = document.createElement('div');
            header.id = 'control-panel-header';
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 10px;
                border-bottom: 1px solid #e0e0e0;
                background: #f5f5f5;
                border-radius: 6px 6px 0 0;
            `;

            const title = document.createElement('div');
            title.textContent = 'Wyze Camera Controls';
            title.style.cssText = `
                font-weight: bold;
                font-size: 16px;
                color: #4a90e2;
            `;

            const minimizeBtn = document.createElement('button');
            minimizeBtn.textContent = '−';
            minimizeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #4a90e2;
                padding: 0 5px;
            `;

            minimizeBtn.onclick = () => this.toggleMinimize();

            header.appendChild(title);
            header.appendChild(minimizeBtn);
            return header;
        }

        createGroupElement(groupName, cameras) {
            const container = document.createElement('div');
            container.style.marginBottom = '10px';

            const groupButton = document.createElement('button');
            groupButton.textContent = groupName;
            groupButton.style.cssText = `
                background: #4a90e2;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 5px;
                flex: 1;
            `;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.style.cssText = `
                background: #f5a623;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
            `;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.style.cssText = `
                background: #d0021b;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 5px;
            `;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.appendChild(groupButton);
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            groupButton.onclick = () => this.selectGroup(cameras);
            editButton.onclick = () => this.editGroup(groupName);
            deleteButton.onclick = () => this.deleteGroup(groupName);

            container.appendChild(buttonContainer);
            return container;
        }

        createControls() {
            const container = document.createElement('div');
            container.style.marginTop = '15px';

            const addGroupBtn = document.createElement('button');
            addGroupBtn.textContent = '+ Add Group';
            addGroupBtn.style.cssText = `
                background: #7ed321;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 10px;
            `;

            const togglePersonBtn = document.createElement('button');
            togglePersonBtn.textContent = 'Toggle Person Detection';
            togglePersonBtn.style.cssText = `
                background: #9013fe;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
            `;

            addGroupBtn.onclick = () => this.addGroup();
            togglePersonBtn.onclick = () => this.togglePersonDetection();

            container.appendChild(addGroupBtn);
            container.appendChild(togglePersonBtn);
            return container;
        }

        toggleMinimize(saveState = true) {
            const content = this.container.querySelector('#control-panel-content');
            const header = this.container.querySelector('#control-panel-header');
            const minimizeBtn = header.querySelector('button');
            const isMinimized = content.style.display === 'none';

            if (isMinimized) {
                content.style.display = 'block';
                minimizeBtn.textContent = '−';
                this.container.style.padding = '15px';
            } else {
                content.style.display = 'none';
                minimizeBtn.textContent = '+';
                this.container.style.padding = '0';
            }

            // Maintain the header's border radius
            header.style.borderRadius = isMinimized ? '6px' : '6px 6px 0 0';

            // Save minimized state if requested
            if (saveState) {
                this.groupManager.saveUIState({ minimized: !isMinimized });
            }
        }

        async selectGroup(cameras) {
            for (const camera of cameras) {
                const checkbox = document.querySelector(`input[name="${camera}"]`);
                if (checkbox) {
                    const parent = checkbox.closest('.MuiButtonBase-root');
                    if (parent) {
                        parent.click();
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }
            }
        }

        addGroup() {
            const name = prompt('Enter a name for the new group:');
            if (!name) return;

            const selectedCameras = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.name);

            if (selectedCameras.length === 0) {
                alert('Please select at least one camera.');
                return;
            }

            try {
                this.groupManager.addGroup(name, selectedCameras);
                this.createPanel();
            } catch (error) {
                console.error('Error adding group:', error);
                alert('Failed to add group. Please try again.');
            }
        }

        editGroup(groupName) {
            const newName = prompt('Edit group name:', groupName);
            if (!newName) return;

            const selectedCameras = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.name);

            if (selectedCameras.length === 0) {
                alert('Please select at least one camera.');
                return;
            }

            try {
                this.groupManager.updateGroup(groupName, newName, selectedCameras);
                this.createPanel();
            } catch (error) {
                console.error('Error updating group:', error);
                alert('Failed to update group. Please try again.');
            }
        }

        deleteGroup(groupName) {
            if (confirm(`Are you sure you want to delete "${groupName}"?`)) {
                try {
                    this.groupManager.deleteGroup(groupName);
                    this.createPanel();
                } catch (error) {
                    console.error('Error deleting group:', error);
                    alert('Failed to delete group. Please try again.');
                }
            }
        }

        togglePersonDetection() {
            const personButton = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.innerText.trim().toLowerCase() === 'person');

            if (personButton) {
                personButton.click();
            } else {
                alert('Person Detection button not found. Please check if the UI has changed.');
            }
        }
    }

    // Custom CSS for improved video duration text
    function enhanceVideoText() {
        const style = document.createElement('style');
        style.textContent = `
            .css-1a78lvj {
                font-size: 18px !important;
                font-weight: bold !important;
                color: #4a90e2 !important;
            }
        `;
document.head.appendChild(style);
    }

    // Initialize the application
    function initApp() {
        const groupManager = new GroupManager();
        new ControlPanel(groupManager);
        enhanceVideoText();
    }

    // Wait for page load
    if (document.readyState === 'loading') {
        window.addEventListener('load', initApp);
    } else {
        initApp();
    }
})();