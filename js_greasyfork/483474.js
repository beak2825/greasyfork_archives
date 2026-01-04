// ==UserScript==
// @name         爱发电自动下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically download content from afdian
// @author       NBXX
// @match        https://afdian.net/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483474/%E7%88%B1%E5%8F%91%E7%94%B5%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/483474/%E7%88%B1%E5%8F%91%E7%94%B5%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let floatButton = document.createElement("button");
    floatButton.textContent = "自动滚动";
    floatButton.style.position = "fixed";
    floatButton.style.bottom = "20px";
    floatButton.style.right = "20px";
    floatButton.style.zIndex = "9999";
    floatButton.style.padding = "10px 20px";
    floatButton.style.fontSize = "1rem";
    floatButton.style.color = "#fff";
    floatButton.style.background = "#007bff";
    floatButton.style.border = "none";
    floatButton.style.borderRadius = "5px";
    floatButton.style.cursor = "pointer";

    document.body.appendChild(floatButton);

    let autoScrolling = false;
    let lastXHRTime = Date.now();

    floatButton.addEventListener('click', function() {
        if (!autoScrolling) {

            this.textContent = "停止滚动";
            autoScrolling = true;
            autoScroll();
        } else {
            this.textContent = "自动滚动";
            autoScrolling = false;
        }
    });

    function autoScroll() {
        if (autoScrolling) {
            window.scrollTo(0, document.body.scrollHeight);

            // 检查是否有新的XHR请求
            if (Date.now() - lastXHRTime < 3000) { // 3秒内没有新的XHR请求
                setTimeout(autoScroll, 1000); // 
            } else {
                floatButton.textContent = "自动滚动";
                autoScrolling = false;
            }
        }
    }

    // 监听XHR请求并处理数据
    function detectXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function() {
                if (this.responseURL.includes("https://afdian.net/api/post/get-list?")) {
                    lastXHRTime = Date.now();
                    try {
                        const responseData = JSON.parse(this.responseText);
                        handleResponseData(responseData);
                    } catch (e) {
                        console.error("Error parsing response data: ", e);
                    }
                }
            });
            originalOpen.apply(this, arguments);
        };
    }

    function handleResponseData(data) {
        const list = data["data"]["list"];
        list.forEach((item) => {
            if (item["has_right_errMsg"] == null) {
                const postId = item["post_id"];
                const title = item["title"];
                const cate = item["cate"];
                console.log(`Downloading: ${postId}, ${title}`);
                if (cate === "audio") {
                    downloadContent(item["audio"], `${title}.mp3`);
                } else if (cate === "pic") {
                    const pics = item["pics"];
                    pics.forEach((picUrl, index) => {
                        downloadContent(picUrl, `${postId}_${index + 1}.jpg`);
                    });
                }
            }
        });
    }

    function downloadContent(url, filename) {
        GM_download(url, filename);
    }
    // 初始化XHR监听
    detectXHR();
})();
