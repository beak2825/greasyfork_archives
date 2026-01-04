// ==UserScript==
// @name         Fotbal - Bundesliga stats
// @namespace    http://tampermonkey.net/
// @version      1.47
// @description  Vygeneruje odkazy na statistiky zápasů na hlavní stránce
// @author       Jarda Kořínek
// @match        https://www.bundesliga.com/en/bundesliga/matchday
// @match        https://www.bundesliga.com/en/2bundesliga/matchday
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bundesliga.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459196/Fotbal%20-%20Bundesliga%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/459196/Fotbal%20-%20Bundesliga%20stats.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        const matches = document.querySelectorAll(".matchRow");
        const matchesArr = [...matches];

        matchesArr.map((match) => {
            const stats = document.createElement("a");
            const misto = match.querySelectorAll(".ng-star-inserted")[1];

            stats.textContent = "stats";
            stats.href = match.firstChild.href.replace("/liveticker", "/stats");
            stats.style.display = "block";

            misto.appendChild(stats);
        });
    }, 1000);
})();
