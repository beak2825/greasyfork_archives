// ==UserScript==
// @name         启航教育课程控制（自动关闭字幕）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  低性能消耗+彻底关闭字幕
// @author       YGTT
// @match        https://www.iqihang.com/ark/record/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545148/%E5%90%AF%E8%88%AA%E6%95%99%E8%82%B2%E8%AF%BE%E7%A8%8B%E6%8E%A7%E5%88%B6%EF%BC%88%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%AD%97%E5%B9%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545148/%E5%90%AF%E8%88%AA%E6%95%99%E8%82%B2%E8%AF%BE%E7%A8%8B%E6%8E%A7%E5%88%B6%EF%BC%88%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%AD%97%E5%B9%95%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentCourseId = extractCourseId(window.location.href);
    let monitorInterval = null;
    let subtitleObserver = null; // 字幕元素专用监听器

    // --------------------------
    // 1. 性能优化：更优雅的监控方案
    // --------------------------
    function initElegantMonitoring() {
        // 清理旧监控
        if (monitorInterval) clearInterval(monitorInterval);
        if (subtitleObserver) subtitleObserver.disconnect();

        // 方案1：DOM变化触发（优先使用，性能最优）
        const videoContainer = document.querySelector('.video-container, .player-wrapper') || document.body;

        // 只监听字幕相关元素的变化
        subtitleObserver = new MutationObserver((mutations) => {
            const hasSubtitleChange = mutations.some(mutation =>
                mutation.target.matches('[class*="subtitle"], [id*="subtitle"], .vjs-text-track-display') ||
                Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 && node.matches('[class*="subtitle"], [id*="subtitle"]')
                )
            );

            if (hasSubtitleChange) {
                console.log('【智能监控】检测到字幕元素变化，触发检查');
                checkAndFixSettings();
            }
        });

        subtitleObserver.observe(videoContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'checked'] // 只监听关键属性
        });

        // 方案2：保底定时器（间隔延长至3秒，降低频率）
        monitorInterval = setInterval(() => {
            const currentId = extractCourseId(window.location.href);
            if (currentId !== currentCourseId) {
                currentCourseId = currentId;
                console.log(`【智能监控】课程ID变化为 ${currentId}，重新初始化`);
                checkAndFixSettings();
            } else {
                // 仅在没有DOM变化时做保底检查
                console.log('【智能监控】保底检查');
                checkAndFixSettings();
            }
        }, 3000);

        console.log('【智能监控】启动（DOM变化+低频率保底）');
    }

    // --------------------------
    // 2. 字幕彻底关闭修复
    // --------------------------
    function findAllSubtitleElements() {
        // 扩展所有可能的字幕元素选择器
        return [
            ...document.querySelectorAll('.vjs-text-track-display, .baijia-subtitle, [class*="subtitle"]'),
            ...document.querySelectorAll('[id*="subtitle"], [data-role="subtitle"], .vjs-subtitles'),
            ...document.querySelectorAll('.vjs-captions, [data-type="subtitle"], .subtitle-container'),
            ...document.querySelectorAll('div:has(> [class*="subtitle"])') // 兼容容器元素
        ];
    }

    function simulateRealClick(element) {
        if (!element) return false;
        // 模拟真实点击的所有事件（解决网站可能忽略合成事件的问题）
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0,
            detail: 1
        });

        // 先触发mousedown再触发click
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
        element.dispatchEvent(mouseDownEvent);
        setTimeout(() => {
            element.dispatchEvent(clickEvent);
            element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        }, 50);
        return true;
    }

    function forceCloseSubtitle() {
        // 步骤1：强制隐藏所有可能的字幕元素（包括动态生成的）
        const allSubtitles = findAllSubtitleElements();
        allSubtitles.forEach(el => {
            el.style.display = 'none !important';
            el.style.visibility = 'hidden !important';
            el.style.opacity = '0 !important';
            el.style.pointerEvents = 'none !important'; // 防止交互
        });

        // 步骤2：找到并点击关闭字幕按钮（模拟真实点击）
        const closeBtn = document.getElementById('closeVtt') ||
                        findElementWithText('li', '关闭字幕') ||
                        findElementWithText('button', '关闭字幕');

        const openBtn = document.getElementById('vtt') ||
                       findElementWithText('li', '打开字幕') ||
                       findElementWithText('button', '打开字幕');

        // 先确保打开按钮处于非活跃状态
        if (openBtn && openBtn.classList.contains('active')) {
            simulateRealClick(openBtn); // 点击打开按钮可能会切换状态
        }

        // 再点击关闭按钮（双重保险）
        if (closeBtn && !closeBtn.classList.contains('active')) {
            simulateRealClick(closeBtn);
            // 延迟再次点击，确保网站内部状态更新
            setTimeout(() => simulateRealClick(closeBtn), 300);
        }

        // 步骤3：检查并取消所有字幕相关选项
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(checkbox => {
            const labelText = checkbox.parentElement?.textContent || checkbox.ariaLabel || '';
            if (labelText.includes('字幕') && checkbox.checked) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                // 触发input事件，应对特殊处理
                checkbox.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        return allSubtitles.every(el => getComputedStyle(el).display === 'none');
    }

    // --------------------------
    // 通用工具函数
    // --------------------------
    function extractCourseId(url) {
        const match = url.match(/record\/(\d+)/);
        return match ? match[1] : '';
    }

    function findElementWithText(selector, text) {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).find(el =>
            el.textContent.trim().includes(text)
        );
    }

    function checkAndFixSettings() {
        // 只检查并修复字幕设置
        const subtitlesClosed = forceCloseSubtitle();
        if (!subtitlesClosed) {
            console.log('【修复】字幕仍显示，300ms后再次尝试');
            setTimeout(forceCloseSubtitle, 300); // 二次尝试
        }
    }

    // --------------------------
    // 初始化
    // --------------------------
    function init() {
        setTimeout(() => {
            checkAndFixSettings();
            initElegantMonitoring();
        }, 1000);

        window.addEventListener('beforeunload', () => {
            if (monitorInterval) clearInterval(monitorInterval);
            if (subtitleObserver) subtitleObserver.disconnect();
        });
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init, { once: true });
    }
})();
