// ==UserScript==
// @name         PIN Verification For Marketplace
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds PIN verification for Dead Frontier Marketplace before buying some Item above set money value.
// @author       Lucky11
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546569/PIN%20Verification%20For%20Marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/546569/PIN%20Verification%20For%20Marketplace.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //***START OF USER SETTINGS***
    // Set the price threshold for PIN verification
    const priceThreshold = 100000; // Change this value to set the desired price - above this price prompt with pin will be shown.

    const currentPin = '1234'; // Set your PIN here

    //***END OF USER SETTINGS***

    // Store the original marketAction function
    const originalMarketAction = unsafeWindow.marketAction;
    // Override the marketAction function
    unsafeWindow.marketAction = function(e) {
        // Call the original function
        originalMarketAction.call(this, e);

        // Check if the action is "buyItem"
        if (e.target.dataset.action === "buyItem") {
            const itemName = unsafeWindow.marketData["tradelist_" + e.target.dataset.itemLocation + "_itemname"];
            const price = unsafeWindow.marketData["tradelist_" + e.target.dataset.itemLocation + "_price"];
            //let formattedPrice = price > 0 ? "$" + unsafeWindow.nf.format(price) : "free";
            // Log the message to the console
            //console.log("Are you sure you want to buy " + itemName + " for " + formattedPrice + "?");

            // Get the prompt element
            const promptElement = document.getElementById('prompt');
            const yesButton = promptElement.querySelector('button:nth-of-type(1)');
            const noButton = promptElement.querySelector('button:nth-of-type(2)');
            const gameContent = promptElement.querySelector('#gamecontent');

            // Disable the Yes button if the price is higher than 5000
            if (price > priceThreshold) {
                yesButton.disabled = true;
                // Get the current height of gameContent
                const currentHeight = gameContent.offsetHeight; // Get current height in pixels
                gameContent.style.height = (currentHeight + 5) + 'px'; // Increase height by 20px
                // Create a PIN input and button
                let pinInput = document.createElement('input');
                pinInput.type = 'text';
                pinInput.placeholder = 'Enter PIN';
                pinInput.style.position = 'absolute';
                pinInput.style.left = '50%';
                pinInput.style.transform = 'translateX(-50%)';
                pinInput.style.top = '50%'//'40px'; // Position above Yes/No buttons
                pinInput.style.width = '48px'; // Set the width to 150 pixels (adjust as needed)
                pinInput.maxLength = 4;

                let verifyButton = document.createElement('button');
                verifyButton.textContent = 'Verify PIN';
                verifyButton.style.position = 'absolute';
                verifyButton.style.left = '50%';
                verifyButton.style.transform = 'translateX(-50%)';
                verifyButton.style.top = '70%'; // Position above textbox

                // Append the PIN input and button to the gamecontent div
                gameContent.appendChild(pinInput);
                gameContent.appendChild(verifyButton);
                // Adjust the position of the "Yes" and "No" buttons
                yesButton.style.top = '84%'; // Set this to the desired pixel value
                noButton.style.top = '84%'; // Set this to the desired pixel value
                // Set focus on the PIN input
                pinInput.focus();

                // Verify PIN functionality
                const verifyPin = function() {
                    const correctPin = currentPin;
                    if (pinInput.value === correctPin) {
                        yesButton.disabled = false; // Enable Yes button if PIN is correct
                        const originalBorder = gameContent.style.border; // Store the original border
                        gameContent.style.border = '2px solid green'; // Change border color to bright green
                        // Revert the border back to original after 2 seconds
                        setTimeout(() => {
                            gameContent.style.border = originalBorder; // Restore original border
                        }, 1000); // Change 2000 to the desired duration in milliseconds
                        pinInput.style.display = 'none'; // Hide the PIN input
                        verifyButton.style.display = 'none'; // Hide the verify button
                    } else {
                        const originalBorder = gameContent.style.border;
                        gameContent.style.border = '2px solid red'; // Change border color to red for incorrect PIN
                        // Revert the border back to original after 2 seconds
                        setTimeout(() => {
                            gameContent.style.border = originalBorder; // Restore original border
                        }, 1000); // Change 2000 to the desired duration in milliseconds

                    }
                };

                // Add event listener for Enter key
                pinInput.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        verifyPin(); // Call the verify function when Enter is pressed
                    }
                });

                // Verify PIN button functionality
                verifyButton.onclick = verifyPin;
            } else {
                yesButton.disabled = false; // Enable Yes button if price is 5000 or less
            }
        }
    };
})();