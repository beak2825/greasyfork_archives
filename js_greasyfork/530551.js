// ==UserScript==
// @name         Show local time in Launchpad bug history
// @namespace    http://anthonywong.net/
// @version      1.0
// @description  Appends local time after GMT timestamps on Launchpad bug history page
// @match        https://bugs.launchpad.net/*/+bug/*/+activity
// @grant        none
// @author       Anthony Wong <yp@anthonywong.net>
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/530551/Show%20local%20time%20in%20Launchpad%20bug%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/530551/Show%20local%20time%20in%20Launchpad%20bug%20history.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertToLocalTime(gmtTime) {
        // Parse the GMT time string into a Date object
        const date = new Date(gmtTime + ' GMT+0');
        if (isNaN(date.getTime())) {
            return ''; // Return empty if date parsing fails
        }

        // Format to local date and time
        return date.toLocaleString();
    }

    // Loop through each row in the table
    document.querySelectorAll('table.listing tbody tr').forEach(row => {
        const timestampCell = row.cells[0]; // First column (Timestamp)

        if (timestampCell) {
            const gmtTime = timestampCell.innerText.trim();
            const localTime = convertToLocalTime(gmtTime);

            if (localTime) {
                // Append the local time in parentheses
                timestampCell.innerText += ` (local time: ${localTime})`;
            }
        }
    });
})();
