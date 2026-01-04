// ==UserScript==
// @name         feishu
// @namespace    https://bytedance.com
// @version      0.1
// @description  破解飞书的复制限制
// @author       alwaysday1
// @match        *://*.feishu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473247/feishu.user.js
// @updateURL https://update.greasyfork.org/scripts/473247/feishu.meta.js
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