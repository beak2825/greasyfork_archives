// ==UserScript==
// @name         NodeSeek 帖子后台打开&键盘翻页
// @version      1.7.7
// @description  NodeSeek 帖子后台打开 + 状态切换按钮 + 键盘左右翻页功能（支持首页和帖子内页）
// @match        https://www.nodeseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @author       Gh0st&Claude
// @namespace https://greasyfork.org/users/118214
// @downloadURL https://update.greasyfork.org/scripts/516467/NodeSeek%20%E5%B8%96%E5%AD%90%E5%90%8E%E5%8F%B0%E6%89%93%E5%BC%80%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/516467/NodeSeek%20%E5%B8%96%E5%AD%90%E5%90%8E%E5%8F%B0%E6%89%93%E5%BC%80%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 增强配置
    const CONFIG = {
        DEFAULT_ENABLED: true,
        DEFAULT_STATUS_VISIBLE: true,
        DEBOUNCE_DELAY: 100,
        ALLOWED_DOMAINS: ['www.nodeseek.com'],
        STATUS_ID: 'ns-bg-open-status-v2',
        LINK_SELECTORS: [
            'a.thread-title:not([href^="#"])',
            '.thread-list-title a:not([href^="#"])',
            '.post-title a:not([href^="#"])',
            '.topic-title a:not([href^="#"])',
            '[data-type="post-link"]'
        ]
    };

    // 创建状态元素（强制置顶）
    const createStatus = () => {
        let status = document.getElementById(CONFIG.STATUS_ID);
        if (!status) {
            status = document.createElement('div');
            status.id = CONFIG.STATUS_ID;
            Object.assign(status.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                padding: '10px 15px',
                borderRadius: '15px',
                fontSize: '14px',
                fontWeight: 'bold',
                zIndex: '2147483647',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                transition: 'opacity 0.3s',
                display: 'none'
            });
            document.documentElement.appendChild(status);
        }
        return status;
    };

    // 状态管理
    const statusElement = createStatus();
    let isEnabled = GM_getValue('bgEnabled', CONFIG.DEFAULT_ENABLED);
    let isVisible = GM_getValue('statusVisible', CONFIG.DEFAULT_STATUS_VISIBLE);

    // 更新状态显示（强制样式）
    const updateStatus = () => {
        statusElement.textContent = isEnabled ? '后台打开：ON' : '后台打开：OFF';
        statusElement.style.backgroundColor = isEnabled ? '#4CAF50' : '#F44336';
        statusElement.style.color = '#FFFFFF';
        statusElement.style.display = isVisible ? 'block' : 'none';

        // 防止被覆盖
        statusElement.style.pointerEvents = 'auto';
        statusElement.style.opacity = '1';
    };

    // 事件处理（增强版）
    const handleClick = (event) => {
        if (!isEnabled) return;

        const link = event.target.closest(CONFIG.LINK_SELECTORS.join(','));
        if (!link || !link.href) return;

        try {
            const url = new URL(link.href);
            if (CONFIG.ALLOWED_DOMAINS.includes(url.hostname)) {
                window.open(url, '_blank', 'noopener');
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        } catch (e) {
            console.error('链接处理失败:', e);
        }
    };

    // 智能键盘翻页功能（修复版）
    const handleKeyboardPagination = (event) => {
        // 忽略在输入框中的操作
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
            return;
        }

        // 获取当前页面路径
        const currentPath = window.location.pathname.replace(/\/$/, '');

        // 帖子列表页翻页逻辑
        if (/^\/page-\d+$/.test(currentPath)) {
            const pageNum = parseInt(currentPath.replace('/page-', '')) || 1;
            switch (event.key) {
                case 'ArrowLeft':
                    if (pageNum > 1) {
                        window.location.href = `/page-${pageNum - 1}`;
                        event.preventDefault();
                    }
                    break;
                case 'ArrowRight':
                    window.location.href = `/page-${pageNum + 1}`;
                    event.preventDefault();
                    break;
            }
        }
        // 首页翻页逻辑
        else if (currentPath === '' || currentPath === '/') {
            if (event.key === 'ArrowRight') {
                window.location.href = '/page-2';
                event.preventDefault();
            }
        }
        // 帖子详情页翻页逻辑（修复实现）
        else if (/^\/post-\d+-\d+$/.test(currentPath)) {
            // 从URL中提取帖子ID和当前页码
            const match = currentPath.match(/\/post-(\d+)-(\d+)$/);
            if (match) {
                const postId = match[1];
                const currentPage = parseInt(match[2]) || 1;

                switch (event.key) {
                    case 'ArrowLeft':
                        if (currentPage > 1) {
                            window.location.href = `/post-${postId}-${currentPage - 1}`;
                            event.preventDefault();
                        }
                        break;
                    case 'ArrowRight':
                        // 尝试获取下一页按钮
                        const nextPageLink = document.querySelector('.pager-next');
                        if (nextPageLink && nextPageLink.href) {
                            window.location.href = nextPageLink.href;
                            event.preventDefault();
                        } else {
                            // 如果找不到下一页按钮，尝试计算最大页码
                            const lastPageLink = document.querySelector('.pager-pos:last-child');
                            if (lastPageLink) {
                                const href = lastPageLink.getAttribute('href');
                                if (href) {
                                    const lastPageMatch = href.match(/post-\d+-(\d+)/);
                                    if (lastPageMatch) {
                                        const maxPage = parseInt(lastPageMatch[1]);
                                        if (currentPage < maxPage) {
                                            window.location.href = `/post-${postId}-${currentPage + 1}`;
                                            event.preventDefault();
                                        }
                                    }
                                }
                            }
                        }
                        break;
                }
            }
        }
    };

    // 事件绑定（立即执行）
    const bindEvents = () => {
        document.removeEventListener('click', handleClick, true);
        document.addEventListener('click', handleClick, {
            capture: true,
            passive: false
        });

        // 添加键盘翻页监听
        document.removeEventListener('keydown', handleKeyboardPagination);
        document.addEventListener('keydown', handleKeyboardPagination);
    };

    // DOM观察器（优化版）
    const observer = new MutationObserver(() => {
        bindEvents();
        updateStatus();
    });

    // 初始化
    const init = () => {
        // 初始设置
        GM_registerMenuCommand('切换后台模式', () => {
            isEnabled = !isEnabled;
            GM_setValue('bgEnabled', isEnabled);
            updateStatus();
        });

        GM_registerMenuCommand('切换状态显示', () => {
            isVisible = !isVisible;
            GM_setValue('statusVisible', isVisible);
            updateStatus();
        });

        // 永久显示保障
        statusElement.addEventListener('click', () => {
            isEnabled = !isEnabled;
            GM_setValue('bgEnabled', isEnabled);
            updateStatus();
        });

        // 观察整个文档
        observer.observe(document, {
            subtree: true,
            childList: true,
            attributes: false
        });

        // 立即执行绑定
        bindEvents();
        updateStatus();

        // 定时状态检查
        setInterval(updateStatus, 1000);
    };

    init();
})();