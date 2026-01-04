// ==UserScript==
// @name         哔哩哔哩直播弹幕反诈
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  发不出去弹幕时不会假装发出去（弹幕列表和播放器上不会出现没发出去的弹幕）
// @author       TGSAN
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/488621/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%8F%8D%E8%AF%88.user.js
// @updateURL https://update.greasyfork.org/scripts/488621/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%8F%8D%E8%AF%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[弹幕反诈] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[弹幕反诈] use window mode (your userscript extensions not support unsafeWindow)");
    }

    function checkSendDm(url) {
        if (url.indexOf('api.live.bilibili.com/msg/send') > -1) {
            return true;
        }
        return false;
    }

    const originFetchBLDMAF = windowCtx.fetch;
    windowCtx.fetch = (...arg) => {
        let arg0 = arg[0];
        let url = "";
        switch (typeof arg0) {
            case "object":
                url = arg0.url;
                break;
            case "string":
                url = arg0;
                break;
            default:
                break;
        }

        if (checkSendDm(url)) {
            return new Promise((resolve, reject) => {
                originFetchBLDMAF(...arg).then(r => {
                    r.json().then(data => {
                        console.log(data)
                        if (data.code === 0 && data.msg === "f") {
                            data.code = -101;
                            data.message = "没发出去，你被骗了";
                            data.ttl = 1;
                            delete data.msg;
                            delete data.data;
                        }
                        let body = JSON.stringify(data);
                        let newRes = new Response(body, {
                            status: r.status,
                            statusText: r.statusText,
                            headers: r.headers
                        })
                        resolve(newRes);
                    });
                }).catch(e => {
                    reject(e);
                });
            });
        } else {
            return originFetchBLDMAF(...arg);
        }
    };
})();