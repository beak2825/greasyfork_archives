// ==UserScript==
// @name        49直接跳packname页
// @namespace   https://greasyfork.org/users/1284284
// @version     3.0
// @description 49游戏链接直接跳packname页
// @run-at       document-start
// @match           https://a.4399.cn/mobile/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/491767/49%E7%9B%B4%E6%8E%A5%E8%B7%B3packname%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/491767/49%E7%9B%B4%E6%8E%A5%E8%B7%B3packname%E9%A1%B5.meta.js
// ==/UserScript==

// 获取当前URL
var currentUrl = window.location.href;

// 如果当前URL包含https://a.4399.cn/mobile/
if (currentUrl.includes('https://a.4399.cn/mobile/') && currentUrl.includes('.html') && !currentUrl.includes('search.html')) {
    // 提取mobile/和.html之间的字符
    var gameId = currentUrl.match(/\/mobile\/(.*?)\.html/)[1];
    
    // 构建新的URL
    var newUrl = " https://dl.yxhapi.com/android/box/game/v6.2/apk.html?id="+gameId;

    // 访问新的URL
    window.location.href = newUrl;
} else {
    console.log("当前链接不符合要求");
}