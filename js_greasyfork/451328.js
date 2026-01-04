// ==UserScript==
// @name        html5 video speed controller (vlc like) modified by Sapioit
// @namespace   github.com/sky-bro
// @version     1.1.0.0
// @description Simple html5 video speed control with 's', 'd', and 'r'. 's': decrease by 0.25, 'd': increase by 0.25, 'r': back to 1.0x
// @author      https://sky-bro.github.io      https://sapioit.com
// @match       https://www.youtube.com/*
// @match       https://www.bilibili.com/*
// @match       *://*.zhihuishu.com/*
// @license     GPL-2.0-only; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/451328/html5%20video%20speed%20controller%20%28vlc%20like%29%20modified%20by%20Sapioit.user.js
// @updateURL https://update.greasyfork.org/scripts/451328/html5%20video%20speed%20controller%20%28vlc%20like%29%20modified%20by%20Sapioit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setPlaybackRate(player, rate) {
        if (rate < 0.1) rate = 0.1;
        else if (rate > 40) rate = 40;
        player.playbackRate = rate;
        console.log("playing in %sx", (rate).toFixed(1));
    }

    window.addEventListener('keypress', function(event) {
        var player = document.querySelector("video");
        // console.log(event);
        var curRate = Number(player.playbackRate);
        // vlc actually uses '[' and ']', but they are used by vimium
        if (event.key == "s") {
            console.log("s pressed");
            setPlaybackRate(player, curRate - 0.25);
        } else if(event.key == "d") {
            console.log("d pressed");
            setPlaybackRate(player, curRate + 0.25);
        } else if(event.key == "r") {
            console.log("r pressed");
            setPlaybackRate(player, 1);
        }
    });
})();
