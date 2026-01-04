// ==UserScript==
// @name        Bazaar Link Redirect and Rename with Icon Change 1.0
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/item.php
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description Redirect the "Bazaar" link to the "Item Market" page when clicked, rename the button to "Item Market", change the icon, and set the icon size to 25x25.
// @downloadURL https://update.greasyfork.org/scripts/526023/Bazaar%20Link%20Redirect%20and%20Rename%20with%20Icon%20Change%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/526023/Bazaar%20Link%20Redirect%20and%20Rename%20with%20Icon%20Change%2010.meta.js
// ==/UserScript==

(function() {
    // Wait until the page is fully loaded
    window.addEventListener('load', function() {
        // Select the "Bazaar" link element by its aria-labelledby attribute
        const bazaarLink = document.querySelector('a[aria-labelledby="bazaar"]');

        if (bazaarLink) {
            // Rename the button text from "Bazaar" to "Item Market"
            const spanText = bazaarLink.querySelector('span#bazaar');
            if (spanText) {
                spanText.textContent = 'Item Market';
            }

            // Replace the current icon with the new one
            const iconWrap = bazaarLink.querySelector('.icon-wrap');
            if (iconWrap) {
                // Remove the existing SVG icon
                iconWrap.innerHTML = '';

                // Create a new <i> tag with the "cql-item-market" class
                const newIcon = document.createElement('i');
                newIcon.className = 'cql-item-market';

                // Set the size of the icon to 25x25
                newIcon.style.width = '25px';
                newIcon.style.height = '25px';
                newIcon.style.fontSize = '25px'; // Adjust font-size if the icon is text-based (e.g. using a font icon)

                // Append the new icon to the iconWrap
                iconWrap.appendChild(newIcon);
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
