// ==UserScript==
// @name         浏览器图片增强工具
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  实现对浏览器中的图片进行旋转、放大和下载的功能
// @author       sanzhixiaoxia
// @match        *://*/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/510107/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/510107/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .img-toolbox {
            position: absolute;
            z-index: 10000;
            display: none;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 4px;
            padding: 5px;
        }
        .img-toolbox button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin: 0 2px;
            padding: 5px;
            font-size: 14px;
        }
        .img-toolbox button:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);

    // 工具条HTML模板
    const toolboxTemplate = `
        <button class="rotate-left">⟲</button>
        <button class="rotate-right">⟳</button>
        <button class="zoom-in">＋</button>
        <button class="zoom-out">−</button>
        <button class="download">⬇</button>
    `;

    // 初始化工具条
    function initToolbox() {
        const toolbox = document.createElement('div');
        toolbox.classList.add('img-toolbox');
        toolbox.innerHTML = toolboxTemplate;
        document.body.appendChild(toolbox);
        return toolbox;
    }

    const toolbox = initToolbox();
    let currentImg = null;
    let rotation = 0;
    let scale = 1;
    let hoverTimeout = null;

    // 处理图片鼠标悬停事件
    document.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'IMG') {
            currentImg = e.target;
            hoverTimeout = setTimeout(() => {
                const rect = currentImg.getBoundingClientRect();
                toolbox.style.top = `${rect.top + window.scrollY}px`;
                toolbox.style.left = `${rect.left + window.scrollX}px`;
                toolbox.style.display = 'block';
            }, 3000);
        }
    });

    // 处理图片鼠标移出事件
    document.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'IMG') {
            clearTimeout(hoverTimeout);
            if (!toolbox.contains(e.relatedTarget)) {
                toolbox.style.display = 'none';
                resetTransform();
            }
        }
    });

    // 处理工具条鼠标移入事件（防止闪烁）
    toolbox.addEventListener('mouseover', () => {
        toolbox.style.display = 'block';
    });

    // 处理工具条鼠标移出事件（防止闪烁）
    toolbox.addEventListener('mouseout', (e) => {
        if (!currentImg || !currentImg.contains(e.relatedTarget)) {
            toolbox.style.display = 'none';
            resetTransform();
        }
    });

    // 工具条按钮点击事件
    toolbox.querySelector('.rotate-left').addEventListener('click', () => {
        if (currentImg) {
            rotation -= 90;
            updateTransform();
        }
    });

    toolbox.querySelector('.rotate-right').addEventListener('click', () => {
        if (currentImg) {
            rotation += 90;
            updateTransform();
        }
    });

    toolbox.querySelector('.zoom-in').addEventListener('click', () => {
        if (currentImg) {
            scale += 0.1;
            updateTransform();
        }
    });

    toolbox.querySelector('.zoom-out').addEventListener('click', () => {
        if (currentImg) {
            scale = Math.max(0.1, scale - 0.1);
            updateTransform();
        }
    });

    toolbox.querySelector('.download').addEventListener('click', () => {
        if (currentImg) {
            const link = document.createElement('a');
            link.href = currentImg.src.startsWith('http') ? currentImg.src : currentImg.src.startsWith('/') ? `${window.location.origin}${currentImg.src}` : `${window.location.href}${currentImg.src}`;
            link.download = 'downloaded_image';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    function updateTransform() {
        currentImg.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }

    function resetTransform() {
        if (currentImg) {
            rotation = 0;
            scale = 1;
            currentImg.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        }
    }

})();
