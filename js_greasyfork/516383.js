// ==UserScript==
// @name         ArsonWarehouse Total Profit Calculator
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Calculate the total profit from the trades page on ArsonWarehouse
// @match        https://arsonwarehouse.com/trades
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516383/ArsonWarehouse%20Total%20Profit%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/516383/ArsonWarehouse%20Total%20Profit%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the Calculate button
    const button = document.createElement("button");
    button.innerText = "Sum";
    button.style.position = "fixed";
    button.style.left = "20px"; // Change to left side
    button.style.bottom = "20px";
    button.style.width = "50px"; // Small width
    button.style.height = "50px"; // Small height
    button.style.borderRadius = "50%"; // Round shape
    button.style.padding = "10px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px"; // Adjust font size for small button
    document.body.appendChild(button);

    button.addEventListener("click", function() {
        let totalProfit = 0;

        // Look for all elements containing the word 'profit' and a number following it
        document.querySelectorAll('td').forEach((element) => {
            const text = element.textContent.trim().toLowerCase();

            // Check if the element contains the word "profit"
            if (text.includes('profit')) {
                // Extract the number that follows the word "profit"
                const profitText = text.match(/profit\s?\$?([-\d,]+)/);
                if (profitText && profitText[1]) {
                    const profitValue = parseFloat(profitText[1].replace(/,/g, ''));
                    // Ensure it's a valid number before adding to total
                    if (!isNaN(profitValue)) {
                        totalProfit += profitValue;
                    }
                }
            }
        });

        // Display the total profit
        if (totalProfit !== 0) {
            alert("Total Profit: $" + totalProfit.toLocaleString());
        } else {
            alert("No valid profit found.");
        }
    });
})();
