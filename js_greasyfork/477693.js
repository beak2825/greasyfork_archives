// ==UserScript==
// @name         Hokej ofiko alps.hockey
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vygeneruje live url ke všem zápasům
// @author       Michal Hornok
// @match        https://www.alps.hockey/en/home-en/season/games
// @icon         https://upload.wikimedia.org/wikipedia/en/3/3d/Alps_Hockey_League_logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477693/Hokej%20ofiko%20alpshockey.user.js
// @updateURL https://update.greasyfork.org/scripts/477693/Hokej%20ofiko%20alpshockey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        alert("Klikni na OK");

        const matches = document.querySelectorAll("tr[class*='-hd-los-schedule-row']");

        matches.forEach(match => {
            const odkaz = document.createElement("a");
            const matchId = match.getAttribute("id");

            odkaz.textContent = "LIVE URL";
            odkaz.href = `https://www.alps.hockey/en/home-en/statistics/game/?gameId=${matchId}`;

            const misto = match.querySelector(".-hd-los-schedule-col-scoreDivider");

            if (misto) {
                misto.appendChild(odkaz);
            }
        });
    }, 5000);
})();