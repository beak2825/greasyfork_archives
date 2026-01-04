// ==UserScript==
// @name         Next and Previous key shortcuts for Spotify
// @description  Allows the left and right keyboard arrows to be used to go to the previous and next songs on Spotify.
// @author       Zach Saucier
// @namespace    https://zachsaucier.com/
// @version      1.1
// @match        https://open.spotify.com/*
// @downloadURL https://update.greasyfork.org/scripts/375100/Next%20and%20Previous%20key%20shortcuts%20for%20Spotify.user.js
// @updateURL https://update.greasyfork.org/scripts/375100/Next%20and%20Previous%20key%20shortcuts%20for%20Spotify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('keydown', (event) => {
        switch(event.code) {
            case 'ArrowLeft':
                document.querySelector('.spoticon-skip-back-16').click();
                break;
            case 'ArrowRight':
                document.querySelector('.spoticon-skip-forward-16').click();
                break;
        }
    }, false);
})();