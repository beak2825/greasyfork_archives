// ==UserScript==
// @name         Image Downloader and Zipper for Bing Saves
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Downloads and zips images from Bing Saves page
// @author       Bard
// @match        https://www.bing.com/saves*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license  none
// @downloadURL https://update.greasyfork.org/scripts/495910/Image%20Downloader%20and%20Zipper%20for%20Bing%20Saves.user.js
// @updateURL https://update.greasyfork.org/scripts/495910/Image%20Downloader%20and%20Zipper%20for%20Bing%20Saves.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 尋找圖片網址
    const imageElements = document.querySelectorAll('img[src^="/th?id="]');

    // 建立 Promise 陣列，用於處理圖片下載
    const imagePromises = Array.from(imageElements).map(img => {
        // 提取圖片 ID
        const imageId = img.src.match(/id=(.*?)&/)[1];

        // 建立新的圖片網址
        const newUrl = `https://th.bing.com/th/id/${imageId}`;

        // 使用 fetch 下載圖片
        return fetch(newUrl)
            .then(response => response.blob())
            .then(blob => ({ imageId, blob }));
    });

    // 等待所有圖片下載完成
    Promise.all(imagePromises)
        .then(images => {
            // 建立 zip 檔案
            const zip = new JSZip();
            images.forEach(({ imageId, blob }) => {
                zip.file(`${imageId}.jpg`, blob, { binary: true });
            });

            // 產生 zip 檔案
            return zip.generateAsync({ type: 'blob' })
                .then(content => {
                    // 使用 timestamp 建立檔案名稱
                    const timestamp = Date.now();
                    const filename = `${timestamp}.zip`;

                    // 使用 FileSaver.js 下載 zip 檔案
                    saveAs(content, filename);
                });
        });
})();
