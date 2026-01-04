// ==UserScript==
// @name         Grayscale Toggle with Persistence
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Toggles grayscale on the webpage with Alt+G and remembers the state
// @author       Drewby123
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522578/Grayscale%20Toggle%20with%20Persistence.user.js
// @updateURL https://update.greasyfork.org/scripts/522578/Grayscale%20Toggle%20with%20Persistence.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'grayscaleToggleState';

    // Retrieve and apply the saved grayscale state on page load
    let isGrayscale = localStorage.getItem(STORAGE_KEY) === 'true';
    document.body.style.filter = isGrayscale ? 'grayscale(100%)' : 'none';

    // Listen for the Alt+G key combination to toggle grayscale
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'g') {
            isGrayscale = !isGrayscale;
            document.body.style.filter = isGrayscale ? 'grayscale(100%)' : 'none';

            // Save the current state to localStorage
            localStorage.setItem(STORAGE_KEY, isGrayscale);
        }
    });
})();
