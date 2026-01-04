// ==UserScript==
// @name         鲨鱼保种组福音
// @namespace    https://sharkpt.net/
// @version      0.5.1
// @description  遍历官组界面，隐藏所有正在做种的种子。
// @author       freefrank
// @match        https://sharkpt.net/torrents.php?team1=1&team2=1&team3=1&team4=1&team5=1*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://sharkpt.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/463189/%E9%B2%A8%E9%B1%BC%E4%BF%9D%E7%A7%8D%E7%BB%84%E7%A6%8F%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/463189/%E9%B2%A8%E9%B1%BC%E4%BF%9D%E7%A7%8D%E7%BB%84%E7%A6%8F%E9%9F%B3.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if (!confirm('是否需要清除已做种的种子？')) {
        return;
    }
    // Add CSS for the floating notification
    GM_addStyle(`
    .userscript-notification {
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      font-size: 14px;
      z-index: 9999;
      border-radius: 5px;
    }
  `);
    let notification = showNotification('脚本正在处理，请稍候...');
    let page = 1;

    function showNotification(text) {
        let notification = document.createElement('div');
        notification.className = 'userscript-notification';
        notification.textContent = text;
        document.body.appendChild(notification);
        return notification;
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

    function fetchAndProcessNextPage(page) {
        let currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('inclbookmarked', '0');
        currentUrl.searchParams.set('incldead', '1');
        currentUrl.searchParams.set('spstate', '0');
        currentUrl.searchParams.set('page', page);

        fetch(currentUrl.toString())
            .then((response) => response.text())
            .then((html) => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let torrentItems = doc.querySelectorAll('.torrent-item');
                if (torrentItems.length > 0) {
                    if (processPage(doc)) {
                        notification.textContent = '脚本正在处理第' + (page + 1) + '页，请稍候...';
                        fetchAndProcessNextPage(page + 1);
                    }
                } else {
                    notification.textContent = '脚本已完成所有页面处理。';
                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                }
            });
    }


    if (processPage(document)) {
        fetchAndProcessNextPage(page);
    }

    function checkIfFilteringComplete() {
        if (notification.textContent === '脚本已完成所有页面处理。') {
            if (confirm('是否下载未下载的种子？')) {
                downloadFilteredTorrents();
            }
        } else {
            setTimeout(checkIfFilteringComplete, 1000);
        }
    }

    checkIfFilteringComplete();

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