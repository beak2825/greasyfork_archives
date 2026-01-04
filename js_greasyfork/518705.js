// ==UserScript==
// @name         采云学院
// @namespace    https://e-learning.zcygov.cn/
// @version      1.2
// @description  自动学习,自动续播,静音,倍速播放
// @author       happyghw
// @match        *://e-learning.zcygov.cn/study/platform?id=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518705/%E9%87%87%E4%BA%91%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/518705/%E9%87%87%E4%BA%91%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        setInterval(function () {
            for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
                var current_video = document.getElementsByTagName('video')[i]

                //允许视频后台自动播放
                document.addEventListener("visibilitychange", function() {
                    if (document.hidden) {
                        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
                            var videos_hidden = document.getElementsByTagName('video')[i]
                            // 点击“播放”
                            videos_hidden.play();
                        }
                    }});

                // 静音
                current_video.volume = 0

                // 点击“播放”
                current_video.play();

                // 设置3倍速
                current_video.playbackRate = 3
            }
        },2000)

        // 设置每3分钟刷新一次页面，防止页面不续播
        setTimeout(function() {
            window.location.reload();
        }, 180000);

    }})();