// ==UserScript==
// @name         AtStudy全屏悬浮聊天窗口
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在AtStudy全屏播放时显示动态悬浮聊天窗口(支持头像)，修复特殊符号显示问题
// @author       jjccuut
// @match        https://www.atstudy.com/learn/*
// @grant        GM_addStyle
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538973/AtStudy%E5%85%A8%E5%B1%8F%E6%82%AC%E6%B5%AE%E8%81%8A%E5%A4%A9%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/538973/AtStudy%E5%85%A8%E5%B1%8F%E6%82%AC%E6%B5%AE%E8%81%8A%E5%A4%A9%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 样式部分
    GM_addStyle(`
        #floating-chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            height: 400px;
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            display: none;
            overflow: hidden;
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
            border: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            max-height: 90vh;
            min-height: 200px;
            min-width: 220px;
        }
        #floating-chat-header {
            padding: 10px 15px;
            background-color: #2196F3;
            color: white;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 15px;
            flex-shrink: 0;
        }
        #floating-chat-close {
            cursor: pointer;
            font-size: 18px;
            padding: 0 5px;
        }
        #floating-chat-messages {
            overflow-y: auto;
            flex: 1 1 0%;
            padding: 5px 0;
            scrollbar-width: thin;
        }
        #floating-chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        #floating-chat-messages::-webkit-scrollbar-thumb {
            background-color: #bdbdbd;
            border-radius: 3px;
        }
        .floating-chat-message {
            padding: 10px 15px;
            border-bottom: 1px solid #f0f0f0;
            animation: fadeIn 0.3s ease-out;
            display: flex;
        }
        .floating-chat-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            margin-right: 10px;
            object-fit: cover;
            flex-shrink: 0;
        }
        .floating-chat-message-content {
            flex: 1;
            min-width: 0;
        }
        .floating-chat-user {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
        }
        .floating-chat-actor {
            background-color: #ff9800;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-right: 8px;
        }
        .floating-chat-username {
            font-weight: bold;
            font-size: 14px;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .floating-chat-content {
            font-size: 14px;
            color: #333;
            word-break: break-word;
            line-height: 1.5;
        }
        #floating-chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            background-color: #2196F3;
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 999998;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            font-size: 18px;
            transition: transform 0.2s;
        }
        #floating-chat-toggle:hover {
            transform: scale(1.1);
        }
        .teacher-msg .floating-chat-content {
            color: #2196f3 !important;
        }
        .system-msg .floating-chat-content {
            color: #888 !important;
            font-style: italic;
        }
        .default-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            font-size: 16px;
            margin-right: 10px;
            flex-shrink: 0;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `);

    // 悬浮窗口HTML结构
    const floatingChatHTML = `
        <div id="floating-chat-container">
            <div id="floating-chat-header">
                <span>课程聊天</span>
                <span id="floating-chat-close">×</span>
            </div>
            <div id="floating-chat-messages"></div>
        </div>
        <div id="floating-chat-toggle">💬</div>
    `;
    document.body.insertAdjacentHTML('beforeend', floatingChatHTML);

    const floatingChatContainer = document.getElementById('floating-chat-container');
    const floatingChatToggle = document.getElementById('floating-chat-toggle');
    const floatingChatClose = document.getElementById('floating-chat-close');
    const floatingChatMessages = document.getElementById('floating-chat-messages');

    // 从localStorage加载保存的尺寸
    const savedWidth = localStorage.getItem('floatingChatWidth');
    const savedHeight = localStorage.getItem('floatingChatHeight');
    if (savedWidth && savedHeight) {
        floatingChatContainer.style.width = savedWidth + 'px';
        floatingChatContainer.style.height = savedHeight + 'px';
    }

    floatingChatToggle.addEventListener('click', () => {
        const isShow = floatingChatContainer.style.display === 'block' ? false : true;
        floatingChatContainer.style.display = isShow ? 'flex' : 'none';
        if (isShow) {
            // 修复滚动条问题
            setTimeout(() => {
                floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;
                // 强制重排确保滚动条正确显示
                floatingChatMessages.style.display = 'none';
                void floatingChatMessages.offsetHeight;
                floatingChatMessages.style.display = '';
            }, 10);
        }
    });

    floatingChatClose.addEventListener('click', () => {
        floatingChatContainer.style.display = 'none';
    });

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    function handleFullscreenChange() {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
        const container = isFullscreen || document.body;
        if (!container.contains(floatingChatContainer)) container.appendChild(floatingChatContainer);
        floatingChatContainer.style.display = isFullscreen ? 'flex' : 'none';
        floatingChatToggle.style.display = isFullscreen ? 'none' : 'flex';
        
        // 全屏时确保滚动到底部
        if (isFullscreen) {
            setTimeout(() => {
                floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;
            }, 100);
        }
    }

    // 头像缓存与消息去重
    const userAvatarCache = new Map();
    const shownMessages = new Map();

    let chatObserver = null;

    // 转义HTML特殊字符的函数
    function escapeHtml(text) {
        if (!text) return text;
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
   function displayableUserName(userName) {
    if (!userName) return '匿名用户';
    
    const specialChars = {
        8206: '&amp;lrm;',    // to display as text "&lrm;"
        8207: '&amp;rlm;',    // to display as text "&rlm;"
        8238: '&amp;#x202e;', // to display as text "&#x202e;"
        8203: '&amp;#x200b;', // to display as text "&#x200b;"
        8205: '&amp;#x200c;', // to display as text "&#x200c;"
        8204: '&amp;#x200d;', // to display as text "&#x200d;"
        8202: '&amp;#x200a;', // to display as text "&#x200a;"
        8201: '&amp;#x2009;', // to display as text "&#x2009;"
        8200: '&amp;#x2000;', // to display as text "&#x2000;"
        8208: '&amp;#x2010;', // to display as text "&#x2010;"
        8209: '&amp;#x2011;', // to display as text "&#x2011;"
        8211: '&amp;#x2013;', // to display as text "&#x2013;"
        8212: '&amp;#x2014;', // to display as text "&#x2014;"
        8213: '&amp;#x2015;'  // to display as text "&#x2015;"
    };
    
    const codePoints = [...userName];
    const mapped = codePoints.map(cp => {
        const code = cp.codePointAt(0);
        return specialChars[code] || escapeHtml(cp);
    });
    
    return mapped.join('');
}


    function observeChatMessages() {
        // 只监听聊天区容器
        const chatContainer = document.querySelector('.polyv-msg-main')?.closest('ul') || document.querySelector('.chat-container');

        if (!chatContainer) {
            setTimeout(observeChatMessages, 1000);
            GM_log('未找到聊天容器，1秒后重试...');
            return;
        }
        GM_log('已找到聊天容器:', chatContainer);

        // 防止重复绑定
        if (chatObserver) return;

        chatObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('li')) {
                        // 聊天区消息
                        const msg = node.querySelector('.polyv-msg-main');
                        if (msg) processNewMessage(msg);
                    }
                });
            });
        });
        chatObserver.observe(chatContainer, { childList: true, subtree: false });

        // 首次加载已有消息
        chatContainer.querySelectorAll('li .polyv-msg-main').forEach(processNewMessage);

        preloadUserAvatars();
        GM_log('已开始监测聊天消息...');
    }

    function preloadUserAvatars() {
        document.querySelectorAll('li').forEach(li => {
            const userId = li.id;
            const img = li.querySelector('.polyv-user-logo img');
            if (userId && img && img.src) {
                userAvatarCache.set(userId, img.src.startsWith('http') ? img.src : 'https:' + img.src);
            }
        });
    }

    function linkifyTextNodes(node) {
        // 只处理文本节点
        if (node.nodeType === Node.TEXT_NODE) {
            const urlRegex = /(https?:\/\/[^\s<]+)/g;
            if (urlRegex.test(node.nodeValue)) {
                const span = document.createElement('span');
                span.innerHTML = node.nodeValue.replace(
                    urlRegex,
                    url => `<a href="${url}" target="_blank" style="color:#2196f3;text-decoration:underline;">${url}</a>`
                );
                node.parentNode.replaceChild(span, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
            node.childNodes.forEach(linkifyTextNodes);
        }
    }

    function processNewMessage(messageElement) {
        const liElement = messageElement.closest('li');
        // 转义用户名中的特殊字符
        let userName = messageElement.querySelector('.polyv-user-name')?.textContent.trim() || '匿名用户';
        userName = displayableUserName(userName);
        
        // 转义用户角色中的特殊字符
        let userActor = messageElement.querySelector('.polyv-user-actor')?.textContent.trim() || '';
        userActor = escapeHtml(userActor);
        
        const msgTextElem = messageElement.querySelector('.polyv-msg-text');
        let msgContent = '';
        if (msgTextElem) {
            // 先克隆节点，避免污染原 DOM
            const clone = msgTextElem.cloneNode(true);
            linkifyTextNodes(clone);
            msgContent = clone.innerHTML.trim();
            // 修复 &nbsp; 显示为文本的问题
            msgContent = msgContent.replace(/&nbsp;/g, ' ');
        } else {
            msgContent = messageElement.textContent.trim();
        }
        // 去重key也用HTML
        const msgKey = userName + '|' + msgContent.replace(/\s+/g, '');
        const now = Date.now();

        if (shownMessages.has(msgKey) && now - shownMessages.get(msgKey) < 2000) return;
        shownMessages.set(msgKey, now);

        const isTeacher = userActor.includes('讲师') || userActor.includes('老师');
        const isSystem = userActor.includes('系统') || userName.includes('系统');

        // 优先 li 下的头像
        let avatarHTML = `<div class="default-avatar">${userName.charAt(0) || '?'}</div>`;
        const avatarImg = liElement?.querySelector('.polyv-user-logo img');
        if (avatarImg && avatarImg.src) {
            const src = avatarImg.src.startsWith('http') ? avatarImg.src : 'https:' + avatarImg.src;
            avatarHTML = `<img class="floating-chat-avatar" src="${src}" alt="${userName}">`;
        } else if (userId && userAvatarCache.has(userId)) {
            avatarHTML = `<img class="floating-chat-avatar" src="${userAvatarCache.get(userId)}" alt="${userName}">`;
        }

        const messageHTML = `
            <div class="floating-chat-message">
                ${avatarHTML}
                <div class="floating-chat-message-content">
                    <div class="floating-chat-user">
                        ${userActor ? `<span class="floating-chat-actor">${userActor}</span>` : ''}
                        <span class="floating-chat-username">${userName}</span>
                    </div>
                    <div class="floating-chat-content ${isTeacher ? 'teacher-msg' : ''} ${isSystem ? 'system-msg' : ''}">
                        ${msgContent}
                    </div>
                </div>
            </div>
        `;

        floatingChatMessages.insertAdjacentHTML('beforeend', messageHTML);
        floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;
    }

    let noChatPanelCount = 0; // 连续未检测到聊天窗口的次数

    // 定时检测聊天窗口是否存在，不存在则自动关闭悬浮聊天窗口
    function autoCloseFloatingChatIfNoChatPanel() {
        const chatPanel = document.getElementById('polyv-chat');
        if (!chatPanel) {
            noChatPanelCount++;
            floatingChatContainer.style.display = 'none';
            floatingChatToggle.style.display = 'none';
            GM_log(`未检测到聊天窗口，第${noChatPanelCount}次`);
            if (noChatPanelCount >= 10) {
                // 移除所有相关DOM并彻底停止检测
                floatingChatContainer.remove();
                floatingChatToggle.remove();
                GM_log('连续10次未检测到聊天窗口，已彻底关闭脚本');
                return;
            }
        } else {
            // 检测到聊天窗口，重置计数并恢复按钮
            noChatPanelCount = 0;
            floatingChatToggle.style.display = 'flex';
        }
        setTimeout(autoCloseFloatingChatIfNoChatPanel, 2000); // 每2秒检测一次
    }

    setTimeout(observeChatMessages, 1000);
    setTimeout(autoCloseFloatingChatIfNoChatPanel, 2000);

    // 悬浮窗口拖拽移动
    let isMoving = false, moveOffsetX = 0, moveOffsetY = 0;
    const header = document.getElementById('floating-chat-header');
    header.style.cursor = 'move';

    header.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isMoving = true;
        const rect = floatingChatContainer.getBoundingClientRect();
        moveOffsetX = e.clientX - rect.left;
        moveOffsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
        if (!isMoving) return;
        let left = e.clientX - moveOffsetX;
        let top = e.clientY - moveOffsetY;
        // 限制不超出窗口
        left = Math.max(0, Math.min(window.innerWidth - floatingChatContainer.offsetWidth, left));
        top = Math.max(0, Math.min(window.innerHeight - floatingChatContainer.offsetHeight, top));
        floatingChatContainer.style.left = left + 'px';
        floatingChatContainer.style.top = top + 'px';
        floatingChatContainer.style.right = 'auto';
        floatingChatContainer.style.bottom = 'auto';
        floatingChatContainer.style.position = 'fixed';
    });
    document.addEventListener('mouseup', function() {
        isMoving = false;
        document.body.style.userSelect = '';
    });

    // 悬浮窗口边缘拖拽缩放
    const resizer = document.createElement('div');
    resizer.style.position = 'absolute';
    resizer.style.right = '0';
    resizer.style.bottom = '0';
    resizer.style.width = '18px';
    resizer.style.height = '18px';
    resizer.style.cursor = 'se-resize';
    resizer.style.background = 'rgba(88,166,255,0.15)';
    resizer.style.borderBottomRightRadius = '8px';
    resizer.title = '拖动调整窗口大小';
    floatingChatContainer.appendChild(resizer);

    let isResizing = false, resizeStartX = 0, resizeStartY = 0, startWidth = 0, startHeight = 0;
    resizer.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        startWidth = floatingChatContainer.offsetWidth;
        startHeight = floatingChatContainer.offsetHeight;
        document.body.style.userSelect = 'none';
        e.stopPropagation();
    });
    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        let newWidth = startWidth + (e.clientX - resizeStartX);
        let newHeight = startHeight + (e.clientY - resizeStartY);
        // 限制最小尺寸
        newWidth = Math.max(220, Math.min(window.innerWidth - 20, newWidth));
        newHeight = Math.max(120, Math.min(window.innerHeight - 20, newHeight));
        floatingChatContainer.style.width = newWidth + 'px';
        floatingChatContainer.style.height = newHeight + 'px';
        floatingChatContainer.style.maxHeight = 'unset';
    });
    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            document.body.style.userSelect = '';
            // 保存尺寸
            localStorage.setItem('floatingChatWidth', floatingChatContainer.offsetWidth);
            localStorage.setItem('floatingChatHeight', floatingChatContainer.offsetHeight);
        }
    });

    // 保证窗口初始定位
    floatingChatContainer.style.left = '';
    floatingChatContainer.style.top = '';
    floatingChatContainer.style.right = '20px';
    floatingChatContainer.style.bottom = '20px';
})();