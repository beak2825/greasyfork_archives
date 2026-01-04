// ==UserScript==
// @name         格式化快手日志
// @namespace    http://tampermonkey.net/
// @version      2024-07-22
// @description  格式化快手日志， 并且会过滤下拉筛选框
// @author       Torin
// @license      MIT
// @match        https://tianwen.corp.kuaishou.com/log/search-analysis/common*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuaishou.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501814/%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%BF%AB%E6%89%8B%E6%97%A5%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/501814/%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%BF%AB%E6%89%8B%E6%97%A5%E5%BF%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 创建一个按钮用于显示脚本执行状态
    var button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#f0f0f0';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '5px';
    button.style.zIndex = '10000';
    button.innerHTML = '执行中...';
    document.body.appendChild(button);

    // 添加旋转动画的样式
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .spin {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 2px solid #000;
            animation: spin 1s linear infinite;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(style);

    function formatText() {
        // 显示执行状态
        button.innerHTML = '正在格式化 <div class="spin"></div>';

        // 获取所有具有类名 "tw-table__row" 的元素
        var rows = document.getElementsByClassName('tw-table__row');

        // 遍历每个元素并获取它的第三个子项
        Array.prototype.forEach.call(rows, function(row) {
            var thirdChild = row.children[2]; // 获取第三个子项 (索引从0开始)
            if (thirdChild) {
                // 获取第三个子项中的所有 span 标签
                var spans = thirdChild.getElementsByTagName('span');
                Array.prototype.forEach.call(spans, function(span) {
                    // 检查是否已经处理过
                    var text = span.textContent;
                    if (!text.startsWith('formatted:')) {
                        // 获取 span 标签中的文本内容

                        // 检查文本内容并在特定字符串处换行和加亮加粗
                        var newText = text.replace(/(\[([A-Za-z_-])+)/g, '<br><b style="color: aqua; font-weight: bold; font-size: 1.2em;">$1</b>')
 //                           .replace(/(at com\.)/g, '<br><b style="font-weight: bold; font-size: 1.2em;">$1</b>')
                            .replace(/\n/g, '<br>')
                            .replace(/((\w+\.)+(\w+Exception))/g, '<b style="color: red; font-weight: bold; font-size: 1.2em;">$1</b>')
                        ;

                        // 设置头部标记并将换行和加亮加粗后的文本重新填充到 span 标签
                        span.innerHTML = newText.startsWith('<br>') ? ('formatted: ' + newText) : ('formatted: <br/>' + newText);
                    }
                });
            }
        });

        // 隐藏执行状态
        button.innerHTML = '正在格式化  <div class="spin"></div>';
        setTimeout(function() {
            button.innerHTML = '等待中';
        }, 1000); // 1秒后隐藏旋转动画

        let items = document.querySelectorAll('.tw-select-dropdown__item');

        // 遍历每个元素
        items.forEach(item => {
            // 检查元素的文本是否不包含 'laotie'
            if (!item.textContent.includes('laotie') && !item.textContent.includes('magicsite')) {
                // 设置隐藏
                item.style.display = 'none';
            }
        });
    }

    // 每5秒执行一次
    setInterval(formatText, 5000);
})();