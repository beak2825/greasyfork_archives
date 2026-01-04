// ==UserScript==
// @name         网页版酷安自动跳转UWP版酷安
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  打开酷安网页时自动调用酷安 UWP
// @license      MIT
// @match        https://www.coolapk.com/*
// @match        https://www.coolapk1s.com/*
// @grant        none
// @icon         https://static.coolapk.com/static/web/v8/img/under_logo.png
// @downloadURL https://update.greasyfork.org/scripts/546545/%E7%BD%91%E9%A1%B5%E7%89%88%E9%85%B7%E5%AE%89%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACUWP%E7%89%88%E9%85%B7%E5%AE%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546545/%E7%BD%91%E9%A1%B5%E7%89%88%E9%85%B7%E5%AE%89%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACUWP%E7%89%88%E9%85%B7%E5%AE%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 避免重复执行：只跳转一次
    if (sessionStorage.getItem("coolapk-uwp-opened")) {
        return;
    }
    sessionStorage.setItem("coolapk-uwp-opened", "1");

    const path = location.pathname;   // 例如 /feed/12345
    const uwpUrl = "coolmarket://" + path;

    // 用 <a> 标签触发 scheme
    const link = document.createElement("a");
    link.href = uwpUrl;
    link.style.display = "none";
    document.body.appendChild(link);

    // 模拟点击
    link.click();
})();
