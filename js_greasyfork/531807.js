// ==UserScript==
// @name         YouTube Shorts Auto Next & Stop Loop
// @namespace    https://www.example.com
// @version      2.0
// @description  停止 YouTube Shorts 循环播放，并自动播放下一个短视频
// @author       松
// @match        https://www.youtube.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531807/YouTube%20Shorts%20Auto%20Next%20%20Stop%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/531807/YouTube%20Shorts%20Auto%20Next%20%20Stop%20Loop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("YouTube Shorts Auto Next & Stop Loop 脚本已启动");

    // 监听 DOM 变化，确保适配 YouTube UI 变化
    const observe = (fn, e = document.body, config = { attributes: 1, childList: 1, subtree: 1 }) => {
        const observer = new MutationObserver(fn);
        observer.observe(e, config);
        return () => observer.disconnect();
    };

    // 停止 Shorts 自动循环 & 监听视频播放结束
    function stopLoopAndAutoNext() {
        if (!location.pathname.startsWith('/shorts/')) return;

        document.querySelectorAll('video').forEach(video => {
            video.loop = false;  // 禁止循环播放

            if (!video.dataset.autoNextHandled) {
                video.dataset.autoNextHandled = "true";  // 避免重复监听

                video.addEventListener("ended", () => {
                    console.log("视频播放结束，跳转到下一个...");
                    goToNextShort();
                });

                console.log("已监听视频播放结束事件");
            }
        });
    }

    // 播放下一个 Shorts 视频
    function goToNextShort() {
    let nextButton = document.querySelector('button[aria-label="下一个视频"]') ||
                     document.querySelector('button[aria-label="Next"]') ||
                     document.querySelector('button[aria-label="下一个"]');

    if (nextButton) {
        console.log("找到‘下一个视频’按钮，点击");
        nextButton.click();
    } else {
        console.log("未找到‘下一个视频’按钮，尝试模拟键盘操作");
        document.dispatchEvent(new KeyboardEvent('keydown', { key: "ArrowDown", keyCode: 40, bubbles: true }));
    }
}

    // 监听 URL 变化，确保每个 Shorts 都能正确触发
    function observeURLChange() {
        let lastURL = location.href;

        setInterval(() => {
            if (location.href !== lastURL) {
                lastURL = location.href;
                console.log("检测到新视频，等待播放...");
                setTimeout(stopLoopAndAutoNext, 2000);
            }
        }, 1000);
    }

    // 启动监听
    observe(stopLoopAndAutoNext);
    observeURLChange();

})();

