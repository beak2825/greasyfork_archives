// ==UserScript==
// @name           Wordle Hack
// @version        1.0.2
// @author         Eli Richardson
// @description    Instantly solves a wordle puzzle... Impress your friends but never actually get the satisfaction of winning!
// @match          https://www.nytimes.com/games/wordle/index.html
// @run-at         document-end
// @license        MIT
// @namespace https://greasyfork.org/users/873652
// @downloadURL https://update.greasyfork.org/scripts/439665/Wordle%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/439665/Wordle%20Hack.meta.js
// ==/UserScript==

document.addEventListener('readystatechange', function (event) {
    if (document.readyState === 'complete') {
        var gameState = JSON.parse(window.localStorage['nyt-wordle-state']);
        var solution = gameState.solution;
        if (gameState.rowIndex !== 0) {
            delete localStorage['nyt-wordle-state'];
            return window.location.reload();
        }
        for (var i = 0; i < 5; i++) {
            var kevent = new KeyboardEvent('keydown', { key: solution[i] });
            window.dispatchEvent(kevent);
        }
        document
            .querySelector('body > game-app')
            .shadowRoot.querySelector('#game > game-keyboard')
            .shadowRoot.querySelector('#keyboard > div:nth-child(3) > button:nth-child(1)')
            .click();
    }
});
