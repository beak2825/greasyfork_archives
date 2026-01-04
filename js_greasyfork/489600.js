// ==UserScript==
// @name         Timesheets Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button at the top middle of every webpage that redirects to Google.
// @author       Your Name
// @match        https://hub24.elmotalent.com.au/payroll/v5
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489600/Timesheets%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/489600/Timesheets%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
  // Create a new button element
    var googleButton = document.createElement('button');
    googleButton.innerHTML = "Go to Timesheets"; // Set the text inside the button
    // Style the button
    googleButton.style.position = 'fixed';
    googleButton.style.top = '10px'; // Adjusted to not be exactly at the edge
    googleButton.style.left = '50%'; // Center the button horizontally
    googleButton.style.transform = 'translateX(-50%)'; // Adjust for exact centering
    googleButton.style.backgroundColor = '#4CAF50'; // A pleasant green
    googleButton.style.color = 'white';
    googleButton.style.padding = '10px 20px';
    googleButton.style.zIndex = '10000'; // Ensure it's on top of other content
    googleButton.style.border = 'none';
    googleButton.style.borderRadius = '5px';
    googleButton.style.cursor = 'pointer'; // Change cursor on hover
    googleButton.style.fontSize = '16px';
    googleButton.style.fontFamily = 'Arial, sans-serif';

    // Add click event listener to the button
    googleButton.addEventListener('click', function() {
        window.location.href = document.querySelector('[data-testid="elmo-menu-timesheet"]').href;
    });

    // Append the button to the body
    document.body.appendChild(googleButton);
})();
