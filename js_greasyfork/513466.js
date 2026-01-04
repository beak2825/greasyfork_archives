// ==UserScript==
// @name         Kick Stream Preview
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Adds hover preview functionality to Kick.com streams
// @author       You
// @match        https://kick.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513466/Kick%20Stream%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/513466/Kick%20Stream%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hoverTimer = null;
    let activePreview = null;
    const previewDelay = 0;

    // Clean up any existing preview
    function cleanupPreviews() {
        if (activePreview) {
            const originalContent = activePreview.getAttribute('data-original');
            if (originalContent) {
                activePreview.innerHTML = originalContent;
            }
            activePreview.removeAttribute('data-active');
            activePreview.style.pointerEvents = ''; // Re-enable pointer events
            activePreview = null;
        }
    }

    // Handle mouse enter on thumbnails
    function handleMouseEnter(event) {
        const thumbnailLink = event.currentTarget;
        const thumbnailContainer = thumbnailLink.querySelector('.relative');
        if (!thumbnailContainer) return;

        // If there's an active preview somewhere else, clean it up
        if (activePreview && activePreview !== thumbnailContainer) {
            cleanupPreviews();
        }

        // If this container is already previewing, don't restart it
        if (thumbnailContainer.getAttribute('data-active') === 'true') {
            clearTimeout(hoverTimer);
            return;
        }

        const username = thumbnailLink.getAttribute('href').replace('/', '');
        if (!username) return;

        // Store original content if not already stored
        if (!thumbnailContainer.getAttribute('data-original')) {
            thumbnailContainer.setAttribute('data-original', thumbnailContainer.innerHTML);
        }

        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
            // Clean up any existing previews first
            cleanupPreviews();

            // Create and add the iframe with sound
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.kick.com/${username}?muted=false`; // Set to not muted
            iframe.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                pointer-events: none; /* Prevent mouse events on the iframe */
            `;
            iframe.frameBorder = '0';
            iframe.scrolling = 'no';
            iframe.allowFullscreen = true;
            iframe.allow = 'autoplay'; // Allow autoplay with sound

            thumbnailContainer.innerHTML = '';
            thumbnailContainer.appendChild(iframe);
            thumbnailContainer.setAttribute('data-active', 'true');
            activePreview = thumbnailContainer;

            // Hide controls of the parent when preview is active
            thumbnailContainer.style.pointerEvents = 'none'; // Disable pointer events for the parent
        }, previewDelay);
    }

    // Handle mouse leave
    function handleMouseLeave() {
        clearTimeout(hoverTimer);
        cleanupPreviews();
    }

    // Attach event listeners to thumbnails
    function attachPreviewListeners() {
        const thumbnailLinks = document.querySelectorAll('a[href^="/"][class*="group relative aspect-video"]');
        thumbnailLinks.forEach(link => {
            if (!link.hasAttribute('data-preview-enabled')) {
                link.addEventListener('mouseenter', handleMouseEnter);
                link.addEventListener('mouseleave', handleMouseLeave);
                link.setAttribute('data-preview-enabled', 'true');
            }
        });
    }

    // Initial setup
    attachPreviewListeners();

    // Watch for new thumbnails
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                attachPreviewListeners();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Cleanup on page changes
    document.addEventListener('visibilitychange', cleanupPreviews);
    window.addEventListener('beforeunload', cleanupPreviews);
})();
