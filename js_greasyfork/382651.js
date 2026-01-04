// ==UserScript==
// @name         上网导航广告去除
// @namespace    https://greasyfork.org/zh-CN/scripts/382651-%E4%B8%8A%E7%BD%91%E5%AF%BC%E8%88%AA%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4
// @version      0.8
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @include      https://daohang.qq.com*
// @downloadURL https://update.greasyfork.org/scripts/382651/%E4%B8%8A%E7%BD%91%E5%AF%BC%E8%88%AA%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/382651/%E4%B8%8A%E7%BD%91%E5%AF%BC%E8%88%AA%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var ad0 = document.getElementById("AD_0");
    ad0.parentNode.removeChild(ad0)
    var ad1 = document.getElementById("AD_1");
    ad1.parentNode.removeChild(ad1)
    var ad2 = document.getElementById("AD_2");
    ad2.parentNode.removeChild(ad2)
    var ad3 = document.getElementById("AD_3");
    ad3.parentNode.removeChild(ad3)
    var ad4 = document.getElementById("AD_4");
    ad4.parentNode.removeChild(ad4)
    var ad5 = document.getElementById("AD_5");
    ad5.parentNode.removeChild(ad5)
    var ad6 = document.getElementById("AD_6");
    ad6.parentNode.removeChild(ad6)
    var ad7 = document.getElementById("AD_7");
    ad7.parentNode.removeChild(ad7)
    var ad8 = document.getElementById("AD_8");
    ad8.parentNode.removeChild(ad8)
    var ad9 = document.getElementById("AD_9");
    ad9.parentNode.removeChild(ad9)
    var ad10 = document.getElementById("AD_10");
    ad10.parentNode.removeChild(ad10)
    var ad20 = document.getElementsByClassName("adword")[0];
    ad20.parentNode.removeChild(ad20)
    var ad21 = document.getElementsByClassName("hd-slider")[0];
    ad21.parentNode.removeChild(ad21)
    var ad22 = document.getElementsByClassName("topnews m")[0];
    ad22.parentNode.removeChild(ad22)
    var ad23 = document.getElementsByClassName("slider-container")[1];
    ad23.parentNode.removeChild(ad23)
    var ad24 = document.getElementsByClassName("tab-item")[0];
    ad24.parentNode.removeChild(ad24)
    // Your code here...
})();