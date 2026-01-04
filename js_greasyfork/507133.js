// ==UserScript==
// @name         Bulk Export Dropbox Image URLs (2024)
// @version      3.1.3
// @description  Extracts image URLs from a Dropbox page and copies them to the clipboard when a button is clicked.
// @author       sharmanhall
// @supportURL   https://github.com/tyhallcsu/dropbox-image-url-extractor/issues/new
// @namespace    https://github.com/tyhallcsu/dropbox-image-url-extractor
// @homepageURL  https://github.com/tyhallcsu/dropbox-image-url-extractor
// @license      MIT
// @connect      greasyfork.org
// @connect      sleazyfork.org
// @connect      github.com
// @connect      openuserjs.org
// @match        https://www.dropbox.com/*
// @match        *://*.dropbox.com/*
// @grant        GM_setClipboard
// @grant        GM_log
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @run-at       document-idle
// @icon         https://cfl.dropboxstatic.com/static/metaserver/static/images/favicon-vfl8lUR9B.ico
// @downloadURL https://update.greasyfork.org/scripts/507133/Bulk%20Export%20Dropbox%20Image%20URLs%20%282024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507133/Bulk%20Export%20Dropbox%20Image%20URLs%20%282024%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    const SCROLL_DELAY = 1000; // Reduced scroll delay for faster performance
    const DOWNLOAD_URL_REPLACEMENT = '?raw=1';

    // Updated selector to match the current Dropbox structure
    function getImageLinks() {
        const imageLinks = document.querySelectorAll('a.dig-Link._sl-file-name_1iaob_86.dig-Link--primary[href*="dl=0"]');
        return Array.from(imageLinks).map(link => link.getAttribute('href').replace(/\?dl=0$/, DOWNLOAD_URL_REPLACEMENT));
    }

    // Scroll to the bottom and wait for new images to load
    async function waitForImagesToLoad() {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, SCROLL_DELAY));
    }

    // Create a button for copying URLs
    const copyButton = document.createElement('button');
    copyButton.classList.add('dig-Button', 'dig-Button--primary', 'dig-Button--standard', 'copy-urls-button');
    copyButton.textContent = 'Copy all URLs';
    copyButton.style.position = 'fixed';
    copyButton.style.bottom = '20px';
    copyButton.style.right = '20px';
    copyButton.style.zIndex = '9999';
    document.body.appendChild(copyButton);

    // Create a click event for the button
    copyButton.addEventListener('click', async function() {
        let finished = false;
        let numUrls = 0;
        const imageUrls = [];

        while (!finished) {
            await waitForImagesToLoad();
            const newImageUrls = getImageLinks().filter(url => !imageUrls.includes(url));
            imageUrls.push(...newImageUrls);
            finished = newImageUrls.length === 0;
            numUrls += newImageUrls.length;
        }

        const imageUrlString = imageUrls.join('\n');
        GM_setClipboard(imageUrlString, 'text');
        copyButton.disabled = true;
        copyButton.textContent = `${numUrls} URL(s) copied to clipboard`;

        setTimeout(() => {
            copyButton.disabled = false;
            copyButton.textContent = 'Copy all URLs';
        }, 3000);
    });
})();