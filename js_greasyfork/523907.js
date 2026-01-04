// ==UserScript==
// @name         磁力链接提取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提取页面中的磁力链接并复制到剪贴板
// @author       charliesroc
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523907/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/523907/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查页面是否已经加载完成
    if (document.readyState === 'complete') {
        scanForMagnets();
    } else {
        window.addEventListener('load', scanForMagnets);
    }

    function scanForMagnets() {
        // 正则表达式匹配磁力链接
        var magnetRegex = /magnet:\?[^\s]+/g;

        // 从页面中提取磁力链接
        var magnets = document.body.innerText.match(magnetRegex) || [];

        // 如果没有找到磁力链接，尝试从特定元素中提取
        if (magnets.length === 0) {
            var elements = document.querySelectorAll('a[href^="magnet:"]');
            magnets = Array.from(elements).map(function(element) {
                return element.href;
            });
        }

        // 创建或更新悬浮按钮
        if (magnets.length > 0) {
            createOrUpdateFloatingButton(magnets.length, magnets);
        } else {
            removeFloatingButton();
        }
    }

    function createOrUpdateFloatingButton(count, magnets) {
        var button = document.getElementById('magnet-floating-button');
        if (!button) {
            button = document.createElement('button');
            button.id = 'magnet-floating-button';
            button.style.position = 'fixed';
            button.style.top = '10px';
            button.style.right = '10px';
            button.style.zIndex = '9999';
            button.style.padding = '10px';
            button.style.backgroundColor = 'rgba(76, 175, 80, 0.7)';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#4CAF50';
            });
            button.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'rgba(76, 175, 80, 0.7)';
            });
            button.addEventListener('click', function() {
                // 将磁力链接连接成一个字符串，每个链接之间用换行符分隔
                var magnetText = magnets.join('\n');

                // 创建一个隐藏的 textarea 元素
                var textarea = document.createElement('textarea');
                textarea.style.position = 'fixed';
                textarea.style.opacity = 0;
                textarea.value = magnetText;

                // 将 textarea 添加到文档中
                document.body.appendChild(textarea);

                // 选中 textarea 中的文本并复制到剪贴板
                textarea.select();
                document.execCommand('copy');

                // 从文档中移除 textarea
                document.body.removeChild(textarea);

                // 弹出提示，告知用户已复制
                alert('已复制 ' + magnets.length + ' 个磁力链接到剪贴板');
            });
            document.body.appendChild(button);
        }
        button.innerText = '搜索到 ' + count + ' 条资源';
    }

    function removeFloatingButton() {
        var button = document.getElementById('magnet-floating-button');
        if (button) {
            document.body.removeChild(button);
        }
    }
})();
