// ==UserScript==
// @name        ActionNetwork: US East to UK time
// @namespace   CND
// @match       https://actionnetwork.org/groups/*/manage/?tab=tab_email*
// @grant       none
// @version     1.0
// @author      Rob Wells
// @description Change the default date format on the ActionNetwork emails page from the US East timezone to UK time.
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/464003/ActionNetwork%3A%20US%20East%20to%20UK%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/464003/ActionNetwork%3A%20US%20East%20to%20UK%20time.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
const r = /\b(?<fullText>(?<month>0[1-9]|1[0-2])\/(?<day>3[0-1]|[0-2][1-9]|[1-2]0)\/(?<year>20\d{2}) (?<hour>\d+):(?<minute>\d+) (?<amPM>[AP]M) Eastern \(US\))/i;
function isMatchStruct(obj) {
    return ((typeof obj.fullText === "string") &&
        (typeof obj.month === "string") &&
        (typeof obj.day === "string") &&
        (typeof obj.year === "string") &&
        (typeof obj.hour === "string") &&
        (typeof obj.minute === "string") &&
        (obj.amPM === "AM" || obj.amPM === "PM"));
}
let usEastOffset = new Date().toLocaleString("sv-SE", {
    timeZone: "America/New_York",
    timeZoneName: "longOffset",
}).slice(-5);
function pad2(s) {
    if (s.length < 2) {
        let pad = "0".repeat(2 - s.length);
        s = `${pad}${s}`;
    }
    return s;
}
function getDateSpans() {
    let sent_dates = Array.from(document.querySelectorAll("span.manage_email_date"));
    let draft_dates = Array.from(document.querySelectorAll("span.email_draft"));
    return sent_dates.concat(draft_dates);
}
function fixDates(dateSpans) {
    dateSpans
        .forEach((e) => {
        let matchResult = e.innerText.match(r);
        let matchGroups = matchResult?.groups;
        if (!isMatchStruct(matchGroups))
            return;
        let { fullText, month, day, year, hour, minute, amPM, } = matchGroups;
        if (hour === "12") {
            if (amPM === "AM") {
                hour = "00";
            }
        }
        else if (amPM === "PM") {
            hour = (parseInt(hour) + 12).toString();
        }
        month = pad2(month);
        day = pad2(day);
        hour = pad2(hour);
        minute = pad2(minute);
        let isoString = `${year}-${month}-${day}T${hour}:${minute}:00-${usEastOffset}`;
        let parsedDate = new Date(Date.parse(isoString));
        let gbFormat = parsedDate.toLocaleString("en-GB", {
            timeZone: "Europe/London",
            hour: "numeric",
            minute: "2-digit",
            hourCycle: "h12",
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        e.innerHTML = e.innerHTML.replace(fullText, gbFormat);
    });
}
function poll() {
    let dateSpans = getDateSpans();
    if (dateSpans.length === 0) {
        setTimeout(poll, 1000);
        return;
    }
    else {
        fixDates(dateSpans);
    }
}
setTimeout(poll, 1000);
