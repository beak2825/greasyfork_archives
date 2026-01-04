// ==UserScript==
// @name         5倍速静音刷课
// @namespace    http://tampermonkey.net/
// @version      V1.2.0
// @description  国资e学、链工宝网页版，5倍速静音安全刷课，失焦不停止
// @author       大苍狗orz
// @match        https://elearning.tcsasac.com/*
// @match        https://www.lgb360.com/*
// @match        *pc.lgb360.com/*
// @icon
// @grant        none
// @license      GPL
// @run-at doucument-end

// @downloadURL https://update.greasyfork.org/scripts/492779/5%E5%80%8D%E9%80%9F%E9%9D%99%E9%9F%B3%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/492779/5%E5%80%8D%E9%80%9F%E9%9D%99%E9%9F%B3%E5%88%B7%E8%AF%BE.meta.js
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

    // 使用 MutationObserver 实时监控并隐藏新添加的 warningBox 元素
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.classList.contains('warningBox')) {
                    node.style.display = 'none';
                }
            });
        });
    });

    // 配置 MutationObserver 的选项
    var config = { childList: true, subtree: true };

    // 启动观察器
    observer.observe(document.body, config);

    // 设置定时任务来调整视频播放速度、静音并隐藏 warningBox 元素
    setInterval(function() {
        var currentVideo = document.getElementsByTagName('video')[0];
        if (currentVideo) {
            currentVideo.playbackRate = 5;
            currentVideo.muted = true;
            currentVideo.volume = 0;
            currentVideo.play();
        }
        hideWarningBoxes();
    }, 1000);
})();