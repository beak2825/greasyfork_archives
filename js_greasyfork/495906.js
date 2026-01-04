// ==UserScript==
// @name         Подсветка МОПСа овер 14:55
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Highlight durations exceeding 14 minutes and 55 seconds in red
// @author       ZV
// @match        https://mops-portal.azurewebsites.net/timetracker
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495906/%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%9C%D0%9E%D0%9F%D0%A1%D0%B0%20%D0%BE%D0%B2%D0%B5%D1%80%2014%3A55.user.js
// @updateURL https://update.greasyfork.org/scripts/495906/%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%9C%D0%9E%D0%9F%D0%A1%D0%B0%20%D0%BE%D0%B2%D0%B5%D1%80%2014%3A55.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightDurations() {
        // Remove existing highlights
        const highlightedCells = document.querySelectorAll('td.highlighted');
        highlightedCells.forEach(cell => {
            cell.classList.remove('highlighted');
            cell.style.backgroundColor = ''; // Reset background color
        });

        // Select all rows in the table
        const rows = document.querySelectorAll('table tr');

        // Loop through each row
        rows.forEach(row => {
            // Find the 'Duration' column (assuming it is always the same index)
            const durationCell = row.querySelector('td:nth-child(5)'); // Replace 5 with the correct column index

            if (durationCell) {
                // Extract the time from the cell
                const timeText = durationCell.textContent.trim();
                const [hours, minutes, seconds] = timeText.split(':').map(Number);

                // Check if the time exceeds 14 minutes and 55 seconds
                if ((hours === 0 && minutes > 14) || (hours === 0 && minutes === 14 && seconds > 55)) {
                    // Highlight the cell in red
                    durationCell.classList.add('highlighted');
                    durationCell.style.backgroundColor = 'red';
                }
            }
        });
    }

    // Run the highlight function once the page content is fully loaded
    window.addEventListener('load', highlightDurations);

    // Optional: Re-run the highlight function if new rows are added dynamically
    const observer = new MutationObserver(highlightDurations);
    observer.observe(document.body, { childList: true, subtree: true });
})();
