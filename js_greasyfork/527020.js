// ==UserScript==
// @name         BitPorn 大图
// @namespace    BitPorn
// @version      2.0
// @description  在BitPorn的torrent列表显示大图
// @author       Ms Studio
// @match        https://bitporn.eu/torrents.php*
// @icon         https://bitporn.eu/favicon.ico
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/527020/BitPorn%20%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/527020/BitPorn%20%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const loadTorrentImages = () => {
        document.querySelectorAll('.contenttable tr').forEach(row => {
            const previewLink = row.querySelector('a.torrentPreview');

            if (previewLink) {
                const imageUrl = previewLink.getAttribute('data-src');
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.style.width = '260px';
                imgElement.style.height = 'auto';
                const newTd = document.createElement('td');
                newTd.style.textAlign = 'center';
                newTd.appendChild(imgElement);
                const firstTd = row.querySelector('td:first-child');
                row.insertBefore(newTd, firstTd.nextSibling);
            }
        });
    };

    loadTorrentImages();
})();