// ==UserScript==
// @name         GitHub 反代理访问
// @namespace    http://tampermonkey.net/ 
// @version      1.0
// @description  Automatically redirect github.com to a specified domain
// @author       学霸
// @match        https://github.com/* 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523103/GitHub%20%E5%8F%8D%E4%BB%A3%E7%90%86%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/523103/GitHub%20%E5%8F%8D%E4%BB%A3%E7%90%86%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认目标网址
    let targetDomain = 'github.xueba.xin';

    // 从本地存储读取自定义目标网址
    const customTargetDomain = localStorage.getItem('customTargetDomain');
    if (customTargetDomain) {
        targetDomain = customTargetDomain;
    }

    // 获取当前页面的URL
    const currentUrl = window.location.href;

    // 替换网址
    const newUrl = currentUrl.replace('github.com', targetDomain);

    // 如果新旧URL不同，则立即重定向到新的URL
    if (newUrl !== currentUrl) {
        window.location.replace(newUrl);
    }
})();