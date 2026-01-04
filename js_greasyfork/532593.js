// ==UserScript==
// @name         网页加载分析(改)
// @version      1.19
// @description  测试网页加载速度并显示加载最慢的三个网址的域名，二改添加了对Via浏览器toast的调用，添加高斯模糊效果。
// @description:en Test the webpage loading speed and display the domain names of the three slowest loading URLs.
// @match        *://*/*
// @run-at       document-start
// @author       yzcjd & nobody
// @author2      Lama AI 辅助
// @namespace    https://scriptcat.org/zh-CN/users/157252
// @exclude      *://*.cloudflare.com/*
// @exclude      *://*.recaptcha.net/*
// @license      MIT
// @icon       data:image/png;base64,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
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/532593/%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%88%86%E6%9E%90%28%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532593/%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%88%86%E6%9E%90%28%E6%94%B9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentDomain = location.hostname || 'unknown';
    const isGMEnvironment = typeof GM_getValue === 'function' && typeof GM_setValue === 'function' && typeof GM_registerMenuCommand === 'function';
    
    let isEnabled = true;
    let useBlurDisplay = false;
    let domainSettings = {};

    if (isGMEnvironment) {
        domainSettings = GM_getValue('domainSettings', {});
        isEnabled = domainSettings[currentDomain] !== false;
        useBlurDisplay = GM_getValue('useBlurDisplay', false);
        const enableText = isEnabled ? '✅启用' : '❌禁用';
        GM_registerMenuCommand(
            `${enableText} 网页加载测试（${currentDomain}）`,
            () => {
                const newState = !isEnabled;
                domainSettings[currentDomain] = newState;
                GM_setValue('domainSettings', domainSettings);
                alert(`网页加载测试已${newState ? '✅启用' : '❌禁用'}（${currentDomain}），刷新页面生效。`);
            }
        );
        const blurText = useBlurDisplay ? '✅启用' : '❌禁用';
        GM_registerMenuCommand(
            `${blurText} 高斯模糊显示`,
            () => {
                const newState = !useBlurDisplay;
                GM_setValue('useBlurDisplay', newState);
                alert(`高斯模糊显示已${newState ? '✅启用' : '❌禁用'}，刷新页面生效。`);
            }
        );
        if (!isEnabled) return;
    }
    
    // 防止污染ALook脚本
    if (/\.user\.js($|\?)/i.test(location.href)) return;

    const loadTimeElement = document.createElement('div');
    loadTimeElement.id = 'loadTimeDisplay';
    loadTimeElement.style.cssText = `
        position: fixed;
        top: 85%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.3); /* 半透明毛玻璃背景 */
        backdrop-filter: blur(16px); /* 高斯模糊 */
        -webkit-backdrop-filter: blur(16px); /* 兼容 Safari */
        padding: 12px 20px; /* 舒适内边距 */
        border-radius: 22px; /* iOS 风格圆角 */
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15); /* 柔和阴影 */
        white-space: nowrap;
        width: auto; /* 自适应宽度 */
        max-width: 90%; /* 防止溢出 */
        z-index: 9999;
        color: #1C2526; /* 深色文字，确保可读 */
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; /* iOS 字体 */
        font-size: 15px; /* 优雅字体大小 */
        font-weight: 500; /* 适中字重 */
        text-align: center; /* 文字居中 */
        border: 1px solid rgba(255, 255, 255, 0.25); /* 微弱边框增加质感 */
        opacity: 0; /* 初始透明 */
        transition: opacity 0.3s ease-in-out; /* 淡入动画 */
    `;

    // 兼容不支持 backdrop-filter 的浏览器
    if (!CSS.supports('backdrop-filter', 'blur(16px)')) {
        loadTimeElement.style.background = 'rgba(240, 240, 240, 0.85)';
    }

    const startTime = performance.now();
    const slowestRequests = new Set();
    const maxSlowRequests = 3;

    const networkObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            slowestRequests.add({
                name: entry.name,
                duration: entry.duration,
            });
            if (slowestRequests.size > maxSlowRequests) {
                const sorted = Array.from(slowestRequests).sort((a, b) => b.duration - a.duration);
                slowestRequests.clear();
                sorted.slice(0, maxSlowRequests).forEach((req) => slowestRequests.add(req));
            }
        });
    });

    networkObserver.observe({
        entryTypes: ['resource']
    });

    window.addEventListener('load', () => {
        networkObserver.disconnect();
        const endTime = performance.now();
        const timeElapsed = endTime - startTime;
        const sortedRequests = Array.from(slowestRequests).sort((a, b) => b.duration - a.duration);

        const networkInfoHTML = sortedRequests.length ?
            sortedRequests
            .map((req) => {
                try {
                    const url = new URL(req.name);
                    return `slow: ${url.hostname} (${req.duration.toFixed(2)}ms)<br>`;
                } catch {
                    return `slow: Invalid URL (${req.duration.toFixed(2)}ms)<br>`;
                }
            })
            .join('') :
            '[none]';

        const networkInfo = sortedRequests.length ?
            sortedRequests
            .map((req) => {
                try {
                    const url = new URL(req.name);
                    return `Slow: ${url.hostname} (${req.duration.toFixed(2)}ms)`;
                } catch {
                    return `Slow: Invalid URL (${req.duration.toFixed(2)}ms)`;
                }
            })
            .join('\n') :
            '[none]';

        if (window.via && typeof window.via.toast === 'function' && !useBlurDisplay) {
            window.via.toast(`Time: ${timeElapsed.toFixed(2)}ms\n${networkInfo}`);
        } else {
            loadTimeElement.innerHTML = `<h2 style="margin:0;font-size:16px;font-weight:600">Time: ${timeElapsed.toFixed(2)}ms</h2>${networkInfoHTML}`;
            document.body.appendChild(loadTimeElement);
            // 点击即可移除
            loadTimeElement.onclick = () => {
                loadTimeElement.style.transition = 'opacity 0.1s';
                loadTimeElement.style.opacity = '0';
                setTimeout(() => loadTimeElement.remove(), 100);
            };
            requestAnimationFrame(() => {
                loadTimeElement.style.opacity = '1';
            });
            setTimeout(() => {
                requestAnimationFrame(() => {
                    loadTimeElement.style.opacity = '0';
                });
                setTimeout(() => loadTimeElement.remove(), 300);
            }, 2600);
        }
        slowestRequests.clear();
    });
})();