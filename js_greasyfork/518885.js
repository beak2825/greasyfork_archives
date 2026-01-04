// ==UserScript==
// @name         HTTP Response Modifier for sky.money
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Modify HTTP response content for a specific URL in Chrome, handling both XHR and Fetch, with fixed property redefinition
// @match        https://app.sky.money/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/518885/HTTP%20Response%20Modifier%20for%20skymoney.user.js
// @updateURL https://update.greasyfork.org/scripts/518885/HTTP%20Response%20Modifier%20for%20skymoney.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetUrl = 'https://api.ipify.org/?format=json';
    const targetUrlRegex = /https:\/\/api\.ipify\.org\/\?format=json/;


    // 修改响应内容的函数
    function modifyResponse(originalContent) {
        // 在这里修改响应内容
        // 例如,将响应改为一个固定的JSON
        console.log(originalContent);
        let newContent = JSON.stringify({
            "ip":"223.241.89.179"
        });
        console.log(newContent);
        return newContent;
    }

    // 辅助函数：获取完整URL
    function getFullUrl(url) {
        if(!url) {
            return url;
        }
        if (url.startsWith('http')) {
            return url;
        } else {
            return new URL(url, window.location.origin).href;
        }
    }

    // 拦截XMLHttpRequest
    const originalXHR = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        let modifiedResponseText = null;

        xhr.open = function(method, url) {
            this._url = getFullUrl(url);
            return originalOpen.apply(this, arguments);
        };

        xhr.send = function() {
            const originalOnReadyStateChange = xhr.onreadystatechange;
            xhr.onreadystatechange = function() {
                if (this.readyState === 4 && (targetUrl == this._url || targetUrlRegex.test(this._url))) {
                    modifiedResponseText = modifyResponse(this.responseText);
                }
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };
            return originalSend.apply(this, arguments);
        };

        // 重写responseText的getter
        Object.defineProperty(xhr, 'responseText', {
            get: function() {
                return modifiedResponseText !== null ? modifiedResponseText : originalXHR.prototype.responseText.get.call(this);
            }
        });

        return xhr;
    };

    // 拦截fetch
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(input, init) {
        const url = getFullUrl(typeof input === 'string' ? input : input.url);
        if (targetUrl == url || targetUrlRegex.test(url)) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: init?.method || 'GET',
                    url: url,
                    headers: init?.headers,
                    data: init?.body,
                    onload: function(response) {
                        const modifiedResponse = modifyResponse(response.responseText);
                        resolve(new Response(modifiedResponse, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        }));
                    },
                    onerror: reject
                });
            });
        } else {
            return originalFetch.apply(this, arguments);
        }
    };
})();