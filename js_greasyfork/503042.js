// ==UserScript==
// @name         隐私自检 "已通过" 勾选
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  在页面添加一个按钮，点击后选择“全部已通过”选项
// @author       你的名字
// @match        https://utrust.jd.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503042/%E9%9A%90%E7%A7%81%E8%87%AA%E6%A3%80%20%22%E5%B7%B2%E9%80%9A%E8%BF%87%22%20%E5%8B%BE%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/503042/%E9%9A%90%E7%A7%81%E8%87%AA%E6%A3%80%20%22%E5%B7%B2%E9%80%9A%E8%BF%87%22%20%E5%8B%BE%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 创建按钮
        const button = document.createElement('button');
        button.textContent = '全部已通过';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // 按钮点击事件
        button.addEventListener('click', function() {
            // 查找所有包含radio按钮组的div
            const radioGroups = document.querySelectorAll('.el-radio-group');

            radioGroups.forEach(group => {
                // 使用选择器定位到当前组中的“已通过”的radio按钮
                const radioLabel = Array.from(group.querySelectorAll('.el-radio__label'))
                                        .find(label => label.textContent.trim() === '已通过');

                if (radioLabel) {
                    const radioInput = radioLabel.previousElementSibling.querySelector('input[type="radio"]');
                    if (radioInput) {
                        // 设置选中状态
                        radioInput.checked = true;

                        // 更新样式和属性
                        const allLabels = group.querySelectorAll('.el-radio');
                        allLabels.forEach(label => {
                            label.classList.remove('is-checked');
                            label.setAttribute('aria-checked', 'false');
                            label.setAttribute('tabindex', '-1');
                        });

                        const parentLabel = radioInput.closest('.el-radio');
                        parentLabel.classList.add('is-checked');
                        parentLabel.setAttribute('aria-checked', 'true');
                        parentLabel.setAttribute('tabindex', '0');

                        // 触发change事件以确保页面响应变化
                        const event = new Event('change', { bubbles: true });
                        radioInput.dispatchEvent(event);

                        console.log(`“已通过”选项已自动选择在组：${group}`);
                    }
                }
            });
        });

        // 将按钮添加到页面上
        document.body.appendChild(button);
    });
})();