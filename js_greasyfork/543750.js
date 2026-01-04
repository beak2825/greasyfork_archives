// ==UserScript==
// @name         Ultimate HTTP and Plaintext Blocker
// @namespace    https://openai.com
// @version      2.0
// @description  强制拦截所有HTTP/非加密内容，提高隐私安全性
// @author       Advanced Scholar
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543750/Ultimate%20HTTP%20and%20Plaintext%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/543750/Ultimate%20HTTP%20and%20Plaintext%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /////////////////////////////
    // 1. 拦截 HTTP 页面本身加载
    /////////////////////////////
    if (window.location.protocol === 'http:') {
        console.warn('Blocked: Page loaded via insecure HTTP.');
        document.documentElement.innerHTML = '<h1 style="color:red;text-align:center;margin-top:20%;">Blocked: This page uses insecure HTTP protocol</h1>';
        window.stop();
        return;
    }

    /////////////////////////////
    // 2. 拦截 Fetch 请求
    /////////////////////////////
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = input instanceof Request ? input.url : input;
        if (url.startsWith('http://')) {
            console.error('[Blocked] HTTP fetch request:', url);
            throw new Error('Blocked HTTP request for security');
        }

        const response = await originalFetch(input, init);
        const ct = response.headers.get('content-type') || '';
        if (ct.includes('text/plain') || (ct.includes('text/html') && response.url.startsWith('http://'))) {
            console.error('[Blocked] Insecure plaintext content:', response.url);
            throw new Error('Blocked plaintext content');
        }
        return response;
    };

    /////////////////////////////
    // 3. 拦截 XMLHttpRequest 请求
    /////////////////////////////
    const originalXHRopen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.startsWith('http://')) {
            console.error('[Blocked] HTTP XHR request:', url);
            throw new Error('Blocked HTTP XHR request');
        }
        return originalXHRopen.apply(this, arguments);
    };

    /////////////////////////////
    // 4. 拦截 WebSocket 非加密连接
    /////////////////////////////
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        if (url.startsWith('ws://')) {
            console.error('[Blocked] Insecure WebSocket connection:', url);
            throw new Error('Blocked ws:// connection');
        }
        return new OriginalWebSocket(url, protocols);
    };

    /////////////////////////////
    // 5. 监控资源加载（如img、script、iframe）
    /////////////////////////////
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName) {
                    const srcAttr = node.src || node.href;
                    if (srcAttr && srcAttr.startsWith('http://')) {
                        console.error(`[Blocked] Resource load via HTTP: ${srcAttr}`);
                        node.parentNode && node.parentNode.removeChild(node);
                    }
                }
            }
        }
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

    /////////////////////////////
    // 6. 拦截 DOM 插入的脚本或链接
    /////////////////////////////
    const tagList = ['script', 'link', 'img', 'iframe', 'video', 'audio', 'source'];
    tagList.forEach(tag => {
        const descriptor = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'src') ||
                           Object.getOwnPropertyDescriptor(Object.getPrototypeOf(document.createElement(tag)), 'src');
        if (!descriptor || !descriptor.set) return;

        const originalSetter = descriptor.set;
        Object.defineProperty(window[tag[0].toUpperCase() + tag.slice(1)].prototype, 'src', {
            set(value) {
                if (value.startsWith('http://')) {
                    console.error(`[Blocked] Setting HTTP src on <${tag}>:`, value);
                    return;
                }
                originalSetter.call(this, value);
            }
        });
    });

    /////////////////////////////
    // 7. 拦截 Service Worker 注册（可能绕过保护）
    /////////////////////////////
    if ('serviceWorker' in navigator) {
        const originalRegister = navigator.serviceWorker.register;
        navigator.serviceWorker.register = function(scriptURL, options) {
            if (scriptURL.startsWith('http://')) {
                console.error('[Blocked] HTTP Service Worker registration attempt:', scriptURL);
                throw new Error('Blocked insecure service worker registration');
            }
            return originalRegister.call(navigator.serviceWorker, scriptURL, options);
        };
    }

    /////////////////////////////
    // 8. 警告用户开发者控制台潜在泄露
    /////////////////////////////
    console.warn('%c[Privacy Warning]%c 使用开放式控制台可能会泄露信息或暴露脚本数据，请谨慎。', 'color:red;font-weight:bold;', '');

})();
