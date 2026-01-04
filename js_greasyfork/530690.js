// ==UserScript==
// @name         Minimal Jenkins Job list
// @version      2025-03-24
// @description  This script is to hide all tabs but LADS and to show directory first in the job list.
// @author       Busung Kim
// @match        https://jenkins.linecorp.com/view/LADS/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linecorp.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1192532
// @downloadURL https://update.greasyfork.org/scripts/530690/Minimal%20Jenkins%20Job%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/530690/Minimal%20Jenkins%20Job%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sortJobList() {
        // Select the tbody element
        const tbody = document.querySelector('#projectstatus > tbody');

        if (!tbody) {
            console.error('Tbody not found');
            return;
        }

        // Convert the HTMLCollection of rows to an array for easier manipulation
        const rows = Array.from(tbody.rows);

        // Separate rows into two arrays: those with the class 'job-status-' and those without
        const jobStatusRows = [];
        const otherRows = [];

        rows.forEach(row => {
            if (row.classList.contains('job-status-')) {
                jobStatusRows.push(row);
            } else {
                otherRows.push(row);
            }
        });

        // Clear the tbody
        tbody.innerHTML = '';

        // Append the job-status- rows first, followed by the other rows
        jobStatusRows.forEach(row => tbody.appendChild(row));
        otherRows.forEach(row => tbody.appendChild(row));
    }

    function hideAllTabsButLADS() {
        // Select all div elements under the specified selector
        const tabBarDivs = document.querySelectorAll('#projectstatus-tabBar > div > div.tabBar > div');

        tabBarDivs.forEach(div => {
            // Find the <a> element within each <div> to check its text content
            const link = div.querySelector('a');

            if (link && link.textContent.trim() === 'LADS') {
                // If the link text is 'LADS', ensure this div is shown
                div.style.display = '';
            } else {
                // Otherwise, hide the div
                div.style.display = 'none';
            }
        });
    }

    sortJobList();
    hideAllTabsButLADS();
})();