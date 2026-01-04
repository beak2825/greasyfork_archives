// ==UserScript==
// @name         某鹅通 通用m3u8获取 (适用于一级 _0.ts 改 .m3u8)
// @version      0.3.2
// @description  获取某鹅通m3u8内容 重新拼装真实ts地址和解密真实密钥 发送给扩展 (一级 _0.ts 改 .m3u8)
// @author       mz
// @match        https://*/*
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license      GPL v3
// @namespace https://94cat.com/
// @downloadURL https://update.greasyfork.org/scripts/468960/%E6%9F%90%E9%B9%85%E9%80%9A%20%E9%80%9A%E7%94%A8m3u8%E8%8E%B7%E5%8F%96%20%28%E9%80%82%E7%94%A8%E4%BA%8E%E4%B8%80%E7%BA%A7%20_0ts%20%E6%94%B9%20m3u8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468960/%E6%9F%90%E9%B9%85%E9%80%9A%20%E9%80%9A%E7%94%A8m3u8%E8%8E%B7%E5%8F%96%20%28%E9%80%82%E7%94%A8%E4%BA%8E%E4%B8%80%E7%BA%A7%20_0ts%20%E6%94%B9%20m3u8%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const _JSONparse = JSON.parse;
    JSON.parse = function () {
        let data = _JSONparse.apply(this, arguments);
        findMedia(data);
        return data;
    }
    JSON.parse.toString = function () {
        return _JSONparse.toString();
    }
    async function findMedia(data, raw = undefined, depth = 0) {
        for (let key in data) {
            if (typeof data[key] == "object") {
                if (depth > 25) { continue; }
                if (!raw) { raw = data; }
                findMedia(data[key], raw, ++depth);
                continue;
            }
            if (typeof data[key] == "string" && key == "video_urls" && data[key].slice(-4) == "__ba") {
                let base64 = data[key].replace("__ba", "");
                base64 = base64.replaceAll("@", "1").replaceAll("#", "2").replaceAll("$", "3").replaceAll("%", "4");
                let json = _JSONparse(atob(base64));
                if (!json) { return }
                for (let obj of json) {
                    console.log("xet: obj.url=" + obj.url);
                    fetch(obj.url).then(response => response.text())
                        .then(m3u8 => {
                            const lines = m3u8.split('\n');
                            let keyFlag = false;
                            let coreLine = ""
                            let contentLineCount = 0
                            for (let i = 0; i < lines.length; i++) {
                                if (!keyFlag && lines[i].includes("#EXT-X-KEY:METHOD=AES-128,URI=")) {
                                    const match = lines[i].match(/URI="([^"]*)"/);
                                    if (match && match[1]) {
                                        keyFlag = true;
                                        if (window.__user_id) {
                                            getKey(match[1] + "&uid=" + window.__user_id, window.__user_id);
                                        } else if (document.cookie) {
                                            for (let cookie of document.cookie.split(';')) {
                                                cookie = cookie.trim();
                                                if (cookie.substring(0, 10) == "userInfo={") {
                                                    cookie = cookie.slice(9);
                                                    cookie = isJSON(cookie);
                                                    cookie && cookie.user_id && getKey(match[1] + "&uid=" + cookie.user_id, cookie.user_id);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    continue;
                                }
                                if (lines[i][0] != "#") {
                                    contentLineCount++
                                    if (lines[i].includes("start=0&") || (lines[i].includes("_0.ts") && contentLineCount == 1)) {
                                        coreLine = `${obj.ext.host}/${obj.ext.path}/${lines[i].replace("_0.ts", ".m3u8")}&${obj.ext.param}`;
                                        break;
                                    }
                                }
                            }
                            console.log("xet: coreLine=" + coreLine);
                            // = coreLine;
                            //let url = URL.createObjectURL(new Blob([new TextEncoder("utf-8").encode(m3u8)]));
                            window.postMessage({ action: "catCatchAddMedia", url: coreLine, href: location.href, ext: "m3u8" });
                        });
                }
            }
        }
    }
    function uid2byte(uid) {
        const byteArray = new Array;
        for (let i = 0; i < uid.length; i++) {
            let temp = uid.charCodeAt(i);
            if (temp >= 65536 && temp <= 1114111) {
                byteArray.push(temp >> 18 & 7 | 240);
                byteArray.push(temp >> 12 & 63 | 128);
                byteArray.push(temp >> 6 & 63 | 128);
                byteArray.push(63 & temp | 128);
            } else if (temp >= 2048 && temp <= 65535) {
                byteArray.push(temp >> 12 & 15 | 224);
                byteArray.push(temp >> 6 & 63 | 128);
                byteArray.push(63 & temp | 128);
            } else if (temp >= 128 && temp <= 2047) {
                byteArray.push(temp >> 6 & 31 | 192);
                byteArray.push(63 & temp | 128);
            } else {
                byteArray.push(255 & temp);
            }
        }
        return byteArray;
    }
    function getKey(url, userId) {
        fetch(url).then(response => response.arrayBuffer())
            .then(buffer => {
                let newKey = [];
                buffer = new Uint8Array(buffer);
                const uidByte = uid2byte(userId);
                for (let i in buffer) {
                    newKey.push(buffer[i] ^ uidByte[i]);
                }
                console.log(newKey);
                window.postMessage({ action: "catCatchAddKey", key: newKey, href: location.href });
            });
    }

    const _xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", function (event) {
            const isJson = isJSON(this.response);
            isJson && findMedia(isJson);
        });
        _xhrOpen.apply(this, arguments);
    }
    XMLHttpRequest.prototype.open.toString = function () {
        return _xhrOpen.toString();
    }
    function isJSON(str) {
        if (typeof str == "object") {
            return str;
        }
        if (typeof str == "string") {
            try {
                return _JSONparse(str);
            } catch (e) { return false; }
        }
        return false;
    }
})();