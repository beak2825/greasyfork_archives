// ==UserScript==
// @name         [飞书文档]at me color
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  lark at me
// @author       onionycs
// @match        https://bytedance.larkoffice.com/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=larkoffice.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530072/%5B%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%5Dat%20me%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/530072/%5B%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%5Dat%20me%20color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取具有指定类名的所有元素
    setInterval(() => {
        const elements = document.getElementsByClassName("gpf-at-user-self");

        // 遍历元素集合
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            // 设置背景颜色
            element.style.backgroundColor = 'rgba(148, 180, 255, 0.18)';
            element.style.color='rgb(31, 35, 41)';
        }
    },1000);
})();