// ==UserScript==
// @name         B站弹幕hook
// @version      0.3
// @description  1.关闭智能云屏蔽 2.关闭高赞弹幕 3.关闭大会员弹幕
// @author       DeltaFlyer
// @copyright    2024, DeltaFlyer(https://github.com/DeltaFlyerW)
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @run-at       document-start
// @grant        unsafeWindow
// @icon         https://www.biliplus.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js
// @namespace    https://greasyfork.org/users/927887
// @downloadURL https://update.greasyfork.org/scripts/510509/B%E7%AB%99%E5%BC%B9%E5%B9%95hook.user.js
// @updateURL https://update.greasyfork.org/scripts/510509/B%E7%AB%99%E5%BC%B9%E5%B9%95hook.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const originalSet = Map.prototype.set;
    let hooked = false;

    Map.prototype.set = function(key, value) {
        if (!hooked && key && key.danmakuStore && typeof key.danmakuStore.fetchDmSeg === 'function') {
            hooked = true;
            const bpx_player = key;
            window.bpx_player = bpx_player; // 可选：如果需要在控制台调试可以保留
            console.log("B站播放器实例已Hook:", bpx_player);

            const danmakuStore = bpx_player.danmakuStore;
            const originalFetchDmSeg = danmakuStore.fetchDmSeg.bind(danmakuStore);
            danmakuStore.fetchDmSeg = async function(...args) {
                try {
                    const result = await originalFetchDmSeg(...args);
                    if (result && result.details && Array.isArray(result.details.elems)) {
                        for (const danmaku of result.details.elems) {
                            danmaku.weight = 11;        // 关闭智能云屏蔽
                            danmaku.attr = 1048576;     // 关闭高赞弹幕
                            danmaku.colorful = undefined; // 关闭大会员弹幕
                        }
                        console.log("弹幕数据已处理:", result);
                    }
                    return result;
                } catch (error) {
                    console.error("Hook fetchDmSeg 发生错误:", error);
                    return originalFetchDmSeg(...args); // 发生错误时返回原始结果，避免影响功能
                }
            };
        }
        return originalSet.call(this, key, value);
    };
})();
