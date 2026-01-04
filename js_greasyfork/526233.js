// ==UserScript==
// @name         JSON Copy Button
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  为类似demo.html结构的页面添加JSON复制按钮
// @author       Trae AI
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM.addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526233/JSON%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/526233/JSON%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮样式
    GM_addStyle(`
        .json-copy-btn {
            position: absolute;
            top: 10px;
            left: 10px;
            padding: 4px 8px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            z-index: 10000;
        }
        .json-copy-btn:hover {
            background-color: #45a049;
        }
    `);

    // 检查页面是否包含类似结构
    function checkForJsonStructure() {
        const nodes = document.querySelectorAll('.vjs-tree:not([data-copy-button-added])') || [];
        console.log('检查页面JSON结构:', nodes.length > 0 ? '找到新的结构' : '未找到新的结构');
        return nodes;
    }

    // 创建复制按钮
    function createCopyButton(container) {
        console.log('创建复制按钮...');
        const button = document.createElement('button');
        button.className = 'json-copy-btn';
        button.textContent = '复制JSON';
        button.onclick = async () => {
            const jsonContent = extractJsonContent(container);
            try {
                await navigator.clipboard.writeText(jsonContent);
                console.log('JSON内容复制成功');
                button.textContent = '复制成功！';
                setTimeout(() => {
                    button.textContent = '复制JSON';
                }, 2000);
            } catch (err) {
                button.textContent = '复制失败';
                console.error('JSON内容复制失败:', err);
            }
        };
        container.style.position = 'relative';
        container.appendChild(button);
        container.setAttribute('data-copy-button-added', 'true');
    }

    // 提取JSON内容
    function extractJsonContent(container) {
        console.log('开始提取JSON内容...');
        const jsonObj = {};
        const nodes = container.querySelectorAll('.vjs-tree__node');
        
        nodes.forEach(node => {
            const key = node.querySelector('.vjs-key');
            const value = node.querySelector('.vjs-value');
            
            if (key && value) {
                const keyText = key.textContent.replace(':', '');
                let valueText = '';
                
                if (value.classList.contains('vjs-value__string')) {
                    valueText = value.textContent.replace(/^"(.*)"$/, '$1');
                } else if (value.classList.contains('vjs-value__number')) {
                    valueText = Number(value.textContent);
                } else if (value.textContent === '[') {
                    valueText = [];
                    // 处理数组内容
                    let nextNode = node.nextElementSibling;
                    while (nextNode && !nextNode.textContent.includes(']')) {
                        const arrayValue = nextNode.querySelector('.vjs-value');
                        if (arrayValue) {
                            valueText.push(arrayValue.textContent.replace(/^"(.*)"$/, '$1'));
                        }
                        nextNode = nextNode.nextElementSibling;
                    }
                }
                
                if (keyText && valueText !== '') {
                    jsonObj[keyText] = valueText;
                }
            }
        });
        
        const result = JSON.stringify(jsonObj, null, 2);
        console.log('JSON内容提取完成:', result);
        return result;
    }

    // 创建 MutationObserver 实例
    const observer = new MutationObserver((mutations) => {
        console.log('检测到 DOM 变化，正在检查 JSON 结构...');
        const newStructures = checkForJsonStructure();
        newStructures.forEach(structure => {
            console.log('发现新的 JSON 结构，添加复制按钮...');
            createCopyButton(structure);
        });
    });

    // 配置 observer
    const config = {
        childList: true,
        subtree: true
    };

    // 开始观察
    window.addEventListener('load', () => {
        console.log('页面加载完成，开始监听 DOM 变化...');
        observer.observe(document.body, config);
        
        // 初始检查
        const initialStructures = checkForJsonStructure();
        initialStructures.forEach(structure => {
            console.log('页面加载完成时发现 JSON 结构，添加复制按钮...');
            createCopyButton(structure);
        });
    });
})();