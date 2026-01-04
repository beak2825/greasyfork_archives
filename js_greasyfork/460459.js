// ==UserScript==
// @name         pintia夜间模式
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  开启此脚本，在使用pintia(PTA)平台的时候，会开启夜间模式
// @author       龙火火
// @match        https://pintia.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pintia.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460459/pintia%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/460459/pintia%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前时间
    var now = new Date();
    var hours = now.getHours();

    // 判断时间是否在18-7点之间
    if (hours >= 18 || hours < 7) {
        window.onload = function(event){
            document.getElementsByTagName("body")[0].setAttribute('class', 'theme-dark');
        };
    }
})();
