// ==UserScript==
// @name         Hokej - FPHL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Detail automaticky přesměruje do správné live url pro přidávání
// @author       Jarda Kořínek
// @match        https://www.federalhockey.com/stats
// @icon         https://www.google.com/s2/favicons?sz=64&domain=federalhockey.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457748/Hokej%20-%20FPHL.user.js
// @updateURL https://update.greasyfork.org/scripts/457748/Hokej%20-%20FPHL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.hash.match(/\#\/182\/game/)) {
        const newUrl = location.href.replace("preview", "boxscore");

        location.href = newUrl;
    }
})();

