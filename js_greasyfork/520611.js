// ==UserScript==
// @name         Neopets Petpet Lab Ray Display
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display all Petpets in the Petpet Lab Ray without a scrollbar
// @include      https://www.neopets.com/petpetlab.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520611/Neopets%20Petpet%20Lab%20Ray%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/520611/Neopets%20Petpet%20Lab%20Ray%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.onload = function() {
        // Target the specific table that contains the Petpets
        const petpetTable = document.querySelector('form > table > tbody');  // Adjust this selector as needed

        if (petpetTable) {
            petpetTable.style.display = 'grid';
            petpetTable.style.gridTemplateColumns = 'repeat(5, 1fr)'; // 5 columns
            petpetTable.style.gap = '10px'; // Space between Petpets
            petpetTable.style.overflow = 'hidden';

            // Remove existing unwanted styles
            petpetTable.querySelectorAll('tr').forEach(row => {
                row.style.display = 'contents'; // Make rows behave like a grid
            });

            // Adjust Petpet cells
            const petpetCells = petpetTable.querySelectorAll('td');
            petpetCells.forEach(cell => {
                cell.style.boxSizing = 'border-box'; // Include padding in width calculations
                cell.style.padding = '10px'; // Add some padding around each Petpet
            });
        }
    };
})();