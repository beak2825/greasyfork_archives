// ==UserScript==
// @name         OneDrive不限速直接下載
// @namespace    https://github.com/zz0813/OneDrive-Direct-Download/
// @version      v1.0.2
// @description  將共用連結轉換成直接下載連結並複製到剪貼簿
// @author       zz0813
// @match        *://*.sharepoint.com/*
// @match        *://onedrive.live.com/*
// @grant        GM_setClipboard
// @license      GPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/484935/OneDrive%E4%B8%8D%E9%99%90%E9%80%9F%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/484935/OneDrive%E4%B8%8D%E9%99%90%E9%80%9F%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 檢查剪貼簿內容是否為 OneDrive 的共享連結
    function checkClipboardContent() {
        navigator.clipboard.readText().then(clipboardText => {
            const directDownloadLink = convertToDirectDownloadLink(clipboardText);
            if (directDownloadLink) {
                // 使用Tampermonkey的GM_setClipboard函數來修改剪貼簿的內容
                GM_setClipboard(directDownloadLink, 'text');
                alert('直接下載連結已複製到剪貼簿！' + directDownloadLink);
                console.log('直接下載連結已複製到剪貼簿：', directDownloadLink);
            }
        }).catch(error => {
            console.error('無法讀取剪貼簿：', error);
        });
    }

    // 轉換共享連結為直接下載連結的函數
    function convertToDirectDownloadLink(shareLink) {
        if (shareLink.startsWith("https://1drv.ms/")) {
            return "https://onw.cc/1drv.ms.php?url=" + shareLink;
        }

        // 使用正則表達式來提取共享連結的部分
        const reg = /https:\/\/(?<domain>.+sharepoint\.com)\/.*personal\/(?<user>\w+?)\/(?<share>[a-zA-Z0-9-_]+)/;
        // const reg = /https:\/\/(.+sharepoint\.com)\/.*personal\/(\w+?)\/(\S+)(?:\?.+$)/
        const matches = shareLink.match(reg);

        // 如果沒有匹配到，或者是資料夾連結，則返回null
        if (!matches || shareLink.includes("com/:f:")) {
            console.error('抱歉，直鏈生成僅對單一文件有效！');
            return null;
        }

        // 否則，返回直接下載連結
        const [p1, p2, p3] = matches.slice(1);
        return `${p1}/personal/${p2}/_layouts/00/download.aspx?share=${p3}`;
    }

    // 每隔一秒檢查一次剪貼簿內容
    setInterval(checkClipboardContent, 1000);

})();
