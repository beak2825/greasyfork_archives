// ==UserScript==
// @name         NodeSeek关闭外部跳转提醒
// @namespace    https://greasyfork.org/zh-CN/scripts/476472
// @version      1.2
// @description  取 "jump?to=" 后网址替换原URL实现关闭跳转提醒
// @author       endercat
// @license MIT
// @match        *://*.nodeseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476472/NodeSeek%E5%85%B3%E9%97%AD%E5%A4%96%E9%83%A8%E8%B7%B3%E8%BD%AC%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/476472/NodeSeek%E5%85%B3%E9%97%AD%E5%A4%96%E9%83%A8%E8%B7%B3%E8%BD%AC%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成后运行脚本
    window.addEventListener('load', function() {
        // 获取所有包含 "jump?to=" 的链接
        var links = document.querySelectorAll('a[href*="jump?to="]');

        // 遍历每个链接并修改它们
        links.forEach(function(link) {
            // 获取链接的原始URL
            var originalUrl = link.href;

            // 使用正则表达式匹配 "jump?to=" 后面的部分，并替换为对应的URL
            var match = originalUrl.match(/.*jump\?to=([^&]*)/);

            if (match && match[1]) {
                // 进行额外的URL合法性检查
                var modifiedUrl = decodeURIComponent(match[1]);

                if (isValidUrl(modifiedUrl)) {
                    // 修改链接的href属性
                    link.href = modifiedUrl;
                }
            }
        });

        // 试图修复XXS漏洞
        function isValidUrl(url) {
            // 返回 true 表示合法，false 表示非法
            // 检查是否以 "http" 或 "https" 开头
            return /^https?:\/\//.test(url);
        }
    });
})();