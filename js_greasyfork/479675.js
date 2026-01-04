// ==UserScript==
// @name         中铁e通考试破解复制功能
// @namespace    http://your-namespace.example.com
// @version      0.3
// @description  Remove oncopy and onpaste events from HTML
// @author       Master Wu
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479675/%E4%B8%AD%E9%93%81e%E9%80%9A%E8%80%83%E8%AF%95%E7%A0%B4%E8%A7%A3%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/479675/%E4%B8%AD%E9%93%81e%E9%80%9A%E8%80%83%E8%AF%95%E7%A0%B4%E8%A7%A3%E5%A4%8D%E5%88%B6%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有具有oncopy或onpaste属性的元素
    var elementsWithOnCopy = document.querySelectorAll('[oncopy]');
    var elementsWithOnPaste = document.querySelectorAll('[onpaste]');

    // 移除oncopy事件处理程序
    elementsWithOnCopy.forEach(function(element) {
        element.removeAttribute('oncopy');
    });

    // 移除onpaste事件处理程序
    elementsWithOnPaste.forEach(function(element) {
        element.removeAttribute('onpaste');
    });
})();


(function() {
    'use strict';

    // 移除禁用右键菜单的代码
    document.oncontextmenu = null;
})();
