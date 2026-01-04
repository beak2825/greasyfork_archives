// ==UserScript==
// @name         Fotbal - Španělsko
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vygeneruje odkazy pro live url na hlavní stránce
// @author       Jarda Kořínek
// @match        https://widgets.besoccerapps.com/scripts/widgets?type=matchs&competition*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=besoccerapps.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458732/Fotbal%20-%20%C5%A0pan%C4%9Blsko.user.js
// @updateURL https://update.greasyfork.org/scripts/458732/Fotbal%20-%20%C5%A0pan%C4%9Blsko.meta.js
// ==/UserScript==

(function() {
    const year = 2024;

    const matches = document.querySelectorAll(".result");
    const matchesArr = [...matches];

    matchesArr.map( (match) => {
        const odkaz = document.createElement("a");
        const matchId = match.dataset.matchid;
        const misto = match;

        odkaz.append("     Live url");
        odkaz.href = "https://widgets.besoccerapps.com/scripts/widgets?type=match_marker&match=" + matchId + "&season=" + year + "&style=cope";
        misto.appendChild(odkaz);
    })
})();