// ==UserScript==
// @name         Slither Boost Audio
// @namespace    https://slither.io
// @version      3.1
// @description  By Kaushik-Rajarathinam
// @author       https://github.com/Kaushik-Rajarathinam
// @noframes
// @match        http://slither.io/*
// @match        https://slither.io/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31537/Slither%20Boost%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/31537/Slither%20Boost%20Audio.meta.js
// ==/UserScript==

(function() {
    'use strict';
//uses an audio from andrew bramwells website.
    var audio = new Audio('http://www.andrewbramwell.co.uk/SMB-SP.mp3'); 
    window.addEventListener("mousedown", function () {
        audio.play();
    }, false);
    window.addEventListener("mouseup", function () {
        audio.pause();
        audio.currentTime = 0;
    }, false);
})();