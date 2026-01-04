// ==UserScript==
// @name         纯文本复制
// @namespace    https://github.com/
// @version      0.1
// @description  仅复制纯文本，不带格式
// @author       Lennie
// @match        *://*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460639/%E7%BA%AF%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/460639/%E7%BA%AF%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 阻止默认复制事件
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        // 获取当前选中的文本
        var selectedText = window.getSelection().toString();
        // 清除格式
        var div = document.createElement('div');
        div.innerHTML = selectedText;
        selectedText = div.textContent || div.innerText || '';
        // 将清除格式后的文本添加到剪贴板
        e.clipboardData.setData('text/plain', selectedText);
    });
})();