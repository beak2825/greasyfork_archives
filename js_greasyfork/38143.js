// ==UserScript==
// @name         Pinterest helper Queue refresh yuvaraja
// @namespace    yuaraja(tamil) 
// @version      1.01
// @description  Refreshes the tasks page until there's work, and starts the first job once there is.
// @author       yuvaraja
// @match        https://worker.mturk.com/tasks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38143/Pinterest%20helper%20Queue%20refresh%20yuvaraja.user.js
// @updateURL https://update.greasyfork.org/scripts/38143/Pinterest%20helper%20Queue%20refresh%20yuvaraja.meta.js
// ==/UserScript==

let workButton = document.querySelector("a[href*='/projects/']");

if(workButton) {workButton.click();}

setTimeout(() => window.location.reload(), 2000);