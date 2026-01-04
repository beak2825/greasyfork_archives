// ==UserScript==
// @name         Dark Mode Toggle (Shortcut Only)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a dark mode toggle to any website via keyboard shortcut with persistence
// @author       Drewby123
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522591/Dark%20Mode%20Toggle%20%28Shortcut%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522591/Dark%20Mode%20Toggle%20%28Shortcut%20Only%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create a style element for dark mode
    const darkModeStyle = document.createElement('style');
    darkModeStyle.id = 'dark-mode-style';
    darkModeStyle.textContent = `
        html {
            filter: invert(1) hue-rotate(180deg);
            background: #111 !important;
        }
        img, video {
            filter: invert(1) hue-rotate(180deg) !important;
        }
    `;

    // Load dark mode state from localStorage
    let darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    if (darkModeEnabled) {
        document.head.appendChild(darkModeStyle);
    }

    // Toggle functionality
    const toggleDarkMode = () => {
        darkModeEnabled = !darkModeEnabled;
        if (darkModeEnabled) {
            document.head.appendChild(darkModeStyle);
        } else {
            if (document.getElementById('dark-mode-style')) {
                document.getElementById('dark-mode-style').remove();
            }
        }
        localStorage.setItem('darkModeEnabled', darkModeEnabled);
    };

    // Add keyboard shortcut (Alt + N) to toggle dark mode
    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === 'n') {
            toggleDarkMode();
        }
    });
})();
