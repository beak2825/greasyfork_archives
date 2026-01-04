// ==UserScript==
// @name         Auto Refresh and Click Button at 10:00:01 with Polling
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Refresh the page at 10:00:01 and continuously check if the "Depunere Persoane Fizice" button becomes enabled to click it automatically.
// @author       You
// @match        https://depunerefotovoltaice.afm.ro/
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/511543/Auto%20Refresh%20and%20Click%20Button%20at%2010%3A00%3A01%20with%20Polling.user.js
// @updateURL https://update.greasyfork.org/scripts/511543/Auto%20Refresh%20and%20Click%20Button%20at%2010%3A00%3A01%20with%20Polling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Time you want to refresh the page (10:00:01)
    const targetHour = 10;
    const targetMinute = 0;
    const targetSecond = 1;

    // Function to refresh the page
    function refreshPage() {
        location.reload(); // This will refresh the page
    }

    // Function to click the "Depunere Persoane Fizice" button
    function clickDepunerePF() {
        const depunereButton = document.querySelector('a[href="/Depunere/DepunerePF"]');
        if (depunereButton) {
            // Check if the button has the 'disabled' class
            if (!depunereButton.classList.contains('disabled')) {
                console.log("Button is enabled, clicking...");
                depunereButton.click();
            } else {
                console.log('Button "Depunere Persoane Fizice" is disabled. Will keep checking.');
                // Keep checking every 100ms until the button is enabled
                waitForButtonToBeEnabled(depunereButton);
            }
        } else {
            console.log('Button "Depunere Persoane Fizice" not found.');
        }
    }

    // Function to keep checking if the button is enabled
    function waitForButtonToBeEnabled(button) {
        const checkInterval = setInterval(function() {
            if (!button.classList.contains('disabled')) {
                console.log("Button is now enabled, clicking...");
                button.click();
                clearInterval(checkInterval); // Stop checking once the button is enabled and clicked
            }
        }, 100); // Check every 100 milliseconds
    }

    // Function to check if the current time matches 10:00:01
    function checkTime() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();

        // If the current time is 10:00:01, refresh the page
        if (currentHour === targetHour && currentMinute === targetMinute && currentSecond === targetSecond) {
            console.log("Refreshing page at 10:00:01...");
            refreshPage();
        }
    }

    // Check the time every second until 10:00:01
    setInterval(checkTime, 1000);

    // After page refresh, wait for the button to become enabled
    document.addEventListener('DOMContentLoaded', function() {
        // Wait for 100 milliseconds to ensure the page is fully loaded
        setTimeout(function() {
            console.log("Checking for button after page load...");
            clickDepunerePF();
        }, 100); // Short delay to ensure DOM is ready
    });

})();
