// ==UserScript==
// @name         台湾香港转换器
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      MIT
// @description  把所有中国台湾，中国香港转换为台湾，香港
// @author       You
// @match        *://*/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487353/%E5%8F%B0%E6%B9%BE%E9%A6%99%E6%B8%AF%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/487353/%E5%8F%B0%E6%B9%BE%E9%A6%99%E6%B8%AF%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有文本节点
    function getAllTextNodes() {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }
        return textNodes;
    }

    // 替换文本节点中的内容
    function replaceTextNodes() {
        var textNodes = getAllTextNodes();
        textNodes.forEach(function(node) {
            // 替换文本内容
            node.nodeValue = node.nodeValue.replace(/中国台湾/g, '台湾');
            node.nodeValue = node.nodeValue.replace(/中国香港/g, '香港');
        });
    }

    // 初始化替换
    replaceTextNodes();

    // 监听DOM变化，实时替换新加入的文本节点
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                replaceTextNodes();
            }
        });
    });

    // 配置观察选项
    var config = { childList: true, subtree: true };

    // 开始观察
    observer.observe(document.body, config);
})();