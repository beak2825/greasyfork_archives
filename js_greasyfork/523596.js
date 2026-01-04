// ==UserScript==
// @name         Close google docs tab UI automatically
// @version      2025-01-12
// @description  Close google docs tab UI automatically (Left arrow button on lefthand side of page) by automatically closing it
// @match        *://*.docs.google.com/document/*
// @license MIT
// @namespace https://greasyfork.org/users/1422626
// @downloadURL https://update.greasyfork.org/scripts/523596/Close%20google%20docs%20tab%20UI%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/523596/Close%20google%20docs%20tab%20UI%20automatically.meta.js
// ==/UserScript==


var interval = 2; // ms, how often the loop should run
var maxTime = 5000; // ms, max time to try to run the loop for

var startTime = new Date().getTime();
var checkTimer = setInterval(TimeLoop, interval);
checkTimer();

function TimeLoop() {
    const warning = document.getElementsByClassName("div.goog-flat-button.goog-inline-block.goog-flat-button-disabled"); //class of the button
    if (warning !== undefined){ //see if it exists yet
        var button = document.getElementsByClassName('goog-inline-block docs-material-gm-select miniChapterSwitcherView miniChapterSwitcherCollapsed');
        var evt = new MouseEvent('click');
        button[0].dispatchEvent(evt);
        clearInterval(checkTimer)

    }

    if (warning !== undefined){ //see if it exists yet
        button[0].dispatchEvent(evt);
        clearInterval(checkTimer)
    }
    if (new Date().getTime() - startTime > maxTime) {
        clearInterval(checkTimer); //kill the timer if the button hasnt shown after maxTime milliseconds
    }
}