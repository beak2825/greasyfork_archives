// ==UserScript==
// @name         b站直播间点赞*1000
// @namespace    https://space.bilibili.com/35192025
// @supportURL   https://space.bilibili.com/35192025
// @version      1.1.1
// @description  不管点赞多少次都会变成1k次
// @author       铂屑
// @license      MIT
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/477746/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%82%B9%E8%B5%9E%2A1000.user.js
// @updateURL https://update.greasyfork.org/scripts/477746/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%82%B9%E8%B5%9E%2A1000.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截XHR请求
    // ah.proxy({
    //     onRequest: (config, handler) => {
    //         if (config.url.includes('/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3')) {
    //             config.body = config.body.replace(/click_time=[0-9]+/,'click_time=1000');
    //             console.log('[B站点赞脚本] 拦截到XHR请求:', config);
    //         }
    //         handler.next(config);
    //     },
    // }, unsafeWindow);

    // 拦截Fetch请求
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(...args) {
        const [resource, config] = args;

        // 检查是否是点赞请求
        if (typeof resource === 'string' && resource.includes('/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3')) {
            console.log('[B站点赞脚本] 拦截到Fetch请求:', {resource, config});
            const newResource = resource.replace(/click_time=[0-9]+/,'click_time=1000');
            args[0] = newResource
        }

        return originalFetch.apply(this, args);
    };
})();
