// ==UserScript==
// @name         YouTube blend webapp window decoration/theme color with header
// @namespace    https://greasyfork.org/users/1257389
// @version      1.0.00
// @description  Set theme color based on YouTube header's background color, and make the header color stay persistent when theater mode is toggled. (Works both for dark and light mode)
// @author       dvirzxc
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486597/YouTube%20blend%20webapp%20window%20decorationtheme%20color%20with%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/486597/YouTube%20blend%20webapp%20window%20decorationtheme%20color%20with%20header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if YouTube is in dark mode
    function isDarkMode() {
        return document.documentElement.getAttribute('dark') !== null;
    }

    // Function to inject CSS based on mode
    function injectCSS() {
        const darkModeCSS = `
            div.style-scope.ytd-masthead {
                background-color: #212121 !important;
            }
            yt-icon {
                color: #f3f3f3 !important;
            }
            div.style-scope.ytd-searchbox {
                background-color: #212121 !important;
            }
        `;

        const lightModeCSS = `
            div.style-scope.ytd-masthead {
                background-color: #ffffff !important;
            }
            yt-icon {
                color: #000000 !important;
            }
            div.style-scope.ytd-searchbox {
                background-color: #ffffff !important;
            }
        `;

        const style = document.createElement('style');
        style.type = 'text/css';

        if (isDarkMode()) {
            style.textContent = darkModeCSS;
        } else {
            style.textContent = lightModeCSS;
        }

        // Remove any previously injected style elements
        document.querySelectorAll('style[name="YouTubeDarkModeToggle"]').forEach(styleElement => {
            styleElement.remove();
        });

        // Inject the new style element
        style.setAttribute('name', 'YouTubeDarkModeToggle');
        document.head.appendChild(style);
    }

    // Check and inject CSS when the page loads
    injectCSS();

    // Listen for changes in dark mode and inject CSS accordingly
    const observer = new MutationObserver(injectCSS);
    observer.observe(document.documentElement, { attributes: true });
})();
