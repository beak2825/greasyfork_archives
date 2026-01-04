// ==UserScript==
// @name         NoBling: simplifychess
// @match        https://simplifychess.com/*
// @icon         https://https://simplifychess.com/favicon.ico
// @description  void
// @version      1.0
// @license      MIT
// @author       pwa
// @namespace    pwa
// @downloadURL https://update.greasyfork.org/scripts/463889/NoBling%3A%20simplifychess.user.js
// @updateURL https://update.greasyfork.org/scripts/463889/NoBling%3A%20simplifychess.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    e = document.getElementsByClassName("header__next")[0];
    if (e) {
        console.log("[pwa]: animation disabled");
        e.style.animation = "none";
    }
}, false);

