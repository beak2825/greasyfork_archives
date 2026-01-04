// ==UserScript==
// @name         Memedroid Video Download Button
// @namespace    Violentmonkey Scripts
// @match        *://*.memedroid.com/*
// @grant        none
// @version      1.1
// @author       ChandlerBeer
// @license      MIT
// @description  Adds video download buttons to Memedroid posts
// @downloadURL https://update.greasyfork.org/scripts/525589/Memedroid%20Video%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/525589/Memedroid%20Video%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG icon for download button (base64 encoded)
    const downloadIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZmZmZiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBkPSJNMC41IDkuOWEuNS41IDAgMCAxIC41LjV2Mi41YTEgMSAwIDAgMCAxIDFoMTJhMSAxIDAgMCAwIDEtMXYtMi41YS41LjUgMCAwIDEgMSAwdjIuNWEyIDIgMCAwIDEtMiAySDJhMiAyIDAgMCAxLTItMnYtMi41YS41LjUgMCAwIDEgLjUtLjV6Ii8+CiAgPHBhdGggZD0iTTcuNjQ2IDExLjg1NGEuNS41IDAgMCAwIC43MDggMGwzLTNhLjUuNSAwIDAgMC0uNzA4LS43MDhMOC41IDEwLjI5M1YxLjVhLjUuNSAwIDAgMC0xIDB2OC43OTNMNS4zNTQgOC4xNDZhLjUuNSAwIDEgMC0uNzA4LjcwOGwzIDN6Ii8+Cjwvc3ZnPg==';

    function createDownloadButton(url) {
        const button = document.createElement('button');
        button.className = 'action-btn download-btn';
        button.title = 'Download video';
        button.style.marginLeft = '0.2rem';
        button.innerHTML = `<img src="${downloadIcon}" width="16" ehight="16" class="item-controls-icon" alt="Download">`;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(url, '_blank');
        });
        return button;
    }

    function processArticle(article) {
        const videoContainer = article.querySelector('.video-container');
        if (!videoContainer) return;

        const video = videoContainer.querySelector('video');
        if (!video) return;

        // Find MP4 source
        const sources = video.querySelectorAll('source');
        let mp4Url;
        for (const source of sources) {
            if (source.type === 'video/mp4' && source.src) {
                mp4Url = source.src;
                break;
            }
        }
        if (!mp4Url) return;

        // Find controls container
        const controlsContainer = article.querySelector('.item-controls, .dropup');
        if (!controlsContainer) return;

        // Create and insert download button
        const downloadBtn = createDownloadButton(mp4Url);
        const shareButton = controlsContainer.querySelector('.item-controls-icon-share');

        if (shareButton && shareButton.parentNode) {
            shareButton.parentNode.insertBefore(downloadBtn, shareButton);
        } else {
            controlsContainer.prepend(downloadBtn);
        }
    }

    // MutationObserver config
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };

    // Process existing articles and observe new ones
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches('article')) {
                    processArticle(node);
                }
            });
        });
    });

    // Start observing
    window.addEventListener('load', () => {
        // Process initial articles
        document.querySelectorAll('article').forEach(processArticle);

        // Start observing document body
        observer.observe(document.body, observerConfig);
    });
})();