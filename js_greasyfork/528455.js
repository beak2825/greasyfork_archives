// ==UserScript==
// @name         GreasyFork Script Finder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取当前页面的主域名并打开 GreasyFork 查找脚本
// @author       Felix
// @license      AGPL-3.0
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/528455/GreasyFork%20Script%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/528455/GreasyFork%20Script%20Finder.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 注册菜单命令
    GM_registerMenuCommand("查找该域名的GreasyFork脚本", function() {
        // 获取当前页面的完整域名
        const domain = window.location.hostname;
 
        // 使用正则表达式提取主域名
        const mainDomain = domain.replace(/^.*\.(?:com|org|net|gov|edu|io|co|info|me|tv)(?:\.[a-z]{2,})?$/, "$&").split('.').slice(-2).join('.');
 
        // 生成 GreasyFork 搜索链接
        const url = `https://greasyfork.org/zh-CN/scripts/by-site/${mainDomain}`;
 
        // 在新标签页中打开该链接
        GM_openInTab(url, { active: true });
    });
})();
