// ==UserScript==
// @name                 哔哩哔哩直播屏蔽HEVC
// @namespace            http://tampermonkey.net/
// @version              0.3
// @description          屏蔽哔哩哔哩直播的HEVC
// @author               TGSAN
// @match                https://live.bilibili.com/*
// @match                http://live.bilibili.com/*
// @inject-into          page
// @run-at               document-start
// @grant                unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/459655/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%B1%8F%E8%94%BDHEVC.user.js
// @updateURL https://update.greasyfork.org/scripts/459655/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%B1%8F%E8%94%BDHEVC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[bilibili live disable hevc] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[bilibili live disable hevc] use window mode (your userscript extensions not support unsafeWindow)");
    }

    Object.defineProperty(windowCtx, '__NEPTUNE_IS_MY_WAIFU__', {
        configurable: true,
        writable: false,
        value: {}
    });

    function beforeUrl(url) {
        if (url.indexOf("api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo") > -1) {
            url = url.replace("codec=0,1", "codec=0");
            console.debug("替换 HEVC Playurl");
        }
        return url;
    }

    function afterUrlBlock(url) {
        let allowed = true;
        return allowed;
    }

    function afterResponseHook(response, resolve, reject) {
        let url = response.url;
        // if (url.indexOf("api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo") > -1) {
        //     response.json().then(json => {
        //         let copyJson = JSON.parse(JSON.stringify(json));
        //         // Mod here
        //         let body = JSON.stringify(copyJson);
        //         console.debug(body);
        //         let newRes = new Response(body, {
        //             status: response.status,
        //             statusText: response.statusText,
        //             headers: response.headers
        //         });
        //         resolve(newRes);
        //     }).catch(err => {
        //         reject(err);
        //     });
        // } else
        {
            resolve(response);
        }
    }

    windowCtx.XMLHttpRequest.prototype.originalTargetUrlBLDFO = "";
    windowCtx.XMLHttpRequest.prototype.originalOpenBLDFO = windowCtx.XMLHttpRequest.prototype.open;
    windowCtx.XMLHttpRequest.prototype.originalSendBLDFO = windowCtx.XMLHttpRequest.prototype.send;
    windowCtx.XMLHttpRequest.prototype.open = function (...arg) {
        if (arg[1]) {
            this.originalTargetUrlBLDFO = arg[1];
            arg[1] = beforeUrl(arg[1]);
        }
        return this.originalOpenBLDFO(...arg);
    };
    windowCtx.XMLHttpRequest.prototype.send = function (...arg) {
        if (afterUrlBlock(this.originalTargetUrlBLDFO)) {
            this.originalSendBLDFO(...arg);
        } else {
            throw new DOMException("Network Error", "net::ERR_CONNECTION_RESET");
        }
    };

    const originFetchBLDFO = windowCtx.fetch;
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
            return new Promise((resolve, reject) => {
                originFetchBLDFO(...arg).then(res => {
                    afterResponseHook(res, resolve, reject);
                }).catch(err => {
                    reject(err);
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                reject(new DOMException("Network Error", "net::ERR_CONNECTION_RESET"));
            });
        }
    };
})();