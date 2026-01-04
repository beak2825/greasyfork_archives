// ==UserScript==
// @name         MangaboxDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for www.mangabox.me
// @icon         https://image-a.mangabox.me/static/assets/favicon.ico
// @match        https://www.mangabox.me/reader/*/episodes/*
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/544132/MangaboxDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/544132/MangaboxDownloader.meta.js
// ==/UserScript==

(function(JSZip, saveAs, ImageDownloader) {
    'use strict';

    // 获取图片URL
    const getImageURLs = () => new Promise(resolve => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href,
            responseType: 'text',
            headers: {
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                'Referer': 'https://www.mangabox.me/'
            },
            onload: res => {
                const urls = res.response.match(/https:\/\/image-a.mangabox.me\/static\/content\/reader\/\d+\/[a-z0-9]{64}\/sp\/\d+\.(jpg|png)\?t=\d{10}/g);
                resolve(urls || []);
            }
        });
    });

    // 初始化下载器
    getImageURLs().then(urls => {
        const title = document.querySelector('body > header > h2')?.innerText || 'manga';

        ImageDownloader.init({
            maxImageAmount: urls.length,
            getImagePromises: (s, e) => urls.slice(s-1, e).map(url =>
                new Promise(resolve =>
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'arraybuffer',
                        headers: {'Referer': window.location.href},
                        onload: res => resolve(res.response)
                    })
                )
            ),
            title: title
        });
    });

})(JSZip, saveAs, ImageDownloader);