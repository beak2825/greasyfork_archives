// ==UserScript==
// @name         Gigab2b 点击时当前页打开链接强制当前页打开
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  点击产品链接时，阻止新标签，强制当前页打开
// @author       lin lin
// @match        https://www.gigab2b.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543738/Gigab2b%20%E7%82%B9%E5%87%BB%E6%97%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%E5%BC%BA%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/543738/Gigab2b%20%E7%82%B9%E5%87%BB%E6%97%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%E5%BC%BA%E5%88%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 初始绑定
    bindClickListener();

    // 监听动态加载
    const observer = new MutationObserver(bindClickListener);
    observer.observe(document.body, { childList: true, subtree: true });

    function bindClickListener() {
        const links = document.querySelectorAll('a[href*="route=product/product"]');

        links.forEach(link => {
            // 防止重复绑定
            if (link.getAttribute('data-click-bound')) return;
            link.setAttribute('data-click-bound', 'true');

            link.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = this.href;
            });
        });
    }
})();
