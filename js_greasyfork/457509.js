// ==UserScript==
// @name         Bilibili专栏剪贴板复制净化
// @namespace    https://greasyfork.org/users/236434
// @version      0.1
// @description  去除B站专栏剪贴板复制时被额外添加的字符
// @author       You
// @match        https://www.bilibili.com/read/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457509/Bilibili%E4%B8%93%E6%A0%8F%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%A4%8D%E5%88%B6%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/457509/Bilibili%E4%B8%93%E6%A0%8F%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%A4%8D%E5%88%B6%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function interceptListener(target) {
        target.prototype.oldaddEventListener = target.prototype.addEventListener;
        target.prototype.addEventListener = function(event, handler, placeholder) {
            if (event === 'copy') return;
            // console.log("allowing listener", event, handler, placeholder);
            if (arguments.length < 3) {
                this.oldaddEventListener(event, handler, false);
            } else {
                this.oldaddEventListener(event, handler, placeholder);
            }
        }
    }

    if (window.EventTarget && EventTarget.prototype.addEventListener) {
        interceptListener(EventTarget);
    } else {
        interceptListener(Element);
    }
})();
