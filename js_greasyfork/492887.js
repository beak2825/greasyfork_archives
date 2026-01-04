// ==UserScript==
// @name         Sticky Element Modifier
// @namespace    https://bestdori.com/
// @version      0.1
// @description  Make the next element of StoryViewer sticky with a specific background color on bestdori.com/tool/storyviewer/
// @match        https://bestdori.com/tool/storyviewer/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/492887/Sticky%20Element%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/492887/Sticky%20Element%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个观察器实例
    const observer = new MutationObserver(function(mutations) {
        // 遍历所有的变化
        for (let mutation of mutations) {
            // 检查是否有新的节点被添加
            if (mutation.addedNodes) {
                // 遍历所有的新增节点
                for (let node of mutation.addedNodes) {
                    // 检查是否是我们关心的节点
                    if (node.id === 'StoryViewer') {
                        // 获取StoryViewer元素的下一个兄弟元素
                        const nextElement = node.nextElementSibling;

                        // 将下一个元素修改为吸顶，并设置背景颜色
                        nextElement.style.position = 'sticky';
                        nextElement.style.top = '52px';
                        nextElement.style.backgroundColor = 'var(--color-background)';
                        nextElement.style.zIndex = '9999';

                        // 结束循环
                        return;
                    }
                }
            }
        }
    });

    // 配置观察器：观察目标节点的子节点或后代节点的变化
    const config = { childList: true, subtree: true };

    // 开始观察document
    observer.observe(document, config);
})();
