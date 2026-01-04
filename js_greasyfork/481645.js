// ==UserScript==
// @name         去除知乎登录框
// @namespace    http://tampermonkey.net/
// @version      2023-12-08
// @description  去除知乎登录框啊啊啊啊啊啊
// @author       Time
// @match        *://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481645/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/481645/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function remove() {
        var count = 0;
        var intervalId = setInterval(function () {
            count++;
            var closeButton = document.getElementsByClassName("Button Modal-closeButton Button--plain")[0];
            if (closeButton) {
                closeButton.click();
            }
            if (count >= 10) {
                clearInterval(intervalId);
            }
        }, 1000);
    }
    remove();
})();