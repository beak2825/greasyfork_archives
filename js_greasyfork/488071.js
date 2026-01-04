// ==UserScript==
// @name         批量下载种子
// @namespace    https://www.agsvpt.com/
// @icon         https://www.agsvpt.com/favicon.ico
// @version      0.0.1
// @description  下载当前页面的所有种子
// @author       hzfy
// @match        https://www.agsvpt.com/torrents.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488071/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/488071/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加悬浮下载按钮的CSS样式
    const css = `
        .download-btn {
            position: fixed;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background-color: #007BFF;
            color: white;
            font-size: 24px;
            text-align: center;
            line-height: 50px;
            z-index: 9999;
            border-radius: 5px;
            cursor: pointer;
            user-select: none;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // 创建悬浮下载按钮
    const downloadBtn = document.createElement('div');
    downloadBtn.className = 'download-btn';
    downloadBtn.innerHTML = '⬇';
    document.body.appendChild(downloadBtn);

    downloadBtn.addEventListener('click', async () => {
        const downloadBaseUrl = "https://www.agsvpt.com/download.php?id=";
        const sleep = () => new Promise(resolve => setTimeout(resolve, 500));
        const downloadFile = url => {
            const link = document.createElement("a");
            link.href = url;
            link.download = url.split("/").pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        const getAllTorrentIds = () => {
            const downloadButtons = document.getElementsByClassName("download");
            const torrentIds = [];

            for (const button of downloadButtons) {
                const onclickValue = button.parentNode;
                var href = onclickValue.getAttribute("href");
                const matchedId = href.match(/download\.php\?id=(\d+)/);
                if (matchedId) {
                    torrentIds.push(parseInt(matchedId[1]));
                }
            }
            return torrentIds;
        };

        for (const id of getAllTorrentIds()) {
            const downloadUrl = `${downloadBaseUrl}${id}`;
            downloadFile(downloadUrl);
            await sleep(1000);
        }
    });
})();