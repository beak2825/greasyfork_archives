// ==UserScript==
// @name         YT Downloader
// @namespace    https://up.mewf.ru/
// @version      0.1
// @description  downloads videos via savefrom.net
// @author       MewForest
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395590/YT%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/395590/YT%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(setDownloader, 1000);
    function setDownloader() {
        let link = document.getElementById('downloader');
        if (!link) {
            link = document.createElement('a');
            link.innerText = "Скачать видео";
            link.setAttribute('target', '_blank');
            link.setAttribute('id', 'downloader');
            document.getElementById('info-text').appendChild(link)
        }
        let hrefDownload = 'https://www.ssyoutube.com/watch' + window.location.search;
        link.setAttribute('href', hrefDownload);
    }
})();