// ==UserScript==
// @name         Fotbal - Španělsko
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vygeneruje live url pro všechny zápasy
// @author       Jarda Kořínek
// @match        https://widgets.besoccerapps.com/scripts/widgets?type=matchs&competition*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=besoccerapps.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457755/Fotbal%20-%20%C5%A0pan%C4%9Blsko.user.js
// @updateURL https://update.greasyfork.org/scripts/457755/Fotbal%20-%20%C5%A0pan%C4%9Blsko.meta.js
// ==/UserScript==

(function() {
    'use strict';

    alert("Klikni na OK pro vygenerování odkazů pro LIVE URL");

    const matches = document.querySelectorAll(".result");
    const matchesArr = [...matches];

    matchesArr.map( (match) => {
        const odkaz = document.createElement("a");
        const matchId = match.dataset.matchid;
        const misto = match;

        odkaz.append("     Live url");
        odkaz.href = "https://widgets.besoccerapps.com/scripts/widgets?type=match_marker&match=" + matchId + "&season=2023&style=cope";
        misto.appendChild(odkaz);
    })
})();