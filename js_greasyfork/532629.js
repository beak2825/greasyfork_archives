// ==UserScript==
// @name                 Prime Video Force HD
// @name:ja              Prime Video 高画質のみ
// @name:zh-CN           Prime Video 强制高画质
// @name:zh-TW           Prime Video 強制高畫質
// @namespace            http://tampermonkey.net/
// @version              1.0.5
// @description          Force lock Prime Video's video quality to the highest
// @description:ja       Prime Videoで再生中の動画の画質を最高画質に設定する
// @description:zh-CN    强制将 Prime Video 锁定到最高画质
// @description:zh-TW    強制將 Prime Video 鎖定到最高畫質
// @author               TGSAN
// @match                *://*.primevideo.com/*
// @include              /https?:\/\/.*.?amazon\..+\/(.+\/)?gp\/video\/.*?/
// @include              /https?:\/\/.*.?amazon\..+\/(.+\/)?Amazon-Video\/.*?/
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=www.primevideo.com
// @inject-into          page
// @run-at               document-start
// @grant                unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/532629/Prime%20Video%20Force%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/532629/Prime%20Video%20Force%20HD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[Prime Video Force HD] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[Prime Video Force HD] use window mode (your userscript extensions not support unsafeWindow)");
    }

    function HookMPD(mpd) {
        const parser = new DOMParser();
        const mpdDoc = parser.parseFromString(mpd, "application/xml");
        const adaptationSets = mpdDoc.getElementsByTagName("AdaptationSet");
        for (let i = 0; i < adaptationSets.length; i++) {
            let adaptationSet = adaptationSets[i];
            let contentType = adaptationSet.getAttribute("contentType") || "";
            let representations = adaptationSet.getElementsByTagName("Representation");
            let representationsCopped = [];
            let maxBandwidth = -1;
            for (let repi = 0; repi < representations.length; repi++) {
                const curBandwidth = Number.parseFloat(representations[repi].getAttribute("bandwidth"));
                // console.log(curBandwidth);
                if (curBandwidth >= maxBandwidth) {
                    maxBandwidth = curBandwidth;
                }
                representationsCopped.push(representations[repi]);
            }
            for (let repi = 0; repi < representationsCopped.length; repi++) {
                const curBandwidth = Number.parseFloat(representationsCopped[repi].getAttribute("bandwidth"));
                if (curBandwidth != maxBandwidth) {
                    adaptationSet.removeChild(representationsCopped[repi]);
                }
            }
            if (contentType.toUpperCase() == "VIDEO") {
                console.log(contentType + " set max bitrate: " + maxBandwidth + " bps (" + adaptationSet.getAttribute("maxWidth") + "x" + adaptationSet.getAttribute("maxHeight") + ")");
            } else {
                console.log(contentType + " set max bitrate: " + maxBandwidth + " bps");
            }
        }
        const serializer = new XMLSerializer();
        const newBody = serializer.serializeToString(mpdDoc);
        let body = newBody;
        // console.log(body);
        return body;
    }

    const originXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        const xhr = this;
        let url = arguments[1];
        // console.log("XHR: " + url);
        if (url.indexOf('.mpd') > -1) {
            const responseGetter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "response", {
                get: () => {
                    let result = responseGetter.call(xhr);
                    return HookMPD(result);
                },
            });
            const responseTextGetter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "responseText"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = responseTextGetter.call(xhr);
                    return HookMPD(result);
                },
            });
        }
        return originXHROpen.apply(xhr, arguments);
    };

    const originFetchPrimeVideoFetch = windowCtx.fetch;
    windowCtx.fetch = (...arg) => {
        let url = "";
        let isRequest = false;
        switch (typeof arg[0]) {
            case "object":
                url = arg[0].url;
                isRequest = true;
                break;
            case "string":
                url = arg[0];
                break;
            default:
                break;
        }

        // console.log("FETCH: " + url);
        if (url.indexOf('.mpd') > -1) {
            return new Promise((resolve, reject) => {
                originFetchPrimeVideoFetch(...arg).then(res => {
                    res.text().then(text => {
                        let body = HookMPD(text);
                        let newRes = new Response(body, {
                            status: res.status,
                            statusText: res.statusText,
                            headers: res.headers
                        })
                        resolve(newRes);
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(err);
                });
            });
        } else {
            return originFetchPrimeVideoFetch(...arg);
        }
    }
})();