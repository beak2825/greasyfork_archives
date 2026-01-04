// ==UserScript==
// @name         StatsPerform Live Url
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přesměrovává do live url na statistiky
// @author       KvidoTeam
// @match        https://www.scoresway.com/en_GB/soccer/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scoresway.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/536484/StatsPerform%20Live%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/536484/StatsPerform%20Live%20Url.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Získání ID zápasu z URL
    const match = location.href.match(/match\/[^/]+\/([^/]+)\//);
    if (!match) return;

    const matchId = match[1];

    // Sestavení cílové URL
    const liveUrl = "https://api.performfeeds.com/soccerdata/matchstats/dj5i8jr4po7l1fne1052254p5/" + matchId + "?detailed=fallback&_fmt=json&_rt=b";

    // Přesměrování na cílovou URL
    window.location.href = liveUrl;
})();