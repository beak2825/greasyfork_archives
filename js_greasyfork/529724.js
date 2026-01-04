// ==UserScript==
// @name         抖音元素屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  隐藏购物车;隐藏热榜
// @author       AI
// @match        *://*.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529724/%E6%8A%96%E9%9F%B3%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/529724/%E6%8A%96%E9%9F%B3%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔹 屏蔽购物车图标的容器
    const hideShoppingCartDiv = () => {
        const divsWithSvg = document.querySelectorAll('div');
        divsWithSvg.forEach(div => {
            const cartSvg = div.querySelector('svg[width="28"][height="28"]');
            if (cartSvg) {
                let targetDiv = cartSvg;
                for (let i = 0; i < 4 && targetDiv; i++) {
                    targetDiv = targetDiv.parentElement;
                    if (!targetDiv || targetDiv.tagName !== 'DIV') break;
                }
                if (targetDiv) {
                    targetDiv.style.display = 'none';
                }
            }
        });
    };

    // 🔸 新增：隐藏搜索热榜前的那个兄弟 div
    const hideSearchHotPreviousDiv = () => {
        const hotDiv = document.querySelector('div[data-e2e="search-hot-container"]');
        if (hotDiv && hotDiv.previousElementSibling && hotDiv.previousElementSibling.tagName === 'DIV') {
            hotDiv.previousElementSibling.style.display = 'none';
        }
    };

    // 🧹 总清理函数
    const cleanUp = () => {
        hideShoppingCartDiv();
        hideSearchHotPreviousDiv();
    };

    // 使用 MutationObserver 监控动态内容加载
    const observer = new MutationObserver(cleanUp);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后也执行一次
    window.addEventListener('load', cleanUp);
    if (document.readyState === 'complete') {
        cleanUp();
    }

})();
