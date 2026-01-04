// ==UserScript==
// @name         ZonaTMO Download
// @namespace    https://zonatmo.com/
// @icon         https://zonatmo.com/favicon.ico
// @version      2.0
// @license      GPL-3.0
// @description  Ripear mangas de ZonaTMO
// @author       bega_ YT_
// @match        https://zonatmo.com/*
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/528315/1544534/ImageDownloaderLib%28Priv%29.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/528313/ZonaTMO%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/528313/ZonaTMO%20Download.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {

        function getImageUrls() {
            return [...document.querySelectorAll('img.viewer-img')]
                .map(img => img.dataset.src || img.src)
                .filter(src => src && src.includes('/uploads/'));
        }

        function getImagePromises(startNum, endNum) {
            return getImageUrls()
                .slice(startNum - 1, endNum)
                .map(url => getImage(url)
                    .then(blob => blob)
                    .then(ImageDownloader.fulfillHandler)
                    .catch(ImageDownloader.rejectHandler)
                );
        }

        function getImage(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    headers: {
                        "Referer": "https://zonatmo.com/viewer/",
                        "Origin": "https://zonatmo.com",
                        "User-Agent": navigator.userAgent
                    },
                    responseType: 'arraybuffer',
                    onload: res => {
                        if (res.status === 200) {
                            resolve(new Blob([res.response], { type: 'image/webp' }));
                        } else {
                            reject(`Error ${res.status}`);
                        }
                    },
                    onerror: reject
                });
            });
        }
        const observer = new MutationObserver(() => {
            let urls = getImageUrls();

            if (urls.length > 0) {
                observer.disconnect();
                ImageDownloader.init({
                    maxImageAmount: urls.length,
                    getImagePromises,
                    title: document.title
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        let retryInterval = setInterval(() => {
            let urls = getImageUrls();
            if (urls.length > 0) {
                clearInterval(retryInterval);
            }
        }, 2000);
    });
})();
