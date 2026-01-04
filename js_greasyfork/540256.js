// ==UserScript==
// @name         Unfulfilled Reservation Highlighter
// @namespace    https://github.com/laurenipsum/TTL
// @version      1.4
// @description  Highlight unfulfilled reservations in red
// @author       ipsum (with Claude.ai)
// @match        https://tacomatoollibrary.myturn.com/library/orgInventory/listReservations*
// @match        https://*.myturn.com/library/orgInventory/listReservations*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540256/Unfulfilled%20Reservation%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/540256/Unfulfilled%20Reservation%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';



    function parseReservationDate(dateString) {
        // Parse dates like "Jun 12, 2025–Jun 26, 2025"
        // We want the start date (before the dash)
        const startDatePart = dateString.split('–')[0].trim();

        // Convert to a Date object
        const date = new Date(startDatePart);
        return date;
    }

    function isUnfulfilled(reservationDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for comparison

        const resDate = new Date(reservationDate);
        resDate.setHours(0, 0, 0, 0); // Set to start of day for comparison

        return resDate < today;
    }

    function countLibraryOpenDays(startDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        // If start date is today or in the future, return 0
        if (start >= today) return 0;

        let count = 0;
        let currentDate = new Date(start);

        // Count library open days (Monday=1, Wednesday=3, Saturday=6)
        while (currentDate < today) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 6) {
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return count;
    }

    function formatDateWithDay(dateString) {
        // Parse the original date range
        const parts = dateString.split('–');
        const startDatePart = parts[0].trim();
        const endDatePart = parts[1].trim();

        const startDate = new Date(startDatePart);
        const endDate = new Date(endDatePart);

        // Get day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const startDay = dayNames[startDate.getDay()];
        const endDay = dayNames[endDate.getDay()];

        // Format the base date string
        const baseDateString = `${startDay} ${startDatePart}–${endDay} ${endDatePart}`;

        // Return just the date string - we'll add the pickup info separately
        return baseDateString;
    }

    function highlightUnfulfilledReservations() {
        // Find all reservation panels
        const reservationPanels = document.querySelectorAll('.panel.reservation');

        reservationPanels.forEach(panel => {
            // Find the date element within each panel
            const dateElement = panel.querySelector('.panel-heading .col-sm-7 strong');

            if (dateElement) {
                const dateText = dateElement.textContent.trim();

                try {
                    const reservationDate = parseReservationDate(dateText);

                    // Update the date text to include day of week (only do this once)
                    if (!dateElement.dataset.dayAdded) {
                        const newDateText = formatDateWithDay(dateText);
                        dateElement.textContent = newDateText;
                        dateElement.dataset.dayAdded = 'true';
                    }

                    if (isUnfulfilled(reservationDate)) {
                        // Add the unfulfilled class
                        dateElement.classList.add('unfulfilled-reservation-date');

                        // Add pickup days missed info in a separate span
                        if (!dateElement.querySelector('.pickup-days-missed')) {
                            const missedDays = countLibraryOpenDays(reservationDate);
                            if (missedDays > 0) {
                                const dayWord = missedDays === 1 ? 'day' : 'days';
                                const pickupSpan = document.createElement('span');
                                pickupSpan.className = 'pickup-days-missed';
                                pickupSpan.textContent = ` ${missedDays} pickup ${dayWord} missed`;
                                dateElement.appendChild(pickupSpan);
                            }
                        }
                    } else {
                        // Remove the class if not unfulfilled (in case of dynamic updates)
                        dateElement.classList.remove('unfulfilled-reservation-date');

                        // Remove pickup days span if it exists
                        const pickupSpan = dateElement.querySelector('.pickup-days-missed');
                        if (pickupSpan) {
                            pickupSpan.remove();
                        }
                    }
                } catch (error) {
                    console.log('Could not parse date:', dateText, error);
                }
            }
        });
    }

    // Initialize when page loads
    function initialize() {
        // Wait a bit for the page to fully load
        setTimeout(() => {
            highlightUnfulfilledReservations();
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
            setTimeout(highlightUnfulfilledReservations, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
