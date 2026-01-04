// ==UserScript==
// @name         B站精准宽屏对齐
// @namespace    https://bilibili.com/
// @version      1.4
// @description  很小众的功能
// @author       YourName
// @match        *://www.bilibili.com/video/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527665/B%E7%AB%99%E7%B2%BE%E5%87%86%E5%AE%BD%E5%B1%8F%E5%AF%B9%E9%BD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/527665/B%E7%AB%99%E7%B2%BE%E5%87%86%E5%AE%BD%E5%B1%8F%E5%AF%B9%E9%BD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化按钮
    const initButton = () => {
        const btn = document.createElement('button');
        btn.innerHTML = '⇓';
        btn.title = '拖拽移动｜点击对齐';
        btn.style.cssText = `
            position: fixed;
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #00a1d6;
            border: none;
            color: white;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-family: system-ui;
            transition: transform 0.2s, opacity 0.2s;
            opacity: 0.9;
            touch-action: none;
        `;
        return btn;
    };

    // 加载保存的位置
    const loadPosition = () => {
        const saved = GM_getValue('btnPos', { x: window.innerWidth - 60, y: 70 });
        return {
            x: Math.min(saved.x, window.innerWidth - 40),
            y: Math.min(saved.y, window.innerHeight - 40)
        };
    };

    const btn = initButton();
    const initialPos = loadPosition();
    Object.assign(btn.style, {
        left: `${initialPos.x}px`,
        top: `${initialPos.y}px`
    });

    // 拖拽逻辑
    let isDragging = false;
    let hasMoved = false;
    let clickOffset = { x: 0, y: 0 };

    const startDrag = (e) => {
        isDragging = true;
        hasMoved = false;

        const rect = btn.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        clickOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };

        // 视觉效果设置
        btn.style.cursor = 'move';
        btn.style.transform = 'scale(1.1)';
        btn.style.transition = 'transform 0.2s'; // 保持缩放动画
        btn.style.opacity = '1';

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    };

    const drag = (e) => {
        if (!isDragging) return;

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        let newX = clientX - clickOffset.x;
        let newY = clientY - clickOffset.y;

        // 检测有效移动
        if (Math.abs(newX - parseInt(btn.style.left)) > 2 ||
            Math.abs(newY - parseInt(btn.style.top)) > 2) {
            hasMoved = true;
        }

        newX = Math.max(0, Math.min(newX, window.innerWidth - btn.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - btn.offsetHeight));

        btn.style.left = `${newX}px`;
        btn.style.top = `${newY}px`;
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;

        // 保存位置
        GM_setValue('btnPos', {
            x: parseInt(btn.style.left),
            y: parseInt(btn.style.top)
        });

        // 恢复样式
        btn.style.cursor = 'pointer';
        btn.style.transform = 'scale(1)';
        btn.style.transition = 'transform 0.2s, opacity 0.2s';
        btn.style.opacity = '0.9';

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
    };

    // 点击处理
    btn.addEventListener('click', (e) => {
        if (hasMoved) {
            hasMoved = false;
            return;
        }

        const wideBtn = document.querySelector('.bpx-player-ctrl-wide');
        if (wideBtn && !wideBtn.classList.contains('bpx-player-state-wide')) {
            wideBtn.click();
        }

        setTimeout(() => {
            const videoWrap = document.querySelector('.bpx-player-video-wrap');
            if (videoWrap) {
                const videoRect = videoWrap.getBoundingClientRect();

                window.scrollTo({
                    top: Math.max(0,
                        window.pageYOffset +
                        videoRect.bottom -
                        window.innerHeight - 3
                    ),
                    behavior: 'smooth'
                });
            }
        }, 300);
    });

    // 事件监听
    btn.addEventListener('mousedown', startDrag);
    btn.addEventListener('touchstart', startDrag);

    // 插入按钮
    document.body.appendChild(btn);

    // 窗口调整处理
    window.addEventListener('resize', () => {
        const pos = loadPosition();
        btn.style.left = `${pos.x}px`;
        btn.style.top = `${pos.y}px`;
    });
})();
