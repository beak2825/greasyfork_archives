// ==UserScript==
// @name         不要百度知道
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  方便从百度知道复制内容
// @author       tumuyan
// @match        https://zhidao.baidu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415814/%E4%B8%8D%E8%A6%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93.user.js
// @updateURL https://update.greasyfork.org/scripts/415814/%E4%B8%8D%E8%A6%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x = document.getElementById("qb-content");
    x.innerHTML=x.innerHTML.replace(/>(\d{3,8}|[\da-z]{40,80}|bai|du|zhi|dao|百|度|知|道)<\/span/g," style='width:auto;height:auto;display: inline;opacity:100;font-size:16px' /");
})();