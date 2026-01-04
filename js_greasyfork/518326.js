// ==UserScript==
// @name         去除所有学习通文本框的禁止粘贴
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除所有iframe的禁止粘贴功能
// @author       Kimi
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518326/%E5%8E%BB%E9%99%A4%E6%89%80%E6%9C%89%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%96%87%E6%9C%AC%E6%A1%86%E7%9A%84%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/518326/%E5%8E%BB%E9%99%A4%E6%89%80%E6%9C%89%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%96%87%E6%9C%AC%E6%A1%86%E7%9A%84%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载完成后执行的函数
    window.addEventListener('load', function() {
        // 获取页面中所有的<iframe>标签
        var iframes = document.getElementsByTagName('iframe');

        // 检查是否有iframe标签
        if (iframes.length > 0) {
            // 遍历所有的<iframe>标签
            Array.from(iframes).forEach(function(iframe) {
                try {
                    // 获取iframe的内容窗口
                    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

                    // 为iframe内所有元素移除禁止粘贴的事件监听器
                    iframeDocument.addEventListener('paste', function(event) {
                        event.stopPropagation();
                    }, true); // 使用捕获模式

                    // 尝试移除body上的onpaste事件监听器
                    if (iframeDocument.body.onpaste) {
                        iframeDocument.body.onpaste = null;
                    }

                    // 尝试移除document上的onpaste事件监听器
                    if (iframeDocument.onpaste) {
                        iframeDocument.onpaste = null;
                    }
                } catch (e) {
                    console.log('无法访问iframe内容:', e);
                }
            });
        }
    });
})();