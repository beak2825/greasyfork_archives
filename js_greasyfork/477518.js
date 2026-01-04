// ==UserScript==
// @name         Penny DEL
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Vygeneruje live urls na týmové stats k zápasům pro německou DEL.
// @author       MK
// @match        https://www.penny-del.org/spiele
// @icon         https://www.penny-del.org/_assets/e4ccd237e60ebadf8c55c336e47a814f/images/del/PENNY-DEL-LOGO_30-Jahre_Outline.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477518/Penny%20DEL.user.js
// @updateURL https://update.greasyfork.org/scripts/477518/Penny%20DEL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        const matchesNL = document.querySelectorAll("#c10 > div > div > div > div.card__content > div > table > tbody > tr");
        const matchesArr = [...matchesNL];

        matchesArr.forEach((match) => {
            const misto = match.querySelectorAll(".team-result__stats");

            const formattedDate = getFormattedDate(match);

            const teamStatsLink = createLink("Team Stats", "playbyplay", match, formattedDate);

            const teamStatsDiv = document.createElement("div");
            teamStatsDiv.appendChild(teamStatsLink);

            misto[0].appendChild(teamStatsDiv);
        });
    }, 2000); // Zpoždění 5 sekund

    function getFormattedDate(match) {
        const getdate = match.querySelector(".team-schedule__date").textContent.split(', ')[1].split('.');
        return getdate[0].padStart(2, '0') + getdate[1].padStart(2, '0') + getdate[2];
    }

    function createLink(text, endpoint, match, formattedDate) {
        const odkaz = document.createElement("a");
        const hometeam = match.querySelector(".team-schedule__versus:nth-child(4) > div > div > .team-meta__name > a").getAttribute('href').split('/')[2];
        const awayteam = match.querySelector(".team-schedule__versus:nth-child(5) > div > div > .team-meta__name > a").getAttribute('href').split('/')[2];
        const matchid = match.querySelector(".team-schedule__status > a").getAttribute('href').split('/')[3];

        odkaz.append(text);

        const href = "statistik/spieldetails/" + formattedDate + "_" + hometeam + "_gg_" + awayteam + "_" + matchid;

        if (match.querySelector(".team-schedule__status > a").getAttribute('href').includes(formattedDate)) {
            const nhref = match.querySelector(".team-schedule__status > a").getAttribute('href');
            odkaz.href = nhref + "/" + endpoint;
        } else {
            odkaz.href = href + "/" + endpoint;
        }

        return odkaz;
    }
})();