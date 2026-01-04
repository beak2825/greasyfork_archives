// ==UserScript==
// @name         Evropské poháry - basketbal
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Přesměrování z Euroleague basketbalového game-center na novou URL s ID zápasu.
// @author       Michal
// @match        https://www.euroleaguebasketball.net/*/euroleague/game-center/*/*
// @match        https://www.euroleaguebasketball.net/*/eurocup/game-center/*/*
// @match        https://www.euroleaguebasketball.net/*/euroleague/game-center/
// @match        https://www.euroleaguebasketball.net/*/eurocup/game-center/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477696/Evropsk%C3%A9%20poh%C3%A1ry%20-%20basketbal.user.js
// @updateURL https://update.greasyfork.org/scripts/477696/Evropsk%C3%A9%20poh%C3%A1ry%20-%20basketbal.meta.js
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