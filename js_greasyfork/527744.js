// ==UserScript==
// @name         NGA自动翻页
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  滚轮触底后二次滚动加载，添加回到顶部按钮
// @author       NoWorld
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @grant        none
// @icon         https://img3.nga.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/527744/NGA%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/527744/NGA%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================== 自动翻页功能 ======================
    // 配置参数
    const SCROLL_THRESHOLD = 50;   // 触底阈值(px)
    const COOLDOWN_TIME = 800;     // 操作冷却时间(ms)
    let lastLoadTime = 0;          // 最后加载时间戳
    let hasReachedBottom = false;  // 首次触底状态

    // 精准触底检测
    function isAtBottom() {
        return window.scrollY + window.innerHeight >=
               document.documentElement.scrollHeight - SCROLL_THRESHOLD;
    }

    // 改进版滚轮方向检测
    function handleWheel(e) {
        // 冷却期拦截
        if (Date.now() - lastLoadTime < COOLDOWN_TIME) return;

        // 方向检测 (兼容所有浏览器)
        const delta = Math.sign(
            e.deltaY ||  // Chrome/Firefox
            (e.wheelDelta ? -e.wheelDelta/120 : 0) ||  // IE
            (e.detail ? e.detail : 0)  // Old Firefox
        );

        // 仅处理向下滚动
        if (delta <= 0) return;

        // 核心逻辑
        if (isAtBottom()) {
            if (!hasReachedBottom) {
                // 首次触底：只记录状态
                hasReachedBottom = true;
                // console.log('[状态] 首次滚轮触底');
            } else {
                // 二次触底：触发加载
                // console.log('[动作] 二次滚轮触底 → 加载');
                loadNextPage();
                hasReachedBottom = false;
                lastLoadTime = Date.now();
            }
        } else {
            // 不在底部时重置状态
            hasReachedBottom = false;
        }
    }

    // 加载下一页
    function loadNextPage() {
        const btn = document.querySelector('a.uitxt1[title="加载下一页"]');
        if (btn?.offsetParent) {
            btn.click();
            btn.style.opacity = '0.5'; // 视觉反馈代替直接隐藏
            setTimeout(() => btn.style.opacity = '', 1000);
        }
    }

    // 高性能事件监听（被动模式+防抖）
    let wheelTimeout;
    const wheelHandler = (e) => {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => handleWheel(e), 50);
    };

    window.addEventListener('wheel', wheelHandler, { passive: true });
    window.addEventListener('DOMMouseScroll', wheelHandler, { passive: true }); // Firefox

    // 初始加载检测
    setTimeout(() => isAtBottom() && loadNextPage(), 2000);

        // ====================== 返回顶部按钮 ======================
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"
             class="Zi Zi--BackToTop" fill="#FFF0CD">
            <path fill-rule="evenodd"
                  d="M13.204 3.107a1.75 1.75 0 0 0-2.408 0L3.806 9.73c-1.148 1.088-.378 3.02 1.204 3.02h2.24V20c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 16.75 20v-7.25h2.24c1.582 0 2.353-1.932 1.204-3.02l-6.99-6.623Z"
                  clip-rule="evenodd"></path>
        </svg>
    `;

    // 基础样式
    Object.assign(backToTopBtn.style, {
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#591804',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        opacity: '0',
        transform: 'translateY(20px) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
    });

    // 悬停特效
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.background = '#7a2b0a';
        backToTopBtn.style.transform = 'translateY(0) scale(1.1)';
        backToTopBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.background = '#591804';
        backToTopBtn.style.transform = 'translateY(0) scale(1)';
        backToTopBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    });

    // 显示控制
    let lastScrollY = 0;
    const checkScrollPosition = () => {
        const show = window.scrollY > 300;
        backToTopBtn.style.opacity = show ? '1' : '0';
        backToTopBtn.style.pointerEvents = show ? 'auto' : 'none';
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(checkScrollPosition);
    });

    // 点击功能
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(backToTopBtn);
    checkScrollPosition();
})();