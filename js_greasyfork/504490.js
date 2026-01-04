// ==UserScript==
// @name         CanvasExtractCourseRoster
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A nice GUI way to extract users+emails from a Canvas course in a simple-to-use format.
// @author       Jason Hemann
// @match        *://*.instructure.com/courses/*/users
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/504490/CanvasExtractCourseRoster.user.js
// @updateURL https://update.greasyfork.org/scripts/504490/CanvasExtractCourseRoster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract names and emails
    function extractNamesAndEmails() {
        // Combined check for tab-0 div and table
        let table = document.getElementById('tab-0')?.querySelector('div > div:nth-of-type(2) > table');
        if (!table) {
            alert('Table not found in the expected location.');
            return;
        }

        // Get all rows in the table
        let rows = table.querySelectorAll('tbody > tr');
        let results = [];

        // Extract names and emails from each row
        for (let row of rows) {
            let nameCell = row.querySelector('td:nth-of-type(2) > a');
            let emailCell = row.querySelector('td:nth-of-type(3)');

            if (!(nameCell && emailCell)) {
                alert('Table is malformed.');
                return; // Stop the function if a row is malformed
            }

            let name = nameCell.textContent.trim();
            let email = emailCell.textContent.trim();
            results.push(`${name}\t${email}`);
        }

        // Copy the results to the clipboard
        GM_setClipboard(results.join('\n'));
    }

    // Create a button and style it
    let button = document.createElement('button');
    button.innerHTML = 'Extract Names and Emails';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#28a745';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Add the button to the page
    document.body.appendChild(button);

    // Add click event listener to the button
    button.addEventListener('click', extractNamesAndEmails);

})();