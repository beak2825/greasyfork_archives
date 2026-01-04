// ==UserScript==
// @name         Auto Dark Mode
// @namespace    https://your-namespace.example
// @version      1.1
// @description  Automatically applies dark mode if not already preferred by the user
// @author       YourName
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541318/Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/541318/Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if dark mode is preferred
    function isDarkModePreferred() {
        return window.matchMedia && 
               window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Function to apply or remove dark mode
    function updateDarkMode() {
        if (!isDarkModePreferred()) {
            document.documentElement.classList.add('userscript-dark-mode');
            document.body.classList.add('userscript-dark-mode');
        } else {
            document.documentElement.classList.remove('userscript-dark-mode');
            document.body.classList.remove('userscript-dark-mode');
        }
    }

    // Add dark mode styles using GM_addStyle for better compatibility
    function addDarkModeStyles() {
        const css = `
            :root.userscript-dark-mode, 
            body.userscript-dark-mode {
                background: #222 !important;
                color: #eee !important;
            }
            .userscript-dark-mode a {
                color: #8ab4f8 !important;
            }
            .userscript-dark-mode input,
            .userscript-dark-mode textarea,
            .userscript-dark-mode select {
                background: #333 !important;
                color: #eee !important;
                border-color: #444 !important;
            }
            /* Fix for Firefox flash of unstyled content */
            :root:not(.userscript-dark-mode) {
                background-color: white;
            }
        `;
        
        if (typeof GM_addStyle !== "undefined") {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    // Wait for DOM to be ready before applying
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                addDarkModeStyles();
                updateDarkMode();
            });
        } else {
            addDarkModeStyles();
            updateDarkMode();
        }
    }

    // Initial setup
    init();

    // Listen for changes in system preference
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Modern browsers support addEventListener
        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', updateDarkMode);
        } 
        // Fallback for older browsers
        else if (darkModeQuery.addListener) {
            darkModeQuery.addListener(updateDarkMode);
        }
    }
})();