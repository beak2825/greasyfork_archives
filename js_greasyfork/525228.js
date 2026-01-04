// ==UserScript==
// @name         Google Meet Instant Meeting Automator
// @namespace    fiverr.com/web_coder_nsd
// @version      1.1
// @description  Automatically starts an instant meeting on Google Meet if the URL has instantMeeting=true
// @author       noushadBug
// @match        https://meet.google.com/*
// @license      MIT
// @icon         https://meet.google.com/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525228/Google%20Meet%20Instant%20Meeting%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/525228/Google%20Meet%20Instant%20Meeting%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Declare clickInterval in the outer scope so it can be accessed within attemptClicking
    let clickInterval = null;

    // Function to parse query parameters
    function getQueryParams() {
        const params = {};
        window.location.search.substring(1).split("&").forEach(pair => {
            const [key, value] = pair.split("=");
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        return params;
    }

    // Function to attempt clicking the buttons
    function attemptClicking() {
        const companionButton = document.querySelector('[data-is-companion="false"] button');
        const startMeetingButton = document.querySelector('[aria-label="Start an instant meeting"]');

        if (startMeetingButton) {
            console.log('Start an instant meeting button found. Clicking it.');
            startMeetingButton.click();
            if (clickInterval !== null) {
                clearInterval(clickInterval); // Stop the interval once the button is clicked
                clickInterval = null;
                console.log('Automated clicking stopped.');
            }
        } else if (companionButton) {
            console.log('Start button not found. Clicking companion button.');
            companionButton.click();
        } else {
            console.log('Neither button found. Retrying...');
        }
    }

    // Main execution
    window.addEventListener('load', () => {
        const params = getQueryParams();
        if (params.instantMeeting === 'true') {
            console.log('instantMeeting=true detected. Initiating automated clicks in 3 seconds.');
            setTimeout(() => {
                // Initial click attempt
                attemptClicking();
                // Set interval to keep attempting every 2 seconds
                clickInterval = setInterval(attemptClicking, 2000);
                console.log('Automated clicking started.');
            }, 2000);
        } else {
            console.log('instantMeeting=true not detected. No action taken.');
        }
    });
})();
