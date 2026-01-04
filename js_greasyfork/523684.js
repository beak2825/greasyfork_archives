// ==UserScript==
// @name         Pixifi Master Tools
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Creates a single draggable window for tools. Other scripts can register their tools here.
// @match        https://www.pixifi.com/admin/*
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523684/Pixifi%20Master%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/523684/Pixifi%20Master%20Tools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MASTER_TOOL_NAME = 'Pixifi Tools (Beta)';

    // Create a global object to store MasterTools functionality.
    // This allows child scripts to call `window.MasterTools.registerTool(...)`
    window.MasterTools = {
        container: null,
        tools: [],
        // 1) Start minimized by default
        isMinimized: true,

        /**
         * Initialize the master container, if not already created.
         */
        initContainer() {
            if (this.container) return this.container;

            const container = document.createElement('div');
            container.id = 'pixifiMasterToolsContainer';

            // 2) Set default position to bottom-left
            Object.assign(container.style, {
                position: 'fixed',
                bottom: '0px',
                left: '0px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
                zIndex: '10000',
                fontFamily: 'Arial, sans-serif',
                cursor: 'grab',
                minWidth: '220px'
            });

            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            // Draggable logic
            container.addEventListener('mousedown', (e) => {
                // Only start dragging if the click is NOT on our minimize/expand button
                if (e.target.id === 'masterToolsToggleBtn') return;
                isDragging = true;
                // Use the current offset when mouse is pressed
                offsetX = e.clientX - container.offsetLeft;
                offsetY = e.clientY - container.offsetTop;
                container.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                // 3) As soon as we move, un-pin bottom and switch to top-based positioning
                container.style.bottom = 'unset';
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                container.style.cursor = 'grab';
            });

            // ------------------------------------------
            // HEADER (Title + Minimize/Expand button)
            // ------------------------------------------
            const header = document.createElement('div');
            Object.assign(header.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
            });

            // Title text
            const title = document.createElement('span');
            title.innerText = MASTER_TOOL_NAME;
            Object.assign(title.style, {
                fontWeight: 'bold',
                fontSize: '14px'
            });
            header.appendChild(title);

            // Minimize / Expand button (using + or -)
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'masterToolsToggleBtn';
            // 4) Since we start minimized, set initial button text to "+"
            toggleBtn.innerText = '+';
            Object.assign(toggleBtn.style, {
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: '#333',
                border: '1px solid #ccc',
                borderRadius: '3px',
                padding: '0 5px',
                fontSize: '14px',
                marginLeft: '10px'
            });

            toggleBtn.addEventListener('click', () => {
                this.isMinimized = !this.isMinimized;
                this.toggleToolsDisplay();
                toggleBtn.innerText = this.isMinimized ? '+' : '-';
            });

            header.appendChild(toggleBtn);
            container.appendChild(header);

            // This div will hold all the tool containers
            const toolsArea = document.createElement('div');
            toolsArea.id = 'masterToolsArea';
            container.appendChild(toolsArea);

            document.body.appendChild(container);
            this.container = container;

            // 5) Immediately call toggleToolsDisplay() so it starts hidden
            this.toggleToolsDisplay();

            return container;
        },

        /**
         * Toggle visibility for the tools area when minimized/expanded.
         */
        toggleToolsDisplay() {
            const toolsArea = document.getElementById('masterToolsArea');
            if (!toolsArea) return;
            toolsArea.style.display = this.isMinimized ? 'none' : 'block';
        },

        /**
         * Register a tool (with domain matching and a render function).
         */
        registerTool(toolObj) {
            this.tools.push(toolObj);
            this.renderTool(toolObj);
        },

        /**
         * Render a single tool if the domain matches.
         */
        renderTool(toolObj) {
            const currentURL = window.location.href;
            if (!toolObj.domainRegex.test(currentURL)) {
                return;
            }

            const container = this.initContainer();
            const toolsArea = document.getElementById('masterToolsArea');
            if (!toolsArea) return;

            // Create a sub-container for this tool
            const toolContainer = document.createElement('div');
            toolContainer.style.marginTop = '10px';

            // Optional: Add a label for clarity
            const title = document.createElement('h4');
            title.innerText = toolObj.name;
            title.style.margin = '5px 0';
            toolContainer.appendChild(title);

            // Call the tool's render function
            toolObj.render(toolContainer);

            // Append the tool's UI to the master container's tools area
            toolsArea.appendChild(toolContainer);
        },

        /**
         * Rerun domain checks if user navigates to another page
         * without reloading.
         */
        rerenderAllTools() {
            this.initContainer();
            const toolsArea = document.getElementById('masterToolsArea');
            if (toolsArea) {
                toolsArea.innerHTML = '';
            }
            this.tools.forEach(tool => this.renderTool(tool));
        }
    };

    // Initialize container once (so it's visible).
    window.MasterTools.initContainer();
})();