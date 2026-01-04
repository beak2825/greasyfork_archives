// ==UserScript==
// @name         PosterArtist导出高清JPG
// @name:zh      PosterArtist导出高清JPG
// @name:zh-CN   PosterArtist导出高清JPG
// @name:zh-TW   PosterArtist匯出高清JPG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 https://posterartist.canon/edit/* 网页的 POST 请求中修改 longEdge 为指定值
// @description:zh 在 https://posterartist.canon/edit/* 网页的 POST 请求中修改 longEdge 为指定值
// @description:zh-cn 在 https://posterartist.canon/edit/* 网页的 POST 请求中修改 longEdge 为指定值
// @description:zh-tw 在 https://posterartist.canon/edit/* 網頁的 POST 請求中修改 longEdge 為指定值
// @author       wqh227
// @match        https://posterartist.canon/edit/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/531716/PosterArtist%E5%8C%AF%E5%87%BA%E9%AB%98%E6%B8%85JPG.user.js
// @updateURL https://update.greasyfork.org/scripts/531716/PosterArtist%E5%8C%AF%E5%87%BA%E9%AB%98%E6%B8%85JPG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置 longEdge 的值
    const newLongEdgeValue = 10000; // 你可以在这里修改 longEdge 的值

    // 修改原生 fetch 方法
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (options && options.method === "POST" && url === "https://api.posterartist.canon/graphql") {
            // 打印调试信息
            console.log("拦截到 POST 请求: ", url);

            // 修改请求体中的 longEdge 参数
            if (options.body) {
                try {
                    let body = JSON.parse(options.body);

                    // 检查并修改 longEdge
                    if (body.variables && body.variables.parameters) {
                        let params = JSON.parse(body.variables.parameters);
                        if (params.longEdge) {
                            console.log("发现 longEdge，修改为", newLongEdgeValue);
                            params.longEdge = newLongEdgeValue; // 修改 longEdge 为配置值
                            body.variables.parameters = JSON.stringify(params);
                        }
                    }

                    // 重新设置修改后的请求体
                    options.body = JSON.stringify(body);

                } catch (e) {
                    console.error("请求体解析失败", e);
                }
            }
        }

        // 调用原始 fetch 方法发送修改后的请求
        return originalFetch(url, options);
    };

})();
