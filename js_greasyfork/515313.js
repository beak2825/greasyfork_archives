// ==UserScript==
// @name         还原渐变文字为普通文本
// @namespace    http://example.com/
// @version      1.0
// @description  在 Bangumi 上将渐变颜色的文字还原为正常文本
// @include      /^https?:\/\/(bgm\.tv|chii\.in|bangumi\.tv)\/.*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515313/%E8%BF%98%E5%8E%9F%E6%B8%90%E5%8F%98%E6%96%87%E5%AD%97%E4%B8%BA%E6%99%AE%E9%80%9A%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/515313/%E8%BF%98%E5%8E%9F%E6%B8%90%E5%8F%98%E6%96%87%E5%AD%97%E4%B8%BA%E6%99%AE%E9%80%9A%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 递归函数：移除元素节点中的颜色样式
    function removeGradientText(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查元素是否有颜色样式
            if (node.style && node.style.color) {
                // 移除颜色样式
                node.style.color = '';
            }
            // 递归处理子节点
            for (let child of node.childNodes) {
                removeGradientText(child);
            }
        }
    }

    // 处理整个页面
    function processPage() {
        removeGradientText(document.body);
    }

    // 页面初次加载时执行
    processPage();

    // 监听页面的变化（例如通过 AJAX 加载的动态内容）
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                removeGradientText(node);
            });
        });
    });

    // 开始观察文档主体的节点添加
    observer.observe(document.body, { childList: true, subtree: true });
})();
