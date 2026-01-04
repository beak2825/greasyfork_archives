// ==UserScript==
// @name         油猴办公助手(vue数据篡改)-tomy.li
// @namespace    http://tampermonkey.net/
// @version      0.9.9
// @description  个人工作用的油猴脚本
// @author       tomy.li
// @include      *
// @match        file:///*|*://*scm.to8to.com/*
// @run-at      document-start
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512793/%E6%B2%B9%E7%8C%B4%E5%8A%9E%E5%85%AC%E5%8A%A9%E6%89%8B%28vue%E6%95%B0%E6%8D%AE%E7%AF%A1%E6%94%B9%29-tomyli.user.js
// @updateURL https://update.greasyfork.org/scripts/512793/%E6%B2%B9%E7%8C%B4%E5%8A%9E%E5%85%AC%E5%8A%A9%E6%89%8B%28vue%E6%95%B0%E6%8D%AE%E7%AF%A1%E6%94%B9%29-tomyli.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const targetUrl = 'callManager/erp/blacklist/queryPage'; // 需要拦截的URL

    // 劫持 XMLHttpRequest 的 open 方法
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._url = url; // 保存请求的URL
        originalOpen.apply(this, arguments);
    };

    // 劫持 XMLHttpRequest 的 send 方法
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        const originalOnReadyStateChange = xhr.onreadystatechange;

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200 && xhr._url.includes(targetUrl)) {
                // 拦截并修改响应数据
                let response = xhr.responseText;

                console.log('Original response:', response);

                // 这里修改响应内容
                response = modifyResponse(response);

                // 劫持 `responseText`
                Object.defineProperty(xhr, 'responseText', { value: response });

                console.log('Modified response:', xhr.responseText);
            }

            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(this, arguments);
            }
        };

        originalSend.apply(this, arguments);
    };

    // 自定义修改响应数据的方法
    function modifyResponse(responseText) {
        let response = JSON.parse(responseText);
        response.result.rows.forEach((item) => {
          item.operateType = 1;
        });
        return JSON.stringify(response);
    }

})();