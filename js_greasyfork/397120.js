// ==UserScript==
// @name        MLB.TV Time Zone Converter
// @description  Convert MLB.TV game times to other time zones
// @author      no space
// @include     https://www.mlb.com/live-stream-games*
// @exclude     https://www.mlb.com/live-stream-games/help-center*
// @exclude     https://www.mlb.com/live-stream-games/subscribe*
// @version     1
//
// @namespace https://greasyfork.org/users/452162
// @downloadURL https://update.greasyfork.org/scripts/397120/MLBTV%20Time%20Zone%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/397120/MLBTV%20Time%20Zone%20Converter.meta.js
// ==/UserScript==

// ==CUSTOM OPTIONS==

// Use 'local' to use your computer's default time zone. If you want to display a different time zone, go to
// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones and put the "TZ database name" for your time zone in the quotations.
// Example: 'America/Los_Angeles'
    var TimeZone = 'local'

// Defaults to your computer's default date format. You can change this to 'en-US' for US English date format,
// 'en-GB' for International English date format, or any other language format you prefer
    var dateFormat = 'local'


// ==SCRIPT==

function convertGameTime() {

    // Obtain the current time in ET. Should safely account for DST changes.
    var etTime = new Date().toLocaleString([], { timeZone: 'America/New_York' });
    var etTimef = new Date(etTime);

    // Obtain the offset between ET and user's local time zone.
    var tzOffset
    if(TimeZone.toLowerCase() == 'local') {
        tzOffset = new Date() - etTimef;
    }

    // Obtain the offset between US Eastern Time and the user's chosen time zone.
    try{
        if(TimeZone.toLowerCase() != 'local') {
            var cusTime = new Date().toLocaleString([], { timeZone: TimeZone });
            var cusTimef = new Date(cusTime);
            tzOffset = cusTimef - etTimef;
    }

    // If there's an error with the user's chosen Time Zone: display an error message, remove on-click trigger, and terminate current loop.
    }
    catch(err){
        alert('Time Zone Converter Error: Unknown Time Zone \'' + TimeZone + '\'. Make sure your TimeZone setting is correct, or revert it to \'local\'. Script terminated.')
        window.removeEventListener('click', convertGameTime);
        return;
    }

    // Read the user's chosen dateFormat, and test whether it works. If there's an error: display an error message, remove on-click trigger, and terminate current loop.
    var df;
    if(dateFormat.toLowerCase() == 'local') {
        df = [];
    }
    try{
        if(dateFormat.toLowerCase != 'local') {
            df = dateFormat;
            var dt = new Date().toLocaleString(df);
        }
    }
    catch(err){
        alert('Time Zone Converter Error: Unknown language format \'' + dateFormat + '\'. Please make sure your dateFormat setting is correct, or revert it to \'local.\' Script terminated.')
        window.removeEventListener('click', convertGameTime);
        return;
    }

    // Pull the times and dates from the page. Page source date doesn't update when clicking to other dates, so pull the date from URL instead if it contains numbers.
	var mlbTimes = document.getElementsByClassName('card-time');
    var gameDate;
    var url = window.location.href

    if(/\d/.test(url) == false) {
        gameDate = document.getElementById('date-container').getAttribute('data-initial-date');
    }
    if(/\d/.test(url) == true) {
        gameDate = window.location.href.slice(-10);
    }

    // Iterate through the list of times
    for(var i=0; i<mlbTimes.length; i++) {

		var time = mlbTimes[i];

        // Detect whether the script has already run on the page, and terminate if so.
        if(time.getAttribute('title') != null) {
            return false;
        }

        // Convert page time to a string, without the ' ET' for simplicity
        var pageTime = time.innerText.slice(0,-3);

        // Split the time string into usable pieces, convert the hour to an integer for later use.
        var timeArray = new Array();
        timeArray = pageTime.split(/ |:/);
        var hr = Number(timeArray[0]);
        var min = timeArray[1];
        var meridian = timeArray[2];

        // Convert to 24hr format for simplicity
        if(meridian == 'PM') {
            hr += 12;
        }

        // Combine the date and time into a usable Date
        var mlbDate = new Date(gameDate + ' ' + hr + ':' + min);

        // Use the offset from above to get the game time in user's desired time zone
        var localDate = new Date(mlbDate.getTime() + tzOffset);

        // Write the date onto the page, and show the conversion in the mouseover box
        time.innerHTML = localDate.toLocaleString(df, {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'});
		time.setAttribute('title', 'Game time offset by ' + (tzOffset/3600000).toFixed(1) + ' hours.');
	}
}

// Run the script whenever the user clicks
window.addEventListener('click', convertGameTime);

//trans rights baby!
