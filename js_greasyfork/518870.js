// ==UserScript==
// @name         Timesheets Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button at the top middle of every webpage that redirects to elmo.
// @author       Emma Nipperess
// @match        https://hub24.elmotalent.com.au/payroll/v5
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518870/Timesheets%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/518870/Timesheets%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
  // Create a new button element
    var openTimesheetsBtn = document.createElement('button');
    openTimesheetsBtn.innerHTML = "Go to Timesheets"; // Set the text inside the button
    // Style the button
    openTimesheetsBtn.style.position = 'fixed';
    openTimesheetsBtn.style.top = '10px'; // Adjusted to not be exactly at the edge
    openTimesheetsBtn.style.left = '50%'; // Center the button horizontally
    openTimesheetsBtn.style.transform = 'translateX(-50%)'; // Adjust for exact centering
    openTimesheetsBtn.style.backgroundColor = '#4CAF50'; // green
    openTimesheetsBtn.style.color = 'white';
    openTimesheetsBtn.style.padding = '10px 20px';
    openTimesheetsBtn.style.zIndex = '10000'; // Ensure it's on top of other content
    openTimesheetsBtn.style.border = 'none';
    openTimesheetsBtn.style.borderRadius = '5px';
    openTimesheetsBtn.style.cursor = 'pointer'; // Change cursor on hover
    openTimesheetsBtn.style.fontSize = '16px';
    openTimesheetsBtn.style.fontFamily = 'Arial, sans-serif';

    function getEmployeeIdFromURL(currentUrl) {

      // Use a regular expression to find the digit(s) following "Employee/"
      const match = currentUrl.match(/Employee\/(\d+)/);

      // match[1] contains the first capturing group, which is the sequence of digits we're interested in
      // If a match is found, return it, otherwise return null or some default value
      return match ? match[1] : null;
  }

    function getLastDayOfCurrentMonth() {
      // Step 1: Create a Date object for the current date.
      const currentDate = new Date();
      
      // Step 2: Extract the year and month from the current date.
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // Note: January is 0, December is 11
      
      // Step 3: Find the last day of the current month.
      // Adding 1 to the month and setting the day as 0 will give us the last day of the current month.
      const lastDayDate = new Date(year, month + 1, 0);
      
      // Step 4: Format the date in YYYY-MM-DD format.
      const formattedDate = `${lastDayDate.getFullYear()}-${String(lastDayDate.getMonth() + 1).padStart(2, '0')}-${String(lastDayDate.getDate()).padStart(2, '0')}`;
      
      return formattedDate;
    }
    // Add click event listener to the button
    openTimesheetsBtn.addEventListener('click', function() {
        var url = document.querySelector('[data-testid="elmo-menu-timesheet"]').href;
        var updatedUrl = url + "m/" + getLastDayOfCurrentMonth() + "/" + getEmployeeIdFromURL(url);
        window.location.href = updatedUrl;
        console.log(updatedUrl);
    });

    // Append the button to the body
    document.body.appendChild(openTimesheetsBtn);
})();
