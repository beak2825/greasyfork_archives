// ==UserScript==
// @name         JSON to Custom Table with API Update
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Parses JSON, generates a custom-styled table, and updates data from API
// @match        *://1xbit8.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/516970/JSON%20to%20Custom%20Table%20with%20API%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/516970/JSON%20to%20Custom%20Table%20with%20API%20Update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define custom table styles
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-table {
            position: fixed;
            top: 60px;
            left: 30px;
            border: 3px solid black;
            background-color: white;
            font-size: 20px;
            vertical-align: middle;
            z-index: 999999999;
        }
        .custom-table td {
            border: 1px solid black;
            padding: 5px;
        }
        .custom-table td:first-child {
            width: 200px;
            text-align: right;
            padding-right: 10px;
        }
        .custom-table td:nth-child(2) {
            width: 150px;
            text-align: center;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    let data = {}; // Default data object

    // Function to parse JSON and generate table
    function generateTable(data) {
        const table = document.createElement('table');
        table.className = 'custom-table';

        // Array to hold the table rows with the required IDs and values
        const rows = [
            { label: 'Home Team', id: 'HomeTeam', value: data.Value?.O1 || 'N/A' },
            { label: 'Away Team', id: 'AwayTeam', value: data.Value?.O2 || 'N/A' },
            { label: 'Home Score', id: 'HomeScore', value: data.Value?.SC?.FS?.S1 || 'N/A' },
            { label: 'Away Score', id: 'AwayScore', value: data.Value?.SC?.FS?.S2 || 'N/A' },
            { label: 'Minute', id: 'Minute', value: data.Value?.SC?.TS ? `${data.Value.SC.TS} min` : 'N/A' },
            { label: 'Status', id: 'Status', value: data.Value?.SC?.CPS || 'N/A' }
        ];

        // Create rows for each item in rows array
        rows.forEach(rowData => {
            const row = document.createElement('tr');
            row.id = rowData.id; // Set ID on the <tr> element

            // First column with label
            const labelCell = document.createElement('td');
            labelCell.textContent = rowData.label;
            row.appendChild(labelCell);

            // Second column with value
            const valueCell = document.createElement('td');
            valueCell.textContent = rowData.value;
            row.appendChild(valueCell);

            table.appendChild(row);
        });

        return table;
    }

    // Function to update the table with new data
    function updateTable() {
        const preElement = document.querySelector('html > body > pre');
        if (preElement) {
            const table = generateTable(data);
            preElement.innerHTML = '';
            preElement.appendChild(table);
        }
    }

    // Function to fetch data from API and update the table
    function update1xbkData() {
        console.log('Updating data - update1xbkData');
        const http = new XMLHttpRequest();
        const url = document.location.href; // Use current URL for the API request
        http.open("GET", url, true);
        http.onreadystatechange = function () {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    if (http.responseText && http.responseText.length > 0) {
                        data = JSON.parse(http.responseText);
                        updateTable(); // Update table with new data
                    } else {
                        updateTable(); // Update table with empty data if no response
                    }
                }
                setTimeout(update1xbkData, randomSleep());
            }
        };
        http.send();
    }

    // Function to generate random sleep time between 7 and 15 seconds
    function randomSleep() {
        return Math.floor(Math.random() * (15000 - 7000 + 1)) + 7000;
    }

    // Initial call to update data and set the interval
    update1xbkData();

})();
