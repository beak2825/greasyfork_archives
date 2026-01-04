// ==UserScript==
// @name         Quiet JavaScript Alerts
// @namespace    timpartridge
// @version      0.1
// @description  Alerts log to the console instead of popping up.
// @author       Tim Partridge
// @match        your url/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/396434/Quiet%20JavaScript%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/396434/Quiet%20JavaScript%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    quietAlerts()
})();

function quietAlerts () {
    window.alert = function alert (message) {
        console.log (message);
    }
}