// ==UserScript==
// @name         Image Downloader Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button to every image on the page
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532555/Image%20Downloader%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/532555/Image%20Downloader%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a download button to each image
    function addDownloadButtons() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Skip if button already added
            if (img.dataset.hasDownloadButton) return;

            // Create button
            const button = document.createElement('button');
            button.textContent = '⬇️';
            button.style.position = 'absolute';
            button.style.top = '5px';
            button.style.left = '5px';
            button.style.zIndex = 9999;
            button.style.background = 'white';
            button.style.border = '1px solid #ccc';
            button.style.cursor = 'pointer';

            // Button click downloads the image
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                const link = document.createElement('a');
                link.href = img.src;
                link.download = img.src.split('/').pop().split('?')[0]; // try to name file from URL
                link.click();
            });

            // Wrap image in a relative container to position button
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            wrapper.appendChild(button);

            img.dataset.hasDownloadButton = true;
        });
    }

    // Run after DOM loads
    window.addEventListener('load', addDownloadButtons);

    // Run again if the page updates dynamically
    setInterval(addDownloadButtons, 3000);
})();
