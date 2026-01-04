// ==UserScript==
// @name         Torn items sell auto confirm
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-confirm sell actions in inventory
// @author       GFOUR [3498427]
// @match        https://www.torn.com/item.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537444/Torn%20items%20sell%20auto%20confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/537444/Torn%20items%20sell%20auto%20confirm.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Add CSS to hide only sell confirmation dialogues
    const style = document.createElement('style');
    style.textContent = `
        /* Hide sell confirmation dialogues specifically */
        .action-wrap.sell-act {
            display: none !important;
        }

        /* Alternative selector for sell confirmations */
        .action-wrap[data-action="sellItem"] {
            display: none !important;
        }

        /* Hide forms only within sell action containers */
        .action-wrap.sell-act form,
        .action-wrap[data-action="sellItem"] form {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // Function to auto-confirm sell actions
    function autoConfirmSell() {
        // Look for sell confirmation dialogues that might appear
        const sellConfirmations = document.querySelectorAll('.action-wrap.sell-act form, .action-wrap[data-action="sellItem"] form');

        sellConfirmations.forEach(form => {
            const yesButton = form.querySelector('a.next-act, a[href="#"].next-act');
            if (yesButton && form.style.display !== 'none') {
                // Auto-click the "Yes" button
                yesButton.click();
            }
        });
    }

    // Function to handle sell button clicks
    function handleSellClick(event) {
        const sellButton = event.target.closest('.sell');
        if (sellButton) {
            // Small delay to allow the confirmation dialogue to appear, then auto-confirm
            setTimeout(() => {
                autoConfirmSell();
            }, 100);
        }
    }

    // Add event listeners for sell button clicks
    document.addEventListener('click', function(event) {
        // Check if clicked element is a sell button or within a sell container
        if (event.target.closest('.sell') ||
            event.target.closest('.option-sell') ||
            event.target.classList.contains('option-sell')) {
            handleSellClick(event);
        }
    });

    // Also use MutationObserver to catch dynamically added confirmation dialogues
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Check if a sell confirmation dialogue was added
                    if (node.classList && node.classList.contains('sell-act')) {
                        setTimeout(autoConfirmSell, 50);
                    }

                    // Also check child elements
                    const sellActElements = node.querySelectorAll && node.querySelectorAll('.sell-act');
                    if (sellActElements && sellActElements.length > 0) {
                        setTimeout(autoConfirmSell, 50);
                    }
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run initial check in case confirmations are already present
    setTimeout(autoConfirmSell, 1000);

    console.log('Torn Auto-Sell userscript loaded');
})();