// ==UserScript==
// @name         【免费无套路】CSDN文库免vip付费阅读全文丨解锁复制限制
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  CSDN文库阅读全文，去除VIP登录遮挡，解锁鼠标复制文本功能
// @author       icescat
// @match        *://*.csdn.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489355/%E3%80%90%E5%85%8D%E8%B4%B9%E6%97%A0%E5%A5%97%E8%B7%AF%E3%80%91CSDN%E6%96%87%E5%BA%93%E5%85%8Dvip%E4%BB%98%E8%B4%B9%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E4%B8%A8%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/489355/%E3%80%90%E5%85%8D%E8%B4%B9%E6%97%A0%E5%A5%97%E8%B7%AF%E3%80%91CSDN%E6%96%87%E5%BA%93%E5%85%8Dvip%E4%BB%98%E8%B4%B9%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87%E4%B8%A8%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
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