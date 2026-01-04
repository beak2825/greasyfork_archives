// ==UserScript==
// @name         我不需要样式 - No Style
// @namespace    https://github.com/DragonCat1
// @version      1.0
// @description  删除网页中所有样式 - Removes all styles from the current page
// @author       铛铛铛
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461942/%E6%88%91%E4%B8%8D%E9%9C%80%E8%A6%81%E6%A0%B7%E5%BC%8F%20-%20No%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/461942/%E6%88%91%E4%B8%8D%E9%9C%80%E8%A6%81%E6%A0%B7%E5%BC%8F%20-%20No%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有的样式表
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style');

    // 遍历所有样式表并将其禁用
    stylesheets.forEach(sheet => {
        sheet.disabled = true;
    });

    // 移除所有样式表和内联样式
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        element.removeAttribute('style');
    });
})();
