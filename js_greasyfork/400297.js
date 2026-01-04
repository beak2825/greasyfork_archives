// ==UserScript==
// @name         Twitch AutoCollect Points
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  Collect points automagically when watching streams at Twitch
// @author       Lasse Brustad
// @include      /^https?://(www.)?twitch.tv/.*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/400297/Twitch%20AutoCollect%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/400297/Twitch%20AutoCollect%20Points.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Run an interval every x ms
    setInterval(function() {
        // Click the points button if it exists
        document.querySelector('.community-points-summary > div:last-child button')?.click();

    }, 1e3); // 1000ms or 1s
})();
