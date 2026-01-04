// ==UserScript==
// @name         虎扑标题隐藏-监听鼠标版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  虎扑标题隐藏,Stop social death when fishing
// @author       sdujava2011
// @match        *://bbs.hupu.com/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546759/%E8%99%8E%E6%89%91%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F-%E7%9B%91%E5%90%AC%E9%BC%A0%E6%A0%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/546759/%E8%99%8E%E6%89%91%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F-%E7%9B%91%E5%90%AC%E9%BC%A0%E6%A0%87%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("scroll", handleScroll, true); //监听滚动事件

    function handleScroll() {
        var elements = document.getElementsByClassName('post-fix-title-title');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }
})();