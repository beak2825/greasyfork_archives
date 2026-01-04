// ==UserScript==
// @name         Remove AD on Yeeach
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除 https://yeeach.com/ 页面中的 /html/body/div[2] 元素
// @author       You
// @match        https://yeeach.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531231/Remove%20AD%20on%20Yeeach.user.js
// @updateURL https://update.greasyfork.org/scripts/531231/Remove%20AD%20on%20Yeeach.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 使用 XPath 查找目标元素
        let targetElement = document.evaluate(
            '/html/body/div[2]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        // 如果找到元素，则删除
        if (targetElement) {
            targetElement.remove();
            console.log('已删除 /html/body/div[2] 元素');
        } else {
            console.log('未找到 /html/body/div[2] 元素');
        }
    });
})();