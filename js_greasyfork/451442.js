// ==UserScript==
// @name         ReaperScans Font
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Set font to tahoma since it doesn't get saved.
// @author       fizzfaldt
// @match        https://reaperscans.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reaperscans.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451442/ReaperScans%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/451442/ReaperScans%20Font.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
    'use strict';
    // fixme try to use the dropdown but changing value of the <select> does nothing!
    var reading = document.getElementsByClassName("reading-content");
    if (! reading) {
        return;
    }
    for (let i = 0; i < reading.length; i++) {
        reading[i].style.fontFamily = "noto serif";
    }
})();