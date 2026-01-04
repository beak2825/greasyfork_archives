// ==UserScript==
// @name         台湾香港转换器性能优化版
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @license      MIT
// @description  把所有中国台湾，中国香港转换为台湾，香港
// @author       You
// @match        *://*/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487364/%E5%8F%B0%E6%B9%BE%E9%A6%99%E6%B8%AF%E8%BD%AC%E6%8D%A2%E5%99%A8%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/487364/%E5%8F%B0%E6%B9%BE%E9%A6%99%E6%B8%AF%E8%BD%AC%E6%8D%A2%E5%99%A8%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换文本内容的函数
    function replaceTextContent(node) {
        node.nodeValue = node.nodeValue.replace(/中国台湾/g, '台湾');
        node.nodeValue = node.nodeValue.replace(/中国香港/g, '香港');
    }

    // 遍历并替换所有文本节点
    function traverseAndReplace(node) {
        if (node.nodeType === 3) {
            // 文本节点
            replaceTextContent(node);
        } else if (node.nodeType === 1) {
            // 元素节点
            for (var i = 0; i < node.childNodes.length; i++) {
                traverseAndReplace(node.childNodes[i]);
            }
        }
    }

    // 替换初始文本
    traverseAndReplace(document.body);

    // 监听DOM变化，实时替换新加入的文本节点
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(addedNode) {
                    traverseAndReplace(addedNode);
                });
            }
        });
    });

    // 配置观察选项
    var config = { childList: true, subtree: true };

    // 开始观察
    observer.observe(document.body, config);
})();