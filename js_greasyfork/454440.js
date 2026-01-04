// ==UserScript==
// @name        AutoBerryFeeder
// @author      QtheConqueror
// @namespace   Automation
// @description Auto clicks interaction buttons for GPX.plus berry feeder
// @version     1.1
// @include     http://gpx.plus/info/*/feeder
// @include     https://gpx.plus/info/*/feeder
// @grant       none
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/454440/AutoBerryFeeder.user.js
// @updateURL https://update.greasyfork.org/scripts/454440/AutoBerryFeeder.meta.js
// ==/UserScript==

var autoClickInterval = setInterval(function () {
    document.querySelector('.infoInteractButton:not(.vitamin):not([name="drink"])').click();
}, 20)