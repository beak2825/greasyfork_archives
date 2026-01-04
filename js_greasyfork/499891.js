// ==UserScript==
// @name         Player Counter
// @description  shows the amount of players in the lobby
// @author       Snowfall bro
// @match        https://*diep.io/*
// @grant        none
// @version 0.0.1.20240707052616
// @namespace https://greasyfork.org/users/1329509
// @downloadURL https://update.greasyfork.org/scripts/499891/Player%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/499891/Player%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let counter

    const create = () => {
        counter = document.createElement('div');

        counter.style.position = 'fixed';
        counter.style.right = '0';
        counter.style.top = '68%';
        counter.style.transform = 'translateY(-50%)';
        counter.style.color = 'white';
        counter.style.textShadow = '2px 2px 0 black, -2px -2px 0 black, -2px 2px 0 black, 2px -2px 0 black';
        counter.style.background = 'none';
        counter.style.padding = '10px';
        counter.style.fontSize = '20px';
        counter.style.zIndex = '1000';

        document.body.appendChild(counter);
    };

    const getPlayers = () => {
        const players = input.getPlayerCount()
        counter.textContent = `${players} players`
    }

    create()

    setInterval(getPlayers, 100)
})();