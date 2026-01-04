// ==UserScript==
// @name         Bilibili哔哩哔哩直播删除马赛克
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the web-player-module-area-mask-panel on Bilibili live page after 5 seconds delay.
// @author       Your Name
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502939/Bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%88%A0%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/502939/Bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%88%A0%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟执行函数
    setTimeout(function() {
        // 使用querySelector查找元素
        var maskPanel = document.querySelector('#web-player-module-area-mask-panel');

        // 如果找到了元素，则移除它
        if (maskPanel) {
            maskPanel.parentNode.removeChild(maskPanel);
            console.log('移除成功！！！');
        }

        // 创建MutationObserver实例
        var observer = new MutationObserver(function(mutationsList, observer) {
            mutationsList.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    // 检查每个新添加的节点是否包含目标类
                    if (node.classList && node.classList.contains('web-player-module-area-mask-panel')) {
                        node.parentNode.removeChild(node);
                    }
                });
            });
        });

        // 配置MutationObserver
        var config = { childList: true, subtree: true };

        // 开始观察页面变化
        observer.observe(document.body, config);
    }, 5000); // 等待5秒（5000毫秒）
})();