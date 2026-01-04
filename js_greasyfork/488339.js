// ==UserScript==
// @name         Highlight RSF team
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  simple highlighter
// @author       Paskalip
// @match        https://*.rallysimfans.hu/rbr/rally_online.php?centerbox=rally_results.php*
// @match        https://*.rallysimfans.hu/rbr/bajnoksag2.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rallysimfans.hu
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488339/Highlight%20RSF%20team.user.js
// @updateURL https://update.greasyfork.org/scripts/488339/Highlight%20RSF%20team.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to fetch data from the provided URL
function fetchData(url, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                callback(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Define CSS classes for highlighting with different colors
    const highlightClasses = {
        'dodgerblue': 'highlight-dodgerblue',
        'darksalmon': 'highlight-darksalmon',
        'khaki': 'highlight-khaki'
        // Add more colors and corresponding classes here
    };

    // Inject CSS classes into the <head>
    Object.entries(highlightClasses).forEach(([color, className]) => {
        GM_addStyle(`.${className} {}`);
        GM_addStyle(`.${className}-highlighted { background-color: ${color}; }`);
    });

    // Array of URLs and their corresponding colors
    const urls = [
        { url: 'https://rallysimfans.hu/rbr/team.php?team_id=42', color: 'dodgerblue' },
        { url: 'https://rallysimfans.hu/rbr/team.php?team_id=185', color: 'darksalmon' },
        { url: 'https://rallysimfans.hu/rbr/team.php?team_id=166', color: 'khaki' },
        { url: 'https://www.rallysimfans.hu/rbr/team.php?team_id=42', color: 'dodgerblue' },
        { url: 'https://www.rallysimfans.hu/rbr/team.php?team_id=185', color: 'darksalmon' },
        { url: 'https://www.rallysimfans.hu/rbr/team.php?team_id=166', color: 'khaki' }
        // Add more URLs and colors here
    ];

    // Loop through each URL
    urls.forEach(({ url, color }) => {
        // Fetch data from the URL
        fetchData(url, function(data) {
            // Parse the HTML content to extract names
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const names = Array.from(htmlDoc.querySelectorAll('table')[20].querySelectorAll('samp'))
                .map(samp => samp.textContent.trim().toLowerCase());

            // Log the names that will be highlighted
            console.log(`Names to highlight (${color}):`, names);

            // Get all table rows
            const rows = document.querySelectorAll('table tr');

            // Loop through each row
            rows.forEach(row => {
                let highlight = false;

                // Select all cells (td elements) in the row
                const cells = row.querySelectorAll('td');

                // Loop through each cell in the row
                cells.forEach(cell => {
                    // Check if the cell content includes any of the highlight substrings (case insensitive)
                    const cellContent = cell.textContent.trim().toLowerCase();
                    if (names.some(substring => cellContent.includes(substring.toLowerCase()))) {
                        highlight = true;
                    }
                });

                // If any cell in the row contains a name to highlight, apply the highlight style to the row with the specified color
                if (highlight) {
                    row.classList.add(highlightClasses[color]);
                    row.classList.add(`${highlightClasses[color]}-highlighted`);
                    }
            });

            // Exclude highlighted rows containing tables
            const highlightedRows = document.querySelectorAll('tr[class^="highlight"]');
            highlightedRows.forEach(highlightedRow => {
                if (highlightedRow.querySelector('table')) {
                    // Row contains a nested table, remove the highlight class
                    Object.values(highlightClasses).forEach(className => {
                        highlightedRow.classList.remove(className);
  highlightedRow.classList.remove(`${className}-highlighted`);
                    });
                    console.log('Excluded row with table:', highlightedRow);
                }
            });
        });
    });

    // Function to toggle highlighting on and off
    function toggleHighlighting(color) {
        const highlightedRows = document.querySelectorAll(`.${highlightClasses[color]}`);
        highlightedRows.forEach(row => {
            row.classList.toggle(`${highlightClasses[color]}-highlighted`); // Toggle highlighted class
        });
    }

    // Create a table element to inject into the page
    const injectedTable = document.createElement('table');
    injectedTable.setAttribute('bgcolor', '#FFFFFF'); // Set background color
    injectedTable.setAttribute('width', '1200'); // Set width
    injectedTable.style.padding = '0 20px'; // Set padding

    // Create a row for the table
    const injectedRow = injectedTable.insertRow();

    // Create boxes and names
    Object.entries(highlightClasses).forEach(([color, className]) => {
        // Create a cell for each box and name
        const boxCell = injectedRow.insertCell();
        const nameCell = injectedRow.insertCell();

        // Style the box
        boxCell.classList.add(`${highlightClasses[color]}-highlighted`);
        boxCell.classList.add(highlightClasses[color]);
        boxCell.style.width = '30px'; // Set width
        boxCell.style.height = '30px'; // Set height
        boxCell.style.margin = '10px';
        boxCell.style.border = '1px solid black'; // Add border
        boxCell.style.cursor = 'pointer'; // Change cursor to pointer

        // Add event listener to toggle highlighting on click
        boxCell.addEventListener('click', function() {
            toggleHighlighting(color);
        });

        // Add name next to the box
        const name = document.createTextNode(getNameForColor(color)); // Replace getNameForColor with your function to get the name
        nameCell.appendChild(name);
        nameCell.style.whiteSpace = 'nowrap';
        nameCell.style.paddingRight = '10px';
        nameCell.style.cursor = 'pointer';


        // Add event listener to toggle highlighting on click
        nameCell.addEventListener('click', function() {
            toggleHighlighting(color);
        });
    });

    // Inject the table into the page after the second table in the page-wrap div
    const pageWrapDiv = document.getElementById('page-wrap');
    const secondTable = pageWrapDiv.querySelector('table:nth-of-type(3)');
    secondTable.parentNode.insertBefore(injectedTable, secondTable.nextSibling);
    // Function to get name for a color
    function getNameForColor(color) {
        // Define names for each color
        const colorNames = {
            'dodgerblue': 'Flatout',
            'darksalmon': 'Sporco',
            'khaki': 'PZ Motorsport'
            // Add more color names here
        };
        return colorNames[color] || 'Unknown';
    }

})();
