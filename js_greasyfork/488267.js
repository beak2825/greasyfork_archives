// ==UserScript==
// @name         DB Trips iCal Saver
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds "Add to Calendar" option for DB trips
// @author       You
// @match        https://int.bahn.de/en/buchung/fahrplan/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bahn.de
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488267/DB%20Trips%20iCal%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/488267/DB%20Trips%20iCal%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /**

    Here I use a slightly modified icsFormatter by @matthiasanderer

    Credits: matthiasanderer (https://github.com/matthiasanderer/icsFormatter)

    **/
    window.icsFormatter = function() {
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
            'events': function() {
                return calendarEvents;
            },

            'calendar': function() {
                return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
            },
            'addEvent': function(subject, description, location, begin, stop) {
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

            'download': function(filename) {
                if (calendarEvents.length < 1) {
                    return false;
                }
                var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
                var a = document.createElement('a');
                a.href = "data:text/calendar;charset=utf8," + escape(calendar);
                a.download = filename + '.ics';
                document.getElementsByTagName('body')[0].appendChild(a);
                a.click();
            }
        };
    };

    function parent (el, n) {
        while (n > 0) {
            el = el.parentNode;
            n --;
        }
        return el;
    }

    function main () {
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

            parent(element, 3).setAttribute("style", "--item-count: 3;");

            var style = document.createElement("style");
            style.innerHTML = '.add_to_calendar:hover { background: #f0f3f5; }';
            document.head.appendChild(style);
        });
    };

    setInterval(main, 1000);

    function waitFor (selectorFunc, applyFunc) {
        var itl = setInterval(function () {
            if (selectorFunc()) {
                clearInterval(itl);
                applyFunc();
            }
        }, 50);
    }

    function formatGermanString(german) {
        let mp = {"ü": "ue", "ö": "oe", "ä": "ae", "ß": "ss"};
        for (let repl in mp) {
            german = german.replace(new RegExp(repl, "g"), mp[repl]);
        }
        return german.toLowerCase().split(/\s+/g)[0];
    }


    function saveTripToICS (targetElement) {
        var trip = parent(targetElement, 7);
        trip.querySelector(".reiseplan__details").style.display = "none";
        trip.querySelector(".reiseplan__details button").click();
        waitFor(
            function () {
                return trip.querySelector(".reise-details__infos") !== null && trip.querySelector("ri-transport-chip").getAttribute("transport-text") !== null
            },
            function () {
                trip.querySelector(".reise-details__infos").style.display = "none";
                trip.querySelector(".reise-details__actions").style.display = "none";
                var tripParts = trip.querySelectorAll(".verbindungs-abschnitt");
                var parsedTripParts = parseTripParts(tripParts);


                window.calEntry = window.icsFormatter();

                var lastTimestamp = null;
                var firstStation = null;
                var lastStation = null;
                var firstDate = null;
                parsedTripParts.forEach((part, i) => {
                    var stringDate = document.querySelector(".default-reiseloesung-list-page-controls__title-date").innerText;
                    var begin = new Date(stringDate + ", " + part.startTime);
                    while (lastTimestamp !== null && lastTimestamp > begin) {
                        begin.setDate(begin.getDate() + 1);
                    }
                    if (i === 0) {
                        firstDate = Math.floor(begin.getTime() / 1000);
                    }
                    lastTimestamp = begin;
                    var end = new Date(stringDate + ", " + part.endTime);
                    while (lastTimestamp > end) {
                        end.setDate(end.getDate() + 1);
                    }
                    lastTimestamp = end;
                    var title = part.eventName;
                    window.calEntry.addEvent(title, part.eventDescription, "", begin.toUTCString(), end.toUTCString());
                    if (i === 0) {
                        firstStation = formatGermanString(part.fromStation);
                    }
                    if (i === (parsedTripParts.length - 1)) {
                        lastStation = formatGermanString(part.toStation);
                    }
                });

                window.calEntry.download(`db_trip_${firstStation}_${lastStation}_${firstDate}`);
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
                eventDescription: `${trainName} ${fromStation} (${fromTrack}) - ${toStation} (${toTrack})`,
                fromStation: fromStation,
                toStation: toStation
            });
        });

        return result;
    }


})();