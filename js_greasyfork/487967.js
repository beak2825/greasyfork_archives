// ==UserScript==
// @name         Tech Time Diff
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Highlight any time differences in tech schedules.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/TechCalendarDetail.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/487967/Tech%20Time%20Diff.user.js
// @updateURL https://update.greasyfork.org/scripts/487967/Tech%20Time%20Diff.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const highlightMismatchedTimes = () => {
        const rows = $('table tr:gt(0)'); // eslint-disable-line no-undef

        rows.each(function(index) {
            const currentRow = $(this); // eslint-disable-line no-undef
            const nextRow = rows.eq(index + 1);

            if (nextRow.length === 0) {
                return; // Skip the last row
            }

            const currentEndTime = currentRow.find('td:nth-child(5)').text();
            const nextStartTime = nextRow.find('td:nth-child(4)').text();

            if (currentEndTime !== nextStartTime) {
                currentRow.find('td:nth-child(5)').css({'background-color': '#dc2626', 'color': '#ffffff'}); // Highlight end time cell
                nextRow.find('td:nth-child(4)').css({'background-color': '#dc2626', 'color': '#ffffff'}); // Highlight start time cell
            }
        });
    }


    highlightMismatchedTimes();

})();
