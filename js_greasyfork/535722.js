// ==UserScript==
// @name         Linux.do 自动滚动（优化版）
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  带定时刷新和回复计数检测功能的自动滚动按钮
// @license MIT
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535722/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/535722/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在主题页面
    function isTopicPage() {
        return window.location.pathname.includes('/t/topic/');
    }

    // 获取当前回复数和总回复数
    function getReplyCounts() {
        const timelineElement = document.querySelector('.timeline-replies');
        if (!timelineElement) {
            return { current: 0, total: 0 };
        }

        const text = timelineElement.textContent.trim();
        const match = text.match(/(\d+)\s*\/\s*(\d+)/);
        
        if (match) {
            return {
                current: parseInt(match[1], 10),
                total: parseInt(match[2], 10)
            };
        }
        
        return { current: 0, total: 0 };
    }

    // 检查是否已经浏览完所有回复
    function hasReadAllReplies() {
        const { current, total } = getReplyCounts();
        return current > 0 && current >= total;
    }

    // 显示提示消息
    function showToast(message, duration = 3000) {
        // 移除已存在的toast
        const existingToast = document.getElementById('scroll-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'scroll-toast';
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '100px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'var(--primary)';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '20px';
        toast.style.zIndex = '10000';
        toast.style.fontSize = '14px';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(toast);
        
        // 淡入效果
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // 淡出并移除
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // 初始化或重新初始化按钮
    function initButton() {
        // 如果不在主题页面，移除按钮并停止滚动
        if (!isTopicPage()) {
            const existingButton = document.getElementById('auto-scroll-button');
            if (existingButton) {
                existingButton.remove();
            }
            stopAutoScroll();
            return;
        }

        // 如果按钮已存在，不重复创建
        if (document.getElementById('auto-scroll-button')) {
            return;
        }

        // 创建按钮
        const scrollButton = document.createElement('button');
        scrollButton.id = 'auto-scroll-button'; // 添加ID以便查找
        scrollButton.innerHTML = '▶';
        scrollButton.title = '开始滚动';
        scrollButton.style.position = 'fixed';
        scrollButton.style.top = '84px';
        scrollButton.style.right = '20px';
        scrollButton.style.zIndex = '9999';
        scrollButton.style.width = '50px';
        scrollButton.style.height = '50px';
        scrollButton.style.borderRadius = '50%';
        scrollButton.style.backgroundColor = 'var(--tertiary-300)';
        scrollButton.style.border = 'none';
        scrollButton.style.cursor = 'pointer';
        scrollButton.style.fontSize = '20px';
        scrollButton.style.display = 'flex';
        scrollButton.style.alignItems = 'center';
        scrollButton.style.justifyContent = 'center';
        scrollButton.style.transition = 'all 0.3s ease';

        // 添加悬停效果
        scrollButton.addEventListener('mouseenter', () => {
            scrollButton.style.transform = 'scale(1.1)';
            scrollButton.style.backgroundColor = 'var(--tertiary-400)';
        });
        
        scrollButton.addEventListener('mouseleave', () => {
            scrollButton.style.transform = 'scale(1)';
            scrollButton.style.backgroundColor = 'var(--tertiary-300)';
        });

        document.body.appendChild(scrollButton);

        // 按钮点击事件
        scrollButton.addEventListener('click', toggleAutoScroll);

        // 检查是否需自动恢复滚动（页面刷新后）
        if (sessionStorage.getItem('autoScrollResume') === 'true') {
            sessionStorage.removeItem('autoScrollResume');
            startAutoScroll();
        }
    }

    // 状态管理
    let scrollInterval = null;
    let isScrolling = false;
    let scrollStartTime = 0;
    let bottomCheckTimeout = null; // 用于3秒延迟确认的定时器
    let hasReachedBottom = false; // 标记是否已经到达底部
    const SCROLL_DURATION = 5 * 60 * 1000; // 5分钟滚动时长
    const REFRESH_DELAY = 10 * 1000; // 10秒刷新等待
    const BOTTOM_CHECK_DELAY = 3 * 1000; // 3秒延迟确认

    function toggleAutoScroll() {
        if (isScrolling) {
            stopAutoScroll();
        } else {
            startAutoScroll();
        }
    }

    function startAutoScroll() {
        scrollStartTime = Date.now();
        isScrolling = true;
        hasReachedBottom = false; // 重置底部标记
        const scrollButton = document.getElementById('auto-scroll-button');
        if (scrollButton) {
            scrollButton.innerHTML = '⏹';
            scrollButton.title = '停止滚动';
        }

        // 主滚动逻辑
        scrollInterval = setInterval(() => {
            // 检查是否已经浏览完所有回复
            if (hasReadAllReplies()) {
                if (!hasReachedBottom) {
                    // 如果还没有确认到达底部，设置3秒延迟确认
                    if (!bottomCheckTimeout) {
                        bottomCheckTimeout = setTimeout(() => {
                            // 3秒后再次检查
                            if (hasReadAllReplies()) {
                                hasReachedBottom = true;
                                stopAutoScroll();
                                const { current, total } = getReplyCounts();
                                showToast(`🎉 已浏览完所有回复 (${current}/${total})，自动停止滚动`);
                            }
                            bottomCheckTimeout = null;
                        }, BOTTOM_CHECK_DELAY);
                        
                        // 显示正在确认的提示
                        const { current, total } = getReplyCounts();
                        showToast(`📍 检测到已浏览完所有回复 (${current}/${total})，正在确认...`);
                    }
                }
                return;
            } else {
                // 如果没有浏览完所有回复，清除延迟确认定时器
                if (bottomCheckTimeout) {
                    clearTimeout(bottomCheckTimeout);
                    bottomCheckTimeout = null;
                }
            }

            window.scrollBy(0, 3);

            // 检查是否达到5分钟滚动时长
            if (Date.now() - scrollStartTime >= SCROLL_DURATION) {
                stopAutoScroll();
                sessionStorage.setItem('autoScrollResume', 'true');
                showToast('⏰ 滚动时间到达，准备刷新页面...');
                setTimeout(() => location.reload(), REFRESH_DELAY);
            }
        }, 16);
    }

    function stopAutoScroll() {
        clearInterval(scrollInterval);
        if (bottomCheckTimeout) {
            clearTimeout(bottomCheckTimeout);
            bottomCheckTimeout = null;
        }
        isScrolling = false;
        const scrollButton = document.getElementById('auto-scroll-button');
        if (scrollButton) {
            scrollButton.innerHTML = '▶';
            scrollButton.title = '开始滚动';
        }
    }

    // 监听URL变化
    let currentURL = location.href;
    function checkURLChange() {
        if (location.href !== currentURL) {
            currentURL = location.href;
            initButton();
        }
    }

    // 使用多种方式监听URL变化
    // 1. 监听popstate事件（浏览器前进后退）
    window.addEventListener('popstate', checkURLChange);

    // 2. 监听hashchange事件（hash变化）
    window.addEventListener('hashchange', checkURLChange);

    // 3. 重写history.pushState和history.replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        setTimeout(checkURLChange, 0);
    };
    
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        setTimeout(checkURLChange, 0);
    };

    // 4. 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        checkURLChange();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 5. 定期检查URL变化（作为后备方案）
    setInterval(checkURLChange, 1000);

    // 初始化
    initButton();
})();
