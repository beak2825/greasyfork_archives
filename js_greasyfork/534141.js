// ==UserScript==
// @name         SilentlyJavaGuide
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在JavaGuide网站添加隐藏/显示侧边栏和导航栏的控制按钮，以及面试内容模糊控制
// @author       NikoAoi
// @match        https://javaguide.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534141/SilentlyJavaGuide.user.js
// @updateURL https://update.greasyfork.org/scripts/534141/SilentlyJavaGuide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        #floating-eye-container {
            position: fixed;
            bottom: 150px;
            right: 15px;
            width: 48px;
            height: 48px;
            z-index: 9999;
            cursor: pointer;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            transition: filter 0.3s ease;
        }
        
        #floating-eye-container:hover {
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        /* 暗色模式样式 */
        #floating-eye-container.dark-mode {
            background: #333;
            border-color: #444;
        }
        
        #floating-eye-container.dark-mode #floating-eye {
            stroke: white;
        }

        #floating-eye {
            width: 32px;
            height: 32px;
            filter: saturate(1.2);
        }
        
        /* 添加提示框的暗色模式样式 */
        #floating-eye-container.dark-mode + #star-tooltip {
            background: #333;
            color: #fff;
        }

        /* 修改暗色模式下的小三角 */
        #floating-eye-container.dark-mode + #star-tooltip::after {
            border-top-color: #333;
        }

        /* 暗色模式下关闭按钮的颜色 */
        #floating-eye-container.dark-mode + #star-tooltip .close-button::before,
        #floating-eye-container.dark-mode + #star-tooltip .close-button::after {
            background-color: #999;
        }

        #eye-iris {
            transition: transform 0.3s ease;
            fill: url(#iris-gradient);
        }
        
        @keyframes moveIris {
            0%, 100% { transform: translate(0, 0); }
            20% { transform: translate(2px, 0); }
            40% { transform: translate(-2px, 0); }
            60% { transform: translate(0, -2px); }
            80% { transform: translate(0, 2px); }
        }

        @keyframes morphOutline {
            0%, 100% { d: path('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'); }
            20% { d: path('M1 12s4-8 11-8 11 8 11 8-4 7.8-11 7.8-11-7.8-11-7.8z'); }
            40% { d: path('M1 12s4-8.2 11-8.2 11 8.2 11 8.2-4 7.8-11 7.8-11-7.8-11-7.8z'); }
            60% { d: path('M1 12s4-7.8 11-7.8 11 7.8 11 7.8-4 8.2-11 8.2-11-8.2-11-8.2z'); }
            80% { d: path('M1 12s4-8 11-8 11 8 11 8-4 8.2-11 8.2-11-8.2-11-8.2z'); }
        }
        
        @keyframes blink {
            0%, 100% { d: path('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'); }
            45%, 55% { d: path('M3 14 Q12 18 21 14 M2 12 L4 13 M20 12 L22 13'); }
        }

        .iris-moving {
            animation: moveIris 4s ease-in-out infinite;
        }

        .outline-moving {
            animation: morphOutline 4s ease-in-out infinite;
        }

        .eye-blinking {
            animation: blink 0.2s ease-in-out;
        }

        .blur-text {
            filter: blur(10px);
            transition: filter 0.3s ease;
        }

        /* 提示框样式 */
        #star-tooltip {
            color: black;
            position: fixed;
            bottom: 210px;
            right: 15px;
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            font-size: 14px;
            display: none;
            width: 150px;
            z-index: 9998;
            animation: fadeIn 0.3s ease;
            /* 添加过渡效果 */
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        #star-tooltip::after {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 20px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid white;
        }

        .star-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            stroke: #f1c40f;
            stroke-width: 2;
            fill: none;
            cursor: pointer;
            vertical-align: middle;
            transition: fill 0.3s ease;
        }

        .star-icon:hover {
            fill: #f1c40f;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .close-button {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 10px;
            height: 10px;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.3s ease;
        }

        .close-button:hover {
            opacity: 1;
        }

        .close-button::before,
        .close-button::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #666;
            transform-origin: center;
        }

        .close-button::before {
            transform: rotate(45deg);
        }

        .close-button::after {
            transform: rotate(-45deg);
        }
    `;
    document.head.appendChild(style);

    // 创建容器
    const container = document.createElement('div');
    container.setAttribute('id', 'floating-eye-container');

    // 创建SVG图标
    const eyeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    eyeIcon.setAttribute('id', 'floating-eye');
    eyeIcon.setAttribute('viewBox', '0 0 24 24');
    eyeIcon.setAttribute('fill', 'none');
    eyeIcon.setAttribute('stroke', 'currentColor');
    eyeIcon.setAttribute('stroke-width', '0.3');

    // 添加渐变定义
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradient.setAttribute('id', 'iris-gradient');
    gradient.setAttribute('cx', '50%');
    gradient.setAttribute('cy', '50%');
    gradient.setAttribute('r', '50%');

    const stops = [
        { offset: '0%', color: '#644c95' },    // 深紫色中心
        { offset: '30%', color: '#4b6cb7' },   // 蓝紫色过渡
        { offset: '70%', color: '#354a77' },   // 深蓝色边缘
        { offset: '100%', color: '#1a1f3c' }   // 深色外圈
    ];

    stops.forEach(stop => {
        const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stopEl.setAttribute('offset', stop.offset);
        stopEl.setAttribute('stop-color', stop.color);
        gradient.appendChild(stopEl);
    });

    defs.appendChild(gradient);
    eyeIcon.appendChild(defs);

    // 创建眼睛部件
    const eyeOutline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    eyeOutline.setAttribute('d', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');
    eyeOutline.classList.add('outline-moving');
    
    const eyeIris = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    eyeIris.setAttribute('id', 'eye-iris');
    eyeIris.setAttribute('cx', '12');
    eyeIris.setAttribute('cy', '12');
    eyeIris.setAttribute('r', '3');
    eyeIris.classList.add('iris-moving');

    eyeIcon.appendChild(eyeOutline);
    eyeIcon.appendChild(eyeIris);

    // 状态管理
    let isEyeClosed = localStorage.getItem('isEyeClosed') === 'true' || false;

    // 初始化页面状态
    const initializeEyeState = () => {
        const sidebar = document.getElementById('sidebar');
        const navbar = document.getElementById('navbar');
        
        if (isEyeClosed) {
            // 闭眼状态：下弧线 + 睫毛
            eyeOutline.setAttribute('d', 'M3 14 Q12 18 21 14 M2 12 L4 13 M20 12 L22 13');
            eyeIris.style.visibility = 'hidden';
            eyeOutline.classList.remove('outline-moving');
            eyeIris.classList.remove('iris-moving');
            
            if (sidebar) {
                sidebar.style.display = 'none';
            }
            if (navbar) {
                navbar.style.display = 'none';
            }
            // 模糊面试内容
            processNode(document.body);
        }
    };

    container.appendChild(eyeIcon);

    // 创建提示框
    const tooltip = document.createElement('div');
    tooltip.setAttribute('id', 'star-tooltip');
    tooltip.innerHTML = `
        <div class="close-button"></div>
        喜欢这个功能吗？欢迎去 GitHub 给个 Star 
        <svg class="star-icon" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    `;

    // 添加关闭按钮点击事件
    const closeButton = tooltip.querySelector('.close-button');
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡
        tooltip.style.display = 'none';
    });

    // 添加 Star 图标的点击事件
    const starIcon = tooltip.querySelector('.star-icon');
    starIcon.addEventListener('click', () => {
        window.open('https://github.com/NikoAoi/SilentlyJavaGuide', '_blank');
    });

    document.body.appendChild(tooltip);

    // 一分钟后显示提示框
    setTimeout(() => {
        tooltip.style.display = 'block';
        
        // 10秒后自动隐藏
        setTimeout(() => {
            tooltip.style.display = 'none';
        }, 60000); // 60秒后隐藏提示框
    }, 600000); // 10分钟后显示提示框

    // 添加主题检查和更新函数
    function updateTheme() {
        const isDarkMode = localStorage.getItem('vuepress-theme-hope-scheme') === 'dark';
        if (isDarkMode) {
            container.classList.add('dark-mode');
        } else {
            container.classList.remove('dark-mode');
        }
    }

    // 监听 localStorage 变化
    window.addEventListener('storage', (e) => {
        if (e.key === 'vuepress-theme-hope-scheme') {
            updateTheme();
        }
    });

    // 面试内容模糊功能
    const blurWords = ['JavaGuide', '面试', '简历', '面经'];
    
    function wrapTextWithSpan(textContent) {
        let result = textContent;
        for (const word of blurWords) {
            const regex = new RegExp(`(${word})`, 'g');
            result = result.replace(regex, '<span class="blur-text">$1</span>');
        }
        return result;
    }

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const parent = node.parentNode;
            if (parent && parent.nodeName !== 'SCRIPT' && parent.nodeName !== 'STYLE') {
                const newHtml = wrapTextWithSpan(node.textContent);
                if (newHtml !== node.textContent) {
                    const span = document.createElement('span');
                    span.innerHTML = newHtml;
                    parent.replaceChild(span, node);
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.childNodes.length === 0 && node.textContent) {
                node.innerHTML = wrapTextWithSpan(node.textContent);
            } else {
                Array.from(node.childNodes).forEach(processNode);
            }
        }
    }

    function unwrapBlurredText(element) {
        const blurredSpans = element.querySelectorAll('.blur-text');
        blurredSpans.forEach(span => {
            const textNode = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(textNode, span);
        });
    }

    // 添加一个变量来追踪眨眼动画的 timeout
    let blinkTimeout = null;

    // 修改眨眼控制函数
    const blinkEye = () => {
        if (!isEyeClosed) {
            // 移除现有的动画类
            eyeOutline.classList.remove('outline-moving');
            eyeIris.classList.remove('iris-moving');
            eyeIris.style.visibility = 'hidden';
            
            // 添加眨眼动画
            eyeOutline.classList.add('eye-blinking');
            
            // 清除之前的 timeout
            if (blinkTimeout) {
                clearTimeout(blinkTimeout);
            }
            
            // 设置新的 timeout
            blinkTimeout = setTimeout(() => {
                eyeOutline.classList.remove('eye-blinking');
                
                if (!isEyeClosed) {  // 再次检查状态
                    eyeIris.style.visibility = 'visible';
                    
                    // 如果不是悬停状态，恢复原来的动画
                    if (!container.matches(':hover')) {
                        eyeOutline.classList.add('outline-moving');
                        eyeIris.classList.add('iris-moving');
                    }
                }
            }, 100);
        }
    };

    // 设置眨眼定时器
    const startBlinkInterval = () => {
        // 每5秒眨眼两次
        setInterval(() => {
            blinkEye();
            // 100ms后进行第二次眨眼
            setTimeout(blinkEye, 400);
        }, 5000);
    };

    // 启动眨眼定时器
    startBlinkInterval();

    // 修改点击事件处理器
    container.addEventListener('click', () => {
        // 获得导航栏和侧边栏元素
        const sidebar = document.getElementById('sidebar');
        const navbar = document.getElementById('navbar');
        // 清除正在进行的眨眼动画 timeout
        if (blinkTimeout) {
            clearTimeout(blinkTimeout);
            blinkTimeout = null;
        }
        
        isEyeClosed = !isEyeClosed;
        // 保存状态到 localStorage
        localStorage.setItem('isEyeClosed', isEyeClosed);

        eyeOutline.classList.remove('eye-blinking');
        
        if (isEyeClosed) {
            // 闭眼状态：下弧线 + 睫毛
            eyeOutline.setAttribute('d', 'M3 14 Q12 18 21 14 M2 12 L4 13 M20 12 L22 13');
            eyeIris.style.visibility = 'hidden';
            eyeOutline.classList.remove('outline-moving');
            eyeIris.classList.remove('iris-moving');
            if (sidebar) {
                // 隐藏侧边栏
                sidebar.style.display = 'none';
            }
            if (navbar) {
                // 隐藏导航栏
                navbar.style.display = 'none';
            }
            // 模糊面试内容
            processNode(document.body);
        } else {
            // 睁眼状态
            eyeOutline.setAttribute('d', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');
            eyeIris.style.visibility = 'visible';
            if (!container.matches(':hover')) {
                eyeOutline.classList.add('outline-moving');
                eyeIris.classList.add('iris-moving');
            }
            if (sidebar) {
                // 显示侧边栏
                sidebar.style.display = '';
            }
            if (navbar) {
                // 显示导航栏
                navbar.style.display = '';
            }
            // 取消模糊面试内容
            unwrapBlurredText(document.body);
        }
    });

    // 悬停控制动画
    container.addEventListener('mouseenter', () => {
        if (!isEyeClosed) {
            eyeIris.classList.remove('iris-moving');
            eyeOutline.classList.remove('outline-moving');
        }
    });

    container.addEventListener('mouseleave', () => {
        if (!isEyeClosed) {
            eyeIris.classList.add('iris-moving');
            eyeOutline.classList.add('outline-moving');
        }
    });

    document.body.appendChild(container);
    
    // 在创建完眼睛组件后立即调用初始化
    initializeEyeState();
    updateTheme();  // 确保初始状态正确
})();
