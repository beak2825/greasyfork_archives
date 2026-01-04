// ==UserScript==
// @name         Rusko a Bělorusko - Basketbal
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Skripta pro Ruské a Běloruské basketbaly
// @author       Michal
// @match        https://russiabasket.ru/competitions/*/premer-liga/schedule
// @match        https://russiabasket.ru/competitions/*/superliga/schedule
// @match        https://belarus.russiabasket.ru/competitions/details/*
// @match        https://vtb-league.com/en/rbwidget/schedule/?compId=*//
// @match        https://russiabasket.ru/competitions/*/kubok-rossii/schedule
// @icon         https://www.google.com/s2/favicons?sz=64&domain=russiabasket.ru
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491643/Rusko%20a%20B%C4%9Blorusko%20-%20Basketbal.user.js
// @updateURL https://update.greasyfork.org/scripts/491643/Rusko%20a%20B%C4%9Blorusko%20-%20Basketbal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addLiveLinksBelarus() {
        const matchLinks = document.querySelectorAll('.ng-scope a');
        if (matchLinks.length > 0) {
            matchLinks.forEach(function(link) {
                const matchId = link.href.match(/\d+/);
                if (matchId) {
                    const gameId = matchId[0];

                    if (link.innerText === 'Превью') {
                        const liveLink = document.createElement('a');
                        liveLink.href = `https://belarus.russiabasket.ru/games/${gameId}#plays`;
                        liveLink.innerText = 'Detail zápasu';
                        liveLink.className = 'live-link';
                        link.innerText = '';
                        link.appendChild(liveLink);
                    } else if (link.innerText === 'Полная статистика') {
                        link.innerText = 'Detail zápasu';
                    }
                }
            });
        }
    }

    function addLiveLinksVTB() {
        var gameContainers = document.querySelectorAll('.center a');

        if (gameContainers.length > 0) {
            gameContainers.forEach(function(container) {
                var matchUrl = container.getAttribute('href');
                var matchId = matchUrl.match(/\/en\/game\/(\d+)\//);

                if (matchId) {
                    matchId = matchId[1];
                    var liveButton = document.createElement('a');
                    liveButton.href = 'https://russiabasket.ru/games/' + matchId + '#plays';
                    liveButton.innerHTML = 'Detail zápasu';
                    liveButton.target = '_blank';

                    var centerElement = container.closest('.center');
                    if (centerElement) {
                        centerElement.innerHTML = '';
                        centerElement.appendChild(liveButton);
                    }
                }
            });
        }
    }

    if (location.hostname.includes("russiabasket.ru")) {
        setTimeout(function() {
            addLiveLinksBelarus();
        }, 2000);
    }

    if (location.hostname.includes("belarus.russiabasket.ru")) {
        setInterval(function() {
            addLiveLinksBelarus();
        }, 1000);
    }

    if (location.hostname.includes("vtb-league.com")) {
        setTimeout(function() {
            addLiveLinksVTB();
        }, 2000);
    }
})();