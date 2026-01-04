// ==UserScript==
// @name         恢复B站直播视频码率显示
// @version      0.6
// @namespace    https://genteure.github.io/userscripts
// @description  恢复哔哩哔哩直播播放器视频统计信息里的视频码率信息显示，并添加了当前画质显示。使用方法：右键播放区域、点击 “视频统计信息”。
// @license      MIT
// @author       Genteure
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443043/%E6%81%A2%E5%A4%8DB%E7%AB%99%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E7%A0%81%E7%8E%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/443043/%E6%81%A2%E5%A4%8DB%E7%AB%99%E7%9B%B4%E6%92%AD%E8%A7%86%E9%A2%91%E7%A0%81%E7%8E%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 完整的原始信息会复制到 window.pstreaminfo 可在 console 里获取。

    function formatStreamQualityText(url) {
        const match = /\/live-bvc\/\d{6}\/live_\d+_(.+?)(?:\/index\.m3u8|\.flv)/.exec(url);
        if (!match) return "未知";
        const tail = match[1];

        if (/^\d+$/.test(tail) || (/^\d+_[\da-z]{8}$/.test(tail) && !/^\d+_[a-z]{8}$/.test(tail))) {
            return "真原画";
        }

        const suffix = tail.split('_').pop()

        return ({
            'bluray': '二压原画',
            'prohevc': 'H.265 "原画" (二压)',
            '4000': '蓝光',
            'hevc': 'H.265 蓝光',
            '2500': '超清',
            'minihevc': 'H.265 超清',
            '1500': '高清',
            'uhd': '4K',
            'maxhevc': 'H.265 4K',
            'dolbyAvc': 'H.264 杜比',
        })[suffix] ?? `未知画质 (${suffix})`
    }

    function unitTestForStreamQualityText() {
        const cases = [
            ["/live-bvc/542653/live_11073_332_c521e483/index.m3u8", "真原画"],
            ["/live-bvc/542653/live_11073_332_c521e483_1500/index.m3u8", "高清"],
            ["/live-bvc/542653/live_11073_332_c521e483_minihevc/index.m3u8", "H.265 超清"],
            ["/live-bvc/338474/live_43536_1316344_minihevc/index.m3u8", "H.265 超清"],
            ["/live-bvc/338474/live_43536_1316344_1500/index.m3u8", "高清"],
            ["/live-bvc/338474/live_43536_1316344/index.m3u8", "真原画"],
            ["/live-bvc/542653/live_11073_332_c521e483.flv", "真原画"],
            ["/live-bvc/542653/live_11073_332_c521e483_1500.flv", "高清"],
            ["/live-bvc/542653/live_11073_332_c521e483_minihevc.flv", "H.265 超清"],
            ["/live-bvc/338474/live_43536_1316344_minihevc.flv", "H.265 超清"],
            ["/live-bvc/338474/live_43536_1316344_1500.flv", "高清"],
            ["/live-bvc/338474/live_43536_1316344.flv", "真原画"],
        ];
        let success = true;
        for (const [url, expected] of cases) {
            const actual = formatStreamQualityText(url);
            if (actual !== expected) {
                success = false;
                console.error(`[直播码率信息UserScript] formatStreamQualityText(${url}) = ${actual}, expected ${expected}`);
            }
        }
        if (success) {
            console.log("[直播码率信息UserScript] formatStreamQualityText test passed");
        }
    }

    // nice test
    // window.userscript_unitTestForStreamQualityText = unitTestForStreamQualityText;

    function replaceFunction(ptype) {
        let original_updateVideoTemplate = ptype.updateVideoTemplate;

        if (!original_updateVideoTemplate) {
            console.log('[直播码率信息UserScript] 没有找到 updateVideoTemplate', window.location.href);
        } else {
            let new_updateVideoTemplate = function () {
                window.pstreaminfo = arguments[0];
                let i = arguments[0].mediaInfo;
                let result = original_updateVideoTemplate.apply(this, arguments);
                try {
                    let newText = i.width + "x" + i.height + ", " + i.fps + "FPS, " + this.computeBps(i.videoDataRate);
                    newText += ", " + formatStreamQualityText(i.videoSrc);
                    document.querySelector('#p-video-info-videoInfo > .web-player-line-data').textContent = newText;
                } catch (error) { }
                return result;
            };

            ptype.updateVideoTemplate = new_updateVideoTemplate;
            console.log('[直播码率信息UserScript] updateVideoTemplate 替换完成', window.location.href);
        }
    }

    function noUndefindErrorAllowed(obj, propertyName) {
        try {
            return obj.exports.default.prototype[propertyName]
        } catch (error) {
            return undefined;
        }
    }

    function findBase(prequire) {
        let level = 0;
        while (prequire) {
            for (const k in prequire.cache) {
                const cachedModule = prequire.cache[k];
                if (!!noUndefindErrorAllowed(cachedModule, 'updateVideoTemplate') && !!noUndefindErrorAllowed(cachedModule, 'computeBps')) {
                    console.log('[直播码率信息UserScript] 在 window.parcelRequire' + new Array(level).fill('.parent').join('') + ' 里找到了 module id: ' + k, window.location.href)
                    return cachedModule.exports.default.prototype;
                }
            }
            prequire = prequire.parent;
            level++;
        }
    }

    const ptype = findBase(window.parcelRequire);

    if (!ptype) {
        console.log('[直播码率信息UserScript] 没有找到 updateVideoTemplate 所在的 prototype', window.location.href);
    } else {
        replaceFunction(ptype);
    }

})();
