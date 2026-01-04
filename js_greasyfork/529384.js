// ==UserScript==
// @name         秘塔搜清空历史记录
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=1034393
// @version      1.0
// @description  添加一个清空按钮，点击后执行清空操作
// @author       aura_service
// @match       https://metaso.cn/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529384/%E7%A7%98%E5%A1%94%E6%90%9C%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529384/%E7%A7%98%E5%A1%94%E6%90%9C%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建清空按钮
    const clearButton = document.createElement('button');
    clearButton.textContent = '清空';
    clearButton.style.position = 'fixed';
    clearButton.style.bottom = '20px';
    clearButton.style.right = '20px';
    clearButton.style.zIndex = '1000';
    clearButton.style.padding = '10px 20px';
    clearButton.style.backgroundColor = '#f00';
    clearButton.style.color = '#fff';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '5px';
    clearButton.style.cursor = 'pointer';

    // 将按钮添加到页面
    document.body.appendChild(clearButton);

    // 按钮点击事件
    clearButton.addEventListener('click', () => {
        // 获取所有按钮元素
        const buttons = document.querySelectorAll('button');

        // 遍历所有按钮
        buttons.forEach(button => {
            // 检查按钮的类名是否匹配
            if (button.classList.contains('MuiButtonBase-root') &&
                button.classList.contains('MuiIconButton-root') &&
                button.classList.contains('MuiIconButton-sizeMedium') &&
                button.classList.contains('Search_delete-btn__XlhFS') &&
                button.classList.contains('css-txgqa2')) {

                // 点击匹配的按钮
                button.click();

                // 等待0.1秒后查找文本为“确定”的按钮
                setTimeout(() => {
                    const new_buttons = document.querySelectorAll('button');
                    // 查找文本为“确定”的按钮
                    const confirmButton = Array.from(new_buttons).find(btn => btn.textContent.trim() === '确定');

                    // 如果找到“确定”按钮，则点击
                    if (confirmButton) {
                        confirmButton.click();
                    }
                }, 100); // 100毫秒
            }
        });
    });
})();
