// ==UserScript==
// @name         YouTube Music album art resolution fix
// @namespace    https://itsad.am
// @version      1.2
// @description  Forces YouTube Music to load now playing album art at a decent resolution so it doesn't look like shit.
// @author       Adam Warren
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406083/YouTube%20Music%20album%20art%20resolution%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/406083/YouTube%20Music%20album%20art%20resolution%20fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(function () {
        var imgSelector = document.querySelector('.ytmusic-player .thumbnail img');
        var bigSrc = imgSelector.src;
        bigSrc = bigSrc.replace('w544-h544', 'w1920-h1920');
        imgSelector.src = bigSrc;
    }, 1000);
})();