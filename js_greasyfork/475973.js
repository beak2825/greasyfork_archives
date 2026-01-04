// ==UserScript==
// @name         Auto-close SDQL tabs without active trends
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Close the tab if today's date is not found in the table unless it's a nonstandard table OR the word Research appears in your query.
// @author       Swain Scheps
// @match        https://killersports.com/nfl/query*
// @match        https://killersports.com/mlb/query*
// @match        https://killersports.com/nba/query*
// @match        https://killersports.com/nhl/query*
// @match        https://killersports.com/ncaabb/query*
// @match        https://killersports.com/ncaafb/query*
// @grant        none
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/475973/Auto-close%20SDQL%20tabs%20without%20active%20trends.user.js
// @updateURL https://update.greasyfork.org/scripts/475973/Auto-close%20SDQL%20tabs%20without%20active%20trends.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkDates() {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part to avoid comparison issues
        function isRelevantRow(row) {
            let dateText = row.cells[0].innerText.trim();
            let gameDate = new Date(dateText + ' 00:00:00');
            // Check if gameDate is a valid date and if it's today or later
            return !isNaN(gameDate.getTime()) && gameDate >= today;
        }
        let table = document.querySelector('#DT_Table');
        if (!table) {
            // If the table isn't found, don't close the tab
            return;
        }
        // Check if the first column header is 'Date'
        let firstColumnHeader = table.querySelector('thead tr th:first-child').innerText.trim();
        if (firstColumnHeader.toLowerCase() !== 'date') {
            // If the first column isn't 'Date', don't close the tab
            return;
        }
        // Check if the word 'Research' is found on the page
        if (document.body.innerText.includes('Research')) {
            // If 'Research' is found, don't close the tab
            return;
        }
        let rows = table.querySelectorAll('tbody tr');
        let relevantRowsExist = Array.from(rows).some(isRelevantRow);
        if (!relevantRowsExist) {
            window.close();
        }
    }
    // Run the checkDates function initially, then pause for an interval.
    checkDates();
    setInterval(checkDates, 1000);
})();