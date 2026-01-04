// ==UserScript==
// @name         dxdchess
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  good stuff
// @author       aidanch1
// @license      MIT
// @match        https://lichess.org/*
// @icon         https://cdn.myanimelist.net/images/anime/1331/111940l.jpg
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524335/dxdchess.user.js
// @updateURL https://update.greasyfork.org/scripts/524335/dxdchess.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
    function applyStyle(color) {
        GM_addStyle(`
.is2d {
    .king.${color} {
        background-image: url('https://cdn.myanimelist.net/images/characters/5/150011.jpg');
    }
    .queen.${color} {
        background-image: url('https://cdn.myanimelist.net/images/characters/3/150013.jpg');
    }
    .bishop.${color} {
        background-image: url('https://cdn.myanimelist.net/images/characters/16/155349.jpg');
    }
    .knight.${color} {
        background-image: url('https://cdn.myanimelist.net/images/characters/13/150035.jpg');
    }
    .rook.${color} {
        background-image: url('https://cdn.myanimelist.net/images/characters/2/216619.jpg');
    }
    .pawn.${color} {
        background-image: url('https://cdn.myanimelist.net/images/characters/4/211641.jpg');
    }
}
    `);
    }
    if (document.querySelector('.puzzle')) {
        waitForElm('.no-square').then(elm => {
            const color = elm.firstChild.classList.contains('white') ? 'white' : 'black';
            applyStyle(color);
        });
    } else {
        const user = document.body.getAttribute('data-user');
        const meta = document.querySelector('.game__meta__players');
        const color = meta.children[0].innerText.toLowerCase().includes(user) ? 'white' : 'black';
        applyStyle(color);
    }
})();