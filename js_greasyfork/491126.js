// ==UserScript==
// @name         Download Wattpad Chapter
// @namespace    http://wattpad.com/*
// @version      0.1
// @description  Download the content of the Wattpad chapter as a text file by clicking a button. The button is designed to integrate with the appearance of the Wattpad page.
// @author       Dj Dragkan
// @match        *://www.wattpad.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491126/Download%20Wattpad%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/491126/Download%20Wattpad%20Chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy the text of an element to the clipboard
    function copyText(text) {
        // Copy text to clipboard
        navigator.clipboard.writeText(text)
            .catch(function() {
                alert('Error copying text.');
            });
    }

    // Function to download text as a text file
    function downloadFile(text) {
        // Create a Blob object with the text
        var blob = new Blob([text], { type: 'text/plain' });

        // Create a URL object for the Blob
        var url = window.URL.createObjectURL(blob);

        // Create a download link
        var downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'downloaded_chapter.txt';

        // Click the link to initiate the download
        downloadLink.click();

        // Revoke the URL object
        window.URL.revokeObjectURL(url);
    }

    // Create a download chapter button
    function createDownloadChapterButton() {
        var downloadChapterButton = document.createElement('button');
        downloadChapterButton.innerText = 'DOWNLOAD CHAPTER';
        downloadChapterButton.style.position = 'fixed';
        downloadChapterButton.style.top = '10px';
        downloadChapterButton.style.left = '50%';
        downloadChapterButton.style.transform = 'translateX(-50%)';
        downloadChapterButton.style.zIndex = '9999';
        downloadChapterButton.style.backgroundColor = '#FFA500';
        downloadChapterButton.style.color = 'white';
        downloadChapterButton.style.fontWeight = 'bold';
        downloadChapterButton.style.border = 'none';
        downloadChapterButton.style.borderRadius = '5px';
        downloadChapterButton.style.padding = '10px 20px';
        downloadChapterButton.style.cursor = 'pointer';

        // Add the Wattpad icon to the button
        var wattpadIcon = document.createElement('img');
        wattpadIcon.src = 'https://www.wattpad.com/apple-touch-icon-114x114-precomposed.png';
        wattpadIcon.style.width = '20px'; // Adjust size as needed
        wattpadIcon.style.verticalAlign = 'middle'; // Align vertically with text
        downloadChapterButton.appendChild(wattpadIcon);

        // Add the button to the document body
        document.body.appendChild(downloadChapterButton);

        // Add click event to the button
        downloadChapterButton.addEventListener('click', function() {
            // Get all <p> elements with the data-p-id attribute
            var elements = document.querySelectorAll('p[data-p-id]');
            if (elements.length > 0) {
                var totalText = '';
                elements.forEach(function(element) {
                    totalText += element.innerText + '\n';
                });
                copyText(totalText);
                downloadFile(totalText);
            } else {
                alert('No <p> elements with the "data-p-id" attribute were found.');
            }
        });
    }

    // Call the function to create the download chapter button when the page loads
    window.addEventListener('load', createDownloadChapterButton);
})();
