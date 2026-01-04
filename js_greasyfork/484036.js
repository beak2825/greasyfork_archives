// ==UserScript==
// @name         chatgpt官方gpts跳转到x.liaox.ai脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  根据条件跳转页面
// @author       everr
// @match        https://chat.openai.com/g/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484036/chatgpt%E5%AE%98%E6%96%B9gpts%E8%B7%B3%E8%BD%AC%E5%88%B0xliaoxai%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/484036/chatgpt%E5%AE%98%E6%96%B9gpts%E8%B7%B3%E8%BD%AC%E5%88%B0xliaoxai%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前地址栏的URL
    var currentUrl = window.location.href;

    // 检查是否匹配指定条件的URL
    if (currentUrl.startsWith("https://chat.openai.com/g/")) {
        // 构建新的URL
        var newUrl = currentUrl.replace("https://chat.openai.com/g/", "https://x.liaox.ai/g/");

        // 跳转到新的URL
        window.location.href = newUrl;
    }
})();
