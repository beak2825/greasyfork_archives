// ==UserScript==
// @name         GitHub Images Accept-Language Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修改发送给 GitHub 图片服务器的 Accept-Language 请求头，避免中文用户遇到 429 错误
// @author       Codming
// @match        *://*.github.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @connect      camo.githubusercontent.com
// @connect      avatars.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/534403/GitHub%20Images%20Accept-Language%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/534403/GitHub%20Images%20Accept-Language%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 拦截 XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalXhrOpen.apply(this, arguments);
    };
    
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        // 检查 URL 是否匹配目标域名
        if (this._url && 
            (this._url.includes('camo.githubusercontent.com') || 
             this._url.includes('avatars.githubusercontent.com'))) {
            
            // 如果是 Accept-Language 头，修改值
            if (header.toLowerCase() === 'accept-language') {
                value = value.replace('zh-CN', 'en-US').replace('zh;', 'en;');
                console.log('Modified Accept-Language for:', this._url, 'New value:', value);
            }
        }
        
        return originalXhrSetRequestHeader.call(this, header, value);
    };
    
    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(resource, init) {
        const url = resource instanceof Request ? resource.url : resource;
        
        if (url && 
            (url.includes('camo.githubusercontent.com') || 
             url.includes('avatars.githubusercontent.com'))) {
            
            init = init || {};
            init.headers = init.headers || {};
            
            // 创建修改后的 headers
            const newHeaders = new Headers(init.headers);
            
            if (newHeaders.has('accept-language')) {
                const langValue = newHeaders.get('accept-language');
                const newLangValue = langValue.replace('zh-CN', 'en-US').replace('zh;', 'en;');
                newHeaders.set('accept-language', newLangValue);
                console.log('Modified fetch Accept-Language for:', url, 'New value:', newLangValue);
            }
            
            // 如果 resource 是 Request 对象
            if (resource instanceof Request) {
                const newRequest = new Request(resource, {
                    headers: newHeaders
                });
                return originalFetch.call(this, newRequest, init);
            } else {
                // 如果是 URL 字符串
                init.headers = newHeaders;
                return originalFetch.call(this, resource, init);
            }
        }
        
        return originalFetch.apply(this, arguments);
    };
})();