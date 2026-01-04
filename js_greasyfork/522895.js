// ==UserScript==
// @name         Coppermine Gallery Downloader
// @namespace    https://github.com/xanthisafk/coppermine-gallery-downloader
// @version      1.3
// @description  Download galleries powered by Coppermine Photo Gallery
// @author       Abhinav
// @license      MIT; https://github.com/xanthisafk/coppermine-gallery-downloader/blob/main/LICENSE
// @match        *://*/thumbnails.php?*
// @match        *://*/displayimage.php?*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.4/dist/FileSaver.min.js
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/522895/Coppermine%20Gallery%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/522895/Coppermine%20Gallery%20Downloader.meta.js
// ==/UserScript==

// Icon: "Simple pickaxe" by ramaskrik is in the Public Domain, CC0. (https://opengameart.org/content/simple-pickaxe)

/* globals JSZip saveAs */
(function () {
    'use strict';

    // Create and style the download button
    const downloadButton = document.createElement('button');
    downloadButton.textContent = '💾 Download';
    downloadButton.style.position = 'fixed';
    downloadButton.style.bottom = '10px';
    downloadButton.style.left = '10px';
    downloadButton.style.zIndex = '1000';
    downloadButton.style.padding = '10px';
    downloadButton.style.backgroundColor = '#ff4081';
    downloadButton.style.color = '#fff';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.fontSize = '16px';
    document.body.appendChild(downloadButton);

    // Create and style a status indicator
    const statusIndicator = document.createElement('div');
    statusIndicator.style.position = 'fixed';
    statusIndicator.style.bottom = '60px';
    statusIndicator.style.left = '10px';
    statusIndicator.style.zIndex = '1000';
    statusIndicator.style.padding = '5px';
    statusIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    statusIndicator.style.color = '#fff';
    statusIndicator.style.borderRadius = '3px';
    statusIndicator.style.display = 'none';
    document.body.appendChild(statusIndicator);

    /**
     * Utility to update the status message on the UI.
     * @param {string} message - The status message to display.
     */
    function updateStatus(message) {
        statusIndicator.textContent = message;
        statusIndicator.style.display = 'block';
        console.log(message);
    }

    /**
     * Fetch an image using GM_xmlhttpRequest and return it as a Promise.
     * @param {string} imageUrl - The URL of the image to fetch.
     * @returns {Promise<ArrayBuffer>} - A Promise resolving to the image data.
     */
    function fetchImageAsArrayBuffer(imageUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrl,
                responseType: 'arraybuffer',
                onload(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`Failed to fetch image from ${imageUrl}`));
                    }
                },
                onerror() {
                    reject(new Error(`Network error while fetching ${imageUrl}`));
                }
            });
        });
    }

    /**
     * Download a single image on the page.
     */
    async function downloadSingleImage() {
        try {
            downloadButton.disabled = true;
            updateStatus('Preparing to download image...');

            const imageElement = document.querySelector('.image');
            if (!imageElement) {
                throw new Error('Image element not found on this page.');
            }

            const rawImageUrl = imageElement.src.replace('normal_', '');
            const imageFileName = rawImageUrl.split('/').pop();

            // Naming convention: hostname-[image file name].[ext]
            const hostname = window.location.hostname.split('.')[0];
            const formattedFileName = `${hostname}-${imageFileName}`;

            updateStatus('Downloading image...');
            const imageData = await fetchImageAsArrayBuffer(rawImageUrl);

            // Save the downloaded image
            const imageBlob = new Blob([imageData], { type: 'image/jpeg' });
            saveAs(imageBlob, formattedFileName);

            updateStatus('Image download complete!');
        } catch (error) {
            updateStatus(`Error: ${error.message}`);
        } finally {
            setTimeout(() => {
                statusIndicator.style.display = 'none';
                downloadButton.disabled = false;
            }, 3000);
        }
    }

    /**
     * Download all images in a gallery as a ZIP file.
     */
    async function downloadGalleryAsZip() {
        try {
            downloadButton.disabled = true;
            updateStatus('Preparing to download gallery...');

            const galleryTitleElement = document.querySelector('.maintable h2');
            const galleryTitle = galleryTitleElement ? galleryTitleElement.textContent.trim() : 'Gallery';
            const hostname = window.location.hostname.split('.')[0];
            const zipFileName = `${hostname}-${galleryTitle}.zip`;

            const zip = new JSZip();
            const thumbnailElements = document.querySelectorAll('.thumbnail');
            const imageUrls = [];

            // Extract and clean up image URLs
            thumbnailElements.forEach(thumbnail => {
                let rawImageUrl = thumbnail.src;
                if (rawImageUrl.includes('thumb_')) {
                    rawImageUrl = rawImageUrl.replace('thumb_', '');
                    const imageFileName = rawImageUrl.split('/').pop();
                    const formattedFileName = `${hostname}-${imageFileName}`;
                    imageUrls.push({ url: rawImageUrl, fileName: formattedFileName });
                }
            });

            if (imageUrls.length === 0) {
                throw new Error('No images found in the gallery.');
            }

            updateStatus(`Found ${imageUrls.length} images. Starting download...`);

            // Download each image and add to ZIP
            for (let i = 0; i < imageUrls.length; i++) {
                const { url, fileName } = imageUrls[i];
                updateStatus(`Downloading image ${i + 1} of ${imageUrls.length}...`);

                try {
                    const imageData = await fetchImageAsArrayBuffer(url);
                    zip.file(fileName, imageData, { binary: true });
                } catch (error) {
                    console.error(`Failed to download ${fileName}:`, error);
                }
            }

            updateStatus('Creating ZIP file...');
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });

            updateStatus('Downloading ZIP file...');
            saveAs(zipBlob, zipFileName);

            updateStatus('Gallery download complete!');
        } catch (error) {
            updateStatus(`Error: ${error.message}`);
        } finally {
            setTimeout(() => {
                statusIndicator.style.display = 'none';
                downloadButton.disabled = false;
            }, 3000);
        }
    }

    // Attach appropriate click handlers based on the page type
    const isSingleImagePage = window.location.href.includes('displayimage.php');
    if (isSingleImagePage) {
        downloadButton.textContent = '💾 Download Image';
        downloadButton.addEventListener('click', downloadSingleImage);
    } else {
        downloadButton.textContent = '💾 Download Gallery';
        downloadButton.addEventListener('click', downloadGalleryAsZip);
    }
})();
