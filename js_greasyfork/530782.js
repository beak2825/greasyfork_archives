// ==UserScript==
// @name         anti-bomber
// @name:zh-CN   anti-bomber
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  爆大哈拿
// @description:zh-CN  爆大哈拿
// @match        https://blast.tv/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530782/anti-bomber.user.js
// @updateURL https://update.greasyfork.org/scripts/530782/anti-bomber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏匹配的元素
    function hideElements() {
        const elements = document.querySelectorAll('.flex.items-center.justify-center.gap-2');
        elements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideElements);
    } else {
        hideElements();
    }

    // 创建MutationObserver来监视DOM变化
    const observer = new MutationObserver((mutations) => {
        let shouldHide = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldHide = true;
            }
        });
        
        if (shouldHide) {
            hideElements();
        }
    });

    // 开始观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
