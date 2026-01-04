// ==UserScript==
// @name         Bilibili 视频缩放控制器（带按钮+快捷键）
// @namespace    https://chat.openai.com/
// @version      1.4
// @description  B站视频放大缩小，右上浮动控件+快捷键（Shift+↑↓0），支持拖动，定时检测视频元素更新
// @author       OpenAI
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542387/Bilibili%20%E8%A7%86%E9%A2%91%E7%BC%A9%E6%94%BE%E6%8E%A7%E5%88%B6%E5%99%A8%EF%BC%88%E5%B8%A6%E6%8C%89%E9%92%AE%2B%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542387/Bilibili%20%E8%A7%86%E9%A2%91%E7%BC%A9%E6%94%BE%E6%8E%A7%E5%88%B6%E5%99%A8%EF%BC%88%E5%B8%A6%E6%8C%89%E9%92%AE%2B%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scale = 1.0;
    const step = 0.1;
    let targetElem = null; // 缩放目标元素
    let controlPanel = null;

    function createControlPanel() {
        if (controlPanel) return;

        controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.top = '80px';
        controlPanel.style.right = '20px';
        controlPanel.style.zIndex = 999999;
        controlPanel.style.background = 'rgba(0,0,0,0.6)';
        controlPanel.style.borderRadius = '10px';
        controlPanel.style.padding = '10px';
        controlPanel.style.display = 'flex';
        controlPanel.style.flexDirection = 'column';
        controlPanel.style.gap = '8px';
        controlPanel.style.userSelect = 'none';
        controlPanel.style.cursor = 'move';
        controlPanel.style.width = '50px';

        controlPanel.innerHTML = `
            <button id="zoomInBtn" style="font-size:18px; padding:6px;">🔍+</button>
            <button id="zoomOutBtn" style="font-size:18px; padding:6px;">🔎-</button>
            <button id="resetZoomBtn" style="font-size:18px; padding:6px;">♻️</button>
        `;

        document.body.appendChild(controlPanel);

        document.getElementById('zoomInBtn').onclick = () => {
            scale += step;
            applyScale();
        };
        document.getElementById('zoomOutBtn').onclick = () => {
            scale = Math.max(step, scale - step);
            applyScale();
        };
        document.getElementById('resetZoomBtn').onclick = () => {
            scale = 1.0;
            applyScale();
        };

        // 拖动功能
        let isDragging = false, startX, startY, origX, origY;
        controlPanel.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = controlPanel.getBoundingClientRect();
            origX = rect.right;
            origY = rect.top;
            e.preventDefault();
        });
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const dx = startX - e.clientX;
            const dy = e.clientY - startY;
            controlPanel.style.top = `${origY + dy}px`;
            controlPanel.style.right = `${dx}px`;
        });
    }

    function applyScale() {
        if (!targetElem) return;
        targetElem.style.transform = `scale(${scale})`;
        targetElem.style.transformOrigin = 'center center';
        targetElem.style.transition = 'transform 0.2s ease';
        console.log(`视频缩放倍数: ${scale.toFixed(2)}x`);
    }

    function detectTarget() {
        const video = document.querySelector('video');
        if (video) {
            let parent = video.parentElement;
            for (let i = 0; i < 5; i++) {
                if (!parent) break;
                if (parent.style && parent.style.transform !== undefined) {
                    targetElem = parent;
                    break;
                }
                parent = parent.parentElement;
            }
            if (!targetElem) targetElem = video;
        } else {
            targetElem = null;
        }
    }

    function init() {
        createControlPanel();

        window.addEventListener('keydown', e => {
            if (!e.shiftKey) return;
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

            switch (e.key) {
                case 'ArrowUp':
                    scale += step;
                    applyScale();
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    scale = Math.max(step, scale - step);
                    applyScale();
                    e.preventDefault();
                    break;
                case '0':
                    scale = 1.0;
                    applyScale();
                    e.preventDefault();
                    break;
            }
        });

        setInterval(() => {
            detectTarget();
            applyScale();
        }, 1000);
    }

    window.onload = init;
})();
