// ==UserScript==
// @name         Torn Hide 'Sell' below 10k card details
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the Card Skimming 'Sell' button if below 10k card details
// @author       pawl [1821105]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535119/Torn%20Hide%20%27Sell%27%20below%2010k%20card%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/535119/Torn%20Hide%20%27Sell%27%20below%2010k%20card%20details.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function hideButtonIfNeeded() {
        if (!window.location.hash.includes('cardskimming')) return;
 
        const countElement = document.querySelector('span.count___xEGL9');
        if (!countElement) return;
 
        const numberText = countElement.textContent.replace(/,/g, '');
        const numberValue = parseInt(numberText, 10);
 
        if (isNaN(numberValue)) return;
 
        if (numberValue < 10000) {
            const sellButton = document.querySelector('button[aria-label="Sell, 6 nerve"]');
            if (sellButton) {
                sellButton.style.display = 'none';
            }
        }
    }
 
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            hideButtonIfNeeded();
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
 
        // Also run initial check
        hideButtonIfNeeded();
    }
 
    // Fast interval loop in early page load
    const quickCheck = setInterval(() => {
        const done = hideButtonIfNeeded();
        if (done !== false) {
            clearInterval(quickCheck);
        }
    }, 300); // Checks every 300ms
 
    // MutationObserver for dynamic DOM changes
    window.addEventListener('load', observeDOMChanges);
})();