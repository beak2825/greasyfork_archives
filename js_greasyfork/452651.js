// ==UserScript==
// @name         让你的飞书更好用
// @namespace    https://bytedance.com
// @version      0.1
// @description  破解飞书的复制限制
// @author       alwaysday1
// @match        *://bytedance.feishu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452651/%E8%AE%A9%E4%BD%A0%E7%9A%84%E9%A3%9E%E4%B9%A6%E6%9B%B4%E5%A5%BD%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/452651/%E8%AE%A9%E4%BD%A0%E7%9A%84%E9%A3%9E%E4%B9%A6%E6%9B%B4%E5%A5%BD%E7%94%A8.meta.js
// ==/UserScript==
(function () {
    XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        const [ method, url ] = args;
        if (method !== 'POST' || !url.includes('space/api/suite/permission/document/actions/state/')) {
            return this._open(...args);
        }

        this.addEventListener("readystatechange", function() {
            if (this.readyState !== 4) return;
            let response = this.response;
            try {
                response = JSON.parse(response);
            } catch(e) {};
            console.log('debug:', response);
            if (response.data.actions.copy === 1) {
                return;
            }

            response.data.actions.copy = 1;

            Object.defineProperty(this, 'response', {
                get() {
                    return response;
                }
            });
            Object.defineProperty(this, 'responseText', {
                get() {
                    return JSON.stringify(response);
                }
            });
        }, false);

        return this._open(...args);
    };
})();