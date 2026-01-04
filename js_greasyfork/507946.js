// ==UserScript==
// @name         ITF - Výpis URL
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Scrape ITF tournament calendar and create a table with live URLs
// @author       You
// @match        https://www.itftennis.com/en/tournament-calendar/*/?categories=All&startdate=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507946/ITF%20-%20V%C3%BDpis%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/507946/ITF%20-%20V%C3%BDpis%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load completely
    window.addEventListener('load', () => {
        // Find all <tr> elements with class "whatson-table__tournament"
        const tournamentRows = document.querySelectorAll('tr.whatson-table__tournament');
        if (tournamentRows.length === 0) {
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
        const dateHeader = document.createElement('th');
        dateHeader.innerText = 'Date';
        const nameHeader = document.createElement('th');
        nameHeader.innerText = 'Tournament Name';
        const urlHeader = document.createElement('th');
        urlHeader.innerText = 'Live URL';
        headerRow.appendChild(dateHeader);
        headerRow.appendChild(nameHeader);
        headerRow.appendChild(urlHeader);

        // Loop through each tournament row and extract the necessary information
        tournamentRows.forEach((row) => {
            // Get the date from <span class="date">
            const dateElement = row.querySelector('span.date');
            const date = dateElement ? dateElement.innerText.trim() : 'Unknown Date';

            // Get the tournament name from <div class="short">
            const nameElement = row.querySelector('div.short');
            const tournamentName = nameElement ? nameElement.innerText.trim() : 'Unknown Tournament';

            // Get the tournament URL part from <a href="...">
            const linkElement = row.querySelector('a');
            let liveUrl = 'No URL';
            if (linkElement && linkElement.href) {
                const hrefPart = linkElement.getAttribute('href').match(/\/[mw]-itf-[\w-]+\//);
                if (hrefPart) {
                    // Extract the part of the URL and convert it to uppercase
                    const tourKey = hrefPart[0].replace(/\//g, '').toUpperCase();
                    liveUrl = `https://live.itftennis.com/en/live-scores/?tourkey=${tourKey}`;
                }
            }

            // Create a new row for each tournament
            const rowElement = table.insertRow();
            const dateCell = rowElement.insertCell();
            const nameCell = rowElement.insertCell();
            const urlCell = rowElement.insertCell();

            // Fill in the data
            dateCell.innerText = date;
            nameCell.innerText = tournamentName;
            urlCell.innerText = liveUrl;
        });

        // Append the table to the body or specific place on the page
        document.body.prepend(table);
    });
})();