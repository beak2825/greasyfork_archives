// ==UserScript==
// @name         91pu.tw Element Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block specific elements on 91pu.tw
// @author       YourName
// @match        *://*.91pu.com.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487997/91putw%20Element%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/487997/91putw%20Element%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数用于移除元素
    function removeElement(selector) {
        // 选择页面上所有匹配的元素
        var elements = document.querySelectorAll(selector);
        // 循环移除所有匹配的元素
        elements.forEach(function(element) {
            element.parentNode.removeChild(element);
        });
    }

    // 当页面完成加载时执行
    window.addEventListener('load', function() {
        // 移除或隐藏指定的元素
        removeElement('#viptoneWindow');
        removeElement('.update_vip_bar');
    });

})();
