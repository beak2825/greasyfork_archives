// ==UserScript==
// @name         去右键限制网站复制
// @namespace    https://github.com/yagizaMJ
// @version      0.2
// @description  支持绕过很多网站的禁止复制和粘贴的限制
// @author       yagizaMJ
// @match        https://*.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518765/%E5%8E%BB%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6%E7%BD%91%E7%AB%99%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/518765/%E5%8E%BB%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6%E7%BD%91%E7%AB%99%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 一次性取消所有事件限制
    ['oncontextmenu', 'onselectstart', 'oncopy', 'oncut', 'onpaste'].forEach(event => {
        document[event] = null;
    });

    // 如果网站使用了addEventListener来添加事件，你可能还需要更复杂的方法来移除它们
})();

(function () {
    // 重写XMLHttpRequest的open方法，使其在满足特定条件时修改响应数据
    rewriteXMLHttpRequestOpen();
})();

(function() {
    document.addEventListener('DOMContentLoaded', function () {
        // 重写document的addEventListener和document.body的addEventListener
        rewriteAddEventListener('document');
        rewriteAddEventListener('document.body');
    });
})();

// 重写addEventListener的函数
function rewriteAddEventListener(type) {
    const rawAddEventListener = (type === 'document') ? document.addEventListener : document.body.addEventListener;

    const target = (type === 'document') ? document : document.body;

    target.addEventListener = function (eventType, listener, options) {
        if(eventType === 'copy') {
            rawAddEventListener.call(target, eventType, () => null, options);
            return;
        }
        rawAddEventListener.call(target, eventType, listener, options);
    };
}

// 重写XMLHttpRequest的open方法的函数
function rewriteXMLHttpRequestOpen() {
    // 保存原始的XMLHttpRequest.prototype.open方法到XMLHttpRequest.prototype._open
    XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
    // 重写XMLHttpRequest.prototype.open方法
    XMLHttpRequest.prototype.open = function (...args) {
        // 从传入的参数中提取请求方法和URL
        const [method, url] = args;
        // 检查请求方法是否为POST，并且URL中是否包含特定字符串
        const targetUrl = 'space/api/suite/permission/document/actions/state/';
        if (method !== 'POST' || !url.includes(targetUrl)) {
            // 如果不满足条件，直接调用原始的XMLHttpRequest.prototype.open方法
            return this._open(...args);
        }
        // 如果满足条件，给XMLHttpRequest对象添加一个readystatechange事件处理函数
        this.addEventListener("readystatechange", modifyResponse, false);
        // 调用原始的XMLHttpRequest.prototype.open方法
        return this._open(...args);
    };
}

// 修改XMLHttpRequest的响应数据的函数
function modifyResponse() {
    // 确保响应的readyState为4（请求已完成）
    if (this.readyState !== 4) return;

    // 获取响应数据
    let response = this.response;
    try {
        // 尝试解析响应数据为JSON对象
        response = JSON.parse(response);
    } catch(e) {};

    // 输出调试信息，显示响应数据
    console.log('debug:', response);

    // 检查响应数据中的actions.copy字段是否为1
    const copyAllowed = 1;
    if (response.data.actions.copy === copyAllowed) {
        // 如果已经设置为1（允许复制），直接返回，不做修改
        return;
    }

    // 将actions.copy字段设置为1（允许复制）
    response.data.actions.copy = copyAllowed;

    // 使用Object.defineProperty重新定义XMLHttpRequest对象的response属性，使其返回修改后的响应数据
    Object.defineProperty(this, 'response', {
        get() {
            return response;
        }
    });

    // 使用Object.defineProperty重新定义XMLHttpRequest对象的responseText属性，使其返回修改后的响应数据（以JSON字符串形式）
    Object.defineProperty(this, 'responseText', {
        get() {
            return JSON.stringify(response);
        }
    });
}
