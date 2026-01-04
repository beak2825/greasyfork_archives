// ==UserScript==
// @name         Sleeper Auction Price Grabber
// @namespace    http://tampermonkey.net/
// @version      2025-07-16
// @description  Gathers the auction price information in sleeper.com NFL draft rooms
// @author       Nathan Abraham
// @match        https://sleeper.com/draft/nfl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sleeper.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542760/Sleeper%20Auction%20Price%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/542760/Sleeper%20Auction%20Price%20Grabber.meta.js
// ==/UserScript==

var allPlayers = [];

function getPlayerRows() {
    return Array.from(document.getElementsByClassName("player-rank-item2"));
}

function parsePlayerRow(row) {
    const name = row.getElementsByClassName('name-wrapper')[0].childNodes[0].textContent;
    const position = row.getElementsByClassName('position')[0].childNodes[1].textContent;
    const team = row.getElementsByClassName('team')[0].textContent;
    const price = row.querySelector('.adp .value').textContent;
    const bye = row.querySelector('.bye .value').textContent;
    return { name, position, team, price, bye };
}

function addAllPlayers() {
    const newPlayers = getPlayerRows().map(parsePlayerRow);
    const big = [...allPlayers, ...newPlayers];
    allPlayers = big.filter((value, index, self) => {
        return self.findIndex(player => JSON.stringify(player) === JSON.stringify(value)) === index;
    });
}

(function() {
    'use strict';
    setTimeout(() => {
        const rankings = document.querySelector('.rankings .scrollbar-container');
        rankings.addEventListener('wheel', () => {
            addAllPlayers();
            console.log('allPlayers = ', allPlayers.length);
            if (allPlayers.length > 250) {
                console.log(allPlayers.map(p => `${p.name},${p.price},${p.position},${p.team},${p.bye}`).join('\n'));
            }
        }, { passive: true});
    }, 2000);
})();