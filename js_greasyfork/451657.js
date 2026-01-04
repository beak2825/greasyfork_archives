// ==UserScript==
// @name         配速播放
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  （仅自动播放、静音）
// @author       You
// @match        https://www.sxgbxx.gov.cn/*
// @match        https://www.zxx.edu.cn/*
// @match        http://tyj.railsctc.com:8080/*
// @match        https://ipx.yanxiu.com/*
// @grant        none
// @license      You
// @downloadURL https://update.greasyfork.org/scripts/451657/%E9%85%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/451657/%E9%85%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
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
            document.querySelector('video').playbackRate = 1;
 
            // 如果视频被暂停
            if (current_video.paused) {
                current_video.play()
            }
 
        }
    }, 2000)
})();
