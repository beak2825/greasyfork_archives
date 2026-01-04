// ==UserScript==
// @name         消除js Remove JS Button
// @namespace    消除js Remove JS Button
// @license      yagizaMJ
// @version      1.1.1
// @description  在当前页添加一个删除指定的html标签的按钮，点击后会自动删除JS。
// @AuThor       yagizaMJ
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498409/%E6%B6%88%E9%99%A4js%20Remove%20JS%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/498409/%E6%B6%88%E9%99%A4js%20Remove%20JS%20Button.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function removeTags(tagNames) {
        tagNames.forEach(function(tagName) {
            // 获取所有指定标签
            var elements = document.querySelectorAll(tagName);
 
            // 遍历所有的指定标签并移除它们
            elements.forEach(function(element) {
                element.parentNode.removeChild(element);
            });
        });
    }
 
    // 创建按钮元素
    var removeButton = document.createElement('button');
    removeButton.textContent = 'Remove JS';
    removeButton.style.position = 'fixed';
    removeButton.style.top = '250px';
    removeButton.style.right = '20px';
    removeButton.style.zIndex = '9999';
 
    // 将按钮添加到页面上
    document.body.appendChild(removeButton);
 
    // 添加按钮点击事件
    removeButton.addEventListener('click', function() {
        // 调用函数删除 <a> 和 <h1> 标签
        removeTags(['link', 'script']);
 
        // 移除按钮自身
        removeButton.parentNode.removeChild(removeButton);
    });
 
    // 隐藏按钮的右键菜单
    removeButton.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        removeButton.style.display = 'none';
    });
 
    // 当文档双击时，恢复按钮
    document.addEventListener('dblclick', function() {
        removeButton.style.display = 'block';
    });
})();