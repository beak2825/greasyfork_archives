// ==UserScript==
// @name         Linux.do - 移除全局公告栏
// @namespace    https://linux.do/
// @version      1.0
// @description  移除Linux.do网站上class为global-notice的公告栏
// @author       Dahi
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538535/Linuxdo%20-%20%E7%A7%BB%E9%99%A4%E5%85%A8%E5%B1%80%E5%85%AC%E5%91%8A%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/538535/Linuxdo%20-%20%E7%A7%BB%E9%99%A4%E5%85%A8%E5%B1%80%E5%85%AC%E5%91%8A%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除全局公告栏函数
    function removeGlobalNotice() {
        // 使用更精确的选择器，避免误删
        const notice = document.querySelector('div.global-notice');
        if (notice) {
            notice.remove();
            console.log('已移除Linux.do全局公告栏');
        }
    }

    // 使用MutationObserver监控DOM变化
    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // 检查新增节点中是否包含公告栏
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('global-notice')) {
                            node.remove();
                        } else if (node.querySelector('div.global-notice')) {
                            removeGlobalNotice();
                        }
                    }
                }
            }
        }
    });

    // 初始执行
    removeGlobalNotice();

    // 开始观察文档变化
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 页面完全加载后再检查一次
    window.addEventListener('load', removeGlobalNotice);

    // 清理observer
    window.addEventListener('unload', function() {
        observer.disconnect();
    });

    // 针对Turbolinks等PJAX导航的页面
    document.addEventListener('turbolinks:load', removeGlobalNotice);
    document.addEventListener('pjax:complete', removeGlobalNotice);
})();