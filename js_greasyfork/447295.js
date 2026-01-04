// ==UserScript==
// @name         Duolingo farmer redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Used in union with DuoHacker to automatically farm XP without interaction
// @author           JoRo-Code <JoRoCode@gmail.com>
// @copyright        JoRo-Code
// @match        https://www.duolingo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/447295/Duolingo%20farmer%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/447295/Duolingo%20farmer%20redirector.meta.js
// ==/UserScript==

const DEBUG = false;

let mainInterval;
const TIME_OUT = 1000;

const TRIGGER_URL = "https://www.duolingo.com/learn"

const CHINESE = "zs"
const JAPANESE = "ja"

/*
Make sure to start a language course before you run the farmer

Make sure that you have selected your language as your learning language on Duolingo, 
otherwise it will cause an error and be stuck in an infinite loop trying to start a lesson
*/

var LANGUAGE = JAPANESE

function getLessonURL() {
    var redirect_url = "https://duolingo.com/checkpoint/" + LANGUAGE + "/1/bigtest"
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
