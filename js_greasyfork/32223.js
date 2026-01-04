// ==UserScript==
// @name Reports Updater
// @namespace Landviz' scripts
// @grant none
// @match https://reports.cubecraft.net/report?refresh
// @description Script 3/3 report statistics menu
// @version 0.0.1.20170811190222
// @downloadURL https://update.greasyfork.org/scripts/32223/Reports%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/32223/Reports%20Updater.meta.js
// ==/UserScript==

var reports = document.querySelector('span.handled').innerHTML;
var reportsOpen = document.querySelectorAll('span[style="color: #FFA500"]').length;

console.log(reportsOpen);

var newUrl = "https://www.cubecraft.net/?" + reports + ";" + reportsOpen;

window.location.href = newUrl;
