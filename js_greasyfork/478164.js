// ==UserScript==
// @name         Beach volejbal
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tlačítko na proklik
// @author       Michal
// @match        https://en.volleyballworld.com/beachvolleyball/competitions/beach-pro-tour/2023/challenge/goa-ind/schedule/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478164/Beach%20volejbal.user.js
// @updateURL https://update.greasyfork.org/scripts/478164/Beach%20volejbal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        const matchElements = document.querySelectorAll('div.vbw-gs2-match-item');

        matchElements.forEach((matchElement) => {
            const matchId = matchElement.getAttribute('data-match-id');

            if (matchId) {
                const matchDetailLink = `https://fivb.12ndr.at/match?match=${matchId}`;
                const linkButton = document.createElement('a');
                linkButton.href = matchDetailLink;
                linkButton.innerHTML = `<span style="font-size: 1.2em;"><img class="event__logo event__logo--away" loading="lazy" src="https://static.flashscore.com/res/image/data/0n1ffK6k-vcNAdtF9.png"></span>`;
                linkButton.style.marginLeft = '10px';
                linkButton.style.textDecoration = 'none';

                matchElement.appendChild(linkButton);
            }
        });
    }, 5000);
})();