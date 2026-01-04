// ==UserScript==
// @name        Pull out issue numbers - drupal.org
// @namespace   Violentmonkey Scripts
// @match       https://www.drupal.org/project/issues/search/*
// @grant       none
// @version     1.0
// @author      Chris Wells
// @license     MIT
// @description 11/12/2024, 3:47:07 PM
// @downloadURL https://update.greasyfork.org/scripts/517068/Pull%20out%20issue%20numbers%20-%20drupalorg.user.js
// @updateURL https://update.greasyfork.org/scripts/517068/Pull%20out%20issue%20numbers%20-%20drupalorg.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Select the table by class name
    const table = document.querySelector('.views-table.sticky-enabled');

    // If table is not found, exit
    if (!table) return;

    // Add a new header cell for the "Issue Number" column
    const headerRow = table.querySelector('thead tr');
    const newHeaderCell = document.createElement('th');
    newHeaderCell.className = 'views-field views-field-issue-number';
    newHeaderCell.scope = 'col';
    newHeaderCell.textContent = 'Issue Number';
    headerRow.appendChild(newHeaderCell);

    // Iterate over each row in the table body
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        // Find the first column with the link containing the issue number
        const titleCell = row.querySelector('.views-field-title a');
        if (titleCell) {
            // Extract the issue number from the href attribute
            const issueNumber = titleCell.href.split('/').pop();
            const issueText = `[#${issueNumber}]`;

            // Create a new cell for the issue number with a click-to-copy functionality
            const issueCell = document.createElement('td');
            issueCell.className = 'views-field views-field-issue-number';
            issueCell.dataset.th = 'Issue Number';

            // Create a clickable span element
            const issueSpan = document.createElement('span');
            issueSpan.textContent = issueText;
            issueSpan.style.cursor = 'pointer';
            issueSpan.style.color = 'blue'; // Optional styling for better UX

            // Add event listener to copy text to clipboard on click
            issueSpan.addEventListener('click', () => {
                navigator.clipboard.writeText(issueText).then(() => {
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });

            // Append the span to the new cell, and the cell to the row
            issueCell.appendChild(issueSpan);
            row.appendChild(issueCell);
        }
    });
})();
