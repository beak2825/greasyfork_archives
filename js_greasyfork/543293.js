// ==UserScript==
// @name         1688商品页自动添加version参数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  当打开1688商品详情页时，自动在URL末尾添加&version=0并刷新
// @author       Your Name
// @match        *://detail.1688.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543293/1688%E5%95%86%E5%93%81%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0version%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/543293/1688%E5%95%86%E5%93%81%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0version%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
    let currentUrl = window.location.href;

    // 检查URL中是否已经包含version参数
    if (currentUrl.indexOf('version=') === -1) {
        // 检查URL中是否已经有问号(?)，决定使用&还是?连接参数
        let separator = currentUrl.indexOf('?') !== -1 ? '&' : '?';

        // 构建新的URL
        let newUrl = currentUrl + separator + 'version=0';

        // 跳转到新的URL
        window.location.href = newUrl;
    }
})();
