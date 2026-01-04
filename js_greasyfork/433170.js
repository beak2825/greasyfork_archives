// ==UserScript==
// @name        Tools DEV 收集页面性能信息
// @description 收集页面性能信息
// @include     *
// @author      AD
// @version     0.1
// @namespace   aboutdev
// @icon        data:image/png;base64,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

// @downloadURL https://update.greasyfork.org/scripts/433170/Tools%20DEV%20%E6%94%B6%E9%9B%86%E9%A1%B5%E9%9D%A2%E6%80%A7%E8%83%BD%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/433170/Tools%20DEV%20%E6%94%B6%E9%9B%86%E9%A1%B5%E9%9D%A2%E6%80%A7%E8%83%BD%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var e = window.performance;
    if (e) {
        var t = e.getEntriesByType("navigation")[0], r = 0;
        t || (r = (t = e.timing).navigationStart);
        var n = [{
            key: "Redirect",
            desc: "\u7f51\u9875\u91cd\u5b9a\u5411\u7684\u8017\u65f6",
            value: t.redirectEnd - t.redirectStart
        }, {
            key: "AppCache",
            desc: "\u68c0\u67e5\u672c\u5730\u7f13\u5b58\u7684\u8017\u65f6",
            value: t.domainLookupStart - t.fetchStart
        }, {
            key: "DNS",
            desc: "DNS\u67e5\u8be2\u7684\u8017\u65f6",
            value: t.domainLookupEnd - t.domainLookupStart
        }, {
            key: "TCP",
            desc: "TCP\u8fde\u63a5\u7684\u8017\u65f6",
            value: t.connectEnd - t.connectStart
        }, {
            key: "Waiting(TTFB)",
            desc: "\u4ece\u5ba2\u6237\u7aef\u53d1\u8d77\u8bf7\u6c42\u5230\u63a5\u6536\u5230\u54cd\u5e94\u7684\u65f6\u95f4 / Time To First Byte",
            value: t.responseStart - t.requestStart
        }, {
            key: "Content Download",
            desc: "\u4e0b\u8f7d\u670d\u52a1\u7aef\u8fd4\u56de\u6570\u636e\u7684\u65f6\u95f4",
            value: t.responseEnd - t.responseStart
        }, {
            key: "HTTP Total Time",
            desc: "http\u8bf7\u6c42\u603b\u8017\u65f6",
            value: t.responseEnd - t.requestStart
        }, {
            key: "DOMContentLoaded",
            desc: "dom\u52a0\u8f7d\u5b8c\u6210\u7684\u65f6\u95f4",
            value: t.domContentLoadedEventEnd - r
        }, {
            key: "Loaded",
            desc: "\u9875\u9762load\u7684\u603b\u8017\u65f6",
            value: t.loadEventEnd - r
        }];

        console && console.log && console.log(n,'=> AD 页面性能信息')
    }

})();