// ==UserScript==
// @name         一键下载youtube 1080P高清视频
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在YouTube页面添加下载按钮，点击后跳转到youtubepp.com
// @author       Cantan Tam
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478582/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BDyoutube%201080P%E9%AB%98%E6%B8%85%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/478582/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BDyoutube%201080P%E9%AB%98%E6%B8%85%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .download-button {
            display: inline-block;
            margin: 4px 6px;
            padding: 12px 16px;
            border-radius: 20px;
            background-color: #f2f2f2ff;
            color: #000;
            font-size: 14px;
            line-height: 1;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .download-button:hover {
            background-color: #ffb380ff;
        }
    `);

    function createDownloadButton() {
        var subscribeButton = document.querySelector("#subscribe-button"),
            downloadButton = document.createElement("a");

        downloadButton.innerHTML = "Download";
        downloadButton.classList.add("yt-uix-button", "yt-uix-button-subscribe-branded", "yt-uix-button-size-default", "download-button");

        downloadButton.addEventListener("click", function() {
            var currentUrl = window.location.href,
                newUrl = currentUrl.replace("www.youtube.com/watch?v=", "tomp3.cc/youtube-downloader/");

            window.open(newUrl, "_blank");
        });

        if (subscribeButton) {
            subscribeButton.parentNode.insertBefore(downloadButton, subscribeButton.nextSibling);
        }
    }

    // 等待页面加载完成后创建下载按钮
    window.addEventListener("load", createDownloadButton);
})();
