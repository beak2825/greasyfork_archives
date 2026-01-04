// ==UserScript==
// @name         Apple 直播字幕簡轉繁（使用OpenCC）
// @namespace    https://github.com/kevin823lin
// @version      2024-09-09
// @description  使用 OpenCC 將 Apple 官網直播簡體字幕翻譯成繁體
// @author       kevin823lin
// @match        https://www.apple.com/apple-events/event-stream/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/cn2t.js
// @downloadURL https://update.greasyfork.org/scripts/507673/Apple%20%E7%9B%B4%E6%92%AD%E5%AD%97%E5%B9%95%E7%B0%A1%E8%BD%89%E7%B9%81%EF%BC%88%E4%BD%BF%E7%94%A8OpenCC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/507673/Apple%20%E7%9B%B4%E6%92%AD%E5%AD%97%E5%B9%95%E7%B0%A1%E8%BD%89%E7%B9%81%EF%BC%88%E4%BD%BF%E7%94%A8OpenCC%EF%BC%89.meta.js
// ==/UserScript==

/* globals OpenCC */
(function() {
    'use strict';

    // Initialize OpenCC converter
    const converter = OpenCC.Converter({ from: 'cn', to: 'twp' });

    const XHR = XMLHttpRequest.prototype;

    const send = XHR.send;

    XHR.send = function() {
        this.addEventListener("load", function() {
            const url = this.responseURL;

            // Check if the request is for a .vtt file
            if (url.endsWith(".vtt") && url.includes("zh")) {
                const arrayBuffer = this.response;

                // Convert ArrayBuffer to string
                const textDecoder = new TextDecoder("utf-8");
                let vttText = textDecoder.decode(arrayBuffer);

                // Perform conversion from Simplified to Traditional Chinese
                const convertedText = converter(vttText);

                // Convert the converted text back to ArrayBuffer
                const textEncoder = new TextEncoder();
                const convertedArrayBuffer = textEncoder.encode(convertedText).buffer;

                // Replace the response with the converted ArrayBuffer
                Object.defineProperty(this, "response", {
                    writable: true,
                    value: convertedArrayBuffer,
                });

                console.log("[vtt-converter]: Converted Simplified Chinese to Traditional Chinese successfully.");
            }
        });

        return send.apply(this, arguments);
    };
})();