// ==UserScript==
// @name         Podcrtaj za placane vrstice
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight rows where the invoice is paid with green color
// @author       GasperKOrehek - SignedBytes
// @match        https://www.cebelca.biz/manage/invoices.html
// @grant        none
// @license      CC BY 4.0
// @copyright    2024 SignedBytes (https://gasper.app/)
// @downloadURL https://update.greasyfork.org/scripts/517593/Podcrtaj%20za%20placane%20vrstice.user.js
// @updateURL https://update.greasyfork.org/scripts/517593/Podcrtaj%20za%20placane%20vrstice.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to highlight paid rows
    function highlightPaidRows() {
        // Get all table rows
        const rows = document.querySelectorAll('.data-table tbody tr');

        // Loop through each row
        rows.forEach(row => {
            // Check if the "paid" column span has class "good"
            const paidColumn = row.querySelector('.num:nth-child(8) span');
            if (paidColumn && paidColumn.classList.contains('good')) {
                // Apply green color to the row
                row.style.backgroundColor = 'lightgreen';
            }
        });
    }

    // Wait for table to load before highlighting paid rows
    setTimeout(highlightPaidRows, 2000); // Adjust the delay time (in milliseconds) as needed
})();