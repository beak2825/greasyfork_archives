// ==UserScript==
// @name         同源下载
// @namespace    https://greasyfork.org/users/943170
// @version      1.0
// @description  应用场景：当我们想下载某个网站的资源时，很多时候，由于同源策略问题，并不能通过直接访问下载链接进行下载\n使用方法：打开控制台，调用downloadResource函数，传入参数为下载地址
// @author       nixingshiguang
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517856/%E5%90%8C%E6%BA%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/517856/%E5%90%8C%E6%BA%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const getFileName = (response) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'downloaded_resource';

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+?)"?;/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }

        return filename;
    };

    // 纯函数：保存文件
    const saveAs = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    // 纯函数：下载资源
    const downloadResource = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const filename = getFileName(response);
            saveAs(blob, filename);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };
    window.downloadResource = downloadResource;
    console.log('脚本加载完成');
})();
