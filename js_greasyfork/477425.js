// ==UserScript==
// @name         Itálie Basketbal Serie A2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Generuje Live url na Italské soutěže Serie A2
// @author       Michal
// @match        https://fip.it/risultati*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477425/It%C3%A1lie%20Basketbal%20Serie%20A2.user.js
// @updateURL https://update.greasyfork.org/scripts/477425/It%C3%A1lie%20Basketbal%20Serie%20A2.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const matches = document.querySelectorAll(".ref");

    matches.forEach(match => {
        const matchText = match.textContent.trim();
        const matchId = matchText.match(/\d+/);

        const button = document.createElement("a");
        button.textContent = "LIVE URL";
        button.style.marginLeft = "10px";
        button.style.cursor = "pointer";

        if (matchId && matchId.length > 0) {
            const groupName = document.querySelector('[name="gironi"] > [selected]').textContent.trim();
            let groupId, offset;

            if (groupName === "ROSSO") {
                groupId = "ita2_b_";
                offset = 683;
            } else if (groupName === "VERDE") {
                groupId = "ita2_a_";
                offset = 777;
            } else if (groupName === "UNICO" && parseInt(matchId[0]) >= 2729) {
                groupId = "ita2_clock_";
                offset = 2728;
            }

            if (groupId) {
                const matchNumber = parseInt(matchId[0]);
                const liveUrl = `https://netcasting.webpont.com/?${groupId}${matchNumber - offset}`;
                button.href = liveUrl;
                match.appendChild(button);
            }
        }
    });
})();