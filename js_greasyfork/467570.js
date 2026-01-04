// ==UserScript==
// @name         ChatGPT按键修改
// @namespace    chatGPTKeydownModifier
// @version      0.1
// @description  增强ChatGPT网站的按键行为，实现类似QQ的消息发送逻辑，按下Enter键发送消息，按下(Shift/Ctrl)+Enter键插入换行。
// @author       OrzMiku
// @homepage     https://github.com/OrzMiku/chatGPTKeydownModifier
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/467570/ChatGPT%E6%8C%89%E9%94%AE%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/467570/ChatGPT%E6%8C%89%E9%94%AE%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==


(function () {
    // 使用严格模式
    'use strict';

    // 模式设置
    // 0：enter发送消息，ctrl+enter换行
    // 1：ctrl+enter发送消息，enter换行
    const mode = 0;

    // 检测DOM元素是否载入
    function domChecker(selector, callback) {
        const checker = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                callback();
                // 清除定时器
                clearInterval(checker);
                console.log('页面载入完成');
            }
        }, 300);
    }

    // 滚动条定位到光标位置
    function scrollToCursor(textarea) {
        // 获取光标位置
        var cursorPos = textarea.selectionStart;
        // 获取光标所在行数
        var lines = textarea.value.substr(0, cursorPos).split("\n");
        var lineCount = lines.length;
        // 获取每行的高度
        var lineHeight = textarea.scrollHeight / textarea.rows;
        // 计算滚动条的位置
        var scrollTop = lineHeight * lineCount;
        // 设置滚动条位置
        textarea.scrollTop = scrollTop;
    }

    // 插入换行函数
    function insert(textarea) {
        const start = textarea.selectionStart; // 光标起始位置
        const end = textarea.selectionEnd; // 光标结束位置
        const value = textarea.value; // 获取value值
        const newValue = value.substring(0, start) + '\n' + value.substring(end); // 插入换行符
        textarea.value = newValue; // 更新textarea的值
        textarea.selectionStart = textarea.selectionEnd = start + 1; // 将光标定位到插入的换行符后面
        const inputEvent = new Event('input', { bubbles: true }); // 创建输入对象，用于更新高度
        textarea.dispatchEvent(inputEvent);
        scrollToCursor(textarea);
    }

    // 监听
    domChecker('form', () => {
        let form = document.querySelector('form');
        form.removeEventListener('keydown');
        let textarea = form.querySelector('textarea');
        let btn = form.querySelector('button');
        form.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault(); // 阻止默认事件
                if (mode === 0) insert(textarea);
                else btn.click();
            } else if (e.shiftKey && e.key === 'Enter') {

                e.preventDefault(); // 阻止默认事件
                insert(textarea);
            } else if (e.key === 'Enter') {
                e.preventDefault(); // 阻止默认事件
                if (mode === 0) btn.click();
                else insert(textarea);
            }
        }, true);
    });
})();