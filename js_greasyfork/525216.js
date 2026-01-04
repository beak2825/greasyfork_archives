// ==UserScript==
// @name         rule4video移除广告
// @namespace    http://tampermonkey.net/
// @version      2025-01-29
// @description  ttt
// @author       You
// @match        https://rule34video.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34video.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525216/rule4video%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/525216/rule4video%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==



(function () {
    'use strict';

    // 过滤函数
    function filterVideos() {
        // 获取id为custom_list_videos_most_recent_videos_items的div元素
        const parentDiv = document.getElementById('custom_list_videos_most_recent_videos_items');

        if (parentDiv) {
            // 获取parentDiv的所有子div元素
            const childDivs = parentDiv.querySelectorAll('div');

            childDivs.forEach(childDiv => {
                // 检查子div是否包含header标签
                const header = childDiv.querySelector('header');

                if (header) {
                    // 如果包含header标签，则移除该子div
                    childDiv.remove();
                }
            });
        }
    }

    // 初始执行一次
    filterVideos();

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            // 检查是否有节点被添加
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 重新执行过滤逻辑
                filterVideos();
            }
        });
    });

    // 开始观察整个文档的变化
    observer.observe(document.body, {
        childList: true, // 观察子节点的变化
        subtree: true,   // 观察所有后代节点
    });
})();