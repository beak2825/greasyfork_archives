// ==UserScript==
// @name         翻页按钮
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  向上或向下完整的翻一页网页页面
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528120/%E7%BF%BB%E9%A1%B5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/528120/%E7%BF%BB%E9%A1%B5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置滚动参数
    const SCROLL_DISTANCE = window.innerHeight * 1; // 滚动距离为视窗高度的70%
    const SCROLL_DURATION = 800; // 滚动动画时间(毫秒)

    // 创建样式
    const style = `
        .scroll-button {
            position: fixed;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: rgba(0,0,0,0.5);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: background-color 0.3s ease;
        }
        .scroll-button:hover {
            background-color: rgba(0,0,0,0.7);
        }
        .scroll-up {
            top: 50%;
            transform: translateY(-150%);
        }
        .scroll-down {
            top: 50%;
            transform: translateY(50%);
        }
    `;

    // 添加样式到页面
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    // 平滑滚动函数
    function smoothScroll(direction) {
        const currentPosition = window.pageYOffset;
        const targetPosition = direction === 'up'
            ? Math.max(currentPosition - SCROLL_DISTANCE, 0)
            : Math.min(currentPosition + SCROLL_DISTANCE, document.body.scrollHeight - window.innerHeight);

        const startTime = performance.now();

        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / SCROLL_DURATION, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4); // 缓出效果

            window.scrollTo(0, currentPosition + (targetPosition - currentPosition) * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // 创建向上滚动按钮
    const scrollUpButton = document.createElement('button');
    scrollUpButton.classList.add('scroll-button', 'scroll-up');
    scrollUpButton.innerHTML = '&#9650;'; // 向上三角形符号
    scrollUpButton.title = '快速向上滚动';
    scrollUpButton.addEventListener('click', () => smoothScroll('up'));

    // 创建向下滚动按钮
    const scrollDownButton = document.createElement('button');
    scrollDownButton.classList.add('scroll-button', 'scroll-down');
    scrollDownButton.innerHTML = '&#9660;'; // 向下三角形符号
    scrollDownButton.title = '快速向下滚动';
    scrollDownButton.addEventListener('click', () => smoothScroll('down'));

    // 添加按钮到页面
    document.body.appendChild(scrollUpButton);
    document.body.appendChild(scrollDownButton);
})();