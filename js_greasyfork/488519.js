// ==UserScript==
// @name         Evropské poháry - Vylepšená verze
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Přesměrování z Euroleague a Eurocup game-center na novou URL s ID zápasu.
// @author       Michal
// @match        https://www.euroleaguebasketball.net/euroleague/game-center/*/E2024/*
// @match        https://www.euroleaguebasketball.net/eurocup/game-center/2024-25/*
// @match        https://www.euroleaguebasketball.net/en/eurocup/game-center/2024-25/*/U2024/*
// @match        https://www.euroleaguebasketball.net/eurocup/game-center/2024-25/*/U2024/*/
// @match        https://www.euroleaguebasketball.net/en/eurocup/game-center/2024-25/*/U2024/*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488519/Evropsk%C3%A9%20poh%C3%A1ry%20-%20Vylep%C5%A1en%C3%A1%20verze.user.js
// @updateURL https://update.greasyfork.org/scripts/488519/Evropsk%C3%A9%20poh%C3%A1ry%20-%20Vylep%C5%A1en%C3%A1%20verze.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastURL = '';

    function checkAndRedirect() {
        const currentURL = window.location.href;

        if (currentURL === lastURL) return;
        lastURL = currentURL;

        if (!currentURL.match(/[EU]\d{4}/) || !currentURL.match(/\/\d+\/?$/)) return;

        const cooldownKey = 'euroleague_redirect_' + currentURL;
        const lastRedirect = localStorage.getItem(cooldownKey);
        const now = Date.now();

        if (lastRedirect && (now - parseInt(lastRedirect) < 5000)) return;

        const urlParts = currentURL.split('/');
        const seasonCode = currentURL.match(/[EU]\d{4}/)[0];
        let gameCode = urlParts[urlParts.length - 2];

        if (urlParts[urlParts.length - 1] !== '' && /^\d+$/.test(urlParts[urlParts.length - 1])) {
            gameCode = urlParts[urlParts.length - 1];
        }

        const redirectURL = "http://live.euroleague.net/boxscore?gamecode=" + gameCode + "&seasoncode=" + seasonCode;

        localStorage.setItem(cooldownKey, now.toString());

        window.location.href = redirectURL;
    }

    checkAndRedirect();

    setInterval(checkAndRedirect, 500);

})();
