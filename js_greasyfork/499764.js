// ==UserScript==
// @name         WPRS predictions for you
// @namespace    wprs-predictions
// @version      0.1.1
// @description  Adds data from WPRS-forecast.org and calculates probable points for you.
// @author       Kuba Sto
// @match        https://civlcomps.org/event/*/participants*
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499764/WPRS%20predictions%20for%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/499764/WPRS%20predictions%20for%20you.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add extra styles
    const style = document.createElement('style');
    style.textContent = `
        .wprs-forecast-summary {
            margin-top: .5em;
            display: block;
            color: unset;
        }
        .wprs-forecast-summary:hover {
            color: unset;
            text-decoration: underline;
        }
        .wprs-forecast-prediction {
            font-size: 1.4em;
            color: gold;
        }
        #forecast {
            padding-inline: 30px;
            max-width: 100vw;
        }
        #forecast h3 {
            font-size: 16px;
            font-weight: 400;
            background-color: #1b2739;
            color: white;
            padding: .5em 1em;
        }
        #forecast table {
            width: 100%;
        }
        #extra-current-user {
            background-color: gold;
            scroll-margin-top: 50vh;
        }
        #forecast td:nth-child(1),
        #forecast td:nth-child(4),
        #forecast td:nth-child(5) {
            white-space: nowrap;
        }
        .headerRow.participants-item th:first-child {
            width: 40px;
        }
        .participants-item table td {
            padding-block: 5px;
            padding-right: 10px;
        }
        html {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);

    // Fetch the WPRS forecast data using GM.xmlHttpRequest
    function fetchForecastData(eventUrl) {
        return new Promise((resolve, reject) => {
            const forecastUrl = `https://wprs-forecast.org/forecast?url=${eventUrl}`;
            GM.xmlHttpRequest({
                method: 'GET',
                url: forecastUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        // Select the last table on the page
                        const tables = doc.querySelectorAll('table');
                        const lastTable = tables[tables.length - 1];
                        const tableRows = lastTable.querySelectorAll('tbody tr');

                        const forecastData = Array.from(tableRows).map(row => {
                            const points = row.querySelector('td:nth-child(2)').textContent.trim();
                            return points;
                        });

                        resolve(forecastData);
                    } else {
                        reject(new Error('Failed to fetch forecast data'));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // Get the current event URL
    function getCurrentEventUrl() {
        return window.location.href.split('/participants')[0];
    }

    // Get confirmed and wildcard rows from the table
    function getConfirmedRows(table) {
        return Array.from(table.querySelectorAll('tbody tr')).filter(row => {
            const statusCell = row.querySelector('[data-col="status"]');
            const statusText = statusCell ? statusCell.textContent.trim().toLowerCase() : '';
            return statusText === 'confirmed' || statusText === 'wildcard';
        }).map(row => row.cloneNode(true)); // Clone the row to avoid modifying the original table
    }

    // Sort rows by rank
    function sortRowsByRank(rows) {
        return rows.sort((a, b) => {
            const rankA = parseInt(a.querySelector('[data-col="rank"]').textContent.trim()) || Number.MAX_VALUE;
            const rankB = parseInt(b.querySelector('[data-col="rank"]').textContent.trim()) || Number.MAX_VALUE;
            return rankA - rankB;
        });
    }

    // Remove unwanted columns
    function removeUnwantedColumns(row) {
        ['index', 'bib', 'ioc', 'harness_model', 'sponsor', 'ranking_date', 'status'].forEach(col => {
            const cell = row.querySelector(`[data-col="${col}"]`);
            if (cell) {
                cell.remove();
            }
        });
    }

    // Create a combined male + female table
    function createCombinedTable(rows, forecastData) {
        const table = document.createElement('table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = ['#', 'Name', 'Glider', 'Rank', 'Forecast'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        rows.forEach((row, index) => {
            const newRow = document.createElement('tr');

            // Auto-numbering
            const numberCell = document.createElement('td');
            numberCell.textContent = index + 1;
            newRow.appendChild(numberCell);

            // Add existing cells
            Array.from(row.querySelectorAll('td')).forEach(cell => {
                const newCell = document.createElement('td');
                newCell.textContent = cell.textContent.trim();
                newRow.appendChild(newCell);
            });

            // Add Forecast cell
            const forecastCell = document.createElement('td');
            forecastCell.textContent = forecastData[index] || '';
            newRow.appendChild(forecastCell);

            tbody.appendChild(newRow);
        });

        table.appendChild(tbody);
        return table;
    }

    // Append the combined table after the .content-event section
    function appendCombinedTableAfterContent(table) {
        const forecastAside = document.createElement('aside');
        forecastAside.setAttribute('id', 'forecast');
        forecastAside.className = 'participants-item';

        // Create and insert the heading before the table
        const heading = document.createElement('h3');
        heading.textContent = 'WPRS Predictions';
        forecastAside.appendChild(heading);

        forecastAside.appendChild(table);

        const contentSection = document.querySelector('.content');
        contentSection.appendChild(forecastAside);
    }

    // Fetch CIVL ID from my-account page
    function fetchCIVLId() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://civlcomps.org/my-account',
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const civlId = doc.querySelector('label.control-label + span.text-bold').textContent.trim();
                        resolve(civlId);
                    } else {
                        reject(new Error('Failed to fetch CIVL ID'));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // Fetch pilot details using CIVL ID
    function fetchPilotDetails(civlId) {
        return new Promise((resolve, reject) => {
            const pilotUrl = `https://civlcomps.org/pilot/${civlId}`;
            GM.xmlHttpRequest({
                method: 'GET',
                url: pilotUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const pilotName = doc.querySelector('h1.title-pilot').textContent.trim();
                        const worldRank = doc.querySelector('div.body-rank tbody tr:nth-child(2) td:nth-child(2)').textContent.trim();
                        resolve({ name: pilotName, rank: parseInt(worldRank) });
                    } else {
                        reject(new Error('Failed to fetch pilot details'));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // Add current user to the combined table
    function addCurrentUserToTable(table, currentUser, forecastData) {
        const newRow = document.createElement('tr');
        newRow.setAttribute('id', 'extra-current-user');

        // Empty number cell for the new row
        const numberCell = document.createElement('td');
        newRow.appendChild(numberCell);

        // Add pilot details
        const nameCell = document.createElement('td');
        nameCell.textContent = currentUser.name;
        newRow.appendChild(nameCell);

        const gliderCell = document.createElement('td');
        gliderCell.textContent = ''; // Assuming glider info is not available
        newRow.appendChild(gliderCell);

        const rankCell = document.createElement('td');
        rankCell.textContent = currentUser.rank;
        newRow.appendChild(rankCell);

        // Calculate and add forecast value as average of nearby pilot's values
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        let forecastValue = '';
        for (let i = 0; i < rows.length; i++) {
            const rank = parseInt(rows[i].querySelector('td:nth-child(4)').textContent.trim()) || Number.MAX_VALUE;
            if (currentUser.rank < rank) {
                const prevForecast = parseFloat(rows[i - 1]?.querySelector('td:nth-child(5)').textContent) || 0;
                const nextForecast = parseFloat(rows[i]?.querySelector('td:nth-child(5)').textContent) || 0;
                forecastValue = ((prevForecast + nextForecast) / 2).toFixed(1);
                break;
            }
        }

        const forecastCell = document.createElement('td');
        forecastCell.textContent = forecastValue;
        newRow.appendChild(forecastCell);

        // Find the correct position to insert the new row based on rank
        let inserted = false;
        for (let i = 0; i < rows.length; i++) {
            const rank = parseInt(rows[i].querySelector('td:nth-child(4)').textContent.trim()) || Number.MAX_VALUE;
            if (currentUser.rank < rank) {
                table.querySelector('tbody').insertBefore(newRow, rows[i]);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            table.querySelector('tbody').appendChild(newRow);
        }

        return forecastValue;
    }

    // Insert forecast information to the event header
    function insertForecastInfoForCurrentUser(currentUser, forecastValue, maxForecast) {
        const placeEvent = document.querySelector('.place-event');
        if (!placeEvent) return;

        const forecastLink = document.createElement('a');
        forecastLink.className = 'wprs-forecast-summary';
        forecastLink.href = '#extra-current-user';

        const forecastText = document.createElement('span');
        forecastText.textContent = `Predicted points for ${currentUser.name}: `;

        const forecastValueSpan = document.createElement('span');
        forecastValueSpan.className = 'wprs-forecast-prediction';
        forecastValueSpan.textContent = forecastValue;

        const maxForecastText = document.createElement('span');
        maxForecastText.textContent = ` / `;

        const maxForecastSpan = document.createElement('span');
        maxForecastSpan.className = 'wprs-forecast-max';
        maxForecastSpan.textContent = maxForecast;

        forecastLink.appendChild(forecastText);
        forecastLink.appendChild(forecastValueSpan);
        forecastLink.appendChild(maxForecastText);
        forecastLink.appendChild(maxForecastSpan);

        placeEvent.parentNode.insertBefore(forecastLink, placeEvent.nextSibling);
    }

    // Combine tables and fetch forecast data
    async function combineTables() {
        try {
            const tables = document.querySelectorAll('.participants-item table');
            if (tables.length < 2) return;

            const allConfirmedRows = [];
            tables.forEach(table => {
                const confirmedRows = getConfirmedRows(table);
                allConfirmedRows.push(...confirmedRows);
            });

            const sortedRows = sortRowsByRank(allConfirmedRows);
            sortedRows.forEach(removeUnwantedColumns);

            const eventUrl = getCurrentEventUrl();
            const forecastData = await fetchForecastData(eventUrl);

            const combinedTable = createCombinedTable(sortedRows, forecastData);
            appendCombinedTableAfterContent(combinedTable);

            // Fetch current user details and add to the table
            const civlId = await fetchCIVLId();
            const currentUser = await fetchPilotDetails(civlId);
            const forecastValue = addCurrentUserToTable(combinedTable, currentUser, forecastData);

            // Insert forecast information for the current user after the first .place-event
            const maxForecast = Math.max(...forecastData.map(f => parseFloat(f) || 0));
            insertForecastInfoForCurrentUser(currentUser, forecastValue, maxForecast);
        } catch (error) {
            console.error('Error combining tables and fetching forecast data:', error);
        }
    }

    window.addEventListener('load', combineTables);
})();
