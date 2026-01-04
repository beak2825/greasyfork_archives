// ==UserScript==
// @name         QQ跳转链接提取器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从QQ的跳转链接中提取真实URL并直接访问
// @author       您的名字
// @match        https://c.pc.qq.com/ios.html*
// @match        *://c.pc.qq.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529766/QQ%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529766/QQ%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 获取当前URL
    var currentUrl = window.location.href;
    
    // 使用正则表达式提取url参数的值
    var urlMatch = currentUrl.match(/[?&]url=([^&]*)/);
    
    if (urlMatch && urlMatch[1]) {
        // 获取并解码目标URL
        var targetUrl = decodeURIComponent(urlMatch[1]);
        
        // 确保URL格式正确（有时可能会有多余的转义字符）
        targetUrl = targetUrl.replace(/%2F/g, '/');
        
        // 如果目标URL不是以http开头，添加https://
        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }
        
        // 重定向到目标URL
        window.location.replace(targetUrl);
    }
})();
