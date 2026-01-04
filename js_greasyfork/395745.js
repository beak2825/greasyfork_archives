// ==UserScript==
// @name         Disable Calendar Alert
// @namespace    https://greasyfork.org/en/users/438919
// @version      0.1.2
// @description  Disable Google Calendar event JS alerts
// @author       Rodrigo Contreras
// @match        https://calendar.google.com/calendar/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/395745/Disable%20Calendar%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/395745/Disable%20Calendar%20Alert.meta.js
// ==/UserScript==

/*
If using Tampermonkey it is recommended to enable Advanced Settings
and set the Experimental Inject Mode setting to Instant
*/

var alrtScope;
if (typeof unsafeWindow === "undefined") {
    alrtScope = window;
} else {
    alrtScope = unsafeWindow;
}

alrtScope.alert = function(msg) {
    console.log("Intercepted alert: ", msg);
};