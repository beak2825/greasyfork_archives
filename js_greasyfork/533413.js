// ==UserScript==
// @name         Sharplingo Enhancements
// @namespace    http://tampermonkey.net/
// @version      2.3.2
// @description  快捷重做(Ctrl+O)、快捷跳过(Ctrl+Alt/Command+Space)、快捷切换大小写(Ctrl/Command+P)、更普适的提交(Ctrl/Command/Option+Enter, Ctrl/Command/Option+Space)
// @author       schweigen
// @match        https://*.sharplingo.cn/users/study
// @match        https://*.sharplingo.cn/users/study?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sharplingo.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533413/Sharplingo%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/533413/Sharplingo%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击重做按钮
    function tryClickButton() {
        document.querySelectorAll('button').forEach((button) => {
            if (button.textContent.includes('手抖了，其实这题我会做😭')) {
                button.click();
            }
        });
    }

    // 聚焦到答案输入框
    function focusInput() {
        const inputElement = document.querySelector('input#answer_input.form-control.answer');
        if (inputElement) {
            inputElement.focus();
        }
    }

    // 切换输入框第一个字母的大小写
    function toggleFirstLetterCase(inputElement) {
        const value = inputElement.value;
        if (value.length > 0) {
            const firstLetter = value.charAt(0);
            const restOfValue = value.slice(1);
            const toggledFirstLetter = firstLetter === firstLetter.toUpperCase() ? firstLetter.toLowerCase() : firstLetter.toUpperCase();
            inputElement.value = toggledFirstLetter + restOfValue;
        }
    }

    // 检测并关闭可能存在的模态窗口
    function tryCloseModal() {
        const modals = document.querySelectorAll('.modal.show, .modal.in');
        modals.forEach(modal => {
            const closeButton = modal.querySelector('button.close, button[aria-label="Close"]');
            if (closeButton) {
                closeButton.click();
            }
        });
        return modals.length > 0;
    }

    // 重新定义键盘事件
    document.addEventListener('keydown', function(e) {
        // 检测Ctrl+P或Command+P并聚焦输入框或切换大小写
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            if (!tryCloseModal()) {
                const inputElement = document.querySelector('input#answer_input.form-control.answer');
                if (inputElement && document.activeElement === inputElement) {
                    toggleFirstLetterCase(inputElement);
                }
            }
            focusInput();
            return;
        }

        // 检测Ctrl+O并点击重做按钮
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            tryClickButton();
            return;
        }

        // 跳过当前卡片（Ctrl+Alt+Space 或 Ctrl+Command+Space，仅左侧按键）
        if (e.ctrlKey && (e.altKey || (e.metaKey && !e.shiftKey && !e.altKey)) && e.code === 'Space') {
            document.getElementById("too_easy").click();
            e.preventDefault();
            return;
        }

        // 允许 Ctrl+Command+I 组合键
        if (e.ctrlKey && e.metaKey && e.key.toLowerCase() === 'i') {
            return;
        }

        // 允许必要的快捷键
        if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'a', 'x', 'z', 'Enter', 'Backspace', 'Delete'].indexOf(e.key.toLowerCase()) !== -1) {
            return;
        }

        // 允许 CMD/CTRL+数字组合键
        if ((e.ctrlKey || e.metaKey) && /^\d$/.test(e.key)) {
            return;
        }

        // 禁用其他Ctrl或Meta键组合的快捷键
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);
})();
