// ==UserScript==
// @name         Gemini - Quick Navigation for AI Conversations
// @name:zh-CN   Gemini - AI对话快速导航
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Add navigation buttons to the Gemini conversation page: switch up and down between AI answers, and jump to the top/bottom with one click
// @description:zh-CN  在Gemini对话页面添加导航按钮：上下切换AI回答，一键到顶部/底部
// @author       Epodak
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545610/Gemini%20-%20Quick%20Navigation%20for%20AI%20Conversations.user.js
// @updateURL https://update.greasyfork.org/scripts/545610/Gemini%20-%20Quick%20Navigation%20for%20AI%20Conversations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .nav-buttons-container {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .nav-button {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid #4285f4;
            background: white;
            color: #4285f4;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .extreme-button {
            width: 40px;
            height: 40px;
            font-size: 16px;
            border-color: #ea4335;
        }

        .extreme-button:hover {
            background: #ea4335;
            color: white;
        }

        .nav-button:hover {
            background: #4285f4;
            color: white;
            transform: scale(1.1);
        }

        .nav-button.disabled {
            opacity: 0.5;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // 创建按钮
    const navContainer = document.createElement('div');
    navContainer.className = 'nav-buttons-container';

    const topButton = document.createElement('div');
    topButton.className = 'nav-button extreme-button';
    topButton.innerHTML = '⤴';
    topButton.title = '跳转到顶部';

    const upButton = document.createElement('div');
    upButton.className = 'nav-button';
    upButton.innerHTML = '↑';
    upButton.title = '上一个AI回答';

    const downButton = document.createElement('div');
    downButton.className = 'nav-button';
    downButton.innerHTML = '↓';
    downButton.title = '下一个AI回答';

    const bottomButton = document.createElement('div');
    bottomButton.className = 'nav-button extreme-button';
    bottomButton.innerHTML = '⤵';
    bottomButton.title = '跳转到底部';

    navContainer.append(topButton, upButton, downButton, bottomButton);
    document.body.appendChild(navContainer);

    // 获取所有AI回答
    function getAllResponses() {
        return Array.from(document.querySelectorAll('model-response'));
    }

    // 获取当前中心的AI回答
    function getCurrentResponse() {
        const responses = getAllResponses();
        if (!responses.length) return null;

        const center = window.innerHeight / 2;
        let closest = responses[0];
        let minDistance = Infinity;

        for (const response of responses) {
            const rect = response.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height / 2 - center);
            if (distance < minDistance) {
                minDistance = distance;
                closest = response;
            }
        }
        return closest;
    }

    // 跳转到指定回答
    function scrollTo(response) {
        if (response) {
            response.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // 上一个回答
    function goPrevious() {
        const responses = getAllResponses();
        if (!responses.length) return;

        const current = getCurrentResponse();
        const index = responses.indexOf(current);

        if (index > 0) {
            scrollTo(responses[index - 1]);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // 下一个回答
    function goNext() {
        const responses = getAllResponses();
        if (!responses.length) return;

        const current = getCurrentResponse();
        const index = responses.indexOf(current);

        if (index < responses.length - 1) {
            scrollTo(responses[index + 1]);
        }
    }

    // 查找实际的滚动容器
    function findScrollContainer() {
        // 从model-response元素向上查找有滚动的父容器
        const firstResponse = document.querySelector('model-response');
        if (firstResponse) {
            let element = firstResponse.parentElement;
            while (element && element !== document.body) {
                const hasScroll = element.scrollHeight > element.clientHeight;
                const overflowY = window.getComputedStyle(element).overflowY;

                if (hasScroll && (overflowY === 'auto' || overflowY === 'scroll')) {
                    return element;
                }
                element = element.parentElement;
            }
        }
        return null;
    }

    // 跳转到顶部
    function goTop() {
        const scrollContainer = findScrollContainer();
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        } else {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }

    // 跳转到底部（优化版：先快速到底部，再定位到最后AI回答）
    function goBottom() {
        // 1. 先快速跳转到页面最底部（模拟End键）
        const scrollContainer = findScrollContainer();
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
        }

        // 2. 等待一下让内容加载，然后定位到最后一个AI回答
        setTimeout(() => {
            const responses = getAllResponses();
            if (responses.length > 0) {
                scrollTo(responses[responses.length - 1]);
            }
        }, 200);
    }

    // 更新按钮状态
    function updateButtons() {
        const responses = getAllResponses();
        const current = getCurrentResponse();

        if (!responses.length || !current) {
            upButton.classList.add('disabled');
            downButton.classList.add('disabled');
            return;
        }

        const index = responses.indexOf(current);

        // 只有在页面顶部且是第一个回答时禁用上一个按钮
        upButton.classList.toggle('disabled',
            window.scrollY <= 10 && index === 0);

        // 下一个按钮基本不禁用
        downButton.classList.remove('disabled');

        // TOP和BOTTOM按钮始终可用
        topButton.classList.remove('disabled');
        bottomButton.classList.remove('disabled');
    }

    // 事件监听
    topButton.onclick = goTop;
    upButton.onclick = goPrevious;
    downButton.onclick = goNext;
    bottomButton.onclick = goBottom;

    // 滚动监听
    let timer;
    window.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(updateButtons, 100);
    });

    // DOM变化监听
    new MutationObserver(() => {
        setTimeout(updateButtons, 200);
    }).observe(document.body, { childList: true, subtree: true });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea, [contenteditable="true"]')) return;

        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
            e.preventDefault();
            goPrevious();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown') {
            e.preventDefault();
            goNext();
        }
        // 移除Ctrl+Home快捷键，因为它在Gemini中不工作
        // 保留Ctrl+End是为了与goBottom功能一致
        if ((e.ctrlKey || e.metaKey) && e.key === 'End') {
            e.preventDefault();
            goBottom();
        }
    });

    // 初始化
    setTimeout(updateButtons, 1000);

})();