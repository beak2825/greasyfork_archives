// ==UserScript==
// @name         Itálie - Volejbal
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přidá tlačítko pro proklik na live URL k každému zápasu na stránce Legavolleyfemminile
// @author       Michal
// @match        https://www.legavolleyfemminile.it/calendario/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478790/It%C3%A1lie%20-%20Volejbal.user.js
// @updateURL https://update.greasyfork.org/scripts/478790/It%C3%A1lie%20-%20Volejbal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const matches = document.querySelectorAll('div.table-responsive');

    function createButton(match) {
        const matchID = match.querySelector('div.table-responsive > table:nth-child(1) > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(7) > a:nth-child(1)').getAttribute('href').match(/\d+/);
        const liveURL = `https://ww2.legavolleyfemminile.it/TabellinoGara_i.asp?IdGara=${matchID}`;

        const button = document.createElement('a');
        button.href = liveURL;
        button.innerText = 'Přejít na Live url';
        button.target = '_blank';
        button.style.padding = '5px';

        const matchCenterText = match.querySelector('div.table-responsive > table:nth-child(1) > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(7) > a:nth-child(1)');
        if (matchCenterText) {
            matchCenterText.parentNode.replaceChild(button, matchCenterText);
        }
    }

    matches.forEach((match) => {
        createButton(match);
    });
})();