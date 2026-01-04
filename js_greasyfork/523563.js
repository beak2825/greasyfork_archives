// ==UserScript==
// @name         Bilibili 弹幕关键词屏蔽生成器
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  在Bilibili全站通过UI生成正则表达式屏蔽关键词
// @author       程先森
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523563/Bilibili%20%E5%BC%B9%E5%B9%95%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/523563/Bilibili%20%E5%BC%B9%E5%B9%95%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮窗按钮
    const button = document.createElement('button');
    button.innerText = '正则屏蔽';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.bottom = '100px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = '#00a1d6';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.padding = '10px 15px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    button.style.fontSize = '14px';
    document.body.appendChild(button);

    // 创建UI框
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'fixed';
    uiContainer.style.right = '50px';
    uiContainer.style.bottom = '150px';
    uiContainer.style.zIndex = '9999';
    uiContainer.style.width = '300px';
    uiContainer.style.backgroundColor = '#fff';
    uiContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    uiContainer.style.borderRadius = '10px';
    uiContainer.style.padding = '15px';
    uiContainer.style.display = 'none';
    uiContainer.style.fontSize = '14px';
    uiContainer.style.fontFamily = 'Arial, sans-serif';
    uiContainer.innerHTML = `
        <h3 style="margin: 0 0 10px; color: #00a1d6; font-weight: bold;">正则屏蔽弹幕生成</h3>
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <input type="text" id="keywordInput" placeholder="请输入关键词（支持用空格分隔）" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
            <button id="generateButton" style="margin-left: 10px; padding: 8px 10px; background-color: #00a1d6; color: #fff; border: none; border-radius: 5px; cursor: pointer;"><strong>生成</strong></button>
        </div>
        <div id="resultContainer" style="margin-top: 10px; color: #333; border: 1px solid #ccc; border-radius: 5px; padding: 8px; background-color: #f9f9f9; cursor: pointer; word-break: break-all;"></div>
        <div id="dragHandle" style="position: absolute; top: 5px; right: 5px; width: 15px; height: 15px; background-color: #ccc; border-radius: 50%; cursor: grab;"></div>
        <div style="margin-top: 15px; text-align: center; font-size: 12px; color: #aaa; cursor: pointer;" id="authorInfo">©2025 程先森 版权所有</div>
    `;
    document.body.appendChild(uiContainer);

    // 拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    const dragHandle = document.getElementById('dragHandle');
    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - uiContainer.getBoundingClientRect().left;
        offsetY = e.clientY - uiContainer.getBoundingClientRect().top;
        dragHandle.style.cursor = 'grabbing';
        e.preventDefault(); // 防止选中文字
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            uiContainer.style.left = `${e.clientX - offsetX}px`;
            uiContainer.style.top = `${e.clientY - offsetY}px`;
            uiContainer.style.right = '';
            uiContainer.style.bottom = '';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        dragHandle.style.cursor = 'grab';
    });

    // 按钮点击事件
    button.addEventListener('click', () => {
        uiContainer.style.display = uiContainer.style.display === 'none' ? 'block' : 'none';
    });

    // 生成正则表达式
    const generateExpression = () => {
        const input = document.getElementById('keywordInput').value;
        const keywords = input.split(/,|，|\s+/).map(word => word.trim()).filter(word => word);

        // 去重
        const uniqueKeywords = [...new Set(keywords)];

        if (uniqueKeywords.length === 0) {
            document.getElementById('resultContainer').innerText = '请输入至少一个关键词';
            return;
        }

        // 生成正则表达式（恢复之前的格式）
        const regexContent = uniqueKeywords.join('|');
        const regex = `/^.*(${regexContent}).*$/`;
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = `<strong>生成的正则表达式：</strong><br><code>${regex}</code>`;
    };

    document.getElementById('generateButton').addEventListener('click', generateExpression);

    // 支持回车键生成
    document.getElementById('keywordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateExpression();
            e.target.value = ''; // 清空输入框
        }
    });

    // 点击结果复制到剪贴板
    document.getElementById('resultContainer').addEventListener('click', () => {
        const regexCode = document.getElementById('resultContainer').querySelector('code');
        if (regexCode) {
            navigator.clipboard.writeText(regexCode.textContent).then(() => {
                alert('正则表达式已复制到剪贴板！');
            }).catch(err => {
                console.error('复制失败：', err);
            });
        }
    });

    // 点击版权信息跳转到 GitHub
    document.getElementById('authorInfo').addEventListener('click', () => {
        window.open('https://github.com/chengjinglin?tab=repositories', '_blank');
    });

    // 点击页面外部区域关闭UI
    document.addEventListener('click', (e) => {
        if (!uiContainer.contains(e.target) && e.target !== button) {
            uiContainer.style.display = 'none';
        }
    });
})();
