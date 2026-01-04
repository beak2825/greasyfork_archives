// ==UserScript==
// @name         新标签页打开（YouTube、Twitter、Facebook、知乎、百度等动态加载网站）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  让所有链接都在新标签页打开，同时原页面不会变化
// @match        *://*/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/526075/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88YouTube%E3%80%81Twitter%E3%80%81Facebook%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E7%99%BE%E5%BA%A6%E7%AD%89%E5%8A%A8%E6%80%81%E5%8A%A0%E8%BD%BD%E7%BD%91%E7%AB%99%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526075/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88YouTube%E3%80%81Twitter%E3%80%81Facebook%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E7%99%BE%E5%BA%A6%E7%AD%89%E5%8A%A8%E6%80%81%E5%8A%A0%E8%BD%BD%E7%BD%91%E7%AB%99%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function openInNewTab(event) {
        const link = event.target.closest('a');  // 找到点击的链接
        if (link && link.href && !link.hasAttribute('target')) {
            event.preventDefault();  // 阻止默认行为
            event.stopPropagation(); // 阻止事件冒泡，避免内部 JS 触发跳转
            setTimeout(() => {
                window.open(link.href, '_blank');  // 在新标签页打开链接
            }, 50); // 延迟执行，确保兼容
        }
    }

    function observeLinks() {
        document.addEventListener('click', openInNewTab, true);
    }

    observeLinks(); // 监听整个页面点击事件
})();
