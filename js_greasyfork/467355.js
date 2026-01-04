// ==UserScript==
// @license      MIT
// @name         wenshu downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  download wenshu
// @author       You
// @match        https://wenshu.court.gov.cn/*
// @icon         https://wenshu.court.gov.cn/website/wenshu/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/467355/wenshu%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/467355/wenshu%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = 'Download';
    downloadBtn.style = "position: fixed; left: 0; top: 0;";
    let downloading = false;

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        })
    }

    async function gotoNextPage() {
        const nextPage = document.querySelector('.left_7_3 > a:last-of-type');
        nextPage.click();

        await sleep(3000);

        downloadFiles();
    }
    function downloadFiles() {
        if (downloading) return;

        downloading = true;
        const links = [...document.querySelectorAll('.a_xz')];
        links.forEach((link, i) => {
            setTimeout(() => {
                link.click();
                if (i === links.length - 1) {
                    downloading = false;
                    gotoNextPage();
                }
            }, 3000 * i);
        });
    }
    
    downloadBtn.addEventListener('click', downloadFiles);
    document.body.appendChild(downloadBtn);
})();
