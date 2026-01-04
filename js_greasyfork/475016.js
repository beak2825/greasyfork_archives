// ==UserScript==
// @name         uucps自动刷课脚本（仅供javascipt开发学习）
// @namespace    http://www.uucps.edu.cn/
// @version      1.0
// @description  针对单个视频每次播放至20分钟就会弹出护眼提示，自动关闭的脚本(仅供js开发学习！)
// @author       Glint
// @match        https://study.enaea.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enaea.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475016/uucps%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BB%85%E4%BE%9Bjavascipt%E5%BC%80%E5%8F%91%E5%AD%A6%E4%B9%A0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/475016/uucps%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BB%85%E4%BE%9Bjavascipt%E5%BC%80%E5%8F%91%E5%AD%A6%E4%B9%A0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setTimeout(function(){
        // 获取video标签
        var video = document.getElementsByTagName('video')[0]

        // 监听视频的时间更新事件
        video.addEventListener('timeupdate', function () {
            // 获取当前播放时间
            var currentTime = video.currentTime

            var interval = 20*60
            // 如果当前播放时间达到20分钟，触发点击事件
            if (currentTime >= interval && currentTime % interval < 1) {
                // 获取60~180之间的一个随机数
                var randomTimeout = Math.floor(Math.random() * (180 - 60 + 1) + 60)
                // 设置随机延迟时间
                setTimeout(function () {
                    // 触发点击事件
                    document.getElementsByClassName('dialog-button-container')[0].getElementsByTagName("button")[0].click()
                }, randomTimeout * 1000)
            }
        })
    }, 20*1000);
})();