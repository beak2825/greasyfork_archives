// ==UserScript==
// @name         No skins by /u/ph0t0shop
// @namespace    noskins
// @version      1.0
// @description  Turn off skins by /u/ph0t0shop
// @author       /u/ph0t0shop
// @match        http://slither.io/*
// @match        https://slither.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19829/No%20skins%20by%20uph0t0shop.user.js
// @updateURL https://update.greasyfork.org/scripts/19829/No%20skins%20by%20uph0t0shop.meta.js
// ==/UserScript==
window.addEventListener("load", function () {
    window.setSkin = (function () {
        var originalSetSkin = setSkin;
        return function (targetSnake, skinId) {
            originalSetSkin(targetSnake, skinId);
            targetSnake.rbcs = [9];
        };
    })();
}, false);