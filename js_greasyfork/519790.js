// ==UserScript==
// @name         Hide Active Trades
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button that toggles visibility of active trades
// @author       You
// @match        https://www.chickensmoothie.com/trades/tradingcenter.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chickensmoothie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519790/Hide%20Active%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/519790/Hide%20Active%20Trades.meta.js
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
            button.innerHTML = "Hide Active Trades";

            // Add event listener for button click
            button.addEventListener("click", function() {
                // Find the table with id="active-trades" and toggle its visibility
                let activeTradesTable = document.querySelector('#active-trades');
                if (activeTradesTable) {
                    activeTradesTable.style.display = (activeTradesTable.style.display === 'none' ? 'table' : 'none');
                }
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
