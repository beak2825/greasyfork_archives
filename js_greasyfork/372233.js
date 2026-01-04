
// ==UserScript==
// @name         BaiDuYun Speed1.5
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       liuxiangxiang
// @include      *://pan.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372233/BaiDuYun%20Speed15.user.js
// @updateURL https://update.greasyfork.org/scripts/372233/BaiDuYun%20Speed15.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeypress = function(e) {
        if (e.charCode === 46){
            videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1.5)
        }else if (e.charCode === 44) {
             videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1)
        } else if (e.charCode === 47) {
             videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(2)
        }
    };
})();