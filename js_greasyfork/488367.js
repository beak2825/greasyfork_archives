// ==UserScript==
// @name         Current Date Highlight
// @namespace    https://violentmonkey.github.io
// @version      1.0.2
// @description  Highlight the current date in the Service Calls table.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/Cases.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/488367/Current%20Date%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/488367/Current%20Date%20Highlight.meta.js
// ==/UserScript==


(function() {
    'use strict';


    // Get today's date in mm-dd-yyyy format.
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-'); // Replace slashes with dashes for mm-dd-yyyy format.


    // Highlight cells containing the current date in the 'Service Date' column.
    const highlightCurrentDate = () => {
        document.querySelectorAll('tr').forEach(row => {
            const cell = row.cells[20];
            if (cell && cell.textContent.includes(today)) {
                cell.style.backgroundColor = 'yellow';
            }
        });
    };


    // Observer callback to handle table changes
    const handleTableChange = (mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                highlightCurrentDate();
            }
        });
    };


    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(handleTableChange);

    // Start observing the target node for configured mutations
    const targetNode = document.querySelector('body'); // Adjust this selector as needed
    const config = { childList: true, subtree: true };

    observer.observe(targetNode, config);
})();
