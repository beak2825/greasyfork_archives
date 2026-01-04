// ==UserScript==
// @name         strava训练日志解锁
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解锁strava网站PC版训练日志的弹窗
// @author       芬达泡泡
// @match        https://www.strava.com/*
// @grant        none
// @license      GPL Licence
// @downloadURL https://update.greasyfork.org/scripts/510881/strava%E8%AE%AD%E7%BB%83%E6%97%A5%E5%BF%97%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/510881/strava%E8%AE%AD%E7%BB%83%E6%97%A5%E5%BF%97%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的 <style> 元素
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        body {
            overflow: visible !important; /* 强制覆盖所有 overflow 属性 */
        }
    `;

    // 将 style 元素添加到 <head> 中
    document.head.appendChild(style);

})();


(function() {
    'use strict';

    // 创建一个函数来移除所有 reach-portal 标签
    function removeReachPortalElements() {
        const portals = document.querySelectorAll('reach-portal'); // 选择所有 reach-portal 元素
        portals.forEach(portal => {
            portal.remove(); // 移除每个找到的元素
        });
    }

    // 监听页面的 DOM 变化，确保动态加载的 reach-portal 也会被移除
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeReachPortalElements(); // 当有新元素插入时，重新检查并移除 reach-portal
            }
        });
    });

    // 开始监听整个页面的 DOM 变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始加载时调用一次
    removeReachPortalElements();
})();