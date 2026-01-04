// ==UserScript==
// @name         GitHub 快捷键显示 (GitHub Shortcuts Display)
// @namespace    http://tampermonkey.net/
// @version      1.19
// @description  显示 GitHub 常用快捷键，支持透明度、折叠功能和鼠标拖动，限制面板高度
// @author       Your Name
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509614/GitHub%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%98%BE%E7%A4%BA%20%28GitHub%20Shortcuts%20Display%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509614/GitHub%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%98%BE%E7%A4%BA%20%28GitHub%20Shortcuts%20Display%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建快捷键信息的容器
    const shortcutsContainer = document.createElement('div');
    shortcutsContainer.style.position = 'fixed';
    shortcutsContainer.style.bottom = '10px';
    shortcutsContainer.style.right = '10px';
    shortcutsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    shortcutsContainer.style.color = 'white';
    shortcutsContainer.style.border = '1px solid #ccc';
    shortcutsContainer.style.zIndex = '9999';
    shortcutsContainer.style.maxWidth = '250px';
    shortcutsContainer.style.fontSize = '14px';
    shortcutsContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    shortcutsContainer.style.transition = 'height 0.3s';
    shortcutsContainer.style.maxHeight = '400px';
    shortcutsContainer.style.overflowY = 'auto';

    // 创建标题
    const title = document.createElement('h4');
    title.textContent = 'GitHub 快捷键 (GitHub Shortcuts)';
    title.style.cursor = 'move';
    title.style.margin = '0';
    title.style.padding = '10px'; // 增加内边距
    title.style.backgroundColor = '#333';
    title.style.borderRadius = '5px';

    // 创建快捷键列表
    const shortcutsList = document.createElement('ul');
    shortcutsList.style.listStyleType = 'none';
    shortcutsList.style.padding = '0';
    shortcutsList.style.margin = '10px 0 0 0';
    shortcutsList.style.display = 'block';

    const shortcuts = [
        { key: 'S', description: '聚焦搜索栏' },
        { key: 'G + N', description: '转至您的通知' },
        { key: 'H', description: '打开并聚焦用户、问题或拉取请求悬停卡片' },
        { key: 'Esc', description: '关闭悬停卡片' },
        { key: 'G + C', description: '转到代码选项卡' },
        { key: 'G + I', description: '转到"问题"选项卡' },
        { key: 'G + P', description: '转到拉取请求选项卡' },
        { key: 'G + B', description: '转到"项目"选项卡' },
        { key: 'G + W', description: '转到 Wiki 选项卡' },
        { key: 'Cmd/Ctrl + F', description: '在文件编辑器中开始搜索' },
        { key: 'Cmd/Ctrl + G', description: '找下一个' },
        { key: 'Cmd/Ctrl + Shift + G', description: '查找上一个' },
        { key: 'Cmd/Ctrl + Shift + F', description: '代替' },
        { key: 'Cmd/Ctrl + Shift + R', description: '全部替换' },
        { key: 'Alt + G', description: '跳至行' },
        { key: 'Cmd/Ctrl + Z', description: '撤消' },
        { key: 'Cmd/Ctrl + Y', description: '重做' },
        { key: 'T', description: '激活文件查找器' },
        { key: 'L', description: '跳转到代码中的某一行' },
        { key: 'W', description: '切换到新分支或标签' },
        { key: 'Y', description: '将 URL 扩展为其规范形式' },
        { key: 'I', description: '显示或隐藏差异评论' },
        { key: 'B', description: '开放指责观点' },
        { key: 'C', description: '创建问题' },
        { key: 'Cmd/Ctrl + /', description: '将光标放在问题或拉取请求搜索栏上' },
        { key: 'U', description: '按作者过滤' },
        { key: 'L', description: '按标签过滤或编辑标签' },
        { key: 'M', description: '设定里程碑' },
        { key: 'A', description: '按受让人筛选或编辑受让人' },
        { key: 'O', description: '开放问题' },
        { key: 'Q', description: '请求审阅者' },
        { key: 'Cmd/Ctrl + Shift + Enter', description: '在拉取请求差异上添加一条评论' },
        { key: 'Alt + 点击', description: '在拉取请求中，在折叠和展开所有过期的审阅评论之间切换' },
        { key: 'J', description: '在列表中向下移动选择' },
        { key: 'K', description: '在列表中上移选择' },
        { key: 'Cmd/Ctrl + B', description: '插入 Markdown 格式以加粗文本' },
        { key: 'Cmd/Ctrl + I', description: '插入 Markdown 格式以使文本变为斜体' },
        { key: 'Cmd/Ctrl + K', description: '插入 Markdown 格式以创建链接' },
        { key: 'Cmd/Ctrl + Shift + P', description: '在撰写评论和预览评论选项卡之间切换' },
        { key: 'Cmd/Ctrl + Enter', description: '提交评论' },
        { key: 'Cmd/Ctrl + .', description: '打开已保存的回复菜单，然后使用已保存的回复自动填充评论字段' },
        { key: 'R', description: '在回复中引用所选文本' },
    ];

    shortcuts.forEach(shortcut => {
        const listItem = document.createElement('li');
        // 使用模板字符串
        listItem.textContent = `${shortcut.key}: ${shortcut.description}`;
        listItem.style.color = 'white';
        listItem.style.padding = '5px 10px';
        shortcutsList.appendChild(listItem);
    });

    let isCollapsed = false;
    let isDragging = false;
    let mouseDownTime = 0;
    let offsetX, offsetY;

    title.addEventListener('mousedown', (e) => {
        mouseDownTime = new Date().getTime();
        isDragging = false;
        offsetX = e.clientX - shortcutsContainer.getBoundingClientRect().left;
        offsetY = e.clientY - shortcutsContainer.getBoundingClientRect().top;

        // 提取事件处理函数
        const onMouseMove = (e) => {
            isDragging = true;
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            shortcutsContainer.style.left = `${newX}px`;
            shortcutsContainer.style.top = `${newY}px`;
            shortcutsContainer.style.right = 'auto';
            shortcutsContainer.style.bottom = 'auto';
        };

        const onMouseUp = () => {
            const mouseUpTime = new Date().getTime();
            if (mouseUpTime - mouseDownTime < 200 && !isDragging) {
                toggleCollapse();
            }
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function toggleCollapse() {
        if (isCollapsed) {
            shortcutsContainer.style.height = 'auto';
            shortcutsContainer.style.padding = '10px';
            shortcutsList.style.display = 'block';
        } else {
            const titleHeight = title.offsetHeight;
            shortcutsContainer.style.height = `${titleHeight}px`;
            shortcutsContainer.style.padding = '0';
            shortcutsList.style.display = 'none';
        }
        isCollapsed = !isCollapsed;
    }

    shortcutsContainer.appendChild(title);
    shortcutsContainer.appendChild(shortcutsList);
    document.body.appendChild(shortcutsContainer);
})();