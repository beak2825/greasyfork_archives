// ==UserScript==
// @name         B站png表情包
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在网页打开B站webp的表情包时，自动改为png表情包
// @license      MIT
// @author       LetMeFork
// @match        https://i0.hdslb.com/bfs/garb/*
// @icon         http://bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480764/B%E7%AB%99png%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/480764/B%E7%AB%99png%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

(function() {

// 获取当前页面的URL
var currentUrl = window.location.href;

// 检查URL中是否包含"@"
if (currentUrl.includes("@")) {
    // 查找"@"的位置
    var atIndex = currentUrl.indexOf("@");

    // 删除"@"及其后面的字符
    var newUrl = currentUrl.substring(0, atIndex);

    // 重定向到新的URL
    window.location.href = newUrl;
}
})();