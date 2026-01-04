// ==UserScript==
// @name         Norsko - hokej
// @version      1.0
// @grant        none
// @namespace    http://tampermonkey.net/
// @author       Michal
// @match        https://www.hockey.no/live/Live/Match/*
// @match        https://www.hockey.no/live/BoxScore/Boxscore/*
// @match        https://www.hockey.no/live/Live/Match/*?*
// @description  Vygeneruje se tlačítko do gamesheetu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480389/Norsko%20-%20hokej.user.js
// @updateURL https://update.greasyfork.org/scripts/480389/Norsko%20-%20hokej.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const matchId = url.match(/\/(\d+)\??/);

    if (matchId) {
        const gameId = matchId[1];
        let openNewWindow = false;

        const redirectToLiveMatch = function() {
            const liveUrl = `https://www.hockey.no/live/Live/Gamesheet/${gameId}`;
            if (openNewWindow) {
                window.open(liveUrl, '_blank');
            } else {
                window.location.href = liveUrl;
            }
        };

        const createButton = function() {
            const button = document.createElement('button');
            button.textContent = 'Gamesheet';
            button.style.padding = '10px';
            button.style.cursor = 'pointer';
            button.addEventListener('click', redirectToLiveMatch);
            button.addEventListener('contextmenu', function(event) {
                event.preventDefault();
                openNewWindow = true;
                redirectToLiveMatch();
            });
            button.addEventListener('auxclick', function(event) {
                if (event.button === 1) {
                    event.preventDefault();
                    openNewWindow = true;
                    redirectToLiveMatch();
                }
            });
            return button;
        };

        const headerElement = document.querySelector('.header');
        if (headerElement) {
            const button = createButton();
            headerElement.appendChild(button);
        }
    }
})();