// ==UserScript==
// @name         AIUncensored Text Generation Blocker
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Disables and resets text generation counting on aiuncensored.info
// @author       anechointhedark
// @match        https://www.aiuncensored.info/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540371/AIUncensored%20Text%20Generation%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/540371/AIUncensored%20Text%20Generation%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject CSS for the hovering icon and the toggle switch
    GM_addStyle(`
        /* Styles for the main settings icon */
        .aiu-settings-icon {
            position: fixed;
            top: 20px;
            right: 20px;
            font-size: 30px;
            cursor: pointer;
            z-index: 10000; /* Ensure it stays on top */
            background-color: #333;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            color: white; /* Color of the gear icon */
            transition: background-color 0.3s ease;
        }

        .aiu-settings-icon:hover {
            background-color: #555;
        }

        /* Styles for the settings panel that pops out */
        .aiu-settings-panel {
            position: fixed;
            top: 70px; /* Position below the icon */
            right: 20px;
            background-color: #222;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: none; /* Hidden by default */
            flex-direction: column;
            align-items: flex-start;
            color: white;
            font-family: 'Inter', Arial, sans-serif; /* Consistent font */
            min-width: 200px;
        }

        .aiu-settings-panel.active {
            display: flex; /* Show when active */
        }

        /* Styles for the toggle switch container */
        .aiu-toggle-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            width: 100%;
            justify-content: space-between; /* Space out label and switch */
        }

        .aiu-toggle-container label {
            font-size: 16px;
            cursor: pointer;
            user-select: none; /* Prevent text selection */
        }

        /* The switch itself - the box around the slider */
        .aiu-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 24px;
        }

        /* Hide default HTML checkbox */
        .aiu-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* The slider (the colored track) */
        .aiu-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 24px; /* Rounded track */
        }

        /* The slider 'thumb' (the white circle) */
        .aiu-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 50%; /* Circular thumb */
        }

        /* When the input is checked, change background color of the slider */
        input:checked + .aiu-slider {
            background-color: #ff9800; /* Orange color from the website's theme */
        }

        /* Focus style for accessibility */
        input:focus + .aiu-slider {
            box-shadow: 0 0 1px #ff9800;
        }

        /* Move the slider thumb when checked */
        input:checked + .aiu-slider:before {
            -webkit-transform: translateX(16px);
            -ms-transform: translateX(16px);
            transform: translateX(16px);
        }
    `);

    // 2. Create UI Elements and append to the body
    const settingsIcon = document.createElement('div');
    settingsIcon.classList.add('aiu-settings-icon');
    settingsIcon.innerHTML = '⚙️'; // Gear icon
    document.body.appendChild(settingsIcon);

    const settingsPanel = document.createElement('div');
    settingsPanel.classList.add('aiu-settings-panel');
    document.body.appendChild(settingsPanel);

    const toggleContainer = document.createElement('div');
    toggleContainer.classList.add('aiu-toggle-container');
    settingsPanel.appendChild(toggleContainer);

    const toggleLabelText = document.createElement('label');
    toggleLabelText.textContent = 'Disable Generation Counting';
    toggleLabelText.htmlFor = 'aiu-disable-counting'; // Link label to input

    const toggleSwitchWrapper = document.createElement('label');
    toggleSwitchWrapper.classList.add('aiu-switch');

    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.id = 'aiu-disable-counting'; // Unique ID for the input

    const toggleSlider = document.createElement('span');
    toggleSlider.classList.add('aiu-slider');

    toggleSwitchWrapper.appendChild(toggleInput);
    toggleSwitchWrapper.appendChild(toggleSlider);
    toggleContainer.appendChild(toggleLabelText); // Add text label
    toggleContainer.appendChild(toggleSwitchWrapper); // Add the actual switch

    // 3. Toggle Logic: Load, save, and apply state
    const DISABLE_COUNTING_KEY = 'aiu_disable_counting';
    let disableCounting = GM_getValue(DISABLE_COUNTING_KEY, false); // Get saved state, default to false

    toggleInput.checked = disableCounting; // Set initial toggle state

    /**
     * Finds the HTML elements displaying the generation counts.
     * This function attempts to locate the numerical counters by searching for their
     * associated text labels ("Total Text Generations" and "Today's Text Generations")
     * and then looking for preceding sibling elements or children within the same parent
     * that contain only numbers.
     * @returns {HTMLElement[]} An array of HTML elements containing the counts.
     */
    function findCountElements() {
        const countElements = [];
        const labels = [
            'Total Text Generations',
            "Today's Text Generations"
        ];

        labels.forEach(labelText => {
            // Find all elements that contain the specific label text
            const potentialLabelElements = Array.from(document.querySelectorAll('div, span, p'))
                .filter(el => el.textContent.includes(labelText));

            potentialLabelElements.forEach(labelEl => {
                // Heuristic 1: Check if the number is a direct preceding sibling
                if (labelEl.previousElementSibling && /^\d+$/.test(labelEl.previousElementSibling.textContent.trim())) {
                    countElements.push(labelEl.previousElementSibling);
                } else if (labelEl.parentNode) {
                    // Heuristic 2: Check children of the same parent
                    // This covers cases where the number is a sibling of a wrapper around the label
                    // or where both are children of a common container.
                    for (const child of labelEl.parentNode.children) {
                        // Ensure it's not the label element itself and contains only digits (short numbers)
                        if (child !== labelEl && /^\d+$/.test(child.textContent.trim()) && child.textContent.trim().length <= 5) {
                            countElements.push(child);
                            break; // Found the number for this label, move to next label
                        }
                    }
                }
            });
        });
        // Return only unique elements in case of overlapping matches
        return [...new Set(countElements)];
    }

    /**
     * Applies the counting state based on the toggle.
     * If disableCounting is true, all found count elements are set to '0'.
     */
    function applyCountingState() {
        const countElements = findCountElements();
        if (disableCounting) {
            countElements.forEach(el => {
                el.textContent = '0';
            });
        }
        // If not disabled, we do nothing; the original site script handles the counts.
    }

    // Event listener for toggle change: update state and apply changes
    toggleInput.addEventListener('change', () => {
        disableCounting = toggleInput.checked;
        GM_setValue(DISABLE_COUNTING_KEY, disableCounting); // Save state
        applyCountingState(); // Immediately apply changes
    });

    // Event listener for settings icon click: show/hide the panel
    settingsIcon.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
    });

    // Event listener to close the panel when clicking outside of it
    document.addEventListener('click', (event) => {
        // If the click is outside the panel and icon, and the panel is active
        if (!settingsPanel.contains(event.target) && !settingsIcon.contains(event.target) && settingsPanel.classList.contains('active')) {
            settingsPanel.classList.remove('active');
        }
    });

    // 4. MutationObserver to handle dynamic updates on the page
    const observerConfig = {
        childList: true,      // Observe additions/removals of children
        subtree: true,        // Observe changes in all descendants
        characterData: true   // Observe changes to text content of nodes
    };

    const observer = new MutationObserver((mutationsList, observer) => {
        // If the counting disable is active, re-apply the 0s on any DOM change
        if (disableCounting) {
            applyCountingState();
        }
    });

    // Start observing the entire document body for changes
    observer.observe(document.body, observerConfig);

    // 5. Initial application of the counting state when the DOM is ready
    if (document.readyState === 'loading') {
        // If the DOM is not yet fully loaded, wait for it
        document.addEventListener('DOMContentLoaded', applyCountingState);
    } else {
        // Otherwise, apply immediately
        applyCountingState();
    }

})();
