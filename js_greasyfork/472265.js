// ==UserScript==
// @name        ajax拦截
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     2.0.5
// @author      yy
// @run-at       document-start
// https://qi02.xyz/play/1558-0-0.html
// https://ailu01.xyz/#term-732
// https://xx.buliang22.cc/shouye/index.html
// https://91cangku23.buzz/
// https://www.pgyy79.xyz/
// @license MIT
// @description 2023/8/2 下午5:16:56
// @downloadURL https://update.greasyfork.org/scripts/472265/ajax%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/472265/ajax%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听Ajax请求
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        var self = this;

        // 检查是否是需要拦截的请求
        if (self._url.includes('eduCourseBaseinfo/getStuCouseInfo.action')) {  // 替换为目标Ajax请求的URL或关键字
            // debugger
            // 修改分页参数
            var modifiedData = data.replace('limit=6', 'limit=60');  // 替换为您想要的分页参数

            // 重新发起请求
            originalSend.call(self, modifiedData);
        } else {
            originalSend.call(self, data);
        }
    };

    // 拦截open方法，记录请求URL
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async) {
        this._url = url;
        originalOpen.call(this, method, url, async);
    };
})();