// ==UserScript==
// @name         公共卫生继续教育平台播放进度修改
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  对请求内容进行重写
// @author       OneBe
// @match        https://service.cpma.org.cn/edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503628/%E5%85%AC%E5%85%B1%E5%8D%AB%E7%94%9F%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/503628/%E5%85%AC%E5%85%B1%E5%8D%AB%E7%94%9F%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 拦截 XMLHttpRequest
    (function(open, send) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            this._url = url; // 保存URL以供后续使用
            open.call(this, method, url, async, user, pass);
        };

        XMLHttpRequest.prototype.send = function(data) {
            if (this._url && this._url.includes('/calcStudyProcess')) {
                try {
                    let requestData = JSON.parse(data);
                    if (requestData.viewProcess && requestData.viewProcess !== 1) {
                        requestData.viewProcess = 1;
                    }
                    data = JSON.stringify(requestData);
                } catch (e) {
                    console.error('Error processing request data:', e);
                }
            }
            send.call(this, data);
        };
    })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);
})();

