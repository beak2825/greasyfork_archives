// ==UserScript==
// @name         拷贝漫画免app
// @namespace    https://viayoo.com/
// @version      1.9
// @description  通过修改ua的方式，免app
// @author       丸子
// @match        *://www.mangacopy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523968/%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E5%85%8Dapp.user.js
// @updateURL https://update.greasyfork.org/scripts/523968/%E6%8B%B7%E8%B4%9D%E6%BC%AB%E7%94%BB%E5%85%8Dapp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设定电脑UA字符串（请根据需要修改）
    const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";

    // 1. 修改 navigator.userAgent 属性，让页面脚本读取到电脑UA
    try {
        Object.defineProperty(navigator, 'userAgent', {
            get: function() { return desktopUA; },
            configurable: true
        });
    } catch (e) {
        console.error("无法重写 navigator.userAgent 属性", e);
    }

    // 2. 拦截 GM_xmlhttpRequest，确保其请求头中含有电脑UA
    if (typeof GM_xmlhttpRequest === "function") {
        const originalGMXHR = GM_xmlhttpRequest;
        GM_xmlhttpRequest = function(details) {
            details.headers = details.headers || {};
            details.headers["User-Agent"] = desktopUA;
            return originalGMXHR(details);
        };
    } else {
        console.warn("GM_xmlhttpRequest 不可用，UA覆盖功能可能无法生效");
    }

    // 3. 重写 fetch：将所有 fetch 请求转为使用 GM_xmlhttpRequest 实现
    const originalFetch = window.fetch;
    window.fetch = function(input, init = {}) {
        return new Promise((resolve, reject) => {
            let method = (init.method || "GET").toUpperCase();
            let url;
            if (typeof input === "string") {
                url = input;
            } else if (input && input.url) {
                url = input.url;
            } else {
                return reject(new Error("fetch: 无效的请求 URL"));
            }
            // 合并用户自定义的请求头，并强制设置 User-Agent
            let headers = {};
            if (init.headers) {
                if (init.headers instanceof Headers) {
                    init.headers.forEach((value, key) => {
                        headers[key] = value;
                    });
                } else if (typeof init.headers === "object") {
                    headers = Object.assign({}, init.headers);
                }
            }
            headers["User-Agent"] = desktopUA;

            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: headers,
                data: init.body,
                onload: function(response) {
                    // 简单构造 Response 对象（注意：不支持流式及二进制响应）
                    const contentTypeMatch = response.responseHeaders.match(/content-type:\s*([^\r\n]+)/i);
                    const blob = new Blob([response.response], { type: contentTypeMatch ? contentTypeMatch[1] : "text/plain" });
                    const res = new Response(blob, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: parseResponseHeaders(response.responseHeaders)
                    });
                    resolve(res);
                },
                onerror: function(err) {
                    reject(new Error("GM_xmlhttpRequest error"));
                }
            });
        });
    };

    // 辅助函数：将响应头字符串转换为 Headers 对象
    function parseResponseHeaders(headerStr) {
        const headers = new Headers();
        if (!headerStr) {
            return headers;
        }
        headerStr.split('\r\n').forEach(line => {
            const parts = line.split(': ');
            if (parts.length === 2) {
                headers.append(parts[0], parts[1]);
            }
        });
        return headers;
    }

    // 4. 重写 XMLHttpRequest，将其请求转为使用 GM_xmlhttpRequest
    const OriginalXHR = window.XMLHttpRequest;
    function CustomXHR() {
        // 保存必要属性
        this._method = "";
        this._url = "";
        this._headers = {};
        this.onreadystatechange = null;
        this.onload = null;
        this.onerror = null;
        this.readyState = 0;
        this.status = 0;
        this.statusText = "";
        this.responseText = "";
        this.response = "";
    }

    CustomXHR.prototype.open = function(method, url, async, user, password) {
        this._method = method;
        this._url = url;
        this.readyState = 1;
        if (typeof this.onreadystatechange === "function") {
            this.onreadystatechange();
        }
    };

    CustomXHR.prototype.setRequestHeader = function(header, value) {
        this._headers[header] = value;
    };

    CustomXHR.prototype.send = function(body) {
        // 强制覆盖 User-Agent
        this._headers["User-Agent"] = desktopUA;
        GM_xmlhttpRequest({
            method: this._method,
            url: this._url,
            headers: this._headers,
            data: body,
            onload: (response) => {
                this.status = response.status;
                this.statusText = response.statusText;
                this.responseText = response.responseText;
                this.response = response.response;
                this.readyState = 4;
                if (typeof this.onreadystatechange === "function") {
                    this.onreadystatechange();
                }
                if (typeof this.onload === "function") {
                    this.onload();
                }
            },
            onerror: (err) => {
                this.status = 0;
                this.statusText = "error";
                this.readyState = 4;
                if (typeof this.onreadystatechange === "function") {
                    this.onreadystatechange();
                }
                if (typeof this.onerror === "function") {
                    this.onerror();
                }
            }
        });
    };

    CustomXHR.prototype.abort = function() {
        // 暂不支持 abort 操作
        console.warn("CustomXHR 暂不支持 abort");
    };

    // 用自定义的 XHR 替换全局 XMLHttpRequest
    window.XMLHttpRequest = CustomXHR;

})();
