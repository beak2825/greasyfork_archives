// ==UserScript==
// @name         Jira New Comment on top
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.4
// @description  Move Jira comment box above the comments
// @author       You
// @match        https://servicedesk.ev.lt/browse/*
// @match        https://servicedesk.ev.lt/projects/*/issue/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/492234/Jira%20New%20Comment%20on%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/492234/Jira%20New%20Comment%20on%20top.meta.js
// ==/UserScript==

var container

(function() {
    doTheThing();
    window.addEventListener('load', repeatTheThing, false);
})();

function doTheThing() {
    container = document.querySelector (".issue-main-column");
    if (container == null) {
        return;
    }
    var activityDiv = container.querySelector (".issue-main-column > #activitymodule");
    container.appendChild(activityDiv);
}

function repeatTheThing() {
    var i = 0;
    while (container == null && i < 5) {
        setTimeout(doTheThing, 1000);
        i += 1;
    }
}