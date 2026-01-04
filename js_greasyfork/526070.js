// ==UserScript==
// @name         GoodNote - 网页笔记助手
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在任何网页添加笔记功能
// @author       kasusa
// @license MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/526070/GoodNote%20-%20%E7%BD%91%E9%A1%B5%E7%AC%94%E8%AE%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526070/GoodNote%20-%20%E7%BD%91%E9%A1%B5%E7%AC%94%E8%AE%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测是否在iframe中，如果是则只应用功能，不创建图标
    const isInIframe = window.self !== window.top;
    
    // 如果是在iframe中，直接返回，不创建笔记图标
    if (isInIframe) {
        return;
    }

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .note-icon svg {
            width: 24px;
            height: 24px;
			fill: #8b8b8bD3;
        }
        .note-icon {
            /* 背景颜色 */
            backdrop-filter: blur(10px);
            background-color: #ffffff00;
            /* border: 1px solid #ffffff8f; */
            /* 圆角 */
            border-radius: 3px;
            /* 固定位置 */
            position: fixed;
            /* 默认位置 */
            top: 20px;
            right: 20px;
            /* 大小 */
            width: 30px;
            height: 30px;
            cursor: move;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: 0.1s ease;
            user-select: none;
            will-change: transform;
            transform: translate3d(0, 0, 0);
            opacity: 1;
            pointer-events: auto;
        }

        .note-icon:hover {
            transform: scale(1);
        }
        .note-icon:active {
            transform: scale(0.9);
        }



        .note-container {
            position: fixed;
            backdrop-filter: blur(10px);
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9998;
            padding: 2px;
            transition: all 0.3s ease;
            opacity: 0;
            transform-origin: center;
            pointer-events: auto;
            display: none;
        }

        .note-container.active {
            opacity: 1;
            transform: scale(1);
        }

        .note-textarea {
            margin-bottom: 0 !important;
            background: #ffffff4f;
            color:#000;
            min-height: 250px;
            min-width: 350px;
            height: 250px;
            width: 350px;
            border-radius: 4px;
            padding: 22px;
            font-size: 14px;
            resize: both;
            overflow: auto;
            overflow-y: auto;
            font-family: Arial, sans-serif;
            line-height: 1.5;
            word-break: break-all;
            text-align: left;
        }

        .note-textarea:focus {
            outline: none;
        }

        .note-icon::after {
            content: 'Ctrl+Shift+M';
            position: absolute;
            background: rgba(255, 255, 255, 0.61);
            backdrop-filter: blur(15px);
            color: #000;
            padding: 5px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-right: 10px;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .note-icon:hover::after {
            opacity: 1;
        }

        .goodnote-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        }

        .note-textarea a {
            color: #409EFF;
            text-decoration: underline;
            cursor: pointer;
        }

        .note-textarea a:hover {
            opacity: 0.8;
        }

        .pin-button {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
            z-index: 10000;
        }
        .pin-button:hover {
            opacity: 1;
        }
        .pin-button.pinned {
            color: #409eff;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // 创建笔记图标
    const noteIcon = document.createElement('div');
    noteIcon.className = 'note-icon';

    // 根据平台设置不同的快捷键提示
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    noteIcon.setAttribute('data-shortcut', isMac ? '⌘+Shift+M' : 'Ctrl+Shift+M');

    // 修改样式内容，使用动态快捷键文本
    const shortcutText = isMac ? '⌘+Shift+M' : 'Ctrl+Shift+M';
    style.textContent = style.textContent.replace(
        '.note-icon::after { content: \'Ctrl+Shift+M\';',
        `.note-icon::after { content: '${shortcutText}';`
    );

    noteIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- 方块主体 -->
  <path d="M20 10 h140 a10 10 0 0 1 10 10 v110 h-50 a10 10 0 0 0 -10 10 v50 h-90 a10 10 0 0 1 -10 -10 v-160 a10 10 0 0 1 10 -10 z" fill=""/>
  <!-- 折角 -->
  <path d="M110 130 L180 130 L130 180 Z" fill="black"/>
</svg>

        </svg>
    `;

    // 创建笔记容器
    const noteContainer = document.createElement('div');
    noteContainer.className = 'note-container';

    // 创建文本框
    const textarea = document.createElement('div');
    textarea.className = 'note-textarea';
    textarea.contentEditable = true;
    textarea.placeholder = '在这里输入你的笔记...';

    noteContainer.appendChild(textarea);

    // 创建一个包装器元素
    const wrapper = document.createElement('div');
    wrapper.className = 'goodnote-wrapper';
    document.body.appendChild(wrapper);

    // 将笔记图标和容器添加到包装器中，而不是直接添加到 body
    wrapper.appendChild(noteIcon);
    wrapper.appendChild(noteContainer);

    // 获取当前域名作为存储键
    const storageKey = `goodnote_${window.location.hostname}`;
    const positionKey = `goodnote_position_${window.location.hostname}`;

    // 在创建textarea的部分后添加以下函数
    function linkify(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        // 处理换行符，将其替换为 <br> 标签
        const withLineBreaks = text.replace(/\n/g, '<br>');
        return withLineBreaks.replace(urlRegex, function(url) {
            return `<a href="${url}" target="_blank" class="note-link">${url}</a>`;
        });
    }

    // 添加链接点击处理
    textarea.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            window.open(e.target.href, '_blank');
        }
    });

    // 防止链接编辑时被触发
    textarea.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'A') {
            if (e.detail >= 2) { // 双击或更多次点击时允许编辑
                e.preventDefault();
            }
        }
    });

    // 修改input事件监听器
    textarea.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const content = textarea.innerHTML;
            localStorage.setItem(storageKey, content);
        }, 500);
    });

    // 修改加载保存的笔记的部分
    const savedNote = localStorage.getItem(storageKey);
    if (savedNote) {
        textarea.innerHTML = savedNote;
    }

    // 添加一个函数来获取网页标题
    async function fetchPageTitle(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            return doc.querySelector('title').innerText;
        } catch (error) {
            console.error('Error fetching page title:', error);
            return null;
        }
    }

    // 修改粘贴事件处理
    textarea.addEventListener('paste', async (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const processed_text = linkify(text);
        document.execCommand('insertHTML', false, processed_text);

        // 获取并处理标题
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = urlRegex.exec(text);
        if (match) {
            const url = match[0];
            const title = await fetchPageTitle(url);
            if (title) {
                // 只保留标题的第一个部分
                const [mainTitle] = title.split(' - ');
                // 在链接的下一行插入标题
                const titleHTML = `<div>   「${mainTitle}」 </div>`;
                document.execCommand('insertHTML', false, titleHTML);
            }
        }
    });

    // 实现拖拽功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    let rafId = null;

    noteIcon.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target === noteIcon || noteIcon.contains(e.target)) {
            isDragging = true;
            const rect = noteIcon.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            if (rafId) {
                cancelAnimationFrame(rafId);
            }

            rafId = requestAnimationFrame(() => {
                const newX = e.clientX - initialX;
                const newY = e.clientY - initialY;

                currentX = Math.min(Math.max(0, newX), window.innerWidth - noteIcon.offsetWidth);
                currentY = Math.min(Math.max(0, newY), window.innerHeight - noteIcon.offsetHeight);

                setTranslate(currentX, currentY);
            });
        }
    }

    function setTranslate(xPos, yPos) {
        const iconWidth = noteIcon.offsetWidth;
        const iconHeight = noteIcon.offsetHeight;

        // 计算图标中心点到边缘的距离
        const distanceToLeft = xPos;
        const distanceToRight = window.innerWidth - (xPos + iconWidth);
        const distanceToTop = yPos;
        const distanceToBottom = window.innerHeight - (yPos + iconHeight);

        // 设置初始透明度
        noteIcon.style.opacity = '1';

        // 只有完全接触边缘时才贴入
        if (distanceToLeft <= 0) {
            xPos = -iconWidth * 0.8;
        } else if (distanceToRight <= 0) {
            xPos = window.innerWidth - iconWidth * 0.2;
        }

        if (distanceToTop <= 0) {
            yPos = -iconHeight * 0.8;
        } else if (distanceToBottom <= 0) {
            yPos = window.innerHeight - iconHeight * 0.2;
        }

        noteIcon.style.left = `${xPos}px`;
        noteIcon.style.top = `${yPos}px`;
        noteIcon.style.right = 'auto';
        noteIcon.style.bottom = 'auto';
    }

    function dragEnd(e) {
        if (isDragging) {
            isDragging = false;

            // 使用 GM_setValue 保存全局位置
            GM_setValue('goodnote_global_position', {
                top: noteIcon.style.top,
                left: noteIcon.style.left
            });

            if (rafId) {
                cancelAnimationFrame(rafId);
            }
        }
    }

    // 修改加载保存位置的逻辑
    const savedPosition = GM_getValue('goodnote_global_position', null);
    if (savedPosition) {
        try {
            const { top, left } = savedPosition;
            setTranslate(parseInt(left), parseInt(top));
        } catch (e) {
            console.error('Failed to load saved position');
        }
    }

    // 修改笔记显示逻辑
    noteContainer.style.position = 'fixed';
    let isVisible = false;

    // 修改 toggleNote 函数，添加 pin 状态
    let isPinned = false;

    function toggleNote() {
        isVisible = !isVisible;

        if (isVisible) {
            // 每次显示笔记时重新从 localStorage 加载数据
            let savedNote = localStorage.getItem(storageKey);
            if (savedNote) {
                textarea.innerHTML = savedNote;
            }

            // 计算位置
            const iconRect = noteIcon.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const padding = 10;
            const textareaWidth = 400;

            let left = iconRect.right + padding;
            let top = Math.max(padding, iconRect.top);

            // 动态计算 max-height
            const maxHeight = windowHeight - top - padding - 30;
            textarea.style.maxHeight = `${maxHeight}px`;

            if (left + textareaWidth > windowWidth) {
                left = iconRect.left - textareaWidth - padding;
            }

            left = Math.max(padding, left);

            if (top + maxHeight > windowHeight) {
                top = windowHeight - maxHeight - padding;
            }

            top = Math.max(padding, top);

            noteContainer.style.top = `${top}px`;
            noteContainer.style.left = `${left}px`;
            noteContainer.style.display = 'block';

            requestAnimationFrame(() => {
                noteContainer.classList.add('active');
                setTimeout(() => {
                    textarea.focus();
                }, 50);
            });
        } else {
            noteContainer.classList.remove('active');
            setTimeout(() => {
                noteContainer.style.display = 'none';
            }, 300);
        }
    }

    // 添加快捷键监听
    document.addEventListener('keydown', (e) => {
        // 检查是否是 Mac
        const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

        if ((isMac && e.metaKey || !isMac && e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
            e.preventDefault(); // 阻止默认行为
            toggleNote();
        }
    });

    // 创建 pin 按钮样式
    const pinButtonStyle = `
        .pin-button {
            position: absolute;
            top: 10px;
            right:10px;
            padding: 5px;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0.9;
            transition: opacity 0.2s;
            z-index: 10000;
        }
        .pin-button:hover {
            opacity: 1;
        }
        .pin-button.pinned {
            color: #409eff;
            opacity: 1;
        }
    `;

    // 将样式添加到现有的样式表中
    style.textContent += pinButtonStyle;

    // 创建 pin 按钮
    const pinButton = document.createElement('button');
    pinButton.className = 'pin-button';
    pinButton.innerHTML = '📍';
    pinButton.title = '固定笔记';
    noteContainer.appendChild(pinButton);

    // 添加 pin 按钮点击事件
    pinButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isPinned = !isPinned;
        pinButton.classList.toggle('pinned');
        pinButton.innerHTML = isPinned ? '[📍]' : '📍';
        pinButton.title = isPinned ? '取消固定' : '固定笔记';
    });

    // 更新触摸拖动函数
    function setupTouchDrag(element) {
        let startX, startY, initialX, initialY;
        let isTouchDragging = false;
        let touchStartTime = 0;
        let touchMoveDistance = 0;

        element.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialX = parseInt(element.style.left, 10) || 0;
            initialY = parseInt(element.style.top, 10) || 0;
            touchStartTime = Date.now();
            touchMoveDistance = 0;
            isTouchDragging = false;
            e.preventDefault();
        });

        element.addEventListener('touchmove', function(e) {
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            touchMoveDistance = Math.sqrt(dx * dx + dy * dy);
            
            // 如果移动距离超过5px则认为是拖动
            if(touchMoveDistance > 5) {
                isTouchDragging = true;
                element.style.left = `${initialX + dx}px`;
                element.style.top = `${initialY + dy}px`;
            }
            e.preventDefault();
        });

        element.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            
            // 如果触摸时间小于200ms且移动距离小于5px,则认为是点击
            if(touchDuration < 200 && touchMoveDistance < 5 && !isTouchDragging) {
                toggleNote();
            }

            // 保存图标位置
            if(isTouchDragging) {
                GM_setValue('goodnote_global_position', {
                    top: element.style.top,
                    left: element.style.left
                });
            }
            
            e.preventDefault();
        });
    }

    // 初始化拖动功能
    function initializeDragAndDrop() {
        const draggableElement = document.querySelector('.note-icon');
        if (draggableElement) {
            setupTouchDrag(draggableElement);
        } else {
            console.error('Draggable element not found');
        }
    }

    // 自动保存功能
    let saveTimeout;

    // 在页面加载时重置状态
    window.addEventListener('load', () => {
        GM_setValue('goodNoteIconInserted', false);
    });
    initializeDragAndDrop();

    // 在创建笔记图标后，添加设置相关代码
    const HOVER_MODE_KEY = 'goodnote_hover_mode';
    let hoverMode = GM_getValue(HOVER_MODE_KEY, false); // 默认为点击模式

    // 添加设置菜单
    GM_registerMenuCommand('切换打开模式 (点击/悬停)', toggleHoverMode);

    function toggleHoverMode() {
        hoverMode = !hoverMode;
        GM_setValue(HOVER_MODE_KEY, hoverMode);
        // 显示当前模式
        alert(`已切换为${hoverMode ? '悬停' : '点击'}打开模式`);
        updateNoteIconListeners();
    }

    // 更新图标的事件监听器
    function updateNoteIconListeners() {
        // 移除所有现有的事件监听器
        noteIcon.removeEventListener('mouseenter', handleHover);
        noteIcon.removeEventListener('mouseleave', handleMouseLeave);
        noteIcon.removeEventListener('click', handleClick);
        
        // 移除旧的点击事件监听器
        noteIcon.removeEventListener('click', (e) => {
            if (!isDragging) {
                toggleNote();
            }
        });

        if (hoverMode) {
            // 悬停模式只添加 mouseenter 事件
            noteIcon.addEventListener('mouseenter', handleHover);
        } else {
            // 点击模式
            noteIcon.addEventListener('click', handleClick);
        }
    }

    // 修改点击其他地方关闭笔记的逻辑
    document.removeEventListener('click', handleDocumentClick); // 先移除可能存在的事件监听器

    function handleDocumentClick(e) {
        // 确保点击不是发生在笔记图标、笔记容器或者pin按钮上
        const isClickOutside = !noteContainer.contains(e.target) && 
                              !noteIcon.contains(e.target) && 
                              !pinButton.contains(e.target);
        
        if (isVisible && !isPinned && isClickOutside) {
            toggleNote();
        }
    }

    // 重新添加文档点击事件监听器
    document.addEventListener('click', handleDocumentClick);

    // 修改处理点击事件的函数
    function handleClick(e) {
        if (!isDragging) {
            e.stopPropagation(); // 阻止事件冒泡
            toggleNote();
        }
    }

    // 修改处理悬停事件的函数
    function handleHover(e) {
        if (!isVisible && !isDragging) {
            toggleNote();
        }
    }

    // 修改处理鼠标离开事件的函数
    function handleMouseLeave(e) {
        // 移除自动关闭的逻辑
        // 现在只需要点击空白处来关闭
    }

    // 初始化事件监听器
    updateNoteIconListeners();

})();

