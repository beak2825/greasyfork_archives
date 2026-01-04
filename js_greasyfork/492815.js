// ==UserScript==
// @name         微信公众号文章封面下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  微信公众号文章封面下载。
// @author       laisheng
// @match        https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492815/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/492815/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var metaContentElement = document.getElementById('meta_content_hide_info');
    var newTag = document.createElement('span');
    newTag.style.position = 'initial';
    newTag.style.right = '10px';
    newTag.style.top = '10px';
    newTag.style.backgroundColor = '#4CAF50';
    newTag.style.color = '#fff';
    newTag.style.padding = '5px';
    newTag.style.borderRadius = '5px';
    newTag.style.cursor = 'pointer';
    newTag.style.fontSize = '12px';
    newTag.textContent = '下载封面图片';

    newTag.onclick = function() {
        var ogImageMeta = document.querySelector('meta[property="og:image"]');
        var ogTitleMeta = document.querySelector('meta[property="og:title"]');
        if (ogImageMeta) {
            var imageUrl = ogImageMeta.content;
            var fileName = getValidFileName(ogTitleMeta ? ogTitleMeta.content : null);
            fetchAndDownloadImage(imageUrl, fileName);
        } else {
            alert('没有找到og:image标签');
        }
    };
    metaContentElement.parentNode.insertBefore(newTag, metaContentElement.nextSibling);

    function getValidFileName(ogTitle) {
        if (ogTitle && ogTitle.trim().length > 0) {
            return ogTitle.trim();
        }
        return 'cover_image';
    }

    function fetchAndDownloadImage(url, fileName) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        })
            .catch(error => console.error('Error downloading image:', error));
    }
})();