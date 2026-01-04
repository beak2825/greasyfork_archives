// ==UserScript==
// @name         Mangatoto/Bato.to Download All Images
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download all images from a web page
// @author       Yahudi777
// @match        https://mangatoto.com/chapter/*
// @match        https://bato.to/chapter/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469356/MangatotoBatoto%20Download%20All%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/469356/MangatotoBatoto%20Download%20All%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createDownloadConfirmationBox() {
        const confirmationBox = document.createElement('div');
        confirmationBox.style.position = 'fixed';
        confirmationBox.style.top = '50%';
        confirmationBox.style.left = '50%';
        confirmationBox.style.transform = 'translate(-50%, -50%)';
        confirmationBox.style.padding = '20px';
        confirmationBox.style.background = '#fff';
        confirmationBox.style.border = '1px solid #ccc';
        confirmationBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        confirmationBox.style.zIndex = '9999';

        const confirmationText = document.createElement('p');
        confirmationText.textContent = 'Do you want to download all the images?';
        confirmationText.style.color = 'black'; // Set font color to black

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Enter the image file name';
        nameInput.style.marginBottom = '10px';

        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.width = '100%';
        progressBarContainer.style.height = '10px';
        progressBarContainer.style.background = '#ccc';
        progressBarContainer.style.borderRadius = '5px';
        progressBarContainer.style.overflow = 'hidden';

        const progressBar = document.createElement('div');
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.background = 'red'; // Set background color to red
        progressBar.style.transition = 'width 0.3s ease';

        const progressText = document.createElement('div');
        progressText.style.marginTop = '5px';
        progressText.style.textAlign = 'center';
        progressText.style.color = 'black'; // Set font color to black

        progressBarContainer.appendChild(progressBar);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Yes';
        confirmButton.style.marginRight = '10px';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'No';

        confirmationBox.appendChild(confirmationText);
        confirmationBox.appendChild(nameInput);
        confirmationBox.appendChild(progressBarContainer);
        confirmationBox.appendChild(progressText);
        confirmationBox.appendChild(confirmButton);
        confirmationBox.appendChild(cancelButton);

        document.body.appendChild(confirmationBox);

        return new Promise((resolve, reject) => {
            confirmButton.addEventListener('click', () => {
                const fileName = nameInput.value.trim();
                if (fileName === '') {
                    alert('Please enter a valid image file name.');
                } else {
                    resolve({ shouldDownload: true, fileName, progressBar, progressText, confirmationBox });
                }
            });

            cancelButton.addEventListener('click', () => {
                resolve({ shouldDownload: false, fileName: null, progressBar, progressText, confirmationBox });
            });
        });
    }

    function updateProgressBar(progressBar, progress) {
        progressBar.style.width = `${progress}%`;
    }

    function updateProgressText(progressText, progress) {
        progressText.textContent = `${Math.round(progress)}%`;
    }

    function downloadImage(url, filename, progressBar, progressText) {
        return new Promise((resolve, reject) => {
            GM_download({
                url: url,
                name: filename,
                saveAs: false,
                onload: resolve,
                onerror: reject
            });
        });
    }

    async function downloadAllImages() {
        const imageElements = document.querySelectorAll('img');
        const imageUrls = Array.from(imageElements).map(img => img.src);

        // Remove duplicate image URLs
        const uniqueImageUrls = [...new Set(imageUrls)];

        const { shouldDownload, fileName, progressBar, progressText, confirmationBox } = await createDownloadConfirmationBox();

        if (shouldDownload) {
            const totalImages = uniqueImageUrls.length;

            for (let i = 0; i < totalImages; i++) {
                const imageUrl = uniqueImageUrls[i];
                const index = i + 1;
                const filename = fileName ? `${fileName}${index}.jpg` : `image${index}.jpg`;

                try {
                    await downloadImage(imageUrl, filename, progressBar, progressText);
                } catch (error) {
                    console.error(`Failed to download image ${imageUrl}`);
                }

                const progress = (index / totalImages) * 100;
                updateProgressBar(progressBar, progress);
                updateProgressText(progressText, progress);
            }

            console.log('Download completed.');
        } else {
            console.log('Download cancelled.');
        }

        document.body.removeChild(confirmationBox); // Close the confirmation box
    }

    downloadAllImages();
})();
