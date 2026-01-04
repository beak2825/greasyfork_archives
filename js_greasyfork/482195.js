// ==UserScript==
// @name         Lukáš sázkovka 2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přidá live tlačítko na stránku Football.com
// @author       Michal
// @match        https://www.football.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482195/Luk%C3%A1%C5%A1%20s%C3%A1zkovka%202.user.js
// @updateURL https://update.greasyfork.org/scripts/482195/Luk%C3%A1%C5%A1%20s%C3%A1zkovka%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createMatchLink(matchElement) {
        let matchRouterKey = matchElement.getAttribute('data-back-el-key');
        if (matchRouterKey && matchRouterKey.startsWith('sr:match:')) {
            let matchID = matchRouterKey.split(':')[2];
            let matchDetailLink = `https://www.football.com/ng/m/sport/football/live/A/B/ACS/sr:match:${matchID}`;

            let link = document.createElement('a');
            link.href = matchDetailLink;
            link.textContent = 'Detail zápasu';
            link.style.marginLeft = '10px';
            link.style.color = '#9df311';

            matchElement.appendChild(link);
        }
    }

    function addMatchLinks() {
        let allMatches = document.querySelectorAll('[data-back-el-key^="sr:match:"]');
        allMatches.forEach(function(match) {
            if (!match.querySelector('a[href^="https://www.football.com/ng/m/sport/football/live/A/B/ACS/sr:match:"]')) {
                createMatchLink(match);
            }
        });
    }

    setInterval(addMatchLinks, 1000);

    addMatchLinks();
})();
