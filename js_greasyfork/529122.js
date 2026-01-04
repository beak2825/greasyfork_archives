// ==UserScript==
// @name         remove Youtube clickbait by uday
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replaces YouTube thumbnails with random frames from the videos
// @author       You
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529122/remove%20Youtube%20clickbait%20by%20uday.user.js
// @updateURL https://update.greasyfork.org/scripts/529122/remove%20Youtube%20clickbait%20by%20uday.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update thumbnails with random frames
    function updateThumbnails(force = false) {
        const frameOptions = ['hq1', 'hq2', 'hq3'];
        const randomFrame = frameOptions[Math.floor(Math.random() * frameOptions.length)];
        const timestamp = Date.now();

        // Process <img> elements
        const imgSelector = force ? 'img' : 'img:not(.random-frame-updated)';
        const imgElements = document.querySelectorAll(imgSelector);
        for (let i = 0; i < imgElements.length; i++) {
            const img = imgElements[i];
            if (img.src.match(/https:\/\/i[0-9]?\.ytimg\.com\/(vi|vi_webp)\/.*\/(hq1|hq2|hq3|hqdefault|mqdefault|hq720)(_custom_[0-9]+)?\.jpg/)) {
                let newUrl = img.src.replace(/(hq1|hq2|hq3|hqdefault|mqdefault|hq720)(_custom_[0-9]+)?\.jpg/, `${randomFrame}.jpg`);
                newUrl += (newUrl.includes('?') ? '&' : '?') + `timestamp=${timestamp}`;
                img.src = newUrl;
                img.classList.add('random-frame-updated');
            }
        }

        // Process background-image elements
        const bgSelector = force ? '.ytp-videowall-still-image, .iv-card-image' : '.ytp-videowall-still-image:not(.random-frame-updated), .iv-card-image:not(.random-frame-updated)';
        const backgroundImgElements = document.querySelectorAll(bgSelector);
        for (let i = 0; i < backgroundImgElements.length; i++) {
            const el = backgroundImgElements[i];
            const styleAttribute = el.getAttribute('style');
            if (styleAttribute && styleAttribute.match(/url\("https:\/\/i[0-9]?\.ytimg\.com\/(vi|vi_webp)\/.*\/(hq1|hq2|hq3|hqdefault|mqdefault|hq720)(_custom_[0-9]+)?\.jpg/)) {
                const newStyleAttribute = styleAttribute.replace(/url\("([^"]+)"\)/, (match, url) => {
                    let newUrl = url.replace(/(hq1|hq2|hq3|hqdefault|mqdefault|hq720)(_custom_[0-9]+)?\.jpg/, `${randomFrame}.jpg`);
                    newUrl += (newUrl.includes('?') ? '&' : '?') + `timestamp=${timestamp}`;
                    return `url("${newUrl}")`;
                });
                el.setAttribute('style', newStyleAttribute);
                el.classList.add('random-frame-updated');
            }
        }
    }

    // Set up dynamic updates
    function setupRandomFrameCycling() {
        // Initial update for existing thumbnails
        updateThumbnails(false);

        // Observe DOM changes for new thumbnails
        const observer = new MutationObserver((mutations) => {
            if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
                updateThumbnails(false);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Optional: Debounced scroll event for extra coverage
        window.addEventListener('scroll', debounce(() => updateThumbnails(false), 500));

        // Handle YouTube SPA navigation
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => updateThumbnails(false), 1000); // Delay for content load
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Debounce utility to limit scroll event frequency
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Add a refresh button for manual re-randomization
    function createRefreshButton() {
        const refreshButton = document.createElement('button');
        refreshButton.textContent = '🔄 Refresh Thumbnails';
        refreshButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 8px 12px;
            background-color: #ff0000;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        refreshButton.addEventListener('click', () => updateThumbnails(true));
        document.body.appendChild(refreshButton);
    }

    // Start the script
    setupRandomFrameCycling();
    setTimeout(createRefreshButton, 3000); // Delay to ensure page load
})();