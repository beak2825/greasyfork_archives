// ==UserScript==
// @name         YouTube 网格列数实时自定义 + 删除推荐模块
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-06-18
// @description  自定义 YouTube 首页网格列数（3~6），实时生效，无需刷新页面，同时可开启/关闭推荐模块显示。
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/img/desktop/yt_1200.png
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540146/YouTube%20%E7%BD%91%E6%A0%BC%E5%88%97%E6%95%B0%E5%AE%9E%E6%97%B6%E8%87%AA%E5%AE%9A%E4%B9%89%20%2B%20%E5%88%A0%E9%99%A4%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/540146/YouTube%20%E7%BD%91%E6%A0%BC%E5%88%97%E6%95%B0%E5%AE%9E%E6%97%B6%E8%87%AA%E5%AE%9A%E4%B9%89%20%2B%20%E5%88%A0%E9%99%A4%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9D%97.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const defaultColumns = 5;
    const styleId = 'tm-youtube-grid-columns';
    const removeSectionKey = 'removeSections';

    let currentColumns = GM_getValue('gridColumns', defaultColumns);
    let removeSections = GM_getValue(removeSectionKey, true);
    let observer = null;

    // 应用 CSS 样式
    function applyStyle(columns) {
        let styleTag = document.getElementById(styleId);
        if (styleTag) styleTag.remove();

        styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.textContent = `
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: ${columns} !important;
            }
            #contents > ytd-rich-grid-row,
            #contents > ytd-rich-grid-row > #contents {
                display: contents;
            }
        `;
        document.head.appendChild(styleTag);
    }

    // 删除推荐模块
    function removeSectionRenderers() {
        document.querySelectorAll('ytd-rich-section-renderer').forEach(el => el.remove());
    }

    // 监听推荐模块动态插入
    function startObservingSections() {
        if (observer) return;
        observer = new MutationObserver(() => {
            if (removeSections) removeSectionRenderers();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 停止监听
    function stopObservingSections() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    // 开关推荐显示
    function toggleRecommendation(on) {
        removeSections = !on;
        GM_setValue(removeSectionKey, removeSections);
        if (removeSections) {
            removeSectionRenderers();
            startObservingSections();
        } else {
            stopObservingSections();
            location.reload(); // 重新加载页面以恢复推荐模块
        }
    }

    // 注册菜单
    function registerMenu() {
        for (let i = 3; i <= 8; i++) {
            GM_registerMenuCommand(`设置列数为 ${i}`, () => {
                GM_setValue('gridColumns', i);
                currentColumns = i;
                applyStyle(currentColumns);
            });
        }

        GM_registerMenuCommand(
            removeSections ? '✅ 当前已关闭推荐模块（点击开启）' : '❌ 当前已开启推荐模块（点击关闭）',
            () => {
                toggleRecommendation(removeSections);
            }
        );
    }

    // 初始化
    applyStyle(currentColumns);
    if (removeSections) {
        removeSectionRenderers();
        startObservingSections();
    }
    registerMenu();
})();
