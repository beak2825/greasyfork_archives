// ==UserScript==
// @name         Bulk Export Dropbox Image URLs (2024)
// @version      3.1.2
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
// @downloadURL https://update.greasyfork.org/scripts/465164/Bulk%20Export%20Dropbox%20Image%20URLs%20%282024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465164/Bulk%20Export%20Dropbox%20Image%20URLs%20%282024%29.meta.js
// ==/UserScript==

// NEW CONTRIBUTOR: [pixelsilo](https://www.dropboxforum.com/t5/user/viewprofilepage/user-id/1795103)
// SOURCE: https://www.dropboxforum.com/t5/View-download-and-export/Export-Bulk-Dropbox-Image-Folder-URLs/m-p/744340/highlight/true#
// -------------
// This updated script adds a button to the page labeled "Convert Links and Download."
// When the button is clicked, the script scrolls to the bottom of the page to load more links, converts the links to direct download links, and adds a textarea to the page with the list of links.
// The links are also formatted with `wget` so that they can be used in the command line. The button is temporarily disabled after the links are converted and re-enabled after a few seconds.
// Please note that this script is designed to work on Dropbox pages that match the URL pattern specified in the `@match` directive (`*://*.dropbox.com/*`).
// If you encounter any issues, please make sure that the script is running on the appropriate Dropbox page.

(function() {
    'use strict';
 
    const SECONDS_TO_WAIT_FOR_SCROLL = 1; // adjust as needed
    //const DOWNLOAD_URL_REPLACEMENT = '?dl=1';
    const DOWNLOAD_URL_REPLACEMENT = '?raw=1';
 
    // DELETED: MODIFIED BELOW || function to get all image link elements
    //function getImageLinks() {
    //    const imageLinks = document.querySelectorAll('a.dig-Link.sl-link--file[href*="dl=0"]');
    //    return Array.from(imageLinks).map(link => link.getAttribute('href').replace(/\?dl=0$/, DOWNLOAD_URL_REPLACEMENT));
    //}

    function getImageLinks() {
    // Update the selector to match the Dropbox page structure
    const imageLinks = document.querySelectorAll('a.dig-Link._sl-file-name_1iaob_86.dig-Link--primary[href*="dl=0"]');
    return Array.from(imageLinks).map(link => link.getAttribute('href').replace(/\?dl=0$/, DOWNLOAD_URL_REPLACEMENT));
    }
 
    // function to scroll to the bottom of the page and wait for new images to load
    async function waitForImagesToLoad() {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, SECONDS_TO_WAIT_FOR_SCROLL * 5000));
    }
 
    // create an array to hold the image URLs
    let imageUrls = [];
 
    // add a button to the page that will copy the image URLs to the clipboard when clicked
    const copyButton = document.createElement('button');
    copyButton.classList.add('dig-Button', 'dig-Button--primary', 'dig-Button--standard', 'copy-urls-button');
    copyButton.textContent = 'Copy all URLs';
    copyButton.style.position = 'fixed';
    copyButton.style.bottom = '20px';
    copyButton.style.right = '20px';
    copyButton.style.zIndex = '9999';
    document.body.appendChild(copyButton);
 
    // add a click event listener to the button
    copyButton.addEventListener('click', async function() {
        let finished = false;
        let numUrls = 0;
        while (!finished) {
            // scroll to the bottom of the page and wait for new images to load
            await waitForImagesToLoad();
 
            // get the newly loaded image URLs
            const newImageUrls = getImageLinks().filter(url => !imageUrls.includes(url));
            imageUrls.push(...newImageUrls);
 
            // check if all images have been loaded
            finished = newImageUrls.length === 0;
 
            numUrls += newImageUrls.length;
        }
 
        // join the image URLs into a string separated by newlines
        const imageUrlString = imageUrls.join('\n');
 
        // copy the image URL string to the clipboard
        GM_setClipboard(imageUrlString, 'text');
 
        // disable the button and change the text to indicate that the URLs have been copied
        copyButton.disabled = true;
        copyButton.textContent = `${numUrls} URL(s) copied to clipboard`;
 
        // enable the button again after 3 seconds
        setTimeout(function() {
            imageUrls = [];
            copyButton.disabled = false;
            copyButton.textContent = 'Copy all URLs';
        }, 3000);
    });
})();