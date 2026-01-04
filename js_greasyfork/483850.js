// ==UserScript==
// @name         🔥(360和chrome均已测试)自动暂停/恢复播放视频(适用于需要边听课边做笔记+不想后台播放的场景)
// @namespace    your-namespace
// @version      1.0
// @description  鼠标离开浏览器窗口或者切换标签页自动暂停播放视频，鼠标重新激活浏览器窗口或者或者切回标签页就自动播放视频
// @license       Yolanda Morgan
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483850/%F0%9F%94%A5%28360%E5%92%8Cchrome%E5%9D%87%E5%B7%B2%E6%B5%8B%E8%AF%95%29%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E6%81%A2%E5%A4%8D%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%28%E9%80%82%E7%94%A8%E4%BA%8E%E9%9C%80%E8%A6%81%E8%BE%B9%E5%90%AC%E8%AF%BE%E8%BE%B9%E5%81%9A%E7%AC%94%E8%AE%B0%2B%E4%B8%8D%E6%83%B3%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%E7%9A%84%E5%9C%BA%E6%99%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483850/%F0%9F%94%A5%28360%E5%92%8Cchrome%E5%9D%87%E5%B7%B2%E6%B5%8B%E8%AF%95%29%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E6%81%A2%E5%A4%8D%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%28%E9%80%82%E7%94%A8%E4%BA%8E%E9%9C%80%E8%A6%81%E8%BE%B9%E5%90%AC%E8%AF%BE%E8%BE%B9%E5%81%9A%E7%AC%94%E8%AE%B0%2B%E4%B8%8D%E6%83%B3%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%E7%9A%84%E5%9C%BA%E6%99%AF%29.meta.js
// ==/UserScript==



(function() {
    var videoElement = null;
    var isPaused = false;

    // 获取所有视频元素
    function getVideoElements() {
        return document.querySelectorAll('video');
    }

    // 暂停视频播放
    function pauseVideo() {
        if (!videoElement.paused) {
            videoElement.pause();
            isPaused = true;
        }
    }

    // 恢复视频播放
    function playVideo() {
        if (isPaused) {
            videoElement.play();
            isPaused = false;
        }
    }

    // 监听鼠标移出窗口事件
    window.addEventListener('mouseout', function(event) {
        // 判断鼠标是否离开整个浏览器窗口
        if (event.toElement === null && event.relatedTarget === null) {
            var videos = getVideoElements();
            if (videos.length > 0) {
                videoElement = videos[0];
                pauseVideo();
            }
        }
    });

    // 监听鼠标移入窗口事件
    window.addEventListener('mouseover', function(event) {
        // 判断鼠标是否进入整个浏览器窗口
        if (event.fromElement === null && event.relatedTarget === null) {
            playVideo();
        }
    });
})();
