// ==UserScript==
// @name         AnimeGo AniBoom autochooser
// @namespace    http://tampermonkey.net/
// @version      2025-08-07
// @description  Sets player to AniBoom.
// @author       Maxlevs
// @include        https://animego.me/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animego.me
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544916/AnimeGo%20AniBoom%20autochooser.user.js
// @updateURL https://update.greasyfork.org/scripts/544916/AnimeGo%20AniBoom%20autochooser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const playerToSelect = "AniBoom";
    const playerChooseButtonSelector = `div#video-player.dropdown.mt-3 span:contains("${playerToSelect}"):not(:has(*))`;

    window.onload=function() {
        setTimeout(doAction, 1000);
    };

    function doAction() {
        unsafeWindow.console.log("[ML-TEST] jQuery:", unsafeWindow.$().jquery);
        unsafeWindow.console.log("[ML-TEST] Player to select:", playerToSelect);
        unsafeWindow.console.log("[ML-TEST] Player chooser button selector:", playerChooseButtonSelector);
        unsafeWindow.$(playerChooseButtonSelector).first().click();
    }
})();
