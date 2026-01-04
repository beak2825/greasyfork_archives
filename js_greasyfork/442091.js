// ==UserScript==
// @name         BGA Neo Skins
// @namespace    https://greasyfork.org/ja/users/161581
// @version      0.2
// @description  A New Skin for The Board Game Arena; Solo.
// @author       MugiSus
// @match        https://boardgamearena.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamearena.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442091/BGA%20Neo%20Skins.user.js
// @updateURL https://update.greasyfork.org/scripts/442091/BGA%20Neo%20Skins.meta.js
// ==/UserScript==

let gamename;

function skinloop() {
    gamename = document.querySelector("meta[property='og:url']")?.content.match(/^.+\/(.*?)(?:$|\?)/)[1];
    switch (gamename) {
        case "solo": {
            [...document.querySelectorAll(".single_card, .stockitem")].forEach(elem => elem.style["background-image"] = "url('https://i.imgur.com/oNeen3B.png')");
        } break;
    }
    requestAnimationFrame(skinloop);
}

skinloop();