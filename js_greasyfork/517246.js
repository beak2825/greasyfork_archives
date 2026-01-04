// ==UserScript==
// @name        Image Extractor And Download Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license       MIT
// @author        SijosxStudio
// @url         https://greasyfork.org/en/users/1375139-sijosxstudio
// @description  Analyzes webpage inputs and downloads results as a .txt file
// @match        *://*/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/517246/Image%20Extractor%20And%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/517246/Image%20Extractor%20And%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Function to determine if an image is likely an ad or logo
    function isRelevantImage(img) {
        const src = img.src.toLowerCase();
        const excludePatterns = [
            'logo',    // common pattern for logos
            'ad',      // common pattern for ads
            'banner',  // common pattern for banners
            'tracker', // common for tracking pixels
            'pixel',   // 1x1 tracking pixels
            'favicon', // favicon
        ];

// Exclude based on patterns or small sizes
        return !excludePatterns.some(pattern => src.includes(pattern)) && img.width > 100 && img.height > 100;
    }

// Collect relevant image URLs
    function collectImageUrls() {
        const imageUrls = Array.from(document.images)
            .filter(isRelevantImage)
            .map(img => img.src);

        return Array.from(new Set(imageUrls)); // Remove duplicates
    }

// Prompt download of URLs as a text file
    function promptDownloadUrls(urls) {
// Convert URLs to text and encode as a data URL
        const urlText = urls.join('\n');
        const dataUrl = `data:text plain;charset=utf-8,${encodeURIComponent(urlText)}`;
        
// Create a link for download prompt
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'image_urls.txt';

// Append to document for iOS compatibility
        document.body.appendChild(a);
        
// Simulate click to trigger download
        a.click();
        
// Clean up
        document.body.removeChild(a);
    }

// Button to trigger URL collection and download prompt
    function addDownloadButton() {
        const button = document.createElement('button');
        button.textContent = 'Collect Image URLs';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = 10000;
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';

        // When the button is clicked, collect URLs and prompt download
        button.onclick = () => {
            const imageUrls = collectImageUrls();
            if (imageUrls.length > 0) {
                promptDownloadUrls(imageUrls);
            } else {
                alert('No relevant images found on this page.');
            }
        };

        document.body.appendChild(button);
    }

// Run script when the page fully loads
    window.addEventListener('load', addDownloadButton);
})();