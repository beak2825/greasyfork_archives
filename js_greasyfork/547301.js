// ==UserScript==
// @name         自動轉址腳本（My Redirects 公司用）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  根據自訂規則自動轉址指定網址
// @author       shanlan(ChatGPT 4.1)
// @match        https://zh.m.wikipedia.org/*
// @match        https://ccs.login.microsoftonline.com/ccs/common/oauth2/logout*
// @match        https://login.microsoftonline.com/common/oauth2/logout*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547301/%E8%87%AA%E5%8B%95%E8%BD%89%E5%9D%80%E8%85%B3%E6%9C%AC%EF%BC%88My%20Redirects%20%E5%85%AC%E5%8F%B8%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547301/%E8%87%AA%E5%8B%95%E8%BD%89%E5%9D%80%E8%85%B3%E6%9C%AC%EF%BC%88My%20Redirects%20%E5%85%AC%E5%8F%B8%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 轉址規則設定
    const url = location.href;

    if (url.startsWith('https://zh.m.wikipedia.org/')) {
        location.replace(url.replace('zh.m.wikipedia.org', 'zh.wikipedia.org'));
    } else if (url.startsWith('https://ccs.login.microsoftonline.com/ccs/common/oauth2/logout')) {
        location.replace('https://outlook.office365.com');
    } else if (url.startsWith('https://login.microsoftonline.com/common/oauth2/logout')) {
        location.replace('https://outlook.office365.com');
    }
})();