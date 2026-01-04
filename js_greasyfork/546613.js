// ==UserScript==
// @name         有一云永久VIP
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  有一云永久VIP,更改会员时间和类型
// @author       You
// @match        https://i.uecloud.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546613/%E6%9C%89%E4%B8%80%E4%BA%91%E6%B0%B8%E4%B9%85VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/546613/%E6%9C%89%E4%B8%80%E4%BA%91%E6%B0%B8%E4%B9%85VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_PROFILE_PATH = '/api/user/profile';
    const EXPIRE_TIME_MS = Date.UTC(2099, 11, 31, 23, 59, 59); // 2099-12-31 23:59:59 UTC

    const processedRequests = new Set();

    function isProfileAPI(urlLike) {
        if (!urlLike) return false;
        try {
            const urlStr = urlLike.toString();
            // 兼容相对路径与绝对路径
            if (urlStr.startsWith('http')) {
                const u = new URL(urlStr);
                return u.hostname === 'i.uecloud.com' && u.pathname === TARGET_PROFILE_PATH;
            }
            return urlStr.includes(TARGET_PROFILE_PATH);
        } catch (_) {
            return false;
        }
    }

    function modifyProfileResponse(json) {
        if (!json || typeof json !== 'object') return json;
        const cloned = Array.isArray(json) ? [...json] : { ...json };

        if (cloned && typeof cloned === 'object') {
            const data = cloned.data;
            if (data && typeof data === 'object') {
                cloned.data = {
                    ...data,
                    is_vip: true,
                    vip_type: data.vip_type && typeof data.vip_type === 'string' && data.vip_type.trim().length > 0 ? data.vip_type : 'SVIP',
                    vip_expire_time: EXPIRE_TIME_MS
                };
            }
        }

        return cloned;
    }

    // 拦截 XMLHttpRequest
    (function patchXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._interceptedUrl = url;
            return originalOpen.apply(this, [method, url, ...rest]);
        };

        XMLHttpRequest.prototype.send = function(...args) {
            const xhr = this;
            const originalOnReadyStateChange = xhr.onreadystatechange;

            xhr.onreadystatechange = function() {
                try {
                    if (xhr.readyState === 4 && xhr.status === 200 && isProfileAPI(xhr._interceptedUrl)) {
                        // 仅处理文本响应
                        if (!xhr.responseType || xhr.responseType === '' || xhr.responseType === 'text') {
                            const requestId = `${xhr._interceptedUrl}_${Date.now()}`;
                            if (!processedRequests.has(requestId)) {
                                processedRequests.add(requestId);
                                try {
                                    const body = xhr.responseText;
                                    try {
                                        const json = JSON.parse(body);
                                        const modified = modifyProfileResponse(json);
                                        const newText = JSON.stringify(modified);

                                        Object.defineProperty(xhr, 'responseText', { value: newText });
                                        Object.defineProperty(xhr, 'response', { value: newText });
                                    } catch (_) {
                                        // 非JSON或解析失败则忽略
                                    }
                                } catch (_) {
                                    // 忽略单次失败
                                }
                            }
                        }
                    }
                } catch (_) {
                    // 忽略
                }

                if (typeof originalOnReadyStateChange === 'function') {
                    try { originalOnReadyStateChange.apply(xhr, arguments); } catch (_) {}
                }
            };

            return originalSend.apply(this, args);
        };
    })();

    // 拦截 fetch
    (function patchFetch() {
        if (!window.fetch) return;
        const origFetch = window.fetch;

        window.fetch = function(...args) {
            const [url] = args;
            if (!isProfileAPI(url)) {
                return origFetch.apply(this, args);
            }

            return origFetch.apply(this, args).then(resp => {
                try {
                    const requestId = `${url}_${Date.now()}`;
                    if (processedRequests.has(requestId)) {
                        return resp;
                    }
                    processedRequests.add(requestId);

                    const cloned = resp.clone();
                    return cloned.text().then(text => {
                        try {
                            const json = JSON.parse(text);
                            const modified = modifyProfileResponse(json);
                            const body = JSON.stringify(modified);

                            const headers = new Headers(resp.headers);
                            headers.set('Content-Type', 'application/json; charset=utf-8');

                            return new Response(body, {
                                status: resp.status,
                                statusText: resp.statusText,
                                headers
                            });
                        } catch (_) {
                            return resp;
                        }
                    }).catch(() => resp);
                } catch (_) {
                    return resp;
                }
            });
        };
    })();

    // 定时清理 processedRequests，避免无限增长
    setInterval(() => processedRequests.clear(), 60000);
})();


