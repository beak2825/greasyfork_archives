// ==UserScript==
// @name         Keep ServiceNow alive
// @version      1
// @description  Simulates user activity on a webpage by refreshing the page to prevent it from logging out due to inactivity, with reset if user interacts
// @match        https://sparknz.service-now.com/now/nav/ui/classic/*
// @author       chaoscreater
// @grant        none
// @namespace    outlookalive.pureandapplied.com.au
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/489839/Keep%20ServiceNow%20alive.user.js
// @updateURL https://update.greasyfork.org/scripts/489839/Keep%20ServiceNow%20alive.meta.js
// ==/UserScript==

(function() {
    const timeOutMinutes = 5;
    var inactivityTimer;

    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(function() {
            // Show popup
            const popup = document.createElement('div');
            popup.innerHTML = '<p>Reload is about to happen...</p>';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#fff';
            popup.style.padding = '20px';
            popup.style.border = '1px solid #000';
            document.body.appendChild(popup);

            // Wait for 2 seconds
            setTimeout(function() {
                // Reload the page after 2 seconds
                console.log("Reloading due to inactivity");
                location.reload();
            }, 2000);
        }, timeOutMinutes * 60 * 1000); // Reload the page after 15 minutes of inactivity
    }

    // Reset the inactivity timer on user actions
    document.addEventListener("click", resetInactivityTimer);
    document.addEventListener("mousemove", resetInactivityTimer);
    document.addEventListener("keypress", resetInactivityTimer);

    // Initialize the timer
    resetInactivityTimer();
})();
