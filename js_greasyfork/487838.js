// ==UserScript==
// @name         B站直播去除马赛克（游戏区ID和聊天框）
// @namespace    https://greasyfork.org/users/1259036
// @version      1.1
// @description  去除马游戏区直播间 ID和聊天框 的马赛克
// @author       鱼踪
// @match        live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487838/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B%EF%BC%88%E6%B8%B8%E6%88%8F%E5%8C%BAID%E5%92%8C%E8%81%8A%E5%A4%A9%E6%A1%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/487838/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B%EF%BC%88%E6%B8%B8%E6%88%8F%E5%8C%BAID%E5%92%8C%E8%81%8A%E5%A4%A9%E6%A1%86%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //找到页面上的元素
    setTimeout(function(){
        document.getElementsByClassName("web-player-module-area-mask")[0].remove()
    },2000)

})();