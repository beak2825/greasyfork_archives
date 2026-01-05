// ==UserScript==
// @name        CH CrowdSource-OneSpace Press Enter To Submit
// @author      clickhappier
// @namespace   clickhappier
// @description Makes Enter key submit a HIT for former MTurk CrowdSource/OneSpace, like it already does for other MTurk requesters who use standard form submit buttons.
// @version     1.1c
// @grant       GM_log
// @match       https://work.crowdsource.com/*
// @match       https://work.onespace.com/*
// @downloadURL https://update.greasyfork.org/scripts/15126/CH%20CrowdSource-OneSpace%20Press%20Enter%20To%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/15126/CH%20CrowdSource-OneSpace%20Press%20Enter%20To%20Submit.meta.js
// ==/UserScript==

document.addEventListener("keydown", entersubmit, false);
function entersubmit(i) {
    if (i.keyCode == 13) { // enter/return key
        document.querySelector("#submitButton").click();
    }  
}