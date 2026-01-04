// ==UserScript==
// @name         Download Manga Images for RawManga.net
// @namespace    https://rawmanga.net
// @version      1.2
// @description  Download all images from the page
// @author       Baconana-chan
// @match        https://rawmanga.net/*
// @grant        GM_download
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508249/Download%20Manga%20Images%20for%20RawManganet.user.js
// @updateURL https://update.greasyfork.org/scripts/508249/Download%20Manga%20Images%20for%20RawManganet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check that the script only works on pages with URLs starting with “/manga/”
    if (!window.location.pathname.startsWith('/manga/')) {
        return; // Stop execution if the URL is not suitable
    }

    // Function for creating a button
    function createDownloadButton() {
        // Looking for the main element to navigate through the chapters
        const chapterNav = document.querySelector('div#chapterNav.chapter-nav');
        // If not found, try to find a fixed version
        const chapterNavFixed = document.querySelector('div#chapterNav.chapter-nav.scroll-to-fixed-fixed');

        // If none of the elements is found, terminate execution
        if (!chapterNav && !chapterNavFixed) return;

        // Function for creating a button
        const button = document.createElement('button');
        button.textContent = 'Download All Images';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '10px';
        button.style.marginTop = '10px';

        // Add the button to the main navigation block if found, otherwise to a fixed block
        if (chapterNav) {
            chapterNav.appendChild(button);
        } else if (chapterNavFixed) {
            chapterNavFixed.appendChild(button);
        }

        // Event handler for the button
        button.addEventListener('click', downloadAllImages);
    }

    // Function for downloading all images on the page, except for those in header and footer
    function downloadAllImages() {
        const images = document.querySelectorAll('img'); // select all images
        const folderName = prompt('Введите название для файлов (это не создаст папку, но добавит имя к файлам):', 'MangaChapter');

        if (!folderName) return;

        let validImageIndex = 1; // Start with 1 for valid images

        images.forEach((img) => {
            // Ignore images in header#header.header and footer.footer
            if (img.closest('header#header.header') || img.closest('footer.footer')) {
                return;
            }

            const url = img.src;
            const imageName = `${folderName}_image_${validImageIndex}.jpg`; // file name with correct numbering
            GM_download({
                url: url,
                name: imageName, // save with the specified name
                saveAs: false
            });

            validImageIndex++; // Increase index for valid images only
        });
    }

    // Wait for the page to fully load, then create the button
    window.addEventListener('load', createDownloadButton);
})();