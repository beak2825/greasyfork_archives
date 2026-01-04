// ==UserScript==
// @name         绕开hnjspx人脸
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改请求和响应
// @author       You
// @match        *://jzpx.hnjspx.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501063/%E7%BB%95%E5%BC%80hnjspx%E4%BA%BA%E8%84%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/501063/%E7%BB%95%E5%BC%80hnjspx%E4%BA%BA%E8%84%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截并修改 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function() {
        const args = arguments;
        const options = args[1] || {};

        if (options.body) {
            let body = options.body;
            if (typeof body === 'string') {
                // 替换 body 中的 "faceAuth": false
                body = body.replace(/"faceAuth":\s*false/g, '"faceAuth": true');
                options.body = body;
            }
        }
        args[1] = options;

        return originalFetch.apply(this, args).then(response => {
            // 克隆响应以便修改
            const clonedResponse = response.clone();
            return clonedResponse.text().then(text => {
                // 替换响应文本中的 "faceAuth": false
                const modifiedText = text.replace(/"faceAuth":\s*false/g, '"faceAuth": true');
                return new Response(modifiedText, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            });
        });
    };

    // 拦截并修改 XMLHttpRequest 请求
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;

        if (typeof body === 'string') {
            // 替换 body 中的 "faceAuth": false
            body = body.replace(/"faceAuth":\s*false/g, '"faceAuth": true');
        }

        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === 4) {
                let responseText = xhr.responseText;
                // 替换响应文本中的 "faceAuth": false
                responseText = responseText.replace(/"faceAuth":\s*false/g, '"faceAuth": true');

                // 重新定义 response 属性
                Object.defineProperty(xhr, 'response', { writable: true });
                Object.defineProperty(xhr, 'responseText', { writable: true });
                xhr.response = responseText;
                xhr.responseText = responseText;
            }
        });

        originalSend.call(this, body);
    };
})();