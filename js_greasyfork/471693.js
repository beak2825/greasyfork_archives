// ==UserScript==
// @name         User Agent Switcher
// @namespace   http://tampermonkey.net/
// @version       0.1
// @description   Changes the user agent
// @author        You
// @match        *://wechat.junruizx.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/471693/User%20Agent%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/471693/User%20Agent%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(navigator, 'userAgent', {
        get: function () { return 'Mozilla/5.0 (Linux; Android 14; NMSL Build/NMSL.114514.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/4433 MMWEBSDK/20230504 Mobile Safari/537.36 MMWEBID/6070 MicroMessenger/8.0.37.2366(0x28002546) WeChat/arm64 Weixin GPVersion/1 NetType/5G Language/zh_CN ABI/arm64'; }
    });
})();