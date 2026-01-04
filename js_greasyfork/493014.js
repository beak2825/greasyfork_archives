// ==UserScript==
// @name         thisav/missav 屏蔽自动停播失去焦点停播
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  尝试阻止特定元素的失去焦点(blur)事件
// @author       你的名字
// @match        https://thisav.com/*
// @match        https://missav.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/493014/thisavmissav%20%E5%B1%8F%E8%94%BD%E8%87%AA%E5%8A%A8%E5%81%9C%E6%92%AD%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%E5%81%9C%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/493014/thisavmissav%20%E5%B1%8F%E8%94%BD%E8%87%AA%E5%8A%A8%E5%81%9C%E6%92%AD%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%E5%81%9C%E6%92%AD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var orig=window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type == "blur") {
            console.info("no pause");
            return;
        }
        // 将arguments对象转换为数组
        const args = Array.prototype.slice.call(arguments);
        // 使用apply调用原始的addEventListener方法
        orig.apply(window, args);
    }
    orig=document.addEventListener;
    document.addEventListener = function(type, listener, options) {
        if (type == "visibilitychange" || type=="blur") {
            console.info("no pause");
            return;
        }
        // 将arguments对象转换为数组
        const args = Array.prototype.slice.call(arguments);
        // 使用apply调用原始的addEventListener方法
        orig.apply(window, args);
    }
})();