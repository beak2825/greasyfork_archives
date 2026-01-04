// ==UserScript==
// @name         Better HentaiPaw
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fullscreen image viewer for HentaiPaw
// @author       Eric4
// @match        https://zh.hentaipaw.com/viewer?articleId=*&page=*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/497176/Better%20HentaiPaw.user.js
// @updateURL https://update.greasyfork.org/scripts/497176/Better%20HentaiPaw.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentIndex = 0;
    let imageLinks = [];

    // Function to extract image links
    function extractImageLinks() {
        console.log("Extracting image links...");
        const regex = /https:\/\/cdn\.imagedeliveries\.com\/.*?\.webp/g;
        const matches = document.body.innerHTML.match(regex);

        if (matches && matches.length > 0) {
            console.log("Found image links: ", matches);
            imageLinks = matches;

            if (imageLinks.length > 0) {
                displayImage(imageLinks[currentIndex]);
            }
        } else {
            console.log("No image links found.");
        }
    }

    // Function to display image
    function displayImage(src) {
        console.log("Displaying image: ", src);
        document.body.innerHTML = '';
        document.body.style.backgroundColor = 'black';
        document.body.style.margin = '0';
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';

        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain'; // Ensures the image fits within the container without stretching

        document.body.appendChild(img);

        preloadImages(currentIndex + 1, 3); // Preload next 3 images
    }

    // Function to preload images
    function preloadImages(startIndex, count) {
        for (let i = startIndex; i < startIndex + count; i++) {
            if (i < imageLinks.length) {
                const img = new Image();
                img.src = imageLinks[i];
                console.log("Preloading image: ", imageLinks[i]);
            }
        }
    }

    // Function to increase image number
    function nextImage() {
        if (currentIndex < imageLinks.length - 1) {
            currentIndex++;
            displayImage(imageLinks[currentIndex]);
        }
    }

    // Function to decrease image number
    function prevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            displayImage(imageLinks[currentIndex]);
        }
    }

    // Function to get the article ID from the URL
    function getArticleId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('articleId');
    }

    // Extract image links when the page loads
    window.addEventListener('load', extractImageLinks);

    // Add event listeners for key press 'd', 'a' and 'Esc'
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd') {
            nextImage();
        } else if (e.key === 'a') {
            prevImage();
        } else if (e.key === 'Escape') {
            const articleId = getArticleId();
            if (articleId) {
                window.location.href = `https://zh.hentaipaw.com/articles/${articleId}`;
            }
        }
    });
})();
