// ==UserScript==
// @name         屏蔽B站脑残直播网页全屏下面的礼物栏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽页面中特定ID的div元素
// @author       Subjadeites
// @match        *://*.bilibili.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/466563/%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%84%91%E6%AE%8B%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E4%B8%8B%E9%9D%A2%E7%9A%84%E7%A4%BC%E7%89%A9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/466563/%E5%B1%8F%E8%94%BDB%E7%AB%99%E8%84%91%E6%AE%8B%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E4%B8%8B%E9%9D%A2%E7%9A%84%E7%A4%BC%E7%89%A9%E6%A0%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 目标div的选择器
    var targetSelector = '#web-player__bottom-bar__container';

    // 创建一个MutationObserver实例
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            // 检查每个新增的节点是否是目标div
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (var node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches(targetSelector)) {
                        // 目标div出现时执行操作
                        node.style.display = 'none';
                    }
                }
            }
        }
    });

    // 监听整个文档的变化
    observer.observe(document, { childList: true, subtree: true });
})();