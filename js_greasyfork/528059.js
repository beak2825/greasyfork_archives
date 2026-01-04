// ==UserScript==
// @name         UC网盘直链转换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  绕过UC网盘客户端强制转存，直接生成直链下载地址
// @author       xiaoxiongweihu
// @match        *://drive.uc.cn/s/*
// @icon         https://drive.uc.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528059/UC%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/528059/UC%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面URL
    const currentUrl = window.location.href;

    // 替换域名部分
    const newUrl = currentUrl.replace('drive.uc.cn', 'fast.uc.cn');

    // 立即跳转到新地址（保留路径参数）
    if (currentUrl !== newUrl) {
        window.location.replace(newUrl);
    }
})();
