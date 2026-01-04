// ==UserScript==
// @name         天津理工大学自动评价
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  点击页面按钮后自动选择评价的第一个选项
// @author       李晓强
// @match        https://jxpj.tjut.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tjut.edu.cn
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/523532/%E5%A4%A9%E6%B4%A5%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/523532/%E5%A4%A9%E6%B4%A5%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('油猴脚本已加载，等待用户触发...');


    // 防止脚本在 iframe 中运行
    if (window.self !== window.top) {
        console.log('脚本在 iframe 中运行，退出...');
        return;
    }

    // 创建触发按钮
    function addTriggerButton() {
        const existingButton = document.getElementById('auto-evaluation-btn');
        if (existingButton) {
            console.log('触发按钮已存在，跳过添加。');
            return;
        }

        const button = document.createElement('button');
        button.id = 'auto-evaluation-btn';
        button.textContent = '执行自动评价';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            console.log('触发按钮被点击，开始执行自动评价...');
            selectFirstInput();
        });

        document.body.appendChild(button);
        console.log('触发按钮已添加到页面。');
    }

    // 自动选择评价的第一个选项
    function selectFirstInput() {
        const containers = document.querySelectorAll('.index_subjectItem-2FY7j');
        if (containers.length === 0) {
            console.warn('未找到目标评价项容器，无法执行操作。');
            return;
        }

        containers.forEach(container => {
            const firstInput = container.querySelector('label');
            if (firstInput) {
                firstInput.click();
                console.log('已选择第一个选项:', firstInput.textContent.trim());
            } else {
                console.warn('当前容器中未找到评价选项:', container);
            }
        });
        const pinlun = document.querySelector('.index_UEditoTextarea-3MlcS');

        pinlun.setRangeText('老师讲得很好，内容有深度。', pinlun.selectionStart, pinlun.selectionEnd, 'end');

        // 手动触发 input 事件
        const inputEvent = new Event('input', { bubbles: true });
        pinlun.dispatchEvent(inputEvent);

        // 点击提交按钮
        const button = document.querySelector('.index_submit-2EYSG');
        if (button) {
            button.click();
            console.log('提交按钮已被点击。');
        } else {
            console.warn('提交按钮未找到，请检查选择器是否正确。');
        }
    }

    // 初始化脚本
    function init() {
        addTriggerButton();
        console.log('脚本初始化完成，等待用户点击触发按钮。');
    }

    // 页面加载后调用
    window.addEventListener('load', init);
})();
