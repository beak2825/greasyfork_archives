// ==UserScript==
// @name         H图书馆爬虫
// @namespace    xzyl4303
// @version      1.0
// @description  在H图书馆网站上添加爬虫功能
// @author       xzyl4303
// @match        https://hlib.cc/n/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497248/H%E5%9B%BE%E4%B9%A6%E9%A6%86%E7%88%AC%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/497248/H%E5%9B%BE%E4%B9%A6%E9%A6%86%E7%88%AC%E8%99%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建菜单栏
    const menuBar = document.createElement('div');
    menuBar.style.position = 'fixed';
    menuBar.style.top = '0';
    menuBar.style.left = '0';
    menuBar.style.height = '100%';
    menuBar.style.width = '4%';
    menuBar.style.backgroundColor = '#333';
    menuBar.style.color = '#fff';
    menuBar.style.padding = '10px 0';
    menuBar.style.display = 'flex';
    menuBar.style.flexDirection = 'column';
    menuBar.style.alignItems = 'center';
    menuBar.style.zIndex = '9999';
    menuBar.style.boxShadow = '2px 0 4px rgba(0, 0, 0, 0.2)';
    menuBar.style.transition = 'transform 0.3s ease';

    // 创建收缩/展开按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '≡';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '10px';
    toggleBtn.style.left = '4%';
    toggleBtn.style.backgroundColor = '#333';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.border = 'none';
    toggleBtn.style.padding = '10px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.zIndex = '10000';
    toggleBtn.style.width = '4%';
    toggleBtn.addEventListener('click', () => {
        if (menuBar.style.transform === 'translateX(-100%)') {
            menuBar.style.transform = 'translateX(0)';
            toggleBtn.style.left = '4%';
        } else {
            menuBar.style.transform = 'translateX(-100%)';
            toggleBtn.style.left = '0';
        }
    });

    // 创建按钮的通用样式
    function createButton(text, backgroundColor, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.marginBottom = '10px';
        button.style.padding = '10px 0';
        button.style.border = 'none';
        button.style.backgroundColor = backgroundColor;
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.width = '90%';
        button.style.textAlign = 'center';
        button.addEventListener('click', onClick);
        return button;
    }

    // 添加保存按钮
    const saveBtn = createButton('保存', '#4CAF50', saveContent);

    // 添加清除所有按钮
    const clearAllBtn = createButton('清除全部', '#f44336', () => {
        localStorage.removeItem('savedContent');
        console.log('已清除所有保存的内容');
        printSavedContent();
    });

    // 添加清除最近按钮
    const clearRecentBtn = createButton('清除最近', '#f44336', clearRecentContent);

    // 添加勾选框
    const checkBoxLabel = document.createElement('label');
    checkBoxLabel.textContent = '添加标题';
    checkBoxLabel.style.marginBottom = '10px';
    checkBoxLabel.style.display = 'flex';
    checkBoxLabel.style.alignItems = 'center';
    checkBoxLabel.style.width = '90%';
    checkBoxLabel.style.color = '#fff';
    checkBoxLabel.style.justifyContent = 'center';
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.style.marginRight = '5px';
    checkBoxLabel.prepend(checkBox);

    // 创建下载按钮
    const downloadBtn = createButton('下载', '#2196F3', downloadLocalStorageContent);

    // 创建下一页按钮
    let nextPageBtn = null;
    const nextPageButtons = document.querySelectorAll('.btn.btn-primary.py-2, .btn.btn-light.py-2.me-3');
    nextPageButtons.forEach(button => {
        if (button.onclick) {
            nextPageBtn = createButton('下一页', '#FF9800', button.onclick);
        }
    });

    // 创建下一章按钮
    let nextChapterBtn = null;
    const paginationElement = document.querySelector('.row.pagination.mb-3');
    if (paginationElement) {
        const listItems = paginationElement.querySelectorAll('li');
        if (listItems.length > 0) {
            const nextChapterUrl = listItems.length === 1
                ? listItems[0].querySelector('a').href
                : listItems[1].querySelector('a').href;

            nextChapterBtn = createButton('下一章', '#8E44AD', () => {
                window.location.href = nextChapterUrl;
            });
        }
    }

    // 添加菜单栏到页面
    menuBar.appendChild(saveBtn);
    menuBar.appendChild(clearAllBtn);
    menuBar.appendChild(clearRecentBtn);
    menuBar.appendChild(checkBoxLabel);
    menuBar.appendChild(downloadBtn);
    if (nextPageBtn) {
        menuBar.appendChild(nextPageBtn);
    }
    if (nextChapterBtn) {
        menuBar.appendChild(nextChapterBtn);
    }
    document.body.appendChild(menuBar);
    document.body.appendChild(toggleBtn);

    // 保存内容函数
    function saveContent() {
        let content = '';
        if (checkBox.checked) {
            // 添加标题
            const titleElement = document.querySelector('.text-center.m-3');
            if (titleElement) {
                content += `# ${titleElement.textContent.trim()}\n\n\n`;
            }
        }
        // 添加文本内容
        const contentElement = document.getElementById('content');
        if (contentElement) {
            const paragraphs = contentElement.querySelectorAll('p');
            paragraphs.forEach(paragraph => {
                content += paragraph.textContent.trim() + '\n';
            });
        }
        // 从LocalStorage获取已保存的内容
        let savedContent = localStorage.getItem('savedContent') || '';
        // 合并并保存内容到LocalStorage
        localStorage.setItem('savedContent', savedContent + '\n\n' + content);
        // 保存最近内容到临时存储
        sessionStorage.setItem('recentContent', content);
        console.log('已保存内容到LocalStorage');
        printSavedContent();
    }

    // 清除最近保存的内容
    function clearRecentContent() {
        let savedContent = localStorage.getItem('savedContent') || '';
        const recentContent = sessionStorage.getItem('recentContent') || '';
        if (savedContent.includes(recentContent)) {
            savedContent = savedContent.replace(recentContent, '');
            localStorage.setItem('savedContent', savedContent);
            console.log('已清除最近保存的内容');
        } else {
            console.log('没有找到最近保存的内容');
        }
        sessionStorage

.removeItem('recentContent');
        printSavedContent();
    }

    // 下载LocalStorage内容函数
    function downloadLocalStorageContent() {
        const content = localStorage.getItem('savedContent');
        if (content) {
            const fileName = prompt('请输入文件名:', document.title) || 'download.txt';
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            // 清除LocalStorage
            localStorage.removeItem('savedContent');
            console.log('已下载并清除保存的内容');
            printSavedContent();
        } else {
            console.log('没有保存的内容可供下载');
        }
    }

    // 添加快捷键功能
    document.addEventListener('keydown', (event) => {
        if (event.shiftKey && event.key === 'S') {
            saveContent();
        } else if (event.shiftKey && event.key === 'Backspace') {
            localStorage.removeItem('savedContent');
            console.log('已清除所有保存的内容');
            printSavedContent();
        } else if (event.shiftKey && event.key === 'T') {
            checkBox.checked = !checkBox.checked;
        } else if (event.shiftKey && event.key === 'N' && nextPageBtn) {
            nextPageBtn.click();
        } else if (event.shiftKey && event.key === 'M' && nextChapterBtn) {
            nextChapterBtn.click();
        }
    });

    // 初始化页面元素状态
    function initializePage() {
        if (nextPageBtn) {
            nextPageBtn.style.display = nextPageButtons.length > 0 ? 'block' : 'none';
        }
    }
    initializePage();

    // 打印保存的内容到控制台
    function printSavedContent() {
        const savedContent = localStorage.getItem('savedContent');
        console.log('当前保存的内容:', savedContent);
    }

    // 输出保存的内容到控制台
    printSavedContent();

})();