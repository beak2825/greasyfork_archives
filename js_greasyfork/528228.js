// ==UserScript==
// @name         Yuntech Extract PDF URL
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extract and log the actual PDF download URL from eClass Yuntech, and add a download button
// @author       Chat-GPT
// @icon         https://eclass.yuntech.edu.tw/static/assets/images/favicon-b420ac72.ico
// @match        https://eclass.yuntech.edu.tw/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528228/Yuntech%20Extract%20PDF%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/528228/Yuntech%20Extract%20PDF%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    function extractPDFUrl() {
        try {
            // 取得當前頁面的 URL
            const viewerUrl = window.location.href;
            const urlParams = new URL(viewerUrl).searchParams;
            const encodedPdfUrl = urlParams.get("file");

            if (encodedPdfUrl) {
                // 解碼 URL 並輸出
                const pdfUrl = decodeURIComponent(encodedPdfUrl);
                console.log("PDF 下載網址:", pdfUrl);
                addDownloadButton(pdfUrl);
            } else {
                console.log("無法找到 PDF 下載網址");
            }
        } catch (error) {
            console.error("發生錯誤:", error);
        }
    }

    function addDownloadButton(pdfUrl) {
        const button = document.createElement("a");
        button.href = pdfUrl;
        button.textContent = '📥 下載 PDF';
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "80px";
        button.style.background = "#28a745";
        button.style.color = "white";
        button.style.padding = "12px 16px";
        button.style.borderRadius = "8px";
        button.style.fontSize = "16px";
        button.style.fontWeight = "bold";
        button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        button.style.transition = "all 0.3s ease";
        button.style.zIndex = "1000";
        button.style.cursor = "pointer";
        button.style.textDecoration = "none";
 // 滑鼠懸停特效
        button.onmouseover = function() {
            button.style.background = "#218838";
            button.style.transform = "scale(1.1)";
        };

        button.onmouseout = function() {
            button.style.background = "#28a745";
            button.style.transform = "scale(1)";
        };
        document.body.appendChild(button);
    }

    // 延遲執行，確保 DOM 內容加載完成
    setTimeout(extractPDFUrl, 2000);
})();
