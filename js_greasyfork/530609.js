// ==UserScript==
// @name         Rule34 Video Downloader (Aria2)
// @namespace    http://tampermonkey.net/
// @version      2024-02-07.3
// @description  Send the url of videos on Rule34.xxx to your Aria2 downloader. 直接将 Rule34 视频推送到 Aria2 下载
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530609/Rule34%20Video%20Downloader%20%28Aria2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530609/Rule34%20Video%20Downloader%20%28Aria2%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ARIA2_RPC_URL = "http://127.0.0.1:16800/jsonrpc"; // 本地 Aria2 端口 16800
    const ARIA2_RPC_TOKEN = "your_token"; // Aria2 的 rpc-secret，若无则留空

    var video = document.getElementById('gelcomVideoPlayer');
    if (!video) return;

    video.parentElement.style.position = 'relative';

    var downloadButton = document.createElement('a');
    downloadButton.innerHTML = '发送到 Aria2';
    downloadButton.style.position = 'absolute';
    downloadButton.style.right = '10px';
    downloadButton.style.top = '10px';
    downloadButton.style.padding = '5px';
    downloadButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
    downloadButton.style.color = 'white';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.userSelect = 'none';
    video.parentElement.appendChild(downloadButton);

    downloadButton.onclick = function () {
        const videolink = video.src || (video.querySelector('source')?.src);
        if (!videolink) return console.error("未找到视频链接");

        // 发送 Aria2 JSON-RPC 请求
        GM_xmlhttpRequest({
            method: "POST",
            url: ARIA2_RPC_URL,
            data: JSON.stringify({
                jsonrpc: "2.0",
                method: "aria2.addUri",
                id: new Date().getTime(),
                params: ARIA2_RPC_TOKEN ? [`token:${ARIA2_RPC_TOKEN}`, [videolink]] : [[videolink]]
            }),
            headers: { "Content-Type": "application/json" },
        });
    };
})();
