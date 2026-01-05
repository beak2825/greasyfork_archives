// ==UserScript==

// @name          TW Scheduling Script

// @version				2.4

// @namespace     twSchedulingScript

// @description   Allowing auto-tagging of active tasks within TW

// @include       http://jobs.realizeonline.com.au/*

// @downloadURL https://update.greasyfork.org/scripts/17564/TW%20Scheduling%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/17564/TW%20Scheduling%20Script.meta.js
// ==/UserScript==

document.addEventListener("click", function(){
    document.getElementsByClassName("taskList").appendChild = "Hello World!";
});
