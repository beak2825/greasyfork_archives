// ==UserScript==
// @name         anjugs pc decrypt tools
// @namespace    http://tampermonkey.net/
// @version      2024-04-18
// @description  anjugs pc decrypt request and response, show result in console
// @author       gone
// @match        https://www.anjugs.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/Base64/1.3.0/base64.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/518425/anjugs%20pc%20decrypt%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/518425/anjugs%20pc%20decrypt%20tools.meta.js
// ==/UserScript==
// 拦截响应
// 保存原始的send方法
var originalSend = XMLHttpRequest.prototype.send;
var originalOpen = XMLHttpRequest.prototype.open;

// 用于存储请求信息
XMLHttpRequest.prototype.open = function(method, url) {
    this._method = method;
    this._url = url;
    // 保存请求头
    this._requestHeaders = {};
    // 保存请求体
    this._requestBody = null;

    // 监听请求头的设置
    var setRequestHeader = this.setRequestHeader;
    this.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        setRequestHeader.apply(this, arguments);
    };

    // 捕获请求体内容
    this._originalOnReadyStateChange = this.onreadystatechange; // 保存原有的事件处理器
    this.onreadystatechange = function() {
        if (this.readyState === 4) {
            // 记录请求和响应信息
            const logData = {
                request: {
                    url: this._url,
                    method: this._method,
                    headers: this._requestHeaders,
                    body: trimQuotes(this._requestBody),
                    timestamp: this._requestHeaders.timestamp,
                    decryptedRequestBody: decryptContent(trimQuotes(this._requestBody), this._requestHeaders.timestamp),
                },
                response: {
                    status: this.status,
                    headers: this.getAllResponseHeaders(),
                    body: this.responseText,
                    decryptedResponseBody: decryptContent(this.responseText, this._requestHeaders.timestamp),
                }
            };

            // 打印封装的对象
            console.log(logData.request.url, logData);
        }

        // 如果原始的onreadystatechange存在，继续调用它
        if (this._originalOnReadyStateChange) {
            this._originalOnReadyStateChange.apply(this, arguments);
        }
    };

    // 调用原始的open方法
    originalOpen.apply(this, arguments);
};

// 重写send方法，拦截请求并获取相应的信息
XMLHttpRequest.prototype.send = function(body) {
    // 保存请求体
    this._requestBody = body;

    // 调用原始send方法
    originalSend.apply(this, arguments);
};

function decryptContent(cryptContent, timestamp) {
    if (!timestamp) {
        throw new Error('Timestamp is required for decryption');
    }

    // 计算时间戳的md5值并截取前16位
    let timeMd5 = md5(timestamp);
    // 获取前16位
    timeMd5 = timeMd5.substring(0, 16);

    // console.log('Using MD5 of Timestamp for Decryption:', timeMd5);
    try {
        // 使用CryptoJS进行解密
        const decrypted = CryptoJS.AES.decrypt(cryptContent, CryptoJS.enc.Utf8.parse(timeMd5), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        }).toString(CryptoJS.enc.Utf8);
        // console.log('decrypted:', decrypted)
        // if (!decrypted) {
        //     throw new Error('Decryption failed');
        // }
        return parseJSON(decrypted)
    } catch (error) {
        console.log('error:', error)
    }
}

// 尝试解析 JSON，如果解析失败则返回原始字符串
function parseJSON(jsonString) {
    // 检查解密后的内容是否为空或无效
    if (!jsonString || jsonString.trim() === "") {
        return null; // 返回 null 或空值，表示无效的 JSON
    }

    try {
        // 尝试解析为 JSON 对象
        return JSON.parse(jsonString);
    } catch (e) {
        // 如果解析失败，输出警告，返回原始字符串
        console.warn('Invalid JSON format:', jsonString);
        return jsonString;
    }
}

// 去除字符串首尾的双引号
function trimQuotes(str) {
    if (typeof str === 'string') {
        // 去掉首尾的双引号
        if (str.startsWith('"') && str.endsWith('"')) {
            return str.slice(1, -1);
        }
    }
    return str;
}
