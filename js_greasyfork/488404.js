// ==UserScript==
// @name         小红书无水印解析下载提取
// @version      1.4
// @description  小红书高清无水印图片解析提取下载，如出错请及时更新，首次使用请在跳转的页面点击"Always allow domain"
// @author       zstatic
// @icon         https://s4.zstatic.net/images/2024/02/27-dee8a1b54cbf770ab8a3d0d8ed96931a.ico
// @match        https://www.xiaohongshu.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace https://greasyfork.org/users/1258677
// @downloadURL https://update.greasyfork.org/scripts/488404/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/488404/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractHash(content) {
        var startIndex = content.lastIndexOf("/") + 1;
        var endIndex = content.indexOf("!");
        return content.substring(startIndex, endIndex);
    }

    function downloadImage(hash) {
        var imageUrl = "https://i2.zstatic.net/" + hash + "?imageView2/2/w/format/png";
        GM_xmlhttpRequest({
            method: "GET",
            url: imageUrl,
            responseType: "blob",
            onload: function(response) {
                var blob = response.response;
                var a = document.createElement("a");
                var url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = "image.png";
                a.click();
                window.URL.revokeObjectURL(url);
            }
        });
    }

    function extractAndDownloadImages() {
        var metaTags = document.querySelectorAll('meta[name="og:image"]');
        if (metaTags.length > 0) {
            var downloadedHashes = [];
            metaTags.forEach(function(metaTag) {
                var content = metaTag.content;
                var hash = extractHash(content);
                if (!downloadedHashes.includes(hash)) {
                    downloadImage(hash);
                    downloadedHashes.push(hash);
                }
            });
        }
    }

    window.addEventListener("load", function() {
        extractAndDownloadImages();
    });
})();