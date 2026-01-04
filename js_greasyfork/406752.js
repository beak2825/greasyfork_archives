// ==UserScript==
// @name         百度搜索框样式
// @namespace    http://tampermonkey.net/
// @icon         https://www.baidu.com/favicon.ico
// @version      0.2
// @license      MIT
// @description  百度搜索框样式修改，去掉了圆形边角
// @author       renjiaxin
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406752/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/406752/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    document.getElementById("su").style.cssText="background-color: lightskyblue;color: #8A2BE2; font-family: 华文楷体; font-size: 22px;border-radius:0 0 0 0px";
    var sss = document.getElementsByClassName("bg s_ipt_wr quickdelete-wrap");
    var legt = sss.length;
    for(let i =0; i< legt; i++){
        sss[i].style.cssText="border-radius:0 0 0 0px";
    }


})();