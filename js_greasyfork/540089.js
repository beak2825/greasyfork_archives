// ==UserScript==
// @name         Simple Dark Mode Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a toggle button to enable/disable dark mode on any website.
// @author       Agnibin
// @match        *://*/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/540089/Simple%20Dark%20Mode%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/540089/Simple%20Dark%20Mode%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // You can customize these values
    const TOGGLE_BUTTON_ID = 'dark-mode-toggle-button';
    const BODY_DARK_CLASS = 'dark-mode-active'; // Class added to <body> when dark mode is on
    const STORAGE_KEY = 'darkModeEnabled'; // Key for storing preference

    // --- Injected CSS for Dark Mode ---
    // This CSS will be applied when dark mode is active.
    // You can customize these styles to fit your needs, but these provide a basic dark theme.
    const darkThemeCSS = `
        body.${BODY_DARK_CLASS} {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        body.${BODY_DARK_CLASS} h1,
        body.${BODY_DARK_CLASS} h2,
        body.${BODY_DARK_CLASS} h3,
        body.${BODY_DARK_CLASS} h4,
        body.${BODY_DARK_CLASS} h5,
        body.${BODY_DARK_CLASS} h6 {
            color: #f0f0f0 !important;
        }

        body.${BODY_DARK_CLASS} a {
            color: #8ab4f8 !important; /* Lighter blue for links */
        }

        body.${BODY_DARK_CLASS} p,
        body.${BODY_DARK_CLASS} span,
        body.${BODY_DARK_CLASS} div,
        body.${BODY_DARK_CLASS} li,
        body.${BODY_DARK_CLASS} td,
        body.${BODY_DARK_CLASS} th {
            color: #c0c0c0 !important;
        }

        body.${BODY_DARK_CLASS} input,
        body.${BODY_DARK_CLASS} textarea,
        body.${BODY_DARK_CLASS} select {
            background-color: #333 !important;
            color: #e0e0e0 !important;
            border-color: #555 !important;
        }

        body.${BODY_DARK_CLASS} button {
            background-color: #444 !important;
            color: #e0e0e0 !important;
            border-color: #666 !important;
        }

        /* Generic background/text color for elements that might not inherit */
        body.${BODY_DARK_CLASS} * {
            background-color: inherit !important; /* Allow most elements to inherit background */
            color: inherit !important; /* Allow most elements to inherit text color */
        }
    `;

    // --- Toggle Button CSS ---
    const toggleButtonCSS = `
        #${TOGGLE_BUTTON_ID} {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #28a745; /* Green color for the button */
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            z-index: 99999; /* Ensure it's above other elements */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease, transform 0.2s ease;
            font-family: 'Inter', sans-serif; /* Using Inter font */
        }

        #${TOGGLE_BUTTON_ID}:hover {
            background-color: #218838; /* Darker green on hover */
            transform: translateY(-2px); /* Slight lift effect */
        }

        #${TOGGLE_BUTTON_ID}:active {
            background-color: #1e7e34; /* Even darker green on click */
            transform: translateY(0);
        }

        /* Style for the button when dark mode is ON */
        body.${BODY_DARK_CLASS} #${TOGGLE_BUTTON_ID} {
            background-color: #dc3545; /* Red color when dark mode is active */
        }

        body.${BODY_DARK_CLASS} #${TOGGLE_BUTTON_ID}:hover {
            background-color: #c82333; /* Darker red on hover */
        }
    `;

    // --- Function to apply/remove dark mode ---
    function applyDarkMode(enable) {
        if (enable) {
            document.body.classList.add(BODY_DARK_CLASS);
            toggleButton.textContent = 'Disable Dark Mode';
        } else {
            document.body.classList.remove(BODY_DARK_CLASS);
            toggleButton.textContent = 'Enable Dark Mode';
        }
        // Save the preference
        GM_setValue(STORAGE_KEY, enable);
    }

    // --- Create and append the toggle button ---
    const toggleButton = document.createElement('button');
    toggleButton.id = TOGGLE_BUTTON_ID;
    document.body.appendChild(toggleButton);

    // --- Add event listener to the button ---
    toggleButton.addEventListener('click', () => {
        const currentMode = document.body.clas_sList.contains(BODYDARK_CLASS);
        applyDarkMode(!currentMode); // Toggle the mode
    });

    // --- Apply initial styles ---
    GM_addStyle(darkThemeCSS);
    GM_addStyle(toggleButtonCSS);

    // --- Load preference on page load ---
    // Check if dark mode was enabled in the previous session
    const savedDarkModeState = GM_getValue(STORAGE_KEY, false); // Default to false (off)
    applyDarkMode(savedDarkModeState);

})();
