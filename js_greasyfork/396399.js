// ==UserScript==
// @name         百度知道显示踩
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  显示百度知道的踩
// @author       Ramastic
// @match        *zhidao.baidu.com/*
// @grant        none
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/396399/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E6%98%BE%E7%A4%BA%E8%B8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/396399/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E6%98%BE%E7%A4%BA%E8%B8%A9.meta.js
// ==/UserScript==

var oB = document.querySelectorAll('span.evaluate-bad > b.evaluate-num');

for (var i = 0; i < oB.length; i++){
    var oSpan = document.querySelectorAll('span.evaluate-bad');
    var iNum = oSpan[i].getAttribute('data-evaluate');
    oB[i].innerHTML = iNum;
}