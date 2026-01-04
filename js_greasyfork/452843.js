// ==UserScript==
// @name         [BETA] Export to Ical
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Export the UMontreal Calendar to Ical
// @author       jeankhoury0
// @match        https://academique-dmz.synchro.umontreal.ca/psc/acprpr9/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSR_SSENRL_LIST.GBL*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=umontreal.ca
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452843/%5BBETA%5D%20Export%20to%20Ical.user.js
// @updateURL https://update.greasyfork.org/scripts/452843/%5BBETA%5D%20Export%20to%20Ical.meta.js
// ==/UserScript==


/**
 * Open the PRINTABLE schedule in the list
 */
// start point

(function () {
    createAButton()

})();


// START ON BUTTON CLICK
function generateTheScheduleAction() {
    var allTheCoursesArr = []
    var CoursesRow = document.querySelector(".PABACKGROUNDINVISIBLE").children[0].children
    for (var i = 0; i < CoursesRow.length; i++) {
        allTheCoursesArr.push(
            getCourseInformation(CoursesRow[i], i)
        )
    }

    var cal = generateTheCalendar(allTheCoursesArr)
    console.log(cal)

    var user = document.querySelector(".gh-username").innerText
    cal.download(`${user} calendrier ${Date.now()}`)


    console.log(allTheCoursesArr)
}



// create a button

function createAButton() {
    var body_of_page = document.querySelector("body")
    var button_content = document.createElement("div")
    button_content.innerHTML = (`
	<div style="position: fixed; bottom: 5%; right: 5%; z-index:1000;">
		<p>Utiliser "Page Imprimable" <br> au bas de l'écran </p>
		<button id="tm-button-generate"> Generate Schedule</button>
	</div>

	<style >
		#tm-button-generate{
			background-color: #5CC2E7;   
			color: white;
			border: none;
			font-weight: bold;
			padding: 2em; 
		}

		#tm-button-generate:hover{
			background-color:#006BB6;
		}
	</style>
	`)
    body_of_page.append(button_content)
    document.querySelector("#tm-button-generate").addEventListener("click", generateTheScheduleAction, false)
}


// Extract the course info

function getCourseInformation(tabularInfoOfCourse, coursePosition) {
    var course = {}

    course.title = tabularInfoOfCourse.querySelector(".ui-bar").innerText

    var tabularInfoOfTime = document.querySelector(".PABACKGROUNDINVISIBLE").children[0].children[2].querySelectorAll(".PSLEVEL2GRIDWBO")[1]
    course.time = getTimeInformation(tabularInfoOfTime, coursePosition)
    return course
}

function getTimeInformation(tabularInfoOfTime, coursePosition) {
    // generate an ID trUMET_CLS_EXM_VW$1_row1
    var rowCounter = 1 // firstPositionInTheCode
    var oldVolet = null // the volet that was the previous row

    var getTimeInformationArr = []

    while (document.querySelector(`[id="${getRowTimeId(coursePosition, rowCounter)}"]`)) {
        var currentRow = document.querySelector(`[id="${getRowTimeId(coursePosition, rowCounter)}"]`)
        rowCounter += 1
        var res = processIndividualTimeRow(currentRow, oldVolet)
        oldVolet = res?.volet
        getTimeInformationArr.push(res)
    }
    return getTimeInformationArr

}

function processIndividualTimeRow(currentRow, oldVolet) {
    // return an object
    var attr = currentRow.innerText.replaceAll("\n", "").split("\t")
    var res = ({
        volet: attr[2] || oldVolet,
        start_time: getStartTime(attr[3]),
        end_time: getEndTime(attr[3]),
        recuring_day: getRecurringDay(attr[3]),
        start_date: getStartDate(attr[6]),
        end_date: getEndDate(attr[6]),
        location: attr[4],
        teacher: attr[5]

    })
    return (res)
}

function getStartTime(row) {
    var time = row.split(" ")[1]
    // edge case when is full day
    if (row == "À communiquer") {
        return "00:00 am"
    }
    return tConvert(time)
}

function getEndTime(row) {
    var time = row.split(" ")[3]
    // edge case when is full day
    if (row == "À communiquer") {
        return "00:00 am" // TODO: might be a bug, need to investigate how to do full day
    }
    return tConvert(time)
}

function getRecurringDay(row) {
    var day = row.split(" ")[0]
    if (row == "À communiquer") {
        return "Monday" // TODO: placeholder
    }

    //SU, MO, TU, WE, TH, FR, SA
    switch (day.toLowerCase()) {
        case "lun":
            return "MO"
        case "ma":
            return "TU"
        case "mer":
            return "WE"
        case "j":
            return "TH"
        case "v":
            return "FR"
        case "s": //not sure
            return "SA"
        case "d":
            return "SU" // not sure
        default:
            log.warn(`${day} is not recognized as a valid day, this might be due to a change of name in the student center, please open an issue`)
            log.warn("will be assuming the day to be SA")
            return "SA"
    }
}

function getStartDate(row) {
    res = row.split("-")[0].trim()
    return res
}

function getEndDate(row) {
    // if single date
    if (row.split("-").length == 1) {
        return row
    }
    return row.split("-")[1].trim()
}



function getRowTimeId(coursePosition, rowCounter) {
    return `trUMET_CLS_EXM_VW$${coursePosition}_row${rowCounter}`
}



function generateTheCalendar(calendarObj) {
    var cal = ics()
    calendarObj.forEach(c => {
        c.time.forEach(time => {
            cal.addEvent(
                `[${time.volet}] ${c.title}`,
                "",
                time.location,
                `${time.start_date} ${time.start_time}`,
                `${time.start_date} ${time.end_time}`,
                {
                    freq: "WEEKLY",
                    interval: 1,
                    until: time.end_date,
                    byday: [time.recuring_day]
                }

            )
        })
    })
    console.log(cal.calendar())
    console.log(cal.events())
    return cal
}


function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' am' : ' pm'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}




/* global saveAs, Blob, BlobBuilder, console */
/* exported ics */

var ics = function (uidDomain, prodId) {
    //'use strict';

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
        'events': function () {
            return calendarEvents;
        },

        /**
        * Returns calendar
        * @return {string} Calendar in iCalendar format
        */
        'calendar': function () {
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
        'addEvent': function (subject, description, location, begin, stop, rrule) {
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
                        rrule.byday = rrule.byday.filter(function (elem, pos) {
                            return rrule.byday.indexOf(elem) == pos;
                        });

                        console.log(rrule.byday.length)

                        rrule.byday.forEach(function (d) {
                            console.log(d)
                            if (BYDAY_VALUES.indexOf(d) < 0) {
                                throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'";
                            }
                        }
                        )

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
                    rruleString = 'RRULE:FREQ=' + rrule.freq;

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
        'download': function (filename, ext) {
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
        'build': function () {
            if (calendarEvents.length < 1) {
                return false;
            }

            var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;

            return calendar;
        }
    };
};


/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs = saveAs || (navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator)) || (function (h) { "use strict"; var r = h.document, l = function () { return h.URL || h.webkitURL || h }, e = h.URL || h.webkitURL || h, n = r.createElementNS("http://www.w3.org/1999/xhtml", "a"), g = !h.externalHost && "download" in n, j = function (t) { var s = r.createEvent("MouseEvents"); s.initMouseEvent("click", true, false, h, 0, 0, 0, 0, 0, false, false, false, false, 0, null); t.dispatchEvent(s) }, o = h.webkitRequestFileSystem, p = h.requestFileSystem || o || h.mozRequestFileSystem, m = function (s) { (h.setImmediate || h.setTimeout)(function () { throw s }, 0) }, c = "application/octet-stream", k = 0, b = [], i = function () { var t = b.length; while (t--) { var s = b[t]; if (typeof s === "string") { e.revokeObjectURL(s) } else { s.remove() } } b.length = 0 }, q = function (t, s, w) { s = [].concat(s); var v = s.length; while (v--) { var x = t["on" + s[v]]; if (typeof x === "function") { try { x.call(t, w || t) } catch (u) { m(u) } } } }, f = function (t, u) { var v = this, B = t.type, E = false, x, w, s = function () { var F = l().createObjectURL(t); b.push(F); return F }, A = function () { q(v, "writestart progress write writeend".split(" ")) }, D = function () { if (E || !x) { x = s(t) } if (w) { w.location.href = x } else { window.open(x, "_blank") } v.readyState = v.DONE; A() }, z = function (F) { return function () { if (v.readyState !== v.DONE) { return F.apply(this, arguments) } } }, y = { create: true, exclusive: false }, C; v.readyState = v.INIT; if (!u) { u = "download" } if (g) { x = s(t); n.href = x; n.download = u; j(n); v.readyState = v.DONE; A(); return } if (h.chrome && B && B !== c) { C = t.slice || t.webkitSlice; t = C.call(t, 0, t.size, c); E = true } if (o && u !== "download") { u += ".download" } if (B === c || o) { w = h } if (!p) { D(); return } k += t.size; p(h.TEMPORARY, k, z(function (F) { F.root.getDirectory("saved", y, z(function (G) { var H = function () { G.getFile(u, y, z(function (I) { I.createWriter(z(function (J) { J.onwriteend = function (K) { w.location.href = I.toURL(); b.push(I); v.readyState = v.DONE; q(v, "writeend", K) }; J.onerror = function () { var K = J.error; if (K.code !== K.ABORT_ERR) { D() } }; "writestart progress write abort".split(" ").forEach(function (K) { J["on" + K] = v["on" + K] }); J.write(t); v.abort = function () { J.abort(); v.readyState = v.DONE }; v.readyState = v.WRITING }), D) }), D) }; G.getFile(u, { create: false }, z(function (I) { I.remove(); H() }), z(function (I) { if (I.code === I.NOT_FOUND_ERR) { H() } else { D() } })) }), D) }), D) }, d = f.prototype, a = function (s, t) { return new f(s, t) }; d.abort = function () { var s = this; s.readyState = s.DONE; q(s, "abort") }; d.readyState = d.INIT = 0; d.WRITING = 1; d.DONE = 2; d.error = d.onwritestart = d.onprogress = d.onwrite = d.onabort = d.onerror = d.onwriteend = null; h.addEventListener("unload", i, false); return a }(self));