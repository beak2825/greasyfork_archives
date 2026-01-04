
// ==UserScript==
// @name         DB Trips iCal Saver
// @namespace    https://github.com/tcpekin/deutsche-bahn-ics
// @version      2024-03-26
// @license      MIT
// @description  Adds "Add to Calendar" option for DB trips
// @author       You
// @match        https://www.bahn.de/buchung/fahrplan/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bahn.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488371/DB%20Trips%20iCal%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/488371/DB%20Trips%20iCal%20Saver.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /**

    Here I use a slightly modified icsFormatter by @matthiasanderer

    Credits: matthiasanderer (https://github.com/matthiasanderer/icsFormatter)

    **/
    window.icsFormatter = function () {
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
            'events': function () {
                return calendarEvents;
            },

            'calendar': function () {
                return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
            },
            'addEvent': function (subject, description, location, begin, stop) {
                if (typeof subject === 'undefined' ||
                    typeof description === 'undefined' ||
                    typeof location === 'undefined' ||
                    typeof begin === 'undefined' ||
                    typeof stop === 'undefined'
                ) {
                    return false;
                }
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
                    'DTSTART:' + start,
                    'DTEND:' + end,
                    'LOCATION:' + location,
                    'SUMMARY;LANGUAGE=en-us:' + subject,
                    'TRANSP:TRANSPARENT',
                    'END:VEVENT'
                ].join(SEPARATOR);

                calendarEvents.push(calendarEvent);
                return calendarEvent;
            },

            'download': function (filename, ext) {
                if (calendarEvents.length < 1) {
                    return false;
                }
                var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
                var a = document.createElement('a');
                a.href = "data:text/calendar;charset=utf8," + escape(calendar);
                a.download = 'db_trip.ics';
                document.getElementsByTagName('body')[0].appendChild(a);
                a.click();
            }
        };
    };

    function parent(el, n) {
        while (n > 0) {
            el = el.parentNode;
            n--;
        }
        return el;
    };

    function formatDate(inputDate) {
        // Split the input date string by space
        const parts = inputDate.split(' ');

        // Map month names to their numeric representation (English)
        const monthMap = {
            'Jan.': '01',
            'Feb.': '02',
            'März': '03',
            'Apr.': '04',
            'Mai': '05',
            'Juni': '06',
            'Juli': '07',
            'Aug.': '08',
            'Sep.': '09',
            'Okt.': '10',
            'Nov.': '11',
            'Dez.': '12'
        };

        // Extract day, month, and year
        const day = parts[1].slice(0, -1); // Remove the trailing dot
        const month = monthMap[parts[2]]; // Convert month to numeric format
        const year = parts[3];
        // console.log({day, month, year})
        // Pad day with leading zero if needed
        const paddedDay = day.length === 1 ? '0' + day : day;

        // Return formatted date string
        return `${month}.${paddedDay}.${year}`;
    }



    function main() {
        var actionMenuUl = document.querySelectorAll(".ActionMenu div div ul");
        actionMenuUl.forEach((element, i) => {
            if (element.querySelectorAll("li").length > 2) return;
            var addCalendarOption = document.createElement("li");
            addCalendarOption.className = "_content-button _content-button--with-icons add_to_calendar";
            addCalendarOption.setAttribute("style", "align-items: center; column-gap: .5rem; cursor: pointer; display: flex; padding: .75rem 1.0rem;");
            var spanEl = document.createElement("span");
            spanEl.className = "db-color--dbRed db-web-icon--custom-size icon-action-share db-web-icon";
            var spanElWithDesc = document.createElement("span");
            spanElWithDesc.innerHTML = "Add to calendar";
            addCalendarOption.appendChild(spanEl);
            addCalendarOption.appendChild(spanElWithDesc);
            addCalendarOption.addEventListener("click", function (e) { saveTripToICS(e.target) });
            element.appendChild(addCalendarOption);

            parent(element, 2).setAttribute("style", "--item-count: 3;");

            var style = document.createElement("style");
            style.innerHTML = '.add_to_calendar:hover { background: #f0f3f5; }';
            document.head.appendChild(style);
        });
    };

    setInterval(main, 1000);

    function waitFor(selectorFunc, applyFunc) {
        var itl = setInterval(function () {
            if (selectorFunc()) {
                clearInterval(itl);
                applyFunc();
            }
        }, 50);
    }


    function saveTripToICS(targetElement) {
        var trip = parent(targetElement, 7);
        trip.querySelector(".reiseplan__details").style.display = "none";
        trip.querySelector(".reiseplan__details button").click();
        waitFor(
            function () {
                return trip.querySelector(".reise-details__infos") != null && trip.querySelector("ri-transport-chip").getAttribute("transport-text") != null
            },
            function () {
                trip.querySelector(".reise-details__infos").style.display = "none";
                trip.querySelector(".reise-details__actions").style.display = "none";
                var tripParts = trip.querySelectorAll(".verbindungs-abschnitt");
                var parsedTripParts = parseTripParts(tripParts);

                window.calEntry = window.icsFormatter();
                var nextDayFlag = 0;
                var lastEnd = new Date(1991, 3, 9);
                parsedTripParts.forEach((part, i) => {
                    var stringDate = formatDate(document.querySelector(".default-reiseloesung-list-page-controls__title-date").innerText);
                    var begin = new Date(stringDate + ", " + part.startTime);
                    var end = new Date(stringDate + ", " + part.endTime);
                    // Move forward a day if the beginning is before the last end. This occurs when you have a pause between trains that crosses days.
                    if (begin < lastEnd) {
                        nextDayFlag = 1; // Move the whole trip to the next day
                    }

                    // Apply next day flag if set
                    if (nextDayFlag === 1) {
                        begin.setDate(begin.getDate() + 1); // Move begin date to the next day
                        end.setDate(end.getDate() + 1); // Move end date to the next day
                    }
                    // Adjust dates if the end time is before the start time - this is when a train crosses midnight
                    if (end < begin) {
                        nextDayFlag = 1; // Move end date to the next day
                        end.setDate(end.getDate() + 1); // Add a day to end date
                    }

                    lastEnd = end;
                    //console.log({begin, end})
                    var title = part.eventName;
                    window.calEntry.addEvent(title, part.eventDescription, "", begin.toUTCString(), end.toUTCString());
                });

                window.calEntry.download("db_trip");
                trip.querySelector(".reiseplan__details button").click();
                trip.querySelector(".reiseplan__details").style.display = "";
                trip.querySelector(".reise-details__infos").style.display = "";
                trip.querySelector(".reise-details__actions").style.display = "";
            }

        );
    }

    function parseTripParts(tripParts) {

        var result = [];

        tripParts.forEach((part, i) => {
            var trainName = part.querySelector("ri-transport-chip").getAttribute("transport-text");
            var timeEls = part.querySelectorAll("time");
            var startTime = timeEls[0].innerText;
            var endTime = timeEls[timeEls.length - 1].innerText;
            var stopsEls = part.querySelectorAll(".verbindungs-halt");
            var fromStation = stopsEls[0].querySelector(".verbindungs-halt-bahnhofsinfos__name--abfahrt").innerText;
            var fromTrack = stopsEls[0].querySelector(".verbindungs-abschnitt-zeile__gleis").innerText;
            var toStation = stopsEls[1].querySelector(".verbindungs-halt-bahnhofsinfos__name--ankunft").innerText;
            var toTrack = stopsEls[1].querySelector(".verbindungs-abschnitt-zeile__gleis").innerText;
            result.push({
                startTime: startTime,
                endTime: endTime,
                eventName: `(${trainName}) ${fromStation} - ${toStation}`,
                eventDescription: `${trainName} ${fromStation} (${fromTrack}) - ${toStation} (${toTrack})`
            });
        });

        return result;
    }


})();
