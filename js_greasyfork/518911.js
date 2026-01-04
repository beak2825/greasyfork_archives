// ==UserScript==
// @name         优化后的5倍速静音刷课
// @namespace    http://tampermonkey.net/
// @version      V1.2.1
// @description  国资e学、链工宝网页版，5倍速静音安全刷课，失焦不停止，优化运行时页面弹出问题
// @author       大苍狗orz
// @match        https://elearning.tcsasac.com/*
// @match        https://www.lgb360.com/*
// @match        *pc.lgb360.com/*
// @icon
// @grant        none
// @license      GPL
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/518911/%E4%BC%98%E5%8C%96%E5%90%8E%E7%9A%845%E5%80%8D%E9%80%9F%E9%9D%99%E9%9F%B3%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/518911/%E4%BC%98%E5%8C%96%E5%90%8E%E7%9A%845%E5%80%8D%E9%80%9F%E9%9D%99%E9%9F%B3%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    // 定义一个函数来隐藏所有的 warningBox 元素
    function hideWarningBoxes() {
        var warningBoxes = document.querySelectorAll('.warningBox');
        warningBoxes.forEach(function(box) {
            box.style.display = 'none';
        });
    }

    // 初始隐藏现有的 warningBox 元素
    hideWarningBoxes();

    // 使用MutationObserver实时监控并隐藏新添加的 warningBox 元素
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.classList.contains('warningBox')) {
                    node.style.display = 'none';
                }
            });
        });
    });

    // 配置MutationObserver的选项
    var config = { childList: true, subtree: true };

    // 启动观察器
    observer.observe(document.body, config);

    // 用于存储视频元素
    var currentVideo;

    // 定义函数用于获取视频元素并添加事件监听
    function setupVideo() {
        currentVideo = document.getElementsByTagName('video')[0];
        if (currentVideo) {
            currentVideo.addEventListener('play', function() {
                currentVideo.playbackRate = 5;
                currentVideo.muted = true;
                currentVideo.volume = 0;
            });
            currentVideo.addEventListener('pause', function() {
                // 可以在这里添加一些暂停时的处理逻辑，比如记录播放进度等
            });
            currentVideo.addEventListener('ended', function() {
                // 可以在这里添加一些播放结束时的处理逻辑，比如上报播放完成情况等
            });
        }
    }

    // 当文档加载完成且空闲时，先获取视频元素并添加事件监听
    document.addEventListener('DOMContentLoaded', function() {
        setupVideo();
    });

    // 设置定时任务来检查视频元素是否存在并隐藏warningBox元素
    setInterval(function() {
        if (!currentVideo) {
            setupVideo();
        }
        hideWarningBoxes();
    }, 1000);

})();