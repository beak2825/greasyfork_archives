// ==UserScript==
// @name         专技天下刷课脚本
// @namespace    https://www.zgzjzj.com/
// @version      0.1
// @description  专技天下刷课脚本（自动播放、自动下一节）
// @author       itxcc
// @match        *://*.zgzjzj.com/*
// @grant        none
// @note 2020-09-25 更新
// @downloadURL https://update.greasyfork.org/scripts/412049/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/412049/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            // 静音
            current_video.volume = 0

            // 2倍速,不被系统认可
            // current_video.playbackRate = 2.0

            // 视频播放结束后，模拟点击“下一课”
            if (current_video.ended) {
                var next = document.getElementsByClassName('present')[0].parentNode.children[2]
                next.click()
            }

            // 如果视频被暂停
            if (current_video.paused) {
                current_video.play()
            }
        }
    }, 2000)
})();