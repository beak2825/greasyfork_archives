// ==UserScript==
// @name         百度百科侧边栏广告去除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  简单的清理广告小程序
// @author       Zorazora
// @include         *://baike.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386819/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/386819/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=1;
    var idiot1=document.getElementsByClassName("lemmaWgt-promotion-vbaike")[0];
    var idiot2=document.getElementsByClassName("lemmaWgt-promotion-slide")[0];
    var idiot3=document.getElementsByClassName("side-box lemma-statistics")[0];
    console.log("removing");
    idiot1.parentNode.removeChild(idiot1);
    idiot2.parentNode.removeChild(idiot2);
    idiot3.parentNode.removeChild(idiot3);
    console.log("removed");
})();