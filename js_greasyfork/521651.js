// ==UserScript==
// @name         移除指定标签并保留内容
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  移除指定标签（如 <b> 和 <strong>）并保留其内容
// @author       Your Name
// @match        *://xueqiu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521651/%E7%A7%BB%E9%99%A4%E6%8C%87%E5%AE%9A%E6%A0%87%E7%AD%BE%E5%B9%B6%E4%BF%9D%E7%95%99%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/521651/%E7%A7%BB%E9%99%A4%E6%8C%87%E5%AE%9A%E6%A0%87%E7%AD%BE%E5%B9%B6%E4%BF%9D%E7%95%99%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义需要移除的标签
    const tagsToRemove = ['b', 'strong'];

    // 遍历页面中的所有需要移除的标签
    tagsToRemove.forEach((tag) => {
        const elements = document.querySelectorAll(tag);
        elements.forEach((element) => {
            // 创建一个文档片段，用于存储标签内的内容
            const fragment = document.createDocumentFragment();
            while (element.firstChild) {
                fragment.appendChild(element.firstChild);
            }
            // 将文档片段插入到父元素中，替换掉原来的标签
            element.parentNode.insertBefore(fragment, element);
            element.remove(); // 移除标签
        });
    });

    console.log('已移除指定标签并保留内容');
})();