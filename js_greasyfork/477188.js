// ==UserScript==
// @name         Weekly Hour Totals
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Add up the total hours on TechCalendar and display the decimal result for both weeks.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/TechCalendar.php*
// @match        https://office.roofingsource.com/admin/ProductionCalendar.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477188/Weekly%20Hour%20Totals.user.js
// @updateURL https://update.greasyfork.org/scripts/477188/Weekly%20Hour%20Totals.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Assign magic numbers.
    const DAYS_PER_WEEK = 7;
    const NUM_COLUMNS = 16;
    const SECONDS_PER_HOUR = 3600;


    // Convert time strings to seconds, or return 0 for null values.
    const timeFactors = [SECONDS_PER_HOUR, 60, 1];
    const parseTime = (time) => (time === null) ? 0 : time.split(':').reduce((acc, val, index) => acc + parseInt(val) * timeFactors[index], 0);


    /**
     * Calculate total hours for each week.
     * @param {string[]} hoursArray - An array of time strings.
     * @returns {Array<{totalDecimal: string, week: number}>} - An array of week totals.
     */
    const calculateWeeklyTotal = (hoursArray) => {
        const results = [1, 2].map((week) => {
            // Skip index 0 because it contains the tech's name.
            // Skip index 15 because it's always empty.
            const startIndex = (week - 1) * DAYS_PER_WEEK + 1;
            const endIndex = week * DAYS_PER_WEEK;

            const totalSeconds = hoursArray.slice(startIndex, endIndex + 1)
                .filter((time) => time !== null)
                .map(parseTime)
                .reduce((acc, seconds) => acc + seconds, 0);

            const totalDecimal = (totalSeconds / SECONDS_PER_HOUR).toFixed(2);

            return { totalDecimal, week };
        });

        return results;
    };


    // Create dynamic styles for result cells.
    const buildStyle = (background, border) => {
        return `padding: 5px; background-color: ${background}; border: 1px solid ${border}; cursor: pointer;`;
    };


    // Provide visual feedback on copy.
    function provideFeedback(cell) {
        const originalColor = cell.style.backgroundColor;
        cell.style.backgroundColor = '#4CAF50';
        cell.style.transition = 'background-color .5s';

        setTimeout(() => {
            cell.style.backgroundColor = originalColor;
        }, 650);
    }


    // Copy the TSV string to clipboard using Clipboard API.
    function copyToClipboard(text, cell) {
        const plainTextBlob = new Blob([text], { type: 'text/plain' });
        navigator.clipboard.write([new ClipboardItem({ 'text/plain': plainTextBlob })]).then(
            () => {
                provideFeedback(cell);
            },
            (err) => {
                console.error('Unable to copy:', err);
            }
        );
    }


    const table = document.querySelector('div table');

    if (!table) return;

    // Loop through the table rows.
    for (let i = 1; i < table.rows.length; i++) { // Start from 1 to skip the header row.
        const row = table.rows[i];

        if (row.cells.length !== NUM_COLUMNS) {
            continue; // Skip unusual row formats like 'On Account'.
        }

        // Extract cell values and remove 'Timesheet' prefix.
        const rowData = Array.from(row.cells).map((cell) => {
            const cellValue = cell.textContent.trim();
            if (['-', 'Create'].includes(cellValue)) {
                return null;
            }
            return cellValue.replace(/^Timesheet/, ''); // Shouldn't cause issues, unless a tech's name is Timesheet.
        });

        const weekResults = calculateWeeklyTotal(rowData);


        let resultStyle = buildStyle('lightblue', 'blue');
        if (weekResults[0].totalDecimal === '0.00' && weekResults[1].totalDecimal === '0.00') {
            resultStyle = buildStyle('PeachPuff', 'red');
        }

        // Create HTML with row results.
        const totalDecimalEl = `
            <div style='${resultStyle}'>
                Week ${weekResults[0].week}: <b>${weekResults[0].totalDecimal}</b>
                <br>
                Week ${weekResults[1].week}: <b>${weekResults[1].totalDecimal}</b>
            </div>
        `;

        // Insert the HTML into the last cell, since it's originally unused.
        const lastCell = row.cells[NUM_COLUMNS - 1];
        lastCell.innerHTML = totalDecimalEl;

        // Copy week total values on cell click.
        lastCell.addEventListener('click', () => {
            const tsvString = `${weekResults[0].totalDecimal}\t${weekResults[1].totalDecimal}`;
            copyToClipboard(tsvString, lastCell.children[0]);
        });
    }

})();
