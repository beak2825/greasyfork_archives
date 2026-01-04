// ==UserScript==
// @name         Copy Address Information Buttons
// @version      2.2
// @description  For Pestpac, adds buttons at the bottom of the tables to copy their information on a specific website
// @author       Jamie Cruz
// @match        https://app.pestpac.com/location/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1433767
// @downloadURL https://update.greasyfork.org/scripts/526491/Copy%20Address%20Information%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/526491/Copy%20Address%20Information%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCopyButton(tableId, buttonText, color, formatSingleLine = false) {
        var table = document.getElementById(tableId);
        if (table) {
            var button = document.createElement("button");
            button.innerHTML = buttonText;
            button.style.margin = "10px";
            button.style.padding = "10px";
            button.style.backgroundColor = color;
            button.style.color = "white";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
            button.style.width = "160px"; // Set a fixed width for both buttons
            button.style.height = "25px"; // Set a fixed height for both buttons

            // Center-align text both vertically and horizontally
            button.style.display = "flex";
            button.style.justifyContent = "center";
            button.style.alignItems = "center";

            // Create a new table row and cell
            var newRow = table.insertRow(-1); // Insert row at the end of the table
            var newCell = newRow.insertCell(0);
            newCell.colSpan = table.rows[0].cells.length; // Make the cell span across all columns

            // Insert the button into the new cell
            newCell.appendChild(button);

            // Function to copy table data
            button.addEventListener("click", function() {
                var textContent = table.innerText;

                // Remove unwanted words
                var cleanedText = textContent.replace(/EMAIL|Map View|Street View|PHONE|Copy Location Address|Copy Billto Address|Calendar\/Email|/g, "");

                // Clean extra line breaks
                if (formatSingleLine) {
                    cleanedText = cleanedText.replace(/\n\s*\n/g, " -- ").trim().replace(/\n/g, " -- ");
                } else {
                    cleanedText = cleanedText.replace(/\n\s*\n/g, "\n").trim();
                }

                // Copy cleaned text to clipboard
                navigator.clipboard.writeText(cleanedText).then(function() {
                    alert("Address copied to clipboard!");
                }).catch(function(err) {
                    console.error("Failed to copy table data.", err);
                });
            });
        }
    }

    window.onload = function() {
        addCopyButton("location-address-block", "Copy Location Address", "#1565C0");
        addCopyButton("location-address-block", "Calendar/Email", "#2E67F8", true);
        addCopyButton("billto-address-block", "Copy Billto Address", "#1565C0");
        addCopyButton("billto-address-block", "Calendar/Email", "#2E67F8", true);
    };
})();
