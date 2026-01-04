// ==UserScript==
// @name         PTN Video Player Resize
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Resize the video player on porntn.com to fit the viewport better.
// @author       Strafezy
// @match        *://porntn.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530549/PTN%20Video%20Player%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/530549/PTN%20Video%20Player%20Resize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const player = document.querySelector(".player");
    if (player) {
        player.style.width = "85%";
        player.style.margin = "auto";
    }
})();
