// ==UserScript==
// @name         Download High-Resolution Images from isCool App
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Download all high-resolution images from a isCool App gallery with the formatted date at the beginning of the folder name inside the zip file. Default year is 2024 if not specified.
// @author       Marco
// @match        https://app.iscoolapp.net/#/gallery/detail/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499590/Download%20High-Resolution%20Images%20from%20isCool%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/499590/Download%20High-Resolution%20Images%20from%20isCool%20App.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to download a file
    function downloadFile(url, filename) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        resolve({blob: response.response, filename: filename});
                    } else {
                        reject(new Error(`Failed to download ${url}`));
                    }
                },
                onerror: function() {
                    reject(new Error(`Network error while downloading ${url}`));
                }
            });
        });
    }

    // Helper function to format the date
    function formatDate(dateString) {
        const months = {
            'janeiro': '01',
            'fevereiro': '02',
            'março': '03',
            'abril': '04',
            'maio': '05',
            'junho': '06',
            'julho': '07',
            'agosto': '08',
            'setembro': '09',
            'outubro': '10',
            'novembro': '11',
            'dezembro': '12'
        };

        const defaultYear = 2024;
        const dateParts = dateString.split(', ');
        const dayMonth = dateParts[1].split(' ');
        const day = dayMonth[0];
        const month = months[dayMonth[1]];
        let year = defaultYear;

        // Check if the current date is before June 28, if so use the current year
        const currentDate = new Date();
        const dateToCheck = new Date(`${defaultYear}-${month}-${day}`);
        if (currentDate < dateToCheck) {
            year = currentDate.getFullYear();
        }

        return `${year}-${month}-${day.padStart(2, '0')}`;
    }

    // Function to scrape images and create a zip file
    async function scrapeAndDownloadImages() {
        const titleElement = document.querySelector('.content-header-title > h1 > small');
        const dateElement = document.querySelector('#dContent > section.inner-content > div > div.container-fluid > div.row > div > div.info > div.header-gallery > span');
        const galleryTitle = titleElement ? titleElement.innerText : 'gallery';
        const galleryDate = dateElement ? formatDate(dateElement.innerText) : formatDate('');
        const folderName = `${galleryDate} - ${galleryTitle}`;
        const imageElements = Array.from(document.querySelectorAll('li.col-xs-4'));

        const imageUrls = imageElements.map(li => li.dataset.src).filter(src => src.includes('lg_'));

        if (imageUrls.length === 0) {
            console.log('No high-resolution images found.');
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder(folderName);
        const downloadPromises = imageUrls.map((url, index) => {
            const filename = `image_${index + 1}.jpg`;
            return downloadFile(url, filename).then(({blob, filename}) => {
                folder.file(filename, blob);
            });
        });

        try {
            await Promise.all(downloadPromises);
            zip.generateAsync({type: 'blob'}).then(content => {
                saveAs(content, `${folderName}.zip`);
                console.log('Download completed.');
            });
        } catch (error) {
            console.error('Error downloading images:', error);
        }
    }

    // Function to create and insert the download button
    function createDownloadButton() {
        const button = document.createElement('button');
        button.innerText = 'Download Images';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', scrapeAndDownloadImages);
        document.body.appendChild(button);
    }

    // Wait for the page to load and then create the button
    window.addEventListener('load', () => {
        createDownloadButton();
    });
})();
