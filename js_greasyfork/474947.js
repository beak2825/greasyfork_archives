// ==UserScript==
// @name         书签地球链接自动打开
// @namespace    greasyfork
// @version      1.0
// @license MIT
// @description  从书签地球的网页中提取并打开链接
// @author       Zhugey
// @match        https://www.bookmarkearth.com/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474947/%E4%B9%A6%E7%AD%BE%E5%9C%B0%E7%90%83%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/474947/%E4%B9%A6%E7%AD%BE%E5%9C%B0%E7%90%83%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取包含网址的元素
    var linkElement = document.querySelector('p.link');

    if (linkElement) {
        // 获取元素中的网址
        var link = linkElement.textContent.trim();

        // 在当前标签页中打开网址
        window.location.href = link;
    } else {
        console.log('未找到包含网址的元素');
    }
})();
