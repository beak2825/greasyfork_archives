// ==UserScript==
// @name         删除共创世界(CCW)个人主页的创作作品按钮
// @namespace    https://greasyfork.org/zh-CN/scripts/497965
// @version      1.1
// @description  删除共创世界(CCW)个人主页上的创作作品按钮
// @match        *://ccw.site/student/*
// @match        *://www.ccw.site/student/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497965/%E5%88%A0%E9%99%A4%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E7%9A%84%E5%88%9B%E4%BD%9C%E4%BD%9C%E5%93%81%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/497965/%E5%88%A0%E9%99%A4%E5%85%B1%E5%88%9B%E4%B8%96%E7%95%8C%28CCW%29%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E7%9A%84%E5%88%9B%E4%BD%9C%E4%BD%9C%E5%93%81%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义 MutationObserver 的回调函数
    var observerCallback = function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 检查是否存在指定的元素
                var elements = document.querySelectorAll('div.control-record-2NoqJ.action-start-bMuJy');
                if (elements && elements.length > 0) {
                    // 删除元素
                    elements.forEach(function(element) {
                        element.remove();
                    });
                    // 停止监听
                    observer.disconnect();
                    break;
                }
            }
        }
    };

    // 创建 MutationObserver 实例
    var observer = new MutationObserver(observerCallback);

    // 配置 MutationObserver 监听的选项
    var observerConfig = {
        childList: true, // 监听子节点的变化
        subtree: true, // 监听所有后代节点的变化
    };

    // 开始监听
    observer.observe(document.body, observerConfig);
})();