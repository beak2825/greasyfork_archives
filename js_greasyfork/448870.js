// ==UserScript==
// @name         Roblox Game Filter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Filters specific Roblox games based on their title. Filters can be adjusted by editing the 'filters' array.
// @author       Ned - https://github.com/NedWilbur
// @match        *.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448870/Roblox%20Game%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/448870/Roblox%20Game%20Filter.meta.js
// ==/UserScript==

const filters = ['scar', 'ani-tron', 'detention', 'escape', 'killer', 'terror', 'da hood', ' gun', 'gun ', ' guns', ' guns'];

(function() {
    'use strict';

    window.addEventListener('load', function () {
        run();
    }, false);

    window.addEventListener('scroll', function () {
        run();
    }, false);
}
)();

function run() {
    if (window.location.href.includes('Keyword=')){
        removeCardsFromSearch(filters);
    } else {
        removeCardsFromDiscover(filters);
    }
}

function removeCardsFromSearch(filters) {
    const cards = document.querySelectorAll('[data-testid="game-tile"]');

    for (let i = 0; i <= cards.length-1; i++) {
        const title = cards[i].getElementsByClassName('game-name-title')[0].getAttribute('title').toLowerCase();

        for (let k = 0; k <= filters.length-1; k++) {
            const filter = filters[k].toLowerCase();
            if(title.includes(filter)) {
                console.log(`Removing card (contains '${filter}'): ${title}`);
                cards[i].remove();
            }
        }
    }
}

function removeCardsFromDiscover(filters) {
    const cards = document.querySelectorAll('.game-tile');

    for (let i = 0; i <= cards.length-1; i++) {
        const title = cards[i].getAttribute('title').toLowerCase();

        for (let k = 0; k <= filters.length-1; k++) {
            const filter = filters[k].toLowerCase();
            if(title.includes(filter)) {
                console.log(`Removing card (contains '${filter}'): ${title}`);
                cards[i].remove();
            }
        }
    }
}