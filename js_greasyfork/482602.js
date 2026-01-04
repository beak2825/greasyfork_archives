// ==UserScript==
// @name         Refresh Down Now For Everyone
// @namespace    lundeen-bryan
// @version      1.0.0
// @description  If on the downforeveryoneorjustme.com then it will refresh your query every 5 minutes. Alerts user if checked 5 times.
// @author       lundeen-bryan
// @match        https://downforeveryoneorjustme.com/*
// @icon         https://downforeveryoneorjustme.com/favicon.ico
// @license      GPL-2.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482602/Refresh%20Down%20Now%20For%20Everyone.user.js
// @updateURL https://update.greasyfork.org/scripts/482602/Refresh%20Down%20Now%20For%20Everyone.meta.js
// ==/UserScript==

(function () {
  // Set the refresh interval (in milliseconds)
  const refreshInterval = 5 * 60 * 1000; // 5 minutes
  const maxLoops = 5; // Number of loops before sending an alert
  let loopCount = 0;

  // Function to reload the page
  function refreshPage() {
    location.reload();
    loopCount++;

    // Check if the maximum number of loops has been reached
    if (loopCount === maxLoops) {
      sendAlert();
    }
  }

  // Function to send an alert
  function sendAlert() {
    // Replace with your desired alert mechanism (e.g., browser notification, console.log, etc.)
    console.log("Checked for almost 30 minutes. Consider taking a break!");
  }

  // Schedule the refresh
  setInterval(refreshPage, refreshInterval);
})();
