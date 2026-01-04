// ==UserScript==
// @name        丝法兰 cookie 复制
// @namespace   Violentmonkey Scripts
// @match       https://www.sephora.com/**/*
// @grant       GM_setClipboard
// @version     1.0
// @author      -
// @description 2024/3/1 15:48:57
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488676/%E4%B8%9D%E6%B3%95%E5%85%B0%20cookie%20%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/488676/%E4%B8%9D%E6%B3%95%E5%85%B0%20cookie%20%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 创建按钮
    var button = document.createElement('button');
    button.textContent = '复制Cookies';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';

    // 点击按钮复制Cookies
    button.onclick = function() {
      GM_setClipboard(document.cookie)
      showToast('复制成功')
    };

    // 将按钮添加到页面上
    document.body.appendChild(button);


  function showToast(message) {
        var toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '60px'; // 稍微高于按钮
        toast.style.left = 'calc(50% - 48px)';
        toast.style.padding = '10px 20px';
        toast.style.border = 'none';
        toast.style.borderRadius = '5px';
        toast.style.backgroundColor = '#323232';
        toast.style.color = 'white';
        toast.style.zIndex = '10001';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';

        document.body.appendChild(toast);

        // 渐显
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);

        // 持续3秒后消失
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 500); // 完全消失后移除元素
        }, 3000);
    }
})();


