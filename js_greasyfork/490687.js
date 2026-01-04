// ==UserScript==
// @name         Nitro Type Current Session Display
// @version      0.5
// @description  Display current session information on Nitro Type pages
// @author       Cortezz
// @match        https://www.nitrotype.com/*
// @grant        GM_xmlhttpRequest
// @namespace none
// @downloadURL https://update.greasyfork.org/scripts/490687/Nitro%20Type%20Current%20Session%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/490687/Nitro%20Type%20Current%20Session%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create HTML element to display current session information
    var sessionDiv = document.createElement('div');
    sessionDiv.setAttribute('id', 'sessionDiv');
    sessionDiv.style.position = 'fixed';
    sessionDiv.style.bottom = '20px';
    sessionDiv.style.right = '20px';
    sessionDiv.style.padding = '10px';
    sessionDiv.style.backgroundColor = '#fff';
    sessionDiv.style.border = '2px solid #000';
    sessionDiv.style.zIndex = '9999';
    sessionDiv.innerHTML = `
        <div>Current Session:</div>
        <div id="currentSessionInfo">Loading...</div>
        <button id="closeButton">Close</button>
    `;
    document.body.appendChild(sessionDiv);

    // Function to update session information
    function updateSessionInfo(sessionData) {
        var sessionInfo = 'WPM: ' + sessionData.WPM + ' | Accuracy: ' + sessionData.Accuracy + ' | Races Completed: ' + sessionData.RacesCompleted;
        document.getElementById('currentSessionInfo').innerText = sessionInfo;
    }

    // Function to fetch user's session data from the Nitro Type page
    function fetchSessionData() {
        var statsContainer = document.querySelector('.nt-stats-metric-session-races').parentNode;
        if (statsContainer) {
            var sessionData = {
                WPM: statsContainer.querySelector('.nt-stats-metric-session-wpm').innerText.trim(),
                Accuracy: statsContainer.querySelector('.nt-stats-metric-session-accuracy').innerText.trim(),
                RacesCompleted: statsContainer.querySelector('.nt-stats-metric-session-races').innerText.trim()
            };
            updateSessionInfo(sessionData);
        } else {
            setTimeout(fetchSessionData, 1000); // Retry after 1 second if stats container is not found
        }
    }

    // Update session info initially
    fetchSessionData();

    // Close button event listener
    document.getElementById('closeButton').addEventListener('click', function() {
        sessionDiv.style.display = 'none';
    });

    // Refresh handler
    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('sessionDivDisplay', sessionDiv.style.display);
    });

    window.addEventListener('load', function() {
        var displaySetting = sessionStorage.getItem('sessionDivDisplay');
        if (displaySetting !== 'none') {
            sessionDiv.style.display = displaySetting;
        }
    });
})();
