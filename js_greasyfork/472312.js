// ==UserScript==
// @name         RealDebrid Time Conversion
// @description  Converts the server's generated time to the browser or system internet time on Real-Debrid downloads page
// @icon         none
// @version      0.1
// @author       Overshields (https://www.reddit.com/user/Overshields)
// @license      MIT
// @match        https://real-debrid.com/downloads
// @grant        none
// @namespace https://greasyfork.org/users/1142602
// @downloadURL https://update.greasyfork.org/scripts/472312/RealDebrid%20Time%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/472312/RealDebrid%20Time%20Conversion.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to convert displayed time to local time
    function convertTime() {
        const tdElements = document.querySelectorAll('td'); // Get all td elements on the page

        // Loop through each td element
        for (const td of tdElements) {
            const dateStr = td.textContent.trim();
            const dateRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;

            if (dateRegex.test(dateStr)) {
                const utcDate = new Date(dateStr + ' UTC'); // Convert the date string to a UTC date object
                const localDate = new Date(utcDate.getTime() + (new Date().getTimezoneOffset() * 60000)); // Convert to local time

                // Format the local date as 'YYYY-MM-DD HH:mm:ss'
                const formattedDate = localDate.toISOString().slice(0, 19).replace('T', ' ');

                // Replace the content of the td element with the formatted local date
                td.textContent = formattedDate;
            }
        }
    }

    // Call the function to convert the time once the page is fully loaded
    window.addEventListener('load', convertTime);
})();
