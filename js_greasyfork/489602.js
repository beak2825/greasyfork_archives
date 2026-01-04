// ==UserScript==
// @name         arXiv Link Downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Download arXiv links as an Excel file
// @author       You
// @match        https://arxiv.org/search/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489602/arXiv%20Link%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/489602/arXiv%20Link%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to trigger the link download
    const button = document.createElement('button');
    button.textContent = 'arXiv Links\n一键下载';
    button.style.position = 'fixed';
    button.style.top = '120px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    document.body.appendChild(button);

    // Function to extract links and create Excel content
    function downloadLinks() {
        const links = document.querySelectorAll('li.arxiv-result .list-title a[href^="https://arxiv.org/abs/"]');
        let excelContent = "Link\n";

        links.forEach(link => {
            const url = link.href.trim();
            excelContent += `"${url}"\n`;
        });

        // Create a Blob object with Excel content
        const blob = new Blob([excelContent], { type: 'text/csv;charset=utf-8;' });
        const blobURL = URL.createObjectURL(blob);

        // Create a temporary link to trigger the download
        const tempLink = document.createElement('a');
        tempLink.href = blobURL;
        tempLink.setAttribute('download', 'arxiv_links.csv');
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    }

    // Add event listener to the button
    button.addEventListener('click', downloadLinks);
})();
