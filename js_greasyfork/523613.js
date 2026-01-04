// ==UserScript==
// @name         Plushie Tycoon+
// @version      0.2
// @description  QOL additions to Plushie Tycoon. Adds Select All button to Warehouse and Start Job. Adds data to Existing Jobs
// @author       Posterboy
// @match        https://www.neopets.com/games/tycoon/*
// @grant        none
// @namespace https://greasyfork.org/users/1277376
// @downloadURL https://update.greasyfork.org/scripts/523613/Plushie%20Tycoon%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/523613/Plushie%20Tycoon%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================
    // Constants (For the whole script)
    // ============================

    // Constant for UNIX timestamp to human-readable conversion
    const convertUnixTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    // ========================
    // Factory Functions
    // ========================

    // Function to add "Order Number" and "Start Time" columns to the factory table
    function addOgrinCountAndTimestampToFactory() {
        const table = document.querySelector('table[border="0"][width="70%"]');
        if (!table) {
            console.log("Factory table not found!");
            return;
        }

        console.log("Factory table found!");

        const rows = table.querySelectorAll('tr'); // Get all rows in the table

        // Add header columns for "Order Number" and "Start Time"
        const headerRow = table.querySelector('tr');
        const newOrderNumberHeader = document.createElement('th');
        newOrderNumberHeader.textContent = "Order Number";
        newOrderNumberHeader.style.fontFamily = 'Verdana, Arial, Helvetica, sans-serif';
        newOrderNumberHeader.style.fontSize = '9pt';
        const newStartTimeHeader = document.createElement('th');
        newStartTimeHeader.textContent = "Job Ordered";
        newStartTimeHeader.style.fontFamily = 'Verdana, Arial, Helvetica, sans-serif';
        newStartTimeHeader.style.fontSize = '9pt';
        headerRow.appendChild(newStartTimeHeader);
        headerRow.insertBefore(newOrderNumberHeader, newStartTimeHeader);

        let rowNumber = 0; // Variable to count Ogrin rows

        // Scan for rows that begin with Ogrin
        rows.forEach(row => {
            const speciesCell = row.querySelector('td b');
            if (speciesCell && speciesCell.textContent.trim() === "Ogrin") {
                rowNumber++;

                // Create a new cell for the order number
                const orderNumberCell = document.createElement('td');
                orderNumberCell.textContent = rowNumber; // Set the row number
                orderNumberCell.style.fontWeight = 'bold';
                orderNumberCell.style.color = 'red';

                // Add the UNIX timestamp as the "Start Time" in the new last column
                const timestampCell = document.createElement('td');
                const timerValue = row.querySelector('a').href.split('timer=')[1].split('&')[0];
                const humanReadableDate = convertUnixTimestamp(timerValue);
                timestampCell.textContent = humanReadableDate;

                // Insert the order number cell before the timestamp cell (so it appears second to last)
                row.insertBefore(orderNumberCell, row.lastChild);

                // Append the timestamp cell as the last column
                row.appendChild(timestampCell);
            }
        });
    }

    // Automatically select all radio buttons when starting a job
    function selectAllRadioButtonsOnFactoryStartPage() {
        if (window.location.href.includes('factory.phtml')) {
            const radioButtons = document.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.checked = true;
            });

            console.log("Radio buttons selected on factory start page!");
        }
    }

    // ==========================
    // Warehouse Functions
    // ==========================

    // Function to toggle the "Select All" checkboxes when the radio button is checked
    function toggleSelectAll() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectAllRadio = document.getElementById('selectAllRadio');

        // If the radio button is checked, select all checkboxes, otherwise uncheck all
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllRadio.checked;
        });
    }

    // Function to add a "Select All" radio button to the warehouse table
    function addSelectAllRadioButtonToWarehouse() {
        const table = document.querySelector('table[border="0"][width="90%"]');
        if (!table) {
            console.log("Warehouse table not found!");
            return;
        }

        console.log("Warehouse table found!");

        // Create a new row at the bottom with a radio button to select all checkboxes
        const selectAllRow = document.createElement('tr');
        const selectAllCell = document.createElement('td');
        selectAllCell.setAttribute('colspan', 5); // Adjust the colspan as necessary for your table
        selectAllRow.appendChild(selectAllCell);

        const selectAllRadio = document.createElement('input');
        selectAllRadio.type = 'radio';
        selectAllRadio.id = 'selectAllRadio';
        selectAllRadio.addEventListener('change', toggleSelectAll); // Bind the event to toggle checkboxes
        selectAllCell.appendChild(selectAllRadio);
        selectAllCell.appendChild(document.createTextNode(' Select All'));

        // Append the row with the radio button to the table
        table.appendChild(selectAllRow);

        console.log("Warehouse radio button row added!");
    }

    // ============================
    // Page Load Event Handling
    // ============================

    // Wait for the page to fully load before applying modifications
    window.addEventListener('load', function() {
        console.log("Page loaded!");

        // Check if we're on the Factory page
        if (window.location.href.includes('factory.phtml')) {
            console.log("On Factory page!");
            addOgrinCountAndTimestampToFactory();
            selectAllRadioButtonsOnFactoryStartPage();
        }

        // Check if we're on the Warehouse page
        if (window.location.href.includes('warehouse.phtml')) {
            console.log("On Warehouse page!");
            addSelectAllRadioButtonToWarehouse();
        }
    });

})();
