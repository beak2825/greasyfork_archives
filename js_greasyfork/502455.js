// ==UserScript==
// @name         Return Cancel All Sales
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a "Cancel All" to cancel all sales in a Mintos Loan page
// @author       Hugo Costa
// @match        *://*.mintos.com/*
// @icon         https://www.google.com/s2/favicons?domain=mintos.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502455/Return%20Cancel%20All%20Sales.user.js
// @updateURL https://update.greasyfork.org/scripts/502455/Return%20Cancel%20All%20Sales.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click all elements matching the criteria
    function clickSellBoxes() {
        const sellBoxes = document.querySelectorAll('span[data-testid="approve-note-amount"].input-icon');
        sellBoxes.forEach(box => {
            box.click();
            console.log('Clicked:', box);
        });
    }

    // Function to create and insert the "Cancel All" button
    function addCancelAllButton() {
        const sellAllButton = document.querySelector('button[data-testid="note-invest-all"]');
        if (sellAllButton) {
            const cancelAllButton = document.createElement('button');
            cancelAllButton.textContent = 'Cancel All';
            cancelAllButton.type = 'button';
            cancelAllButton.className = sellAllButton.className; // Use the same classes for styling
            cancelAllButton.style.marginLeft = '10px'; // Add some spacing

            // Attach the click event to the "Cancel All" button
            cancelAllButton.addEventListener('click', clickSellBoxes);

            // Insert the "Cancel All" button next to the "Sell All" button
            sellAllButton.parentElement.appendChild(cancelAllButton);
        }
    }

    // Wait for the DOM to fully load before executing the function
    window.addEventListener('load', () => {
        setTimeout(addCancelAllButton, 2000); // Delay to ensure all elements are loaded
    });
})();
