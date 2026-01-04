// ==UserScript==
// @name         VRC Teams filter
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Filter nominated drivers for each round of VRC with a loading indicator
// @author       Paskalip
// @match        https://rallysimfans.hu/rbr/bajnoksag2.php?bajnoksag_id=278*
// @match        https://www.rallysimfans.hu/rbr/bajnoksag2.php?bajnoksag_id=278*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rallysimfans.hu
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/492278/VRC%20Teams%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/492278/VRC%20Teams%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to fetch CSV data from the Google Sheet URL
    async function fetchCSVData(csvURL) {
        // Display loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = 'Loading VRC Teams data...';
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.padding = '10px';
        loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        loadingIndicator.style.color = 'white';
        loadingIndicator.style.zIndex = '9999';
        document.body.appendChild(loadingIndicator);

        try {
            const response = await fetch(csvURL);
            if (!response.ok) {
                throw new Error('Failed to fetch CSV data');
            }
            const csvText = await response.text();
            const csvData = parseCSV(csvText);
            return csvData;
        } catch (error) {
            console.error('Error fetching CSV data:', error);
            return [];
        } finally {
            // Remove loading indicator once fetching is complete
            loadingIndicator.remove();
        }
    }

    // Function to parse CSV text into a 2D array of rows and columns
    function parseCSV(csvText) {
        const rows = csvText.split('\n');
        const csvData = rows.map(row => row.split(',').map(cell => cell.trim()));
        return csvData;
    }

    // Inject CSS classes into the <head>
    GM_addStyle(`.vrc-hidden-yes { display: none; }`);
    GM_addStyle(`.vrc-box-off { background: none!important; }`);

    // Define Google Sheet CSV URL
    const googleSheetCSVURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTD-AbRLi0GTSF6o0uDs2DqEB6EHt7s2R3tKfEXfE_kcwMctw4NTpDEYqA4LsykuaN2XWEmBYp0W9T/pub?gid=1116387936&single=true&output=csv';

    // Fetch CSV data from Google Sheet
    fetchCSVData(googleSheetCSVURL)
        .then(csvData => {
            // Extract substrings longer than 3 characters from CSV data
            const substrings = csvData.flat().filter(cell => cell.length > 3);

            // Log the substrings that will be used for highlighting
            console.log('Substrings to highlight:', substrings);

            // Get all table rows in the target page
            const rows = document.querySelectorAll('table tr');

            // Loop through each row
            rows.forEach(row => {
                let shouldHighlight = false;

                // Select all cells (td elements) in the row
                const cells = row.querySelectorAll('td');

                // Loop through each cell in the row
cells.forEach(cell => {
    // Remove spaces from cell content, convert to lowercase
    const cellContent = cell.textContent.replace(/\s/g, '').toLowerCase();

    // Check if any substring matches (ignoring spaces), case insensitive
    if (substrings.some(substring => {
        const trimmedSubstring = substring.replace(/\s/g, '').toLowerCase();
        return cellContent.includes(trimmedSubstring);
    })) {
        shouldHighlight = true;
    }
});

                // If any cell in the row contains a substring to highlight, apply the highlight class
                if (shouldHighlight) {
                    row.classList.add('highlighted'); // Add the highlight class
                }
            });

            // Exclude highlighted rows containing tables
            const highlightedRows = document.querySelectorAll('tr[class^="highlight"]');
            highlightedRows.forEach(highlightedRow => {
                if (highlightedRow.querySelector('table')) {
                    // Row contains a nested table, remove the highlight class
                    highlightedRow.classList.remove('highlighted');
                }
            });

            // Hide rows that do not meet the criteria
            const allRows = document.querySelectorAll('table tr');
            allRows.forEach(row => {
                if (!row.classList.contains('highlighted')) {
                    const secondTd = row.querySelector('td:nth-child(2)'); // Get the second td element
                    if (secondTd) {
                        const linkElement = secondTd.querySelector('a[href*="usersstats.php?user_stats="]');
                        if (linkElement) {
                            // Row meets the additional criteria, hide it
                            row.classList.add('vrc-hidden');
                            row.classList.add('vrc-hidden-yes');
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or processing CSV data:', error);
        });

    // Function to toggle highlighting on and off
    function toggleHighlighting() {
        const highlightedRows = document.querySelectorAll(`.vrc-hidden`);
        highlightedRows.forEach(row => {
            row.classList.toggle(`vrc-hidden-yes`); // Toggle highlighted class
        });
        const vrcbox = document.querySelector(`.vrc-box`);
        vrcbox.classList.toggle(`vrc-box-off`);
    }

    // Create a table element to inject into the page
    const injectedTable = document.createElement('table');
    injectedTable.setAttribute('bgcolor', '#FFFFFF'); // Set background color
    injectedTable.setAttribute('width', '1200'); // Set width
    injectedTable.style.padding = '0 20px'; // Set padding

    // Create a row for the table
    const injectedRow = injectedTable.insertRow();

    // Create boxes and names

    // Create a cell for each box and name
    const boxCell = injectedRow.insertCell();
    const nameCell = injectedRow.insertCell();

    // Style the box
    boxCell.classList.add("vrc-box");
    boxCell.style.background = 'green'; // Set colour
    boxCell.style.width = '30px'; // Set width
    boxCell.style.height = '30px'; // Set height
    boxCell.style.margin = '10px';
    boxCell.style.border = '1px solid black'; // Add border
    boxCell.style.cursor = 'pointer'; // Change cursor to pointer

    // Add event listener to toggle highlighting on click
    boxCell.addEventListener('click', function() {
        toggleHighlighting();
    });

    // Add name next to the box
    const name = document.createTextNode("VRC Teams Filter"); // Replace getNameForColor with your function to get the name
    nameCell.appendChild(name);
    nameCell.style.whiteSpace = 'nowrap';
    nameCell.style.paddingLeft = '10px';
    nameCell.style.cursor = 'pointer';

    // Add event listener to toggle highlighting on click
    nameCell.addEventListener('click', function() {
        toggleHighlighting();
    });

    // Inject the table into the page after the second table in the page-wrap div
    const pageWrapDiv = document.getElementById('page-wrap');
    const secondTable = pageWrapDiv.querySelector('table:nth-of-type(3)');
    secondTable.parentNode.insertBefore(injectedTable, secondTable.nextSibling);

})();