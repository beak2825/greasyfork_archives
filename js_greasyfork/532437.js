// ==UserScript==
// @name         half-assed nHentai downloader
// @version      1.0
// @description  Download galleries from nHentai as a .zip file of images (webp/jpg/png), because their download button provides it as a torrent instead. I get that it offloads the bandwidth burden from their servers, but it's in no way the most user-friendly approach.
// @match        https://nhentai.net/g/*
// @grant        GM_xmlhttpRequest
// @connect      *.nhentai.net
// @connect      nhentai.net
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @namespace https://greasyfork.org/users/1456281
// @downloadURL https://update.greasyfork.org/scripts/532437/half-assed%20nHentai%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/532437/half-assed%20nHentai%20downloader.meta.js
// ==/UserScript==

// WOMM. If it breaks for you, that's your problem, not mine

/* globals fflate */

(function() {
    'use strict';

    const galleryData = unsafeWindow._gallery;
    const { id: galleryId, num_pages: pageCount, media_id: mediaId, images: { pages: imagePages } } = galleryData;

    const downloadButton = document.querySelector('#download.btn.btn-secondary');
    if (!downloadButton) return;

    const zipDownloadButton = Object.assign(document.createElement('a'), {
        className: 'btn btn-secondary',
        innerHTML: '<i class="fa fa-download"></i> ZIP',
    });

    downloadButton.parentNode.insertBefore(zipDownloadButton, downloadButton.nextSibling);

    const extensionMap = {
        'j': 'jpg',
        'p': 'png',
        'w': 'webp'
    };

    zipDownloadButton.onclick = () => {
        Promise.all(Array.from({ length: pageCount }, (_, i) => {
            const fileExtension = extensionMap[imagePages[i].t] || 'webp';
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://i1.nhentai.net/galleries/${mediaId}/${i + 1}.${fileExtension}`,
                    responseType: 'arraybuffer',
                    onload: ({ response }) => {
                        resolve([`${i + 1}.${fileExtension}`, new Uint8Array(response)]);
                    },
                    onerror: (err) => {
                        console.error(`Failed to fetch page ${i + 1}.${fileExtension}:`, err);
                        resolve(null);
                    }
                });
            });
        })).then(imageFiles => {
            const validImageFiles = imageFiles.filter(file => file !== null);
            if (validImageFiles.length === 0) {
                console.log('tf?');
                return;
            }
            const zipArchive = fflate.zipSync(Object.fromEntries(validImageFiles), { level: 0 });
            const downloadLink = document.createElement('a');

            downloadLink.href = URL.createObjectURL(new Blob([zipArchive], { type: 'application/zip' }));
            downloadLink.download = `nhentai_${galleryId}.zip`;
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
        });
    };
})();