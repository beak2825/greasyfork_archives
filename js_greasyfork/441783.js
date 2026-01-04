// ==UserScript==
// @name         PFU Autoplay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Play for Ukraine Autoplay
// @author       het trotse volk van het Koninkrijk der Nederlanden
// @match        https://playforukraine.life/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playforukraine.life
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441783/PFU%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/441783/PFU%20Autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let html = document.documentElement,
        retry = document.querySelector("a.retry-button"),
        gameMessage = document.querySelector("div.game-message"),
        keyCodes = [87,65,83,68];

    emulateGame();

    async function emulateGame() {
        html.focus();

        while (!document.querySelector("div.game-message").classList.contains("game-over")) {
            document.dispatchEvent(new KeyboardEvent('keydown',
                                                     { 'keyCode': keyCodes[Math.floor(Math.random()*4)] }
                                                    ));
            await sleep(200);
        }

        retry.click();
        emulateGame();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})();