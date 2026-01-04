// ==UserScript==
// @name         Remove Cookie Popups
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Automatically remove cookie popups on any site
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515103/Remove%20Cookie%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/515103/Remove%20Cookie%20Popups.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements matching the selectors
    const removePopups = () => {
        const selectors = [
            '[id*="cookie"]',
            '[class*="cookie"]',
            '[class*="graderPanel-passedAssessment"]',
            '[id*="wmde-banner-app"]',
        ];

        // Loop through each selector and remove matching elements
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    };

    // Observe the entire DOM for changes (to catch dynamically loaded elements)
    const observer = new MutationObserver(() => {
        removePopups();
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the popup removal on document load
    document.addEventListener('DOMContentLoaded', removePopups);
})();
