// ==UserScript==
// @name         Better Studyflix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Clicks away login window and stops autoplay.
// @author       Doriano Dipierro
// @license      MIT
// @match        https://studyflix.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=studyflix.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482206/Better%20Studyflix.user.js
// @updateURL https://update.greasyfork.org/scripts/482206/Better%20Studyflix.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const interval = 1000;
    let attempts = 10;
    const intervalId = setInterval(() => {
        const button = document.querySelector('[up-dismiss]');
        if (button) {
            button.click();
            clearInterval(intervalId);
        }
    }, interval);
    const intervalId2 = setInterval(() => {
        const button = document.querySelector('[class="vjs-play-control vjs-control vjs-button vjs-playing"]');
        if (button) {
            button.click();
            clearInterval(intervalId2);
        }
    }, interval);
})();