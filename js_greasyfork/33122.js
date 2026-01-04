// ==UserScript==
// @name         Remove White Bar in GeoGuessr
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the white bar at the bottom of geoguessr challenges
// @author       LiquidProgrammer
// @match        https://geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33122/Remove%20White%20Bar%20in%20GeoGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/33122/Remove%20White%20Bar%20in%20GeoGuessr.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var target = document.documentElement;
    target.classList.remove ("no-pro");
    target.classList.add ("pro");
})();