// ==UserScript==
// @name         Microsoft URL Language Switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace en-us with zh-cn in Microsoft website URLs
// @author       You
// @match        *://*.microsoft.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514773/Microsoft%20URL%20Language%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/514773/Microsoft%20URL%20Language%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL
    let currentUrl = window.location.href;

    // 检查URL中是否包含en-us
    if (currentUrl.includes('en-us')) {
        // 将en-us替换为zh-cn
        let newUrl = currentUrl.replace('en-us', 'zh-cn');
        
        // 重定向到新URL
        window.location.href = newUrl;
    }
})();