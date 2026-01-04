// ==UserScript==
// @name                 哔哩哔哩直播默认原画
// @namespace            http://tampermonkey.net/
// @version              0.2
// @description          修改哔哩哔哩直播默认画质为原画
// @author               TGSAN
// @match                https://live.bilibili.com/*
// @match                http://live.bilibili.com/*
// @inject-into          page
// @run-at               document-start
// @grant                unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/459720/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E5%8E%9F%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/459720/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E5%8E%9F%E7%94%BB.meta.js
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

    Object.defineProperty(windowCtx, '__NEPTUNE_IS_MY_WAIFU__', {
        configurable: true,
        writable: false,
        value: {}
    });

    function beforeUrl(url) {
        if (url.indexOf("api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo") > -1) {
            url = url.replace("qn=0", "qn=10000");
            console.debug("替换默认画质");
        }
        return url;
    }

    function afterUrlBlock(url) {
        let allowed = true;
        return allowed;
    }

    windowCtx.XMLHttpRequest.prototype.originalTargetUrlBLDQ = "";
    windowCtx.XMLHttpRequest.prototype.originalOpenBLDQ = windowCtx.XMLHttpRequest.prototype.open;
    windowCtx.XMLHttpRequest.prototype.originalSendBLDQ = windowCtx.XMLHttpRequest.prototype.send;
    windowCtx.XMLHttpRequest.prototype.open = function (...arg) {
        if (arg[1]) {
            this.originalTargetUrlBLDQ = arg[1];
            arg[1] = beforeUrl(arg[1]);
        }
        return this.originalOpenBLDQ(...arg);
    };
    windowCtx.XMLHttpRequest.prototype.send = function (...arg) {
        if (afterUrlBlock(this.originalTargetUrlBLDQ)) {
            this.originalSendBLDQ(...arg);
        } else {
            throw new DOMException("Network Error", "net::ERR_CONNECTION_RESET");
        }
    };

    const originFetchBLDQ = windowCtx.fetch;
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
            return originFetchBLDQ(...arg);
        } else {
            return new Promise((resolve, reject) => {
                reject(new DOMException("Network Error", "net::ERR_CONNECTION_RESET"));
            });
        }
    };
})();