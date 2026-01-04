// ==UserScript==
// @name         Keymash - Mute ChatBeep when in-game
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mutes the lobby chat notification sound in the game Keymash when you are currently playing the game
// @author       8Onyx
// @match        https://keymash.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keymash.io
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/450505/Keymash%20-%20Mute%20ChatBeep%20when%20in-game.user.js
// @updateURL https://update.greasyfork.org/scripts/450505/Keymash%20-%20Mute%20ChatBeep%20when%20in-game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const target = document.getElementsByTagName("main")[0];
    const observer = new MutationObserver((records) => {
        for (let record of records) {
            if (record.removedNodes.length && document.getElementById("ChatBeep") && target.children[3] == record.target) {
                if (record.removedNodes[0].className.includes("container")) {
                    // Game start
                    ChatBeep.volume = 0;
                    console.log("Muting ChatBeep, game has started.");
                } else {
                    // Game end
                    ChatBeep.volume = 1;
                    console.log("Unmuting ChatBeep, game has ended.");
                }
            }
        }
    });
    observer.observe(target, { childList: true, subtree: true });
})();