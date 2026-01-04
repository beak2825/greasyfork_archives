// ==UserScript==
// @name         CSDN文库免vip阅读全文，解锁复制限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CSDN文库阅读全文，去除VIP登录遮罩，解锁鼠标复制功能
// @author       icescat
// @match        *://*.csdn.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489178/CSDN%E6%96%87%E5%BA%93%E5%85%8Dvip%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%EF%BC%8C%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/489178/CSDN%E6%96%87%E5%BA%93%E5%85%8Dvip%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%EF%BC%8C%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adjustArticle = () => {
        // 移除遮罩层
        document.querySelectorAll('.open, .vip').forEach(el => el.remove());

        // 展开被限制高度的内容
        const articleContainer = document.querySelector('.article-box .cont.first-show[data-v-6487a68f]');
        if (articleContainer) {
            articleContainer.style.maxHeight = 'none';
        }
    };

    // 启用复制功能
    const enableCopy = () => {
        document.body.oncopy = null;
        document.oncopy = null;
        document.querySelectorAll('*').forEach(el => {
            el.style.userSelect = 'auto';
        });
    };

    // 使用MutationObserver来监视文档的变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                adjustArticle();
                enableCopy();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载时尝试执行一次
    window.addEventListener('load', () => {
        adjustArticle();
        enableCopy();
    });
})();
