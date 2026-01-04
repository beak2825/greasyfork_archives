// ==UserScript==
// @name         小原的修改器（尊重版权，禁止商用）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  From author's notice：节约生命修改器，把刷课的时间省下来去好好休息一下吧！
// @author       原培明
// @match        https://hc.kjpx.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520409/%E5%B0%8F%E5%8E%9F%E7%9A%84%E4%BF%AE%E6%94%B9%E5%99%A8%EF%BC%88%E5%B0%8A%E9%87%8D%E7%89%88%E6%9D%83%EF%BC%8C%E7%A6%81%E6%AD%A2%E5%95%86%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/520409/%E5%B0%8F%E5%8E%9F%E7%9A%84%E4%BF%AE%E6%94%B9%E5%99%A8%EF%BC%88%E5%B0%8A%E9%87%8D%E7%89%88%E6%9D%83%EF%BC%8C%E7%A6%81%E6%AD%A2%E5%95%86%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建输入框和按钮的HTML结构
    console.log('Script is running');
    var inputBox = document.createElement('input');
    inputBox.type = 'number';
    inputBox.id = 'customReturnValue';
    inputBox.placeholder = '输入观看时间';

    var applyButton = document.createElement('button');
    applyButton.textContent = '提交修改时常';
    applyButton.id = 'applyButton';

    // 添加CSS样式以美化输入框和按钮
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #customReturnValue {
            padding: 8px;
            margin: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #applyButton {
            padding: 10px 20px;
            margin: 5px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #applyButton:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(style);

    // 将输入框和按钮添加到body的末尾
    document.body.appendChild(inputBox);
    document.body.appendChild(applyButton);

    // 保存原始的getLengthAndReTimer函数引用
    window.getOriginalLengthAndReTimer = window.getLengthAndReTimer;

    // 重写getLengthAndReTimer函数
    window.getLengthAndReTimer = function() {
        // 调用原始函数以保持其他逻辑不变
        var originalTotal = window.getOriginalLengthAndReTimer.apply(this, arguments);

        // 获取用户输入的值
        var customValue = document.getElementById('customReturnValue').value;

        // 检查用户是否输入了值
        if (customValue) {
            return parseInt(customValue, 10);
        }

        // 如果没有输入值，返回原始函数的结果
        return originalTotal;
    };

    // 为按钮添加点击事件，以更新getLengthAndReTimer函数的返回值
    document.getElementById('applyButton').addEventListener('click', function() {
        var customValue = document.getElementById('customReturnValue').value;
        if (customValue) {
            // 覆盖getLengthAndReTimer函数，使其返回用户输入的分钟值
            window.getLengthAndReTimer = function() {
                return parseInt(customValue * 60, 10);
            };
        }
    });
})();