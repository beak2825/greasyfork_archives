// ==UserScript==
// @name         Fox Sports
// @namespace    Míša
// @version      1.1
// @description  Přesměrování na play by play
// @author       Michal
// @match        https://www.foxsports.com/nhl/*-game-boxscore-*
// @license      MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/482306/Fox%20Sports.user.js
// @updateURL https://update.greasyfork.org/scripts/482306/Fox%20Sports.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentURL = window.location.href;

    if (!currentURL.includes('?tab=playbyplay')) {
        var newURL = currentURL + '?tab=playbyplay';

        window.location.href = newURL;
    }
})();
