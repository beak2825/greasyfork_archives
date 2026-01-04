// ==UserScript==
// @name         星光绽放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Create a circular starburst effect with colorful Linux text on click at Linux.do
// @author       You
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493245/%E6%98%9F%E5%85%89%E7%BB%BD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/493245/%E6%98%9F%E5%85%89%E7%BB%BD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const colors = ['#FF6347', '#FFD700', '#00BFFF', '#32CD32', '#FF69B4', '#9400D3']; // 星星颜色数组
    const textColors = ['#E53935', '#8E24AA', '#1E88E5', '#43A047', '#FDD835', '#FB8C00']; // Linux 字样颜色数组
    const numStars = 20; // 星星数量
    const starSize = 15; // 星星基础大小（像素）
    const maxScale = 1.5; // 最大缩放比例
    const spreadDistance = 100; // 星星移动距离

    // 添加内联CSS样式
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML = `
        .star {
            position: fixed;
            width: ${starSize}px;
            height: ${starSize}px;
            background-color: transparent;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            pointer-events: none;
            transform-origin: center;
            opacity: 1;
            transition: opacity 0.5s ease-out;
        }

        @keyframes starburst {
            0% {
                transform: translate(0px, 0px) scale(0.5);
                opacity: 1;
            }
            100% {
                transform: translate(calc(${spreadDistance}px * cos(var(--angle))), calc(${spreadDistance}px * sin(var(--angle)))) scale(${maxScale});
                opacity: 0;
            }
        }

        .linux-text {
            position: fixed;
            font-size: 1.5em;  // 字体大小
            font-weight: bold;
            color: white;
            text-shadow: 0px 0px 4px rgba(0,0,0,0.5);  // 减轻阴影效果
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
    `;

    // 显示星星绽放效果
    function showStarburst(x, y) {
        for (let i = 0; i < numStars; i++) {
            const angle = (360 / numStars) * i; // 散开360度
            const radians = angle * Math.PI / 180; // 角度转弧度
            const star = document.createElement('div');
            star.className = 'star';
            star.style.backgroundColor = colors[i % colors.length];
            star.style.left = `${x - starSize / 2}px`;
            star.style.top = `${y - starSize / 2}px`;
            star.style.setProperty('--angle', radians.toString());
            document.body.appendChild(star);
            // 启动动画
            requestAnimationFrame(() => {
                star.style.animation = `starburst 0.5s ${i * 25}ms forwards`;
                setTimeout(() => {
                    document.body.removeChild(star);
                }, 750 + (i * 25));
            });
        }

        // 显示Linux文字
        const linuxText = document.createElement('div');
        linuxText.className = 'linux-text';
        linuxText.textContent = 'Linux';
        linuxText.style.left = `${x}px`;
        linuxText.style.top = `${y}px`;
        linuxText.style.transform = 'translate(-50%, -50%)'; // Center the text over the click
        linuxText.style.color = textColors[Math.floor(Math.random() * textColors.length)]; // Randomize color
        document.body.appendChild(linuxText);
        requestAnimationFrame(() => {
            linuxText.style.opacity = 1;
            setTimeout(() => {
                linuxText.style.opacity = 0;
                document.body.removeChild(linuxText);
            }, 500); // Text appears for 0.5 seconds
        });
    }

    // 监听鼠标点击并调整位置
    document.addEventListener('click', (event) => {
        showStarburst(event.clientX, event.clientY);
    }, true);
})();
