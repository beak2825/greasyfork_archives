// ==UserScript==
// @name         Summarize Rapidgator links
// @namespace    https://greasyfork.org/users/30331-setcher
// @version      0.99
// @description  Summarize Rapidgator links and display them with a copy button.
// @author       Setcher
// @match        https://rapidgator.net/folder/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rapidgator.net
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/528355/Summarize%20Rapidgator%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/528355/Summarize%20Rapidgator%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TOGGLE_WWW_KEY = 'toggleWWW';
    const defaultToggleWWW = false;

    // Get the current value or set to default if not exists
    let toggleWWW = GM_getValue(TOGGLE_WWW_KEY, defaultToggleWWW);

    // Register a menu command to toggle the setting
    GM_registerMenuCommand(`Toggle www. (Currently: ${toggleWWW ? 'ON' : 'OFF'})`, function() {
        toggleWWW = !toggleWWW; // Toggle the value
        GM_setValue(TOGGLE_WWW_KEY, toggleWWW); // Save the new value
        alert(`Toggle www. is now ${toggleWWW ? 'ON' : 'OFF'}. Refresh the page to apply changes.`);
    });

    // Function to extract and prepend links
    function extractAndDisplayLinks() {
        // Find the container div where we want to insert the new div (summary div)
        let summaryDiv = document.querySelector('.summary');

        if (!summaryDiv) return;  // If summary div is not found, do nothing

        // Create a new div under the summary div with the 'table_header' class
        let newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'btm');  // Set the class to table_header

        // Heading for the new div
        let heading = document.createElement('div');
        heading.innerHTML = "Rapidgator Links";  // Simplified heading
        newDiv.appendChild(heading);

        // Create a table for displaying the links
        let table = document.createElement('table');
        table.classList.add('items');  // Apply the 'items' class for consistent styling

        // Add table header row
        let thead = document.createElement('thead');
        let headerRow = document.createElement('tr');
        let nameHeader = document.createElement('th');
        nameHeader.textContent = "File Name";
        let copyHeader = document.createElement('th');
        copyHeader.textContent = "Copy";  // Add a column for the "Copy" button
        headerRow.appendChild(nameHeader);
        headerRow.appendChild(copyHeader);  // Append the new header for the "Copy" button
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Extract all file links that start with href="/file/"
        let links = document.querySelectorAll('a[href^="/file/"]');
        let tbody = document.createElement('tbody');

        links.forEach(link => {
            let fileLink = link.getAttribute('href');
            if (fileLink && fileLink.startsWith("/file/")) {
                let addWww = GM.getValue(TOGGLE_WWW_KEY, false)
                let fullLink = 'https://'+ (toggleWWW ? 'www.' : '') +'rapidgator.net' + fileLink;

                // Create a new table row for each link
                let row = document.createElement('tr');
                row.setAttribute('class', 'odd');
                let nameCell = document.createElement('td');

                // Create a link in the first cell
                let fileLinkElement = document.createElement('a');
                fileLinkElement.href = fullLink;
                fileLinkElement.textContent = fullLink; // Use the text of the link
                nameCell.appendChild(fileLinkElement);

                // Create the "Copy" button cell
                let copyCell = document.createElement('td');
                let copyButton = document.createElement('button');
                copyButton.textContent = 'Copy';

                // Apply CSS to center the "Copy" button in the cell
                copyCell.style.textAlign = 'center';  // Center the content horizontally
                copyCell.style.verticalAlign = 'middle';  // Vertically center the button
                copyButton.style.margin = '0 auto';  // Optional: Add some margin for aesthetic spacing

                // Copy button click handler
                copyButton.addEventListener('click', function() {
                    GM_setClipboard(fullLink);
                    alert('Link copied to clipboard!');
                });

                copyCell.appendChild(copyButton);

                // Append the cells to the row
                row.appendChild(nameCell);
                row.appendChild(copyCell);

                // Add the row to the table body
                tbody.appendChild(row);
            }
        });

        // Add the tbody to the table
        table.appendChild(tbody);

        // Add the table to the new div
        newDiv.appendChild(table);

        // Create the "Copy all" button
        let copyAllButton = document.createElement('button');
        copyAllButton.textContent = 'Copy all';

        // Button click handler to copy all links to the clipboard
        copyAllButton.addEventListener('click', function() {
            let allLinks = Array.from(tbody.querySelectorAll('tr')).map(row => {
                let link = row.querySelector('a');
                return link ? link.href : '';
            }).join('\n');
            GM_setClipboard(allLinks);
            alert('All links copied to clipboard!');
        });

        // Add the button below the table
        newDiv.appendChild(copyAllButton);

        // Append the new div with the table to the summary div
        summaryDiv.appendChild(newDiv);
    }

    // Run the script when the page is fully loaded
    window.addEventListener('load', extractAndDisplayLinks);
})();


