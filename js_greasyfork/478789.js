// ==UserScript==
// @name    阻止研控跳转广告页
// @version     0.2
// @description 阻止 www.yankong.org 上打开新标签页（除了登录/注册链接）
// @match       https://www.yankong.org/*
// @grant       none
// @namespace https://greasyfork.org/users/1076021
// @downloadURL https://update.greasyfork.org/scripts/478789/%E9%98%BB%E6%AD%A2%E7%A0%94%E6%8E%A7%E8%B7%B3%E8%BD%AC%E5%B9%BF%E5%91%8A%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/478789/%E9%98%BB%E6%AD%A2%E7%A0%94%E6%8E%A7%E8%B7%B3%E8%BD%AC%E5%B9%BF%E5%91%8A%E9%A1%B5.meta.js
// ==/UserScript==


(function() {
    function createNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            z-index: 9999;
            border-radius: 5px;
            animation: fadeOut 5s ease-in-out forwards;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // 保存原始的 window.open 函数
    const originalWindowOpen = window.open;

    window.open = function(url, target, features) {
        // 如果是特定的登录/注册链接，正常打开新标签页
        if (url.includes('account.realmofresearch.com/login')) {
            return originalWindowOpen.apply(window, arguments);
        } else {
            // 否则，阻止打开新标签页并显示通知
            createNotification('已成功阻止新标签页打开');
        }
    };
})();

