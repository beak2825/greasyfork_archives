// ==UserScript==
// @name         Groups Related Entries for tider UI
// @version      1.1
// @description  Groups related entries via VideoID. Fetches & sets its video title for grouped entries — grouped entries can be collapsed & expanded (via element.click or checkbox) — configurable initial state and UI.
// @author       Jicetus
// @match        https://sb.ltn.fi/username/*
// @match        https://sb.ltn.fi/userid/*
// @match        https://sb.ltn.fi/*
// @exclude      https://sb.ltn.fi/video/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @namespace Jicetus
// @downloadURL https://update.greasyfork.org/scripts/531467/Groups%20Related%20Entries%20for%20tider%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/531467/Groups%20Related%20Entries%20for%20tider%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration function to set initial state
    function getInitialState() {
        return GM_getValue('initialState', true); // Default to true (expanded)
    }

    // Function to apply the selected theme
    function applyTheme(theme) {
        GM_addStyle(`
            body {
                background-color: ${theme === 'dark' ? '#333' : '#fff'};
                color: ${theme === 'dark' ? '#fff' : '#333'};
            }
            table {
                background-color: ${theme === 'dark' ? '#444' : '#fff'};
                color: ${theme === 'dark' ? '#fff' : '#333'};
            }
            .group-header-unique {
                background-color: ${theme === 'dark' ? '#555' : '#e6f7ff'};
            }
            .group-container-unique {
                border-top: 1px solid ${theme === 'dark' ? '#666' : '#b3e0ff'};
            }
            .video-id {
                color: ${theme === 'dark' ? '#7ab' : '#0066cc'};
            }
        `);
    }

    // Function to create configuration UI in the header
    function createConfigUI() {
        // Create a button in the header to toggle the config box
        const header = document.querySelector('header'); // Assuming the header is identifiable
        const configButton = document.createElement('button');
        configButton.textContent = 'Config';
        configButton.style.position = 'fixed';
        configButton.style.top = '10px';
        configButton.style.right = '10px';
        configButton.style.zIndex = '1000';
        if (header) {
            header.appendChild(configButton);
        } else {
            document.body.appendChild(configButton);
        }

        // Create the config box initially hidden
        const configBox = document.createElement('div');
        configBox.innerHTML = `
            <label>
                <input type="checkbox" id="initial-state-toggle">
                Start groups expanded
            </label>
            <div>
                <label>
                    <input type="radio" name="theme" value="light" checked> Light Theme
                </label>
                <label>
                    <input type="radio" name="theme" value="dark"> Dark Theme
                </label>
            </div>`;

        configBox.style.position = 'fixed';
        configBox.style.top = '50px';
        configBox.style.right = '10px';
        configBox.style.background = 'black';
        configBox.style.padding = '10px';
        configBox.style.border = '1px solid #ccc';
        configBox.style.zIndex = '1000';
        configBox.style.display = 'none'; // Initially hidden
        document.body.appendChild(configBox);

        // Toggle config box visibility when button is clicked
        configButton.addEventListener('click', () => {
            if (configBox.style.display === 'none') {
                configBox.style.display = 'block';
            } else {
                configBox.style.display = 'none';
            }
        });

        const toggle = configBox.querySelector('#initial-state-toggle');
        toggle.checked = getInitialState();
        toggle.addEventListener('change', () => {
            GM_setValue('initialState', toggle.checked);
            location.reload(); // Reload the page to apply changes
        });

        // Theme selection event listeners
        const themeRadios = configBox.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                GM_setValue('theme', radio.value);
                applyTheme(radio.value);
            });
        });

        // Load saved theme
        const savedTheme = GM_getValue('theme', 'light');
        document.querySelector(`input[name="theme"][value="${savedTheme}"]`).checked = true;
        applyTheme(savedTheme);
    }

    // Function to load and execute the external script
    async function loadExternalScript(url) {
        try {
            const response = await GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'text'
            });

            // Create a script element and set its content to the response text
            const scriptElement = document.createElement('script');
            scriptElement.textContent = response.responseText;
            document.body.appendChild(scriptElement);
        } catch (error) {
            console.error('Error loading external script:', error);
        }
    }

    // Function to group entries by VideoID and add collapse/expand functionality
    async function groupEntriesByVideoID() {
        // Select the table holding the entries
        const table = document.querySelector('table');
        if (!table) return;

        // Wait for the external script to update the video titles
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second to ensure titles are loaded

        // Create a map to store grouped entries
        const groupedEntries = new Map();

        // Iterate over each row in the table, including the first row
        const rows = table.querySelectorAll('tr');
        if (rows.length <= 2) { // Assuming 1 row for header and 1 for data
            // Only one entry on the page, do not create a group entry
            return;
        }

        rows.forEach(row => {
            const videoIDCell = row.querySelector('td:nth-child(2)'); // VideoID is in the second column
            if (!videoIDCell) return;
            const videoID = videoIDCell.textContent.trim();
            if (!groupedEntries.has(videoID)) {
                groupedEntries.set(videoID, []);
            }
            groupedEntries.get(videoID).push(row);
        });

        // Append grouped entries back to the table with collapse/expand functionality
        let totalViews = 0;
        let totalTimeSaved = 0;

        for (const [videoID, rows] of groupedEntries.entries()) {
            // Get the title directly from the DOM, which should have been updated by the external script
            const titleCell = rows[0].querySelector('td:nth-child(2)');
            const title = titleCell ? titleCell.textContent.trim() : 'Title Not Found';

            const entryCount = rows.length;
            let groupViews = 0;
            let groupTimeSaved = 0;

            rows.forEach(row => {
                const viewsCell = row.querySelector('td:nth-child(7)'); // Views are in the 7th column
                const timeSavedCell = row.querySelector('td.time-saved'); // Time saved is in the "Time Saved" column

                if (viewsCell) {
                    groupViews += parseInt(viewsCell.textContent.trim().replace(/,/g, ''), 10) || 0;
                }

                if (timeSavedCell) {
                    const timeSavedText = timeSavedCell.textContent.trim();
                    const timeSaved = parseTimeSaved(timeSavedText);
                    groupTimeSaved += timeSaved;
                }
            });

            totalViews += groupViews;
            totalTimeSaved += groupTimeSaved;

            const headerRow = document.createElement('tr');
            headerRow.classList.add('group-header-unique');
            headerRow.innerHTML = `
                <td colspan="100%">
                    <strong><span class="video-id">VideoID: ${videoID}</span> - ${title} (${entryCount} entries, ${groupViews} views, ${formatTime(groupTimeSaved)} time saved)</strong>
                </td>`;

            table.appendChild(headerRow);

            const groupContainer = document.createElement('tbody');
            groupContainer.classList.add('group-container-unique');

            if (!getInitialState()) {
                groupContainer.style.display = 'none';
            }

            rows.forEach(row => {
                groupContainer.appendChild(row);
            });

            table.appendChild(groupContainer);
        }

        // Display total views and time saved
        const summary = document.createElement('div');
        summary.innerHTML = `<strong>Total Views: ${totalViews}, Total Time Saved: ${formatTime(totalTimeSaved)}</strong>`;
        summary.style.textAlign = 'center';
        summary.style.marginTop = '10px';
        table.parentNode.insertBefore(summary, table);

        // Add event listeners for collapse/expand functionality
        table.addEventListener('click', event => {
            if (event.target.closest('tr.group-header-unique')) {
                const headerRow = event.target.closest('tr.group-header-unique');
                const groupContainer = headerRow.nextElementSibling;
                if (groupContainer.style.display === 'none') {
                    groupContainer.style.display = '';
                } else {
                    groupContainer.style.display = 'none';
                }
            }
        });
    }

    // Function to parse the "Time Saved" text into seconds
    function parseTimeSaved(timeSavedText) {
        const parts = timeSavedText.split(' ');
        let totalSeconds = 0;

        parts.forEach(part => {
            if (part.includes('d')) {
                totalSeconds += parseInt(part) * 24 * 60 * 60;
            } else if (part.includes('h')) {
                totalSeconds += parseInt(part) * 60 * 60;
            } else if (part.includes('m')) {
                totalSeconds += parseInt(part) * 60;
            } else if (part.includes('s')) {
                totalSeconds += parseInt(part);
            }
        });

        return totalSeconds;
    }

    // Function to format the time in DD:HH:MM:SS format
    function formatTime(timeInSeconds) {
        const days = Math.floor(timeInSeconds / (24 * 60 * 60));
        const hours = Math.floor(timeInSeconds / (60 * 60)) % 24;
        const minutes = Math.floor(timeInSeconds / 60) % 60;
        const seconds = Math.round(timeInSeconds % 60); // Round to nearest second
        let formattedTime = "";
        if (days > 0) {
            formattedTime += days + "d ";
        }
        if (hours > 0) {
            formattedTime += hours + "h ";
        }
        if (minutes > 0) {
            formattedTime += minutes + "m ";
        }
        formattedTime += seconds + "s"; // Use rounded seconds
        return formattedTime;
    }

    // Load the external script for fetching video titles
    loadExternalScript('https://raw.githubusercontent.com/mchangrh/uscripts/main/sbltnfi/fork/sbltnfi-videotitle-unlisted.user.js');

    // Run the functions to group entries and create the config UI
    setTimeout(() => {
        groupEntriesByVideoID();
        createConfigUI();
    }, 2000); // Wait for 2 seconds to ensure the external script has loaded and updated the DOM
})();
