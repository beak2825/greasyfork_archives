// ==UserScript==
// @name         Sort Battlefield Table by Treasury (Auto-Sort)
// @license MIT
// @namespace    https://main.gatewa.rs/
// @version      1.11
// @description  Automatically sorts the Battlefield table by Treasury in descending order (highest to lowest) by computing the correct column index, cleaning up the treasury value, and reversing it to match the displayed order.
// @match        https://main.gatewa.rs/battlefield.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526430/Sort%20Battlefield%20Table%20by%20Treasury%20%28Auto-Sort%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526430/Sort%20Battlefield%20Table%20by%20Treasury%20%28Auto-Sort%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function: reverses a given string.
    function reverseString(str) {
        return str.split('').reverse().join('');
    }

    // Get the table body that holds all rows.
    const table = document.querySelector("#main_ranking tbody");
    if (!table) return;

    // The first row is assumed to be the header row.
    const headerRow = table.querySelector("tr");
    if (!headerRow) return;

    // Compute the effective column index for "Treasury" by taking colspans into account.
    let treasuryEffectiveIndex = -1;
    let effectiveIndex = 0;
    const headerCells = headerRow.cells;
    for (let i = 0; i < headerCells.length; i++) {
        const colspan = parseInt(headerCells[i].getAttribute("colspan") || "1", 10);
        if (headerCells[i].innerText.trim().includes("Treasury")) {
            treasuryEffectiveIndex = effectiveIndex;
            break;
        }
        effectiveIndex += colspan;
    }
    if (treasuryEffectiveIndex === -1) {
        console.error("Could not determine Treasury column index.");
        return;
    }
    console.log("Treasury effective column index:", treasuryEffectiveIndex);

    // Identify the header cell for Treasury to make it clickable.
    let treasuryHeader;
    for (let cell of headerCells) {
        if (cell.innerText.trim().includes("Treasury")) {
            treasuryHeader = cell;
            break;
        }
    }
    if (!treasuryHeader) return;

    // Style the header so it looks clickable.
    treasuryHeader.style.cursor = "pointer";
    treasuryHeader.style.textDecoration = "underline";
    treasuryHeader.style.color = "yellow";

    // Function that sorts the rows in descending order.
    function sortRows() {
        // Select the desktop rows (which contain the treasury column).
        let rows = Array.from(table.querySelectorAll("tr.hidden-xs-down"));
        console.log("Rows before sorting:", rows.length);

        // Sort the rows descending: highest treasury value first.
        rows.sort((a, b) => {
            const valA = getTreasuryValue(a);
            const valB = getTreasuryValue(b);
            return valB - valA;
        });

        // Log the sorted treasury values (for debugging).
        console.log("Sorted Treasury values:", rows.map(row => getTreasuryValue(row)));

        // Reinsert the sorted rows into the table body.
        rows.forEach(row => table.appendChild(row));
        console.log("Rows after sorting:", rows.length);
    }

    // Add a click event so that you can re-sort manually if needed.
    treasuryHeader.addEventListener("click", sortRows);

    // Automatically sort the rows when the page loads.
    sortRows();

    // Function to extract and correct the Treasury numeric value from a row.
    function getTreasuryValue(row) {
        // Use the effective column index to get the correct cell.
        const cell = row.children[treasuryEffectiveIndex];
        if (!cell) return 0;

        // Look for a <button> inside the cell.
        const button = cell.querySelector('button');
        if (button) {
            // Try to find the <x> tag inside the button (where the number is stored).
            let xTag = button.querySelector('x');
            let text;
            if (xTag) {
                text = xTag.innerText || xTag.textContent;
            } else {
                // Fallback: use the button's text.
                text = button.innerText || button.textContent;
            }
            if (!text) return 0;
            // Remove "Naquadah" (if present) and any commas.
            text = text.replace(/Naquadah/gi, "").replace(/,/g, "").trim();
            // Reverse the string so that the number is in the correct order.
            text = reverseString(text);
            const num = parseInt(text, 10);
            return isNaN(num) ? 0 : num;
        }
        return 0;
    }
})();
