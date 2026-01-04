// ==UserScript==
// @name         Schedule to ICS Converter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract schedule from webpage and convert it to ICS format
// @author       vladimir.slaykovskiy@cellvoyant.com
// @match        https://isscr.junolive.co/AM23/myschedule
// @icon         https://www.google.com/s2/favicons?sz=64&domain=junolive.co
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468136/Schedule%20to%20ICS%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/468136/Schedule%20to%20ICS%20Converter.meta.js
// ==/UserScript==

(function() {
    //'use strict';

/* global saveAs, Blob, BlobBuilder, console */
/* exported ics */

var ics = function(uidDomain, prodId) {
  'use strict';

  if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
    console.log('Unsupported Browser');
    return;
  }

  if (typeof uidDomain === 'undefined') { uidDomain = 'default'; }
  if (typeof prodId === 'undefined') { prodId = 'Calendar'; }

  var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
  var calendarEvents = [];
  var calendarStart = [
    'BEGIN:VCALENDAR',
    'PRODID:' + prodId,
    'VERSION:2.0'
  ].join(SEPARATOR);
  var calendarEnd = SEPARATOR + 'END:VCALENDAR';
  var BYDAY_VALUES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

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
    'addEvent': function(subject, description, location, begin, stop, rrule) {
      // I'm not in the mood to make these optional... So they are all required
      if (typeof subject === 'undefined' ||
        typeof description === 'undefined' ||
        typeof location === 'undefined' ||
        typeof begin === 'undefined' ||
        typeof stop === 'undefined'
      ) {
        return false;
      }

      // validate rrule
      if (rrule) {
        if (!rrule.rrule) {
          if (rrule.freq !== 'YEARLY' && rrule.freq !== 'MONTHLY' && rrule.freq !== 'WEEKLY' && rrule.freq !== 'DAILY') {
            throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";
          }

          if (rrule.until) {
            if (isNaN(Date.parse(rrule.until))) {
              throw "Recurrence rrule 'until' must be a valid date string";
            }
          }

          if (rrule.interval) {
            if (isNaN(parseInt(rrule.interval))) {
              throw "Recurrence rrule 'interval' must be an integer";
            }
          }

          if (rrule.count) {
            if (isNaN(parseInt(rrule.count))) {
              throw "Recurrence rrule 'count' must be an integer";
            }
          }

          if (typeof rrule.byday !== 'undefined') {
            if ((Object.prototype.toString.call(rrule.byday) !== '[object Array]')) {
              throw "Recurrence rrule 'byday' must be an array";
            }

            if (rrule.byday.length > 7) {
              throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week";
            }

            // Filter any possible repeats
            rrule.byday = rrule.byday.filter(function(elem, pos) {
              return rrule.byday.indexOf(elem) == pos;
            });

            for (var d in rrule.byday) {
              if (BYDAY_VALUES.indexOf(rrule.byday[d]) < 0) {
                throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'";
              }
            }
          }
        }
      }

      //TODO add time and time zone? use moment to format?
      var start_date = new Date(begin);
      var end_date = new Date(stop);
      var now_date = new Date();

      var start_year = ("0000" + (start_date.getFullYear().toString())).slice(-4);
      var start_month = ("00" + ((start_date.getMonth() + 1).toString())).slice(-2);
      var start_day = ("00" + ((start_date.getDate()).toString())).slice(-2);
      var start_hours = ("00" + (start_date.getHours().toString())).slice(-2);
      var start_minutes = ("00" + (start_date.getMinutes().toString())).slice(-2);
      var start_seconds = ("00" + (start_date.getSeconds().toString())).slice(-2);

      var end_year = ("0000" + (end_date.getFullYear().toString())).slice(-4);
      var end_month = ("00" + ((end_date.getMonth() + 1).toString())).slice(-2);
      var end_day = ("00" + ((end_date.getDate()).toString())).slice(-2);
      var end_hours = ("00" + (end_date.getHours().toString())).slice(-2);
      var end_minutes = ("00" + (end_date.getMinutes().toString())).slice(-2);
      var end_seconds = ("00" + (end_date.getSeconds().toString())).slice(-2);

      var now_year = ("0000" + (now_date.getFullYear().toString())).slice(-4);
      var now_month = ("00" + ((now_date.getMonth() + 1).toString())).slice(-2);
      var now_day = ("00" + ((now_date.getDate()).toString())).slice(-2);
      var now_hours = ("00" + (now_date.getHours().toString())).slice(-2);
      var now_minutes = ("00" + (now_date.getMinutes().toString())).slice(-2);
      var now_seconds = ("00" + (now_date.getSeconds().toString())).slice(-2);

      // Since some calendars don't add 0 second events, we need to remove time if there is none...
      var start_time = '';
      var end_time = '';
      if (start_hours + start_minutes + start_seconds + end_hours + end_minutes + end_seconds != 0) {
        start_time = 'T' + start_hours + start_minutes + start_seconds;
        end_time = 'T' + end_hours + end_minutes + end_seconds;
      }
      var now_time = 'T' + now_hours + now_minutes + now_seconds;

      var start = start_year + start_month + start_day + start_time;
      var end = end_year + end_month + end_day + end_time;
      var now = now_year + now_month + now_day + now_time;

      // recurrence rrule vars
      var rruleString;
      if (rrule) {
        if (rrule.rrule) {
          rruleString = rrule.rrule;
        } else {
          rruleString = 'rrule:FREQ=' + rrule.freq;

          if (rrule.until) {
            var uDate = new Date(Date.parse(rrule.until)).toISOString();
            rruleString += ';UNTIL=' + uDate.substring(0, uDate.length - 13).replace(/[-]/g, '') + '000000Z';
          }

          if (rrule.interval) {
            rruleString += ';INTERVAL=' + rrule.interval;
          }

          if (rrule.count) {
            rruleString += ';COUNT=' + rrule.count;
          }

          if (rrule.byday && rrule.byday.length > 0) {
            rruleString += ';BYDAY=' + rrule.byday.join(',');
          }
        }
      }

      var stamp = new Date().toISOString();

      var calendarEvent = [
        'BEGIN:VEVENT',
        'UID:' + calendarEvents.length + "@" + uidDomain,
        'CLASS:PUBLIC',
        'DESCRIPTION:' + description,
        'DTSTAMP;VALUE=DATE-TIME:' + now,
        'DTSTART;VALUE=DATE-TIME:' + start,
        'DTEND;VALUE=DATE-TIME:' + end,
        'LOCATION:' + location,
        'SUMMARY;LANGUAGE=en-us:' + subject,
        'TRANSP:TRANSPARENT',
        'END:VEVENT'
      ];

      if (rruleString) {
        calendarEvent.splice(4, 0, rruleString);
      }

      calendarEvent = calendarEvent.join(SEPARATOR);

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

      var blob;
      if (navigator.userAgent.indexOf('MSIE 10') === -1) { // chrome or firefox
        blob = new Blob([calendar]);
      } else { // ie
        var bb = new BlobBuilder();
        bb.append(calendar);
        blob = bb.getBlob('text/x-vCalendar;charset=' + document.characterSet);
      }
      saveAs(blob, filename + ext);
      return calendar;
    },

    /**
     * Build and return the ical contents
     */
    'build': function() {
      if (calendarEvents.length < 1) {
        return false;
      }

      var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;

      return calendar;
    }
  };
};

    function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
     actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
     bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
     iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes     = $(selectorTxt);
        else
            targetNodes     = $(iframeSelector).contents ()
                .find (selectorTxt);

        if (targetNodes  &&  targetNodes.length > 0) {
            btargetsFound   = true;
            /*--- Found target node(s).  Go through each and act if they
            are new.
        */
            targetNodes.each ( function () {
                var jThis        = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound     = actionFunction (jThis);
                    if (cancelFound)
                        btargetsFound   = false;
                    else
                        jThis.data ('alreadyFound', true);
                }
            } );
        }
        else {
            btargetsFound   = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj      = waitForKeyElements.controlObj  ||  {};
        var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl     = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval (timeControl);
            delete controlObj [controlKey]
        }
        else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                        actionFunction,
                                        bWaitOnce,
                                        iframeSelector
                                       );
                },
                                           300
                                          );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj   = controlObj;
    }

      waitForKeyElements (
            //"#content_list"
          ".myschedule_row"
            , loaded, true
        );

    function loaded( jnode) {
        if ($('#ics_link').length > 0) {
            return;
        }

        console.log('start');
        let scheduleRows = document.querySelectorAll('.myschedule_row');

        let calendarEvents = [];

function parseDateTimes(dateString, timeRangeString) {
    // Get current year
    console.log("parseDateTimes", dateString, timeRangeString);
    let currentYear = new Date().getFullYear();

    // Remove ordinal suffix from day in date string
    let cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");

    // Split time range into start and end times
    let times = timeRangeString.replace(/(PM|AM)/, " $1").split(" - ");

    // Construct start and end date strings and parse into Date objects
    let startDateTimeString = `${cleanDateString}, ${currentYear} ${times[0]}`;
    let endDateTimeString = `${cleanDateString}, ${currentYear} ${times[1]}`;
    console.log(startDateTimeString, endDateTimeString);
    let startDateTime = new Date(startDateTimeString);
    let endDateTime = new Date(endDateTimeString);
    console.log("End of parseDateTimes");
    return [startDateTime, endDateTime];
}

        scheduleRows.forEach(row => {
            console.log("parsing date time");
            let eventObj = {};
            let dateString = row.querySelector('.split_container').innerText;
            let timeString = row.querySelector('.date_time_container').innerText.replace(' ', '');
            let res = parseDateTimes(dateString, timeString);
            let date = res[0];
            eventObj.start = date; //[date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()];
            console.log(eventObj.start);
            let endTime = res[1];
            eventObj.end = endTime; //[endTime.getFullYear(), endTime.getMonth() + 1, endTime.getDate(), endTime.getHours(), endTime.getMinutes()];
            console.log(eventObj.end);
            eventObj.title = row.querySelector('.title_container').innerText;
            eventObj.description = row.querySelector('.subtitle_container').innerText;
            eventObj.location = row.querySelector('.location_container span').innerText;
            calendarEvents.push(eventObj);
        });
        console.log(scheduleRows);
        // Create a calendar
        let calendar = ics();

        // Add events to calendar
        calendarEvents.forEach(event => {
            calendar.addEvent(event.title, event.description, event.location, event.start, event.end);
        });
        console.log(calendarEvents);

        // Create download link element
        let downloadLink = document.createElement('a');
        downloadLink.setAttribute("id", "ics_link");

        downloadLink.href = 'data:text/calendar;charset=utf8,' + encodeURIComponent(calendar.build());
        downloadLink.download = 'schedule.ics';
        downloadLink.innerText = 'Download Schedule';


        $('#content_list').append(downloadLink);
        console.log('done');
    }

})();