// ==UserScript==
// @name         Download Manga Images for RawOtaku, JManga, Momon-Ga
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Download all images from the page on RawOtaku, JManga, Momon-Ga
// @author       Baconana-chan
// @match        https://rawotaku.org/*
// @match        https://jmanga.org/*
// @match        https://jmanga.to/*
// @match        https://jmanga.ac/*
// @match        https://rawotaku.com/*
// @match        https://momon-ga.org/*
// @match        https://jmanga.so/*
// @match        https://jmanga.sh/*
// @grant        GM_download
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520076/Download%20Manga%20Images%20for%20RawOtaku%2C%20JManga%2C%20Momon-Ga.user.js
// @updateURL https://update.greasyfork.org/scripts/520076/Download%20Manga%20Images%20for%20RawOtaku%2C%20JManga%2C%20Momon-Ga.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove protection that disables right-click or other actions
    function removeJSProtection() {
        document.addEventListener('contextmenu', function(event) {
            event.stopPropagation(); // Allow context menu (right-click)
        }, true);

        document.addEventListener('keydown', function(event) {
            // Remove block for F12, Ctrl+Shift+I, etc.
            if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
                event.stopPropagation();
            }
        }, true);

        // Remove inline event handlers that block right-click
        document.body.removeAttribute('oncontextmenu');
        document.body.removeAttribute('onselectstart');
        document.body.removeAttribute('oncopy');
        document.body.removeAttribute('ondragstart');
        document.body.removeAttribute('onkeydown');
    }

    // Force lazy-loaded images to load by setting their src attribute manually
    function forceLoadImages(container) {
        const lazyImages = container.querySelectorAll('img[data-src]'); // Select only lazy-loaded images
        lazyImages.forEach(img => {
            if (img.getAttribute('data-src')) {
                img.src = img.getAttribute('data-src'); // Manually set src to force loading
                img.removeAttribute('data-src'); // Optionally remove data-src to prevent future issues
            }
        });
    }

    // Function to create a download button inside div.container
    function createDownloadButton() {
        if (document.getElementById('downloadMangaButton')) return; // Avoid creating multiple buttons

        const container = document.querySelector('div.container');
        if (!container) {
            console.error('Container div not found.');
            return;
        }

        const button = document.createElement('button');
        button.id = 'downloadMangaButton';
        button.textContent = 'Download All Images';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.margin = '10px 0';

        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#45a049';
        });
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#4CAF50';
        });

        container.appendChild(button);
        button.addEventListener('click', downloadAllImages);
    }

    // Function to download all images from the specific container
    function downloadAllImages() {
        const container = document.querySelector('div#images-content');
        if (!container) {
            alert('Container with images not found.');
            return;
        }

        // Force load all lazy-loaded images inside the container
        forceLoadImages(container);

        // Select images within the container only
        const images = container.querySelectorAll('img');
        if (images.length === 0) {
            alert('No images found in the specified container.');
            return;
        }

        const folderName = prompt('Введите название для файлов (это не создаст папку, но добавит имя к файлам):', 'MangaChapter');
        if (!folderName) return;

        images.forEach((img, index) => {
            // Get the correct image URL (for lazy-loaded images, we already set the src)
            const url = img.src;
            if (!url) return; // Skip if no URL is found

            const imageName = `${folderName}_image_${index + 1}.jpg`;
            GM_download({
                url: url,
                name: imageName,
                saveAs: false,
                onerror: function(err) {
                    console.log('Failed to download image:', url, err);
                }
            });
        });
    }

    // Ensure button is created once the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        removeJSProtection();  // Remove site restrictions
        createDownloadButton();
    });

    // Set up MutationObserver to handle dynamic content
    const observer = new MutationObserver(createDownloadButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Periodic check to ensure button visibility (optional)
    setInterval(createDownloadButton, 5000);
})();
