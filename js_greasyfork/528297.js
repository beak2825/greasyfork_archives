// ==UserScript==
// @name         Startlap admin - Page lista formázása
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Startlap yiiadmin pages lap átformázása; inaktív sorok elrejtése, Nyitó sor kiemelése.
// @author       Sancho
// @match        https://yiiadmin.startlap.hu/pages
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startlap.hu
// @grant        none
// @license      startlap.hu
// @downloadURL https://update.greasyfork.org/scripts/528297/Startlap%20admin%20-%20Page%20lista%20form%C3%A1z%C3%A1sa.user.js
// @updateURL https://update.greasyfork.org/scripts/528297/Startlap%20admin%20-%20Page%20lista%20form%C3%A1z%C3%A1sa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process rows
    const processRows = () => {
        // Select all rows in the table
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            // Check for "red" circle and hide the row
            const redCircle = row.querySelector('td.border-right-off span.fa.fa-circle.red');
            if (redCircle) {
                row.style.display = 'none';
            }

            // Check for the specific row with the number 39 and "green" circle
            const cellWith39 = row.querySelector('td.border-left-off');
            const greenCircle = row.querySelector('td.border-right-off span.fa.fa-circle.green');
            if (cellWith39 && cellWith39.textContent.trim() === '39' && greenCircle) {
                row.style.background = 'cornsilk';
            }
        });
    };

    // Observe DOM changes to ensure dynamic content is handled
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            processRows();
        });
    });

    // Start observing the target node
    const targetNode = document.querySelector('tbody');
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
        processRows(); // Initial call to handle already loaded rows
    } else {
        console.error('Target node for observer not found!');
    }
})();
