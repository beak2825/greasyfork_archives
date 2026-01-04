// ==UserScript==
// @name         CSMAR重命名下载插件
// @namespace    none
// @version      V2.0-release
// @description  自动重命名csmar数据压缩包，文件名末尾打上时间范围，页面右上角显示下载按钮。Copyright (c) 2024 by Alan Lee, All Rights Reserved.
// @author       Alan Lee
// @match        *://*/sdownload.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=data.csmar.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/494634/CSMAR%E9%87%8D%E5%91%BD%E5%90%8D%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/494634/CSMAR%E9%87%8D%E5%91%BD%E5%90%8D%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function date_str(dateStr) {
        const dateRegex = /(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))? 至 (\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/;
        const match = dateStr.match(dateRegex);
        if (!match) return null;
        const [, startYear, startMonth, startDay, endYear, endMonth, endDay] = match;
        const formattedStartDate = [startYear, startMonth || '', startDay || ''].filter(Boolean).join('');
        const formattedEndDate = [endYear, endMonth || '', endDay || ''].filter(Boolean).join('');
        return `${formattedStartDate}-${formattedEndDate}`;
    }

    function createDownloadButton() {
        var downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download File';
        downloadButton.style.position = 'fixed';
        downloadButton.style.top = '20px';
        downloadButton.style.right = '20px';
        downloadButton.style.zIndex = '9999';
        downloadButton.addEventListener('click', function() {
            var element = document.querySelector("#csmar-app > div > div.app-content.datacenter-download > div > div.simple-container.container-w.min-w > div.down-notice > div:nth-child(5) > div > span.file-name > a");
            var datestr = document.querySelector("#csmar-app > div > div.app-content.datacenter-download > div > div.simple-container.container-w.min-w > div.down-table > table > tbody > tr:nth-child(2) > td:nth-child(2)");
            if (element) {
                var parsedDate = date_str(datestr.textContent.trim());
                var newFileName = element.textContent.trim().replace(/\d{9}/g, parsedDate);
                var tempLink = document.createElement('a');
                var url_raw = decodeURIComponent(element.href.split('?attname=')[0]);
                var newHref = url_raw + '?attname=' + encodeURIComponent(newFileName + '.zip');
                tempLink.href = newHref;
                tempLink.setAttribute('download', newFileName);
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            }
        });
        document.body.appendChild(downloadButton);
    }

    window.addEventListener('load', function() {
        createDownloadButton();
    });
})();