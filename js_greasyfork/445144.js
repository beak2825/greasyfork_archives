// ==UserScript==
// @name         Jobber Script
// @namespace    https://getjobber.com/
// @version      0.1
// @description  Scriptto add more functionality like new create dialogues.
// @author       Jordan Cunningham
// @match        *getjobber.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445144/Jobber%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/445144/Jobber%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('<a aria-label="Create a new invoice" href="/to_dos/new.dialog"><sg-icon icon="task" class="icon"></sg-icon>Task</a>').insertAfter(document.querySelector('[href="/invoices/new"]'))
    $('<a aria-label="Create a new invoice" href="/mass_visit_generator/new"><sg-icon icon="visit" class="icon"></sg-icon>Visit</a>').insertAfter(document.querySelector('[href="/to_dos/new.dialog"]'))
})();


