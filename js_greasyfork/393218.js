// ==UserScript==
// @name           Brightspace Calendar
// @version        2.0
// @author         Matthew Stiller
// @include        https://ggc.view.usg.edu/d2l/lms/dropboclassID/user/folders_list.d2l?ou=*
// @description    The Brightspace calendar userscript is allows students to see upcoming assignments.
// @namespace https://greasyfork.org/users/411524
// @downloadURL https://update.greasyfork.org/scripts/393218/Brightspace%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/393218/Brightspace%20Calendar.meta.js
// ==/UserScript==

let date = new Date();
getCalendarEvents(date, 7);

sendNotification("This is a test.");

// =================================================================

/**
 * Returns the sequence of events for the given date, and recursively iterates for the specified number of days.
 * @param {Date} date The starting date for the sequence.
 * @param {Number} days Amount of days to iterate.
 */
function getCalendarEvents(date, days) {

    if (days == 0) return;

    var URL = 'https://ggc.view.usg.edu/d2l/le/calendar/6621';
    var URLrequest = URL + "?day=" + date.getDate() + "&month=" + Number(date.getMonth() + 1) + "&year=" + date.getFullYear();

    fetch(URLrequest)
        .then(function (response) {
            return response.text();
        })
        // HERE is where to call any functions to be called on a successful return of the doc,
        // due to asynchronous operations.
        .then(function (html) {
            parseCalendarEvents(new DOMParser().parseFromString(html, "text/html"));
            // when the first document has been returned, increase the Date,
            // and recursively call this function.
            date.setDate(date.getDate() + 1);
            getCalendarEvents(date, days - 1);
        })
        .catch(function (err) {
            console.log("Failed to fetch page (" + URLrequest + "): ", err);
        });

}

/**
 * Parses the D2L calendar events.
 * @param {HTMLDocument} doc The document to parse.
 */
function parseCalendarEvents(doc) {

    const calendar = doc.getElementsByClassName("d2l-le-calendar-day-events");
    for (var hour of calendar) {

        // TODO complete.
        // magic regex nonsense! strips absurd whitespace.
        var content = hour.textContent.replace(/^\s+|\s+$/gm, '');
        content = content.split("\n");
        
        for (var i = 0; i < content.length; i++) {

            console.log(content[i]);

            // let regex = /^\d+:{1}\d+ (AM|PM).+/;

            // var start, end;

            // // if we reach a point where the string starts with
            // // something other than AM/PM, we've entered an event
            // if (!(regex.test(content[i]))) {
            //     start = i;
            //     while (!(regex.test(content[i]))) {
            //         i += 1;
            //         console.log("Looping;");
            //     }
            //     end = i-1;
            // }

            // var body = content.slice(start, end);

            // sendNotification(body);

        }

    }

}

/**
 * Shows a notification with the specified content text.
 * @param {String} body The content of the notification.
 */
function sendNotification(body) {
    if (Notification.permission !== 'granted')
        Notification.requestPermission();
    else {
        let notification = new Notification("BrightspacePro", {
            body: body
        });
        notification.onclick = function () {
            // TODO
        };
    }
}