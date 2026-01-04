// ==UserScript==
// @name         Renta Papy Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download multiple whole chapters from Renta papy JP
// @source       https://github.com/vsatyamesc/Renta_downloader
// @match        https://https://renta.papy.co.jp/*
// @match        https://dre-viewer.papy.co.jp/*
// @grant        none
// @author       vsatyamesc
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534997/Renta%20Papy%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/534997/Renta%20Papy%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the download button
    const button = document.createElement('button');
    button.textContent = 'Download Images';
    Object.assign(button.style, {
        position: 'fixed',
        left: '20px',
        bottom: '20px',
        zIndex: 9999,
        padding: '8px 16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    });

    // Add hover effect
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#45a049';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#4CAF50';
    });

    // Add button to the page
    document.body.appendChild(button);

    let isDownloading = false;

    function save_image_to_device_vesc(base64image, index) {
        const a = document.createElement('a');
        a.href = base64image;
        a.download = `image_${index}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function waitForCanvasUpdate(previousData, index, resolve) {
        const canvas = document.querySelector('#center .imgWrap canvas.canvas');
        const currentData = canvas.toDataURL('image/png', 1.0);
        if (currentData !== previousData) {
            resolve(currentData);
        } else {
            setTimeout(() => waitForCanvasUpdate(previousData, index, resolve), 100);
        }
    }

    async function downloadImages() {
        if (isDownloading) return;
        isDownloading = true;
        button.textContent = 'Downloading...';
        button.style.backgroundColor = '#808080';

        try {
            const image_max_1qa = document.getElementById('scrollBar');
            const start_img_1qa = Number(image_max_1qa.min);
            const end_img_1qa = Number(image_max_1qa.max);

            let previousData = '';
            for (let i = start_img_1qa; i <= end_img_1qa; i++) {
                if (i === start_img_1qa) {
                    const canvas = document.querySelector('#center .imgWrap canvas.canvas');
                    previousData = canvas.toDataURL('image/png', 1.0);
                    save_image_to_device_vesc(previousData, i);
                } else {
                    jumpPage(i);
                    const updatedImage = await new Promise(resolve =>
                        waitForCanvasUpdate(previousData, i, resolve)
                    );
                    save_image_to_device_vesc(updatedImage, i);
                    previousData = updatedImage;
                }
            }
        } catch (error) {
            console.error('Error during download:', error);
            alert('Download failed: ' + error.message);
        } finally {
            isDownloading = false;
            button.textContent = 'Download Images';
            button.style.backgroundColor = '#4CAF50';
        }
    }

    button.addEventListener('click', downloadImages);
})();