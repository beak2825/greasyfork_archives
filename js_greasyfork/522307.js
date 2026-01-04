// ==UserScript==
// @name         家庭氪金和DLC助手
// @namespace    http://tampermonkey.net/
// @description    Microsoft Family DLC
// @version      0.1
// @author       dianran
// @license       MIT
// @match        https://account.microsoft.com/family/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522307/%E5%AE%B6%E5%BA%AD%E6%B0%AA%E9%87%91%E5%92%8CDLC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522307/%E5%AE%B6%E5%BA%AD%E6%B0%AA%E9%87%91%E5%92%8CDLC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_URL = '/family/api/product?puid';
    const PRODUCT_KIND = 'Game';

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._interceptUrl = url;
        return originalOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        // 提前过滤不需要处理的请求
        if (!this._interceptUrl?.includes(TARGET_URL)) {
            return originalSend.apply(this, args);
        }

        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                try {
                    const response = JSON.parse(this.responseText);

                    if (response.productDocument?.product?.productKind !== undefined) {
                        response.productDocument.product.productKind = PRODUCT_KIND;

                        Object.defineProperty(this, 'responseText', {
                            value: JSON.stringify(response),
                            writable: false,
                        });
                    }
                } catch (e) {
                    console.error('修改响应时出错:', e);
                }
            }
        });

        return originalSend.apply(this, args);
    };
})();