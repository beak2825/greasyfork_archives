// ==UserScript==
// @name         YouTube Controls Toggle
// @namespace    http://tampermonkey.net/
// @version      2024-10-09
// @description  Press ctrl+i to toggle on and off the YouTube playback controls.
// @author       OOPS! Studio!
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511976/YouTube%20Controls%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/511976/YouTube%20Controls%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hideThese = [document.getElementsByClassName("ytp-gradient-bottom")[0], document.getElementsByClassName("ytp-chrome-bottom")[0]];
    document.addEventListener("keydown", e => {
        if(e.key === "i" && e.ctrlKey){
            hideThese.forEach(element => element.style.visibility = element.style.visibility === "hidden" ? "visible" : "hidden");
        }
    });
})();