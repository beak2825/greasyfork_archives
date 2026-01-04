// ==UserScript==
// @name         Supercars Session Times to Local
// @description  Convert Australian V8 Supercars championship session times shown on supercars.com from Australian Eastern Time to local/system time.
// @author       Midavalo
// @license      MIT
// @version      1.1
// @include      https://www.supercars.com/*
// @exclude      none
// @grant        none

// @namespace https://greasyfork.org/users/821902
// @downloadURL https://update.greasyfork.org/scripts/436233/Supercars%20Session%20Times%20to%20Local.user.js
// @updateURL https://update.greasyfork.org/scripts/436233/Supercars%20Session%20Times%20to%20Local.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtain the current time in Australian Eastern Time. Should safely account for DST changes.
    var aetTime = new Date().toLocaleString([], { timeZone: 'Australia/Sydney' });
    var aetTimef = new Date(aetTime);

    // Obtain the offset between ET and user's local time zone.
    var tzOffset;
    tzOffset = new Date() - aetTimef;

    // Pull the session times from the page.
    var scTimes = document.getElementsByClassName('resultsummary-table-practice');
    var d = new Date();
    var todayDate = d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate();
    // Just gets todays date to run the time shift on time only.  JS doesn't have time distinct from datetime.

    // Iterate through the list of times
    for(var i=0; i<scTimes.length; i++) {

        var scTime = scTimes[i];

        // Detect whether the script has already run on the page, and terminate if so.
        if(scTime.getAttribute('title') != null) {return false;}

        // Convert page time to a string for simplicity
        var pageTime = scTime.innerText.slice(0);

        // Split the time string into usable pieces
        var scTimeArray = [];
        scTimeArray = pageTime.split(/ |:/);
        // Start Time
        var hr1 = scTimeArray[0]; //  Start Hour
        var min1 = scTimeArray[1]; // Start Minute
        // End Time
        var hr2 = scTimeArray[3]; //  End Hour
        var min2 = scTimeArray[4]; // End Minute

        // Combine the date and time into a usable Date
        var newSessionStart = new Date(todayDate + ' ' + hr1 + ':' + min1);
        var newSessionEnd = new Date(todayDate + ' ' + hr2 + ':' + min2);

        // Use the offset from above to get the game time in user's desired time zone
        var localSessionStart = new Date(newSessionStart.getTime() + tzOffset);
        var localSessionEnd = new Date(newSessionEnd.getTime() + tzOffset);
        var options = {hour: 'numeric', minute: '2-digit' };
        var locale = 'en-de';

        // Write the local session times onto the page, and show the conversion in the mouseover box
        scTime.innerHTML = localSessionStart.toLocaleString(locale, options) + ' - ' + localSessionEnd.toLocaleString(locale, options);
        scTime.setAttribute('title', 'Session time offset by ' + (tzOffset/3600000).toFixed(1) + ' hours.  Originally ' + pageTime + ' AET');
    }
})();