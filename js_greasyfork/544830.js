// ==UserScript==
// @name         AcoFork Blog 二叉树树的白丝（强行日间模式）
// @namespace    https://x.com/acoforkkk
// @version      1.9
// @description  阻止网站启用暗黑色模式，强行日间模式
// @match        https://2x.nz/*
// @match        https://www.2x.nz/*
// @match        https://blog.2b2x.cn/*
// @match        https://blog.acofork.com/*
// @grant        none
// @run-at       document-start
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/544830/AcoFork%20Blog%20%E4%BA%8C%E5%8F%89%E6%A0%91%E6%A0%91%E7%9A%84%E7%99%BD%E4%B8%9D%EF%BC%88%E5%BC%BA%E8%A1%8C%E6%97%A5%E9%97%B4%E6%A8%A1%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544830/AcoFork%20Blog%20%E4%BA%8C%E5%8F%89%E6%A0%91%E6%A0%91%E7%9A%84%E7%99%BD%E4%B8%9D%EF%BC%88%E5%BC%BA%E8%A1%8C%E6%97%A5%E9%97%B4%E6%A8%A1%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 强制设置 localStorage.theme = 'light'（防止网站读取暗色模式）
    localStorage.setItem('theme', 'light');

    // 2. 拦截 localStorage.setItem，防止后续修改
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        if (key === 'theme' && value === 'dark') {
            console.log('拦截: 阻止Storage修改为暗色模式，强制设为light');
            value = 'light';
        }
        return originalSetItem.call(this, key, value);
    };

    // 3. 强制移除 dark 类，确保DOM初始状态
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');

    // 4. 监控DOM变化，防止暗色模式被重新启用
    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (document.documentElement.classList.contains('dark')) {
                    console.log('拦截: 检测到暗色模式，强制启用日间模式');
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                }
                if (!document.documentElement.classList.contains('light')) {
                    document.documentElement.classList.add('light');
                }
            }
        });
    }).observe(document.documentElement, { attributes: true });

    // 5. 监控 Giscus 脚本加载，并修改 data-theme
    const observer = new MutationObserver((mutations, obs) => {
        const giscusScript = document.querySelector('script[src="https://giscus.app/client.js"]');
        if (giscusScript) {
            console.log('检测到 Giscus 脚本，修改 data-theme 为 noborder_light');
            giscusScript.setAttribute('data-theme', 'noborder_light');
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log('2x.nz 日间模式 + Giscus Light + Storage拦截 已启用');
})();