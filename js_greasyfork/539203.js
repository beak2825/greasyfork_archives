// ==UserScript==
// @name         B站播放器多余按钮移除
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  移除B站视频页面上的指定浮窗按钮
// @match        https://www.bilibili.com/video/*
// @run-at       document-end
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539203/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E5%A4%9A%E4%BD%99%E6%8C%89%E9%92%AE%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/539203/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E5%A4%9A%E4%BD%99%E6%8C%89%E9%92%AE%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要移除的按钮类名
    const targetClasses = [
        'bpx-player-ctrl-pip',
        'bpx-player-ctrl-web',
        'bpx-player-ctrl-wide'
    ];

    // 生成CSS选择器
    const selector = targetClasses.map(className =>
        `.bpx-player-ctrl-btn.${className}`
    ).join(',');

    // 删除匹配的元素
    function removeElementsBySelector(s) {
        document.querySelectorAll(s).forEach(element => {
            element.remove();
        });
    }

    // 立即删除已存在的元素
    removeElementsBySelector(selector);

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            const nodes = mutation.addedNodes;
            nodes.forEach(node => {
                if (node.matches && node.matches(selector)) {
                    node.remove();
                }
            });
        });
    });

    // 开始观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
