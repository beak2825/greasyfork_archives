// ==UserScript==
// @name         Samples Check Toggle with Smart Auto-Clear
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a toggle button to activate/deactivate a smart auto-clear that triggers 2 seconds after search results appear.
// @author       Gemini
// @match        *://his.kaauh.org/lab/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546426/Samples%20Check%20Toggle%20with%20Smart%20Auto-Clear.user.js
// @updateURL https://update.greasyfork.org/scripts/546426/Samples%20Check%20Toggle%20with%20Smart%20Auto-Clear.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const TARGET_INPUT_PLACEHOLDER = 'Search by MRN / NationalId & IqamaId';
    const AUTO_CLEAR_DELAY_MS = 2000; // 2-second delay after results appear

    // Button states configuration
    const STATE_ON = {
        text: 'Auto-Clear: ON',
        color: '#28a745' // Green
    };
    const STATE_OFF = {
        text: 'Auto-Clear: OFF',
        color: '#31708f' // Blue
    };

    // --- State Management ---
    let isAutoClearActive = false; // The feature is OFF by default
    let autoClearTimer;

    // --- Core Functions ---

    function clearAllFilters() {
        console.log("Auto-clearing all filters.");
        const clearAndNotify = (inputElement) => {
            if (inputElement && inputElement.value !== '') {
                inputElement.value = '';
                const updateEvent = new Event('input', { bubbles: true });
                inputElement.dispatchEvent(updateEvent);
            }
        };
        const mainSearchInput = document.querySelector(`input[placeholder="${TARGET_INPUT_PLACEHOLDER}"]`);
        clearAndNotify(mainSearchInput);
        const agGridFilters = document.querySelectorAll('input.ag-floating-filter-input');
        agGridFilters.forEach(clearAndNotify);
    }

    // --- Manual 'Delete' key listener ---
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Delete') {
            console.log("Manual clear triggered by 'Delete' key.");
            clearTimeout(autoClearTimer);
            clearAllFilters();
        }
    });

    // --- Smart Observer to watch for grid results ---
    function setupGridObserver() {
        const gridBody = document.querySelector('.ag-center-cols-container');
        if (gridBody) {
            console.log('AG Grid found. Activating smart observer.');
            const gridObserver = new MutationObserver(() => {
                // IMPORTANT: Only run the logic if the feature is toggled ON
                if (!isAutoClearActive) {
                    return;
                }

                const firstRow = document.querySelector('.ag-row[row-index="0"]');
                if (firstRow) {
                    clearTimeout(autoClearTimer);
                    autoClearTimer = setTimeout(clearAllFilters, AUTO_CLEAR_DELAY_MS);
                } else {
                    clearTimeout(autoClearTimer);
                }
            });
            gridObserver.observe(gridBody, { childList: true });
        } else {
            setTimeout(setupGridObserver, 500);
        }
    }

    // --- UI Setup ---

    // Function to update the button's appearance based on the current state
    function updateButtonState(button) {
        const state = isAutoClearActive ? STATE_ON : STATE_OFF;
        button.textContent = state.text;
        button.style.backgroundColor = state.color;
    }

    // Initial setup observer to find the button container
    const initialObserver = new MutationObserver((mutations, obs) => {
        const buttonContainer = document.querySelector('.reset-button-container');
        if (buttonContainer) {
            addButton(buttonContainer);
            setupGridObserver();
            obs.disconnect();
        }
    });
    initialObserver.observe(document.body, { childList: true, subtree: true });

    // Function to create and add the button
    function addButton(buttonContainer) {
        if (document.getElementById('samples-check-btn')) return;

        const toggleButton = document.createElement('button');
        toggleButton.id = 'samples-check-btn';

        Object.assign(toggleButton.style, {
            transition: 'background-color 0.3s, color 0.3s',
            padding: '6px 12px', fontSize: '13px', fontWeight: 'bold',
            borderRadius: '6px', whiteSpace: 'nowrap', color: '#ffffff',
            border: '1px solid #285e79', cursor: 'pointer', marginLeft: '8px'
        });

        // Set the initial appearance
        updateButtonState(toggleButton);

        // Add the toggle logic to the click event
        toggleButton.addEventListener('click', () => {
            // 1. Flip the state
            isAutoClearActive = !isAutoClearActive;

            // 2. Update the button's look and feel
            updateButtonState(toggleButton);
            console.log(`Auto-clear is now ${isAutoClearActive ? 'ON' : 'OFF'}.`);

            // 3. If turning ON, also cancel any stray timer from a previous session
            if (!isAutoClearActive) {
                clearTimeout(autoClearTimer);
            }
            
            // 4. Always focus the search input for convenience
            const searchInput = document.querySelector(`input[placeholder="${TARGET_INPUT_PLACEHOLDER}"]`);
            if (searchInput) {
                searchInput.focus();
            }
        });

        buttonContainer.appendChild(toggleButton);
        console.log('Auto-Clear toggle button added.');
    }
})();