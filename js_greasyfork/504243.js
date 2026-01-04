// ==UserScript==
// @name         Modify Image URLs on Etsy
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Modify image URLs by removing the query string in elements with class "PDP_Large_Images" and add a button to copy the modified URLs.
// @author       Your Name
// @match        https://www.etsy.com*listing/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504243/Modify%20Image%20URLs%20on%20Etsy.user.js
// @updateURL https://update.greasyfork.org/scripts/504243/Modify%20Image%20URLs%20on%20Etsy.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Select the parent element
    const imageElements = document.querySelectorAll('#listing-right-column .wt-list-unstyled img');

    // Array to store the modified URLs
    let modifiedUrls = [];

    // Iterate through each image element
    imageElements.forEach(img => {
        let src = img.src;
        // Check if the URL contains "75x75"
        if (src.includes("75x75")) {
            // Replace "75x75" with "1000x1000"
            let modifiedSrc = src.replace("75x75", "1000x1000");
            modifiedUrls.push(modifiedSrc);
        }
    });

    // Join the modified URLs with newlines
    const modifiedUrlsString = modifiedUrls.join('\n');

    // Create a button element
    const copyButton = document.createElement('button');
    copyButton.innerText = '复制图片地址：';
    copyButton.style.position = 'fixed';
    copyButton.style.top = '10px';
    copyButton.style.right = '10px';
    copyButton.style.zIndex = '1000';
    copyButton.style.padding = '10px 20px';
    copyButton.style.backgroundColor = '#4CAF50';
    copyButton.style.color = '#fff';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '5px';
    copyButton.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(copyButton);

    // Add event listener for the button to copy the modified URLs to the clipboard
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(modifiedUrlsString).then(() => {
            console.log('Modified URLs copied to clipboard!');
        }, () => {
            alert('Failed to copy URLs to clipboard.');
        });
    });
})();
