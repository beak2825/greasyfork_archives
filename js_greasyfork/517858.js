// ==UserScript==
// @name         评论管理-自主评论-一键评论
// @namespace    http://tampermonkey.net/
// @version      2024-11-18
// @description  选择时间范围拉取所有数据
// @author       You
// @match        https://duanshipin.bdsaas.top/*
// @connect      api.tool.duanshipin.com
// @downloadURL https://update.greasyfork.org/scripts/517858/%E8%AF%84%E8%AE%BA%E7%AE%A1%E7%90%86-%E8%87%AA%E4%B8%BB%E8%AF%84%E8%AE%BA-%E4%B8%80%E9%94%AE%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/517858/%E8%AF%84%E8%AE%BA%E7%AE%A1%E7%90%86-%E8%87%AA%E4%B8%BB%E8%AF%84%E8%AE%BA-%E4%B8%80%E9%94%AE%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const originalXHROpen = XMLHttpRequest.prototype.open;

    // 重写 open 方法
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (url.includes('https://api.tool.duanshipin.com/api/company/comment/self_comment_lists')) {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);

            // 修改参数
            if (params.has('page_size') && params.has('start_at') && params.has('end_at')) {
                params.set('page_size', '99999');
                urlObj.search = params.toString();
            }

            // 使用修改后的 URL
            url = urlObj.toString();
        }
        // 调用原始的 open 方法
        return originalXHROpen.call(this, method, url, async, user, password);
    }
})();