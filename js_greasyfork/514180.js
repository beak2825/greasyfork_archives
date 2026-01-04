// ==UserScript==
// @name         去除职友集会员弹窗
// @namespace    https://greasyfork.org/zh-CN/scripts/514180-%E5%8E%BB%E9%99%A4%E8%81%8C%E5%8F%8B%E9%9B%86%E4%BC%9A%E5%91%98%E5%BC%B9%E7%AA%97
// @version      0.2
// @description  等待网页加载完成后，会自动删除弹窗。
// @author       Kean
// @match        https://www.jobui.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jobui.com
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/514180/%E5%8E%BB%E9%99%A4%E8%81%8C%E5%8F%8B%E9%9B%86%E4%BC%9A%E5%91%98%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/514180/%E5%8E%BB%E9%99%A4%E8%81%8C%E5%8F%8B%E9%9B%86%E4%BC%9A%E5%91%98%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标元素的选择器
    const targetSelector = '#ui-v2-pop.ui-v2-popUpBox';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.remove(); // 删除目标元素
            console.log("Removed the popup element with id 'ui-v2-pop' and class 'ui-v2-popUpBox'");
        } else {
            console.log("No matching popup element found on this page.");
        }
    });
})();
