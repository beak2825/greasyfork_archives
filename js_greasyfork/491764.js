// ==UserScript==
// @name         vivo直接跳packname页
// @namespace    https://greasyfork.org/users/1284284
// @version      0.1
// @description    vivo游戏链接直接跳packname页
// @author       喃哓盐主
// @run-at       document-start
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491764/vivo%E7%9B%B4%E6%8E%A5%E8%B7%B3packname%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/491764/vivo%E7%9B%B4%E6%8E%A5%E8%B7%B3packname%E9%A1%B5.meta.js
// ==/UserScript==


// 获取当前URL
var currentUrl = window.location.href;

// 如果当前URL包含https://game.vivo.com.cn/#/detail/和/?source
if (currentUrl.includes('https://game.vivo.com.cn/#/detail/') && currentUrl.includes('/?source')) {
   
    
    // 构建新的URL
    var newUrl = currentUrl.replace('https://game.vivo.com.cn/#/detail/', 'https://game.vivo.com.cn/api/game/getDetail?id=').replace('/?source', '&?source');

    // 访问新的URL
    window.location.href = newUrl;
} else {
    console.log("当前链接不符合要求");
}