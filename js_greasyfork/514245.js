// ==UserScript==
// @name         小猴皮皮点读笔批量下载
// @namespace    https://github.com/tsccai
// @version      0.9
// @description  提取小猴皮皮的资源下载链接，支持批量下载书名，并点击BNL格式下载按钮，自动保存，避免风控。
// @author       Tsccai
// @match        https://piyopen.lovereadingbooks.com/content/*
// @icon         https://www.lovereadingbooks.com/themes/contrib/bootstrap/logo.svg
// @license      MIT
// @grant        GM_openInTab
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/514245/%E5%B0%8F%E7%8C%B4%E7%9A%AE%E7%9A%AE%E7%82%B9%E8%AF%BB%E7%AC%94%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/514245/%E5%B0%8F%E7%8C%B4%E7%9A%AE%E7%9A%AE%E7%82%B9%E8%AF%BB%E7%AC%94%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SEARCH_BASE_URL = 'https://p.lovereadingbooks.com/api/v3/album/search?_format=json&name=';
    const CONTENT_SEARCH_BASE_URL = 'https://p.lovereadingbooks.com/api/v3/content/search?_format=json&keyword=';
    const CONTENT_BASE_URL = 'https://piyopen.lovereadingbooks.com/content/';
    const DOWNLOAD_DELAY = 6000; // 6 seconds delay

    // Create input interface
    function createInputInterface() {
        const inputDiv = document.createElement('div');
        inputDiv.style.position = 'fixed';
        inputDiv.style.top = '10px';
        inputDiv.style.right = '10px';
        inputDiv.style.backgroundColor = '#fff';
        inputDiv.style.border = '1px solid #ccc';
        inputDiv.style.padding = '10px';
        inputDiv.style.zIndex = 1000;
        inputDiv.classList.add('p-3', 'rounded', 'shadow');

        const titleInput = document.createElement('textarea');
        titleInput.placeholder = '请输入书名，用逗号分隔';
        titleInput.rows = 4;
        titleInput.style.width = '100%';
        titleInput.classList.add('form-control', 'mb-2');

        const downloadButton = document.createElement('button');
        downloadButton.innerText = '开始下载';
        downloadButton.classList.add('btn', 'btn-primary', 'btn-block');
        downloadButton.onclick = () => {
            const titles = titleInput.value.split(',').map(title => title.trim()).filter(Boolean);
            searchAndDownload(titles);
        };

        inputDiv.appendChild(titleInput);
        inputDiv.appendChild(downloadButton);
        document.body.appendChild(inputDiv);

        // Load Bootstrap CSS
        loadBootstrapCSS();
    }

    // Load Bootstrap CSS dynamically
    function loadBootstrapCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
        document.head.appendChild(link);
    }

    // Search and download based on input titles
    async function searchAndDownload(titles) {
        for (const title of titles) {
            const searchUrl = CONTENT_SEARCH_BASE_URL + encodeURIComponent(title) + '&isBxl=0';
            try {
                const response = await fetch(searchUrl);
                if (!response.ok) throw new Error('Network response was not ok');
                const json = await response.json();

                if (json.length > 0) {
                    const resource = json[0]; // Assuming you want the first match
                    const nid = resource.nid;
                    const contentUrl = `${CONTENT_BASE_URL}${nid}?from=search&keyword=${encodeURIComponent(resource.title)}`;
                    GM_openInTab(contentUrl);

                    // Wait for the page to load and then click the download button
                    await waitForDownloadButton();

                    // Wait for the download delay
                    await new Promise(resolve => setTimeout(resolve, DOWNLOAD_DELAY));
                } else {
                    console.warn(`No resources found for "${title}"`);
                }
            } catch (error) {
                console.error('Error fetching the resource links:', error);
            }
        }
    }

    // Wait for the BNL download button to be available and click it
    async function waitForDownloadButton() {
        const buttonSelector = "#__nuxt > div > div.max-w-\\[1200px\\].mx-auto > div > div > div > div:nth-child(3) > div.w-full.dark\\:divide-neutral-700.mt-2.mb-10 > div > div.bg-white.rounded-md.my-4.md\\:px-4.px-2.py-2 > div > div.flex-col.items-center.text-lg.justify-start.space-y-2 > div > div.space-y-2 > div:nth-child(2) > span";

        // Poll for the button's existence
        const maxAttempts = 10;
        let attempts = 0;

        while (attempts < maxAttempts) {
            const button = document.querySelector(buttonSelector);
            if (button) {
                button.click();
                console.log('Clicked the BNL download button');
                await autoDownload(); // Trigger auto-download after clicking
                return;
            }
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before checking again
        }

        console.warn('BNL download button not found');
    }

    // Trigger the download automatically
    async function autoDownload() {
        // Use a timeout to give the download some time to start
        await new Promise(resolve => setTimeout(resolve, 3000)); // Adjust this timeout as needed

        // Simulate download process (adjust the logic here if you need to fetch specific URLs)
        const downloadLink = document.querySelector('a[download]'); // Change the selector to the actual download link
        if (downloadLink) {
            GM_download(downloadLink.href, downloadLink.download);
            console.log('Download started automatically');
        } else {
            console.warn('Download link not found');
        }
    }

    createInputInterface(); // Initialize the input interface
})();
