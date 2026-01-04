// ==UserScript==
// @name         删除小刀娱乐网广告x6d.com/x6g.com
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  删除小刀娱乐资源网的大部分广告，还你一个清爽的界面。
// @author       You
// @match        https://x6d.com/
// @match        https://www.x6g.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x6d.com
// @license      All Rights Reserved; https://example.com/license
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504598/%E5%88%A0%E9%99%A4%E5%B0%8F%E5%88%80%E5%A8%B1%E4%B9%90%E7%BD%91%E5%B9%BF%E5%91%8Ax6dcomx6gcom.user.js
// @updateURL https://update.greasyfork.org/scripts/504598/%E5%88%A0%E9%99%A4%E5%B0%8F%E5%88%80%E5%A8%B1%E4%B9%90%E7%BD%91%E5%B9%BF%E5%91%8Ax6dcomx6gcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有具有类名为 'addd' 的元素
        var elementsToRemove = document.querySelectorAll('.addd,.tmall_tab');

    // 遍历并删除这些元素
    elementsToRemove.forEach(function(el) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
})();