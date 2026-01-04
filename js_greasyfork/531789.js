// ==UserScript==
// @name         Floating Trade and Prices Buttons
// @namespace    https://greasyfork.org/en/scripts/531789-floating-trade-and-prices-buttons
// @version      04.03.2025.12.15
// @description  Inserts two floating buttons on Torn: "KC Trade" (at 80px) and "KC Prices" (at 140px) for KillerCleat.
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531789/Floating%20Trade%20and%20Prices%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/531789/Floating%20Trade%20and%20Prices%20Buttons.meta.js
// ==/UserScript==

/*
    NOTES & REQUIREMENTS:
    - This script creates two floating buttons:
         1. "KC Trade" button:
              * Positioned fixed at top offset 80px.
              * Navigates to: https://www.torn.com/trade.php#step=start&userID=2842410
         2. "KC Prices" button:
              * Positioned fixed at top offset 140px.
              * Navigates to: https://www.tornexchange.com/prices/KillerCleat/
    - Both buttons have similar styling for consistency.
    - Version format: month.day.year.hour.minute (e.g., 04.03.2025.12.15).
    - Role-Based Access: Only users with roles "Admin", "Trader", or "Buyer" should see these buttons (controlled by the hasAccess() function).
    - Error Handling: Logs errors if there are issues inserting the buttons.
    - Testing Instructions:
         1) After page load, verify that both the "KC Trade" button (at 80px) and the "KC Prices" button (at 140px) appear.
         2) Clicking each should navigate to their respective URLs.
         3) Modify the hasAccess() function (e.g., return false) to test role-based access.
    !help: This header block contains metadata, notes, and instructions. Do not remove or modify without approval.
*/

(function() {
    'use strict';

    // Placeholder for Role-Based Access Control.
    function hasAccess() {
        return true; // Replace with your actual role-check logic if needed.
    }

    // Function to add the floating "KC Trade" button.
    function addFloatingKCTradeButton() {
        try {
            if (!hasAccess()) {
                console.log('User does not have the required role to see the KC Trade button.');
                return;
            }
            const tradeButtonContainer = document.createElement('div');
            tradeButtonContainer.style.position = 'fixed';
            tradeButtonContainer.style.top = '5px'; // Positioned at 80px from the top.
            tradeButtonContainer.style.right = '20px';
            tradeButtonContainer.style.zIndex = '9999';
            tradeButtonContainer.style.backgroundColor = '#007bff';
            tradeButtonContainer.style.padding = '10px 20px';
            tradeButtonContainer.style.borderRadius = '5px';
            tradeButtonContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            tradeButtonContainer.style.textAlign = 'center';

            const tradeLink = document.createElement('a');
            tradeLink.href = 'https://www.torn.com/trade.php#step=start&userID=2842410';
            tradeLink.textContent = 'KC Trade';
            tradeLink.style.color = '#fff';
            tradeLink.style.fontWeight = 'bold';
            tradeLink.style.textDecoration = 'none';

            tradeButtonContainer.appendChild(tradeLink);
            document.body.appendChild(tradeButtonContainer);
            console.log('Floating KC Trade button added successfully.');
        } catch (error) {
            console.error('Error adding the floating KC Trade button:', error);
        }
    }

    // Function to add the floating "KC Prices" button.
    function addFloatingKCPricesButton() {
        try {
            if (!hasAccess()) {
                console.log('User does not have the required role to see the KC Prices button.');
                return;
            }
            const pricesButtonContainer = document.createElement('div');
            pricesButtonContainer.style.position = 'fixed';
            pricesButtonContainer.style.top = '40px'; // Positioned below the trade button.
            pricesButtonContainer.style.right = '20px';
            pricesButtonContainer.style.zIndex = '9999';
            pricesButtonContainer.style.backgroundColor = '#28a745';
            pricesButtonContainer.style.padding = '10px 20px';
            pricesButtonContainer.style.borderRadius = '5px';
            pricesButtonContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            pricesButtonContainer.style.textAlign = 'center';

            const pricesLink = document.createElement('a');
            pricesLink.href = 'https://www.tornexchange.com/prices/KillerCleat/';
            pricesLink.textContent = 'KC Prices';
            pricesLink.style.color = '#fff';
            pricesLink.style.fontWeight = 'bold';
            pricesLink.style.textDecoration = 'none';

            pricesButtonContainer.appendChild(pricesLink);
            document.body.appendChild(pricesButtonContainer);
            console.log('Floating KC Prices button added successfully.');
        } catch (error) {
            console.error('Error adding the floating KC Prices button:', error);
        }
    }

    // Wait for the DOM to fully load before executing the functions.
    window.addEventListener('load', function() {
        addFloatingKCTradeButton();
        addFloatingKCPricesButton();
    });
})();
