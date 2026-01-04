// ==UserScript==
// @name         Hide Scrollbar
// @icon         https://img.icons8.com/?size=96&id=1pCmONr8SqKT&format=png
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides scrollbars on most webpages for a cleaner look. May not work on all complex sites.
// @author       DuyNguyen2K6
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544075/Hide%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/544075/Hide%20Scrollbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLE_ID = 'userscript-hide-scrollbar-style-simple';

    // Function to inject the basic CSS rule for scrollbar hiding
    function applyHideScrollbarCss() {
        let styleTag = document.getElementById(STYLE_ID);

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = STYLE_ID;
            styleTag.textContent = `
                /* Hide scrollbar for WebKit browsers (Chrome, Safari, Edge, Opera) */
                ::-webkit-scrollbar {
                  width: 0 !important;
                  height: 0 !important;
                  background: transparent !important;
                }

                /* Hide scrollbar for Firefox */
                html, body {
                  scrollbar-width: none !important;
                }

                /* Hide scrollbar for Internet Explorer and Edge Legacy */
                html, body {
                  -ms-overflow-style: none !important;
                }
            `;
            document.head.appendChild(styleTag);
        }
    }

    // Function to remove the CSS rule (not strictly needed for this simple version, but good practice)
    function removeHideScrollbarCss() {
        const styleTag = document.getElementById(STYLE_ID);
        if (styleTag) {
            styleTag.remove();
        }
    }

    // Apply the CSS on page load
    applyHideScrollbarCss();

    // Optionally, use a MutationObserver if you find scrollbars reappearing frequently
    // This part is commented out to keep it simpler and avoid potential issues,
    // but you can uncomment it if needed.
    /*
    const observer = new MutationObserver((mutations) => {
        if (!document.getElementById(STYLE_ID)) {
            applyHideScrollbarCss();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    observer.observe(document.documentElement, { attributes: true });
    window.addEventListener('unload', () => observer.disconnect());
    */

})();