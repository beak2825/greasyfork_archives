// ==UserScript==
// @name            PlayPuls Player Switcher Beta
// @name:pl         Zmiana odtwarzacza PlayPuls na domyślny
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     The script replaces the original playpuls.pl player with the classic HTML5 player.
// @description:pl  Skrypt zamienia oryginalny odtwarzacz playpuls.pl na domyślny HTML5.
// @author          DaveIT
// @match           https://playpuls.pl/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/407291/PlayPuls%20Player%20Switcher%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/407291/PlayPuls%20Player%20Switcher%20Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        var video = document.querySelector('video');

        if(video) {
            video.controls = true;

            var player = document.querySelector('.player2');
            player.innerHTML = '';
            player.className = 'JustPlayIT';
            player.appendChild(video);
        }
    }

    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            init();
        }
    }, 10);

})();