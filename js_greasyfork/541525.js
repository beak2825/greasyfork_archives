// ==UserScript==
// @name         bilibili增强（评论图片快捷切换、播放量前十高亮、播放器自适应）
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  【视频页&稍后再看页】：①滚轮切换评论图片（Alt停用）②esc关闭评论区笔记 ③浏览器最大化时放大播放器；【搜索结果页&TA的视频页】：高亮播放量前10标题。
// @author       coccvo
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://search.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAG1BMVEUAoNb////5/f7q+PzI6/ek3vGA0Os7t+AXqtoAacFbAAAAi0lEQVR42o2R3QqDIQxDE/uX93/isVVB3GTfuYo9IDQFSZobF+sBkiNVzomXckxhBSzj72xT0NWm5wq28MgCUJk5QziJEYUvKgZC+IECBVQeFFAQ5DxwQQBkPDABU3iuPdJ3YdVbddiF+sMOT8TIbq7DJjjsM++wiYM/4rL5tatru9d79AUPwknwwgt7fAWIfqzpTgAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541525/bilibili%E5%A2%9E%E5%BC%BA%EF%BC%88%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2%E3%80%81%E6%92%AD%E6%94%BE%E9%87%8F%E5%89%8D%E5%8D%81%E9%AB%98%E4%BA%AE%E3%80%81%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E9%80%82%E5%BA%94%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541525/bilibili%E5%A2%9E%E5%BC%BA%EF%BC%88%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2%E3%80%81%E6%92%AD%E6%94%BE%E9%87%8F%E5%89%8D%E5%8D%81%E9%AB%98%E4%BA%AE%E3%80%81%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E9%80%82%E5%BA%94%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const { hostname, pathname } = location;

    // ==============================
    // 功能A：视频页 & 稍后再看页功能
    // ==============================
    if (
        hostname === 'www.bilibili.com' &&
        (pathname.startsWith('/video/') || pathname.startsWith('/list/'))
    ) {

        // --- A1: 评论区图片滚轮切换 ---
        function switchImage(direction) {
            const nextButton = document.querySelector('button.pswp__button.pswp__button--arrow--next');
            const prevButton = document.querySelector('button.pswp__button.pswp__button--arrow--prev');
            if (direction === 'next' && nextButton) {
                nextButton.click();
            } else if (direction === 'prev' && prevButton) {
                prevButton.click();
            }
        }

        document.addEventListener('wheel', function (event) {
            if (!event.altKey) {
                const hasButtons = document.querySelector('button.pswp__button.pswp__button--arrow--next') ||
                      document.querySelector('button.pswp__button.pswp__button--arrow--prev');
                if (hasButtons) {
                    event.preventDefault();
                    if (event.deltaY > 0) {
                        switchImage('next');
                    } else {
                        switchImage('prev');
                    }
                }
            }
        }, { passive: false });

        // --- A2: 按 Esc 关闭评论详情弹窗 ---
        (function () {
            function closeCommentDetailPopup() {
                const popup = document.querySelector('bili-comments-popup[title="评论详情"]');
                if (popup && popup.isConnected) {
                    // 方法1：尝试调用内部关闭逻辑（如果有）
                    const closeBtn = popup.querySelector?.('#close') || popup.shadowRoot?.querySelector?.('#close');
                    if (closeBtn) {
                        closeBtn.click();
                        return;
                    }

                    // 方法2：直接移除元素（B站会自动清理状态）
                    popup.remove();
                    console.log('[A3] 评论详情弹窗已通过 Esc 关闭');
                }
            }

            function onKeyDown(e) {
                // 仅当弹窗存在且未聚焦在输入框时响应 Esc
                const popupExists = !!document.querySelector('bili-comments-popup[title="评论详情"]');
                const activeElement = document.activeElement;
                const isInputFocused = ['INPUT', 'TEXTAREA'].includes(activeElement?.tagName) ||
                      activeElement?.contentEditable === 'true';

                if (e.key === 'Escape' && popupExists && !isInputFocused) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeCommentDetailPopup();
                }
            }

            // 使用捕获阶段，确保优先处理
            document.addEventListener('keydown', onKeyDown, { capture: true });
        })();

        // --- A3：浏览器窗口全屏时，播放器自动变宽（仅执行一次，兼容异步加载）---
        (function () {
            const TARGET_WIDTH = "1415px";
            const TARGET_HEIGHT = "796px";
            const WIDTH_THRESHOLD = 1850;

            // 仅当窗口足够宽时才继续
            if (window.innerWidth < WIDTH_THRESHOLD) return;

            function getLeftContainer() {
                const pathname = location.pathname;
                if (pathname.startsWith('/video/')) {
                    return document.querySelector('.left-container.scroll-sticky');
                } else if (pathname.startsWith('/list/')) {
                    return document.querySelector('.playlist-container--left');
                }
                return null;
            }

            function tryApplySize() {
                const leftContainer = getLeftContainer();
                const playerWrap = document.getElementById('playerWrap');
                const bilibiliPlayer = document.getElementById('bilibili-player');

                if (!leftContainer || !playerWrap || !bilibiliPlayer) {
                    return false; // 元素未就绪
                }

                // 应用样式
                leftContainer.style.width = TARGET_WIDTH;
                bilibiliPlayer.style.width = TARGET_WIDTH;
                bilibiliPlayer.style.height = TARGET_HEIGHT;
                playerWrap.style.height = TARGET_HEIGHT;

                console.log(`[播放器自适应] 已放大（窗口宽度: ${window.innerWidth}px）`);
                return true; // 成功应用
            }

            // 尝试立即执行
            if (tryApplySize()) return;

            // 若失败，延迟最多 2 秒内重试一次（避免长期监听）
            const maxWait = 2000; // 最多等 2 秒
            const startTime = Date.now();

            const retryTimer = setInterval(() => {
                if (tryApplySize() || Date.now() - startTime > maxWait) {
                    clearInterval(retryTimer); // 无论成功与否，只试这一次延迟机会
                }
            }, 300); // 每 300ms 尝试一次
        })();
    }

    // ==============================
    // 功能B：播放量 Top10 标题高亮（搜索页 & UP主视频页）—— SPA 兼容版
    // ==============================

    (function () {
        const STYLE_ID = 'bili-top10-style';
        let isObserving = false;
        let debounceTimer = null;

        // 工具函数：解析播放量
        function parsePlayCount(text) {
            if (!text) return 0;
            const t = text.trim().replace(/\s+/g, '');
            const match = t.match(/^([\d.]+)(万?)$/);
            if (!match) return 0;
            let num = parseFloat(match[1]);
            return isNaN(num) ? 0 : Math.floor(match[2] === '万' ? num * 10000 : num);
        }

        // 处理搜索页
        function processSearchPage() {
            const cards = document.querySelectorAll('.bili-video-card');
            const data = [];
            for (const card of cards) {
                const playSpan = card.querySelector('.bili-video-card__stats--item:first-child span:last-child');
                const titleEl = card.querySelector('.bili-video-card__info--tit');
                const count = playSpan ? parsePlayCount(playSpan.textContent) : 0;
                if (count > 0 && titleEl) data.push({ titleEl, count });
            }
            return data;
        }

        // 处理 UP 主视频页（包括从主页跳转来的）
        function processUploadPage() {
            const cards = document.querySelectorAll('.upload-video-card');
            const data = [];
            for (const card of cards) {
                const playSpan = card.querySelector('.bili-cover-card__stat:first-child > span');
                const titleEl = card.querySelector('.bili-video-card__title > a');
                const count = playSpan ? parsePlayCount(playSpan.textContent) : 0;
                if (count > 0 && titleEl) data.push({ titleEl, count });
            }
            return data;
        }

        // 执行高亮
        function highlightTop10() {
            let videoData = [];

            if (location.hostname === 'search.bilibili.com') {
                videoData = processSearchPage();
            } else if (
                location.hostname === 'space.bilibili.com' &&
                location.pathname.includes('/upload/video')
            ) {
                videoData = processUploadPage();
            } else {
                cleanup(); // 不在目标页，清理高亮
                return;
            }

            if (videoData.length === 0) return;

            // 清除旧高亮
            document.querySelectorAll('.bili-top10-title').forEach(el => {
                el.classList.remove('bili-top10-title');
            });

            // 高亮 Top10
            videoData
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .forEach(item => item.titleEl?.classList.add('bili-top10-title'));
        }

        // 清理高亮样式
        function cleanup() {
            document.querySelectorAll('.bili-top10-title').forEach(el => {
                el.classList.remove('bili-top10-title');
            });
        }

        // 注入 CSS（仅一次）
        function injectStyle() {
            if (document.getElementById(STYLE_ID)) return;
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
            .bili-top10-title {
                color: #ff6d00 !important;
                font-weight: bold !important;
                text-shadow: 0 0 4px rgba(255, 109, 0, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 判断是否应激活功能
    function shouldActivate() {
        return (
            location.hostname === 'search.bilibili.com' ||
            (location.hostname === 'space.bilibili.com' && location.pathname.includes('/upload/video'))
        );
    }

    // 尝试运行
    function tryRun() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (shouldActivate()) {
                injectStyle();
                highlightTop10();
            } else {
                cleanup();
            }
        }, 600);
    }

    // 监听变化
    function watchRouteChanges() {
        const originalPush = history.pushState;
        const originalReplace = history.replaceState;

        history.pushState = function (...args) {
            originalPush.apply(this, args);
            tryRun();
        };
        history.replaceState = function (...args) {
            originalReplace.apply(this, args);
            tryRun();
        };
        window.addEventListener('popstate', tryRun);
    }
    watchRouteChanges();
    tryRun(); // 立即尝试一次（处理直接访问的情况）
    })();
})();


