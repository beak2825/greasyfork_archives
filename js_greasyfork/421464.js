// ==UserScript==
// @name        html5 video speed controller (vlc like)
// @namespace   github.com/sky-bro
// @version     1.0.2
// @description Simple html5 video speed control with '-', '+', and '=' (vlc like). '-': decrease by 0.1, '+': increase by 0.1, '=': back to 1.0x
// @author      https://sky-bro.github.io
// @match       https://www.youtube.com/*
// @match       https://www.bilibili.com/*
// @match       *://*.zhihuishu.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/421464/html5%20video%20speed%20controller%20%28vlc%20like%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421464/html5%20video%20speed%20controller%20%28vlc%20like%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setPlaybackRate(player, rate) {
        if (rate < 0.1) rate = 0.1;
        else if (rate > 10) rate = 10;
        player.playbackRate = rate;
        console.log("playing in %sx", (rate).toFixed(1));
    }

    window.addEventListener('keypress', function(event) {
        var player = document.querySelector("video");
        // console.log(event);
        var curRate = Number(player.playbackRate);
        // vlc actually uses '[' and ']', but they are used by vimium
        if (event.key == "-") {
            console.log("- pressed");
            setPlaybackRate(player, curRate - 0.1);
        } else if(event.key == "+") {
            console.log("+ pressed");
            setPlaybackRate(player, curRate + 0.1);
        } else if(event.key == "=") {
            console.log("= pressed");
            setPlaybackRate(player, 1);
        }
    });
})();
