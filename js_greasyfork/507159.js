// ==UserScript==
// @name         greasyfork油猴脚本网页自定义净化
// @namespace    https://greasyfork.org/users/1217761
// @version      0.2
// @description  隐藏包含特定关键词的li元素，由gpt4o编写
// @author       gpt4o
// @match        https://greasyfork.org/*/scripts*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507159/greasyfork%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/507159/greasyfork%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%BD%91%E9%A1%B5%E8%87%AA%E5%AE%9A%E4%B9%89%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 创建悬浮输入框
    var inputBox = document.createElement('textarea');
    inputBox.style.position = 'fixed';
    inputBox.style.left = '10px';
    inputBox.style.bottom = '50px';
    inputBox.style.width = '250px';
    inputBox.style.height = '40px';
    inputBox.style.zIndex = '9999';
    inputBox.style.border = '1px solid #ccc';
    inputBox.style.padding = '10px';
    inputBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    inputBox.style.display = 'none'; // 初始隐藏
    inputBox.placeholder = '输入要隐藏的关键词，用英文逗号分隔';
    document.body.appendChild(inputBox);

    // 创建切换按钮
    var toggleButton = document.createElement('button');
    toggleButton.textContent = '过滤关键词';
    toggleButton.style.position = 'fixed';
    toggleButton.style.left = '10px';
    toggleButton.style.bottom = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '2px 4px';
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', function() {
        if (inputBox.style.display === 'none') {
            inputBox.style.display = 'block';
        } else {
            inputBox.style.display = 'none';
        }
    });

    // 设置默认关键词
    var defaultKeywords = '网课,网盘,学习通,vip,解析,作业,优惠券,省钱,网购,VIP'; // 默认关键词在此修改
    inputBox.value = defaultKeywords;

    // 实时监听输入框内容变化
    inputBox.addEventListener('input', function() {
        var inputValue = inputBox.value.trim();
        var keywords = inputValue ? inputValue.split(',').map(function(keyword) {
            return keyword.trim();
        }) : [];

        // 遍历所有ol中的li元素
        var olElements = document.querySelectorAll('ol');
        olElements.forEach(function(ol) {
            var liElements = ol.querySelectorAll('li');
            liElements.forEach(function(li) {
                var liText = li.textContent.trim();
                // 如果li包含任何关键词则隐藏，否则显示
                if (keywords.length > 0 && keywords.some(function(keyword) {
                    return liText.includes(keyword);
                })) {
                    li.style.display = 'none';
                } else {
                    li.style.display = '';  // 恢复显示
                }
            });
        });
    });

    // 触发一次输入事件来应用默认关键词
    var inputEvent = new Event('input');
    inputBox.dispatchEvent(inputEvent);
})();