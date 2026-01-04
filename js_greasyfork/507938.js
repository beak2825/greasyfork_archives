// ==UserScript==
// @name         ATP Tournament Calendar Scraper (Updated URL Format)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Scrape updated ATP Challenger calendar and create a table of events with specific URL format
// @author       You
// @match        https://www.atptour.com/en/atp-challenger-tour/calendar
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507938/ATP%20Tournament%20Calendar%20Scraper%20%28Updated%20URL%20Format%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507938/ATP%20Tournament%20Calendar%20Scraper%20%28Updated%20URL%20Format%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load completely
    window.addEventListener('load', () => {
        // Find all <li> elements with class "list-wrapper"
        const tournamentItems = document.querySelectorAll('li .list-wrapper');
        if (tournamentItems.length === 0) {
            console.error('No tournaments found!');
            return;
        }

        // Create a table element
        const table = document.createElement('table');
        table.border = '1';
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Table header
        const headerRow = table.insertRow();
        const nameHeader = document.createElement('th');
        nameHeader.innerText = 'Tournament Name';
        const locationHeader = document.createElement('th');
        locationHeader.innerText = 'Location';
        const dateHeader = document.createElement('th');
        dateHeader.innerText = 'Date';
        const urlHeader = document.createElement('th');
        urlHeader.innerText = 'Live URL';
        headerRow.appendChild(nameHeader);
        headerRow.appendChild(locationHeader);
        headerRow.appendChild(dateHeader);
        headerRow.appendChild(urlHeader);

        // Loop through each tournament item and extract the necessary information
        tournamentItems.forEach((item) => {
            // Get the tournament name from <span class="name">
            const nameElement = item.querySelector('span.name');
            const tournamentName = nameElement ? nameElement.innerText.trim() : 'Unknown Tournament';

            // Get the location from <span class="venue">
            const locationElement = item.querySelector('span.venue');
            const location = locationElement ? locationElement.innerText.trim() : 'Unknown Location';

            // Get the date from <span class="Date">
            const dateElement = item.querySelector('span.Date');
            const tournamentDate = dateElement ? dateElement.innerText.trim() : 'Unknown Date';

            // Get the href part from <a class="tournament__page-link">
            const pageLinkElement = item.querySelector('a.tournament__page-link');
            let liveUrl = 'No URL';
            if (pageLinkElement && pageLinkElement.href) {
                // Extract the city and tournament ID from the href attribute
                const hrefMatch = pageLinkElement.getAttribute('href').match(/\/en\/tournaments\/([\w-]+)\/(\d+)\//);
                if (hrefMatch) {
                    const city = hrefMatch[1]; // Extract city (e.g., "columbus")
                    const tournamentID = hrefMatch[2]; // Extract tournament ID (e.g., "8281")
                    liveUrl = `https://www.atptour.com/en/scores/current-challenger/${city}/${tournamentID}/draws`;
                }
            }

            // Create a new row for each tournament
            const row = table.insertRow();
            const nameCell = row.insertCell();
            const locationCell = row.insertCell();
            const dateCell = row.insertCell();
            const urlCell = row.insertCell();

            // Fill in the data
            nameCell.innerText = tournamentName;
            locationCell.innerText = location;
            dateCell.innerText = tournamentDate;
            urlCell.innerText = liveUrl;
        });

        // Append the table to the body or specific place on the page
        document.body.prepend(table);
    });
})();