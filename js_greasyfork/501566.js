// ==UserScript==
// @name         下载杏坛hr种
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在杏坛网站的每一行添加下载按钮，并在页面上添加一个下载所有种子的按钮
// @author       xiaobaiya
// @match        https://xingtan.one/myhr.php*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/501566/%E4%B8%8B%E8%BD%BD%E6%9D%8F%E5%9D%9Bhr%E7%A7%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/501566/%E4%B8%8B%E8%BD%BD%E6%9D%8F%E5%9D%9Bhr%E7%A7%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add a download button to a specific row
    function addDownloadButton(row) {
        const detailsLink = row.querySelector('a[href^="details.php?id"]');
        if (detailsLink) {
            const id = detailsLink.href.split('=')[1];
            const downloadLink = `https://xingtan.one/download.php?id=${id}`;
            const downloadButton = document.createElement('input');
            downloadButton.type = 'button';
            downloadButton.value = '下载种子';
            downloadButton.onclick = function() { GM_openInTab(downloadLink, true); };
            row.querySelector('td:last-child').insertAdjacentElement('beforebegin', downloadButton);
        }
    }

    // Add download buttons to all rows
    document.querySelectorAll('#hr-table tbody tr').forEach(row => {
        addDownloadButton(row);
    });

    // Add 'Download All' button next to the reset button
    const resetButton = document.querySelector('input[type="reset"]');
    const downloadAllButton = document.createElement('input');
    downloadAllButton.type = 'button';
    downloadAllButton.value = '下载全部种子';
    downloadAllButton.style.marginLeft = '10px';
    downloadAllButton.onclick = function() {
        const links = Array.from(document.querySelectorAll('#hr-table a[href^="details.php?id"]')).map(link => `https://xingtan.one/download.php?id=${link.href.split('=')[1]}`);
        links.forEach((link, index) => {
            setTimeout(() => { GM_openInTab(link, true); }, 3000 * index);
        });
    };
    resetButton.parentNode.appendChild(downloadAllButton);
})();
