// ==UserScript==
// @name         Cookie 获取器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license      MIT
// @description  智能获取和分析当前页面Cookie，提供简洁的通知界面
// @author       Jack back
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533084/Cookie%20%E8%8E%B7%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533084/Cookie%20%E8%8E%B7%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const DEBUG = false;

    GM_addStyle(`
        .cookie-mini-notifier {
            all: initial;
            position: fixed !important;
            top: 60px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: rgba(42, 42, 42, 0.85) !important;
            color: white !important;
            padding: 8px 16px !important;
            border-radius: 20px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            z-index: 2147483647 !important;
            font-family: 'Segoe UI', 'Microsoft Yahei', sans-serif !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            text-align: center !important;
            min-width: 80px !important;
            pointer-events: none !important;
            opacity: 0 !important;
            transition: opacity 0.2s ease-in-out !important;
            backdrop-filter: blur(4px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .cookie-mini-notifier.show {
            opacity: 1 !important;
        }
    `);

    function showMiniNotification(message = "已复制", duration = 800) {
        try {
            const existingNotification = document.querySelector('.cookie-mini-notifier');
            if (existingNotification && existingNotification.parentNode) {
                existingNotification.parentNode.removeChild(existingNotification);
            }

            const notification = document.createElement('div');
            notification.className = 'cookie-mini-notifier';
            notification.textContent = message;

            if (document.body) {
                document.body.appendChild(notification);
            } else if (document.documentElement) {
                document.documentElement.appendChild(notification);
            }

            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 200);
                }, duration);
            }, 10);

            return true;
        } catch (e) {
            if (DEBUG) console.error("Mini通知显示失败:", e);
            return false;
        }
    }

    function showFinalNotification(options) {
        showMiniNotification("已复制");
        if (DEBUG) {
            const superNotifyResult = showSuperNotification(options);
            try {
                GM_notification({
                    title: options.title,
                    text: options.message,
                    timeout: 1000
                });
            } catch (e) {
                if (DEBUG) console.error("GM通知失败:", e);
            }
        }
    }

    function parseCookies(cookieString) {
        if (!cookieString) return [];
        return cookieString.split(';').map(cookie => {
            const parts = cookie.split('=');
            const name = parts[0].trim();
            const value = parts.slice(1).join('=');
            return { name, value };
        });
    }

    function generateCookieSummary(parsedCookies) {
        const count = parsedCookies.length;
        try {
            const currentDomain = window.location.hostname;
            const keyCookies = parsedCookies.filter(cookie =>
                cookie.name.toLowerCase().includes('session') ||
                cookie.name.toLowerCase().includes('token') ||
                cookie.name.toLowerCase().includes('auth') ||
                cookie.name.toLowerCase().includes('id')
            );
            if (keyCookies.length > 0) {
                return `共${count}个Cookie，包含${keyCookies.length}个可能的关键认证Cookie。`;
            }
        } catch (e) {
            console.error('Error analyzing cookies:', e);
        }
        return `成功获取${count}个Cookie。`;
    }

    function copyCookieToClipboard() {
        try {
            const cookies = document.cookie;
            if (cookies && cookies.length > 0) {
                try {
                    GM_setClipboard(cookies, 'text');
                    showMiniNotification("已复制");
                    if (DEBUG) {
                        const parsedCookies = parseCookies(cookies);
                        const summary = generateCookieSummary(parsedCookies);
                        console.log(
                            `%c Cookie已复制! %c ${summary} `,
                            'background:#2575FC;color:white;border-radius:3px 0 0 3px;padding:2px;font-weight:bold',
                            'background:#6A11CB;color:white;border-radius:0 3px 3px 0;padding:2px'
                        );
                    }
                } catch (e) {
                    if (DEBUG) console.error("复制失败:", e);
                    showMiniNotification("复制失败");
                }
            } else {
                showMiniNotification("无Cookie");
            }
        } catch (e) {
            if (DEBUG) console.error("脚本错误:", e);
            showMiniNotification("出错了");
        }
    }

    function getSmartCookies() {
        try {
            const cookies = document.cookie;
            const parsedCookies = parseCookies(cookies);
            const importantCookies = parsedCookies.filter(cookie =>
                cookie.name.toLowerCase().includes('session') ||
                cookie.name.toLowerCase().includes('token') ||
                cookie.name.toLowerCase().includes('auth') ||
                cookie.name.toLowerCase().includes('login') ||
                cookie.name.toLowerCase().includes('user')
            );
            let cookieText = '';
            if (importantCookies.length > 0) {
                cookieText = importantCookies.map(c => `${c.name}=${c.value}`).join('; ');
            } else {
                cookieText = cookies;
            }
            GM_setClipboard(cookieText, 'text');
            showMiniNotification("已复制");
        } catch (e) {
            showMiniNotification("复制失败");
            if (DEBUG) console.error('Smart copy error:', e);
        }
    }

    function testNotificationSystem() {
        showMiniNotification("测试成功", 1500);
    }

    function initializeScript() {
        GM_registerMenuCommand('✨ 获取并复制所有 Cookie', copyCookieToClipboard);
        GM_registerMenuCommand('🔍 智能识别关键 Cookie', getSmartCookies);
        GM_registerMenuCommand('🧪 测试通知系统', testNotificationSystem);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
})();
