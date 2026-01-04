// ==UserScript==
// @name         拖拽搜索或打开链接
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  拖拽文本时百度搜索,拖拽链接时打开链接,不显示禁止符号
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513398/%E6%8B%96%E6%8B%BD%E6%90%9C%E7%B4%A2%E6%88%96%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/513398/%E6%8B%96%E6%8B%BD%E6%90%9C%E7%B4%A2%E6%88%96%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let draggedText = '';

    // 监听拖拽开始事件
    document.addEventListener('dragstart', function(event) {
        // 设置一个空的拖拽图像来隐藏默认的禁止符号
        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        event.dataTransfer.setDragImage(img, 0, 0);

        // 获取拖拽的文本
        draggedText = event.dataTransfer.getData('text/plain') || event.target.href || event.target.textContent;
    });

    // 监听拖拽结束事件
    document.addEventListener('dragend', function(e) {
        if (draggedText) {
            // 检查是否是有效的URL
            if (isValidURL(draggedText)) {
                // 如果是有效的URL,则在新标签页中打开
                window.open(draggedText, '_blank');
            } else {
                // 如果不是URL,则进行百度搜索
                var searchUrl = 'https://www.baidu.com/s?wd=' + encodeURIComponent(draggedText);
                window.open(searchUrl, '_blank');
            }
        }
        // 重置draggedText
        draggedText = '';
    });

    // 检查字符串是否为有效的URL
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // 阻止默认的拖拽行为
    document.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    document.addEventListener('drop', function(event) {
        event.preventDefault();
    });
})();
