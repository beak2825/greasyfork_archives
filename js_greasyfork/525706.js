// ==UserScript==
// @name         ✒️番茄小说作家隐私✒️
// @namespace    https://github.com/bencky1017/browserplugin/
// @version      1.0.0
// @description  ✒️番茄小说作家专用，保护马甲。✨隐藏作者个人信息、书名。⚡防止家中忽然来人，站在你的身后，除非你切换页面，否则自己的马甲就要暴露啦🤪
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF42lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA1LTE0VDIzOjM2OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNS0xNVQwMTozMDoxOCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNS0xNVQwMTozMDoxOCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NGYzNDVhNi0wOWIxLWY4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
// @author       BenckyC
// @license      MIT
// @match        *://fanqienovel.com/writer/*
// @match        *://fanqienovel.com/main/writer/*
// @grant        GM_addStyle
// @note         2025-02-03 12:14:59 1.0.0  创建番茄小说作家隐私脚本
// @downloadURL https://update.greasyfork.org/scripts/525706/%E2%9C%92%EF%B8%8F%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E4%BD%9C%E5%AE%B6%E9%9A%90%E7%A7%81%E2%9C%92%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/525706/%E2%9C%92%EF%B8%8F%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E4%BD%9C%E5%AE%B6%E9%9A%90%E7%A7%81%E2%9C%92%EF%B8%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 文字配置区
    const TEXT_SELECTORS = [
        '.desc-author>span',                    // 欢迎语-笔名
        '.book-name',                           // 章节管理-书名
        '.publish-header-book-name',            // 新建章节-书名
        '.user-card-left-text-hello',           // 作家专区欢迎语-笔名
        '.info-content-title > .hoverup',       // 工作台-书名
        '.slogin-user-avatar__info__name',      // 菜单栏-笔名
        '.calendar .arco-select-view-selector', // 打卡日历-书名
        '.book-select-info-title',              // 小说数据-书名
        '.book-info-details-name',              // 头条推荐-书名

    ];

    // 图片配置区
    const IMAGE_SELECTORS = [
        '.slogin-user-avatar__info__avatar',        // 菜单栏-头像
        '.home-book-item-home .book-cover-img',     // 工作台-封面
        '.book-item-info .book-cover-img',          // 作品管理-封面
        '.book-select .book-cover-img',             // 小说数据-封面
        '.recommend-manage .book-cover-img'         // 头条推荐-封面
    ];

    // 注入模糊样式
    GM_addStyle(`
        .__privacy_blur {
            filter: blur(5px) !important;
            transition: filter 0.3s ease !important;
        }
        .__privacy_blur:hover {
            filter: blur(8px) !important;
        }
    `);

    // 智能处理器
    const createProcessor = () => {
        let pending = false;

        return {
            schedule: () => {
                if (!pending) {
                    pending = true;
                    requestAnimationFrame(() => {
                        processElements();
                        pending = false;
                    });
                }
            }
        };
    };

    // 核心处理逻辑
    const processElements = () => {
        // 处理文本元素
        TEXT_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.dataset.obfuscated && el.textContent.trim()) {
                    el.dataset.originalText = el.textContent;
                    el.textContent = '*'.repeat(el.textContent.length);
                    el.dataset.obfuscated = 'true';
                }
            });
        });

        // 处理图片元素
        IMAGE_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(img => {
                if (!img.dataset.blurred) {
                    img.classList.add('__privacy_blur');
                    img.dataset.blurred = 'true';

                    // 添加点击还原功能
                    img.addEventListener('click', function (e) {
                        if (e.detail === 3) { // 三击还原
                            this.classList.remove('__privacy_blur');
                            this.dataset.blurred = 'false';
                        }
                    });
                }
            });
        });
    };

    // 初始化
    const processor = createProcessor();

    // 精准观察器
    const observer = new MutationObserver(mutations => {
        const needsUpdate = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => {
                if (node.nodeType !== 1) return false;

                return [...TEXT_SELECTORS, ...IMAGE_SELECTORS].some(selector =>
                    node.matches(selector) || node.querySelector(selector)
                );
            });
        });

        if (needsUpdate) processor.schedule();
    });

    // 启动观察
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 事件监听
    document.addEventListener('DOMContentLoaded', processor.schedule);
    window.addEventListener('load', processor.schedule);

    // SPA路由检测
    let lastPath = location.pathname;
    const checkSPA = () => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            processor.schedule();
        }
    };
    setInterval(checkSPA, 500);
})();