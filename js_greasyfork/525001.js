// ==UserScript==
// @name        LinkedIn Job Visibility Settings; year, job status highlight
// @namespace   Violentmonkey Scripts
// @match       https://www.linkedin.com/jobs/search/*
// @match       https://www.glassdoor.ca/Job/*
// @match       https://ca.indeed.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0
// @author      LAMSTREAM
// @description 11/13/2024, 5:53:40 PM
// @downloadURL https://update.greasyfork.org/scripts/525001/LinkedIn%20Job%20Visibility%20Settings%3B%20year%2C%20job%20status%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/525001/LinkedIn%20Job%20Visibility%20Settings%3B%20year%2C%20job%20status%20highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define colors for each status
    const statusColors = { viewed: 'red',
                          applied: 'green',
                          promoted: 'purple',
                          year: 'red' };

    // Initialize settings with stored values or defaults
    const settings = {
        hideViewed: GM_getValue('hideViewed', true),
        hideApplied: GM_getValue('hideApplied', true),
        hidePromoted: GM_getValue('hidePromoted', true),
        panelPosition: GM_getValue('panelPosition', { x: 20, y: 20 }),
        isCollapsed: GM_getValue('isCollapsed', false)
    };

    // Create and style the settings panel
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: ${settings.panelPosition.y}px;
            left: ${settings.panelPosition.x}px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: system-ui, -apple-system, sans-serif;
            cursor: move;
            min-width: 200px;
            user-select: none;
        `;

        // Header container
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: move;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Job Visibility Settings';
        title.style.margin = '0';
        title.style.flex = '1';

        // Collapse/Expand button
        const collapseBtn = document.createElement('button');
        collapseBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 20px;
            padding: 0 5px;
            margin-left: 10px;
        `;
        collapseBtn.textContent = settings.isCollapsed ? '▼' : '▲';
        collapseBtn.title = settings.isCollapsed ? 'Expand' : 'Collapse';

        header.appendChild(title);
        header.appendChild(collapseBtn);
        panel.appendChild(header);

        // Content container
        const content = document.createElement('div');
        content.style.display = settings.isCollapsed ? 'none' : 'block';

        // Create toggle switches for each setting
        const options = [
            { key: 'hideViewed', label: 'Hide Viewed', color: statusColors.viewed },
            { key: 'hideApplied', label: 'Hide Applied', color: statusColors.applied },
            { key: 'hidePromoted', label: 'Hide Promoted', color: statusColors.promoted }
        ];

        options.forEach(({ key, label, color }) => {
            const container = document.createElement('div');
            container.style.cssText = `
                margin: 10px 0;
                padding: 8px;
                border-radius: 4px;
                background: ${color}15;
                border: 1px solid ${color}40;
            `;

            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.id = key;
            toggle.checked = settings[key];
            toggle.style.marginRight = '8px';

            const labelElement = document.createElement('label');
            labelElement.htmlFor = key;
            labelElement.textContent = label;
            labelElement.style.color = color;
            labelElement.style.fontWeight = 'bold';

            toggle.addEventListener('change', (e) => {
                settings[key] = e.target.checked;
                GM_setValue(key, e.target.checked);
                hideListItems();
            });

            container.appendChild(toggle);
            container.appendChild(labelElement);
            content.appendChild(container);
        });

        panel.appendChild(content);

        // Make panel draggable
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - settings.panelPosition.x;
            initialY = e.clientY - settings.panelPosition.y;
            isDragging = true;
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Update position
            settings.panelPosition = { x: currentX, y: currentY };
            panel.style.left = `${currentX}px`;
            panel.style.top = `${currentY}px`;
        }

        function dragEnd() {
            if (!isDragging) return;

            isDragging = false;
            GM_setValue('panelPosition', settings.panelPosition);
        }

        // Handle collapse/expand
        collapseBtn.addEventListener('click', () => {
            settings.isCollapsed = !settings.isCollapsed;
            content.style.display = settings.isCollapsed ? 'none' : 'block';
            collapseBtn.textContent = settings.isCollapsed ? '▼' : '▲';
            collapseBtn.title = settings.isCollapsed ? 'Expand' : 'Collapse';
            GM_setValue('isCollapsed', settings.isCollapsed);
        });

        document.body.appendChild(panel);
    }

    // Function to hide li elements and color the status text
    const hideListItems = () => {
        const elements = document.querySelectorAll('.job-card-container__footer-item');
        elements.forEach(element => {
            const text = element.innerText;

            // Color the status text based on type
            if (text.includes('Viewed')) {
                element.style.color = statusColors.viewed;
                if (settings.hideViewed) hideFromAncestor(element);
            }
            else if (text.includes('Applied')) {
                element.style.color = statusColors.applied;
                if (settings.hideApplied) hideFromAncestor(element);
            }
            else if (text.includes('Promoted')) {
                element.style.color = statusColors.promoted;
                if (settings.hidePromoted) hideFromAncestor(element);
            }
        });
    };

    // Function to hide the ancestor li element
    const hideFromAncestor = (element) => {
        let liElement = element.parentElement.closest('li');
        if (liElement) {
            liElement.style.display = 'none';
        }
    };

  // Function to highlight the word "year" in text content
const highlightYear = () => {
    const elements = [...document.querySelectorAll('.jobs-search__job-details--wrapper'), ...document.querySelectorAll('[class^="JobDetails_jobDescription"]'), ...document.querySelectorAll('#jobDescriptionText') ]
    observer.disconnect()
    elements.forEach(element => {
        // Get all text nodes within the element, including nested ones
        const walk = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walk.nextNode()) {
            textNodes.push(node);
        }

        // Process each text node
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            if (/(year|years)/i.test(text)) {
                const span = document.createElement('span');
                span.innerHTML = text.replace(/(years|year)/gi, '<span style="color: red">$1</span>');
                textNode.parentNode.replaceChild(span, textNode);
            }
        });
    });

    // Observe changes in the DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
};

    const highlightCurrentTab = () => {
    observer.disconnect(); // Temporarily stop observing mutations

    const items = document.querySelectorAll('[class*="JobsList_jobListItem"]'); // Get all job list items

    items.forEach(item => {
        const classList = item.className; // Get full class name as string
        if (classList.includes("JobsList_selected")) {
            item.classList.add("highlight"); // Add highlight if selected
        } else {
            item.classList.remove("highlight"); // Remove highlight if not selected
        }
    });

    observer.observe(document.body, { childList: true, subtree: true }); // Resume observing
};



    // Observe changes in the DOM to apply the filtering dynamically
    const observer = new MutationObserver((mutations) => {
        hideListItems();
        highlightYear();
        highlightCurrentTab();
    });

    // Observe changes in the DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Initial setup
    createSettingsPanel();
    hideListItems();
    highlightYear();
    highlightCurrentTab()

    setTimeout(() => {
    const style = document.createElement("style");
    style.textContent = `
        body .highlight {
            position: relative !important;
        }
        body .highlight::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(144, 238, 144, 0.5) !important;
            pointer-events: none;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
}, 100);

})();