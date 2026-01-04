// ==UserScript==
// @name         Mangakakalot Pop-up Block
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks the annoying Pop-ups in the top right in Mangakakalot
// @author       Anonymous
// @match        https://ww.mangakakalot.tv/*
// @icon         https://i.postimg.cc/QxXtRD3F/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430699/Mangakakalot%20Pop-up%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/430699/Mangakakalot%20Pop-up%20Block.meta.js
// ==/UserScript==

function removeAds(delayInMs) {
    setTimeout(function() {
        var elem = document.getElementsByTagName("iframe")[1];
        elem.parentNode.removeChild(elem);
    }, delayInMs);
}

(function() {
    'use strict';

    // Remove ads
    removeAds(700);

    // Backup 1
    removeAds(1000);

    // Backup 2
    removeAds(1250);
})();