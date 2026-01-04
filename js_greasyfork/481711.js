// ==UserScript==
// @name         CHD自动填写评教
// @namespace    http://jxzlpj.chd.edu.cn/
// @version      1.0
// @description  CHD自动填写评教，默认填写10分和无
// @include      http://jxzlpj.chd.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481711/CHD%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/481711/CHD%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
     var fillButton = document.createElement('button');
    fillButton.textContent = '点击填写表单';
    fillButton.style.position = 'fixed';
    fillButton.style.top = '50%';
    fillButton.style.right = '20px';
    fillButton.style.transform = 'translateY(-50%)';
    fillButton.style.zIndex = '9999';
    fillButton.style.padding = '10px 20px';
    fillButton.style.fontSize = '16px';
    fillButton.style.border = 'none';
    fillButton.style.borderRadius = '5px';
    fillButton.style.background = '#3498db';
    fillButton.style.color = '#fff';
    fillButton.addEventListener('click', function() {
        // 添加点击反馈
        fillButton.style.background = '#2980b9'; // 点击时的背景颜色
        fillButton.style.transform = 'translateY(-50%) scale(0.95)'; // 缩小按钮
        setTimeout(function() {
            // 恢复初始状态
            fillButton.style.background = '#3498db';
            fillButton.style.transform = 'translateY(-50%)';
        }, 200); // 恢复到初始状态的延迟时间
        // 找到所有的填写元素
        var allTextareas = document.querySelectorAll('textarea');
        var allInputs = document.querySelectorAll('input');

        for (var j = 0; j < allInputs.length; j++) {
            var currentInput = allInputs[j];
            // 检查输入框是否为空
            if (currentInput.value === '' && currentInput.type === 'text') {
                // 如果是文本框，则填入"10"
                currentInput.value = '10';

                // 触发输入事件
                currentInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        for (var i = 0; i < allTextareas.length; i++) {
            var currentTextarea = allTextareas[i];
            // 检查 textarea 是否为空
            if (currentTextarea.value === '') {
                // 填入文本 "无"
                currentTextarea.value = '无';

                // 触发输入事件
                currentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    });

    // 将按钮添加到页面
    document.body.appendChild(fillButton);
})();
