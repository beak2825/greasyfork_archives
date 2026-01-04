// ==UserScript==
// @name         Házená - Švédsko
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Vygeneruje odkaz na live url pro všechny zápasy
// @author       Jarda Kořínek
// @match        http*://ta.svenskhandboll.se/SerieAndMatchResult/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=svenskhandboll.se
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457005/H%C3%A1zen%C3%A1%20-%20%C5%A0v%C3%A9dsko.user.js
// @updateURL https://update.greasyfork.org/scripts/457005/H%C3%A1zen%C3%A1%20-%20%C5%A0v%C3%A9dsko.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout( () => {
        alert("Klikni na OK pro vygenerování odkazů na LIVE URL");

        const matchess = document.querySelectorAll("td>.details-link");
        const matchesArr = [...matchess];

        matchesArr.map( (item) => {
            const odkaz = item.href = "https://handballstats.se/SRScoreboard/detailed.aspx?gamenr=" + item.textContent+ "&level=2";

            return odkaz;
        })
    }, 2000)
})();