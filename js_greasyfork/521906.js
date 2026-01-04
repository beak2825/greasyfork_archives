// ==UserScript==
// @name         防覆盖
// @namespace    https://yffjglcms.com/
// @version      1.0
// @description  避免 content-wrapper 被覆盖
// @match        https://doc.iocoder.cn/*
// @grant        none
// @run-at       document-start
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521906/%E9%98%B2%E8%A6%86%E7%9B%96.user.js
// @updateURL https://update.greasyfork.org/scripts/521906/%E9%98%B2%E8%A6%86%E7%9B%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始的 jQuery.html 方法
    const originalHtml = $.fn.html;

    // 重写 jQuery.html 方法
    $.fn.html = function(content) {
        if (this.hasClass("content-wrapper")) {
            console.log("拦截了对 .content-wrapper 的修改:", content);
            return this; // 阻止修改
        }
        return originalHtml.apply(this, arguments);
    };

    // 拦截 setTimeout，阻止指定的代码执行
    const originalSetTimeout = setTimeout;
    window.setTimeout = function(callback, delay) {
        const callbackStr = callback.toString();
        if (callbackStr.includes('$(".content-wrapper").html')) {
            console.log("拦截了 setTimeout 中的修改操作:", callbackStr);
            return; // 阻止执行
        }
        return originalSetTimeout(callback, delay);
    };
})();
