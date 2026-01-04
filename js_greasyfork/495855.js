// ==UserScript==
// @name        恢復北科圖書館進階查詢的欄位
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  恢復北科圖書館電子資源查詢時，進階查詢缺少後續兩個條件的輸入框問題
// @author       You
// @match        https://search.lib.ntut.edu.tw/ntut/jumper/search_advanced.jsp?searchmode=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495855/%E6%81%A2%E5%BE%A9%E5%8C%97%E7%A7%91%E5%9C%96%E6%9B%B8%E9%A4%A8%E9%80%B2%E9%9A%8E%E6%9F%A5%E8%A9%A2%E7%9A%84%E6%AC%84%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/495855/%E6%81%A2%E5%BE%A9%E5%8C%97%E7%A7%91%E5%9C%96%E6%9B%B8%E9%A4%A8%E9%80%B2%E9%9A%8E%E6%9F%A5%E8%A9%A2%E7%9A%84%E6%AC%84%E4%BD%8D.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function removeAdTextClass() {
        const input = document.getElementById('SearchText2');
        if (input) {
            input.className = input.className.replace('ad_text', '').trim();
            input.style.border = '1px solid #a9a9a9';
            input.style.margin = '1px 0 3px 0';
            input.style.padding = '0';
            input.style.verticalAlign = 'top';
            input.style.height = '32px';
            input.style.color = '#222';
            input.style.fontSize = '18px';
            input.style.lineHeight = '25px';
            input.style.width = '416px';
            input.style.fontFamily = 'Arial, Helvetica, sans-serif, "微軟正黑體"';
        }
 
        const input2 = document.getElementById('SearchText3');
        if (input2) {
            input2.className = input2.className.replace('ad_text', '').trim();
            input2.style.border = '1px solid #a9a9a9';
            input2.style.margin = '1px 0 3px 0';
            input2.style.padding = '0';
            input2.style.verticalAlign = 'top';
            input2.style.height = '32px';
            input2.style.color = '#222';
            input2.style.fontSize = '18px';
            input2.style.lineHeight = '25px';
            input2.style.width = '416px';
            input2.style.fontFamily = 'Arial, Helvetica, sans-serif, "微軟正黑體"';
        }
    }
 
    window.addEventListener('load', removeAdTextClass);
})();