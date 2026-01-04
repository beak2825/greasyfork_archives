// ==UserScript==
// @name         Kimi 历史对话批量选中删除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量选中并删除历史对话
// @author       Betterman
// @match        https://kimi.moonshot.cn/chat/history
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536287/Kimi%20%E5%8E%86%E5%8F%B2%E5%AF%B9%E8%AF%9D%E6%89%B9%E9%87%8F%E9%80%89%E4%B8%AD%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/536287/Kimi%20%E5%8E%86%E5%8F%B2%E5%AF%B9%E8%AF%9D%E6%89%B9%E9%87%8F%E9%80%89%E4%B8%AD%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 勾选所有复选框
    function selectAllCheckboxes() {
        const checkboxes = document.querySelectorAll('.kimi-checkbox input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.click();
            }
        });
    }

    // 点击删除按钮
    function clickDeleteButton() {
        const deleteButtons = document.querySelectorAll('.delete-icon');
        deleteButtons.forEach(button => {
            button.click();
        });
    }

    // 创建并添加一个按钮到页面
    const deleteAllButton = document.createElement('button');
    deleteAllButton.textContent = 'Kimi 历史对话批量选中删除';
    deleteAllButton.style.position = 'fixed';
    deleteAllButton.style.top = '10px';
    deleteAllButton.style.right = '10px';
    deleteAllButton.style.zIndex = '9999';
    deleteAllButton.style.padding = '10px 20px';
    deleteAllButton.style.fontSize = '14px';
    deleteAllButton.style.border = 'none';
    deleteAllButton.style.borderRadius = '5px';
    deleteAllButton.style.backgroundColor = '#ff4500'; // 橙红色背景
    deleteAllButton.style.color = '#ffffff'; // 白色文字
    deleteAllButton.style.cursor = 'pointer';
    deleteAllButton.style.transition = 'background-color 0.3s ease';

    deleteAllButton.addEventListener('mouseover', () => {
        deleteAllButton.style.backgroundColor = '#e03c00'; // 鼠标悬停时的背景色
    });

    deleteAllButton.addEventListener('mouseout', () => {
        deleteAllButton.style.backgroundColor = '#ff4500'; // 鼠标移出时的背景色
    });

    deleteAllButton.addEventListener('click', () => {
        alert('已经选中所有历史对话，请根据具体情况谨慎删除！如需隐藏选中按钮，请在油猴管理器关闭脚本！');
        selectAllCheckboxes();
        clickDeleteButton();
    });

    document.body.appendChild(deleteAllButton);
})();