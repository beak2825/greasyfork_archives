// ==UserScript==
// @name         去除灰度滤镜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  如果html元素包含页面灰度的CSS样式，则将其无效化
// @author       XYZzz
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520549/%E5%8E%BB%E9%99%A4%E7%81%B0%E5%BA%A6%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/520549/%E5%8E%BB%E9%99%A4%E7%81%B0%E5%BA%A6%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取html元素
    const htmlElement = document.documentElement;

    // 移除灰度滤镜样式
    htmlElement.style.filter = 'none';
    htmlElement.style['-moz-filter'] = 'none';
    htmlElement.style['-o-filter'] = 'none';
    htmlElement.style['-webkit-filter'] = 'none';
})();