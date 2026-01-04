// ==UserScript==
// @name         Next and Previous key shortcuts for SoundCloud
// @description  Allows the left and right keyboard arrows to be used to go to the previous and next songs on SoundCloud (without having to click on the next or previous buttons at all).
// @author       Zach Saucier
// @namespace    https://zachsaucier.com/
// @version      1.0
// @match        https://soundcloud.com/*
// @downloadURL https://update.greasyfork.org/scripts/377740/Next%20and%20Previous%20key%20shortcuts%20for%20SoundCloud.user.js
// @updateURL https://update.greasyfork.org/scripts/377740/Next%20and%20Previous%20key%20shortcuts%20for%20SoundCloud.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('keydown', (event) => {
        switch(event.code) {
            case 'ArrowLeft':
                document.querySelector('.skipControl__previous').click();
                break;
            case 'ArrowRight':
                document.querySelector('.skipControl__next').click();
                break;
        }
    }, false);
})();