// ==UserScript==
// @name         8chan Catbox Media Embedder
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Embeds images and videos from catbox.moe links in 8chan using data URLs to comply with CSP
// @author       You
// @match        *://8chan.moe/*
// @match        *://8chan.se/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @connect      catbox.moe
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/533927/8chan%20Catbox%20Media%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/533927/8chan%20Catbox%20Media%20Embedder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if URL is from catbox
    function isCatboxURL(url) {
        return url.includes('catbox.moe/');
    }

    // Function to determine media type from URL
    function getMediaType(url) {
        const extension = url.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const videoExtensions = ['mp4', 'webm'];

        if (imageExtensions.includes(extension)) {
            return 'image';
        } else if (videoExtensions.includes(extension)) {
            return 'video';
        } else {
            return 'unknown';
        }
    }

    // Function to embed media using data URLs
    function embedMedia(linkElement) {
        const mediaUrl = linkElement.href;
        const mediaType = getMediaType(mediaUrl);

        const container = document.createElement('div');
        container.className = 'catbox-embed';
        container.style.marginTop = '10px';
        container.style.marginBottom = '10px';
        container.style.maxWidth = '100%';

        if (mediaType === 'image') {
            const img = document.createElement('img');
            img.alt = 'Loading...';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '500px';
            img.style.display = 'block';
            container.appendChild(img);

            // Fetch and convert to data URL
            GM_xmlhttpRequest({
                method: 'GET',
                url: mediaUrl,
                responseType: 'blob',
                onload: function(response) {
                    const reader = new FileReader();
                    reader.onload = function() {
                        img.src = reader.result;
                    };
                    reader.readAsDataURL(response.response);
                },
                onerror: function(error) {
                    img.alt = 'Error loading image';
                    console.error('Image load error:', error);
                }
            });
        } else if (mediaType === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.loop = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '500px';
            video.style.display = 'block';
            container.appendChild(video);

            // Fetch and convert to data URL
            GM_xmlhttpRequest({
                method: 'GET',
                url: mediaUrl,
                responseType: 'blob',
                onload: function(response) {
                    const reader = new FileReader();
                    reader.onload = function() {
                        video.src = reader.result;
                    };
                    reader.readAsDataURL(response.response);
                },
                onerror: function(error) {
                    console.error('Video load error:', error);
                }
            });
        } else {
            return;
        }

        // Toggle functionality
        const toggleBtn = document.createElement('a');
        toggleBtn.href = 'javascript:void(0)';
        toggleBtn.textContent = '[ Hide ]';
        toggleBtn.style.fontSize = '12px';
        toggleBtn.style.marginLeft = '5px';
        toggleBtn.style.color = '#b25f5f';
        toggleBtn.style.textDecoration = 'none';

        toggleBtn.addEventListener('click', function() {
            const mediaElement = container.querySelector('img, video');
            if (mediaElement.style.display === 'none') {
                mediaElement.style.display = 'block';
                toggleBtn.textContent = '[ Hide ]';
            } else {
                mediaElement.style.display = 'none';
                toggleBtn.textContent = '[ Show ]';
            }
        });

        linkElement.parentNode.insertBefore(container, linkElement.nextSibling);
        linkElement.parentNode.insertBefore(toggleBtn, linkElement.nextSibling);
    }

    function processPage() {
        const postMessages = document.querySelectorAll('.divMessage');
        postMessages.forEach(message => {
            const links = message.querySelectorAll('a[href]');
            links.forEach(link => {
                if (isCatboxURL(link.href) && !link.dataset.processed) {
                    link.dataset.processed = 'true';
                    embedMedia(link);
                }
            });
        });
    }

    // Initial processing
    processPage();

    // Mutation Observer for dynamic content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                processPage();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Handle lazy-loaded content on scroll
    window.addEventListener('scroll', processPage);
})();