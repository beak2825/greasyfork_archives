// ==UserScript==
// @name         Mock平台请求增强插件
// @namespace    magicbox-enhance
// @version      1.0
// @description  Mock平台接口请求模拟测试工具增强插件
// @author       lza
// @match        http://localhost:9002/*
// @match        *://*.glab.fn.igame.163.com/*
// @match        *://glab.fn.igame.163.com/*
// @match        *://glab.fn.netease.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427451/Mock%E5%B9%B3%E5%8F%B0%E8%AF%B7%E6%B1%82%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/427451/Mock%E5%B9%B3%E5%8F%B0%E8%AF%B7%E6%B1%82%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

function isEmpty(obj) {
    return typeof obj === 'undefined' || obj == null || obj === '';
}

function kvStringToObject(str) {
    var obj = {};
    var headerList = [];
    str = isEmpty(str) ? '' : str;
    var pairs = str.split('\n');

    for (let pair of pairs) {
        var kv = pair.replace('：', ':').split(':');
        if (kv.length < 2) {
            continue;
        }
        if (isEmpty(kv[0])) {
            continue;
        }
        var name = kv[0].trim();
        var value = kv.slice(1).join(':').trim();

        // if(!/^[\w\[\]\p{Unified_Ideograph} -]+$/u.test(key)) {
        //     continue;
        // }

        if(!(/^[\w\-\[\]]+$/u.test(name))) {
            continue;
        }
        headerList.push({ name, value })
    }

    return headerList;
}

(function () {
    'use strict';
    var delay = 500;
    var timeout = 10000;
    setTimeout(function () {
        unsafeWindow.localRequest = function () {
            GM_xmlhttpRequest({
                method: unsafeWindow.request.request.method,
                url: unsafeWindow.request.request.url,
                headers: Object.assign({}, unsafeWindow.request.request.header),
                data: unsafeWindow.request.request.body,
                timeout: timeout,
                onload: function (res) {
                    unsafeWindow.request.response.code = res.status || 0;
                    unsafeWindow.request.response.status = res.statusText || '';
                    unsafeWindow.request.response.header = kvStringToObject(res.responseHeaders || '');
                    unsafeWindow.request.response.body = res.responseText || '';
                    unsafeWindow.showResponseData(res);
                },
                onerror: function (res) {
                    unsafeWindow.request.response.code = res.status || 0;
                    unsafeWindow.request.response.status = res.statusText || '';
                    unsafeWindow.request.response.header = kvStringToObject(res.responseHeaders || '');
                    unsafeWindow.request.response.body = res.responseText || '';
                    unsafeWindow.showResponseData(res);
                },
                ontimeout: function (res) {
                    unsafeWindow.request.response.code = res.status || 0;
                    unsafeWindow.request.response.status = res.statusText || '';
                    unsafeWindow.request.response.header = kvStringToObject(res.responseHeaders || '');
                    unsafeWindow.request.response.body = res.responseText || '';
                    unsafeWindow.showResponseData(res);
                }
            });
        }

    }, delay);

})();
