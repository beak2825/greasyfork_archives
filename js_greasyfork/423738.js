// ==UserScript==
// @name           IPLA Enhanced
// @name:pl        Ulepszenia dla odtwarzania wideo na stronie IPLA.pl
// @namespace      http://tampermonkey.net/
// @version        0.1
// @description    Script adds seek buttons (-5 sec and +5 sec) to IPLA Player.
// @description:pl Skrypt dodaje przyciski przesuwania (-5 sekund i +5 sekund) do odtwarzacza IPLA.
// @author         DaveIT
// @match          https://www.ipla.tv/wideo/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/423738/IPLA%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/423738/IPLA%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var settings = {
        seekBackwardTime: -5,
        seekForwardTime: 5
    }

    var interval = setInterval(waitForThePlayer, 1000);
    var video = null;

    function rewind(value) {
        video.currentTime = video.currentTime + value;
    }

    function waitForThePlayer() {
        var player = document.querySelector('.cpp2-row.row--3VLMJ.cpp2-buttons-row.buttons-row--aC_iv.cpp2-secondary-buttons.secondary-buttons--2jm-H');
        video = document.querySelector('video');
        console.log('Testuję...');

        if(player != null && video != null) {
            clearInterval(interval);

            var backward = document.createElement('div');
            backward.className = "cpp2-button button--3M_f2 cpp2-round-button round-button--2322C cpp2-play-button play-button--H-iUJ";
            backward.onclick = function() { rewind(settings.seekBackwardTime) };
            backward.style = "transform: rotate(180deg)";

            var forward = document.createElement('div');
            forward.className = "cpp2-button button--3M_f2 cpp2-round-button round-button--2322C cpp2-play-button play-button--H-iUJ";
            forward.onclick = function() { rewind(settings.seekForwardTime) };

            var container = document.querySelector('.cpp2-row.row--3VLMJ.cpp2-buttons-row.buttons-row--aC_iv.cpp2-secondary-buttons.secondary-buttons--2jm-H');

            var soundButton = document.querySelector('.cpp2-button.button--3M_f2.cpp2-round-button.round-button--2322C.cpp2-sound-button.sound-button--9VX8M.cpp2-high.high--1SLE2');

            container.insertBefore(backward, soundButton);
            container.insertBefore(forward, soundButton);
        }
    }
})();