// ==UserScript==
// @name         Redirect Unity China to Unity3D
// @namespace    http://creationwong.xyz
// @version      1.1
// @description  将 *.unity.cn 页面重定向到 unity3d.com
// @author       creationwong
// @match        https://*.unity.cn/*
// @license      EPL
// @downloadURL https://update.greasyfork.org/scripts/537812/Redirect%20Unity%20China%20to%20Unity3D.user.js
// @updateURL https://update.greasyfork.org/scripts/537812/Redirect%20Unity%20China%20to%20Unity3D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const newUrl = 'https://unity3d.com'
        + window.location.pathname
        + window.location.search
        + window.location.hash;

    // 创建提示条
    const notice = document.createElement('div');
    notice.style.position = 'fixed';
    notice.style.top = '0';
    notice.style.left = '0';
    notice.style.width = '100%';
    notice.style.backgroundColor = '#4CAF50';
    notice.style.color = '#fff';
    notice.style.textAlign = 'center';
    notice.style.padding = '10px 0';
    notice.style.zIndex = '9999';
    notice.style.fontFamily = 'Arial, sans-serif';
    notice.style.fontSize = '16px';
    notice.textContent = '正在跳转到 unity3d.com...';

    document.body.prepend(notice);

    setTimeout(() => {
        window.location.href = newUrl;
    }, 1000);
})();