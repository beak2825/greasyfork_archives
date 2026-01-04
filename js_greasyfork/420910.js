// ==UserScript==
// @name         Twitch Theatre Mode
// @namespace    https://www.twitch.tv/*
// @version      0.1
// @description  Load Twitch in Theatre Mode
// @author       Halt-I-Am-Reptar
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420910/Twitch%20Theatre%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/420910/Twitch%20Theatre%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    theatreMode();

    async function theatreMode() {
        await sleep(2000);
        if ( document.querySelector("[data-a-target=player-theatre-mode-button]") ) {
            document.querySelector("[data-a-target=player-theatre-mode-button]").click();
            console.log("Theatre Mode Button Clicked.");
        } else {
            console.log("Theatre Mode Button Not Found.");
        }
    }

    function sleep (milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
})();
