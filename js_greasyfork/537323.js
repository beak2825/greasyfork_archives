// ==UserScript==
// @name         Twitter Scroll Refresh
// @name:zh-CN   Twitter 滚轮刷新
// @namespace    https://github.com/Xeron2000/twitter-scroll-refresh
// @version      1.4.0
// @description  Refresh Twitter timeline by scrolling up at the top of the page
// @description:zh-CN  在Twitter顶部向上滚动时自动刷新获取新帖子
// @author       Xeron
// @match        https://x.com/home
// @match        https://x.com/home/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @homepageURL  https://github.com/Xeron2000/twitter-scroll-refresh
// @supportURL   https://github.com/Xeron2000/twitter-scroll-refresh/issues
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537323/Twitter%20Scroll%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/537323/Twitter%20Scroll%20Refresh.meta.js
// ==/UserScript==

/**
 * Twitter Scroll Refresh
 *
 * A userscript that allows refreshing Twitter/X timeline by scrolling up at the top.
 * 一个通过在顶部向上滚动来刷新Twitter/X时间线的用户脚本。
 *
 * @version 1.4.0
 * @author Xeron
 * @license MIT
 * @repository https://github.com/Xeron2000/twitter-scroll-refresh
 */

(function() {
    'use strict';

    // ====== Configuration / 配置 ======
    const CONFIG = {
        SCROLL_THRESHOLD: GM_getValue('scrollThreshold', 30), // 滚动阈值
        REFRESH_COOLDOWN: GM_getValue('refreshCooldown', 1500), // 刷新冷却时间（毫秒）
        TOP_OFFSET: GM_getValue('topOffset', 10), // 顶部偏移量
        SHOW_NOTIFICATIONS: GM_getValue('showNotifications', true), // 显示通知
        DEBUG_MODE: GM_getValue('debugMode', false), // 调试模式
        LANGUAGE: GM_getValue('language', 'auto'), // 语言设置
        ENABLE_SCROLL_TO_TOP: GM_getValue('enableScrollToTop', true), // 启用滚轮到顶部
        SCROLL_TO_TOP_COOLDOWN: GM_getValue('scrollToTopCooldown', 2000) // 滚轮到顶部冷却时间
    };

    // ====== Internationalization / 国际化 ======
    const MESSAGES = {
        en: {
            refreshTriggered: 'Refreshing timeline...',
            scrollToRefresh: 'Scroll up at top to refresh',
            settingsTitle: 'Twitter Scroll Refresh Settings',
            scrollThreshold: 'Scroll Threshold',
            refreshCooldown: 'Refresh Cooldown (ms)',
            topOffset: 'Top Offset (px)',
            showNotifications: 'Show Notifications',
            debugMode: 'Debug Mode',
            language: 'Language',
            languageAuto: 'Auto (Follow Browser)',
            languageEn: 'English',
            languageZhCn: '中文简体',
            save: 'Save',
            cancel: 'Cancel',
            saved: 'Settings saved!',
            enableScrollToTop: 'Enable Scroll to Top (Shift + Wheel Up)',
            scrollToTopCooldown: 'Scroll to Top Cooldown (ms)',
            scrolledToTop: 'Scrolled to top'
        },
        'zh-CN': {
            refreshTriggered: '正在刷新时间线...',
            scrollToRefresh: '在顶部向上滚动可刷新',
            settingsTitle: 'Twitter滚轮刷新设置',
            scrollThreshold: '滚动阈值',
            refreshCooldown: '刷新冷却时间 (毫秒)',
            topOffset: '顶部偏移量 (像素)',
            showNotifications: '显示通知',
            debugMode: '调试模式',
            language: '语言',
            languageAuto: '自动 (跟随浏览器)',
            languageEn: 'English',
            languageZhCn: '中文简体',
            save: '保存',
            cancel: '取消',
            saved: '设置已保存！',
            enableScrollToTop: '启用滚轮到顶部 (Shift + 向上滚轮)',
            scrollToTopCooldown: '滚轮到顶部冷却时间 (毫秒)',
            scrolledToTop: '已滚动到顶部'
        }
    };

    // ====== Utility Functions / 工具函数 ======

    /**
     * Get current language
     * 获取当前语言
     */
    function getCurrentLanguage() {
        if (CONFIG.LANGUAGE !== 'auto') return CONFIG.LANGUAGE;
        return navigator.language.startsWith('zh') ? 'zh-CN' : 'en';
    }

    /**
     * Get localized message
     * 获取本地化消息
     */
    function getMessage(key) {
        const lang = getCurrentLanguage();
        return MESSAGES[lang]?.[key] || MESSAGES.en[key] || key;
    }

    /**
     * Debug logger
     * 调试日志
     */
    function debugLog(...args) {
        if (CONFIG.DEBUG_MODE) {
            console.log('[Twitter Scroll Refresh]', ...args);
        }
    }

    /**
     * Show notification
     * 显示通知
     */
    function showNotification(message, duration = 2000) {
        if (!CONFIG.SHOW_NOTIFICATIONS) return;

        // Remove existing notification
        const existing = document.getElementById('twitter-scroll-refresh-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'twitter-scroll-refresh-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(29, 161, 242, 0.95);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
    }

    // ====== Main Logic / 主要逻辑 ======

    let isAtTop = false;
    let lastScrollTime = 0;
    let refreshing = false;
    let wheelStartTime = 0;
    let lastScrollToTopTime = 0;

    /**
     * Check if current page is home timeline
     * 检查当前页面是否为主页时间线
     */
    function isHomeTimeline() {
        const currentPath = window.location.pathname;
        // Only enable on exact /home or /home/ path
        return currentPath === '/home' || currentPath === '/home/';
    }

    /**
     * Check if page is at top
     * 检查是否在页面顶部
     */
    function checkIfAtTop() {
        return window.scrollY <= CONFIG.TOP_OFFSET;
    }

    /**
     * Scroll to top smoothly
     * 平滑滚动到顶部
     */
    function scrollToTop() {
        if (CONFIG.SHOW_NOTIFICATIONS) {
            showNotification(getMessage('scrolledToTop'), 1000);
        }
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    
    /**
     * Find and execute refresh action
     * 查找并执行刷新操作
     */
    async function performRefresh() {
        if (refreshing) {
            debugLog('Refresh already in progress, skipping');
            return;
        }

        refreshing = true;
        debugLog('Refresh triggered');

        if (CONFIG.SHOW_NOTIFICATIONS) {
            showNotification(getMessage('refreshTriggered'));
        }

        try {
            // Method 1: Click Home tab if on home page
            // 方法1: 如果在主页则点击主页标签
            if (window.location.pathname === '/home') {
                const homeButton = document.querySelector('[data-testid="AppTabBar_Home_Link"]');
                if (homeButton) {
                    debugLog('Clicking home button');
                    homeButton.click();
                    return;
                }
            }

            // Method 2: Look for refresh/reload buttons
            // 方法2: 查找刷新/重载按钮
            const refreshSelectors = [
                '[aria-label*="refresh" i]',
                '[aria-label*="reload" i]',
                '[aria-label*="刷新"]',
                '[aria-label*="重新加载"]',
                '[data-testid*="refresh"]',
                'button[title*="refresh" i]',
                'button[title*="刷新"]'
            ];

            for (const selector of refreshSelectors) {
                const button = document.querySelector(selector);
                if (button && button.offsetParent !== null) { // Check if visible
                    debugLog('Clicking refresh button:', selector);
                    button.click();
                    return;
                }
            }

            // Method 3: Simulate '.' key press for timeline refresh
            // 方法3: 模拟按下'.'键刷新时间线
            debugLog('Using keyboard shortcut');
            const keyEvent = new KeyboardEvent('keydown', {
                key: '.',
                code: 'Period',
                keyCode: 190,
                which: 190,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyEvent);

            // Method 4: Look for "Show new posts" type buttons
            // 方法4: 查找"显示新帖子"类型的按钮
            setTimeout(() => {
                const newPostsSelectors = [
                    '[role="button"]:has-text("Show")',
                    '[role="button"]:has-text("显示")',
                    'button:contains("new")',
                    'button:contains("新")'
                ];

                // Use a more robust text search
                const buttons = document.querySelectorAll('button, [role="button"]');
                for (const button of buttons) {
                    const text = button.textContent?.toLowerCase() || '';
                    if ((text.includes('show') && text.includes('new')) ||
                        (text.includes('显示') && text.includes('新'))) {
                        debugLog('Clicking new posts button');
                        button.click();
                        return;
                    }
                }
            }, 200);

        } catch (error) {
            debugLog('Error during refresh:', error);
        } finally {
            setTimeout(() => {
                refreshing = false;
                debugLog('Refresh cooldown completed');
            }, CONFIG.REFRESH_COOLDOWN);
        }
    }

    /**
     * Handle wheel event
     * 处理滚轮事件
     */
    function handleWheel(event) {
        // Check if we're on the home timeline page
        if (!isHomeTimeline()) {
            return;
        }

        const currentTime = Date.now();

        // Handle scroll to top functionality (when not at top)
        if (CONFIG.ENABLE_SCROLL_TO_TOP && !checkIfAtTop() && event.deltaY < 0 && event.shiftKey) {
            if (currentTime - lastScrollToTopTime > CONFIG.SCROLL_TO_TOP_COOLDOWN) {
                debugLog('Shift + wheel up detected, scrolling to top');
                event.preventDefault();
                scrollToTop();
                lastScrollToTopTime = currentTime;
                return;
            }
        }

        // Check if at top
        if (checkIfAtTop()) {
            if (!isAtTop) {
                isAtTop = true;
                wheelStartTime = currentTime;
                debugLog('Reached top of page');
            }

            // Check for upward scroll with sufficient velocity
            if (event.deltaY < -CONFIG.SCROLL_THRESHOLD) {
                // Prevent default scrolling when at top and scrolling up
                event.preventDefault();

                // Throttle refresh attempts
                if (currentTime - lastScrollTime > CONFIG.REFRESH_COOLDOWN) {
                    debugLog('Upward scroll detected, triggering refresh');
                    performRefresh();
                    lastScrollTime = currentTime;
                }
            }
        } else {
            if (isAtTop) {
                isAtTop = false;
                debugLog('Left top of page');
            }
        }
    }

    /**
     * Handle scroll event
     * 处理滚动事件
     */
    function handleScroll() {
        // Check if we're on the home timeline page
        if (!isHomeTimeline()) {
            return;
        }

        const wasAtTop = isAtTop;
        isAtTop = checkIfAtTop();

        if (isAtTop !== wasAtTop) {
            debugLog('Top status changed:', isAtTop);
        }
    }

    // ====== Settings UI / 设置界面 ======

    /**
     * Create settings dialog
     * 创建设置对话框
     */
    function createSettingsDialog() {
        // Remove existing dialog
        const existing = document.getElementById('twitter-scroll-refresh-settings');
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.id = 'twitter-scroll-refresh-settings';
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            width: 420px;
            max-width: 90vw;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        const inputStyle = `
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #e1e8ed;
            border-radius: 6px;
            font-size: 14px;
            color: #14171a;
            background: white;
            box-sizing: border-box;
            transition: border-color 0.2s ease;
        `;

        const inputFocusStyle = `
            outline: none;
            border-color: #1da1f2;
            box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.1);
        `;

        content.innerHTML = `
            <h2 style="margin: 0 0 24px 0; color: #14171a; font-size: 20px; font-weight: 700; text-align: center;">
                ${getMessage('settingsTitle')}
            </h2>
            <form id="settings-form">
                <div style="margin-bottom: 18px;">
                    <label style="display: block; margin-bottom: 8px; color: #657786; font-weight: 500; font-size: 13px;">
                        ${getMessage('language')}
                    </label>
                    <select id="language" style="${inputStyle} cursor: pointer;">
                        <option value="auto" ${CONFIG.LANGUAGE === 'auto' ? 'selected' : ''}>${getMessage('languageAuto')}</option>
                        <option value="en" ${CONFIG.LANGUAGE === 'en' ? 'selected' : ''}>${getMessage('languageEn')}</option>
                        <option value="zh-CN" ${CONFIG.LANGUAGE === 'zh-CN' ? 'selected' : ''}>${getMessage('languageZhCn')}</option>
                    </select>
                </div>
                <div style="margin-bottom: 18px;">
                    <label style="display: block; margin-bottom: 8px; color: #657786; font-weight: 500; font-size: 13px;">
                        ${getMessage('scrollThreshold')}
                    </label>
                    <input type="number" id="scrollThreshold" value="${CONFIG.SCROLL_THRESHOLD}"
                           style="${inputStyle}" min="10" max="100" step="5">
                </div>
                <div style="margin-bottom: 18px;">
                    <label style="display: block; margin-bottom: 8px; color: #657786; font-weight: 500; font-size: 13px;">
                        ${getMessage('refreshCooldown')}
                    </label>
                    <input type="number" id="refreshCooldown" value="${CONFIG.REFRESH_COOLDOWN}"
                           style="${inputStyle}" min="500" max="5000" step="100">
                </div>
                <div style="margin-bottom: 18px;">
                    <label style="display: block; margin-bottom: 8px; color: #657786; font-weight: 500; font-size: 13px;">
                        ${getMessage('topOffset')}
                    </label>
                    <input type="number" id="topOffset" value="${CONFIG.TOP_OFFSET}"
                           style="${inputStyle}" min="0" max="50" step="5">
                </div>
                <div style="margin-bottom: 18px; padding: 12px; background: #f0f9ff; border-radius: 8px; border: 1px solid #e0f2fe;">
                    <label style="display: flex; align-items: center; color: #14171a; font-weight: 500; cursor: pointer;">
                        <input type="checkbox" id="enableScrollToTop" ${CONFIG.ENABLE_SCROLL_TO_TOP ? 'checked' : ''}
                               style="margin-right: 10px; transform: scale(1.1);">
                        ${getMessage('enableScrollToTop')}
                    </label>
                </div>
                <div style="margin-bottom: 18px;">
                    <label style="display: block; margin-bottom: 8px; color: #657786; font-weight: 500; font-size: 13px;">
                        ${getMessage('scrollToTopCooldown')}
                    </label>
                    <input type="number" id="scrollToTopCooldown" value="${CONFIG.SCROLL_TO_TOP_COOLDOWN}"
                           style="${inputStyle}" min="1000" max="5000" step="100">
                </div>
                <div style="margin-bottom: 18px; padding: 12px; background: #f7f9fa; border-radius: 8px;">
                    <label style="display: flex; align-items: center; color: #14171a; font-weight: 500; cursor: pointer;">
                        <input type="checkbox" id="showNotifications" ${CONFIG.SHOW_NOTIFICATIONS ? 'checked' : ''}
                               style="margin-right: 10px; transform: scale(1.1);">
                        ${getMessage('showNotifications')}
                    </label>
                </div>
                <div style="margin-bottom: 24px; padding: 12px; background: #f7f9fa; border-radius: 8px;">
                    <label style="display: flex; align-items: center; color: #14171a; font-weight: 500; cursor: pointer;">
                        <input type="checkbox" id="debugMode" ${CONFIG.DEBUG_MODE ? 'checked' : ''}
                               style="margin-right: 10px; transform: scale(1.1);">
                        ${getMessage('debugMode')}
                    </label>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
                    <button type="button" id="cancel-btn" style="
                        padding: 10px 20px;
                        border: 1px solid #e1e8ed;
                        background: white;
                        color: #657786;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    ">${getMessage('cancel')}</button>
                    <button type="submit" id="save-btn" style="
                        padding: 10px 20px;
                        border: none;
                        background: #1da1f2;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    ">${getMessage('save')}</button>
                </div>
            </form>
            <style>
                #twitter-scroll-refresh-settings input:focus,
                #twitter-scroll-refresh-settings select:focus {
                    ${inputFocusStyle}
                }
                #twitter-scroll-refresh-settings #cancel-btn:hover {
                    background: #f7f9fa;
                    border-color: #1da1f2;
                    color: #1da1f2;
                }
                #twitter-scroll-refresh-settings #save-btn:hover {
                    background: #1991da;
                }
                #twitter-scroll-refresh-settings select option {
                    color: #14171a;
                    background: white;
                    padding: 8px;
                }
            </style>
        `;

        dialog.appendChild(content);
        document.body.appendChild(dialog);

        // Event handlers
        document.getElementById('cancel-btn').onclick = () => dialog.remove();
        document.getElementById('settings-form').onsubmit = (e) => {
            e.preventDefault();

            // Check if language changed
            const newLanguage = document.getElementById('language').value;
            const languageChanged = CONFIG.LANGUAGE !== newLanguage;

            // Save settings
            CONFIG.LANGUAGE = newLanguage;
            CONFIG.SCROLL_THRESHOLD = parseInt(document.getElementById('scrollThreshold').value);
            CONFIG.REFRESH_COOLDOWN = parseInt(document.getElementById('refreshCooldown').value);
            CONFIG.TOP_OFFSET = parseInt(document.getElementById('topOffset').value);
            CONFIG.ENABLE_SCROLL_TO_TOP = document.getElementById('enableScrollToTop').checked;
            CONFIG.SCROLL_TO_TOP_COOLDOWN = parseInt(document.getElementById('scrollToTopCooldown').value);
            CONFIG.SHOW_NOTIFICATIONS = document.getElementById('showNotifications').checked;
            CONFIG.DEBUG_MODE = document.getElementById('debugMode').checked;

            // Save to GM storage
            GM_setValue('language', CONFIG.LANGUAGE);
            GM_setValue('scrollThreshold', CONFIG.SCROLL_THRESHOLD);
            GM_setValue('refreshCooldown', CONFIG.REFRESH_COOLDOWN);
            GM_setValue('topOffset', CONFIG.TOP_OFFSET);
            GM_setValue('enableScrollToTop', CONFIG.ENABLE_SCROLL_TO_TOP);
            GM_setValue('scrollToTopCooldown', CONFIG.SCROLL_TO_TOP_COOLDOWN);
            GM_setValue('showNotifications', CONFIG.SHOW_NOTIFICATIONS);
            GM_setValue('debugMode', CONFIG.DEBUG_MODE);

            showNotification(getMessage('saved'));
            dialog.remove();

            // If language changed, suggest page refresh for full effect
            if (languageChanged) {
                setTimeout(() => {
                    if (confirm(getCurrentLanguage() === 'zh-CN' ?
                        '语言设置已更改，建议刷新页面以完全应用新语言设置。是否现在刷新？' :
                        'Language setting has been changed. It is recommended to refresh the page to fully apply the new language setting. Refresh now?')) {
                        location.reload();
                    }
                }, 1000);
            }
        };

        // Close on backdrop click
        dialog.onclick = (e) => {
            if (e.target === dialog) dialog.remove();
        };
    }

    // ====== Initialization / 初始化 ======

    /**
     * Initialize the script
     * 初始化脚本
     */
    function initialize() {
        debugLog('Initializing Twitter Scroll Refresh v1.4.0');

        // Add event listeners
        document.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('scroll', handleScroll, { passive: true });

        // Register menu command for settings
        GM_registerMenuCommand('⚙️ Settings / 设置', createSettingsDialog);

        // Show initialization notification only on home timeline
        setTimeout(() => {
            if (CONFIG.SHOW_NOTIFICATIONS && isHomeTimeline()) {
                showNotification(getMessage('scrollToRefresh'), 3000);
            }
        }, 1000);

        debugLog('Script initialized successfully');
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Export for debugging (if needed)
    if (CONFIG.DEBUG_MODE) {
        window.TwitterScrollRefresh = {
            config: CONFIG,
            performRefresh,
            showSettings: createSettingsDialog
        };
    }

})();
