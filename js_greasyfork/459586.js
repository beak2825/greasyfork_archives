// ==UserScript==
// @name                 哔哩哔哩直播隐身进房
// @namespace            http://tampermonkey.net/
// @version              0.2
// @description          哔哩哔哩直播进房不弹进房提示
// @author               TGSAN
// @match                https://live.bilibili.com/*
// @match                http://live.bilibili.com/*
// @inject-into          page
// @run-at               document-start
// @grant                unsafeWindow
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_registerMenuCommand
// @grant                GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/459586/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%9A%90%E8%BA%AB%E8%BF%9B%E6%88%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/459586/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%9A%90%E8%BA%AB%E8%BF%9B%E6%88%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[bilibili live hide] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[bilibili live hide] use window mode (your userscript extensions not support unsafeWindow)");
    }

    // Your code here...

    const EnableEnterTip = true;
    const EnableHeartbeat = false;

    function beforeUrl(url) {
        if (url.indexOf("//api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser") > -1 && EnableEnterTip) {
            url = url.replace("not_mock_enter_effect=0", "not_mock_enter_effect=1");
            console.debug("屏蔽进房广播");
        }
        return url;
    }

    function afterUrlBlock(url) {
        let allowed = true;
        if (url.indexOf("//live-trace.bilibili.com/xlive/data-interface/v1/x25Kn") > -1 && EnableHeartbeat) {
            allowed = false;
            console.debug("屏蔽心跳广播");
        }
        return allowed;
    }

    windowCtx.XMLHttpRequest.prototype.originalTargetUrlBLH = "";
    windowCtx.XMLHttpRequest.prototype.originalOpenBLH = windowCtx.XMLHttpRequest.prototype.open;
    windowCtx.XMLHttpRequest.prototype.originalSendBLH = windowCtx.XMLHttpRequest.prototype.send;
    windowCtx.XMLHttpRequest.prototype.open = function (...arg) {
        if (arg[1]) {
            this.originalTargetUrlBLH = arg[1];
            arg[1] = beforeUrl(arg[1]);
        }
        return this.originalOpenBLH(...arg);
    };
    windowCtx.XMLHttpRequest.prototype.send = function (...arg) {
        if (afterUrlBlock(this.originalTargetUrlBLH)) {
            this.originalSendBLH(...arg);
        } else {
            throw new DOMException("Network Error", "net::ERR_CONNECTION_RESET");
        }
    };

    const originFetchBLH = windowCtx.fetch;
    windowCtx.fetch = (...arg) => {
        let arg0 = arg[0];
        let url = "";
        let isRequest = false;
        switch (typeof arg0) {
            case "object":
                url = arg0.url;
                isRequest = true;
                break;
            case "string":
                url = arg0;
                break;
            default:
                break;
        }

        let newUrl = beforeUrl(url);
        if (isRequest) {
            arg[0].url = newUrl;
        } else {
            arg[0] = newUrl;
        }

        if (afterUrlBlock(url)) {
            return originFetchBLH(...arg);
        } else {
            return new Promise((resolve, reject) => {
                reject(new DOMException("Network Error", "net::ERR_CONNECTION_RESET"));
            });
        }
    };
})();