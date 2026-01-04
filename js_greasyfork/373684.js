// ==UserScript==
// @name        VVVVID Anti-Adblock Killer
// @namespace   https://github.com/Nearata/vvvvid-anti-adblock-killer
// @copyright   2018+, William Di Cicco (Nearata)
// @license     MIT
// @version     1.0.8
// @description Previene la disattivazione dell'adblock
// @author      Nearata <nearata@protonmail.com>
// @supportURL  https://github.com/Nearata/vvvvid-anti-adblock-killer/issues
// @match       *://www.vvvvid.it/*
// @exclude     *://www.vvvvid.it/adblock.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373684/VVVVID%20Anti-Adblock%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/373684/VVVVID%20Anti-Adblock%20Killer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.vvvvid.lastPlayedPreCommunityTime = Infinity;
    window.nopub = true;
    sessionStorage.setItem("vvvvid.logoPlayed", "1");
})();
