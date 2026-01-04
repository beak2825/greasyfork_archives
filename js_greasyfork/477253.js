// ==UserScript==
// @name        Skill-capped video downloader
// @namespace   http://tampermonkey.net/
// @version     1.5
// @description Download and merge video segments,
// @author      Max
// @match       https://www.skill-capped.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/477253/Skill-capped%20video%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/477253/Skill-capped%20video%20downloader.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const TS_URL_TEMPLATE = "https://d13z5uuzt1wkbz.cloudfront.net/{{parentId}}/HIDDEN{{resolution}}-{{index}}.ts";
    const SELECTED_RESOLUTION = "2500";

    async function fetchTSFile(tsUrl) {
        try {
            const resp = await fetch(tsUrl);
            if (resp.status === 200) {
                return resp.arrayBuffer();
            }
            console.warn(`Failed to download ${tsUrl}, finishing download.`);
        } catch (e) {
            console.warn(`Fetch failed for ${tsUrl}, finishing download.`);
        }
        return null;
    }

    async function downloadAndMergeVideo(parentId, videoName, btn) {
        btn.innerHTML = 'DOWNLOADING...';
        btn.disabled = true;

        const tsFileContents = [];
        for (let i = 1; i <= 1000; i++) {
            const tsUrl = TS_URL_TEMPLATE
                .replace('{{parentId}}', parentId)
                .replace('{{resolution}}', SELECTED_RESOLUTION)
                .replace('{{index}}', String(i).padStart(5, "0"));

            const content = await fetchTSFile(tsUrl);
            if (content) {
                tsFileContents.push(content);
            } else {
                break;
            }
        }

        if (!tsFileContents.length) {
            console.warn("No valid .ts files were downloaded.");
            return;
        }

        const mergedVideoBlob = new Blob(tsFileContents, { type: 'video/mp2t' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(mergedVideoBlob);
        downloadLink.download = `${videoName}.ts`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        btn.innerHTML = 'Download';
        btn.disabled = false;
    }

    function addButtonToDiv(div) {
        const parentId = div.closest('div[id^="BrVidRow-"]').id.split('-')[1];
        const heartIcon = div.querySelector('svg[data-name="Heart Icon"]');
        heartIcon?.parentNode.removeChild(heartIcon);

        if (!div.querySelector('.custom-download-btn')) {
            const btn = document.createElement('button');
            btn.innerHTML = 'DOWNLOAD';
            btn.className = 'custom-download-btn';
            btn.style.borderRadius = '5px';
            btn.style.fontFamily = '"Roboto Condensed", sans-serif';
            btn.style.fontStyle = 'italic';
            btn.style.fontWeight = 'bold';
            btn.onclick = async () => {
                const targetDiv = div.querySelector('div > div > div > div'); // Adjusted selector
                const videoName = targetDiv?.innerText || "";
                await downloadAndMergeVideo(parentId, videoName, btn);
            };
            div.querySelector('div[data-name="BrVid Fav Container Course"]')?.appendChild(btn);
        }
    }

    function addDownloadButton() {
        const divs = document.querySelectorAll('div[data-name="BrVid Row Parent Course"]');
        divs.forEach(addButtonToDiv);
    }

    addDownloadButton();

    const observer = new MutationObserver(mutations => {
        if (mutations.some(mutation => mutation.addedNodes.length)) {
            addDownloadButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
