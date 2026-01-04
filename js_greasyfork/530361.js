// ==UserScript==
// @name         夸克网盘-分享按时间倒序排序
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  精准修改指定API请求的_sort参数
// @author       You
// @license      MIT
// @match        https://pan.quark.cn/s/*
// @icon         https://pan.quark.cn/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530361/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98-%E5%88%86%E4%BA%AB%E6%8C%89%E6%97%B6%E9%97%B4%E5%80%92%E5%BA%8F%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/530361/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98-%E5%88%86%E4%BA%AB%E6%8C%89%E6%97%B6%E9%97%B4%E5%80%92%E5%BA%8F%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标URL特征正则表达式（忽略动态参数）
    const TARGET_REGEX = /\/1\/clouddrive\/share\/sharepage\/detail\?.*(&|\?)_sort=file_type:asc,file_name:asc/;

    // 参数修改逻辑
    function modifySpecificRequest(url) {
        try {
            // 检查是否为目标请求
            if (!TARGET_REGEX.test(url)) return url;

            const urlObj = new URL(url);
            const params = urlObj.searchParams;

            // 仅当存在需要修改的参数时才操作
            if (params.get('_sort') === 'file_type:asc,file_name:asc') {
                params.set('_sort', 'file_type:asc,updated_at:desc');
                console.log('[脚本生效] 已修改排序参数', urlObj.href);
            }

            return urlObj.href;
        } catch (e) {
            return url;
        }
    }

    // 高精度拦截XMLHttpRequest
    const originXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        const modifiedUrl = modifySpecificRequest(url);
        return originXHROpen.call(this, method, modifiedUrl);
    };

    // 精准拦截Fetch请求
    const originFetch = window.fetch;
    window.fetch = function(input, init) {
        // 处理不同输入类型
        let url = typeof input === 'string' ? input : input.url;
        const modifiedUrl = modifySpecificRequest(url);

        // 构造新请求
        if (modifiedUrl !== url) {
            if (typeof input === 'string') {
                input = modifiedUrl;
            } else {
                input = new Request(modifiedUrl, input);
            }
        }

        return originFetch.call(this, input, init);
    };

    // 监听页面初始请求
    if (window.performance?.getEntriesByType?.('navigation')[0]?.type === 'navigate') {
        const cleanUrl = modifySpecificRequest(window.location.href);
        if (cleanUrl !== window.location.href) {
            window.history.replaceState(null, '', cleanUrl);
        }
    }
})();