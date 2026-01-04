// ==UserScript==
// @name         鲨鱼下载
// @namespace    https://sharkpt.net/
// @version      0.0.3
// @description  隐藏所有正在做种的种子，下载隐藏后的种子，不用的时候需要关掉脚本以防每次都提示。(感谢freefrank大佬)
// @author       hzfy
// @license      MIT
// @match        https://sharkpt.net/torrents.php*
// @icon         https://sharkpt.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/484507/%E9%B2%A8%E9%B1%BC%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/484507/%E9%B2%A8%E9%B1%BC%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!confirm('是否需要清除已做种的种子？')) {
         if (confirm('是否下载当前页面种子？')) {
                downloadFilteredTorrents();
            }
        return;
    }

    function processPage(documentInstance) {
        let torrentItems = documentInstance.querySelectorAll('.torrent-item');
        if (!torrentItems) return false;

        for (let item of torrentItems) {
            let torrentInfo = item.querySelector('.torrent-info');
            let torrentTags = torrentInfo.querySelector('.torrent-tags');
            let tooltipLabel = torrentTags.querySelector('.s-approva-status[label="做种中"]');
            if (torrentInfo && torrentTags && tooltipLabel && tooltipLabel.parentNode === torrentTags) {
                item.style.display = 'none';
            }
        }

        return true;
    }

if(processPage(document)){
     setTimeout(() => {
          if (confirm('是否下载未下载的种子？')) {
                downloadFilteredTorrents();
            }
                    }, 1000);

};

    function downloadFilteredTorrents() {
        const downloadBaseUrl = "https://sharkpt.net/download.php?id=";
        const sleep = () => new Promise(resolve => setTimeout(resolve, 500));
        const downloadFile = url => {
            const link = document.createElement("a");
            link.href = url;
            link.download = url.split("/").pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        const getFilteredTorrentIds = () => {
            const downloadButtons = document.getElementsByClassName("torrent-action-download");
            const filteredIds = [];

            for (const button of downloadButtons) {
                const parent = button.closest(".torrent-item");
                if (parent.style.display === "none") continue;

                const onclickValue = button.getAttribute("onclick");
                const matchedId = onclickValue.match(/download\.php\?id=(\d+)/);
                if (matchedId) {
                    filteredIds.push(parseInt(matchedId[1]));
                }
            }
            return filteredIds;
        };

        (async () => {
            for (const id of getFilteredTorrentIds()) {
                const downloadUrl = `${downloadBaseUrl}${id}`;
                downloadFile(downloadUrl);
                await sleep(1000);
            }
        })();
    }


})();