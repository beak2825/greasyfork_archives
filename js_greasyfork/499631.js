// ==UserScript==
// @name         cnblogs 博客园自动展开所有代码
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击博客园代码块的展开加号
// @author       GeBron
// @match        *://www.cnblogs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499631/cnblogs%20%E5%8D%9A%E5%AE%A2%E5%9B%AD%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/499631/cnblogs%20%E5%8D%9A%E5%AE%A2%E5%9B%AD%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%89%80%E6%9C%89%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function expandCode() {
        // 查找所有折叠状态的加号图标
        const expandButtons = document.querySelectorAll('.code_img_closed');
        if (expandButtons.length > 0) {
            expandButtons.forEach(btn => {
                // 触发点击事件
                btn.click();
                // 修改类名防止重复点击（可选）
                btn.classList.replace('code_img_closed', 'code_img_opened');
            });
        }
    }

    // 1. 页面加载后立即尝试一次
    window.addEventListener('load', expandCode);

    // 2. 使用定时器处理异步加载的情况（每2秒检查一次，持续5次）
    let count = 0;
    const timer = setInterval(() => {
        expandCode();
        count++;
        if (count > 5) clearInterval(timer);
    }, 2000);

    // 3. 监听简单的滚动，触发检查
    window.addEventListener('scroll', expandCode, { once: false });
})();