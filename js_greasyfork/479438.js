// ==UserScript==
// @name         百度去广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  百度去除搜索后的广告
// @author       qk
// @include     http://www.baidu.com/*
// @include     https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=95.14
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479438/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/479438/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.log("hello kitty1");
    let elements = document.getElementsByClassName("_2z1q32z");
    for (var i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
})();