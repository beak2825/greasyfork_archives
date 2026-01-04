// ==UserScript==
// @name         增强型书签按钮和文本收集器
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  在页面左上角添加书签按钮，并提供跨页面文本收集功能
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513413/%E5%A2%9E%E5%BC%BA%E5%9E%8B%E4%B9%A6%E7%AD%BE%E6%8C%89%E9%92%AE%E5%92%8C%E6%96%87%E6%9C%AC%E6%94%B6%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/513413/%E5%A2%9E%E5%BC%BA%E5%9E%8B%E4%B9%A6%E7%AD%BE%E6%8C%89%E9%92%AE%E5%92%8C%E6%96%87%E6%9C%AC%E6%94%B6%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建书签按钮
    function createBookmarkButton() {
        const button = document.createElement('div');
        button.id = 'bookmark-button';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            left: 0;
            width: 12px;
            height: 25px;
            border-radius: 0 12px 12px 0;
            background-color: rgba(144, 238, 144, 0.5);
            cursor: pointer;
            z-index: 9999999;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
            transition: all 0.3s ease;
            overflow: hidden;
        `;

        button.innerHTML = '<span style="margin-right: 3px;">❐</span>';

        button.addEventListener('mouseenter', function() {
            this.style.width = '25px';
            this.style.justifyContent = 'center';
            this.innerHTML = '❐+';
        });

        button.addEventListener('mouseleave', function() {
            this.style.width = '12px';
            this.style.justifyContent = 'flex-end';
            this.innerHTML = '<span style="margin-right: 3px;">❐</span>';
        });

        button.addEventListener('click', function() {
            const title = document.title;
            const url = decodeURI(window.location.href);
            const markdown = `[${title}](${url})`;
            GM_setClipboard(markdown);
            alert('已复制到剪贴板!');
        });

        document.body.appendChild(button);
    }

    // 创建文本收集框
    function createTextCollector() {
        const collector = document.createElement('div');
        collector.id = 'text-collector';
        collector.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 300px;
            height: 200px;
            background-color: rgba(30, 30, 30, 0.9); // 暗黑模式背景
            border: 1px solid #444; // 暗黑模式边框
            border-radius: 5px;
            padding: 10px;
            font-size: 14px;
            color: #fff; // 暗黑模式字体颜色
            z-index: 9999999;
            display: none;
            flex-direction: column;
        `;

        // 创建清空按钮
        const clearButton = document.createElement('div');
        clearButton.innerHTML = '🗑️'; // 使用垃圾桶符号
        clearButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 30px; // 放在关闭按钮左边
            cursor: pointer;
            font-size: 16px;
            color: #fff; // 暗黑模式字体颜色
        `;
        clearButton.addEventListener('click', () => {
            textArea.value = ''; // 清空文本内容
            GM_setValue('collectedText', ''); // 清空存储的文本
        //    alert('已清空所有内容!');
        });

        // 创建关闭按钮
        const closeButton = document.createElement('div');
        closeButton.innerHTML = '✖';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
            font-size: 16px;
            color: #fff; // 暗黑模式字体颜色
        `;
        closeButton.addEventListener('click', () => {
            collector.style.display = 'none';
            GM_setValue('collectorVisible', false);
        });

        const textArea = document.createElement('textarea');
        textArea.style.cssText = `
            flex-grow: 1;
            resize: none;
            border: none;
            outline: none;
            background-color: transparent;
            color: #fff; // 暗黑模式字体颜色
        `;

        // 从存储中加载文本
        textArea.value = GM_getValue('collectedText', '');

        // 监听文本变化并保存
        textArea.addEventListener('input', () => {
            GM_setValue('collectedText', textArea.value);
        });

        // 将清空按钮、关闭按钮和文本框添加到收集框
        collector.appendChild(clearButton);
        collector.appendChild(closeButton);
        collector.appendChild(textArea);
        document.body.appendChild(collector);

        // 恢复收集框的可见状态
        if (GM_getValue('collectorVisible', false)) {
            collector.style.display = 'flex';
        }

        return { collector, textArea };
    }

    // 初始化
    createBookmarkButton();
    const { collector, textArea } = createTextCollector();

    // 监听键盘事件
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'x') {
            e.preventDefault(); // 阻止默认的剪切行为
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                if (collector.style.display === 'none') {
                    collector.style.display = 'flex';
                    GM_setValue('collectorVisible', true);
                    textArea.value += (textArea.value ? '\n' : '') + selectedText;
                } else {
                    textArea.value += '\n' + selectedText;
                }
                GM_setValue('collectedText', textArea.value);
                GM_setClipboard(textArea.value);
            }
        }
    });

})();