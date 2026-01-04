// ==UserScript==
// @name         鞭炮和财神帽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在网页右上角添加鞭炮和财神帽
// @author       Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523262/%E9%9E%AD%E7%82%AE%E5%92%8C%E8%B4%A2%E7%A5%9E%E5%B8%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/523262/%E9%9E%AD%E7%82%AE%E5%92%8C%E8%B4%A2%E7%A5%9E%E5%B8%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 CSS 样式
    GM_addStyle(`
        #fireworks-container {
            position: fixed;
            top: 15px;
            right: 200px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            overflow: hidden; /* 隐藏超出容器的爆炸效果 */
        }

        .firework {
            position: absolute;
            background: radial-gradient(circle, red, yellow);
            border-radius: 50%;
            animation: explode 1s linear infinite; /* 循环播放爆炸动画 */
        }

        @keyframes explode {
            0% { transform: translate(0, 0) scale(0.1); opacity: 1; }
            100% { transform: translate(calc(var(--x) * 10px), calc(var(--y) * 10px)) scale(1); opacity: 0; }
        }

        #hat-container {
            position: fixed;
            top: 5px;
            right: 150px;
            width: 30px;
            height: 30px;
            transform: rotate(5deg);
            cursor: pointer; /* 使其看起来可点击 */
        }
        #glasses-container {
            position: fixed;
            top: 20px;
            right: 250px;
            width: 30px;
            height: 30px;
            display: none; /* 初始状态隐藏墨镜 */
            cursor: pointer; /* 使其看起来可点击 */
        }
        #hat-img, #glasses-img {
            max-width: 100%;
            max-height: 100%;
        }
    `);

    // 创建鞭炮容器
    const fireworksContainer = document.createElement('div');
    fireworksContainer.id = 'fireworks-container';
    document.body.appendChild(fireworksContainer);

    // 创建鞭炮效果 (简化版，使用 CSS 动画)
    for (let i = 0; i < 5; i++) { // 创建 5 个小爆炸点
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.setProperty('--x', Math.random() - 0.5); // 随机 x 偏移
        firework.style.setProperty('--y', Math.random() - 0.5); // 随机 y 偏移
        firework.style.width = '2px'; // 设置爆炸点大小
        firework.style.height = '2px';
        fireworksContainer.appendChild(firework);
    }


    // 创建财神帽容器
    const hatContainer = document.createElement('div');
    hatContainer.id = 'hat-container';
    const hatImg = document.createElement('img');
    hatImg.id = "hat-img";
    hatImg.src = 'https://i.ibb.co/6y0j0tV/gold-ingot-svgrepo-com.png'; // 替换为你的财神帽图片 URL
    hatContainer.appendChild(hatImg);
    document.body.appendChild(hatContainer);

    //创建墨镜容器
    const glassesContainer = document.createElement('div');
    glassesContainer.id = 'glasses-container';
    const glassesImg = document.createElement('img');
    glassesImg.id = "glasses-img";
    glassesImg.src = 'https://i.ibb.co/w0KxQ8C/glasses-svgrepo-com.png'; // 替换为你的墨镜图片 URL
    glassesContainer.appendChild(glassesImg);
    document.body.appendChild(glassesContainer);

    // 添加点击事件，切换财神帽和墨镜
    hatContainer.addEventListener('click', () => {
        hatContainer.style.display = 'none';
        glassesContainer.style.display = 'block';
    });
    glassesContainer.addEventListener('click', () => {
        glassesContainer.style.display = 'none';
        hatContainer.style.display = 'block';
    });

})();