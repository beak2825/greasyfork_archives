// ==UserScript==
// @name         Reservation Counter
// @namespace    https://github.com/laurenipsum/TTL
// @version      1.4
// @description  Count reservations (on each page)
// @author       ipsum (with Claude.ai)
// @match        https://tacomatoollibrary.myturn.com/library/orgInventory/listReservations*
// @match        https://*.myturn.com/library/orgInventory/listReservations*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540255/Reservation%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/540255/Reservation%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function countItems() {
        // Count individual reservation items
        const itemRows = document.querySelectorAll('.panel.reservation table tbody tr');
        const individualItemCount = itemRows.length;

        // Get total from footer summaries (more accurate for quantities)
        const footerTotals = document.querySelectorAll('.panel.reservation table tfoot td strong');
        let totalQuantity = 0;

        footerTotals.forEach(footer => {
            const text = footer.textContent.trim();
            const number = parseInt(text);
            if (!isNaN(number)) {
                totalQuantity += number;
            }
        });

        // Count number of reservations
        const reservations = document.querySelectorAll('.panel.reservation');
        const reservationCount = reservations.length;

        return {
            reservations: reservationCount,
            individualItems: individualItemCount,
            totalQuantity: totalQuantity
        };
    }

    function createCounterDisplay() {
        const counts = countItems();

        // Find the target row to insert our counter
        const targetRow = document.querySelector('.form-actions .row');
        if (!targetRow) return;

        // Create or update the display element
        let displayCol = document.getElementById('item-counter-col');
        if (!displayCol) {
            displayCol = document.createElement('div');
            displayCol.id = 'item-counter-col';
            displayCol.className = 'col-sm-2';

            const updateBtnCol = targetRow.querySelector('.col-sm-2');
            const col8 = targetRow.querySelector('.col-sm-8');

            if (col8) {
                // Change the col-sm-8 to col-sm-6 to make room
                col8.className = col8.className.replace('col-sm-8', 'col-sm-6');

                // Insert our counter column
                targetRow.insertBefore(displayCol, col8);
            } else {
                // Fallback: just append to the row
                targetRow.appendChild(displayCol);
            }
        }

        displayCol.innerHTML = `
            <div style="
                font-size: 14px;
                color: black;
                padding: 3px;
                border: 1px solid grey;
                background: #e7e7e7;
            ">
                <div style="font-weight: bold;">
                    ${counts.reservations} reservations
                </div>
                <div style="font-size: 11px;">
                    (${counts.totalQuantity} total items)
                </div>
            </div>
        `;
    }

    // Initialize when page loads
    function initialize() {
        // Wait a bit for the page to fully load
        setTimeout(() => {
            createCounterDisplay();
        }, 1000);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also watch for dynamic content changes (like filtering)
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' &&
                (mutation.target.classList.contains('portlet-body') ||
                 mutation.target.querySelector('.panel.reservation'))) {
                shouldUpdate = true;
            }
        });

        if (shouldUpdate) {
            setTimeout(createCounterDisplay, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
