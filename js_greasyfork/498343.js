// ==UserScript==
// @name         猪猪优化
// @namespace    http://tampermonkey.net/
// @version      2024-06-19@2
// @description  try to take over the world!
// @author       You
// @match        https://piggo.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=piggo.me
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498343/%E7%8C%AA%E7%8C%AA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/498343/%E7%8C%AA%E7%8C%AA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听页面加载前的事件
    document.addEventListener('DOMContentLoaded', function() {
        console.log("delete hot");
        // 找到要删除的元素并删除
        console.log("delete parent of hot and previous h2");
        // 找到要删除的元素并删除
        var elementToRemove = document.getElementById('hot');
        if (elementToRemove && elementToRemove.parentNode) {
            var parentElement = elementToRemove.parentNode;
            var previousElement = parentElement.previousElementSibling;

            if (parentElement.tagName.toLowerCase() === 'div') {
                // 删除父元素
                parentElement.parentNode.removeChild(parentElement);
                // 检查并删除前面的 h2 元素
                if (previousElement && previousElement.tagName.toLowerCase() === 'h2') {
                    previousElement.parentNode.removeChild(previousElement);
                }
            }
        }

        // 删除 id="outer" 元素下的第一个 div 元素
        var outerElement = document.getElementById('outer');
        if (outerElement) {
            var firstDivElement = outerElement.querySelector('div');
            if (firstDivElement) {
                firstDivElement.parentNode.removeChild(firstDivElement);
            }
        }

        // 删除 class="head" 的 table 元素
        var headTable = document.querySelector('table.head');
        if (headTable) {
            headTable.parentNode.removeChild(headTable);
        }
    });
})();