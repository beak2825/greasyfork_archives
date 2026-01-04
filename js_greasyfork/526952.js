// ==UserScript==
// @name         監控 5278.com M3U8
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  監控 .m3u8 請求，並根據 URL 中的 mp4 名稱生成 FFmpeg 下載指令
// @license MIT
// @author       scbmark
// @icon         https://5278.cc/favicon.ico?v=2
// @match        https://player.hboav.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/526952/%E7%9B%A3%E6%8E%A7%205278com%20M3U8.user.js
// @updateURL https://update.greasyfork.org/scripts/526952/%E7%9B%A3%E6%8E%A7%205278com%20M3U8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let m3u8Links = new Map(); // 用 Map 存網址對應的 mp4 名稱

    function extractMp4Name(url) {
        let match = url.match(/\/([^\/]+)\.mp4\/index\.m3u8/);
        return match ? match[1] + ".mp4" : null;
    }

    function captureM3U8(url) {
        if (url.includes(".m3u8")) {
            let filename = extractMp4Name(url) || `video_${m3u8Links.size + 1}.mp4`;
            m3u8Links.set(url, filename);
            console.log("捕獲 m3u8 連結:", url, "檔名:", filename);
        }
    }

    // Hook XHR
    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url) {
            captureM3U8(url);
            return open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    // Hook Fetch API
    (function (fetch) {
        window.fetch = function () {
            let response = fetch.apply(this, arguments);
            response.then(res => captureM3U8(res.url));
            return response;
        };
    })(window.fetch);

    // 生成 FFmpeg 下載命令
    function generateFFmpegCommands() {
        if (m3u8Links.size === 0) {
            alert("未捕獲到 .m3u8 連結，請刷新頁面或播放影片！");
            return;
        }
        let commands = [...m3u8Links.entries()]
            .map(([url, filename]) => `ffmpeg -hide_banner -i "${url}" -c copy "${filename}"`)
            .join("\n");

        GM_setClipboard(commands);
        alert("已複製 ffmpeg 指令到剪貼簿！\n\n" + commands);
    }

    // 建立固定按鈕
    function createButton() {
        let btn = document.createElement("button");
        btn.innerText = "獲取 M3U8";
        btn.style.position = "fixed";
        btn.style.top = "10px";
        btn.style.right = "10px";
        btn.style.zIndex = "9999";
        btn.style.padding = "10px";
        btn.style.background = "red";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.borderRadius = "5px";
        btn.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
        btn.onclick = generateFFmpegCommands;
        document.body.appendChild(btn);
    }

    window.onload = createButton;
})();
