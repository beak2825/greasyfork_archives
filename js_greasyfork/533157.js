// ==UserScript==
// @name         ChatGPT Conversation Navigator 对话目录导航器
// @name:zh      ChatGPT 对话目录导航器
// @name:en      ChatGPT Conversation Navigator
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  Add a clickable conversation index on ChatGPT page
// @description:zh  为 ChatGPT 页面添加可点击的对话索引
// @description:en  Add a clickable conversation index on ChatGPT page
// @author       tianyw0
// @match        https://chatgpt.com/c/*
// @grant        GM_addStyle
// @license      MIT
// @homepageURL  https://github.com/tianyw0/ai-conversation-navigator
// @supportURL   https://github.com/tianyw0/ai-conversation-navigator/issues
// @downloadURL https://update.greasyfork.org/scripts/533157/ChatGPT%20Conversation%20Navigator%20%E5%AF%B9%E8%AF%9D%E7%9B%AE%E5%BD%95%E5%AF%BC%E8%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533157/ChatGPT%20Conversation%20Navigator%20%E5%AF%B9%E8%AF%9D%E7%9B%AE%E5%BD%95%E5%AF%BC%E8%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_RETRIES = 50;
    const RETRY_INTERVAL = 1000;
    let retryCount = 0;

    const utils = {
        log(message, type = 'info') {
            let prefix;
            switch(type) {
                case 'error':
                    prefix = '[ChatGPT Navigator] ❌';
                    console.error(`${prefix} ${message}`);
                    break;
                case 'warn':
                    prefix = '[ChatGPT Navigator] ⚠️';
                    console.warn(`${prefix} ${message}`);
                    break;
                default:
                    prefix = '[ChatGPT Navigator] 🚀';
                    console.log(`${prefix} ${message}`);
            }
        }
    };

    const initializeNavigator = () => {
        // 原有的初始化逻辑
        const chatContainer = document.querySelector('article[data-testid]');
        
        if (!chatContainer && retryCount < MAX_RETRIES) {
            utils.log(`未找到聊天容器，${RETRY_INTERVAL/1000}秒后重试 (${retryCount + 1}/${MAX_RETRIES})`, 'warn');
            retryCount++;
            setTimeout(initializeNavigator, RETRY_INTERVAL);
            return;
        }
        if (!chatContainer) {
            utils.log('无法找到聊天容器，初始化失败', 'error');
            return;
        }
        utils.log('成功找到聊天容器，开始初始化导航');
    
        const existingSidebar = document.getElementById('chatgpt-nav-sidebar');
        if (existingSidebar) {
            utils.log('检测到现有导航栏，正在重置');
            existingSidebar.innerHTML = '';
        } else {
            utils.log('创建新的导航栏');
            createNavigationSidebar();
        }
    
        // 找到所有奇数 data-testid 的元素
        const existingMessages = Array.from(
            document.querySelectorAll('article[data-testid^="conversation-turn-"]')
          ).filter(el => {
            const id = el.dataset.testid.split('-').pop();
            return Number(id) % 2 === 1;
          });
          
        utils.log(`找到 ${existingMessages.length} 条提问`);
        existingMessages.forEach(node => createNavigationItem(node));
    
        // 移除加载状态
        const loadingElement = document.querySelector('.nav-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    
        setupObserver();
        setupScrollSpy(); // 添加滚动跟踪
        utils.log('导航初始化完成');
    };
    
    const setupObserver = () => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'ARTICLE' && node.hasAttribute('data-testid')) {
                        createNavigationItem(node);
                    }
                });
            });
        });
    
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    };

    const createNavigationSidebar = () => {
        // 1. 找到目标容器和所有需要的元素
        const threadContainer = document.getElementById('thread');
        const presentationDiv = threadContainer?.querySelector('div[role="presentation"]');
        if (!presentationDiv) {
            utils.log('未找到目标容器', 'warn');
            return;
        }
    
        // 保存原始的三个 div
        const originalDivs = Array.from(presentationDiv.children);
        if (originalDivs.length !== 3) {
            utils.log('目标容器结构不符合预期', 'warn');
            return;
        }
        const [div1, div2, div3] = originalDivs;
    
        // 2. 清空 presentation div
        presentationDiv.innerHTML = '';
    
        // 3. 创建导航栏和新的 flex 容器
        const sidebar = document.createElement('div');
        sidebar.id = 'chatgpt-nav-sidebar';
        
        // 设置导航栏样式
        sidebar.style.position = 'absolute';
        sidebar.style.zIndex = '1000';
        sidebar.style.left = '0';
        sidebar.style.top = '0';
        sidebar.style.width = 'min(260px, 25%)';
        sidebar.style.height = 'calc(100% - 104px)';
        sidebar.style.marginTop = '104px';
        sidebar.style.flexShrink = '0';
        sidebar.style.overflowY = 'auto';
        sidebar.style.fontSize = '16px';
        sidebar.style.fontWeight = '500';
        sidebar.style.borderRadius = '0';
        sidebar.style.backdropFilter = 'none';
    
        // 检测当前主题并设置相应的背景色
        updateSidebarTheme(sidebar);
    
        // 创建新的 flex 容器包装 div2 和导航栏
        const newDiv2 = document.createElement('div');
        newDiv2.style.display = 'flex';
        newDiv2.style.flexDirection = 'row';
        newDiv2.style.width = '100%';
        newDiv2.style.height = '100%';
        newDiv2.style.overflow = 'hidden';
        newDiv2.style.position = 'relative'; // 添加相对定位作为定位上下文
        newDiv2.appendChild(sidebar);
        newDiv2.appendChild(div2);
    
        // 4. 重新组装所有元素
        presentationDiv.appendChild(div1);
        presentationDiv.appendChild(newDiv2);
        presentationDiv.appendChild(div3);
    
        // 添加样式
        const style = document.createElement('style');
        style.id = 'chatgpt-nav-styles';
        style.textContent = getStylesByTheme();
        document.head.appendChild(style);
        
        // 添加加载状态
        const loading = document.createElement('div');
        loading.className = 'nav-loading';
        sidebar.appendChild(loading);
    };
    
    // 获取当前主题
    const getCurrentTheme = () => {
        // 检查是否有深色模式的标记
        // 可以通过检查body的class或者某些特定元素的样式来判断
        const isDarkMode = document.documentElement.classList.contains('dark') || 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDarkMode ? 'dark' : 'light';
    };
    
    // 根据主题更新侧边栏样式
    const updateSidebarTheme = (sidebar) => {
        const theme = getCurrentTheme();
        if (theme === 'dark') {
            sidebar.style.backgroundColor = '#212121';
            sidebar.style.borderRight = '1px solid rgba(255,255,255,0.08)';
        } else {
            sidebar.style.backgroundColor = '#FFFFFF';
            sidebar.style.borderRight = '1px solid rgba(0,0,0,0.08)';
        }
    };
    
    // 根据主题获取样式
    const getStylesByTheme = () => {
        const theme = getCurrentTheme();
    
        // 基础样式
        let styles = `
            #chatgpt-nav-sidebar {
                opacity: 0;
                transform: translateX(-20px);
                animation: slideIn 0.3s ease forwards;
                transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
                left: 20px !important;
                right: auto !important;
            }
    
            @media (max-width: 1024px) {
                #chatgpt-nav-sidebar {
                    display: none;
                }
            }
    
            @keyframes slideIn {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
    
            #chatgpt-nav-sidebar::-webkit-scrollbar {
                width: 4px;
            }
    
            #chatgpt-nav-sidebar::-webkit-scrollbar-track {
                background-color: transparent;
            }
    
            #chatgpt-nav-sidebar a {
                display: block;
                padding: 8px 12px;
                margin: 0;
                border-radius: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 1.5;
                font-size: 16px;
                font-weight: 400;
                transition: background 0.2s, border-radius 0.2s, color 0.2s;
                background-color: transparent;
            }
    
            #chatgpt-nav-sidebar .nav-item-wrapper {
                padding: 2px 0;
                width: calc(100% - 24px);
                margin-left: 12px;
            }
    
            #chatgpt-nav-sidebar .nav-item-wrapper:last-child {
                border-bottom: none;
            }
            
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
            
            @keyframes dots {
                0% { content: "加载中"; }
                33% { content: "加载中."; }
                66% { content: "加载中.."; }
                100% { content: "加载中..."; }
            }
        `;
        
        // 根据主题添加特定样式
        if (theme === 'dark') {
            styles += `
                #chatgpt-nav-sidebar {
                    background: #212121;
                    border-right: 1px solid rgba(255,255,255,0.08);
                }
                
                #chatgpt-nav-sidebar::-webkit-scrollbar-thumb {
                    background-color: rgba(217, 217, 227, 0.2);
                    border-radius: 2px;
                }
                
                #chatgpt-nav-sidebar a {
                    color: #ececf1;
                    text-decoration: none;
                }
                
                #chatgpt-nav-sidebar a:hover {
                    background-color: #303030;
                    border-radius: 1.5rem;
                }
                
                #chatgpt-nav-sidebar .nav-index {
                    color: #6e6e80;
                    margin-right: 6px;
                    font-size: 15px;
                }
                
                #chatgpt-nav-sidebar .nav-item-wrapper {
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                
                #chatgpt-nav-sidebar a.active {
                    background-color: #303030;
                    border-radius: 1.5rem;
                    font-weight: 600;
                    color: #fff;
                }
                
                .nav-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    color: #ececf1;
                    gap: 8px;
                }
                
                .nav-loading::before {
                    content: "";
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(217, 217, 227, 0.2);
                    border-top-color: #ececf1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
            `;
        } else {
            styles += `
                #chatgpt-nav-sidebar {
                    background: #FFFFFF;
                    border-right: 1px solid rgba(0,0,0,0.08);
                }
                
                #chatgpt-nav-sidebar::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 2px;
                }
                
                #chatgpt-nav-sidebar a {
                    color: #0D0D0D;
                    text-decoration: none;
                }
                
                #chatgpt-nav-sidebar a:hover {
                    background-color: #F4F4F4;
                    border-radius: 1.5rem;
                }
                
                #chatgpt-nav-sidebar .nav-index {
                    color: #6e6e80;
                    margin-right: 6px;
                    font-size: 15px;
                }
                
                #chatgpt-nav-sidebar .nav-item-wrapper {
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                }
                
                #chatgpt-nav-sidebar a.active {
                    background-color: #F4F4F4;
                    border-radius: 1.5rem;
                    font-weight: 600;
                    color: #0D0D0D;
                }
                
                .nav-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    color: #0D0D0D;
                    gap: 8px;
                }
                
                .nav-loading::before {
                    content: "";
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(0, 0, 0, 0.1);
                    border-top-color: #0D0D0D;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
            `;
        }
        
        // 共用的加载动画样式
        styles += `
            .nav-loading::after {
                content: "加载中";
                animation: dots 1.5s infinite;
            }
        `;
        
        return styles;
    };
    
    // 监听主题变化并更新样式
    const setupThemeObserver = () => {
        // 监听 body 的 class 变化来检测主题切换
        const observer = new MutationObserver(() => {
            const sidebar = document.getElementById('chatgpt-nav-sidebar');
            if (sidebar) {
                updateSidebarTheme(sidebar);
                
                // 更新样式表
                const styleElement = document.getElementById('chatgpt-nav-styles');
                if (styleElement) {
                    styleElement.textContent = getStylesByTheme();
                }
            }
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            const sidebar = document.getElementById('chatgpt-nav-sidebar');
            if (sidebar) {
                updateSidebarTheme(sidebar);
                
                // 更新样式表
                const styleElement = document.getElementById('chatgpt-nav-styles');
                if (styleElement) {
                    styleElement.textContent = getStylesByTheme();
                }
            }
        });
    };

    function createNavigationItem(node) {
        const sidebar = document.getElementById('chatgpt-nav-sidebar');
        if (!sidebar) {
            utils.log('导航栏不存在，无法创建导航项', 'error');
            return;
        }
    
        const dataTestId = node.getAttribute('data-testid');
        if (!dataTestId) {
            utils.log('节点缺少 data-testid 属性', 'warn');
            return;
        }
    
        const isUserQuestion = parseInt(dataTestId.split('-')[2]) % 2 === 1;
        const id = `nav-${dataTestId}`;

        // 转义HTML内容
        const escapeHtml = (unsafe) => {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };
    
        const textContent = (node.querySelector('.whitespace-pre-wrap')?.innerText.trim() || node.innerText.trim())
                    .split(/[\n\r]+/)
                    .join(' ')
                    .replace(/\s+/g, ' ');
        const displayText = textContent.length > 20 ? escapeHtml(textContent.slice(0, 20)) + '...' : escapeHtml(textContent);

        if (!isUserQuestion) {
            utils.log('非用户提问，跳过', 'warn');
            return;
        }

        // 检查是否已存在相同 ID 的导航项
        const existingNavItem = sidebar.querySelector(`[data-nav-id="${id}"]`);
        if (existingNavItem) {
            // 比较内容是否相同
            const existingText = existingNavItem.getAttribute('title');
            if (existingText !== textContent) {
                utils.log(`导航项 ${id} 内容已更新，正在更新显示`, 'info');
                // 更新现有导航项的内容
                existingNavItem.innerHTML = `<span class="nav-index">${existingNavItem.querySelector('.nav-index').textContent}</span> ${displayText}`;
                existingNavItem.setAttribute('title', textContent);
            } else {
                utils.log(`导航项 ${id} 已存在且内容相同，跳过`, 'info');
            }
            return;
        }

        // 创建新的导航项
        const existingNavItems = sidebar.querySelectorAll('.nav-item-wrapper');
        const navItemsCount = existingNavItems.length + 1;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'nav-item-wrapper';
        const navItem = document.createElement('div');
        navItem.innerHTML = `<a href="#${id}" data-nav-id="${id}" title="${escapeHtml(textContent)}"><span class="nav-index">${navItemsCount}.</span> ${displayText}</a>`;
        wrapper.appendChild(navItem);
        sidebar.appendChild(wrapper);
        node.id = id;
    };

    // 优化滚动跟踪功能
    const setupScrollSpy = () => {
        const sidebar = document.getElementById('chatgpt-nav-sidebar');
        if (!sidebar) return;
    
        let ticking = false;
        let navLinks = [];
        let contentSections = [];
        let isMouseOverSidebar = false; // 用于跟踪鼠标是否在导航栏上
    
        // 监听鼠标进入和离开导航栏的事件
        sidebar.addEventListener('mouseenter', () => {
            isMouseOverSidebar = true;
        });
    
        sidebar.addEventListener('mouseleave', () => {
            isMouseOverSidebar = false;
        });
    
        // 获取所有导航链接和对应内容区域
        const updateAnchors = () => {
            navLinks = Array.from(sidebar.querySelectorAll('a[data-nav-id]'));
            contentSections = navLinks.map(link => {
                const id = link.getAttribute('data-nav-id');
                return document.getElementById(id);
            }).filter(Boolean);
            
            utils.log(`滚动跟踪：找到 ${navLinks.length} 个导航项和 ${contentSections.length} 个内容区域`);
        };
    
        // 更新活动状态
        const updateActiveState = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // 如果没有导航项或内容区域不匹配，重新获取
                    if (navLinks.length === 0 || navLinks.length !== contentSections.length) {
                        updateAnchors();
                    }
                    
                    if (contentSections.length === 0) {
                        ticking = false;
                        return;
                    }
                    
                    // 找到当前在视口中的内容
                    let activeIndex = -1;
                    const offset = 120; // 增加顶部偏移量，考虑到页面顶部的导航栏高度
                    
                    // 从后往前查找，找到第一个在视口上方的元素
                    for (let i = 0; i < contentSections.length; i++) {
                        const section = contentSections[i];
                        if (!section) continue;
                        
                        const rect = section.getBoundingClientRect();
                        // 如果元素顶部在视口内或刚好在视口上方
                        if (rect.top <= offset && rect.bottom > 0) {
                            activeIndex = i;
                            break;
                        }
                    }
                    
                    // 如果没找到可见元素，尝试找最接近顶部的元素
                    if (activeIndex === -1 && contentSections.length > 0) {
                        let minDistance = Infinity;
                        for (let i = 0; i < contentSections.length; i++) {
                            const section = contentSections[i];
                            if (!section) continue;
                            
                            const rect = section.getBoundingClientRect();
                            const distance = Math.abs(rect.top - offset);
                            if (distance < minDistance) {
                                minDistance = distance;
                                activeIndex = i;
                            }
                        }
                    }
                    
                    // 更新导航项状态
                    navLinks.forEach((link, index) => {
                        if (index === activeIndex) {
                            link.classList.add('active');
                            // 只有当鼠标不在导航栏时才自动滚动
                            if (!isMouseOverSidebar) {
                                setTimeout(() => {
                                    link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }, 100);
                            }
                        } else {
                            link.classList.remove('active');
                        }
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        };
    
        // 节流函数
        const throttle = (func, limit) => {
            let lastFunc;
            let lastRan;
            return function() {
                const context = this;
                const args = arguments;
                if (!lastRan) {
                    func.apply(context, args);
                    lastRan = Date.now();
                } else {
                    clearTimeout(lastFunc);
                    lastFunc = setTimeout(function() {
                        if ((Date.now() - lastRan) >= limit) {
                            func.apply(context, args);
                            lastRan = Date.now();
                        }
                    }, limit - (Date.now() - lastRan));
                }
            };
        };
    
        // 监听滚动事件，使用节流
        const scrollHandler = throttle(() => {
            if (!isMouseOverSidebar) {
                updateActiveState();
            }
        }, 200); // 200ms 的节流间隔
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        // 监听导航栏变化和内容变化
        const sidebarObserver = new MutationObserver(() => {
            updateAnchors();
            updateActiveState();
        });
        
        sidebarObserver.observe(sidebar, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        // 监听整个文档变化，以捕获内容区域的变化
        const contentObserver = new MutationObserver((mutations) => {
            // 检查是否有相关变化
            let needsUpdate = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' || 
                    (mutation.type === 'attributes' && mutation.attributeName === 'id')) {
                    needsUpdate = true;
                    break;
                }
            }
            
            if (needsUpdate) {
                updateAnchors();
                updateActiveState();
            }
        });
        
        contentObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['id']
        });
        
        // 初始化：多次尝试更新以确保捕获到所有内容
        updateAnchors();
        updateActiveState();
        
        // 延迟再次更新以处理异步加载的内容
        setTimeout(() => {
            updateAnchors();
            updateActiveState();
        }, 500);
        
        setTimeout(() => {
            updateAnchors();
            updateActiveState();
        }, 1500);
        
        // 添加窗口大小变化监听
        window.addEventListener('resize', updateActiveState, { passive: true });
    };

    // 删除这里重复的 createNavigationItem 函数声明
    // const createNavigationItem = (node) => { ... }

    // 添加 URL 变化监听
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            utils.log('检测到页面 URL 变化，重新初始化导航');
            setTimeout(initializeNavigator, 500); // 延迟执行以等待页面内容加载
        }
    });

    // 开始监听 URL 变化
    urlObserver.observe(document.querySelector('body'), {
        childList: true,
        subtree: true
    });

    // 初始化执行
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
            initializeNavigator();
            setupThemeObserver(); // 添加主题观察器
        });
    } else {
        initializeNavigator();
        setupThemeObserver(); // 添加主题观察器
    }
})();
