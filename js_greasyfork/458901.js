// ==UserScript==
// @name         Fotbal - Turecko stats
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vygeneruje odkazy pro stats live url na hlavní stránce
// @author       Jarda Kořínek
// @match        https://www.beinsports.com/france/turquie-super-lig/calendrier
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beinsports.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458901/Fotbal%20-%20Turecko%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/458901/Fotbal%20-%20Turecko%20stats.meta.js
// ==/UserScript==

setTimeout( () => {
    alert("Klikni na OK pro vygenerování odkazů na STATS");

    const matches = document.querySelectorAll(".scoreline");
    const matchesArr = [...matches];

    matchesArr.map( (match) => {
        const odkaz = document.createElement("a");
        const misto = match.querySelectorAll(".score-divider");
        const matchId = match.dataset.match;

        odkaz.append("STATS live url");
        odkaz.href = "https://www.beinsports.com/france/livescores/match-center/2022/115/" + matchId;
        misto[0].appendChild(odkaz);
    })
}, 2000)


