// ==UserScript==
// @name         NitroType - More Detailed Stats
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Gets more data about your races automatically for N pages (includes races length / errors!)
// @author       dphdmn
// @match        https://www.nitrotype.com/racelog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516294/NitroType%20-%20More%20Detailed%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/516294/NitroType%20-%20More%20Detailed%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let maxRaces = -1;
    let maxPages = -1;
    const button = document.querySelector('.btn.btn--light.btn--outline.btn--thin.btn--xs');
    if (button) {
        button.style.display = 'none';
    }
    // Function to extract and validate the race ID
    function matchPagesN(url) {
        // Use a regular expression to extract the number after the last "/"
        const match = url.match(/\/(\d+)$/);

        // Check if a match was found and if the number is valid
        if (match && match[1]) {
            const raceId = parseInt(match[1], 10);

            // Check if the extracted number is a valid integer greater than 0
            if (Number.isInteger(raceId) && raceId > 0) {
                console.log(`Race ID: ${raceId}`);
                return raceId;
            } else {
                console.error('Invalid Race ID: Number must be an integer greater than 0');
                return null;
            }
        } else {
            console.error('Race ID not found in the URL');
            return null;
        }
    }

    // Call the function with the current URL
    const raceId = matchPagesN(window.location.href);
    const NT_TOKEN = `Bearer ${localStorage.getItem("player_token")}`;

    // Converts a single race log entry to the new structure
    function parseRaceLog(log) {
        return {
            WPM: ((log.typed / 5) / (log.secs / 60)).toFixed(2),
            Accuracy: ((1 - log.errs / log.typed) * 100).toFixed(2),
            Duration: log.secs,
            Length: log.typed,
            Errors: log.errs,
            Placed: log.placed,
            Cash: log.reward?.money ?? 0,
            Exp: log.reward?.exp ?? 0,
            Nitro_Used: log.nitros > 0,
            Timestamp: log.stamp,
            Date: new Date(log.stamp * 1000).toLocaleString()
        };
    }

    // Fetches a single page of race log data, with retry logic
    async function fetchRaceLogPage(pageNumber, retries = 3) {
        const url = `https://www.nitrotype.com/api/v2/stats/data/racelog?page=${pageNumber}&limit=30`;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, {
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "authorization": NT_TOKEN,
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                    },
                    referrer: "https://www.nitrotype.com/racelog/racelog",
                    referrerPolicy: "same-origin",
                    method: "GET",
                    mode: "cors",
                    credentials: "include"
                });

                const data = await response.json();

                if (data.status === "OK" && data.results && Array.isArray(data.results.logs)) {
                    maxRaces = data.results.totalRecords;
                    maxPages = Math.ceil(maxRaces / 30);
                    return data.results.logs;
                } else {
                    console.warn(`Attempt ${attempt} failed for page ${pageNumber}: Status not OK or logs not found.`);
                }
            } catch (error) {
                console.error(`Attempt ${attempt} failed for page ${pageNumber}:`, error);
            }

            // Small delay before retrying (optional)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.warn(`Failed to fetch page ${pageNumber} after ${retries} attempts.`);
        return null;
    }

    // Generates and inserts a new row in the table with parsed log data
    function addRaceLogRow(parsedLog) {
        const table = document.querySelector(".well--l_p table");

        const row = document.createElement("tr");
        row.className = "table-row";

        row.innerHTML = `
    <td class="table-cell">${parsedLog.WPM}</td>
    <td class="table-cell">${parsedLog.Accuracy}</td>
    <td class="table-cell">${parsedLog.Duration}</td>
    <td class="table-cell">${parsedLog.Length}</td>
    <td class="table-cell">${parsedLog.Errors}</td>
    <td class="table-cell">${parsedLog.Placed}</td>
    <td class="table-cell">${parsedLog.Cash}</td>
    <td class="table-cell">${parsedLog.Exp}</td>
    <td class="table-cell">${parsedLog.Nitro_Used ? "Yes" : "No"}</td>
    <td class="table-cell">${parsedLog.Timestamp}</td>
    <td class="table-cell">${parsedLog.Date}</td>
  `;

        table.appendChild(row);
    }

    // Displays the current page loading progress
    function updateProgress(currentPage, totalPages, races) {
        if (maxPages !== -1) {
            totalPages = Math.min(maxPages, totalPages);
        }
        const progressElement = document.querySelector(".well--l_p .loading-progress");

        if (!progressElement) {
            // If no progress element exists, create and insert it above the table
            const newProgressElement = document.createElement("div");
            newProgressElement.className = "loading-progress";
            newProgressElement.textContent = `Loaded ${currentPage} out of ${totalPages} pages... (${races} latest races)`;
            const tableContainer = document.querySelector(".well--l_p");
            tableContainer.insertBefore(newProgressElement, tableContainer.firstChild);
        } else {
            // Update existing progress element
            if (currentPage === totalPages) {
                // If all pages are loaded, make the text bold and bright green
                progressElement.textContent = `All ${totalPages} pages are loaded (${races} latest races)`;
                progressElement.style.color = "rgb(0, 255, 0)"; // Bright green
                progressElement.style.fontWeight = "bold";
            } else {
                progressElement.textContent = `Loaded ${currentPage} out of ${totalPages} pages... (${races} latest races)`;
                progressElement.style.color = ""; // Reset to default color
                progressElement.style.fontWeight = ""; // Reset to normal font weight
            }
        }
    }

    let total = 0;
    // Fetches race logs for the first N pages, parses, and displays them progressively
    async function fetchRaceLogsForNPages(n) {
        const tableContainer = document.querySelector(".well--l_p");

        // Create the table and insert it into the container
        const table = document.createElement("table");
        table.className = "table table--striped table--selectable";
        table.innerHTML = `
    <thead class="table-head">
      <tr class="table-row">
        <th class="table-cell">WPM</th>
        <th class="table-cell">Accuracy</th>
        <th class="table-cell">Duration</th>
        <th class="table-cell">Length</th>
        <th class="table-cell">Errors</th>
        <th class="table-cell">Placed</th>
        <th class="table-cell">Cash</th>
        <th class="table-cell">Exp</th>
        <th class="table-cell">Nitro</th>
        <th class="table-cell">Timestamp</th>
        <th class="table-cell">Date</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
        tableContainer.appendChild(table);

        for (let i = 0; i < n; i++) {
            if (maxPages === -1 || i < maxPages) {
                const pageLogs = await fetchRaceLogPage(i);

                if (pageLogs) {
                    // Parse and add each log entry as a row
                    pageLogs.map(parseRaceLog).forEach(addRaceLogRow);
                } else {
                    alert(`Error loading at page ${i} due to repeated failures.`);
                    i = 100000;
                }
                total += pageLogs.length;
                // Update loading progress
                updateProgress(i + 1, n, total);
            } else {
                updateProgress(maxPages, maxPages, total);
            }
        }
    }
    if (raceId) {
        fetchRaceLogsForNPages(raceId);
    }


    function addButtonAndHandleInput() {
        // Find the element
        const splitCell = document.querySelector('div.split-cell h1.h2.tbs');

        // Create the button element
        const button = document.createElement('button');
        button.classList.add('btn', 'btn--primary');
        button.textContent = 'Load Multiple Pages Data';

        // Make the button glow cyan
        button.style.boxShadow = '0 0 10px purple';

        // Insert the button below the header
        splitCell.insertAdjacentElement('afterend', button);

        // Handle button click
        button.addEventListener('click', () => {
            // Ask user for input
            const pages = prompt("Please input pages to load (each page = 30 races)");

            // Check if the input is a valid positive integer
            if (pages && !isNaN(pages) && Number(pages) > 0) {

                // Navigate to the corresponding page
                window.location.href = `https://www.nitrotype.com/racelog/${pages}`;
            } else {
                // Alert if input is invalid
                alert("Please enter a valid number greater than 0.");
            }
        });
    }

    // Call the function to add the button and handle the logic
    addButtonAndHandleInput();


})();