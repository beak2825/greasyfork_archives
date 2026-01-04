// ==UserScript==
// @name         Refresh Queue
// @namespace    salembeats
// @version      1.1
// @description  Refreshes the tasks page until there's work, and starts the first job once there is.
// @author       YUVAREAJA
// @match        https://worker.mturk.com/tasks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387214/Refresh%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/387214/Refresh%20Queue.meta.js
// ==/UserScript==

let workButton = document.querySelector("a[href*='/projects/']");

if(workButton) {workButton.click();}

setTimeout(() => window.location.reload(), 4000);