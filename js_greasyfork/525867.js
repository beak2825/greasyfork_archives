// ==UserScript==
// @name         RiotModels - Download All Images
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license      MIT
// @description  Download all images from a specific gallery and zip them
// @author       James Dev
// @match        https://riotmodels.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=riotmodels.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      cloudfront.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/525867/RiotModels%20-%20Download%20All%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/525867/RiotModels%20-%20Download%20All%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button
    const button = document.createElement('button');
    button.textContent = 'Download';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    // Create a progress bar
    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.position = 'fixed';
    progressBarContainer.style.bottom = '10px'; // 10px gap from the bottom
    progressBarContainer.style.right = '10px';
    progressBarContainer.style.zIndex = '1000';
    progressBarContainer.style.width = '200px';
    progressBarContainer.style.height = '20px';
    progressBarContainer.style.backgroundColor = '#ddd';
    progressBarContainer.style.borderRadius = '5px';
    progressBarContainer.style.display = 'none';

    const progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#4CAF50';
    progressBar.style.borderRadius = '5px';

    progressBarContainer.appendChild(progressBar);
    document.body.appendChild(progressBarContainer);

    // Create a label for progress
    const progressLabel = document.createElement('div');
    progressLabel.style.position = 'fixed';
    progressLabel.style.bottom = '40px'; // 10px gap from the bottom
    progressLabel.style.right = '10px';
    progressLabel.style.zIndex = '1000';
    progressLabel.style.color = 'black';
    progressLabel.style.display = 'none';

    document.body.appendChild(progressLabel);

    // Add click event to the button
    button.addEventListener('click', () => {
        // Hide the button
        button.style.display = 'none';

        // Show progress bar and label
        progressBarContainer.style.display = 'block';
        progressLabel.style.display = 'block';

        // Select all divs containing the gallery data
        const galleryDivs = document.querySelectorAll('div.uploads-images[data-gallery]');
        if (galleryDivs.length > 0) {
            const zip = new JSZip();
            let downloadCount = 0;
            let totalImages = 0;

            galleryDivs.forEach(galleryDiv => {
                const galleryData = galleryDiv.getAttribute('data-gallery');
                const images = JSON.parse(galleryData);
                totalImages += images.length;

                images.forEach(image => {
                    // Construct the download URL
                    const downloadUrl = window.location.origin + image.url;

                    // Use GM_xmlhttpRequest to fetch the image as a blob
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: downloadUrl,
                        responseType: 'blob',
                        onload: function(response) {
                            zip.file(image.original_filename, response.response, { binary: true });
                            downloadCount++;

                            // Update progress bar and label
                            const progress = (downloadCount / totalImages) * 100;
                            progressBar.style.width = progress + '%';
                            progressLabel.textContent = `Downloaded ${downloadCount} of ${totalImages} images`;

                            // Check if all images are downloaded
                            if (downloadCount === totalImages) {
                                zip.generateAsync({ type: 'blob' }).then(function(content) {
                                    const currentTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '-').replace(/ /g, ' ');
                                    const zipName = `RiotModels - ${currentTime}.zip`;
                                    saveAs(content, zipName);
                                    // Restore button to default state
                                    button.style.display = 'block';
                                    button.disabled = false;
                                    button.textContent = 'Download';
                                    button.style.backgroundColor = '#4CAF50';
                                    // Hide progress bar and label
                                    progressBarContainer.style.display = 'none';
                                    progressLabel.style.display = 'none';
                                    progressLabel.textContent = '';
                                });
                            }
                        },
                        onerror: function(error) {
                            console.error('Download failed:', error);
                            // Restore button to default state in case of error
                            button.style.display = 'block';
                            button.disabled = false;
                            button.textContent = 'Download';
                            button.style.backgroundColor = '#4CAF50';
                            // Hide progress bar and label
                            progressBarContainer.style.display = 'none';
                            progressLabel.style.display = 'none';
                            progressLabel.textContent = '';
                        }
                    });
                });
            });
        } else {
            alert('No gallery data found!');
            // Restore button to default state if no gallery data found
            button.style.display = 'block';
            button.disabled = false;
            button.textContent = 'Download';
            button.style.backgroundColor = '#4CAF50';
            // Hide progress bar and label
            progressBarContainer.style.display = 'none';
            progressLabel.style.display = 'none';
            progressLabel.textContent = '';
        }
    });
})();
