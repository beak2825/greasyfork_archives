// ==UserScript==
// @name         让头像动起来
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  let's do it without linux in linxu.do
// @author       taku
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @connect      connect.linux.do
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520540/%E8%AE%A9%E5%A4%B4%E5%83%8F%E5%8A%A8%E8%B5%B7%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/520540/%E8%AE%A9%E5%A4%B4%E5%83%8F%E5%8A%A8%E8%B5%B7%E6%9D%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取id为'toggle-current-user'的button元素
        var button = document.getElementById('toggle-current-user');
        if (button) {
            // 获取button下的img元素
            var img = button.querySelector('img');
            if (img) {
                // 获取img的src属性
                var src = img.getAttribute('src');
                if (src) {
                    // 替换文件名中的数字和扩展名
                    src = src.replace(/(\d+)_2\.png$/, '$1_1.gif');
                    // 设置新的src属性
                    img.setAttribute('src', src);

                }
            }
        }
    });
})();