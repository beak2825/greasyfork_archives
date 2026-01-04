// ==UserScript==
// @name         Volejbal - beach generování tlačítka 2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Generovat tlačítka pro detaily zápasů na stránce volleyballworld.com
// @author       Michal
// @match        https://en.volleyballworld.com/beachvolleyball/competitions/*/schedule/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479421/Volejbal%20-%20beach%20generov%C3%A1n%C3%AD%20tla%C4%8D%C3%ADtka%202.user.js
// @updateURL https://update.greasyfork.org/scripts/479421/Volejbal%20-%20beach%20generov%C3%A1n%C3%AD%20tla%C4%8D%C3%ADtka%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        const matchElements = document.querySelectorAll('[matchid]:not([status="finished"])');

        matchElements.forEach(matchElement => {
            const matchIDWithPrefix = matchElement.getAttribute('matchid');
            const matchID = matchIDWithPrefix.replace('match-','');

            if (!matchElement.classList.contains('vbw-mu-finished')) {
                const matchDetailLink = `https://fivb.12ndr.at/match?match=${matchID}`;
                const linkButton = document.createElement('a');
                linkButton.href = matchDetailLink;
                linkButton.innerHTML = `<span style="font-size: 1.2em;"><img class="event__logo event__logo--away" loading="lazy" src="https://static.flashscore.com/res/image/data/0n1ffK6k-vcNAdtF9.png"></span>`;
                linkButton.style.marginTop = '25px';
                linkButton.style.textDecoration = 'none';

                matchElement.appendChild(linkButton);

                linkButton.style.marginLeft = '20px';

                linkButton.style.marginTop = '25px';
            }
        });
    }, 5000);
})();
