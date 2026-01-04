// ==UserScript==
// @name         提取章节内容1.0
// @namespace    http://tampermonkey.net/
// @version      2024-12-25
// @description  提取章节标题和内容，展示状态框，提供操作按钮
// @author       cheniyy
// @match        *://*.bqgui.cc/*
// @match        *://*.bq01.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bqgui.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521775/%E6%8F%90%E5%8F%96%E7%AB%A0%E8%8A%82%E5%86%85%E5%AE%B910.user.js
// @updateURL https://update.greasyfork.org/scripts/521775/%E6%8F%90%E5%8F%96%E7%AB%A0%E8%8A%82%E5%86%85%E5%AE%B910.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取页面的章节标题和内容
    const chapterTitleElement = document.querySelector('h1.wap_none');
    const chapterContentElement = document.querySelector('div#chaptercontent');

    const chapterTitle = chapterTitleElement ? chapterTitleElement.textContent.trim() : null;
    const chapterContent = chapterContentElement ? chapterContentElement.innerHTML.trim() : null;
    let currentUrl = window.location.href; // 获取当前页面的URL

    // 处理题目提取，去掉所有 HTML 标签
    function getTextFromHTML1(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    function getTextFromHTML2(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        let text = doc.body.innerHTML
            .replace(/<br\s*\/?>/gi, '\n')  // 替换 <br> 标签为换行符
            .replace(/<\/p>/gi, '\n\n')  // 将 </p> 标签转换为换行符，并保留段落间距
            .replace(/<\/div>/gi, '\n\n')  // 将 </div> 标签转换为换行符，并保留段落间距
            .replace(/&nbsp;/gi, ' ')  // 替换 &nbsp; 为普通空格
            .replace(/<[^>]+>/g, '');  // 去除所有HTML标签

        // 去掉首尾空白
        text = text.trim();

        // 处理文本缩进（去掉多余的空格或空行）
        text = text.replace(/^[\s]+/gm, '');  // 去掉每行前面的空白字符（防止多重缩进）

        // 添加首行缩进（例如，四个空格）
        text = text.replace(/^(.+)/gm, '    $1');  // 给每行加上四个空格，模拟首行缩进

        return text;
    }

    // 如果没有章节内容或标题，设置错误提示
    let statusMessage = `章节标题：${chapterTitle || '未找到标题'}`;
    if (!chapterTitle || !chapterContent) {
        statusMessage = `未找到章节内容，请检查页面结构！`;
    }

    // 合并标题和内容
    const pureTextContent = chapterTitle && chapterContent ? getTextFromHTML1(chapterTitle) + "\n\n" + getTextFromHTML2(chapterContent) : '';

    // 创建一个浮动框，用于显示脚本状态
    const statusBox = document.createElement('div');
    statusBox.style.position = 'fixed';
    statusBox.style.top = '20px';
    statusBox.style.left = '20px';
    statusBox.style.width = '300px';
    statusBox.style.padding = '15px';
    statusBox.style.backgroundColor = '#fff';
    statusBox.style.border = '1px solid #ccc';
    statusBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    statusBox.style.zIndex = '9999';
    statusBox.style.borderRadius = '8px';
    statusBox.style.fontFamily = 'Arial, sans-serif';

    // 使 statusBox 可拖动
    let isDragging = false;
    let offsetX, offsetY;

    statusBox.style.position = 'absolute';
    statusBox.style.cursor = 'move';

    statusBox.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - statusBox.offsetLeft;
        offsetY = e.clientY - statusBox.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            statusBox.style.left = `${e.clientX - offsetX}px`;
            statusBox.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 显示脚本状态文字
    const statusText = document.createElement('div');
    statusText.textContent = statusMessage;

    // 添加按钮
    const copyButton = document.createElement('button');
    copyButton.textContent = '复制';
    copyButton.style.marginTop = '10px';
    copyButton.style.padding = '8px 12px';
    copyButton.style.backgroundColor = '#4CAF50';
    copyButton.style.color = '#fff';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '5px';
    copyButton.style.cursor = 'pointer';
    copyButton.onclick = async () => {
        try {
            await navigator.clipboard.writeText(pureTextContent);
            alert('章节内容已复制!');
        } catch (err) {
            alert('复制失败，请检查剪贴板权限');
        }
    };

    const viewButton = document.createElement('button');
    viewButton.textContent = '查看复制内容';
    viewButton.style.marginTop = '10px';
    viewButton.style.padding = '8px 12px';
    viewButton.style.backgroundColor = '#2196F3';
    viewButton.style.color = '#fff';
    viewButton.style.border = 'none';
    viewButton.style.borderRadius = '5px';
    viewButton.style.cursor = 'pointer';
    viewButton.onclick = () => {
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        const contentHTML = `
            <html>
                <head>
                    <title>章节内容</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f9f9f9; }
                        .content-container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-height: 100%; overflow-y: auto; }
                        h1 { font-size: 24px; color: #333; }
                        pre { font-family: 'Courier New', monospace; white-space: pre-wrap; word-wrap: break-word; background-color: #f0f0f0; padding: 10px; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="content-container">
                        <h1>章节内容</h1>
                        <pre>${pureTextContent}</pre>
                    </div>
                </body>
            </html>
        `;
        newWindow.document.write(contentHTML);
        newWindow.document.close();
    };

    const saveButton = document.createElement('button');
    saveButton.textContent = '保存为文件';
    saveButton.style.marginTop = '10px';
    saveButton.style.padding = '8px 12px';
    saveButton.style.backgroundColor = '#FF5722';
    saveButton.style.color = '#fff';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '5px';
    saveButton.style.cursor = 'pointer';
    saveButton.onclick = () => {
        const blob = new Blob([pureTextContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${chapterTitle || '章节'} - 内容.txt`;
        link.click();
    };

    const settingsButton = document.createElement('button');
    settingsButton.textContent = '设置';
    settingsButton.style.marginTop = '10px';
    settingsButton.style.padding = '8px 12px';
    settingsButton.style.backgroundColor = '#FFC107';
    settingsButton.style.color = '#fff';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '5px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.onclick = () => {
        const shouldDisplayTitle = confirm("是否显示章节标题？");
        if (shouldDisplayTitle) {
            statusText.textContent = `章节标题：${chapterTitle}`;
        } else {
            statusText.textContent = "章节内容";
        }
    };

    // 将状态框元素添加到页面
    statusBox.appendChild(statusText);
    statusBox.appendChild(copyButton);
    statusBox.appendChild(viewButton);
    statusBox.appendChild(saveButton);
    statusBox.appendChild(settingsButton);
    document.body.appendChild(statusBox);

    // 将提取的内容存储到本地存储（例如使用 localStorage）
    if (chapterTitle && chapterContent) {
        localStorage.setItem('chapterTitle', chapterTitle);
        localStorage.setItem('chapterContent', chapterContent);
    } else {
        localStorage.removeItem('chapterTitle');
        localStorage.removeItem('chapterContent');
    }

    // 自动加载下一章节（优化滚动判断）
    let autoLoadEnabled = true;
    window.addEventListener('scroll', () => {
        if (autoLoadEnabled && (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100)) {
            autoLoadEnabled = false;
            const parts = currentUrl.split('/');
            const lastPart = parts.pop();
            const chapNumber = parseInt(lastPart, 10);
            if (!isNaN(chapNumber)) {
                let nextUrl = parts.join('/') + '/' + (chapNumber + 1);
                if (currentUrl.includes('.html')) {
                    nextUrl += '.html';
                }
                window.location.href = nextUrl;
            }
        }
    });

})();
