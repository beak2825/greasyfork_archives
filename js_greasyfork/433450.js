// ==UserScript==
// @name         Auto Dim Twitter
// @namespace    https://burakgarci.net
// @version      1.1
// @description  Toggles the Twitter web dark mode based on the selected hour range
// @author       Burak Garcı
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?domain=x.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/433450/Auto%20Dim%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/433450/Auto%20Dim%20Twitter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default hour range
    var defaultStartHour = 19; // Set the start hour here (in 24-hour format)
    var defaultEndHour = 8; // Set the end hour here (in 24-hour format)

    // Check for stored hours
    var storedStartHour = parseInt(GM_getValue('startHour'));
    var storedEndHour = parseInt(GM_getValue('endHour'));

    // Use default hours if no stored hours found
    var startHour = !isNaN(storedStartHour) ? storedStartHour : defaultStartHour;
    var endHour = !isNaN(storedEndHour) ? storedEndHour : defaultEndHour;

    // Create menu command for user to change settings
    GM_registerMenuCommand('Set Hour Range', setHourRange);

    // Function to set hour range
    function setHourRange() {
        var inputStartHour = prompt('Enter the start hour (in 24-hour format):', startHour);
        var inputEndHour = prompt('Enter the end hour (in 24-hour format):', endHour);

        if (inputStartHour !== null && inputEndHour !== null) {
            var parsedStartHour = parseInt(inputStartHour);
            var parsedEndHour = parseInt(inputEndHour);

            if (!isNaN(parsedStartHour) && !isNaN(parsedEndHour)) {
                startHour = parsedStartHour;
                endHour = parsedEndHour;
                GM_setValue('startHour', startHour);
                GM_setValue('endHour', endHour);
                applyDarkMode();
            } else {
                alert('Invalid hour value!');
            }
        }
    }

    // Function to apply dark mode based on hour range
    function applyDarkMode() {
        var currentHour = new Date().getHours();

        if (currentHour >= startHour || currentHour < endHour) {
            document.cookie = 'night_mode=1; path=/; secure; domain=.x.com';
        } else {
            document.cookie = 'night_mode=0; path=/; secure; domain=.x.com';
        }
    }

    // Apply dark mode on initial load
    applyDarkMode();
})();