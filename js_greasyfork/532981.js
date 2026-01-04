// ==UserScript==
// @name         Eye & Dark Mode Toggle (可拖曳懸浮按鈕)
// @namespace    https://chat.openai.com/
// @version      1.1
// @description  懸浮按鈕切換護眼模式與黑暗模式，並可自由拖曳按鈕位置！支援手機與桌機！
// @author       ChatGPT 改寫 
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532981/Eye%20%20Dark%20Mode%20Toggle%20%28%E5%8F%AF%E6%8B%96%E6%9B%B3%E6%87%B8%E6%B5%AE%E6%8C%89%E9%88%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532981/Eye%20%20Dark%20Mode%20Toggle%20%28%E5%8F%AF%E6%8B%96%E6%9B%B3%E6%87%B8%E6%B5%AE%E6%8C%89%E9%88%95%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const colors = {
        default: '#ffffff',
        eyeCare: '#ffe4b5',   // 護眼模式
        darkMode: '#1e1e1e'   // 黑暗模式
    };

    let currentMode = 'default';

    const button = document.createElement('button');
    button.innerText = '切換模式';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.left = '20px';
    button.style.zIndex = '999999';
    button.style.padding = '10px 15px';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.background = '#333';
    button.style.color = '#fff';
    button.style.fontSize = '16px';
    button.style.cursor = 'move';
    button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    button.style.userSelect = 'none';

    document.body.appendChild(button);

    // 模式切換功能
    function switchMode() {
        if (currentMode === 'default') {
            document.body.style.backgroundColor = colors.eyeCare;
            updateElementsBackground(colors.eyeCare);
            currentMode = 'eyeCare';
        } else if (currentMode === 'eyeCare') {
            document.body.style.backgroundColor = colors.darkMode;
            updateElementsBackground(colors.darkMode, '#ffffff');
            currentMode = 'darkMode';
        } else {
            document.body.style.backgroundColor = colors.default;
            updateElementsBackground(colors.default, '#000000');
            currentMode = 'default';
        }
    }

    button.addEventListener('click', switchMode);

    // 更新所有元素背景與文字顏色
    function updateElementsBackground(bgColor, textColor) {
        const all = document.querySelectorAll('*');
        all.forEach(el => {
            const computed = window.getComputedStyle(el);
            const currentBg = computed.backgroundColor;
            if (currentBg === 'rgba(0, 0, 0, 0)' || currentBg === 'transparent' || currentBg === 'rgb(255, 255, 255)') {
                el.style.backgroundColor = bgColor;
            }
            if (textColor) {
                el.style.color = textColor;
            }
        });
    }

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