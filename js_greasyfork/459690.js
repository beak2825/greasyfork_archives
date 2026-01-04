// ==UserScript==
// @name        在新标签页打开0x3.com链接
// @namespace   Violentmonkey Scripts
// @match       *://0x3.com/
// @grant       none
// @version     1.0.5
// @author      licheedev
// @license MIT
// @description 目前0x3.com主页搜索结果和订阅链接只能设置相同的打开方式，使用此脚本可以强制在新标签页打开链接，然后设置在当前页打开搜索结果。
// @downloadURL https://update.greasyfork.org/scripts/459690/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%800x3com%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/459690/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%800x3com%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let config = {
        childList: true,
        subtree: true
    };

    let selector = 'main ul > li > a'

    let callback = function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 遍历所有新增的节点
                for (const node of mutation.addedNodes) {
                    // 如果新增的是元素节点
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查自身是否是 ul > li > a（即直接是符合条件的 a）
                        if (node.matches && node.matches(selector)) {
                            node.target = '_blank';
                        }
                        // 检查其子树中是否有 ul > li > a
                        const links = node.querySelectorAll?.(selector) || [];
                        links.forEach(link => link.target = '_blank');
                    }
                }
            }
        }
    };

    let observer = new MutationObserver(callback);
    observer.observe(document.body, config);
})();