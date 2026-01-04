// ==UserScript==
// @name         SteamUnlocked Fixer
// @version      1.0
// @namespace   https://greasyfork.org
// @description  SteamUnlocked fixer for (at least) Firefox and Opera
// @author       You
// @match        https://steamunlocked.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414445/SteamUnlocked%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/414445/SteamUnlocked%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        if (document.querySelectorAll(".btn-download")[0]) {
            var l = document.querySelectorAll(".btn-download")[0].href.replace("https://linksunlocked.com/?token=", "https://uploadhaven.com/download/");
            document.querySelectorAll(".btn-download")[0].href = l;
        }
    }, 200)
})();