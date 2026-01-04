// ==UserScript==
// @name         Koyso遊戲下載頁面按鈕修復器
// @name:en      Game Download Page Button Fixer
// @name:zh-CN   Koyso游戏下载页面按钮修复器
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  修復Koyso.to因廣告阻擋導致下載按鈕失效的問題，並繞過彈窗廣告，實現直接下載。
// @description:en  Fixes the issue where the download button on koyso.to fails due to ad blockers, and bypasses pop-up ads for a direct download experience.
// @description:zh-CN  修复Koyso.to因广告阻挡导致下载按钮失效的问题，并绕过弹窗广告，实现直接下载。
// @author       Mark
// @license      MIT
// @match        *://*.koyso.to/download/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546083/Koyso%E9%81%8A%E6%88%B2%E4%B8%8B%E8%BC%89%E9%A0%81%E9%9D%A2%E6%8C%89%E9%88%95%E4%BF%AE%E5%BE%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546083/Koyso%E9%81%8A%E6%88%B2%E4%B8%8B%E8%BC%89%E9%A0%81%E9%9D%A2%E6%8C%89%E9%88%95%E4%BF%AE%E5%BE%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pageLanguage = document.documentElement.lang === 'zh-CN' ? 'schinese' : 'english';
    const downloadButton = document.querySelector('button.button');

    if (downloadButton) {
        downloadButton.setAttribute('onclick', '');
        downloadButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            console.log('Script triggered: Starting clean download process...');

            if (window.innerWidth < 768) {
                alert("Please use your PC to download");
                return;
            }

            downloadButton.style.pointerEvents = "none";
            downloadButton.getElementsByTagName("span")[0].innerHTML = "wait seconds...";

            const secretKey = "f6i6@m29r3fwi^yqd";
            const hrefParts = window.location.href.split("/");
            let gameId = hrefParts[hrefParts.length - 1];
            if (gameId.includes("?")) {
                gameId = gameId.split("?")[0];
            }
            const timestamp = Math.floor(Date.now() / 1000).toString();

            generateHash(timestamp, gameId, secretKey).then(function(hash) {
                getDownloadUrl(gameId, timestamp, hash);
            });

        }, true);
    }

    async function generateHash(timestamp, gameId, secretKey) {
        const message = timestamp + gameId + secretKey;
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        return toHexString(hashBuffer);
    }

    function toHexString(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    function getCanvasFingerprint() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.textBaseline = "top";
        ctx.font = "16px Arial";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("Fingerprinting!", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Fingerprinting!", 4, 17);
        const dataUrl = canvas.toDataURL();

        const cpuCores = navigator.hardwareConcurrency || null;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const combinedString = dataUrl + cpuCores + screenWidth + screenHeight;

        let hash = 0;
        for (let i = 0; i < combinedString.length; i++) {
            const charCode = combinedString.charCodeAt(i);
            hash = (hash << 5) - hash + charCode;
            hash |= 0;
        }
        return hash >>> 0;
    }

    function downloadLimit(gameId, downloadUrl) {
        const suggestionDiv = document.querySelector(".download_suggestion");
        document.querySelector(".download_div").style.display = "none";

        if (pageLanguage === 'schinese') {
            suggestionDiv.innerHTML = `
                <p>每5分钟只能下载一次</p>
                <p>你上一次下载的游戏为 <a id="gameId" style="text-decoration: underline">${gameId}</a>,下载链接在<a id="downloadLink" target="_blank" style="text-decoration: underline">这里</a></p>
            `;
        } else {
            suggestionDiv.innerHTML = `
                <p>You can only download once every 5 minutes.</p>
                <p>The last game you downloaded is <a id="gameId" style="text-decoration: underline">${gameId}</a>,The direct link is <a id="downloadLink" target="_blank" style="text-decoration: underline">right here</a></p>
            `;
        }

        document.getElementById("gameId").href = "/game/" + gameId;
        document.getElementById("downloadLink").href = downloadUrl;
        suggestionDiv.style.display = "block";
    }

    function getDownloadUrl(gameId, timestamp, hash) {
        const formData = new URLSearchParams();
        formData.append('id', gameId);
        formData.append('timestamp', timestamp);
        formData.append('secretKey', hash);
        formData.append('canvasId', getCanvasFingerprint());

        fetch("/api/getGamesDownloadUrl", {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        })
        .then(response => {
            if (response.ok) return response.text();
            if (response.status === 403) {
                alert("System time is incorrect, correct the system time and try again");
                throw new Error('403 Forbidden');
            }
            if (response.status === 429) {
                return response.json().then(errorData => {
                    downloadLimit(errorData.gameId, errorData.downloadUrl);
                    throw new Error('429 Too Many Requests');
                });
            }
            throw new Error(`Server error: ${response.status}`);
        })
        .then(downloadUrlWithQuotes => {
            const cleanedUrl = downloadUrlWithQuotes.replace(/^"|"$/g, '');

            console.log('Successfully retrieved download link (cleaned):', cleanedUrl);
            window.open(cleanedUrl, "_blank");
            document.querySelector(".download_div").style.display = "none";
            document.querySelector(".download_suggestion").style.display = "block";
        })
        .catch(error => {
            console.error('Failed to get download link:', error.message);
            if (!error.message.includes('403') && !error.message.includes('429')) {
                alert("An error occurred, please try again later");
                if (downloadButton) {
                    downloadButton.style.pointerEvents = "auto";
                    downloadButton.getElementsByTagName("span")[0].innerHTML = "Download";
                }
            }
        });
    }
})();
