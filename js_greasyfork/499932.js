// ==UserScript==
// @name         pdf 自动识别下载
// @namespace    http://tampermonkey.net/
// @version      2024-07-07
// @description  适用于DX网上大学
// @author       hn_lzy
// @match        *://kc.zhixueyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhixueyun.com
// @grant        none
// @connect      self
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499932/pdf%20%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/499932/pdf%20%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log('Script is running on kc.zhixueyun.com');
    const originalFetch = window.fetch;
    console.log('--------------test pdf------------')
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            if (response.headers.get('Content-Type') === 'application/pdf') {
                console.log('Intercepted PDF response:', response.url);
                console.log('test url');
                // 读取响应为Blob
                return response.blob().then(blob => {
                    // 创建一个临时的a标签用于下载
                    console.log(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = URL.createObjectURL(blob);
                    a.download =prompt('给下载的pdf文件命名：');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                });
            }

            // 对于非PDF响应，返回原始的Response对象
            return response;
        }).catch(error => {
            console.error('Fetch error:', error);
            // 根据需要处理错误，或者可以重新抛出错误
            throw error;
        });
    };


})();