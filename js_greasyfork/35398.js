// ==UserScript==
// @name         Youtube Vollbild Titel ausblenden
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Youtube Video-Titel im Vollbildmodus verstecken
// @author       Silver_Bear
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35398/Youtube%20Vollbild%20Titel%20ausblenden.user.js
// @updateURL https://update.greasyfork.org/scripts/35398/Youtube%20Vollbild%20Titel%20ausblenden.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector(".ytp-title-link").style.display = "none";
})();