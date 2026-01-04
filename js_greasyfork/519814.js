// ==UserScript==
// @name         Suno - Highlight Now Playing
// @namespace    http://tampermonkey.net/
// @version      2024-12-05
// @description  Make now playing more obvious
// @author       trus0und
// @match        https://suno.com/create
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suno.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519814/Suno%20-%20Highlight%20Now%20Playing.user.js
// @updateURL https://update.greasyfork.org/scripts/519814/Suno%20-%20Highlight%20Now%20Playing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS for the static #ff13f0 solid border
    GM_addStyle(`
        .css-efn502 {
            border: 2px solid #ff13f0; /* Solid pink border */
            border-radius: 4px; /* Optional: Add rounded corners */
        }
    `);

    // Function to apply the class to all .css-efn502 elements
    function applySolidBorder() {
        const elements = document.querySelectorAll('.css-efn502');
        elements.forEach(element => {
            if (!element.classList.contains('solid-border-applied')) {
                element.classList.add('solid-border-applied');
                element.classList.add('css-efn502');
            }
        });
    }

    // Initial application
    applySolidBorder();

    // Set up a MutationObserver to watch for dynamically added elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches('.css-efn502')) {
                    applySolidBorder();
                }
            });
        });
    });

    // Start observing the entire document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    console.log("Static #ff13f0 border script initialized and actively observing .css-efn502 elements.");
})();