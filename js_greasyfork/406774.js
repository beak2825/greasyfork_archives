// ==UserScript==
// @name         Next and Previous key shortcuts for YouTube Music
// @description  Allows the left and right keyboard arrows to be used to go to the previous and next songs on YouTube Music (without having to click on the next or previous buttons at all).
// @author       Zach Saucier
// @namespace    https://zachsaucier.com/
// @version      1.0
// @match        https://music.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/406774/Next%20and%20Previous%20key%20shortcuts%20for%20YouTube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/406774/Next%20and%20Previous%20key%20shortcuts%20for%20YouTube%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('keydown', (event) => {
        switch(event.code) {
            case 'ArrowLeft':
                document.querySelector('.previous-button').click();
                break;
            case 'ArrowRight':
                document.querySelector('.next-button').click();
                break;
        }
    }, false);
})();