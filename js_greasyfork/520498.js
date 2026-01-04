// ==UserScript==
// @name         Hide Sent Trades
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to hide trades you sent ("Waiting for" in the name)
// @author       You
// @match        https://www.chickensmoothie.com/trades/tradingcenter.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chickensmoothie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520498/Hide%20Sent%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/520498/Hide%20Sent%20Trades.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the target div with id="csbody"
    const csbodyDiv = document.getElementById("csbody");

    // Check if the target div exists
    if (csbodyDiv) {
        // Find all h2 elements inside the csbody div
        const h2Elements = csbodyDiv.querySelectorAll("h2");

        // Check if there are at least two h2 elements
        if (h2Elements.length >= 2) {
            // Create the button
            let button = document.createElement("button");
            button.innerHTML = "Hide Sent Trades";

            // Add event listener for button click
            button.addEventListener("click", function() {
                // Find all rows in the active trades table
                let tradeRows = document.querySelectorAll('#active-trades tbody tr');

                tradeRows.forEach(row => {
                    let statusCell = row.querySelector('td:nth-child(2)'); // Select the second column (Status)
                    if (statusCell) {
                        let tradeText = statusCell.textContent || statusCell.innerText;
                        if (tradeText.includes("Waiting for")) {
                            // Toggle visibility
                            row.style.display = (row.style.display === 'none' ? '' : 'none');
                        }
                    }
                });
            });

            // Style the button to be inline with the h2 element
            button.style.display = 'inline-block';
            button.style.marginLeft = '10px'; // Optional: Add some space between h2 and button

            // Insert the button next to the second h2 element (inline)
            h2Elements[1].appendChild(button);
        } else {
            console.error("There are less than two <h2> elements inside #csbody.");
        }
    } else {
        console.error("csbody div not found.");
    }
})();
