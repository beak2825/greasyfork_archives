// ==UserScript==
// @name         Getman+
// @namespace    Getman.cn
// @version      1.0
// @description  Getman HTTP接口请求模拟测试工具增强插件，在线Postman，在线Curl，支持Cookie、本地内网跨域请求 Restful接口测试
// @author       Getman.cn
// @match        https://getman.cn/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// @homepage     https://getman.cn/
// @icon         https://getman.cn/img/icon.png
// @supportURL   https://getman.cn/
// @downloadURL https://update.greasyfork.org/scripts/403087/Getman%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/403087/Getman%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var delay = 500;
    var timeout = 10000;
    setTimeout(function () {
        if (typeof (unsafeWindow.localRequest) === 'function') {
            unsafeWindow.localRequest = function () {
                GM_xmlhttpRequest({
                    method: unsafeWindow.request.request.method,
                    url: unsafeWindow.request.request.url.raw,
                    headers: Object.assign({}, unsafeWindow.request.request.header),
                    data: unsafeWindow.request.request.body,
                    timeout: timeout,
                    onload: function (res) {
                        unsafeWindow.request.response.code = res.status || 0;
                        unsafeWindow.request.response.status = res.statusText || '';
                        unsafeWindow.request.response.header = unsafeWindow.kvStringToObject(res.responseHeaders || '');
                        unsafeWindow.request.response.body = res.responseText || '';
                        unsafeWindow.showResponseData(res);
                    },
                    onerror: function (res) {
                        unsafeWindow.request.response.code = res.status || 0;
                        unsafeWindow.request.response.status = res.statusText || '';
                        unsafeWindow.request.response.header = unsafeWindow.kvStringToObject(res.responseHeaders || '');
                        unsafeWindow.request.response.body = res.responseText || '';
                        unsafeWindow.showResponseData(res);
                    },
                    ontimeout: function (res) {
                        unsafeWindow.request.response.code = res.status || 0;
                        unsafeWindow.request.response.status = res.statusText || '';
                        unsafeWindow.request.response.header = unsafeWindow.kvStringToObject(res.responseHeaders || '');
                        unsafeWindow.request.response.body = res.responseText || '';
                        unsafeWindow.showResponseData(res);
                    }
                });
            }
        }

    }, delay);

})();
