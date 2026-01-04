// ==UserScript==
// @name         数据获取
// @namespace    https://jp.mercari.com/
// @version      v1.0.1
// @description  用于个人页面数据获取
// @author       张世杰 :http//www.jingjian.fun
// @license MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-ui@1.13.3/dist/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/npm/semantic-ui@2.5.0/dist/semantic.min.js
// @resource     customCSS https://cdn.jsdelivr.net/npm/semantic-ui@2.5.0/dist/semantic.min.css
// @match        *://jp.mercari.com/user/following/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jp.mercari.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/527297/%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/527297/%E6%95%B0%E6%8D%AE%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .button-container {
            position: fixed;
            right: 0;
            top: 30%;
            display: flex;
            align-items: center;
            cursor: ns-resize;
            user-select: none;
            z-index: 1000;
        }

        .edge-button {
            padding: 15px 25px;
            border: none;
            border-radius: 20px 0 0 20px;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            color: white;
            font-size: 14px;
            line-height: 1.5;
            font-weight: bold;
            box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            white-space: nowrap;
            text-align: center;
            min-width: 120px;
            cursor: pointer;
        }

        .edge-button:hover {
            padding-right: 35px;
            background: linear-gradient(45deg, #FF8787, #5EFFE4);
            box-shadow: -4px 4px 15px rgba(0, 0, 0, 0.3);
        }

        .button-container:not(:hover) .edge-button {
            width: 40px;
            min-width: unset;
            padding: 15px 10px;
            overflow: hidden;
        }

        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .modal-overlay.active {
            display: block;
            opacity: 1;
        }

        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 80%;
            max-width: 600px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 2001;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .modal.active {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        .modal-content {
            margin-bottom: 20px;
        }

        .modal-textarea {
            width: 100%;
            height: 200px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            resize: none;
            font-family: monospace;
            margin-bottom: 15px;
        }

        .copy-button {
            background: linear-gradient(45deg, #4ECDC4, #2AB7CA);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .copy-button:hover {
            background: linear-gradient(45deg, #45C1B8, #25A5B6);
            transform: translateY(-1px);
        }

        .copy-button:active {
            transform: translateY(0);
        }

        .copy-success {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .copy-success.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;

    // 创建HTML元素
    const container = document.createElement('div');
    container.className = 'button-container';
    container.innerHTML = `
        <button class="edge-button">获取小八嘎链接</button>
    `;

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <textarea class="modal-textarea" readonly></textarea>
                <button class="copy-button">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 0H6C4.9 0 4 0.9 4 2V10C4 11.1 4.9 12 6 12H13C14.1 12 15 11.1 15 10V2C15 0.9 14.1 0 13 0ZM13 10H6V2H13V10ZM1 4H3V14H11V16H3C1.9 16 1 15.1 1 14V4Z" fill="white"/>
                    </svg>
                    复制链接
                </button>
            </div>
        </div>
    `;

    const copySuccess = document.createElement('div');
    copySuccess.className = 'copy-success';
    copySuccess.textContent = '复制成功！';

    // 添加元素到页面
    document.head.appendChild(style);
    document.body.appendChild(container);
    document.body.appendChild(modalOverlay);
    document.body.appendChild(copySuccess);

    // 初始化变量和获取元素
    const modal = modalOverlay.querySelector('.modal');
    const textarea = modalOverlay.querySelector('.modal-textarea');
    const copyButton = modalOverlay.querySelector('.copy-button');
    let isDragging = false;
    let currentY;
    let initialY;
    let yOffset = 0;

    // 拖拽功能
    container.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialY = e.clientY - yOffset;
        if (e.target === container || e.target.classList.contains('edge-button')) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentY = e.clientY - initialY;

            const maxY = window.innerHeight - container.offsetHeight;
            currentY = Math.max(0, Math.min(currentY, maxY));

            yOffset = currentY;
            setTranslate(0, currentY, container);
        }
    }

    function dragEnd(e) {
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.top = yPos + 'px';
    }

    // 弹窗功能
    container.querySelector('.edge-button').addEventListener('click', function (e) {
        if (!isDragging) {
            modalOverlay.classList.add('active');
            modal.classList.add('active');
            let value = $(".merListItem").find('a').map(function () {
                let href = $(this).attr('href');
                // 如果是相对路径，添加域名
                if (href && href.startsWith('/')) {
                    href = window.location.origin + href;
                }
                return href;
            }).get().join('\n');

            // 在这里设置要显示的链接
            textarea.value = value;

        }
    });

    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            modal.classList.remove('active');
        }
    });

    // 复制功能
    copyButton.addEventListener('click', async function () {
        try {
            await navigator.clipboard.writeText(textarea.value);
            copySuccess.classList.add('show');
            setTimeout(() => {
                copySuccess.classList.remove('show');
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    });
})();