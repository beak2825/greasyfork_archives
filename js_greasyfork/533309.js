// ==UserScript==
// @name         Adjust Date Format
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically adjusts date format, short day name, and timezone
// @author       canofpaint
// @match        https://8chan.se/*
// @match        https://8chan.moe/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533309/Adjust%20Date%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/533309/Adjust%20Date%20Format.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to reformat dates and adjust time zones
    function reformatDates() {
        const userLang = navigator.language || 'en-US'; // Detect the user's language for formatting
        const dateElements = document.querySelectorAll('.labelCreated'); // Find all elements with class `.labelCreated`

        dateElements.forEach((element) => {
            const originalText = element.textContent.trim();
            // Match MM/DD/YYYY (Day) HH:mm:ss pattern
            const match = originalText.match(/^(\d{2})\/(\d{2})\/(\d{4}) \((\w{3})\) (\d{2}):(\d{2}):(\d{2})$/);

            if (match) {
                const [, month, day, year, dayAbbr, hours, minutes, seconds] = match;

                // Convert the original date and time (UTC) to a JavaScript Date object
                const originalDateUTC = new Date(Date.UTC(
                    parseInt(year, 10),
                    parseInt(month, 10) - 1,
                    parseInt(day, 10),
                    parseInt(hours, 10),
                    parseInt(minutes, 10),
                    parseInt(seconds, 10)
                ));

                // Adjust to the user's local time zone
                const localDate = new Date(originalDateUTC.getTime() - (originalDateUTC.getTimezoneOffset() * 60000));

                // Format the date using the user's language
                const shortDayName = new Intl.DateTimeFormat(userLang, { weekday: 'short' }).format(localDate);
                const formattedDay = localDate.getDate().toString().padStart(2, '0');
                const formattedMonth = (localDate.getMonth() + 1).toString().padStart(2, '0');
                const formattedYear = localDate.getFullYear();
                const formattedTime = localDate.toLocaleTimeString(userLang, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

                // Replace the original text with the reformatted date in the specified order
                element.textContent = `${formattedDay}-${formattedMonth}-${formattedYear} (${shortDayName}) ${formattedTime}`;
            }
        });
    }

    // Observe the page for any updates to dynamically added content
    const observer = new MutationObserver(reformatDates);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the date reformatting function when the page loads
    reformatDates();
})();
