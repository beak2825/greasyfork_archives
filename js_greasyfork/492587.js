// ==UserScript==
// @name                 AbemaTV Force HD
// @name:ja              AbemaTV 高画質のみ
// @name:zh-CN           AbemaTV 强制高画质
// @name:zh-TW           AbemaTV 強制高畫質
// @namespace            http://tampermonkey.net/
// @version              1.1.0
// @description          Force lock AbemaTV's video quality to the highest
// @description:ja       AbemaTVで再生中の動画の画質を最高画質に設定する
// @description:zh-CN    强制将AbemaTV锁定到最高画质
// @description:zh-TW    強制將AbemaTV鎖定到最高畫質
// @author               TGSAN
// @match                https://abema.tv/*
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=abema.tv
// @inject-into          page
// @run-at               document-start
// @grant                unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/492587/AbemaTV%20Force%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/492587/AbemaTV%20Force%20HD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[AbemaTV Force HD] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[AbemaTV Force HD] use window mode (your userscript extensions not support unsafeWindow)");
    }

    function ModDash(body) {
        try {
            const parser = new DOMParser();
            const mpdDoc = parser.parseFromString(body, "application/xml");
            const adaptationSets = mpdDoc.getElementsByTagName("AdaptationSet");
            for (let i = 0; i < adaptationSets.length; i++) {
                let adaptationSet = adaptationSets[i];
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
                console.log("set max bitrate: " + maxBandwidth);
            }
            const serializer = new XMLSerializer();
            const newBody = serializer.serializeToString(mpdDoc);
            return newBody;
        } catch {
            console.warn("Dash mod failed for", body);
            return body;
        }
    }

    const originXhrOpenAbemaTVDash = windowCtx.XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        const xhr = this;
        const url = arguments[1];
        if (url.indexOf('.mpd') > -1) {
            const responseGetter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "response", {
                get: () => {
                    let result = responseGetter.call(xhr);
                    return ModDash(result);
                },
            });
            const responseTextGetter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "responseText"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = responseTextGetter.call(xhr);
                    return ModDash(result);
                },
            });
        }
        return originXhrOpenAbemaTVDash.apply(xhr, arguments);
    };

    const originFetchAbemaTVDash = windowCtx.fetch;
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

        if (url.indexOf('.mpd') > -1) {
            return new Promise((resolve, reject) => {
                originFetchAbemaTVDash(...arg).then(res => {
                    res.text().then(text => {
                        let newRes = new Response(ModDash(text), {
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
            if (url.indexOf('playlist.m3u8') > -1) {
                const regex = /\/\d+\/playlist\.m3u8/
                if (typeof url === 'string' && url.match(regex)) {
                    url = url.replace(regex, '/2160/playlist.m3u8');
                    if (isRequest) {
                        arg[0].url = url;
                    } else {
                        arg[0] = url;
                    }
                }
            }
            return originFetchAbemaTVDash(...arg);
        }
    }
})();