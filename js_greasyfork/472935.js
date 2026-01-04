// ==UserScript==
// @name         Save Comic as HTML
// @version      0.3
// @description  Download comic images as HTML
// @author       Bambi
// @match        https://readcomiconline.li/Comic/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1089343
// @downloadURL https://update.greasyfork.org/scripts/472935/Save%20Comic%20as%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/472935/Save%20Comic%20as%20HTML.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Obtain the list of loaded image URLs from the window or create an empty array
    const lstImages = window.lstImages || [];

    // Function to download the HTML viewer
    function downloadViewerHtml() {
        const urlParts = window.location.href.split('/');
        const comicName = urlParts[urlParts.length - 2];
        const issueName = urlParts[urlParts.length - 1].split('?')[0];
        const filename = `${comicName}${issueName}.html`;

        // Construct the HTML content dynamically
        const jsonContent = JSON.stringify(lstImages);
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Image Viewer</title>
            </head>
            <body>
                <h1>Image Viewer</h1>
                <div id="imageContainer"></div>
                <script>
                    const lstImages = ${jsonContent};
                    const imageContainer = document.getElementById('imageContainer');

                    lstImages.forEach(imageLink => {
                        const imgElement = document.createElement('img');
                        imgElement.src = imageLink;
                        imgElement.style.width = '50%';
                        imgElement.style.height = 'auto';
                        imgElement.style.marginLeft = '170px';
                        imageContainer.appendChild(imgElement);
                        imageContainer.appendChild(document.createElement('br'));
                    });
                </script>
            </body>
            </html>
        `;

        // Create a Blob with the HTML content
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(htmlBlob);
        downloadLink.download = filename;
        downloadLink.textContent = 'Download Viewer';

        // Trigger the download
        downloadLink.click();
    }

    // Create a button to initiate the download
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download HTML(d)';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '150px';
    downloadButton.style.left = '10px';
    downloadButton.style.zIndex = '9999';
    downloadButton.addEventListener('click', downloadViewerHtml);
    document.body.appendChild(downloadButton);

    // Add a keydown event listener for the "d" key
    document.addEventListener('keydown', event => {
        if (event.key === 'd') {
            downloadViewerHtml();
        }
    });

    // Create and update the images loaded counter
    const counterElement = document.createElement('div');
    counterElement.id = 'imagesLoadedCounter';
    counterElement.style.position = 'fixed';
    counterElement.style.top = '110px';
    counterElement.style.left = '10px';
    counterElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    counterElement.style.color = 'white';
    counterElement.style.padding = '5px';
    counterElement.style.borderRadius = '5px';
    counterElement.style.zIndex = '99999';
    counterElement.textContent = 'Images Loaded: 0';
    document.body.appendChild(counterElement);

    // Update the counter initially
    function updateCounter() {
        counterElement.textContent = `Images Loaded: ${lstImagesLoaded.length}`;
    }

    // Update the counter periodically
    setInterval(updateCounter, 1000);
})();
