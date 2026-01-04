// ==UserScript==
// @name         Flowyer Client Status Tracker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add three-state checkboxes to client list items in Flowyer law office system
// @author       You
// @match        *://*/summary*
// @match        *://www.flowyer.hu/summary*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/542441/Flowyer%20Client%20Status%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/542441/Flowyer%20Client%20Status%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Three states for the checkbox
    const STATES = {
        EMPTY: 'empty',
        X: 'x',
        DONE: 'done'
    };

    // Icons for each state
    const STATE_ICONS = {
        [STATES.EMPTY]: '☐',
        [STATES.X]: '☒',
        [STATES.DONE]: '☑'
    };

    // CSS styles for the checkboxes
    const styles = `
        .client-status-checkbox {
            display: inline-block;
            margin-right: 8px;
            cursor: pointer;
            font-size: 24px;
            user-select: none;
            vertical-align: middle;
            color: #333;
            transition: color 0.2s ease;
        }
        .client-status-checkbox:hover {
            color: #007bff;
        }
        .client-status-checkbox.state-empty {
            color: #6c757d;
        }
        .client-status-checkbox.state-x {
            color: #dc3545;
        }
        .client-status-checkbox.state-done {
            color: #28a745;
        }
        .client-item-container {
            display: flex;
            align-items: center;
            width: 100%;
        }
        .client-item-content {
            flex: 1;
        }
    `;

    // Add CSS styles to the page
    function addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Get the current selected month
    function getCurrentMonth() {
        const monthSelect = document.querySelector('#workhoursyearmonthbox select[name="workhoursyearmonth"]');
        if (monthSelect) {
            const selectedOption = monthSelect.querySelector('option[data-select2-id]');
            if (selectedOption) {
                return selectedOption.value;
            }
            // Fallback to the first option if no selected option found
            const firstOption = monthSelect.querySelector('option');
            if (firstOption) {
                return firstOption.value;
            }
        }
        return null;
    }

    // Generate storage key for client/group status
    function getStorageKey(id, month, type = 'client') {
        return `flowyer_${type}_status_${id}_${month}`;
    }

    // Get stored status for a client/group in a specific month
    function getStoredStatus(id, month, type = 'client') {
        const key = getStorageKey(id, month, type);
        return GM_getValue(key, STATES.EMPTY);
    }

    // Store status for a client/group in a specific month
    function storeStatus(id, month, status, type = 'client') {
        const key = getStorageKey(id, month, type);
        GM_setValue(key, status);
    }

    // Get next state in the cycle
    function getNextState(currentState) {
        switch (currentState) {
            case STATES.EMPTY:
                return STATES.X;
            case STATES.X:
                return STATES.DONE;
            case STATES.DONE:
                return STATES.EMPTY;
            default:
                return STATES.EMPTY;
        }
    }

    // Create checkbox element
    function createCheckbox(id, month, type = 'client', initialState = STATES.EMPTY) {
        const checkbox = document.createElement('span');
        checkbox.className = `client-status-checkbox state-${initialState}`;
        checkbox.textContent = STATE_ICONS[initialState];
        checkbox.title = `Click to change status (Current: ${initialState})`;

        let currentState = initialState;

        checkbox.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            currentState = getNextState(currentState);
            checkbox.textContent = STATE_ICONS[currentState];
            checkbox.className = `client-status-checkbox state-${currentState}`;
            checkbox.title = `Click to change status (Current: ${currentState})`;

            // Store the new status
            storeStatus(id, month, currentState, type);
        });

        return checkbox;
    }

    // Add checkboxes to client list items
    function addCheckboxesToClients() {
        const currentMonth = getCurrentMonth();
        if (!currentMonth) {
            console.warn('Could not determine current month');
            return;
        }

        const clientBox = document.querySelector('#client-box');
        if (!clientBox) {
            console.warn('Client box not found');
            return;
        }

        const clientItems = clientBox.querySelectorAll('li[data-client-id]');

        clientItems.forEach(item => {
            // Skip items that have a groupmember div (as per requirements)
            if (item.querySelector('.groupmember')) {
                return;
            }

            const clientId = item.getAttribute('data-client-id');
            if (!clientId) {
                return;
            }

            // Check if checkbox already exists
            if (item.querySelector('.client-status-checkbox')) {
                return;
            }

            // Get stored status for this client and month
            const storedStatus = getStoredStatus(clientId, currentMonth, 'client');

            // Create checkbox
            const checkbox = createCheckbox(clientId, currentMonth, 'client', storedStatus);

            // Find the anchor element and wrap its content
            const anchor = item.querySelector('a');
            if (anchor) {
                // Create container for the checkbox and content
                const container = document.createElement('div');
                container.className = 'client-item-container';

                // Move anchor content to a content div
                const contentDiv = document.createElement('div');
                contentDiv.className = 'client-item-content';
                contentDiv.innerHTML = anchor.innerHTML;

                // Clear anchor and add container
                anchor.innerHTML = '';
                container.appendChild(checkbox);
                container.appendChild(contentDiv);
                anchor.appendChild(container);
            }
        });
    }

    // Add checkboxes to group list items
    function addCheckboxesToGroups() {
        const currentMonth = getCurrentMonth();
        if (!currentMonth) {
            console.warn('Could not determine current month');
            return;
        }

        const groupsBox = document.querySelector('#groups-box');
        if (!groupsBox) {
            console.warn('Groups box not found');
            return;
        }

        const groupItems = groupsBox.querySelectorAll('li[data-group-id]');

        groupItems.forEach(item => {
            const groupId = item.getAttribute('data-group-id');
            if (!groupId) {
                return;
            }

            // Check if checkbox already exists
            if (item.querySelector('.client-status-checkbox')) {
                return;
            }

            // Get stored status for this group and month
            const storedStatus = getStoredStatus(groupId, currentMonth, 'group');

            // Create checkbox
            const checkbox = createCheckbox(groupId, currentMonth, 'group', storedStatus);

            // Find the anchor element and wrap its content
            const anchor = item.querySelector('a');
            if (anchor) {
                // Create container for the checkbox and content
                const container = document.createElement('div');
                container.className = 'client-item-container';

                // Move anchor content to a content div
                const contentDiv = document.createElement('div');
                contentDiv.className = 'client-item-content';
                contentDiv.innerHTML = anchor.innerHTML;

                // Clear anchor and add container
                anchor.innerHTML = '';
                container.appendChild(checkbox);
                container.appendChild(contentDiv);
                anchor.appendChild(container);
            }
        });
    }

    // Add checkboxes to both clients and groups
    function addAllCheckboxes() {
        addCheckboxesToClients();
        addCheckboxesToGroups();
    }

    // Initialize the script
    function init() {
        addStyles();

        // Add checkboxes when page loads
        addAllCheckboxes();

        // Watch for changes in the month selector
        const monthSelect = document.querySelector('#workhoursyearmonthbox select[name="workhoursyearmonth"]');
        if (monthSelect) {
            monthSelect.addEventListener('change', function() {
                // Small delay to allow the page to update
                setTimeout(addAllCheckboxes, 500);
            });
        }

        // Watch for dynamic content changes (in case the lists are updated)
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // Check if client list or groups list was modified
                    const clientBox = document.querySelector('#client-box');
                    const groupsBox = document.querySelector('#groups-box');
                    if ((clientBox && (clientBox.contains(mutation.target) || mutation.target === clientBox)) ||
                        (groupsBox && (groupsBox.contains(mutation.target) || mutation.target === groupsBox))) {
                        shouldUpdate = true;
                    }
                }
            });

            if (shouldUpdate) {
                setTimeout(addAllCheckboxes, 100);
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also try to initialize after a short delay to handle dynamic content
    setTimeout(init, 1000);

})();
