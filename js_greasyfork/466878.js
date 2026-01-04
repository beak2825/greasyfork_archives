// ==UserScript==
// @name         Highlight Playable Events on Limitless TCG
// @namespace    http://www.example.com
// @version      1.3
// @description  Highlights weekend events on play.limitlesstcg.com
// @author       Joe Zhu
// @match        https://play.limitlesstcg.com/tournaments/upcoming*
// @grant        none
// @license      joezhuu
// @downloadURL https://update.greasyfork.org/scripts/466878/Highlight%20Playable%20Events%20on%20Limitless%20TCG.user.js
// @updateURL https://update.greasyfork.org/scripts/466878/Highlight%20Playable%20Events%20on%20Limitless%20TCG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if a date falls on a weekend (Saturday or Sunday)
    function isSuitable(date) {
        const day = date.getDay();
        const hour = date.getHours();
        const min = date.getMinutes();
        // Sat or Sun is good
        if (day === 0 || day === 6) {
            // from 6am to 6pm
            if (hour >= 6 && hour <= 18)
            {
                return true;
            }
        }
        // Weekdays after school
        else {
            // from 3:30pm to 6pm
            if (hour >= 15 && hour <= 18)
            {
                if (hour == 15 && min < 30)
                {
                    return false;
                }
                return true;
            }
            // from 6am or 7am
            else {
                if (hour === 6 || hour === 7){
                    return true;
                }
            }
        }
        return false;
    }

    // Get the event table
    const eventTable = document.querySelector('table.striped.upcoming-tournaments'); // Update this selector if needed

    // Get all the event rows
    const eventRows = eventTable.querySelectorAll('tr[data-date]');

    // Loop through each event row
    eventRows.forEach(row => {
        // Get the date of the event
        const dateString = row.getAttribute('data-date');
        const eventDate = new Date(dateString);

        // Check if the event falls on a weekend
        if (isSuitable(eventDate)) {
            // Apply highlighting to the event row
            row.style.color = '#FF00CC';

            // Find the date element within the row
            const dateElement = row.querySelector('.date .time');

            // Parse the original date integer value into a Date object
            const dateObject = new Date(Number(dateElement.getAttribute('data-time')));

            // Get the day of the week (abbreviated) for the date
            const dayOfWeek = dateObject.toLocaleDateString('en-US', { weekday: 'short' });

            // Append the day of the week to the original date string
            dateElement.innerText = dateElement.innerText + ` (${dayOfWeek})`;
        }
    });
})();