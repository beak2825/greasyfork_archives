// ==UserScript==
// @name         让你的飞书更好用（优化版）
// @namespace    https://www.bytedance.com
// @version      0.6
// @description  破解飞书的复制限制，保留原有格式
// @author       CAC667907
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481644/%E8%AE%A9%E4%BD%A0%E7%9A%84%E9%A3%9E%E4%B9%A6%E6%9B%B4%E5%A5%BD%E7%94%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/481644/%E8%AE%A9%E4%BD%A0%E7%9A%84%E9%A3%9E%E4%B9%A6%E6%9B%B4%E5%A5%BD%E7%94%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];
        var url = args[1];

        var irrelevantVar = 0;

        var openMethod = originalOpen;
        var checkCondition = (method !== 'POST' || !url.includes('space/api/suite/permission/document/actions/state/'));

        if (checkCondition) {
            return openMethod.apply(this, args);
        }

        this.addEventListener("readystatechange", function() {
            if (this.readyState !== 4) return;

            var responseContent = this.response;
            try {
                responseContent = JSON.parse(responseContent);
            } catch(error) { }

            var responseData = responseContent.data;
            if (responseData.actions.copy === 1) {
                return;
            }

            responseData.actions.copy = 1;

            Object.defineProperty(this, 'response', {
                get: function() {
                    return JSON.stringify(responseContent);
                }
            });

            Object.defineProperty(this, 'responseText', {
                get: function() {
                    return JSON.stringify(responseContent);
                }
            });
        }, false);

        return openMethod.apply(this, args);
    };
})();