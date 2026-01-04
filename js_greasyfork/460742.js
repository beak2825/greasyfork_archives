// ==UserScript==
// @name         修改选中文字颜色
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在选中文字时弹出悬浮框修改其字体颜色
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460742/%E4%BF%AE%E6%94%B9%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/460742/%E4%BF%AE%E6%94%B9%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮框
    var popup = document.createElement('div');
    popup.id = 'color-popup';
    popup.style.display = 'none';
    popup.style.position = 'absolute';
    popup.style.backgroundColor = '#fff';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '10px';
    popup.style.zIndex = 9999;
    document.body.appendChild(popup);

    // 监听选中文字事件
    document.addEventListener('selectionchange', function() {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var rect = range.getBoundingClientRect();

        // 只有选中的文字长度大于0才显示悬浮框
        if (selection.toString().length > 0) {
            popup.style.display = 'block';
            popup.style.left = (rect.left + window.pageXOffset - popup.offsetWidth / 2 + rect.width / 2) + 'px';
            popup.style.top = (rect.top + window.pageYOffset - popup.offsetHeight - 10) + 'px';
        } else {
            popup.style.display = 'none';
        }
    });

    // 在悬浮框中添加颜色选项
    var colors = ['#000', '#f00', '#0f0', '#00f'];
    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        var button = document.createElement('button');
        button.style.backgroundColor = color;
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.border = 'none';
        button.style.marginRight = '10px';
        button.onclick = function() {
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            var span = document.createElement('span');
            span.style.color = this.style.backgroundColor;
            span.innerHTML = selection.toString();
            range.deleteContents();
            range.insertNode(span);
            popup.style.display = 'none';
        };
        popup.appendChild(button);
    }

    // 样式
    GM_addStyle('#color-popup button:hover { opacity: 0.8; }');
})();
