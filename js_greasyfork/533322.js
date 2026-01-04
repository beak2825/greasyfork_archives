// ==UserScript==
// @name         MyGO!!!!!×Ave Mujica 合同ライブ「わかれ道の、その先へ」Force Ticket Check
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制修改 /users/confirmation 接口的 ticket_check 为 true
// @author       Ever727
// @match        *://nolets.jp/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533322/MyGO%21%21%21%21%21%C3%97Ave%20Mujica%20%E5%90%88%E5%90%8C%E3%83%A9%E3%82%A4%E3%83%96%E3%80%8C%E3%82%8F%E3%81%8B%E3%82%8C%E9%81%93%E3%81%AE%E3%80%81%E3%81%9D%E3%81%AE%E5%85%88%E3%81%B8%E3%80%8DForce%20Ticket%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/533322/MyGO%21%21%21%21%21%C3%97Ave%20Mujica%20%E5%90%88%E5%90%8C%E3%83%A9%E3%82%A4%E3%83%96%E3%80%8C%E3%82%8F%E3%81%8B%E3%82%8C%E9%81%93%E3%81%AE%E3%80%81%E3%81%9D%E3%81%AE%E5%85%88%E3%81%B8%E3%80%8DForce%20Ticket%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================================
    // 核心拦截逻辑
    // ================================================

    // 拦截 XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;

        xhr.open = function(method, url) {
            // 捕获目标请求
            if (method.toUpperCase() === 'GET' && url.includes('/V5/API/users/confirmation')) {
                const originalOnReadyStateChange = xhr.onreadystatechange;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        try {
                            let modifiedResponse = xhr.responseText;
                            if (modifiedResponse.includes('ticket_check')) {
                                modifiedResponse = modifiedResponse.replace(
                                    /"ticket_check":false/,
                                    '"ticket_check":true'
                                );
                                console.log('[XHR] 已强制修改 ticket_check');
                            }
                            // 重写响应内容
                            Object.defineProperty(xhr, 'responseText', { value: modifiedResponse });
                        } catch (e) {
                            console.error('XHR处理失败:', e);
                        }
                    }
                    if (originalOnReadyStateChange) originalOnReadyStateChange.apply(xhr, arguments);
                };
            }
            originalOpen.apply(xhr, arguments);
        };
        return xhr;
    };

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = (typeof input === 'string') ? input : input.url;
        if (url.includes('/V5/API/users/confirmation')) {
            const response = await originalFetch(input, init);
            const clonedResponse = response.clone();

            return clonedResponse.json().then(data => {
                if (data.hasOwnProperty('ticket_check')) {
                    data.ticket_check = true;
                    console.log('[Fetch] 已强制修改 ticket_check');
                }
                return new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }).catch(e => {
                console.error('Fetch处理失败:', e);
                return response;
            });
        }
        return originalFetch(input, init);
    };
})();