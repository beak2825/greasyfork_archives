// ==UserScript==
// @name         RO露天市集關鍵字查詢增加
// @namespace    http://tampermonkey.net/
// @version      2024-08-14
// @description  一鍵自訂露天商店查詢平台的關鍵字 腳本版
// @license      Ickeal
// @author       太油了吧Peko
// @match        https://event.gnjoy.com.tw/Ro/RoShopSearch
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gnjoy.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503683/RO%E9%9C%B2%E5%A4%A9%E5%B8%82%E9%9B%86%E9%97%9C%E9%8D%B5%E5%AD%97%E6%9F%A5%E8%A9%A2%E5%A2%9E%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/503683/RO%E9%9C%B2%E5%A4%A9%E5%B8%82%E9%9B%86%E9%97%9C%E9%8D%B5%E5%AD%97%E6%9F%A5%E8%A9%A2%E5%A2%9E%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義要替換的文本
    var newText = [
        "耀眼雪花魔石",
        "閃爍雪花魔石",
        "雪花魔石",
        "光輝雪花魔石萃取液",
        "閃亮雪花魔石萃取液",
        "超時空魔力",
        "超時空寶石原石",
        "雪花的花葉",
        "影子神秘金屬"
    ];

    // 確保 DOM 加載完成
    window.addEventListener('load', function() {
        var elements = document.getElementById("topKeywords").getElementsByClassName("topKeyword");
        for (var i = 0; i < elements.length && i < newText.length; i++) {
            elements[i].textContent = newText[i];
        }
    });
})();