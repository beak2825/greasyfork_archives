// ==UserScript==
// @name         Video Player Keyboard Control
// @namespace    http://tampermonkey.net/
// @version      2024-05-23
// @description  Add keyboard control to html5 video player
// @author       Dong
// @match        *.eurosportplayer.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495837/Video%20Player%20Keyboard%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/495837/Video%20Player%20Keyboard%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        document.addEventListener('keydown', function(e) {
            console.log(e.keyCode);
            var player = document.getElementsByTagName('video')[0];
            if (!player) return;

            switch (e.keyCode) {
                case 37:
                    // Arrow Left
                    player.currentTime -= e.ctrlKey ? 30 : 5;
                    break;
                case 39:
                    // Arrow Right
                    player.currentTime += e.ctrlKey? 30 : 5;
                    break;
                case 32:
                    // Space
                    player.paused ? player.play() : player.pause();
                    break;
            }
        });
    });
})();