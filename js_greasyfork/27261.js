// ==UserScript==
// @name         Deezy meetme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tr.m.meetme.com/mobile/match/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27261/Deezy%20meetme.user.js
// @updateURL https://update.greasyfork.org/scripts/27261/Deezy%20meetme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function(e) {
window.setInterval(function() {
 MobileMYB.matchQueueActionYes(true);
}, 1000);
}, false);


})();