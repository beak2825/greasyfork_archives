// ==UserScript==
// @name        Bazaar Link Redirect and Rename
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/item.php
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description Redirect the "Bazaar" link to the "Item Market" page when clicked and rename the button to "Item Market"
// @downloadURL https://update.greasyfork.org/scripts/526024/Bazaar%20Link%20Redirect%20and%20Rename.user.js
// @updateURL https://update.greasyfork.org/scripts/526024/Bazaar%20Link%20Redirect%20and%20Rename.meta.js
// ==/UserScript==

(function() {
    // Wait until the page is fully loaded
    window.addEventListener('load', function() {
        // Select the "Bazaar" link element by its id or class
        const bazaarLink = document.querySelector('a[aria-labelledby="bazaar"]');
        
        // Rename the button text from "Bazaar" to "Item Market"
        if (bazaarLink) {
            const spanText = bazaarLink.querySelector('#bazaar');
            if (spanText) {
                spanText.textContent = 'Item Market';
            }

            // Add an event listener for the click event
            bazaarLink.addEventListener('click', function(event) {
                // Prevent the default action of the click (which would normally navigate to "bazaar.php")
                event.preventDefault();

                // Redirect to the Item Market page
                window.location.href = '/page.php?sid=ItemMarket';
            });
        }
    });
})();
