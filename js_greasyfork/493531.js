// ==UserScript==
// @name         重定向哒麦
// @namespace    http://tampermonkey.net/
// @version      0.12
// @license MIT
// @description  跳转原链
// @author       https://greasyfork.org/zh-CN/users/158417-mo-jie
// @match        https://docs.qq.com/*
// @match        https://www.nodeseek.com/*
// @namespace    https://greasyfork.org/users/158417
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493531/%E9%87%8D%E5%AE%9A%E5%90%91%E5%93%92%E9%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/493531/%E9%87%8D%E5%AE%9A%E5%90%91%E5%93%92%E9%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname.includes('docs.qq.com')) {
        var intervalId = setInterval(checkForWarningMessage, 500);

        function checkForWarningMessage() {
            var elements = document.querySelectorAll('.url-src.url-click.url-blue');
            elements.forEach(function(element) {
                console.log("Link:", element.textContent.trim());
                window.location.href = element.textContent.trim();
            });

            // 停止定时器
            clearInterval(intervalId);
        }
    }

    if (window.location.hostname.includes('www.nodeseek.com')) {
        var intervalId = setInterval(checkForButton, 500);

        function checkForButton() {
            var button = document.evaluate('/html/body/article/div/div/div/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (button) {
                console.log("Button found, clicking...");
                button.click();
                // 停止定时器
                clearInterval(intervalId);
            }
        }
    }
})();
