// ==UserScript==
// @name         PRLFC Auto-Accept and Refresh
// @grant        GM_notification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically accepts studies on PRLFC and refreshes when necessary
// @author       You
// @match        https://app.prolific.com/studies*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/498485/PRLFC%20Auto-Accept%20and%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/498485/PRLFC%20Auto-Accept%20and%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastTitle = document.title;

    // Function to simulate clicking the study accept button
    function acceptStudy() {
        const reserveButton = document.querySelector('button[data-testid="reserve"]');
        if (reserveButton && isElementVisible(reserveButton)) {
            reserveButton.click();
            console.log('Study accepted!');
            GM_notification({
                title: 'Prolific Study Accepted',
                text: 'A study has been automatically accepted.',
                timeout: 5000,
                silent: false,
            });
        }
    }

    // Function to check if an element is visible
    function isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    // Function to refresh the page
    function refreshPage() {
        location.reload();
    }

    // Function to monitor tab title changes and act accordingly
    function monitorTabTitle() {
        const currentTitle = document.title;
        if (currentTitle !== lastTitle) {
            lastTitle = currentTitle;
            refreshPage();
        }
    }

    // Function to periodically check for new studies and accept them
    function checkAndAcceptStudies() {
        setTimeout(acceptStudy, randomTime(1610, 3820)); // Random time between 1.61s and 3.82s
    }

    // Helper function to generate random time within a range
    function randomTime(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Start checking for studies and monitoring tab title changes when the page is loaded
    window.addEventListener('load', function() {
        setInterval(monitorTabTitle, 1000); // Check tab title every second
        checkAndAcceptStudies();
    });

})();
