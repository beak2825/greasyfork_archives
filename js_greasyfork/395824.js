// ==UserScript==
// @name         Student Cafe Timetable Downloader
// @version      0.4
// @description  Grabbing TimeTable from Student Cafe
// @author       James Prince
// @match        https://*/studentcafe/index.cfm?do=studentportal.calendar.main.calendar
// @match        https://*/studentcafe/index.cfm?do=studentportal.timetable.main.fullTimetable
// @grant        none


// Simple Student cafe timetables to ICAL which can be easily added to google calandar or Outlook Calandar
// Download buttons will appear after 2 seconds on either eDiary/Calandars page or My Classes/Full Timetable page

// @namespace https://greasyfork.org/users/439534
// @downloadURL https://update.greasyfork.org/scripts/395824/Student%20Cafe%20Timetable%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/395824/Student%20Cafe%20Timetable%20Downloader.meta.js
// ==/UserScript==


// Function Below from https://github.com/matthiasanderer/icsFormatter
var icsFormatter = function() {
    'use strict';

    if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
        console.log('Unsupported Browser');
        return;
    }

    var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
    var calendarEvents = [];
    var calendarStart = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0'
    ].join(SEPARATOR);
    var calendarEnd = SEPARATOR + 'END:VCALENDAR';

    return {
        /**
         * Returns events array
         * @return {array} Events
         */
        'events': function() {
            return calendarEvents;
        },

        /**
         * Returns calendar
         * @return {string} Calendar in iCalendar format
         */
        'calendar': function() {
            return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
        },

        /**
         * Add event to the calendar
         * @param  {string} subject     Subject/Title of event
         * @param  {string} description Description of event
         * @param  {string} location    Location of event
         * @param  {string} begin       Beginning date of event
         * @param  {string} stop        Ending date of event
         */
        'addEvent': function(subject, description, location, begin, stop) {
            // I'm not in the mood to make these optional... So they are all required
            if (typeof subject === 'undefined' ||
                typeof description === 'undefined' ||
                typeof location === 'undefined' ||
                typeof begin === 'undefined' ||
                typeof stop === 'undefined'
               ) {
                return false;
            }

            //TODO add time and time zone? use moment to format?
            var start_date = new Date(begin);
            var end_date = new Date(stop);

            var start_year = ("0000" + (start_date.getFullYear().toString())).slice(-4);
            var start_month = ("00" + ((start_date.getMonth() + 1).toString())).slice(-2);
            var start_day = ("00" + ((start_date.getDate()).toString())).slice(-2);
            var start_hours = ("00" + (start_date.getHours().toString())).slice(-2);
            var start_minutes = ("00" + (start_date.getMinutes().toString())).slice(-2);
            var start_seconds = ("00" + (start_date.getMinutes().toString())).slice(-2);

            var end_year = ("0000" + (end_date.getFullYear().toString())).slice(-4);
            var end_month = ("00" + ((end_date.getMonth() + 1).toString())).slice(-2);
            var end_day = ("00" + ((end_date.getDate()).toString())).slice(-2);
            var end_hours = ("00" + (end_date.getHours().toString())).slice(-2);
            var end_minutes = ("00" + (end_date.getMinutes().toString())).slice(-2);
            var end_seconds = ("00" + (end_date.getMinutes().toString())).slice(-2);

            // Since some calendars don't add 0 second events, we need to remove time if there is none...
            var start_time = '';
            var end_time = '';
            if (start_minutes + start_seconds + end_minutes + end_seconds !== 0) {
                start_time = 'T' + start_hours + start_minutes + start_seconds;
                end_time = 'T' + end_hours + end_minutes + end_seconds;
            }

            var start = start_year + start_month + start_day + start_time;
            var end = end_year + end_month + end_day + end_time;

            var calendarEvent = [
                'BEGIN:VEVENT',
                'CLASS:PUBLIC',
                'DESCRIPTION:' + description,
                'DTSTART;VALUE=DATE:' + start,
                'DTEND;VALUE=DATE:' + end,
                'LOCATION:' + location,
                'SUMMARY;LANGUAGE=en-us:' + subject,
                'TRANSP:TRANSPARENT',
                'END:VEVENT'
            ].join(SEPARATOR);

            calendarEvents.push(calendarEvent);
            return calendarEvent;
        },

        /**
         * Download calendar using the saveAs function from filesave.js
         * @param  {string} filename Filename
         * @param  {string} ext      Extention
         */
        'download': function(filename, ext) {
            if (calendarEvents.length < 1) {
                return false;
            }

            ext = (typeof ext !== 'undefined') ? ext : '.ics';
            filename = (typeof filename !== 'undefined') ? filename : 'calendar';
            var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
            window.open( "data:text/calendar;charset=utf8," + escape(calendar));
        }
    };
};

async function DownloadCal(cal) {
    var today = new Date(), start = new Date(today.getFullYear(), 1, 1), end = new Date(today.getFullYear(), 12, 1),
        payload = "firstday=Sun&slotminutes=30&firsthour=06:00&defaultview=month&start=" + start.getTime() / 1000 + "&end=" + end.getTime() / 1000;

    await fetch("/studentcafe/remote-json.cfm?"+ $.param({"do": cal, "rawdata": "true"}), {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin', // no-cors, *cors, same-origin
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {'Content-Type': "application/x-www-form-urlencoded"},
        body: payload // body data type must match "Content-Type" header
    }).then((response) => {
        return response.json();
    }).then((JSONCalandar) => {
        var calEntry = icsFormatter();
        JSONCalandar.forEach(function(Event){
            console.log(Event);
            calEntry.addEvent(Event.title,Event.description, Event.location, new Date(Event.start).toUTCString(), new Date(Event.end).toUTCString());
        })
        calEntry.download('Calandar');
    });
}

// RUN

(async function() {
    'use strict';

    var addcheck = setInterval(function() {
        if (!$("#downloadTimetablebtn").length){
            clearInterval(addcheck);
            var locations = [$("#printBtn"),$("#addCalendarBtn")];
            locations[1].parent().append('<button id="downloadSchoolCalandarbtn" class="btn btn-primary"><span class="hidden-phone">Download School Calandar</span><span class="visible-phone" style="display: none;">&nbsp;<i class="icon icon-plus icon-white"></i>&nbsp;</span></button>');
            locations.forEach(function(location){
                location.parent().append('<button id="downloadTimetablebtn" class="btn btn-primary"><span class="hidden-phone">Download Timetable</span><span class="visible-phone" style="display: none;">&nbsp;<i class="icon icon-plus icon-white"></i>&nbsp;</span></button>');
            });
            $("#downloadSchoolCalandarbtn").click(function() {DownloadCal("ui.web.calendar.school")});
            $("#downloadTimetablebtn").click(function() {DownloadCal("ui.web.calendar.timetable")});
        }
    }, 2000);
})();