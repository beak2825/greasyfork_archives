// ==UserScript==
// @name        [GC] - Protection Items Replenish Reminders
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/quickstock/*
// @grant       none
// @license     MIT
// @version     86
// @author      Cupkait
// @description Backup alert in case you find yourself on the Quickstock page with less of each item than you like to keep in your inventory.
// @downloadURL https://update.greasyfork.org/scripts/487076/%5BGC%5D%20-%20Protection%20Items%20Replenish%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/487076/%5BGC%5D%20-%20Protection%20Items%20Replenish%20Reminders.meta.js
// ==/UserScript==

if (!localStorage.getItem('scriptAlert-487076')) {
    alert("Protection Item Replenishment script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-487076', 'true');
}