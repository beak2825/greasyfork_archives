// ==UserScript==
// @name              Threads.net Media Downloader
// @namespace         https://www.youtube.com/channel/UC26YHf9ASpeu68az2xRKn1w
// @version           05-01-2025
// @description       Add download button for posts with images/videos on Threads.net
// @author            Kinnena, ICHx
// @match             https://www.threads.net/*
// @match             https://www.threads.com/*
//
// @icon              https://cdn-icons-png.flaticon.com/512/12105/12105338.png
// @grant        GM_download
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/534668/Threadsnet%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/534668/Threadsnet%20Media%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButtonToElement(element) {
        if (element.querySelector('button.my-custom-button')) return;

        const postContainer = element.closest('div[role="article"]') ||
            element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;

        if (!postContainer) return;

        const hasMedia = postContainer.querySelector('picture img, video');
        if (!hasMedia) return;

        const button = document.createElement('button');
        button.textContent = 'Download';
        button.className = 'my-custom-button';
        Object.assign(button.style, {
            position: 'relative',
            background: '#0095f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            margin: '4px',
            cursor: 'pointer'
        });

        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            // Get post metadata
            const spanElement = postContainer.querySelector('span[class*="x1s688f"]');
            const timeElement = postContainer.querySelector('time');
            const spanText = (spanElement?.textContent || 'unknown').replace(/[^\w]/g, '_').substring(0, 30);
            const datetime = timeElement?.getAttribute('datetime');

            // Format timestamp
            let formattedTime = '';
            if (datetime) {
                const date = new Date(datetime);
                formattedTime = [
                    date.getFullYear(),
                    String(date.getMonth() + 1).padStart(2, '0'),
                    String(date.getDate()).padStart(2, '0'),
                    '_',
                    String(date.getHours()).padStart(2, '0'),
                    String(date.getMinutes()).padStart(2, '0'),
                    String(date.getSeconds()).padStart(2, '0')
                ].join('');
            }

            // Collect media
            const mediaElements = [
                ...postContainer.querySelectorAll('picture img'),
                ...postContainer.querySelectorAll('video')
            ];

            mediaElements.forEach((media, index) => {
                let url, type;
                if (media.tagName === 'IMG') {
                    url = media.src;
                    type = 'image';
                } else {
                    url = media.src || media.querySelector('source')?.src;
                    type = 'video';
                }

                if (url) {
                    const extension = getFileExtension(url) || (type === 'image' ? 'jpg' : 'mp4');
                    const filename = `Threads_${spanText}_${formattedTime}_${index + 1}.${extension}`;
                    GM_download({
                        url: url,
                        name: filename,
                        onerror: (e) => console.error('Download error:', e)
                    });
                }
            });

            // Auto-like functionality
            const likeButton = postContainer.querySelector('[aria-label="讚"]');
            if (likeButton) {
                likeButton.click();
            }
        });

        element.appendChild(button);
    }

    function getFileExtension(url) {
        try {
            const cleanUrl = url.split(/[?#]/)[0];
            return cleanUrl.split('.').pop().toLowerCase();
        } catch {
            return null;
        }
    }

    function scanForButtons() {
        document.querySelectorAll('div[class*="x1fc57z9"]').forEach(addButtonToElement);
    }

    // Initial check
    scanForButtons();
    // Periodic check for new posts
    setInterval(scanForButtons, 1000);
})();