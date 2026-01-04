// ==UserScript==
// @name         YouTube Material Design 1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply Material Design 1 styles to YouTube
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505451/YouTube%20Material%20Design%201.user.js
// @updateURL https://update.greasyfork.org/scripts/505451/YouTube%20Material%20Design%201.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to load Material Design CSS
    function loadMaterialDesignCSS() {
        GM_addStyle(`
            /* Basic Material Design styling for YouTube */

            /* Add Material Design 1 colors and typography */
            :root {
                --md1-primary: #6200ea; /* Purple */
                --md1-secondary: #03dac6; /* Teal */
                --md1-background: #ffffff; /* White background */
                --md1-surface: #f2f2f2; /* Light gray surface */
                --md1-on-primary: #ffffff; /* White text on primary color */
                --md1-on-secondary: #000000; /* Black text on secondary color */
                --md1-text-primary: #000000; /* Black text */
                --md1-text-secondary: #000000; /* Black text */
            }

            /* Basic Material Design 1 styles */
            body {
                background-color: var(--md1-background) !important;
                color: var(--md1-text-primary) !important;
            }

            .style-scope.ytd-app {
                background-color: var(--md1-surface) !important;
            }

            /* Style the top bar */
            #masthead-container {
                background-color: var(--md1-primary) !important;
                color: var(--md1-on-primary) !important;
            }

            #search-input {
                background-color: var(--md1-surface) !important;
                border-radius: 4px;
                border: 1px solid #ccc;
                color: var(--md1-text-primary) !important;
            }

            /* Style buttons */
            .style-scope ytd-button-renderer {
                background-color: var(--md1-secondary) !important;
                color: var(--md1-on-secondary) !important;
                border-radius: 4px;
                padding: 6px 12px;
                font-family: 'Roboto', sans-serif;
            }

            .style-scope ytd-button-renderer:hover {
                background-color: var(--md1-primary) !important;
                color: var(--md1-on-primary) !important;
            }
        `);
    }

    // Load the Material Design CSS
    loadMaterialDesignCSS();
})();
