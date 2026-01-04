// ==UserScript==
// @name Fluxus Key System Bypasser
// @namespace Violentmonkey Scripts
// @match *://*.fluxteam.net/*
// @grant none
// @version 1
// @description This userscript bypasses Fluxus key system and takes you directly to the destination page.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485284/Fluxus%20Key%20System%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/485284/Fluxus%20Key%20System%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        var link = document.querySelector("a[href^='https://fluxteam.net/windows/checkpoint/main.php?']");
        if (link) {
            window.location.href = link.href.replace("https://fluxteam.net/windows/checkpoint/main.php?", "https://direct-link.net/");
        }
    };
})();
