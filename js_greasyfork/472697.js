// ==UserScript==
// @name         音乐磁场-下载音乐
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在音乐播放器下方添加下载按钮，点击即可下载音乐
// @author       Your Name
// @license      MIT
// @match        *://*.hifini.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472697/%E9%9F%B3%E4%B9%90%E7%A3%81%E5%9C%BA-%E4%B8%8B%E8%BD%BD%E9%9F%B3%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/472697/%E9%9F%B3%E4%B9%90%E7%A3%81%E5%9C%BA-%E4%B8%8B%E8%BD%BD%E9%9F%B3%E4%B9%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮
    function createDownloadButton(url) {
        var downloadButton = document.createElement('a');
        downloadButton.href = url;
        downloadButton.innerText = '下载';
        downloadButton.style.display = 'block';
        downloadButton.style.marginTop = '10px';
        return downloadButton;
    }

    // 获取音乐下载地址
    function getMusicDownloadUrl() {
        var ap4 = window.ap4;
        if (ap4 && ap4.music) {
            var music = ap4.music;
            return music.url;
        }
        return null;
    }

    // 在页面中插入下载按钮
    function insertDownloadButton() {
        var downloadUrl = getMusicDownloadUrl();
        if (downloadUrl) {
            var playerElement = document.getElementById('player4');
            var downloadButton = createDownloadButton(downloadUrl);
            playerElement.parentNode.insertBefore(downloadButton, playerElement.nextSibling);
        }
    }

    // 监听页面加载完成事件，在页面中插入下载按钮
    window.addEventListener('load', function() {
        insertDownloadButton();
    });
})();
