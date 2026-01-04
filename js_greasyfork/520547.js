// ==UserScript==
// @name         内容获取下载
// @namespace    http://tampermonkey.net/
// @version      2024-12-13
// @description  藐视
// @author       Vdoi
// @match        https://tongyi.aliyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520547/%E5%86%85%E5%AE%B9%E8%8E%B7%E5%8F%96%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/520547/%E5%86%85%E5%AE%B9%E8%8E%B7%E5%8F%96%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个样式表用于美化UI
    function createStylesheet() {
        let style = document.createElement('style');
        style.innerHTML = `
            /* 全局设置 */
            :root {
                --primary-color: #007bff;
                --secondary-color: #28a745;
                --background-color: #fff;
                --border-radius: 10px;
            }

            /* 容器 */
            #xpathDownloaderContainer {
                position: fixed;
                top: 50px;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--background-color);
                padding: 20px;
                border-radius: var(--border-radius);
                box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
                z-index: 10000;
                width: 300px;
                text-align: center;
                color: #333;
                display: none; /* 默认隐藏 */
                border: 1px solid #ddd;
            }
            /* 切换按钮 */
            #toggleButton {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                border: none;
                background-color: var(--primary-color);
                color: white;
                border-radius: var(--border-radius);
                cursor: pointer;
                z-index: 10001;
                font-size: 1em;
            }
            /* 输入框 */
            #xpathDownloader input {
                width: calc(100% - 40px);
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: var(--border-radius);
                font-size: 1em;
                background-color: #fff;
                color: #333;
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
            }
            /* 按钮 */
            #xpathDownloader button {
                padding: 10px 20px;
                border: none;
                background-color: var(--secondary-color);
                color: white;
                border-radius: var(--border-radius);
                cursor: pointer;
                font-size: 1em;
            }
            /* 标题栏（可拖拽） */
            .draggable-header {
                cursor: move;
                padding-bottom: 15px;
                border-bottom: 1px solid #ddd;
                font-weight: bold;
                font-size: 1.2em;
                color: #333;
            }
            /* 提示信息 */
            .message {
                margin-top: 15px;
                font-size: 0.9em;
                color: red;
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建UI元素
    function createUI() {
        let container = document.createElement('div');
        container.id = 'xpathDownloaderContainer';

        let header = document.createElement('div');
        header.className = 'draggable-header';
        header.innerText = 'XPath Text Downloader';

        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '请输入XPath...';

        let button = document.createElement('button');
        button.innerText = '下载文本';

        let message = document.createElement('div');
        message.className = 'message';

        let toggleButton = document.createElement('button');
        toggleButton.id = 'toggleButton';
        toggleButton.innerText = '打开下载框';

        container.appendChild(header);
        container.appendChild(input);
        container.appendChild(button);
        container.appendChild(message);
        document.body.appendChild(container);
        document.body.appendChild(toggleButton);

        return { container, input, button, message, header, toggleButton };
    }

    // 根据XPath获取元素并提取文本
    function getTextByXPath(xpath) {
        try {
            let result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
            let node = result.iterateNext();
            if (node) {
                return node.textContent || '';
            }
        } catch (error) {
            console.error('XPath解析失败:', error);
        }
        return '';
    }

    // 创建下载链接
    function downloadTextAsFile(text, filename) {
        let blob = new Blob([text], { type: 'text/plain' });
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href); // 清理
    }

    // 实现拖拽功能
    function enableDragging(draggableHeader, container) {
        let isDragging = false;
        let offsetX, offsetY;

        draggableHeader.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // 切换UI显示状态
    function toggleUI(ui) {
        if (ui.container.style.display === 'none') {
            ui.container.style.display = 'block';
            ui.toggleButton.innerText = '关闭下载框';
        } else {
            ui.container.style.display = 'none';
            ui.toggleButton.innerText = '打开下载框';
        }
    }

    // 主逻辑
    createStylesheet();
    let ui = createUI();

    enableDragging(ui.header, ui.container);

    window.addEventListener('load', () => {
        ui.toggleButton.addEventListener('click', () => toggleUI(ui));

        ui.button.addEventListener('click', () => {
            let xpath = ui.input.value.trim();
            if (!xpath) {
                ui.message.innerText = '请输入有效的XPath表达式';
                ui.message.style.display = 'block';
                setTimeout(() => { ui.message.style.display = 'none'; }, 3000);
                return;
            }

            let text = getTextByXPath(xpath);
            if (text) {
                downloadTextAsFile(text, 'xpath_text.txt');
            } else {
                ui.message.innerText = '未找到与XPath匹配的内容或XPath无效';
                ui.message.style.display = 'block';
                setTimeout(() => { ui.message.style.display = 'none'; }, 3000);
            }
        });
    });



})();