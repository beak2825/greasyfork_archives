// ==UserScript==
// @name         aud_download_claimed
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Download torrents that have been claimed but are not connected in audiences pt.
// @author       Azure
// @match        *://audiences.me/claim.php*
// @icon         https://audiences.me//favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521634/aud_download_claimed.user.js
// @updateURL https://update.greasyfork.org/scripts/521634/aud_download_claimed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertSizeToBytes(size) {
        const units = { 'K': 1024, 'M': 1024 * 1024, 'G': 1024 * 1024 * 1024 };
        const regex = /([\d.]+)([KMG])B/i;
        const matches = size.match(regex);
        if (matches && matches.length === 3) {
            return parseFloat(matches[1]) * (units[matches[2]] || 0);
        }
        return 0;
    }

    function scanAndFilterTorrents() {
        const secondEmbedded = document.querySelectorAll('.embedded')[1];
        if (!secondEmbedded) {
            console.log('没有找到第二个 .embedded 元素。');
            return [];
        }
        const torrents = secondEmbedded.querySelectorAll('table > tbody > tr');
        if (torrents.length === 0) {
            console.log('没有找到任何种子。');
            return [];
        }

        const filteredTorrents = [];
        for (let i = 1; i < torrents.length; i++) {
            const row = torrents[i];
            const torrentId = row.cells[1].textContent.trim();
            const fontText = row.cells[row.cells.length - 1].querySelector('font').textContent.trim();

            console.log('种子ID:', torrentId);
            console.log('状态:', fontText);

            if (fontText === "未链接") {
                filteredTorrents.push(torrentId);
            }
        }
        return filteredTorrents;
    }

    function createUI(filteredTorrents) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.right = '20px';
        container.style.top = '100px';
        container.style.backgroundColor = '#f9f9f9';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.zIndex = '99999';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        container.style.borderRadius = '5px';
        container.style.width = '200px';

        const countSpan = document.createElement('span');
        countSpan.textContent = filteredTorrents.length > 0
            ? `符合条件的种子数量: ${filteredTorrents.length}`
        : '没有符合条件的种子。';
        countSpan.style.display = 'block';
        countSpan.style.marginBottom = '10px';
        container.appendChild(countSpan);

        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载种子';
        downloadButton.style.display = 'block';
        downloadButton.style.marginTop = '10px';
        downloadButton.style.width = '100%';
        downloadButton.style.padding = '8px';
        downloadButton.style.border = 'none';
        downloadButton.style.backgroundColor = '#007bff';
        downloadButton.style.color = 'white';
        downloadButton.style.borderRadius = '3px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.textAlign = 'center';
        container.appendChild(downloadButton);

        downloadButton.addEventListener('mouseover', () => {
            downloadButton.style.backgroundColor = '#0056b3';
        });
        downloadButton.addEventListener('mouseout', () => {
            downloadButton.style.backgroundColor = '#007bff';
        });

        document.body.appendChild(container);

        downloadButton.addEventListener('click', function() {
            if (filteredTorrents.length > 0) {
                console.log('开始下载种子...');
                downloadTorrents(filteredTorrents);
            } else {
                alert('当前没有符合条件的种子可供下载。');
            }
        });
    }


    function downloadTorrents(torrents) {
        torrents.forEach((torrentId, index) => {
            const delayInMilliseconds = index * 2000;
            setTimeout(() => {
                const downloadUrl = `https://audiences.me/download.php?id=${torrentId}`;
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `torrent_${torrentId}.torrent`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                console.log(`下载链接: ${downloadUrl}`);
            }, delayInMilliseconds);
        });
    }

    const filteredTorrents = scanAndFilterTorrents();
    createUI(filteredTorrents);
})();
