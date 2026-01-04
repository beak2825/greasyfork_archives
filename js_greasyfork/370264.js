// ==UserScript==
// @name         WPlan userfriendly time
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  yo
// @author       iiw
// @match        https://wplan.io/home/worktime
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370264/WPlan%20userfriendly%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/370264/WPlan%20userfriendly%20time.meta.js
// ==/UserScript==

var injectFunction = function() {
    'use strict';

    // Your code here...
    if (!window.moment) {
        console.log("moment not found")
        return;
    }
    var moment = window.moment;
    var times = document.getElementsByClassName("today_details")[1]

    var myInfoRow = document.createElement("span")
    console.log("my info row created", {myInfoRow: myInfoRow, times: times})
    var updateInfoRow = function(time) {
        myInfoRow.innerHTML = "Время выхода: <strong>" + time + "</strong>"
    }

    if (!times) {
        console.log("let's try again...");
        setTimeout(injectFunction, 500);
        return;
    }

    times.appendChild(myInfoRow)
    times.insertBefore(myInfoRow, times.children[0]);

    var getTime = function() {
        return times.children[1].children[0].innerText;
    }

    var update = function() {
        var time = getTime();
        time = moment(time, "HH:mm:ss");
        var hours = Number(time.format("HH"));
        var minutes = Number(time.format("mm"));
        var seconds = Number(time.format("ss"));
        time = moment();
        time.add(hours, "hours");
        time.add(minutes, "minutes");
        time.add(seconds, "seconds");
        updateInfoRow(time.format("HH:mm:00"));
    }
    setInterval(update, 500);
};

setTimeout(injectFunction, 500)