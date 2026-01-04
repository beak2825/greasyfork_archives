// ==UserScript==
// @name         護眼＆黑暗模式切換+自動瀏覽
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  切換模式&點擊兩下自動瀏覽
// @author       Tang yuan+ChatGPT
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533542/%E8%AD%B7%E7%9C%BC%EF%BC%86%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8F%9B%2B%E8%87%AA%E5%8B%95%E7%80%8F%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/533542/%E8%AD%B7%E7%9C%BC%EF%BC%86%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8F%9B%2B%E8%87%AA%E5%8B%95%E7%80%8F%E8%A6%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const modes = {
        eyeCare: {
            background: '#ffc0cb',
            color: '#000000',
            icon: '☀️'
        },
        dark: {
            background: '#121212',
            color: '#f1f1f1',
            icon: '🌙'
        }
    };

    let currentMode = localStorage.getItem('mode') || autoDetectMode();

    const style = document.createElement('style');
    style.innerHTML = `
        .mode-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: grab;
            font-size: 18px;
            user-select: none;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
            transition: background-color 0.4s ease, color 0.4s ease;
        }
        .mode-toggle-btn:active {
            cursor: grabbing;
        }
        body, * {
            transition: background-color 0.4s ease, color 0.4s ease !important;
        }
    `;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.className = 'mode-toggle-btn';
    document.body.appendChild(button);

    function autoDetectMode() {
        const hour = new Date().getHours();
        return (hour >= 18 || hour < 6) ? 'dark' : 'eyeCare';
    }

    function applyMode(mode) {
        document.body.style.backgroundColor = modes[mode].background;
        document.body.style.color = modes[mode].color;
        button.textContent = modes[mode].icon;

        document.querySelectorAll('*').forEach(el => {
            const tag = el.tagName.toLowerCase();
            if (['img', 'video', 'canvas'].includes(tag)) return;

            const bg = getComputedStyle(el).backgroundColor;
            const rgb = bg.match(/\d+/g);
            if (!rgb) return;
            const brightness = rgb.slice(0, 3).reduce((a, b) => a + parseInt(b), 0);
            if (brightness > 600 || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
                el.style.backgroundColor = modes[mode].background;
                el.style.color = modes[mode].color;
            }
        });

        currentMode = mode;
        localStorage.setItem('mode', mode);
    }

    button.addEventListener('click', () => {
        const newMode = currentMode === 'eyeCare' ? 'dark' : 'eyeCare';
        applyMode(newMode);
    });

// 拖曳功能（支援滑鼠與觸控）
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const dragStart = (x, y) => {
        isDragging = true;
        const rect = button.getBoundingClientRect();
        offsetX = x - rect.left;
        offsetY = y - rect.top;
    };

    const dragMove = (x, y) => {
        if (!isDragging) return;
        button.style.left = `${x - offsetX}px`;
        button.style.top = `${y - offsetY}px`;
        button.style.right = 'auto';
    };

    const dragEnd = () => {
        isDragging = false;
    };

    // 滑鼠事件
    button.addEventListener('mousedown', (e) => dragStart(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => dragMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', dragEnd);

    // 觸控事件
    button.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        dragStart(touch.clientX, touch.clientY);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        dragMove(touch.clientX, touch.clientY);
    }, { passive: false });

    document.addEventListener('touchend', dragEnd);
})();

    // 自動滾動：雙擊啟動/停止
    let scrollTimer = null;
    let isAutoScrolling = false;

    document.addEventListener('dblclick', () => {
        if (isAutoScrolling) {
            clearInterval(scrollTimer);
            isAutoScrolling = false;
            return;
        }
        scrollTimer = setInterval(() => {
            window.scrollBy(0, 2);
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                clearInterval(scrollTimer);
                isAutoScrolling = false;
            }
        }, 20);
        isAutoScrolling = true;
    });