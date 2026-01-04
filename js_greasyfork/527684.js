// ==UserScript==
// @name         Torn.com Align Sell Action Right & Auto Close
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Aligns the sell action text to the right and auto-clicks the Close button on Torn.com item page
// @author       Slaterz [2479416]
// @match        https://www.torn.com/item.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527684/Torncom%20Align%20Sell%20Action%20Right%20%20Auto%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/527684/Torncom%20Align%20Sell%20Action%20Right%20%20Auto%20Close.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to align text to the right
    function alignSellActionText() {
        const sellActElements = document.querySelectorAll('.action-wrap.sell-act');
        sellActElements.forEach(element => {
            element.style.textAlign = 'right';
        });
    }

    // Function to auto-click the "Close" button, but only after confirmation
    function autoClickClose() {
        const confirmationText = document.querySelector('.action-wrap.sell-act p');
        const closeButton = document.querySelector('.action-wrap.sell-act .close-act');

        // Only click close if the confirmation message is displayed
        if (confirmationText && confirmationText.textContent.includes('You sold your')) {
            if (closeButton) {
                closeButton.click();
                console.log('Clicked the close button automatically after selling the item.');
            }
        }
    }

    // Function to handle clicking "Yes" to confirm the sale
    function handleSellConfirmation() {
        const yesButton = document.querySelector('.action-wrap.sell-act .next-act.bold.t-blue.h');
        if (yesButton) {
            yesButton.addEventListener('click', () => {
                // Wait a moment to let the sale process and then attempt to auto-close
                setTimeout(autoClickClose, 300);
            });
        }
    }

    // Combine both functions
    function handleSellAction() {
        alignSellActionText();
        handleSellConfirmation();
    }

    // Run the function when the page loads
    window.addEventListener('load', handleSellAction);

    // Run the function when the page content changes (for Torn's dynamic content)
    const observer = new MutationObserver(handleSellAction);
    observer.observe(document.body, { childList: true, subtree: true });
})();
