// ==UserScript==
// @name         Woogles Bonus Label Fixer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unhide and modify bonus labels on woogles.io, even with navigation within an SPA
// @author       You
// @license MIT
// @match        *://woogles.io/*
// @match        *://www.woogles.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508773/Woogles%20Bonus%20Label%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/508773/Woogles%20Bonus%20Label%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to unhide bonus labels and update text
    function updateBonusLabels() {
        document.querySelectorAll('.bonus-label').forEach(function(element) {
            element.style.display = 'block';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
        });

        const textMapping = {
            '2x letter': 'DL',
            '2x word': 'DW',
            '3x letter': 'TL',
            '3x word': 'TW'
        };

        document.querySelectorAll('.bonus-label').forEach(function(element) {
            let text = element.textContent.trim();
            if (textMapping[text]) {
                element.textContent = textMapping[text];
            }
        });
    }

    // Initial run to handle the page load
    updateBonusLabels();

    // Create a MutationObserver to detect changes in the DOM (e.g., navigation within an SPA)
    const observer = new MutationObserver(() => {
        updateBonusLabels(); // Run the function when changes occur
    });

    // Start observing the body for changes in child elements
    observer.observe(document.body, { childList: true, subtree: true });
})();
