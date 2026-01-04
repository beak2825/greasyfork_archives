// ==UserScript==
// @name         Add Raid Shortcut button
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Add raid button
// @author       tomyee
// @match        https://shalzuth.com/Wotv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418885/Add%20Raid%20Shortcut%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/418885/Add%20Raid%20Shortcut%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("<button onclick='doBattle(\"Raid\");'>Raid Shortcut</button>").insertAfter("#searchInput");
})();