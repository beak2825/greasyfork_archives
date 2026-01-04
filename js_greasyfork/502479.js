// ==UserScript==
// @name         按下0键重置视频
// @namespace    http://tampermonkey.net/
// @version      2024年8月29日23点12分
// @description  按下数字0键时，将页面上的所有视频重置到开头
// @author       onionycs
// @match        https://www.bilibili.com/*
// @match        https://www.mashibing.com/*
// @match        https://live.shixiseng.com/review/*
// @match        https://video.51job.com/watch/*
// @match        https://www.acwing.com/video/*
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502479/%E6%8C%89%E4%B8%8B0%E9%94%AE%E9%87%8D%E7%BD%AE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/502479/%E6%8C%89%E4%B8%8B0%E9%94%AE%E9%87%8D%E7%BD%AE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 推荐安装，https://greasyfork.org/zh-CN/scripts/390792-b站封面替换右侧广告-bilibili-哔哩哔哩


    /* globals jQuery, $, waitForKeyElements */
    // 监听键盘按下事件
    document.addEventListener('keydown', function(event) {
        // 检查按下的键是否是数字0（注意：这里不区分大小写，但数字键通常没有大小写）
        if (event.key === '0') {
            // 显示确认对话框
            if (confirm('确定要将所有视频重置到开头吗？')) {
                // 获取页面上所有的video标签
                const videos = document.querySelectorAll('video');

                // 遍历每个video标签，并将其currentTime设置为0
                videos.forEach(video => {
                    video.currentTime = 0;
                    video.pause();
                    // 如果需要，可以在这里添加额外的逻辑，比如暂停或播放视频
                });
                alert("已退回开头，空格键播放")
            }

        }

         if (event.key === 'k'||event.key === 'K') {
             const videos = document.querySelectorAll('video');
             videos.forEach(video => {
                 // 如果视频当前是暂停的，则播放；如果是播放的，则暂停
                 if (video.paused) {
                     video.play();
                 } else {
                     video.pause();
                 }
             });
         }

        if (event.key === 'j'||event.key === 'J') {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.currentTime -= 10;
            });
        }

        if (event.key === 'l'||event.key === 'L') {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.currentTime += 10;
            });
        }

        if (event.key === 't'||event.key === 'T') {
            const buttons = $('.bpx-player-ctrl-wide').toArray();
            buttons.forEach(button => {
                button.click();
            });
        }
    });
})();