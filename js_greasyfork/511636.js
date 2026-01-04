// ==UserScript==
// @name         bilibili-Ignored
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽正在观看人数、弹幕数量。Detect specific HTML code and comment it out.
// @author       You
// @match        *://*.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511636/bilibili-Ignored.user.js
// @updateURL https://update.greasyfork.org/scripts/511636/bilibili-Ignored.meta.js
// ==/UserScript==

// 使用 MutationObserver 观察 DOM 变化
const observer = new MutationObserver(() => {
    // 找到父级目标元素
    let parentTarget = document.querySelector('.bpx-player-sending-bar .bpx-player-video-info');

    if (parentTarget) {
        // 定义要注释掉的三个子元素的选择器
        const classes = [
            '.bpx-player-video-info-online',
            '.bpx-player-video-info-divide',
            '.bpx-player-video-info-dm'
        ];

        // 遍历每个选择器并注释掉相应的元素
        classes.forEach(function(className) {
            let element = parentTarget.querySelector(className);

            if (element) {
                let comment = document.createComment(element.outerHTML);
                element.replaceWith(comment);  // 用注释替换元素
            }
        });

        observer.disconnect();  // 找到后停止观察
    }
});

// 开始观察文档中的变化
observer.observe(document, { childList: true, subtree: true });
