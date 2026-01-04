// ==UserScript==
// @name         oaifree自动重试pow
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  重试pow，太难的pow我就不算了
// @match        https://*.oaifree.com/*
// @match        https://gptchat.365day.win/*
// @grant        none
// @run-at       document-start
// @author       Marx
// @icon         https://cdn.oaifree.com/assets/apple-touch-icon-mz9nytnj.webp
// @downloadURL https://update.greasyfork.org/scripts/518135/oaifree%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95pow.user.js
// @updateURL https://update.greasyfork.org/scripts/518135/oaifree%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95pow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_PATH = '/backend-api/sentinel/chat-requirements';
    const MAX_RETRIES = 20; // 最多重试 20 次
    const PREFIX = '0000';

    function startsWith(str, prefix) {
        return str.startsWith(prefix);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 重写 fetch 函数
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        const method = (init && init.method) || (input && input.method) || 'GET';

        if (method.toUpperCase() === 'POST' && url.includes(TARGET_PATH)) {
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                const response = await originalFetch(input, init);
                const clonedResponse = response.clone();
                try {
                    const data = await clonedResponse.json();
                    if (data?.proofofwork?.difficulty && startsWith(data.proofofwork.difficulty, PREFIX)) {
                        if (attempt < MAX_RETRIES) {
                            await delay(200);
                            continue;
                        }
                    }
                    return response;
                } catch {
                    return response;
                }
            }
        }
        return originalFetch.apply(this, arguments);
    };

    // 重写 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._method.toUpperCase() === 'POST' && this._url.includes(TARGET_PATH)) {
            let attempt = 0;
            const xhr = this;

            const sendRequest = () => {
                attempt++;
                xhr.addEventListener('load', function onLoad() {
                    xhr.removeEventListener('load', onLoad);
                    try {
                        const data = JSON.parse(xhr.responseText);
                        if (data?.proofofwork?.difficulty && startsWith(data.proofofwork.difficulty, PREFIX)) {
                            if (attempt < MAX_RETRIES) {
                                delay(200).then(sendRequest);
                            }
                        }
                    } catch {}
                });
                originalOpen.call(xhr, this._method, this._url, true);
                originalSend.call(xhr, body);
            };

            sendRequest();
        } else {
            originalSend.apply(this, arguments);
        }
    };
})();