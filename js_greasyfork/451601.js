// ==UserScript==
// @name         duolingo auto practice
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  please download my other script [duohacker] for it to work properly. duolingo cheat, duolingo hack, duolingo farmer, duolingo xp.
// @author       0325skz      
// @copyright    0325skz   
// @match        https://www.duolingo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/451601/duolingo%20auto%20practice.user.js
// @updateURL https://update.greasyfork.org/scripts/451601/duolingo%20auto%20practice.meta.js
// ==/UserScript==

const DEBUG = false;

let mainInterval;
const TIME_OUT = 250;

const TRIGGER_URL = "https://www.duolingo.com/learn"


/*
Make sure to start a language course before you run the farmer

Make sure that you have selected your language as your learning language on Duolingo,
otherwise it will cause an error and be stuck in an infinite loop trying to start a lesson
*/


function getLessonURL() {
    var redirect_url = "https://www.duolingo.com/practice"
    return redirect_url
}

function redirect(url) {
    window.location.replace(url);
    if (DEBUG) { console.log("Redirected to:" + window.location)}
}

function main() {
    if (DEBUG) { console.log("Running main")}

        var currentLocation = window.location;

        if (DEBUG) { console.log("Current location: " + currentLocation)}

        if (currentLocation == TRIGGER_URL) {
            if (DEBUG) { console.log("Calling redirect")}

            var new_lesson = getLessonURL();
            redirect(new_lesson);
        }
}

function start() {
    mainInterval = setInterval(main, TIME_OUT)
}

(start)();
