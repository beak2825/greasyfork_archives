// ==UserScript==
// @name         网页内记事本(In-page notepad)
// @namespace    http://your.namespace/
// @version      1.0
// @description  在网页中添加一个记事本功能
// @author       雷明闪(melonTMD）
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        GM_download
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/490773/%E7%BD%91%E9%A1%B5%E5%86%85%E8%AE%B0%E4%BA%8B%E6%9C%AC%28In-page%20notepad%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490773/%E7%BD%91%E9%A1%B5%E5%86%85%E8%AE%B0%E4%BA%8B%E6%9C%AC%28In-page%20notepad%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isResizing = false;
    let isDragging = false;
    let prevX;
    let prevY;

    // 创建记事本容器
    const noteContainer = document.createElement('div');
    noteContainer.id = 'note-container';
    noteContainer.style.position = 'fixed';
    noteContainer.style.top = '50px'; // 初始位置
    noteContainer.style.left = '50px'; // 初始位置
    noteContainer.style.width = '300px'; // 初始宽度
    noteContainer.style.height = '300px'; // 初始高度
    noteContainer.style.border = '1px solid #ccc';
    noteContainer.style.backgroundColor = '#fff';
    noteContainer.style.zIndex = '9999';
    noteContainer.style.overflow = 'hidden';
    noteContainer.style.resize = 'both'; // 启用调整大小
    noteContainer.style.cursor = 'default';
    noteContainer.style.display = 'none'; // 初始隐藏

    // 创建记事本文本框
    const noteTextarea = document.createElement('textarea');
    noteTextarea.id = 'note';
    noteTextarea.placeholder = '在这里写下你的笔记...';
    noteTextarea.style.width = '100%';
    noteTextarea.style.height = 'calc(100% - 30px)';
    noteTextarea.style.border = 'none';
    noteTextarea.style.padding = '10px';
    noteTextarea.style.resize = 'none';
    noteTextarea.style.overflow = 'auto';

    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.style.width = '100%';
    titleBar.style.height = '30px';
    titleBar.style.backgroundColor = '#ccc';
    titleBar.style.cursor = 'move';
    titleBar.style.userSelect = 'none';

    // 添加标题栏到记事本容器
    noteContainer.appendChild(titleBar);
    // 添加记事本文本框到记事本容器
    noteContainer.appendChild(noteTextarea);
    // 添加记事本容器到页面
    document.body.appendChild(noteContainer);

    // 当点击标题栏时开始拖动
    titleBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    // 当调整记事本大小时
    noteContainer.addEventListener('mousedown', function(e) {
        if (e.target === noteContainer) {
            isResizing = true;
            prevX = e.clientX;
            prevY = e.clientY;
        }
    });

    // 当鼠标移动时进行拖动和调整大小
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const newX = noteContainer.offsetLeft + e.clientX - prevX;
            const newY = noteContainer.offsetTop + e.clientY - prevY;
            noteContainer.style.left = newX + 'px';
            noteContainer.style.top = newY + 'px';
            prevX = e.clientX;
            prevY = e.clientY;
        } else if (isResizing) {
            const newWidth = noteContainer.offsetWidth + e.clientX - prevX;
            const newHeight = noteContainer.offsetHeight + e.clientY - prevY;
            noteContainer.style.width = newWidth + 'px';
            noteContainer.style.height = newHeight + 'px';
            prevX = e.clientX;
            prevY = e.clientY;
        }
    });

    // 当鼠标释放时停止拖动和调整大小
    document.addEventListener('mouseup', function() {
        isDragging = false;
        isResizing = false;
    });

    // 检查本地存储中是否已经保存了笔记
    if (localStorage.getItem('note')) {
        noteTextarea.value = localStorage.getItem('note');
    }

    // 当点击保存按钮时
    function saveNote() {
        // 获取文本框中的内容
        const note = noteTextarea.value;
        // 将内容保存到本地存储中
        localStorage.setItem('note', note);
        // 提示用户保存成功
        alert('笔记已保存！');
    }

    // 创建文件按钮
    const fileButton = document.createElement('button');
    fileButton.innerHTML = '文件';
    fileButton.style.position = 'absolute';
    fileButton.style.top = '5px';
    fileButton.style.left = '5px';
    fileButton.style.padding = '5px';
    fileButton.style.backgroundColor = '#f0f0f0';
    fileButton.style.border = 'none';
    fileButton.style.cursor = 'pointer';

    // 创建文件下拉菜单
    const fileMenu = document.createElement('div');
    fileMenu.style.position = 'absolute';
    fileMenu.style.top = '30px';
    fileMenu.style.left = '0';
    fileMenu.style.width = '100px';
    fileMenu.style.backgroundColor = '#fff';
    fileMenu.style.border = '1px solid #ccc';
    fileMenu.style.display = 'none'; // 初始隐藏

    // 创建文件菜单选项
    const clearOption = document.createElement('div');
    clearOption.textContent = '清除窗口内容';
    clearOption.style.padding = '5px';
    clearOption.style.cursor = 'pointer';
    const saveOption = document.createElement('div');
    saveOption.textContent = '保存';
    saveOption.style.padding = '5px';
    saveOption.style.cursor = 'pointer';
    const saveAsTxtOption = document.createElement('div');
    saveAsTxtOption.textContent = '保存为txt文件';
    saveAsTxtOption.style.padding = '5px';
    saveAsTxtOption.style.cursor = 'pointer';

    // 将文件菜单选项添加到文件下拉菜单
    fileMenu.appendChild(clearOption);
    fileMenu.appendChild(saveOption);
    fileMenu.appendChild(saveAsTxtOption);

    // 将文件按钮和文件下拉菜单添加到记事本容器
    noteContainer.appendChild(fileButton);
    noteContainer.appendChild(fileMenu);

    // 当鼠标悬停在文件按钮上时改变颜色
    fileButton.addEventListener('mouseenter', function() {
        fileButton.style.backgroundColor = '#e0e0e0';
    });

    // 当鼠标移出文件按钮时恢复颜色
    fileButton.addEventListener('mouseleave', function() {
        fileButton.style.backgroundColor = '#f0f0f0';
    });

    // 当点击文件按钮时显示或隐藏文件下拉菜单
    fileButton.addEventListener('click', function() {
        if (fileMenu.style.display === 'none') {
            fileMenu.style.display = 'block';
        } else {
            fileMenu.style.display = 'none';
        }
    });

// 当选择文件菜单中的选项时
fileMenu.addEventListener('click', function(event) {
    const selectedOption = event.target.textContent;
    if (selectedOption === '清除窗口内容') {
        noteTextarea.value = '';
    } else if (selectedOption === '保存') {
        saveNote();
    } else if (selectedOption === '保存为txt文件') {
        const note = noteTextarea.value;
        const noteWithNewLines = note.replace(/\n/g, '\r\n'); // 将换行符 \n 替换为 \r\n
        const blob = new Blob([noteWithNewLines], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        GM_download({
            url: url,
            name: 'note.txt'
        });
    }
    // 隐藏文件下拉菜单
    fileMenu.style.display = 'none';
});

    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✖';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '1px';
    closeButton.style.right = '1px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';

    // 添加关闭按钮到记事本容器
    noteContainer.appendChild(closeButton);

    // 当点击关闭按钮时
    closeButton.addEventListener('click', function() {
        noteContainer.style.display = 'none';
    });

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === 'n') {
            if (noteContainer.style.display === 'none') {
                noteContainer.style.display = 'block';
            } else {
                noteContainer.style.display = 'none';
            }
        }
    });

})();