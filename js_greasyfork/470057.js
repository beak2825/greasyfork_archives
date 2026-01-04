// ==UserScript==
// @name         百度文库跳转文库高校版
// @namespace    https://www.lm379.cn/
// @version      1.0
// @description  将百度文库跳转到百度文库高校版，需要校园网并且你的学校拥有文库高校版使用权限
// @author       lm379
// @match        http*://wenku.baidu.com/view/*
// @icon         https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://wenku.baidu.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470057/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%B7%B3%E8%BD%AC%E6%96%87%E5%BA%93%E9%AB%98%E6%A0%A1%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/470057/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%B7%B3%E8%BD%AC%E6%96%87%E5%BA%93%E9%AB%98%E6%A0%A1%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建跳转按钮
    var button = document.createElement('button');
    button.innerHTML = '跳转文库高校版';
    button.style.position = 'fixed';
    button.style.top = '150px';
    button.style.left = '300px';
    button.style.zIndex = '9999';
    document.body.appendChild(button);

    // 点击按钮后的跳转逻辑
    button.onclick = function() {
        var currentUrl = window.location.href;
        var redirectUrl = '';

        // 判断网址结构并进行跳转
        if (currentUrl.includes('.html')) {
            redirectUrl = currentUrl.replace('.html', '');
            redirectUrl = redirectUrl.split('?')[0];
        } else if (currentUrl.includes('?aggId=')) {
            redirectUrl = currentUrl.split('?aggId=')[0];
        } else if (currentUrl.includes('?fr=')) {
            redirectUrl = currentUrl.split('?fr=')[0];
        } else if (currentUrl.includes('?_wkts_')) {
            redirectUrl = currentUrl.split('?_wkts_')[0];
        } else {
            redirectUrl = currentUrl.replace('wenku.baidu.com', 'eduai.baidu.com');
        }

        redirectUrl = redirectUrl.replace('wenku.baidu.com', 'eduai.baidu.com');

        window.location.href = redirectUrl;
    };
})();
