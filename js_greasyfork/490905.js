// ==UserScript==
// @name         H2H Download
// @namespace    http://github.com/ZIDOUZI/H2H
// @version      0.0.1
// @description  Download manga from h2h.
// @author       ZIDOUZI
// @match        https://htoh.asia/comic/*
// @icon         https://htoh.asia/favicon.ico
// @require      https://cdn.bootcss.com/jszip/3.1.5/jszip.min.js
// @license      GPL3.0
// @downloadURL https://update.greasyfork.org/scripts/490905/H2H%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/490905/H2H%20Download.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var list = document.querySelector('.col-lg-2>ul');
    if (!list) return;
    list.appendChild(createDownloadButton());
    function createDownloadButton() {
        var listItem = document.createElement('li');
        var downloadButton = document.createElement('a');
        downloadButton.textContent = 'Download All';
        downloadButton.onclick = downloadAll;
        listItem.appendChild(downloadButton);
        return listItem;
    }

    // create a zip archive and download all images
    async function downloadAll() {
        var zip = new JSZip();
        var urls = Array.from(document.querySelector('.gallery-container').querySelectorAll('.img-responsive')).map(img => img.src);
        for (var i = 0; i < urls.length; i++) {
            if (i === 0) continue;
            if (urls[i] === '') {
                urls[i] = urls[i - 1].replace(/\/(\d+)\./, (m, d) => Number(d) == i ? `/${(i + 1).toString().padStart(d.length, '0')}.` : m);
            }
        }
        Promise.all(
            urls.map(
                async url => zip.file(url.substring(url.lastIndexOf('/') + 1), await download(url), { binary: true })
            )
        ).then(() => {
            zip.comment = `Downloaded from ${location.href}\nat ${new Date().toLocaleString()}`;
            zip.generateAsync({ type: 'blob' }).then(function (content) {
                var link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'manga.zip';
                link.click();
            });
        }).catch(error => {
            console.error(error);
            window.alert(error.message);
        });
    }

    // wrap for GM_xmlhttpRequest
    async function download(url) {
        return await fetch(url).then(response => {
            if (!response.ok) {
                throw new Error(`Failed to download image, status: ${response.status}, url: ${url}`);
            }
            return response.blob();
        });
    }
})();