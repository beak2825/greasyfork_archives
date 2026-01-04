// ==UserScript==
// @name         cosplaytele Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a fixed download button to webpage for downloading cosplaytele post images
// @license MIT
// @author       scbmark
// @match        https://cosplaytele.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526961/cosplaytele%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/526961/cosplaytele%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 獲取當前頁面編號的函數
    function getCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || '1';
        return page;
    }

    // 下載單張圖片的函數
    function downloadImage(canvas, filename) {
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error("轉換 Canvas 失敗");
                return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, "image/png");
    }


    // 處理所有圖片的函數
    function processImages() {
        const images_list = document.getElementsByClassName("gallery-size-full")[0];
        if (!images_list) {
            alert("找不到圖片列表，請確認是否在正確的頁面。");
            return;
        }

        const images = images_list.querySelectorAll("img");
        if (images.length === 0) {
            alert("此頁面沒有找到任何圖片。");
            return;
        }

        const currentPage = getCurrentPage();

        images.forEach((img, index) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            img.crossOrigin = "anonymous";

            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                downloadImage(canvas, `image-${currentPage}-${index + 1}.png`);
            };

            if (img.complete) {
                ctx.drawImage(img, 0, 0);
                downloadImage(canvas, `image-${currentPage}-${index + 1}.png`);
            }
        });
    }


    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = '下載圖片';
    downloadButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;

    downloadButton.onmouseover = function () {
        this.style.backgroundColor = '#45a049';
    };
    downloadButton.onmouseout = function () {
        this.style.backgroundColor = '#4CAF50';
    };

    downloadButton.onclick = function () {
        console.log('開始下載圖片');
        processImages();
    };

    document.body.appendChild(downloadButton);
})();