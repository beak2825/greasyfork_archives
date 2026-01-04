// ==UserScript==
// @name         Delete BiliBili Minecraft live mask
// @namespace    https://yc.minecraftisbest.top/
// @version      1.0
// @description  remove mask for live.bilibili.com
// @author       Baymaxawa
// @match        https://live.bilibili.com/*
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503537/Delete%20BiliBili%20Minecraft%20live%20mask.user.js
// @updateURL https://update.greasyfork.org/scripts/503537/Delete%20BiliBili%20Minecraft%20live%20mask.meta.js
// ==/UserScript==

// 去掉叔叔去世时的全站黑白效果
GM_addStyle("html, body { -webkit-filter: none !important; filter: none !important; }");

// 没用的 URL 参数
const uselessUrlParams = [
    'buvid',
    'is_story_h5',
    'launch_id',
    'live_from',
    'mid',
    'session_id',
    'timestamp',
    'up_id',
    'vd_source',
    /^share/,
    /^spm/,
];

// 真·原画直播+删除我的世界分区打码
if (location.href.startsWith('https://live.bilibili.com/')) {
    unsafeWindow.forceHighestQuality = true;
    let recentErrors = 0;
    setInterval(() => recentErrors > 0 ? recentErrors / 2 : null, 10000);

    const oldFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (url) {
        try {
            const mcdnRegexp = /[xy0-9]+\.mcdn\.bilivideo\.cn:\d+/
            const qualityRegexp = /(live-bvc\/\d+\/live_\d+_\d+)_\w+/;
            if (mcdnRegexp.test(arguments[0]) && unsafeWindow.disableMcdn) {
                return Promise.reject();
            }
            if (document.getElementById("web-player-module-area-mask-panel") != null) {
                var mask = document.getElementById("web-player-module-area-mask-panel");
                mask.remove();
            }
            if (qualityRegexp.test(arguments[0]) && unsafeWindow.forceHighestQuality) {
                arguments[0] = arguments[0]
                    .replace(qualityRegexp, '$1')
                    .replace(/(\d+)_(mini|pro)hevc/g, '$1');
            }
            const promise = oldFetch.apply(this, arguments);
            promise.then(response => {
                if (!url.match(/\.(m3u8|m4s)/)) return;
                if ([403, 404].includes(response.status)) recentErrors++;
                if (recentErrors >= 5 && unsafeWindow.forceHighestQuality) {
                    recentErrors = 0;
                    unsafeWindow.forceHighestQuality = false;
                    GM_notification({ title: '最高清晰度可能不可用', text: '已为您自动切换至播放器上选择的清晰度.', timeout: 3000, silent: true });
                }
            });
            return promise;
        } catch (e) { }
        return oldFetch.apply(this, arguments);
    }
}