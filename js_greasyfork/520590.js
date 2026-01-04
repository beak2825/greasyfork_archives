// ==UserScript==
// @name         Torn City Auto Xanax
// @namespace    https://www.torn.com/
// @version      1.2
// @description  Automatically uses Xanax in Torn City when the drug cooldown ends.
// @author       Your Name
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/520590/Torn%20City%20Auto%20Xanax.user.js
// @updateURL https://update.greasyfork.org/scripts/520590/Torn%20City%20Auto%20Xanax.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to use Xanax
    function useXanax() {
        // Find Xanax item in inventory
        const xanaxItem = document.querySelector('.item-list .item[data-item-name="Xanax"]');
        if (xanaxItem) {
            console.log('Xanax found in inventory.');

            // Find and click the "Use" button
            const useButton = xanaxItem.querySelector('.item-action[data-action="Use"]');
            if (useButton) {
                useButton.click();
                console.log('Attempting to use Xanax...');
            } else {
                console.log('Use button not found for Xanax.');
            }
        } else {
            console.log('Xanax not found in inventory.');
        }
    }

    // Function to check drug cooldown
    function checkCooldownAndUseXanax() {
        // Look for drug cooldown element
        const cooldownElement = document.querySelector('.cooldown-drugs .desc');
        if (cooldownElement && cooldownElement.textContent.includes('Ready')) {
            console.log('Drug cooldown is ready.');
            useXanax();
        } else {
            console.log('Drug cooldown not ready.');
        }
    }

    // Observe changes in the cooldown area to react dynamically
    const cooldownContainer = document.querySelector('.cooldown-drugs');
    if (cooldownContainer) {
        const observer = new MutationObserver(() => {
            checkCooldownAndUseXanax();
        });

        observer.observe(cooldownContainer, { childList: true, subtree: true });
        console.log('Started observing cooldown area.');
    } else {
        console.log('Cooldown container not found. Retrying in 10 seconds.');
        setTimeout(() => location.reload(), 10000);
    }

    // Fallback to check every 5 minutes
    setInterval(checkCooldownAndUseXanax, 300000);
})();
