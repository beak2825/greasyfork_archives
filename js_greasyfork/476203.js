// ==UserScript==
// @name         69引号修正脚本
// @namespace    http://your-namespace.example.com
// @version      1.1
// @description  在指定网页上将句号替换为三个句号
// @author       gjd
// @match        https://www.69shuba.com/txt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476203/69%E5%BC%95%E5%8F%B7%E4%BF%AE%E6%AD%A3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/476203/69%E5%BC%95%E5%8F%B7%E4%BF%AE%E6%AD%A3%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 遍历页面中的所有文本节点，并替换句号为三个句号
    function replacePeriods(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            var regex = /([\u4e00-\u9fa5])(["”’'])/g;
            node.textContent = node.textContent.replace(/\./g, '...');
            node.textContent = node.textContent.replace(regex, '$1...$2');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const childNode of node.childNodes) {
                replacePeriods(childNode);
            }
        }
    }

    // 初始化替换
    replacePeriods(document.body);

    var brModules = document.querySelectorAll('br');

    // 遍历每个 <br> 标签
    brModules.forEach(function (brTag) {
        var textNode = brTag.nextSibling; // 获取 <br> 标签的下一个节点

        // 如果存在文本节点
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            var textContent = textNode.textContent.trimRight();

            // 检查文本内容是否以标点符号结尾
            if (!/[.,;!?，。；！？‘’“”]$/.test(textContent)) {
                // 在文本内容的末尾添加 ...
                textContent += '...';
                // 更新文本节点的内容
                textNode.textContent = textContent;
            }
        }
    });
})();
