// ==UserScript==
// @name         谷歌广告拦截专家(稳健版)
// @namespace    http://tampermonkey.net/
// @version      v1.1.4
// @description  全面拦截谷歌广告及相关追踪，提升浏览体验，稳健拦截谷歌广告，避免误伤自己网站资源，支持动态广告拦截
// @author       StarMi
// @icon         data:image/x-icon;base64,AAABAAIAEBAAAAEAIABoBAAAJgAAACAgAAABACAAqBAAAI4EAAAoAAAAEAAAACAAAAABACAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zD9/f2W/f392P39/fn9/f35/f391/39/ZT+/v4uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Cf39/Zn///////////////////////////////////////////39/ZX///8IAAAAAAAAAAAAAAAA/v7+Cf39/cH/////+v35/7TZp/92ul3/WKs6/1iqOv9yuFn/rNWd//j79v///////f39v////wgAAAAAAAAAAP39/Zn/////7PXp/3G3WP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP+Or1j//vDo///////9/f2VAAAAAP///zD/////+vz5/3G3V/9TqDT/WKo6/6LQkf/U6cz/1urO/6rUm/+Zo0r/8IZB//adZ////v7///////7+/i79/f2Y/////4nWzf9Lqkj/Vqo4/9Xqzv///////////////////////ebY//SHRv/0hUL//NjD///////9/f2U/f392v////8sxPH/Ebzt/43RsP/////////////////////////////////4roL/9IVC//i1jf///////f391/39/fr/////Cr37/wW8+/+16/7/////////////////9IVC//SFQv/0hUL/9IVC//SFQv/3pnX///////39/fn9/f36/////wu++/8FvPv/tuz+//////////////////SFQv/0hUL/9IVC//SFQv/0hUL/96p7///////9/f35/f392/////81yfz/CrL5/2uk9v///////////////////////////////////////////////////////f392P39/Zn/////ks/7/zdS7P84Rur/0NT6///////////////////////9/f////////////////////////39/Zb+/v4y//////n5/v9WYu3/NUPq/ztJ6/+VnPT/z9L6/9HU+v+WnfT/Ul7t/+Hj/P////////////////////8wAAAAAP39/Z3/////6Or9/1hj7v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9sdvD////////////9/f2YAAAAAAAAAAD///8K/f39w//////5+f7/paz2/11p7v88Suv/Okfq/1pm7v+iqfX/+fn+///////9/f3B/v7+CQAAAAAAAAAAAAAAAP///wr9/f2d///////////////////////////////////////////9/f2Z/v7+CQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f2Z/f392/39/fr9/f36/f392v39/Zj///8wAAAAAAAAAAAAAAAAAAAAAPAPAADAAwAAgAEAAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAACAAQAAwAMAAPAPAAAoAAAAIAAAAEAAAAABACAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/g3+/v5X/f39mf39/cj9/f3q/f39+f39/fn9/f3q/f39yP39/Zn+/v5W////DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f2c/f399f/////////////////////////////////////////////////////9/f31/f39mv7+/iMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gn9/f2K/f39+////////////////////////////////////////////////////////////////////////////f39+v39/Yf///8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4k/f390v////////////////////////////////////////////////////////////////////////////////////////////////39/dD///8iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////MP39/er//////////////////////////+r05v+v16H/gsBs/2WxSf9Wqjj/Vqk3/2OwRv99vWX/pdKV/97u2P////////////////////////////39/ej+/v4vAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f3q/////////////////////+v15/+Pxnv/VKk2/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/36+Z//d7tf///////////////////////39/ej///8iAAAAAAAAAAAAAAAAAAAAAAAAAAD///8K/f390//////////////////////E4bn/XKw+/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1apN/+x0pv///////////////////////39/dD///8IAAAAAAAAAAAAAAAAAAAAAP39/Yv/////////////////////sdij/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/YKU1/8qOPv/5wZ////////////////////////39/YcAAAAAAAAAAAAAAAD+/v4l/f39+////////////////8Lgt/9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9utlT/n86N/7faqv+426v/pdKV/3u8ZP9UqDX/U6g0/3egN//jiUH/9IVC//SFQv/82MP//////////////////f39+v7+/iMAAAAAAAAAAP39/Z3////////////////q9Ob/W6w+/1OoNP9TqDT/U6g0/1OoNP9nskz/zOXC/////////////////////////////////+Dv2v+osWP/8YVC//SFQv/0hUL/9IVC//WQVP/++fb//////////////////f39mgAAAAD+/v4O/f399v///////////////4LHj/9TqDT/U6g0/1OoNP9TqDT/dblc//L58P/////////////////////////////////////////////8+v/3p3f/9IVC//SFQv/0hUL/9IVC//rIqf/////////////////9/f31////DP7+/ln////////////////f9v7/Cbz2/zOwhv9TqDT/U6g0/2KwRv/v9+z///////////////////////////////////////////////////////738//1kFT/9IVC//SFQv/0hUL/9plg///////////////////////+/v5W/f39nP///////////////4jf/f8FvPv/Bbz7/yG1s/9QqDz/vN2w//////////////////////////////////////////////////////////////////rHqP/0hUL/9IVC//SFQv/0hUL//vDn//////////////////39/Zn9/f3L////////////////R878/wW8+/8FvPv/Bbz7/y7C5P/7/fr//////////////////////////////////////////////////////////////////ere//SFQv/0hUL/9IVC//SFQv/718H//////////////////f39yP39/ez///////////////8cwvv/Bbz7/wW8+/8FvPv/WNL8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//rIqv/////////////////9/f3q/f39+v///////////////we9+/8FvPv/Bbz7/wW8+/993P3///////////////////////////////////////SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/+cGf//////////////////39/fn9/f36////////////////B737/wW8+/8FvPv/Bbz7/33c/f//////////////////////////////////////9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/6xaX//////////////////f39+f39/e3///////////////8cwvv/Bbz7/wW8+/8FvPv/WdP8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//vVv//////////////////9/f3q/f39y////////////////0bN/P8FvPv/Bbz7/wW8+/8hrvn/+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/cj9/f2c////////////////ht/9/wW8+/8FvPv/FZP1/zRJ6/+zuPf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39mf7+/lr////////////////d9v7/B7n7/yB38f81Q+r/NUPq/0hV7P/u8P3////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v5X////D/39/ff///////////////9tkPT/NUPq/zVD6v81Q+r/NUPq/2Fs7//y8v7////////////////////////////////////////////09f7//////////////////////////////////////////////////f399f7+/g0AAAAA/f39n////////////////+Tm/P89Suv/NUPq/zVD6v81Q+r/NUPq/1Bc7f/IzPn/////////////////////////////////x8v5/0xY7P+MlPP////////////////////////////////////////////9/f2cAAAAAAAAAAD+/v4n/f39/P///////////////7W69/81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9ZZe7/k5v0/6609/+vtff/lJv0/1pm7v81Q+r/NUPq/zVD6v+GjvL//v7//////////////////////////////f39+/7+/iQAAAAAAAAAAAAAAAD9/f2N/////////////////////6Cn9f81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v+BivL////////////////////////////9/f2KAAAAAAAAAAAAAAAAAAAAAP7+/gv9/f3V/////////////////////7W69/8+S+v/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/P0zr/7q/+P///////////////////////f390v7+/gkAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3r/////////////////////+Xn/P94gfH/NkTq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NkTq/3Z/8f/l5/z///////////////////////39/er+/v4kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f3r///////////////////////////k5vz/nqX1/2p08P9IVez/OEbq/zdF6v9GU+z/aHLv/5qh9f/i5Pz////////////////////////////9/f3q////MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3V/////////////////////////////////////////////////////////////////////////////////////////////////f390v7+/iQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr9/f2N/f39/P///////////////////////////////////////////////////////////////////////////f39+/39/Yv+/v4JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4n/f39n/39/ff//////////////////////////////////////////////////////f399v39/Z3+/v4lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Dv7+/lr9/f2c/f39y/39/e39/f36/f39+v39/ez9/f3L/f39nP7+/ln+/v4OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AA///AAD//AAAP/gAAB/wAAAP4AAAB8AAAAPAAAADgAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAcAAAAPAAAAD4AAAB/AAAA/4AAAf/AAAP/8AAP//wAP/
// @license      MIT
// @match        *://*.google.com/*
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544673/%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E4%B8%93%E5%AE%B6%28%E7%A8%B3%E5%81%A5%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544673/%E8%B0%B7%E6%AD%8C%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E4%B8%93%E5%AE%B6%28%E7%A8%B3%E5%81%A5%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 配置中心
     * 可以根据需要调整设置
     */
    const CONFIG = {
        // 是否开启调试日志（默认关闭，保持控制台清爽）
        debug: false,
        // 白名单域名（部分网站误杀严重时可添加）
        whitelist: [],
        // 广告域名列表
        adDomains: [
            'doubleclick.net',
            'googleadservices.com',
            'googlesyndication.com',
            'google-analytics.com',
            'adservice.google.com',
            'gstaticadssl.l.google.com',
            'pagead2.googlesyndication.com',
            'partner.googleadservices.com',
            'securepubads.g.doubleclick.net',
            'googleads.g.doubleclick.net',
            'ad.doubleclick.net',
            'stats.g.doubleclick.net'
        ]
    };

    // 日志封装
    const logger = {
        log: (...args) => { if (CONFIG.debug) console.log('[广告拦截]', ...args); },
        error: (...args) => { if (CONFIG.debug) console.error('[广告拦截]', ...args); }
    };

    // 检查是否在白名单中
    if (CONFIG.whitelist.some(site => location.hostname.includes(site))) {
        logger.log('当前站点白名单，跳过拦截');
        return;
    }

    /**
     * 核心逻辑：广告域名判断
     * @param {string} url - 需要检测的 URL
     * @returns {boolean} - 是否为广告 URL
     */
    function isAdUrl(url) {
        if (!url) return false;
        try {
            const fullUrl = new URL(url, window.location.href);
            const hostname = fullUrl.hostname.toLowerCase();
            return CONFIG.adDomains.some(d => hostname.endsWith(d));
        } catch(e) {
            const u = url.toLowerCase();
            return CONFIG.adDomains.some(d => u.includes(d));
        }
    }

    /**
     * 0. 自爆机制 (性能优化)
     * 如果脚本运行在广告域名的 iframe 中，直接清空内容，节省资源
     */
    if (window.self !== window.top) {
        if (isAdUrl(window.location.href)) {
            logger.log('检测到在广告iframe中运行，执行自爆清理');
            // 尝试停止页面加载并清空内容
            try {
                window.stop();
                document.documentElement.innerHTML = '';
                return; // 终止后续脚本执行
            } catch (e) {
                // 忽略错误
            }
        }
    }

    /**
     * 1. CSS 强力隐藏 (解决广告留白框的核心)
     * 注入全局样式，强制隐藏常见的广告容器
     */
    function addGlobalStyles() {
        const css = `
            /* 谷歌广告容器通用类名 */
            .adsbygoogle,
            .google-auto-placed,
            div[id^="google_ads_"],
            div[id^="google_ads_iframe"],
            iframe[id^="google_ads_frame"],
            iframe[src*="googleads"],
            iframe[src*="doubleclick.net"],
            /* 扩展：常见第三方广告容器 */
            div[id^="div-gpt-ad"],
            div[class*="taboola"],
            div[class*="outbrain"],
            /* 常见的 ins 标签广告容器 */
            ins.adsbygoogle,
            /* 可能的残留容器 */
            div[class*="adsbygoogle"] {
                display: none !important;
                visibility: hidden !important;
                width: 0 !important;
                height: 0 !important;
                opacity: 0 !important;
                pointer-events: none !important;
                overflow: hidden !important;
                z-index: -9999 !important;
            }
        `;

        try {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'google-ad-blocker-style';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            const target = document.head || document.documentElement;
            if (target) {
                target.appendChild(style);
                logger.log('隐藏样式注入成功');
            }
        } catch (e) {
            logger.error('样式注入失败', e);
        }
    }

    // 尝试尽早注入样式
    addGlobalStyles();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addGlobalStyles);
    }

    /**
     * 3. 网络请求拦截优化 (Fetch & XHR)
     * 防止返回永远挂起的 Promise 导致页面卡顿
     */

    // 拦截 Fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        if (url && isAdUrl(url)) {
            logger.log('阻止Fetch请求:', url);
            return Promise.resolve(new Response(JSON.stringify({}), {
                status: 200,
                statusText: 'OK',
                headers: {'Content-Type': 'application/json'}
            }));
        }
        return originalFetch.apply(this, args);
    };

    // 拦截 XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && isAdUrl(url)) {
            logger.log('阻止XHR请求:', url);
            this._isAdBlocked = true;
            return;
        }
        return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (this._isAdBlocked) {
            Object.defineProperty(this, 'readyState', { value: 4 });
            Object.defineProperty(this, 'status', { value: 200 });
            Object.defineProperty(this, 'responseText', { value: '{}' });
            Object.defineProperty(this, 'response', { value: '{}' });

            if (this.onreadystatechange) this.onreadystatechange();
            if (this.onload) this.onload();
            return;
        }
        return originalSend.apply(this, arguments);
    };

    /**
     * 4. 对象劫持
     * 阻止 adsbygoogle 执行
     */
    window.adsbygoogle = window.adsbygoogle || [];
    try {
        Object.defineProperty(window.adsbygoogle, 'push', {
            value: function() {
                logger.log('阻止adsbygoogle.push调用');
                return 0;
            },
            writable: false,
            configurable: false
        });
    } catch (e) {
        window.adsbygoogle.push = function() { return 0; };
    }

    /**
     * 5. DOM 清理优化
     * 移除 iframe 及外层容器
     */
    function removeAds(scope = document) {
        try {
            // 1. 查找所有广告 iframe
            const iframes = scope.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                if (isAdUrl(iframe.src) || (iframe.id && iframe.id.startsWith('google_ads_'))) {
                    logger.log('移除广告iframe:', iframe.src || iframe.id);
                    iframe.remove();
                }
            });

            // 2. 查找广告容器 (ins, div)
            const adContainers = scope.querySelectorAll('.adsbygoogle, div[id^="google_ads_"], ins.adsbygoogle, div[id^="div-gpt-ad"]');
            adContainers.forEach(container => {
                logger.log('移除广告容器:', container.className || container.id);
                container.remove();
            });

        } catch(e) {
            logger.error('清理出错', e);
        }
    }

    // 初次加载清理
    if (document.readyState !== 'loading') {
        removeAds();
    } else {
        window.addEventListener('DOMContentLoaded', () => removeAds());
    }

    // 监听动态变化 (性能优化版)
    let timeout = null;
    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldScan = true;
                break;
            }
        }
        if (shouldScan) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                removeAds();
            }, 500);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    /**
     * 6. 暴露公共接口
     * 允许用户在控制台手动清理：window.cleanAds()
     */
    window.cleanAds = () => {
        logger.log('手动触发清理...');
        removeAds();
        console.log('%c[广告拦截] 手动清理完成', 'color: green; font-weight: bold;');
    };

})();
