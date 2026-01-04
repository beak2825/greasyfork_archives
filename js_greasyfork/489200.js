// ==UserScript==
// @name         PDF Finder and Downloader
// @version      1.3
// @description  Find and add a download button for PDFs on webpages, including embedded PDFs in iframes.
// @author       iamnobody
// @license      MIT
// @match        *://*/*
// @grant        none
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/400px-PDF_file_icon.svg.png
// @namespace pdf downloader
// @downloadURL https://update.greasyfork.org/scripts/489200/PDF%20Finder%20and%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/489200/PDF%20Finder%20and%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if a link ends with .pdf
    function isPDFLink(link) {
        return link.toLowerCase().endsWith('.pdf');
    }

    // Function to add a download button next to a PDF link
    function addDownloadButton(element, pdfLink) {
        const downloadButton = document.createElement('button');
        downloadButton.innerText = '⬇️';
        downloadButton.style.backgroundColor = 'violet'; // Change color to violet
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.padding = '5px 10px';
        downloadButton.style.marginLeft = '5px';
        downloadButton.style.cursor = 'pointer';

        downloadButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.open(pdfLink, '_blank');
        });

        // Insert the download button next to the PDF link or iframe
        element.parentNode.insertBefore(downloadButton, element.nextSibling);

        // Add circular button beside the PDF ⬇️ button
        addCircularButton(downloadButton);
    }

    // Function to add a circular button beside the PDF ⬇️ button
    function addCircularButton(downloadButton) {
        const circularButton = document.createElement('button');
        circularButton.innerText = '-';
        circularButton.style.backgroundColor = 'green'; // Set color to green
        circularButton.style.color = 'white';
        circularButton.style.border = 'none';
        circularButton.style.borderRadius = '50%'; // Make it circular
        circularButton.style.width = '20px';
        circularButton.style.height = '20px';
        circularButton.style.marginLeft = '5px';
        circularButton.style.cursor = 'pointer';

        // Add click event listener to exclude the website
        circularButton.addEventListener('click', function(event) {
            event.preventDefault();
            excludeWebsiteFromScript();
        });

        // Insert the circular button next to the PDF ⬇️ button
        downloadButton.parentNode.insertBefore(circularButton, downloadButton.nextSibling);
    }

    // Function to exclude the current website's domain from running the script
    function excludeWebsiteFromScript() {
        const currentDomain = window.location.hostname;
        let excludedDomains = JSON.parse(localStorage.getItem('excludedDomains')) || [];
        if (!excludedDomains.includes(currentDomain)) {
            excludedDomains.push(currentDomain);
            localStorage.setItem('excludedDomains', JSON.stringify(excludedDomains));
        }
    }

    // Function to check if the current website's domain should be excluded from running the script
    function shouldExcludeWebsite() {
        const currentDomain = window.location.hostname;
        const excludedDomains = JSON.parse(localStorage.getItem('excludedDomains')) || [];
        return excludedDomains.includes(currentDomain);
    }

    // Function to find PDF links on the page and add download buttons
    function findAndAddPDFDownloadButtons() {
        if (!shouldExcludeWebsite()) {
            const links = document.querySelectorAll('a, iframe');
            links.forEach(link => {
                let pdfLink;
                if (link.tagName.toLowerCase() === 'iframe') {
                    const dataSource = link.getAttribute('data-source');
                    if (dataSource) {
                        pdfLink = getPDFLinkFromDataSource(dataSource);
                    }
                } else if (isPDFLink(link.href)) {
                    pdfLink = link.href;
                }
                if (pdfLink) {
                    addDownloadButton(link, pdfLink);
                }
            });

            // Check if there are more than two PDFs on the page
            const pdfCount = links.filter(link => isPDFLink(link.href)).length;
            if (pdfCount > 2) {
                const allButton = document.createElement('button');
                allButton.innerText = '⬇️ Download all ' + pdfCount;
                allButton.style.position = 'absolute';
                allButton.style.top = '0px';
                allButton.style.right = '0px';
                allButton.style.backgroundColor = 'violet'; // Change color to violet
                allButton.style.color = 'white';
                allButton.style.border = 'none';
                allButton.style.padding = '5px 10px';
                allButton.style.cursor = 'pointer';

                allButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    downloadAllPDFs();
                });

                document.body.appendChild(allButton);
            }
        }
    }

    // Function to extract PDF link from data-source attribute
    function getPDFLinkFromDataSource(dataSource) {
        const match = dataSource.match(/file=([^&]+)/);
        if (match && match[1]) {
            return decodeURIComponent(match[1]);
        }
        return null;
    }

    // Function to download all PDFs
    function downloadAllPDFs() {
        const links = document.querySelectorAll('a, iframe');
        links.forEach(link => {
            let pdfLink;
            if (link.tagName.toLowerCase() === 'iframe') {
                const dataSource = link.getAttribute('data-source');
                if (dataSource) {
                    pdfLink = getPDFLinkFromDataSource(dataSource);
                }
            } else if (isPDFLink(link.href)) {
                pdfLink = link.href;
            }
            if (pdfLink) {
                window.open(pdfLink, '_blank');
            }
        });
    }

    // Run the function when the page is fully loaded
    window.addEventListener('load', findAndAddPDFDownloadButtons);
})();