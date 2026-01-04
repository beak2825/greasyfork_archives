// ==UserScript==
// @name         ImageSnatcher
// @name:es      ImageSnatcher
// @version      1.2.4
// @description  Quickly download images by hovering over them and pressing the S key.
// @description:es Descarga imágenes rápidamente pasando el cursor sobre ellas y presionando la tecla S.
// @author       Adam Jensen
// @match        *://*/*
// @grant        GM_download
// @license      MIT
// @namespace https://greasyfork.org/en/scripts/518034-imagesnatcher
// @downloadURL https://update.greasyfork.org/scripts/518034/ImageSnatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/518034/ImageSnatcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const validExtensions = /\.(jpe?g|png|gif|webp|bmp|svg|ico|tiff?|avif|jxl|heic|heif|dds|apng|pjpeg|pjpg|webm)$/i;
    const preprocessedImages = []; // Array to store the last 10 preprocessed images
    const maxHistory = 10; // Maximum number of images to keep in the history
    const downloadQueue = []; // Queue of images to be downloaded
    let isDownloading = false; // Flag to track the download state
    let lastHoveredImage = null; // Variable to store the last hovered image details

    let lastProcessedUrl = null; 
    function preprocessImage(target) {
        if (!target) return;

        let imageUrl;
        let imageTitle = '';
        let potentialBetterUrl = null;

        const parentAnchor = target.closest('a');
        if (parentAnchor && parentAnchor.href && validExtensions.test(parentAnchor.href)) {
            potentialBetterUrl = parentAnchor.href;
        }

        if (target.tagName.toLowerCase() === 'img') {
            imageUrl = target.src;
            imageTitle = target.alt.trim() || '';
        } else if (target.style.backgroundImage) {
            imageUrl = target.style.backgroundImage.replace(/url\(["']?([^"']+)["']?\)/, '$1');
        }

        if (potentialBetterUrl) {
            imageUrl = potentialBetterUrl;
        }

        if (imageUrl === lastProcessedUrl) {
            return; 
        }
        lastProcessedUrl = imageUrl;

        const ytMatch = imageUrl.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
        if (ytMatch) {
            imageUrl = `https://i.ytimg.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
            console.log(`YouTube thumbnail detected. Switched to maxresdefault: ${imageUrl}`);
        }

        if (!imageTitle) {
            const parentAnchor = target.closest('a');
            if (parentAnchor && parentAnchor.href) {
                imageTitle = parentAnchor.href.split('/').pop().split('?')[0];
            }
        }

        if (!imageTitle) {
            imageTitle = imageUrl ? imageUrl.split('/').pop().split('?')[0] : 'unknown_image';
        }

        imageTitle = imageTitle.replace(/[\/:*?"<>|]/g, '_'); // Make filename safe

        if (!validExtensions.test(imageTitle)) {
            const extensionMatch = imageUrl ? imageUrl.match(validExtensions) : null;
            const extension = extensionMatch ? extensionMatch[0] : '.jpg'; // Default to .jpg
            imageTitle += extension;
        }

        const existingImage = preprocessedImages.find(img => img.url === imageUrl);
        if (!existingImage) {
            preprocessedImages.push({ url: imageUrl, title: imageTitle });
            if (preprocessedImages.length > maxHistory) {
                preprocessedImages.shift(); 
            }
            console.log(`Preprocessed image: URL=${imageUrl}, Title=${imageTitle}`);
        }

        lastHoveredImage = { url: imageUrl, title: imageTitle };
    }

    document.addEventListener('mousemove', function (event) {
        if (event.target.tagName.toLowerCase() === 'img' || event.target.style.backgroundImage) {
            preprocessImage(event.target); 
        }
    });

    function setCursorLoading(isLoading) {
        if (isLoading) {
            document.body.style.cursor = 'progress'; 
        } else {
            document.body.style.cursor = ''; 
        }
    }

    function processDownloadQueue() {
        if (isDownloading || downloadQueue.length === 0) return; 

        const nextImage = downloadQueue.shift();
        isDownloading = true;
        setCursorLoading(true); 

        GM_download({
            url: nextImage.url,
            name: nextImage.title,
            onerror: function (err) {
                console.error('Failed to download the image:', err);
                isDownloading = false; 
                setCursorLoading(false); 
                processDownloadQueue(); 
            },
            onload: function () {
                console.log(`Downloaded image: ${nextImage.title}`);
                isDownloading = false; 
                setCursorLoading(false); 
                processDownloadQueue(); 
            }
        });
    }


    document.addEventListener('keydown', function (event) {
        // Ignore the keypress if the target is an input or textarea
        const activeElement = document.activeElement;
        const isInputField = activeElement.tagName.toLowerCase() === 'input' ||
                             activeElement.tagName.toLowerCase() === 'textarea' ||
                             activeElement.isContentEditable;

        if (isInputField) return; // Do not download if the user is typing in an input field

        if (event.key.toLowerCase() === 's' && lastHoveredImage) {
            downloadQueue.push(lastHoveredImage);
            console.log(`Added image to queue: ${lastHoveredImage.title}`);
            processDownloadQueue(); 
        }
    });
})();
