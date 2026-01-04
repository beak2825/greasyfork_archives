// ==UserScript==
// @name         danbooru Download Button
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a download button to the https://danbooru.donmai.us post pages to quickly donwload the full rez image your currently looking at.
// @author       Dr. Pennysworth,Copilot
// @match        https://danbooru.donmai.us/posts/*?q=*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/527688/danbooru%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/527688/danbooru%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to download the image
    function downloadImage() {
        let link = document.querySelector('a.image-view-original-link');
        if (link) {
            let imageUrl = link.href;
            let imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            GM_download(imageUrl, imageName);
        } else {
            // Find image tag with id image and class fit-width and use its src
            let image = document.querySelector('img#image.fit-width');
            if (image) {
                let imageUrl = image.src;
                let imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                GM_download(imageUrl, imageName);
            } else {
                alert('Image link not found!');
            }
        }
    }

    // Create the download button
    function createDownloadButton() {
        let button = document.createElement('button');
        button.innerText = 'Download Image';
        button.style.display = 'block';
        button.style.margin = '10px auto';
        button.addEventListener('click', downloadImage);

        // Append the button to the specified div, or to the top of the section with the class image-container if div is not found
        let targetDiv = document.querySelector('.notice.notice-small.post-notice.post-notice-resized');
        if (targetDiv) {
            targetDiv.appendChild(button);
        } else {
            let imageContainerSection = document.querySelector('.image-container');
            if (imageContainerSection) {
                imageContainerSection.insertBefore(button, imageContainerSection.firstChild);
            } else {
                alert('Image container section not found!');
            }
        }
    }

    // Run the function to create the button on page load
    window.addEventListener('load', createDownloadButton);
})();
