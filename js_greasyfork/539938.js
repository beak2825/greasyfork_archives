// ==UserScript==
// @name         go灰度工具
// @namespace    http://tampermonkey.net/
// @version      1.8.8
// @description  彻底解决只读属性赋值报错+刷新后监听失效问题
// @author       lulu
// @match        https://*.smartpushedm.com/admin/*
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/548898/1657505/Toast%E7%BB%84%E4%BB%B6%E6%A8%A1%E5%9D%97.js
// @downloadURL https://update.greasyfork.org/scripts/539938/go%E7%81%B0%E5%BA%A6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539938/go%E7%81%B0%E5%BA%A6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const activeToasts = new Map();
    const toastQueue = [];
    const LOG_PREFIX = '***[XHR/Fetch拦截]';
    MonkeyToast.show(`${LOG_PREFIX} 脚本启动,请求存在异常时请关闭脚本【go灰度提示】***`, 3000);

    // ========== 核心常量 ==========
    const INTERCEPTOR_MARK = '__gray_xhr_interceptor__';
    const FETCH_INTERCEPTOR_MARK = '__gray_fetch_interceptor__';
    const ROOT_WINDOW = unsafeWindow?.top || window.top || window;
    // 仅保留原生XHR/Fetch引用，不复制任何静态属性
    const ORIGINAL_XHR = ROOT_WINDOW.XMLHttpRequest;
    const ORIGINAL_FETCH = ROOT_WINDOW.fetch;
    let interceptorXHR = null;

    // ========== 1. XHR拦截器：完全跳过静态属性复制，仅重写open/send ==========
    function createInterceptorXHR() {
        if (interceptorXHR) return interceptorXHR;

        // 核心：直接封装原生XHR，不继承/复制任何静态属性
        function InterceptorXHR() {
            const xhr = new ORIGINAL_XHR();
            const requestId = `xhr_${Date.now().toString().slice(-4)}`;
            let method, url;

            // 仅重写open方法（记录请求参数）
            const originalOpen = xhr.open;
            xhr.open = function (...args) {
                [method, url] = args;
                return originalOpen.apply(this, args);
            };

            // 仅重写send方法（绑定事件监听灰度头）
            const originalSend = xhr.send;
            xhr.send = function (data) {
                console.log(`${LOG_PREFIX} [${requestId}] 发送XHR请求: ${method} ${url}`);

                const checkStatus = () => {
                    if (xhr.readyState === 4) {
                        const headers = parseHeaders(xhr.getAllResponseHeaders());
                        if (headers['gray-go-market'] === 'reach') {
                            const path = new URL(url, ROOT_WINDOW.location.origin).pathname;
                            const msg = `灰度命中(XHR): ${path}`;
                            MonkeyToast.show(msg);
                            console.log(`${LOG_PREFIX} [${requestId}] ${msg}`);
                        }
                        // 清理事件
                        xhr.removeEventListener('readystatechange', checkStatus);
                        xhr.removeEventListener('load', checkStatus);
                    }
                };

                // 事件绑定（先删后加，避免重复）
                xhr.removeEventListener('readystatechange', checkStatus);
                xhr.removeEventListener('load', checkStatus);
                xhr.addEventListener('readystatechange', checkStatus);
                xhr.addEventListener('load', checkStatus);

                return originalSend.apply(this, arguments);
            };

            // ========== 关键：保留原生XHR的所有属性/方法 ==========
            // 直接返回原生XHR实例（仅重写open/send），不修改构造函数
            return xhr;
        }

        // ========== 彻底放弃静态属性复制，仅打标记 ==========
        InterceptorXHR[INTERCEPTOR_MARK] = true;
        // 原型链仅做标记，不继承任何属性（避免冲突）
        InterceptorXHR.prototype[INTERCEPTOR_MARK] = true;
        interceptorXHR = InterceptorXHR;

        return InterceptorXHR;
    }

    // ========== 2. Fetch拦截器（无只读属性问题，保持不变） ==========
    function createInterceptorFetch() {
        const interceptorFetch = function (input, init) {
            const method = (init?.method || 'GET').toUpperCase();
            const url = typeof input === 'string' ? input : input.url;
            const requestId = `fetch_${Date.now().toString().slice(-4)}`;

            console.log(`${LOG_PREFIX} [${requestId}] 发送Fetch请求: ${method} ${url}`);

            return ORIGINAL_FETCH.apply(this, arguments).then(response => {
                const grayHeader = response.headers.get('gray-go-market');
                if (grayHeader === 'reach') {
                    const path = new URL(url, ROOT_WINDOW.location.origin).pathname;
                    const msg = `灰度命中(Fetch): ${path}`;
                    MonkeyToast.show(msg);
                    console.log(`${LOG_PREFIX} [${requestId}] ${msg}`);
                }
                return response;
            }).catch(err => {
                console.error(`${LOG_PREFIX} [${requestId}] Fetch请求失败:`, err);
                throw err;
            });
        };

        interceptorFetch[FETCH_INTERCEPTOR_MARK] = true;
        return interceptorFetch;
    }

    // ========== 3. 安装逻辑：极简覆盖，避免属性冲突 ==========
    function installProtectedInterceptor() {
        try {
            // --- 安装XHR拦截器：直接赋值，不做不可配置限制 ---
            ROOT_WINDOW.XMLHttpRequest = createInterceptorXHR();
            // --- 安装Fetch拦截器：直接赋值 ---
            ROOT_WINDOW.fetch = createInterceptorFetch();

            console.log(`${LOG_PREFIX} 拦截器安装成功，XHR标记:`, ROOT_WINDOW.XMLHttpRequest[INTERCEPTOR_MARK]);
        } catch (e) {
            console.error(`${LOG_PREFIX} 拦截器安装异常:`, e);
        }
    }

    // ========== 4. 监控逻辑：容错+高频检测 ==========
    function startMonitoring() {
        setInterval(() => {
            try {
                const isXhrValid = ROOT_WINDOW.XMLHttpRequest?.[INTERCEPTOR_MARK] === true;
                const isFetchValid = ROOT_WINDOW.fetch?.[FETCH_INTERCEPTOR_MARK] === true;

                if (!isXhrValid || !isFetchValid) {
                    console.warn(`${LOG_PREFIX} 拦截器被覆盖，重新安装！`);
                    installProtectedInterceptor();
                }
            } catch (e) {
                console.error(`${LOG_PREFIX} 监控检测异常:`, e);
            }
        }, 300);
    }

    // ========== 工具函数：解析响应头 ==========
    function parseHeaders(headerStr) {
        const headers = {};
        if (!headerStr) return headers;
        headerStr.trim().split(/[\r\n]+/).forEach(line => {
            const [key, ...values] = line.split(': ');
            if (key) headers[key.toLowerCase()] = values.join(': ');
        });
        return headers;
    }

    // ========== 兜底：多时机触发安装 ==========
    window.addEventListener('DOMContentLoaded', () => setTimeout(installProtectedInterceptor, 100));
    window.addEventListener('load', () => setTimeout(installProtectedInterceptor, 300));
    window.addEventListener('beforeunload', () => {
        try { ROOT_WINDOW.XMLHttpRequest[INTERCEPTOR_MARK] = true; } catch (e) {}
    });

    // ========== 初始化 ==========
    installProtectedInterceptor();
    startMonitoring();
    console.log(`${LOG_PREFIX} 脚本初始化完成，XHR标记:`, ROOT_WINDOW.XMLHttpRequest?.[INTERCEPTOR_MARK]);
})();