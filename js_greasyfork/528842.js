// ==UserScript==
// @name         Suno会员破解
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  license API
// @author       BadCat
// @match        *://www.suno.cn/*
// @icon         https://www.suno.cn/home/images/suno_logo2.png
// @grant        GM_setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528842/Suno%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/528842/Suno%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const value = localStorage.getItem('token');
    if(value) {
        GM_setClipboard(value);
    }

    // 拦截 XHR
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        xhr.open = function() {
            this._url = arguments[1];
            return originalOpen.apply(this, arguments);
        };

        // 使用事件监听方式拦截响应
        xhr.addEventListener('readystatechange', function() {
            if (this._url && this._url.includes('/api/license') && this.readyState === 4) {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response.data) {
                        response.data.status = 1;
                        response.data.permanent = 1;
                        response.data.soft_edition = 3;
                        Object.defineProperty(this, 'responseText', {
                            value: JSON.stringify(response),
                            writable: false
                        });
                        Object.defineProperty(this, 'response', {
                            value: JSON.stringify(response),
                            writable: false
                        });
                    }
                } catch (e) {
                    console.error('解析响应失败:', e);
                }
            }
        });

        xhr.send = function() {
            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    // 拦截 Fetch
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        const response = await originalFetch.apply(this, arguments);

        if (typeof url === 'string' && url.includes('/api/license')) {
            const clonedResponse = response.clone();
            try {
                const data = await clonedResponse.json();
                if (data.data) {
                    data.data.status = 1;
                    response.data.permanent = 1;
                    response.data.soft_edition = 3;
                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            } catch (e) {
                console.error('解析响应失败:', e);
            }
        }
        return response;
    };

    console.log('Suno License Status Modifier 已启动');
})();