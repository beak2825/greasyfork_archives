// ==UserScript==
// @name         Auto Sort Purelymail User Table by Domain
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Groups users by domain, sorts them, and adds toggleable headers.
// @author       V3ctor Design
// @license      MIT
// @match        https://purelymail.com/manage/users
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/512258/Auto%20Sort%20Purelymail%20User%20Table%20by%20Domain.user.js
// @updateURL https://update.greasyfork.org/scripts/512258/Auto%20Sort%20Purelymail%20User%20Table%20by%20Domain.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // User setting to toggle headers
    let showHeaders = true;

    // Register a menu command to toggle headers
    GM_registerMenuCommand("Toggle Domain Headers", () => {
        showHeaders = !showHeaders;
        renderGroupedUsers();
    });

    // Remove existing CSS striping (if present) by injecting a new style
    const style = document.createElement('style');
    style.textContent = `
        table.striped tr:nth-of-type(2n) {
            background-color: transparent !important;
        }
    `;
    document.head.appendChild(style);

    function renderGroupedUsers() {
        // Fetch the table containing the users
        const table = document.querySelector('table.striped tbody');
        if (!table) return;

        // Extract users and group by domain
        const rows = Array.from(table.querySelectorAll('tr'));
        const userGroups = {};

        rows.forEach(row => {
            const link = row.querySelector('a');
            if (link) {
                const email = link.textContent.trim();
                const domain = email.split('@')[1];

                if (!userGroups[domain]) {
                    userGroups[domain] = [];
                }
                userGroups[domain].push(row);
            }
        });

        // Sort the groups by domain
        const sortedDomains = Object.keys(userGroups).sort();

        // Clear the table for re-rendering
        table.innerHTML = '';

        // Render the users grouped by domain without striped backgrounds
        sortedDomains.forEach((domain) => {
            if (showHeaders) {
                // Add an empty row for spacing before the header
                const spacerRow = document.createElement('tr');
                const spacerCell = document.createElement('td');
                spacerCell.colSpan = 1;
                spacerCell.style.height = '20px';
                spacerRow.appendChild(spacerCell);
                table.appendChild(spacerRow);

                // Create the header row for each domain
                const headerRow = document.createElement('tr');
                const headerCell = document.createElement('td');
                headerCell.colSpan = 1;
                headerCell.style.backgroundColor = '#ddd'; // Apply background color to header
                headerCell.style.fontWeight = 'bold';
                headerCell.style.padding = '5px';
                headerCell.textContent = domain;
                headerRow.appendChild(headerCell);
                table.appendChild(headerRow);
            }

            // Add the rows for each user in the group
            userGroups[domain].forEach(row => {
                row.style.backgroundColor = 'transparent'; // Ensure user rows have no background color
                table.appendChild(row);
            });
        });
    }

    // Initial rendering of the grouped users
    renderGroupedUsers();
})();
