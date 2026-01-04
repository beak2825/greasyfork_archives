// ==UserScript==
// @name         隐藏百度热搜
// @namespace    https://www.baidu.com/
// @version      0.1
// @description  隐藏百度热搜,百度热搜直接样式隐藏掉
// @author       zhaogang
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456167/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/456167/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){
        document.getElementById("content_right").setAttribute("style", "display: none !important")
        console.log("以隐藏")
    };
})();