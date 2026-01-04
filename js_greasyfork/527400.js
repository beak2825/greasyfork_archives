// ==UserScript==
// @name         Alert Notification Fix
// @namespace    http://neopat.ch
// @version      1.0
// @description  Fixes missing alert notifications
// @author       You
// @match        https://www.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527400/Alert%20Notification%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/527400/Alert%20Notification%20Fix.meta.js
// ==/UserScript==

(function() {

const alertsContainer = document.querySelector("#alerts");
const alertCount = alertsContainer.querySelectorAll("li").length;
const notifElement = document.querySelector("#NavAlertsNotif");

if (alertCount > 0) {
    notifElement.innerHTML = alertCount;
    notifElement.style.display = "block";
}
     else {
    notifElement.style.display = "none";
}

})();