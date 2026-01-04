// ==UserScript==
// @name         Steam 免费游戏永久入库脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  [自制]Steam 免费游戏永久入库脚本，搭配其他脚本使用
// @author       nut-cj
// @license      MIT
// @match        https://steamdb.info/upcoming/free/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/437247/Steam%20%E5%85%8D%E8%B4%B9%E6%B8%B8%E6%88%8F%E6%B0%B8%E4%B9%85%E5%85%A5%E5%BA%93%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/437247/Steam%20%E5%85%8D%E8%B4%B9%E6%B8%B8%E6%88%8F%E6%B0%B8%E4%B9%85%E5%85%A5%E5%BA%93%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 注册上下文菜单
    GM_registerMenuCommand("打开Free Promotions", function () {
        window.open("https://steamdb.info/upcoming/free/", "_blank");
    });
    GM_registerMenuCommand("Copy all subid", function () {
        var list = document.getElementsByClassName("app");
        var subid = "";
        for (let i of list) {
            subid += i.getAttribute("data-subid");
            subid += ","
        }
        var resultId = subid.replace(/^\d*?,(.*),$/gm, "$1");
        console.log(resultId);
        GM_setClipboard(resultId, { type: 'text', mimetype: 'text/plain'});
        window.open("https://store.steampowered.com/account/registerkey", "_blank");

    });
    // Your code here...
})();
