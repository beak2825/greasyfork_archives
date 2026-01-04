// ==UserScript==
// @name         kb直接跳packname页
// @namespace    https://greasyfork.org/users/1284284
// @version      0.1
// @description  kb游戏链接直接跳到packname页
// @author       喃哓盐主
// @run-at       document-start
// @match           https://m.3839.com/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491739/kb%E7%9B%B4%E6%8E%A5%E8%B7%B3packname%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/491739/kb%E7%9B%B4%E6%8E%A5%E8%B7%B3packname%E9%A1%B5.meta.js
// ==/UserScript==


// 获取当前URL
var currentUrl = window.location.href;

// 如果当前URL包含https://m.3839.com/a/
if (currentUrl.includes('https://m.3839.com/a/') && currentUrl.includes('.htm')) {
    // 提取a/和.htm之间的字符
    var gameId = currentUrl.match(/\/a\/(.*?)\.htm/)[1];
    
    // 构建新的URL
    var newUrl = " https://api.3839app.com/cdn/android/gameintro-home-1546-id-"+gameId
+"-packag--level-2.htm";

    // 访问新的URL
    window.location.href = newUrl;
} else {
    console.log("当前链接不符合要求");
}