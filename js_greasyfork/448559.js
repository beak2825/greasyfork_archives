// ==UserScript==
// @name         暑假研
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  （仅自动播放、静音）
// @author       You
// @match        https://www.zxx.edu.cn/*
// @grant        none
// @license      You
// @downloadURL https://update.greasyfork.org/scripts/448559/%E6%9A%91%E5%81%87%E7%A0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/448559/%E6%9A%91%E5%81%87%E7%A0%94.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //document.querySelector('video').play();
    //current_video.volume = 0
    // Your code here...
    setInterval(function () {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            // 静音
            current_video.volume = 0
            document.querySelector('video').playbackRate = 4;

            // 如果视频被暂停
            if (current_video.paused) {
                current_video.play()
            }

        }
    }, 2000)
})();