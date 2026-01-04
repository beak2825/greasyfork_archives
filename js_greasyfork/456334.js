// ==UserScript==
// @name         Rakousko - Hokej
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vygeneruje live url ke všem budoucím zápasům
// @author       Jarda Kořínek
// @match        https://www.ice.hockey/en/schedule-results/schedule
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ice.hockey
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456334/Rakousko%20-%20Hokej.user.js
// @updateURL https://update.greasyfork.org/scripts/456334/Rakousko%20-%20Hokej.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout( () => {
        alert("Klikni na OK pro vygenerování LIVE URL");

        const matchesNL = document.querySelectorAll("tr:not(.-hd-label-FINISHED)[class*='-hd-los-schedule-row']");
        const matchesArr = [...matchesNL];

        matchesArr.map((match) => {
            const odkaz = document.createElement("a");
            const matchId = match.id;
            const misto = match.querySelectorAll(".-hd-los-schedule-col-scoreDivider");

            odkaz.append("LIVE URL");
            odkaz.href = "https://www.ice.hockey/en/stats-facts/gamestats?gameId=" + matchId;
            misto[0].appendChild(odkaz);
        })
    }, 3000)
})();