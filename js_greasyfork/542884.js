// ==UserScript==
// @name         Bilibili Live Only FLV
// @version      0.0.1
// @namespace    https://vtbs.ai/
// @description  Only play flv source when watching Bilibili live
// @license      MIT
// @match        *://live.bilibili.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542884/Bilibili%20Live%20Only%20FLV.user.js
// @updateURL https://update.greasyfork.org/scripts/542884/Bilibili%20Live%20Only%20FLV.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
        const response = await originalFetch(input, init);
        // 仅拦截拉流接口
        if (typeof input === 'string' && input.includes('/xlive/web-room/v2/index/getRoomPlayInfo')) {
            const clone = response.clone();
            const json = await clone.json();
            if (json && json.data && json.data.playurl_info && json.data.playurl_info.playurl) {
                // 删除 HLS 相关字段
                json.data.playurl_info.playurl.stream = json.data.playurl_info.playurl.stream.filter(item => item.protocol_name !== 'http_hls');
                const body = JSON.stringify(json);
                return new Response(body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }
        }
        return response;
    };

    // 临时存储原始值
    let _neptuneValue = undefined;

    // 在 window 上定义同名属性拦截器
    Object.defineProperty(window, '__NEPTUNE_IS_MY_WAIFU__', {
        configurable: true,
        enumerable: true,
        get() {
            return _neptuneValue;
        },
        set(val) {
            if (val?.roomInitRes?.data?.playurl_info?.playurl?.stream) {
                val.roomInitRes.data.playurl_info.playurl.stream =
                    val.roomInitRes.data.playurl_info.playurl.stream
                        .filter(p => p.protocol_name !== 'http_hls'); // 只保留 FLV 流
            }

            // 存储修改后的对象
            _neptuneValue = val;
        }
    });
})();
