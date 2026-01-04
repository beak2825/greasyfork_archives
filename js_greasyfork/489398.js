// ==UserScript==
// @name         Deny google precise location question
// @version      2024-03-08
// @description  Block google precise location question popup ("See results closer to you?") by automatically telling it no
// @match        *://*.google.com/*
// @license      MIT
// @namespace https://greasyfork.org/users/1272292
// @downloadURL https://update.greasyfork.org/scripts/489398/Deny%20google%20precise%20location%20question.user.js
// @updateURL https://update.greasyfork.org/scripts/489398/Deny%20google%20precise%20location%20question.meta.js
// ==/UserScript==


var interval = 2; // ms, how often the loop should run
var maxTime = 5000; // ms, max time to try to run the loop for

var startTime = new Date().getTime();
var checkTimer = setInterval(TimeLoop, interval);
checkTimer();

function TimeLoop() {
    const warning = document.getElementsByClassName("cMeQ8e b9SLDc"); //class of the popup
    if (warning[0] !== undefined){ //see if it exists yet
        if (warning[0].innerText == ("To get the closest results, let Google use your device's precise location.")) {
            document.querySelector('[jsaction="click:O6N1Pb"]').click(); //click the 'Not now' button
            clearInterval(checkTimer); //kill the timer once complete
        }
    }
    if (new Date().getTime() - startTime > maxTime) {
        clearInterval(checkTimer); //kill the timer if the popup hasnt shown after maxTime milliseconds
    }
}