// ==UserScript==
// @name WU Cal Next Month
// @namespace    https://greasyfork.org/en/users/922168-mark-zinzow
// @version 0.7
// @author       Mark Zinzow
// @description  Skips to the next month if it is within 10 days
// @match        https://www.wunderground.com/calendar/*
// @match        https://www.wunderground.com/forecast/*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465230/WU%20Cal%20Next%20Month.user.js
// @updateURL https://update.greasyfork.org/scripts/465230/WU%20Cal%20Next%20Month.meta.js
// ==/UserScript==

/*
I often find myself wanting to see the forecast more than 10 days out.
To see a longer range forecast, I usually click on calendar, but for about the last 3rd of a month, I then have to select the next month and reload the page with the View button.
This script automates that, or does nothing on any calendar URL with a date at the end.
*/

(function() {
    'use strict';

    // Get the current date and month
    var today = new Date();
    var currentMonth = today.getMonth() + 1; // Months are 0-based in JavaScript
    // Check if the current month is within 10 days of the next month
    var daysInMonth = new Date(today.getFullYear(), currentMonth, 0).getDate(); // Get the number of days in the current month
    var daysLeft = daysInMonth - today.getDate(); // Get the number of days left in the current month
    if (daysLeft <= 10) {
        // Set a timeout of 500ms and then load the target URL
        setTimeout(function() {
            console.log("Running WU Cal Next Month after delay"); // Log a message
            // Get the current URL and check if it contains date
            var currentURL = window.location.href; // Get the current URL
            var datePattern = "/date/"; // Create a pattern for the date portion in the URL
            if (currentURL.includes(datePattern)) { // If the current URL already has a date portion
                console.log("The URL already shows a date, doing nothing"); // Log a message
                return; // Exit the script
            }

            // Calculate the next month and year
            var nextMonth = currentMonth + 1; // Calculate the next month
            var nextYear = today.getFullYear(); // Get the current year
            if (nextMonth > 12) {
                nextMonth = 1; // Wrap around to January if December is reached
                nextYear++; // Increment the year by one
            }
            let urlEnd = "/date/" + nextYear + "-" + nextMonth;

            if (currentURL.indexOf("wunderground.com/forecast") > -1) { //Change all the calendar links
                // get all the links with href attribute starting with /calendar/
                let links = document.querySelectorAll('a[href^="/calendar/"]');
                // loop through the links and append /foo to the end of the href attribute
                for (let link of links) {
                  link.href += urlEnd;
                }
            } else if (currentURL.indexOf("wunderground.com/calendar") > -1) {
                // Construct the target URL based on the current URL and the next month and year
                var targetURL = currentURL + urlEnd; // Append the date portion with the next month and year
                // Load the target URL
                window.location.href = targetURL; // Set the window location to the target URL
                console.log("Loaded the target URL"); // Log a message
                }
        }, 2500); // Wait before making changes as WU js is slow!
    }

})();