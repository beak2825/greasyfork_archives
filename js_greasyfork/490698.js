// ==UserScript==
// @name         智慧课堂
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @description  课程回放前进后退、空格暂停
// @author       haku
// @match        http://10.20.11.166:88/ve/back/*
// @match        https://d.buaa.edu.cn/http-88/77726476706e69737468656265737421a1a70fce777e39013059dffa/ve/back/*
// @match        http://classroom.msa.buaa.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=11.166
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490698/%E6%99%BA%E6%85%A7%E8%AF%BE%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/490698/%E6%99%BA%E6%85%A7%E8%AF%BE%E5%A0%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义删除水印元素的函数
    function removeWatermarks() {
        // 查找并删除 class="jyd-live-waterMark" 的元素
        document.querySelectorAll('.jyd-live-waterMark').forEach(el => el.remove());

        // 查找并删除 class="jyd-waterMark" 的元素
        document.querySelectorAll('.jyd-waterMark').forEach(el => el.remove());

        // 查找并删除 class="expand-mask" 的元素
        document.querySelectorAll('.expand-mask').forEach(el => el.remove());

    }

    // 在页面加载完成时运行一次
    window.addEventListener('load', removeWatermarks);

    // 如果页面可能动态加载内容，可以定期检查
    const observer = new MutationObserver(removeWatermarks);
    observer.observe(document.body, { childList: true, subtree: true });



document.addEventListener('keydown', function(event) {
    var videos = document.querySelectorAll('video'); // 获取页面上所有视频元素
    var currentTime, video;

    videos.forEach(function(vid) {
        currentTime = vid.currentTime; // 获取当前视频播放时间
        if (event.key === 'ArrowLeft') {
            // 如果按下左箭头键，则将视频时间向后退10秒
            vid.currentTime = Math.max(0, currentTime - 10);
        } else if (event.key === 'ArrowRight') {
            // 如果按下右箭头键，则将视频时间向前进10秒
            vid.currentTime += 10;
        } else if (event.key === ' ') {
            // 如果按下空格键，则暂停或播放视频
            if (vid.paused) {
                vid.play();
            } else {
                vid.pause();
            }
        }
    });
});

})();