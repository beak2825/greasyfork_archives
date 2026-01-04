// ==UserScript==
// @name         洋葱Key
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  配合猫抓使用
// @author       lccman
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @match        https://school.yangcongxueyuan.com/
// @icon         data:image/png;base64,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
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477667/%E6%B4%8B%E8%91%B1Key.user.js
// @updateURL https://update.greasyfork.org/scripts/477667/%E6%B4%8B%E8%91%B1Key.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ArrayBuffer 转 Base64
    function ArrayBufferToBase64(buffer) {
        let binary = "";
        let bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    // 获取并发送key给猫抓
    function getKey(url) {
        fetch(url).then(response => response.arrayBuffer())
            .then(buffer => {
            let newKey = ArrayBufferToBase64(buffer);
            console.warn(newKey);
            window.postMessage({ action: "catCatchAddKey", key: newKey,ext: "base64Key", href: location.href });
        });
    }
    ah.proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
            if (config.url.includes("getHlsEncryptKey")) {
                getKey(config.url)
            }
            handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
            console.log(err.type)
            handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            console.log(response.response)
            handler.next(response)
        }
    })
})();