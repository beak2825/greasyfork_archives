// ==UserScript==
// @name         Google Classroom Checklist (External Checkboxes)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Add persistent checkboxes outside clickable stream items
// @author       github.com/brodante
// @match        https://classroom.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535826/Google%20Classroom%20Checklist%20%28External%20Checkboxes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535826/Google%20Classroom%20Checklist%20%28External%20Checkboxes%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'classroomCheckboxesV3';
    const CHECKBOX_CLASS = 'external-checkbox-gc';
    const CONTAINER_CLASS = 'checkbox-container-gc';

    function initializeCheckboxes() {
            // Look for parent elements with stable structure
            const streamItems = document.querySelectorAll('[role="main"] div[class*="qhnNic"]:not(.processed)');

        streamItems.forEach(item => {
            //if (item.previousElementSibling?.classList?.contains(CONTAINER_CLASS)) return;

            // Create container for checkbox + stream item
            const container = document.createElement('div');
            container.className = CONTAINER_CLASS;
            container.style.display = 'flex';
            container.style.alignItems = 'flex-start';
            container.style.gap = '10px';
            container.style.marginBottom = '16px';
            container.style.width = '100%'; // ⭐ New line ⭐

            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = CHECKBOX_CLASS;
            checkbox.style.marginTop = '3px';
            checkbox.style.cursor = 'pointer';
            checkbox.style.flexShrink = '0';

            // Get unique ID
            const streamId = item.getAttribute('data-stream-item-id');

            // Load saved state
            //const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || {};
            //checkbox.checked = savedData[streamId] || false;
            const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            checkbox.checked = savedData[streamId] || false;
            // Save state on change
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
                data[streamId] = this.checked;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            });

            // Assemble and insert
            container.appendChild(checkbox);
            item.parentNode.insertBefore(container, item);
            container.appendChild(item);

            // Mark as processed
            item.classList.add('processed');
        });
    }

    // MutationObserver configuration
    const observer = new MutationObserver(mutations => {
        initializeCheckboxes();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    initializeCheckboxes();

    // Add styling
    const style = document.createElement('style');
    style.textContent = `
        .${CHECKBOX_CLASS} {
        transform: scale(1.4);
        accent-color: #1a73e8;
        flex-shrink: 0; /* Prevents checkbox from shrinking */
    }
    .${CONTAINER_CLASS} {
        width: 100%; /* Ensures container spans full width */
    }
    .${CONTAINER_CLASS} > div.qhnNic.LBlAUc {
        flex-grow: 1; /* Makes stream item expand to fill space */
        min-width: 0; /* Fixes flex overflow issues */
    }
    .${CONTAINER_CLASS}:has(.${CHECKBOX_CLASS}:checked) div.qhnNic {
        opacity: 0.6;
        background: #f8f9fa;
        border-radius: 8px;
    }
    `;
    document.head.appendChild(style);
})();