// ==UserScript==
// @name         元气滚动
// @name:en      Genki Scroll
// @name:zh-CN   元气滚动
// @namespace    https://github.com/genkiscroll
// @version      1.5.0
// @description  智能检测滚动容器，丝滑平顺的自动滚动体验，支持各种网页应用
// @description:en Intelligent scroll container detection with silky smooth auto-scrolling experience for all web applications
// @description:zh-CN 智能检测滚动容器，丝滑平顺的自动滚动体验，支持各种网页应用
// @author       Genki Developer
// @license      MIT
// @homepage     https://github.com/genkiscroll/genki-scroll
// @supportURL   https://github.com/genkiscroll/genki-scroll/issues
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY2YjZiO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6IzRlY2RjNDtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNDViN2QxO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjMwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8cGF0aCBkPSJNMzIgMTBBMjIgMjIgMCAwIDEgNTQgMzJBMjIgMjIgMCAwIDEgMzIgNTQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMzIgMTZBMTYgMTYgMCAwIDAgMTYgMzJBMTYgMTYgMCAwIDAgMzIgNDgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMzIgMjJBMTAgMTAgMCAwIDEgNDIgMzJBMTAgMTAgMCAwIDEgMzIgNDIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K
// @match        *://*/*
// @exclude      *://localhost/*
// @exclude      *://127.0.0.1/*
// @exclude      *://192.168.*/*
// @exclude      *://10.*/*
// @exclude      *://172.16.*/*
// @exclude      *://172.17.*/*
// @exclude      *://172.18.*/*
// @exclude      *://172.19.*/*
// @exclude      *://172.20.*/*
// @exclude      *://172.21.*/*
// @exclude      *://172.22.*/*
// @exclude      *://172.23.*/*
// @exclude      *://172.24.*/*
// @exclude      *://172.25.*/*
// @exclude      *://172.26.*/*
// @exclude      *://172.27.*/*
// @exclude      *://172.28.*/*
// @exclude      *://172.29.*/*
// @exclude      *://172.30.*/*
// @exclude      *://172.31.*/*
// @exclude      *://file:///*
// @noframes
// @grant        none
// @run-at       document-idle
// @compatible   chrome >=60
// @compatible   firefox >=55
// @compatible   edge >=79
// @compatible   safari >=13
// @compatible   opera >=47
// @downloadURL https://update.greasyfork.org/scripts/538045/%E5%85%83%E6%B0%94%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538045/%E5%85%83%E6%B0%94%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 Genki Scroll

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // 滚动配置
    let scrollConfig = {
        isScrolling: false,
        scrollInterval: 50, // 50毫秒间隔，更流畅
        scrollPixelsPerStep: 2, // 每次滚动2像素，更平滑
        scrollTimer: null,
        lastScrollTop: 0,
        unchangedCount: 0, // 连续无变化计数
        scrollContainer: null, // 当前滚动容器
        useAnimation: true // 是否使用动画滚动
    };

    let controlPanel = null;
    let floatingIcon = null;

    // 常见的滚动容器选择器
    const SCROLL_SELECTORS = [
        // 通用滚动容器
        '[data-scroll-container]',
        '.scroll-container',
        '.scrollable',
        '.overflow-auto',
        '.overflow-y-auto',
        '.overflow-scroll',
        '.overflow-y-scroll',
        
        // 飞书相关
        '.suit-doc-page',
        '.suite-doc-editor',
        '.feishu-doc-content',
        '.doc-render-container',
        '.lark-virtual-scroll',
        '.docs-texteventtarget-iframe',
        
        // 其他常见应用
        '.notion-page-content',
        '.roam-article',
        '.obsidian-vault',
        '.markdown-body',
        '.main-content',
        '.content-wrapper',
        '.article-content',
        '.document-content',
        
        // 通用内容区域
        'main',
        'article',
        '.main',
        '.content',
        '#content',
        '.wrapper',
        '.container'
    ];

    // 创建悬浮图标
    function createFloatingIcon() {
        const icon = document.createElement('div');
        icon.id = 'autoScrollIcon';
        
        // 创建螺旋图标
        icon.innerHTML = `
            <div class="spiral-icon">
                <div class="spiral-line spiral-1"></div>
                <div class="spiral-line spiral-2"></div>
                <div class="spiral-line spiral-3"></div>
                <div class="center-dot"></div>
            </div>
        `;
        
        icon.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            user-select: none;
            transform: translateY(-50%);
            overflow: hidden;
        `;

        // 添加螺旋图标的样式
        const style = document.createElement('style');
        style.textContent = `
            .spiral-icon {
                position: relative;
                width: 30px;
                height: 30px;
                animation: gentleRotate 4s linear infinite;
            }
            
            .spiral-line {
                position: absolute;
                border: 2px solid rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                animation: spiral-pulse 2s ease-in-out infinite;
            }
            
            .spiral-1 {
                width: 25px;
                height: 25px;
                top: 2.5px;
                left: 2.5px;
                border-top-color: transparent;
                border-left-color: transparent;
                animation-delay: 0s;
            }
            
            .spiral-2 {
                width: 18px;
                height: 18px;
                top: 6px;
                left: 6px;
                border-bottom-color: transparent;
                border-right-color: transparent;
                animation-delay: 0.3s;
            }
            
            .spiral-3 {
                width: 11px;
                height: 11px;
                top: 9.5px;
                left: 9.5px;
                border-top-color: transparent;
                border-left-color: transparent;
                animation-delay: 0.6s;
            }
            
            .center-dot {
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: dot-pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes gentleRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes spiral-pulse {
                0%, 100% { opacity: 0.7; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.1); }
            }
            
            @keyframes dot-pulse {
                0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
            }
            
            /* 滚动状态的样式 */
            .scroll-active .spiral-icon {
                animation: fastRotate 1s linear infinite;
            }
            
            .scroll-active .spiral-line {
                border-color: rgba(255, 255, 255, 1);
                animation: spiral-active 0.8s ease-in-out infinite;
            }
            
            .scroll-active .center-dot {
                animation: dot-active 0.6s ease-in-out infinite;
            }
            
            @keyframes fastRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes spiral-active {
                0%, 100% { opacity: 0.9; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
            
            @keyframes dot-active {
                0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
            }
        `;
        
        // 将样式添加到页面
        if (!document.getElementById('spiral-icon-styles')) {
            style.id = 'spiral-icon-styles';
            document.head.appendChild(style);
        }

        // 悬停效果
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-50%) scale(1.1)';
            icon.style.boxShadow = '0 6px 20px rgba(255,107,107,0.4)';
            icon.style.background = 'linear-gradient(135deg, #ff8a80 0%, #80cbc4 50%, #64b5f6 100%)';
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(-50%) scale(1)';
            icon.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            icon.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)';
        });

        // 点击切换滚动状态
        icon.addEventListener('click', () => {
            if (scrollConfig.isScrolling) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        });

        document.body.appendChild(icon);
        return icon;
    }

    // 创建简化的状态提示
    function createStatusTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'scrollTooltip';
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            right: 80px;
            background: #2c3e50;
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            z-index: 10001;
            transform: translateY(-50%);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            white-space: nowrap;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;
        tooltip.textContent = '点击开始自动滚动';
        document.body.appendChild(tooltip);
        return tooltip;
    }

    // 显示状态提示
    function showTooltip(text, duration = 2000) {
        let tooltip = document.getElementById('scrollTooltip');
        if (!tooltip) {
            tooltip = createStatusTooltip();
        }
        
        tooltip.textContent = text;
        tooltip.style.opacity = '1';
        
        if (duration > 0) {
            setTimeout(() => {
                if (tooltip) {
                    tooltip.style.opacity = '0';
                }
            }, duration);
        }
    }

    // 隐藏状态提示
    function hideTooltip() {
        const tooltip = document.getElementById('scrollTooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    // 智能检测滚动容器
    function detectScrollContainer() {
        // 检查是否有明显的滚动容器
        for (const selector of SCROLL_SELECTORS) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (isScrollable(element)) {
                    console.log(`🎯 检测到滚动容器: ${selector}`, element);
                    return element;
                }
            }
        }
        
        // 检查iframe内容
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc && isScrollable(iframeDoc.documentElement)) {
                    console.log('🎯 检测到iframe滚动容器', iframe);
                    return { element: iframeDoc.documentElement, isIframe: true };
                }
            } catch (e) {
                // 跨域iframe无法访问
            }
        }
        
        // 自动检测页面中可滚动的元素
        const allElements = document.querySelectorAll('*');
        const candidates = [];
        
        for (const element of allElements) {
            if (isScrollable(element)) {
                const height = element.scrollHeight - element.clientHeight;
                if (height > 200) { // 至少有200px的滚动空间
                    candidates.push({ element, height });
                }
            }
        }
        
        // 选择滚动空间最大的元素
        if (candidates.length > 0) {
            candidates.sort((a, b) => b.height - a.height);
            console.log('🎯 自动检测到滚动容器', candidates[0].element);
            return candidates[0].element;
        }
        
        // 默认使用document.documentElement
        console.log('🎯 使用默认滚动容器: document.documentElement');
        return document.documentElement;
    }

    // 检查元素是否可滚动
    function isScrollable(element) {
        if (!element) return false;
        
        const style = window.getComputedStyle(element);
        const overflowY = style.overflowY;
        const overflowX = style.overflowX;
        const overflow = style.overflow;
        
        // 检查是否设置了滚动样式
        const hasScrollStyle = ['auto', 'scroll'].includes(overflowY) || 
                              ['auto', 'scroll'].includes(overflow);
        
        // 检查是否有实际的滚动内容
        const hasScrollContent = element.scrollHeight > element.clientHeight + 5;
        
        return hasScrollStyle && hasScrollContent;
    }

    // 获取容器的滚动位置
    function getScrollTop(container) {
        if (!container) return 0;
        
        if (container.isIframe) {
            return container.element.scrollTop || container.element.parentElement?.scrollTop || 0;
        }
        
        if (container === document.documentElement || container === document.body) {
            return Math.max(
                document.documentElement.scrollTop,
                document.body.scrollTop,
                window.pageYOffset || 0
            );
        }
        
        return container.scrollTop || 0;
    }

    // 设置容器的滚动位置
    function setScrollTop(container, value) {
        if (!container) return;
        
        if (container.isIframe) {
            container.element.scrollTop = value;
            return;
        }
        
        if (container === document.documentElement || container === document.body) {
            document.documentElement.scrollTop = value;
            document.body.scrollTop = value;
            window.scrollTo(0, value);
            return;
        }
        
        container.scrollTop = value;
    }

    // 平滑滚动函数
    function smoothScrollBy(container, deltaY) {
        if (!container) return;
        
        try {
            // 优先使用平滑滚动
            if (container === document.documentElement || container === document.body) {
                // 使用window.scrollBy的平滑滚动
                window.scrollBy({
                    top: deltaY,
                    behavior: 'auto' // 使用auto而不是smooth，避免冲突
                });
            } else if (container.scrollBy) {
                // 对于其他元素，使用element.scrollBy
                container.scrollBy({
                    top: deltaY,
                    behavior: 'auto'
                });
            } else {
                // 回退到直接设置scrollTop
                const currentScrollTop = getScrollTop(container);
                setScrollTop(container, currentScrollTop + deltaY);
            }
        } catch (e) {
            // 如果平滑滚动失败，使用传统方法
            const currentScrollTop = getScrollTop(container);
            setScrollTop(container, currentScrollTop + deltaY);
        }
    }

    // 获取页面总高度和可视高度
    function getScrollInfo(container) {
        if (!container) {
            container = document.documentElement;
        }
        
        const scrollTop = getScrollTop(container);
        
        let scrollHeight, clientHeight;
        
        if (container.isIframe) {
            scrollHeight = container.element.scrollHeight;
            clientHeight = container.element.clientHeight;
        } else if (container === document.documentElement || container === document.body) {
            scrollHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight
            );
            clientHeight = Math.max(
                document.documentElement.clientHeight,
                window.innerHeight
            );
        } else {
            scrollHeight = container.scrollHeight;
            clientHeight = container.clientHeight;
        }
        
        return { scrollTop, scrollHeight, clientHeight };
    }

    // 检查是否可以继续滚动
    function canScrollMore(container) {
        const { scrollTop, scrollHeight, clientHeight } = getScrollInfo(container);
        // 检查是否到达底部（留10px容差）
        const isAtBottom = (scrollTop + clientHeight) >= (scrollHeight - 10);
        return !isAtBottom;
    }

    // 开始自动滚动
    function startAutoScroll() {
        if (scrollConfig.isScrolling) return;

        // 检测滚动容器
        scrollConfig.scrollContainer = detectScrollContainer();
        if (!scrollConfig.scrollContainer) {
            showTooltip('❌ 未找到可滚动内容', 3000);
            return;
        }

        scrollConfig.isScrolling = true;
        scrollConfig.lastScrollTop = getScrollTop(scrollConfig.scrollContainer);
        scrollConfig.unchangedCount = 0;
        
        // 更新图标状态
        floatingIcon.classList.add('scroll-active');
        
        // 显示状态
        showTooltip('正在丝滑滚动中...', 0);
        
        // 使用requestAnimationFrame实现超平滑滚动
        let lastTime = 0;
        const targetInterval = scrollConfig.scrollInterval; // 50ms间隔
        
        function smoothScrollLoop(currentTime) {
            if (!scrollConfig.isScrolling) return;
            
            // 控制滚动频率
            if (currentTime - lastTime >= targetInterval) {
                const beforeScroll = getScrollTop(scrollConfig.scrollContainer);
                
                // 检查是否可以继续滚动
                if (!canScrollMore(scrollConfig.scrollContainer)) {
                    stopAutoScroll();
                    showTooltip('🎉 到底啦！', 3000);
                    return;
                }
                
                // 执行小幅度平滑滚动
                smoothScrollBy(scrollConfig.scrollContainer, scrollConfig.scrollPixelsPerStep);
                
                const afterScroll = getScrollTop(scrollConfig.scrollContainer);
                
                // 检查滚动是否有效
                if (Math.abs(afterScroll - beforeScroll) < 1) {
                    scrollConfig.unchangedCount++;
                    if (scrollConfig.unchangedCount >= 20) { // 连续20次无效滚动
                        // 尝试重新检测滚动容器
                        console.log('🔄 重新检测滚动容器...');
                        scrollConfig.scrollContainer = detectScrollContainer();
                        
                        if (!canScrollMore(scrollConfig.scrollContainer)) {
                            stopAutoScroll();
                            showTooltip('🎉 到底啦！', 3000);
                            return;
                        }
                        scrollConfig.unchangedCount = 0;
                    }
                } else {
                    scrollConfig.unchangedCount = 0;
                }
                
                scrollConfig.lastScrollTop = afterScroll;
                lastTime = currentTime;
            }
            
            // 继续动画循环
            scrollConfig.scrollTimer = requestAnimationFrame(smoothScrollLoop);
        }
        
        // 开始平滑滚动循环
        scrollConfig.scrollTimer = requestAnimationFrame(smoothScrollLoop);
    }

    // 停止滚动
    function stopAutoScroll() {
        scrollConfig.isScrolling = false;
        
        if (scrollConfig.scrollTimer) {
            cancelAnimationFrame(scrollConfig.scrollTimer);
            scrollConfig.scrollTimer = null;
        }
        
        // 恢复图标状态
        floatingIcon.classList.remove('scroll-active');
        
        // 隐藏状态提示
        hideTooltip();
    }

    // 初始化
    function init() {
        floatingIcon = createFloatingIcon();
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Esc 键停止滚动
            if (e.key === 'Escape' && scrollConfig.isScrolling) {
                stopAutoScroll();
                showTooltip('滚动已停止', 2000);
            }
            
            // 空格键开始/停止滚动
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                if (scrollConfig.isScrolling) {
                    stopAutoScroll();
                    showTooltip('滚动已停止', 2000);
                } else {
                    startAutoScroll();
                }
            }
        });
        
        // 拖拽悬浮图标
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        let startPos = { x: 0, y: 0 };
        
        floatingIcon.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos.x = e.clientX;
            startPos.y = e.clientY;
            dragOffset.x = e.clientX - floatingIcon.offsetLeft;
            dragOffset.y = e.clientY - floatingIcon.offsetTop;
            floatingIcon.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            floatingIcon.style.left = (e.clientX - dragOffset.x) + 'px';
            floatingIcon.style.top = (e.clientY - dragOffset.y) + 'px';
            floatingIcon.style.right = 'auto';
            floatingIcon.style.transform = 'none';
        });
        
        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                floatingIcon.style.cursor = 'pointer';
                
                // 检查是否是点击而非拖拽
                const distance = Math.sqrt(
                    Math.pow(e.clientX - startPos.x, 2) + 
                    Math.pow(e.clientY - startPos.y, 2)
                );
                
                // 如果移动距离小于5px，认为是点击
                if (distance < 5) {
                    // 点击事件会自动触发，这里不需要额外处理
                }
            }
        });

        // 鼠标悬停显示提示
        floatingIcon.addEventListener('mouseenter', () => {
            if (!scrollConfig.isScrolling) {
                showTooltip('点击开始丝滑滚动', 2000);
            }
        });

        floatingIcon.addEventListener('mouseleave', () => {
            if (!scrollConfig.isScrolling) {
                setTimeout(() => {
                    hideTooltip();
                }, 500);
            }
        });

        // 监听页面变化，重新检测滚动容器
        const observer = new MutationObserver(() => {
            if (scrollConfig.isScrolling) {
                // 如果当前容器不再可滚动，重新检测
                if (!canScrollMore(scrollConfig.scrollContainer)) {
                    const newContainer = detectScrollContainer();
                    if (newContainer !== scrollConfig.scrollContainer) {
                        console.log('🔄 页面变化，切换滚动容器', newContainer);
                        scrollConfig.scrollContainer = newContainer;
                    }
                }
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

