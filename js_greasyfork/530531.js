// ==UserScript==
// @name         清理API响应中的PHP警告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除API响应中的PHP警告信息，保留有效JSON数据
// @author       mmnnwjw
// @license MIT
// @match        *://www.linovelib.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530531/%E6%B8%85%E7%90%86API%E5%93%8D%E5%BA%94%E4%B8%AD%E7%9A%84PHP%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/530531/%E6%B8%85%E7%90%86API%E5%93%8D%E5%BA%94%E4%B8%AD%E7%9A%84PHP%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始XMLHttpRequest对象
    const originalXhr = window.XMLHttpRequest;

    // 重写XMLHttpRequest
    window.XMLHttpRequest = function() {
        const xhr = new originalXhr();
        const originalOpen = xhr.open;
        let isTargetAPI = false;

        // 重写open方法以检测目标API
        xhr.open = function(method, url) {
            if (url.includes('api.php?action=get_list')) {
                isTargetAPI = true;
            }
            return originalOpen.apply(xhr, arguments);
        };

        // 重写responseText getter
        const originalResponseText = Object.getOwnPropertyDescriptor(originalXhr.prototype, 'responseText');
        Object.defineProperty(xhr, 'responseText', {
            get: function() {
                let text = originalResponseText.get.call(this);
                if (isTargetAPI) {
                    // 清理PHP警告（查找第一个{作为JSON起始）
                    const jsonStart = text.indexOf('{');
                    if (jsonStart > 0) {
                        text = text.substring(jsonStart);
                    }
                }
                return text;
            }
        });

        return xhr;
    };
})();