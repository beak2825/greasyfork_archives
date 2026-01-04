// ==UserScript==
// @name         站内搜索 | Google Site Search Enhanced 
// @namespace    leftyzzk.googlesitesearch
// @version      0.2
// @description  用 google 在当前网站内搜索 | Add buttons to search base domain or full domain on Google
// @author       leftyzzk
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531891/%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2%20%7C%20Google%20Site%20Search%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/531891/%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2%20%7C%20Google%20Site%20Search%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册两个命令面板按钮
    GM_registerMenuCommand("Google搜索基础域名", searchBaseDomain);
    GM_registerMenuCommand("Google搜索完整域名", searchFullDomain);

    // 获取基础域名的函数
    function getBaseDomain(domain) {
        // 移除www前缀
        if(domain.startsWith('www.')) {
            domain = domain.substring(4);
        }

        // 获取主域名（例如：从 sub.example.com 获取 example.com）
        let parts = domain.split('.');
        if(parts.length > 2) {
            return parts.slice(-2).join('.');
        }
        return domain;
    }

    // 搜索基础域名
    function searchBaseDomain() {
        let currentDomain = window.location.hostname;
        let baseDomain = getBaseDomain(currentDomain);
        let googleUrl = `https://www.google.com/search?q=site:${baseDomain}`;
        window.location.href = googleUrl;
    }

    // 搜索完整域名
    function searchFullDomain() {
        let fullDomain = window.location.hostname;
        let googleUrl = `https://www.google.com/search?q=site:${fullDomain}`;
        window.location.href = googleUrl;
    }
})();