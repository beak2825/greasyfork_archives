// ==UserScript==
// @name         Auto Download Excel Files
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically download all Excel files after login
// @author       YourName
// @match        https://universalmedicalrecord.com/dhanvantari*   // Replace with the actual website domain
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521014/Auto%20Download%20Excel%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/521014/Auto%20Download%20Excel%20Files.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Define the ranges to automate
    const ranges = [
        { start: 1, end: 200 },
        { start: 201, end: 400 },
        { start: 401, end: 600 },
        // Add more ranges as needed
    ];

    // Function to simulate a click on the "Export to Excel" button
    function downloadExcelFile(range) {
        console.log(`Downloading for range: ${range.start} to ${range.end}`);

        // Find the export button (ExcelDisplay2007)
        const excelButton = document.querySelector('[data-format="ExcelDisplay2007"]');
        if (excelButton) {
            // Simulate the click event
            excelButton.click();
            console.log('Export button clicked');
        } else {
            console.error('Excel export button not found!');
        }
    }

    // Main function to loop through the ranges
    async function downloadAllFiles() {
        for (const range of ranges) {
            console.log(`Processing range: ${range.start}-${range.end}`);

            // Simulate inputting the range (you may need to adjust this)
            const inputField = document.querySelector('input[name="rangeInput"]'); // Replace with the actual input field
            if (inputField) {
                inputField.value = `${range.start}-${range.end}`;
                console.log(`Set input range: ${inputField.value}`);
            } else {
                console.warn('Range input field not found, skipping input!');
            }

            // Trigger the Excel download
            downloadExcelFile(range);

            // Wait for a few seconds to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust delay as needed
        }

        console.log('All files downloaded!');
    }

    // Run the script when you execute it manually
    console.log('Tampermonkey script loaded. Press Ctrl+Shift+I to check the console.');
    downloadAllFiles();
})();
