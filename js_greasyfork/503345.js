// ==UserScript==
// @name         Elzero Courses Time Calculator
// @namespace    http://tampermonkey.net/
// @version      2024-08-11
// @description  This script tries to calculate the duration of each week from elzero.org course and the total duration of the playlist
// @author       Yasser Salah
// @match        https://elzero.org/study/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elzero.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503345/Elzero%20Courses%20Time%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/503345/Elzero%20Courses%20Time%20Calculator.meta.js
// ==/UserScript==

(function() {
    weeks =document.getElementsByClassName("week-box");
    report = "";
    totalMinutes = 0
    for (i=0;i<weeks.length - 1;i++){
        content =weeks[i].getElementsByClassName("week-step")[0].getElementsByClassName("week-lessons")[0];
        minutes = 0;
        seconds = 0;
        for (j=0;j<content.getElementsByTagName("li").length;j++){
            text = content.getElementsByTagName("li")[j].getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerText;
            minute = text.split(":")[0];
            second = text.split(":")[1];
            minutes += parseInt(minute);
            seconds += parseInt(second);
        }
        minutes += parseInt(seconds / 60);
        seconds = seconds % 60;
        totalMinutes += minutes
        report += "Week No. " + (i+1) + " -> " + minutes + " minutes " + seconds + " seconds.\n";
    }
    totalHours = parseInt(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
    report += "\nTotal Hours: " + totalHours + "\nTotal Minutes: " + totalMinutes;
    alert(report)
})();