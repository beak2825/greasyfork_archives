// ==UserScript==
// @name         小风车刷金币
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  必须使用网址http://www.99imk.com/addCard.do?linkqq=数字 的网址打开才能刷金币,数字为要刷的起始QQ号;增加判断的网址
// @author       星雨燃烧
// @match        http://www.99imk.com/addCard.do?linkqq=*
// @match        http://www.cardmarket.top/addCard.do?linkqq=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22959/%E5%B0%8F%E9%A3%8E%E8%BD%A6%E5%88%B7%E9%87%91%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/22959/%E5%B0%8F%E9%A3%8E%E8%BD%A6%E5%88%B7%E9%87%91%E5%B8%81.meta.js
// ==/UserScript==

setInterval(
    (function(){
        temp=document.URL.match(/linkqq=\d+/);
        temp=/\d+/.exec(temp);
        temp=temp*1+1;
        location.href=document.URL.replace(/linkqq=\d+/,"linkqq="+temp);
    }),1500);
