// ==UserScript==
// @name         B站登录窗口屏蔽
// @namespace    https://greasyfork.org/users/101223
// @version      0.3
// @description  未登录时防止登录弹窗中断视频播放
// @author       Splash
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      GPLv3.0-or-later
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/463926/B%E7%AB%99%E7%99%BB%E5%BD%95%E7%AA%97%E5%8F%A3%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/463926/B%E7%AB%99%E7%99%BB%E5%BD%95%E7%AA%97%E5%8F%A3%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    ['loginEveryPlayInternvalSecond', 'loginWechatCountingSecond', 'loginBackBlockAbTestCountingSecond', 'loginBackBlockCountingSecond', 'loginCountingSecond'].forEach(key => {
        Object.defineProperty(unsafeWindow.__INITIAL_STATE__.constants, key, {
            get: function (key, value) {
                return Infinity;
            }
        });
    });
    ['loginDialogCountTimes', 'loginDialogCountDuration'].forEach(key => {
        Object.defineProperty(unsafeWindow.__INITIAL_STATE__.constants, key, {
            get: function (key, value) {
                return 0;
            }
        });
    });
    //    ['__BiliUser__', 'cache', 'data', ].reduce(function (obj, key) {
    //        return obj[key] ??= {};
    //    }, unsafeWindow);
    (function timer() {
        if (!unsafeWindow?.__BiliUser__?.cache?.data?.isLogin) {
            try {
                Object.defineProperty(unsafeWindow.__BiliUser__.cache.data, 'isLogin', {
                    get: () => true
                });
            } finally {
                setTimeout(timer, 1000);
            }
        }
    })();
})();