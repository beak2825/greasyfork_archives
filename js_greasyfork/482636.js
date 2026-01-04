// ==UserScript==
// @name        替换gravatar头像loli
// @namespace    https://blog.orii.top/
// @version      1.0.1
// @description  将gravatar头像替换为国内镜像链接，加快打开速度（更新：监视页面中的 DOM 变化）
// @author        wangtwothree
// @match *://*/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/482636/%E6%9B%BF%E6%8D%A2gravatar%E5%A4%B4%E5%83%8Floli.user.js
// @updateURL https://update.greasyfork.org/scripts/482636/%E6%9B%BF%E6%8D%A2gravatar%E5%A4%B4%E5%83%8Floli.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 MutationObserver 监听页面中的 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 在 DOM 变化中查找并替换 Gravatar 链接
            mutation.target.querySelectorAll('img[src*="gravatar.com"]').forEach(function(img) {
                img.src = img.src.replace('s.gravatar.com', 'gravatar.loli.net');
            });
        });
    });

    // 配置 MutationObserver 监听的目标及选项
    const observerConfig = { childList: true, subtree: true };

    // 启动 MutationObserver
    observer.observe(document.body, observerConfig);
})();