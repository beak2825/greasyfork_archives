// ==UserScript==
// @name         Bilibili 搜索：默认图片左对齐
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  搜索执行后默认使用图片靠左的详细列表样式
// @author       LTHarry
// @match        https://search.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436178/Bilibili%20%E6%90%9C%E7%B4%A2%EF%BC%9A%E9%BB%98%E8%AE%A4%E5%9B%BE%E7%89%87%E5%B7%A6%E5%AF%B9%E9%BD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/436178/Bilibili%20%E6%90%9C%E7%B4%A2%EF%BC%9A%E9%BB%98%E8%AE%A4%E5%9B%BE%E7%89%87%E5%B7%A6%E5%AF%B9%E9%BD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    console.log("默认使用详细列表");

    window.onload = function() {
        $(".imgleft.type").click(); //通过事件监听器，捕捉到网页元素点击关联的事件，直接引用
    }

})();