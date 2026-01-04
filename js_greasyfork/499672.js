// ==UserScript==
// @name         Arxiv PDF Rename & Download
// @name:zh-CN   Arxiv PDF 一键下载并重命名
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script will generate a download buttom at the right-bottom of the website which download the pdf paper with a clear name.
// @description:zh-CN 一键下载 Arxiv 上的 pdf 文件，并以清晰的命名格式重命名文件
// @author       Omen
// @license      GPLv3
// @match        https://arxiv.org/abs/*
// @grant        none
// @icon         https://arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/499672/Arxiv%20PDF%20Rename%20%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/499672/Arxiv%20PDF%20Rename%20%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pageTitle = document.title;

    const illegalChars = /[\/\\:*?"<>|]/g;
    const cleanTitle = pageTitle.replace(illegalChars, ' ');

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.style.position = 'fixed';
    downloadButton.style.bottom = '10px';
    downloadButton.style.right = '10px';
    downloadButton.style.backgroundColor = 'red';
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.padding = '10px 20px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.zIndex = '1000';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    downloadButton.addEventListener('click', () => {
        const pdfUrl = window.location.href.replace('/abs/', '/pdf/');
        downloadButton.textContent = 'Downloading...';
        downloadButton.disabled = true;
        downloadButton.style.backgroundColor = '#C62828';
        fetch(pdfUrl)
            .then(response => response.blob())
            .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${cleanTitle}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            downloadButton.textContent = 'Done';
            downloadButton.disabled = false;
            downloadButton.style.backgroundColor = '#E53935';
        }).catch(error => {
            downloadButton.textContent = 'There has been a problem with fetch operation:'+ error;
            downloadButton.disabled = false;
        });
    });

    document.body.appendChild(downloadButton);
})();