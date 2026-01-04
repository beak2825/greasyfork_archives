// ==UserScript==
// @name         Workday Hours Converter
// @namespace    https://fxzfun.com/
// @version      0.35
// @description  Converts hours from decimals to hours and minutes
// @author       FXZFun
// @match        https://www.myworkday.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workday.com
// @grant        none
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/457377/Workday%20Hours%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/457377/Workday%20Hours%20Converter.meta.js
// ==/UserScript==

var targetHoursPerWeek = 30;
var targetHoursPerDay = targetHoursPerWeek / 5;

function getMinutesSinceCheckIn() {
    var lastCheckIn;
    // ".gwt-Label.WBUC.WNUC"
    document.querySelectorAll(".gwt-Label.WIUC.WEVC").forEach(_ => _.previousElementSibling.innerText == "Unmatched Check-in" ? lastCheckIn = _.innerText.split(":") : "");
    var lastCheckInDate = new Date();
    if (lastCheckIn) lastCheckInDate.setHours(lastCheckIn[0], lastCheckIn[1]);
    else return 0;
    return parseInt((new Date() - lastCheckInDate) / 1000 / 60);
}

function addCompleteWeekFact(d) {
    // .WHIP
    var completeHours = document.createElement("p");
    completeHours.innerHTML = `If you worked until you hit ${targetHoursPerWeek} hours this week, you would get done at ${d.getHours()}:${d.getMinutes()<10?"0"+d.getMinutes():d.getMinutes()} on ${["Monday","Tuesday","Wednesday","Thursday","Friday"][d.getDay()-1]}`;
    document.querySelector(".WOFG [data-automation-widget]").appendChild(completeHours);
}

function convertHours() {
    var minutesSinceCheckIn = getMinutesSinceCheckIn();
    var weekMinutesLogged = document.querySelector(".elaufb94").innerText * 60;
    var todayMinutesLogged = document.querySelectorAll(".WHCE")[1].innerText.replace("Hours: ", "") * 60;

    var weekMinutesLeft = (targetHoursPerWeek * 60 - weekMinutesLogged) - minutesSinceCheckIn;
    var todayMinutesLeft = (targetHoursPerDay * 60 - todayMinutesLogged) - minutesSinceCheckIn;
    var d = new Date();
    d.setMinutes(d.getMinutes() + weekMinutesLeft);

    addCompleteWeekFact(d);

    var tableRef = document.querySelector(".elaufb91");
    tableRef.outerHTML = `<div dir="ltr" data-automation-id="summarizedListItem" class="css-1myhm8v-RowContainer elaufb91"><dt class="css-hqo7os-DescriptionTerm">Hours Left</dt><dd class="elaufb94">${todayMinutesLeft / 60}</dd></div>` + tableRef.outerHTML;
    var docSpot = document.querySelector(".WOFG  [data-automation-widget]");
    docSpot.appendChild(document.createElement("hr"));
    var p = document.createElement("p");
    p.innerText = `${parseInt((targetHoursPerDay * 60 - todayMinutesLeft) / (targetHoursPerDay * 60) * 100)}% done`;
    docSpot.appendChild(p);

    document.querySelectorAll(".WHCE")[1].innerText = "Hours: " + (todayMinutesLogged + minutesSinceCheckIn) / 60;

    var elements = [];
    document.querySelectorAll(".day-cell").forEach((e)=>{
        if (e.innerText.startsWith("Hours: ")) {
            elements.push(e);
        }
    });

    document.querySelectorAll(".WHCE").forEach((e)=>{
        if (e.innerText.startsWith("Hours: ")) {
            elements.push(e);
        }
    });

    elements = elements.concat([...document.querySelectorAll(".elaufb94")].slice(0, -1));
    document.querySelectorAll("[data-automation-id='calendarAppointmentSubtitle2']").forEach((e)=>{
        elements.push(e);
    });

    window.elements = elements;
    elements.forEach((e)=>{
        var text = e.innerText.replace("Hours: ", "");
        var time = parseFloat(text);
        var hours = Math.floor(time);
        var mins = Math.round(((time - hours) % 60) * 60);
        if (hours != 0) {
            e.innerText = hours + " hrs " + mins + " min";
        } else if (mins != 0) {
            e.innerText = mins + " min";
        }
    });
}

function countdown() {
    setInterval(() => {
        var newVal;
        var el = document.querySelector(".elaufb94");
        if (el.innerText.includes("hrs")) {
            var oldVal = el.innerText.split(" hrs ");
            var oldHrs = parseInt(oldVal[0]);
            var oldMins = parseInt(oldVal[1].replace(" min", ""));
            if (oldMins == 0) {
                oldHrs -= 1;
                oldMins = 59;
            } else oldMins -= 1;
            newVal = oldHrs + " hrs " + oldMins + " min";
        } else {
            var oldVal2 = parseInt(el.innerText.split(" min"));
            oldVal2 -= 1;
            newVal = oldVal2 + " min";
        }
        el.innerText = newVal;
    }, 60 * 1000);
}

(function() {
    'use strict';
    var i = setInterval(() => {
        if (document.querySelector(".elaufb94") != null) {
            clearInterval(i);

            convertHours();

            window.convertHours = convertHours;
        }
    }, 1000);
})();