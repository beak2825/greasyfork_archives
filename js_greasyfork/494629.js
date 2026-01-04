// ==UserScript==
// @name         tryOutView2
// @namespace    http://tampermonkey.net/
// @version      2024-05-11
// @description  get try out
// @author       m
// @match        *://ai.goviewlink.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/494629/tryOutView2.user.js
// @updateURL https://update.greasyfork.org/scripts/494629/tryOutView2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('try out On!')
    // 创建一个MutationObserver实例
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList.contains('n-modal-container')) {
                        node.parentNode.removeChild(node);
                    }
                });
            }
        });
    });

    // 配置MutationObserver，监听子节点变化
    var config = { childList: true };

    // 开始观察页面上的变化
    observer.observe(document.body, config);
    // Your code here...
})();