// ==UserScript==
// @name         SNOW Highlight
// @namespace    https://greasyfork.org/en/scripts/524680-snow-highlight
// @version      6.1
// @description  Highlight Assigned to me and unassigned tickets
// @author       Phill Munday
// @license      MIT
// @match        https://selfservice.education.sa.gov.au/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524680/SNOW%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/524680/SNOW%20Highlight.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const STYLE = `
tr.assignedToMe td { background-color: #FAFA33 !important; }
tr.updatedByNotMe td { background-color: #FFE686 !important; }
tr.emptyAssignment td { background-color: #D9EDF7 !important; }
`;

    document.head.appendChild(document.createElement('style')).textContent = STYLE;

    const DEBUG = true;

    function logDebug(message, data = null) {
        if (DEBUG) {
            console.log(`[DEBUG] ${message}`);
            if (data) console.dir(data);
        }
    }

    // Ask user for input
    function promptForName() {
        let userName = localStorage.getItem('highlightUserName');
        if (!userName) {
            userName = prompt('Enter the name you want to highlight:', '');
            if (userName) {
                localStorage.setItem('highlightUserName', userName);
                logDebug(`User input stored: ${userName}`);
            } else {
                alert('No name entered. Script will not run.');
                return null;
            }
        }
        logDebug(`Using username: ${userName}`);
        return userName;
    }

    // Detect table dynamically with retry logic
    function waitForTable(userName, retryCount = 10) {
        logDebug('Starting table detection...');
        let table = findTable();
        if (table) {
            logDebug('Table found. Highlighting rows...');
            logDebug('Detected table structure:', table.outerHTML);
            highlightRows(table, userName);
        } else {
            if (retryCount > 0) {
                logDebug(`Table not found. Retrying... (${retryCount} retries left)`);
                setTimeout(() => waitForTable(userName, retryCount - 1), 1000);
            } else {
                console.error('Table could not be detected after multiple retries.');
            }
        }
    }

    // Attempt to locate the correct table element
    function findTable() {
        const tables = document.querySelectorAll('table');
        logDebug(`Tables found on the page: ${tables.length}`, tables);

        for (const [index, table] of tables.entries()) {
            logDebug(`Inspecting table ${index + 1}:`, table.outerHTML);

            // Check if the table has the correct headers
            const assignedToHeader = table.querySelector('th[name="assigned_to"]');
            if (assignedToHeader) {
                logDebug(`Matching table found:`, table);
                return table;
            }
        }
        logDebug('No matching table found.');
        return null;
    }

    // Highlight rows based on username
    function highlightRows(table, userName) {
        logDebug('Starting row highlighting...');
        const headers = [...table.querySelectorAll('th')];
        logDebug('Detected table headers:', headers.map(header => header.outerHTML));

        const assignedToIndex = headers.findIndex(th => th.getAttribute('name') === 'assigned_to');
        const updatedByIndex = headers.findIndex(th => th.getAttribute('name') === 'sys_updated_by');

        logDebug(`Assigned to index: ${assignedToIndex}, Updated by index: ${updatedByIndex}`);

        if (assignedToIndex === -1) {
            console.error('Assigned to column not found.');
            return;
        }

        const rows = [...table.querySelectorAll('tr')];
        logDebug(`Detected rows: ${rows.length}`, rows);

        rows.forEach((row, index) => {
            logDebug(`Processing row ${index + 1}:`, row.outerHTML);

            const cells = row.children;
            const assignedToCell = cells[assignedToIndex];
            const updatedByCell = updatedByIndex !== -1 ? cells[updatedByIndex] : null;

            if (assignedToCell?.innerText.trim() === userName) {
                logDebug(`Row ${index + 1} assigned to ${userName}`);
                row.classList.add('assignedToMe');
                if (
                    updatedByCell &&
                    updatedByCell.innerText !== userName &&
                    updatedByCell.innerText !== 'system'
                ) {
                    logDebug(`Row ${index + 1} updated by someone else.`);
                    row.classList.add('updatedByNotMe');
                }
            } else if (assignedToCell?.innerText.trim().toLowerCase() === '(empty)') {
                logDebug(`Row ${index + 1} has an empty assignment.`);
                row.classList.add('emptyAssignment');
            }
        });

        logDebug('Row highlighting complete.');
    }

    // Initialize script
    logDebug('Script initialized. Prompting for username...');
    const userName = promptForName();
    if (userName) {
        logDebug('Username provided. Waiting for table...');
        waitForTable(userName);
    } else {
        console.error('Username not provided. Script will not proceed.');
    }
})();
