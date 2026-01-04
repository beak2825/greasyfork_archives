// ==UserScript==
// @name         屏蔽果核剥壳公众号弹窗
// @namespace    https://greasyfork.org/zh-CN/scripts/533670-%E5%B1%8F%E8%94%BD%E6%9E%9C%E6%A0%B8%E5%89%A5%E5%A3%B3%E5%85%AC%E4%BC%97%E5%8F%B7%E5%BC%B9%E7%AA%97
// @version      1.0
// @description  屏蔽www.ghxi.com网站的公众号关注弹窗
// @author       wjm13206
// @match        *://www.ghxi.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533670/%E5%B1%8F%E8%94%BD%E6%9E%9C%E6%A0%B8%E5%89%A5%E5%A3%B3%E5%85%AC%E4%BC%97%E5%8F%B7%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/533670/%E5%B1%8F%E8%94%BD%E6%9E%9C%E6%A0%B8%E5%89%A5%E5%A3%B3%E5%85%AC%E4%BC%97%E5%8F%B7%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 方法1：直接移除弹窗元素
    function removeDialog() {
        const dialog = document.querySelector('.gh-dialog--wrapper');
        if (dialog) {
            dialog.remove();
            console.log('已移除公众号弹窗');
        }
    }

    // 方法2：阻止弹窗显示（通过CSS隐藏）
    function hideDialogWithCSS() {
        const style = document.createElement('style');
        style.textContent = '.gh-dialog--wrapper { display: none !important; }';
        document.head.appendChild(style);
        console.log('已通过CSS隐藏公众号弹窗');
    }

    // 方法3：阻止弹窗创建（MutationObserver监听DOM变化）
    function preventDialogCreation() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('gh-dialog--wrapper')) {
                            node.remove();
                            console.log('已阻止公众号弹窗创建');
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 执行所有方法确保弹窗被屏蔽
    removeDialog();
    hideDialogWithCSS();
    preventDialogCreation();

    // 设置定时检查，防止弹窗后续出现
    setInterval(removeDialog, 1000);
})();