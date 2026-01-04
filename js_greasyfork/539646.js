// ==UserScript==
// @name         X/Twitter 画像キャッシュ
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Caches X.com images with different durations, fixing aspect ratio issues.
// @author       Your Name
// @match        https://x.com/*
// @match        https://twitter.com/*
// @connect      pbs.twimg.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539646/XTwitter%20%E7%94%BB%E5%83%8F%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/539646/XTwitter%20%E7%94%BB%E5%83%8F%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CACHE_NAME = 'x-image-cache-v4'; // Cache name updated to avoid conflicts
    // Cache duration for profile icons (long)
    const ICON_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
    // Cache duration for regular tweet media (short)
    const MEDIA_CACHE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days
    // --- End of Configuration ---

    GM_addStyle(`
        img[data-cached-from="true"] {
            /* When loading from cache, briefly flash opacity for feedback */
            opacity: 0.5;
            transition: opacity 0.2s ease-in-out;
        }
    `);

    /**
     * Fetches an image and stores it in the cache, or retrieves it from the cache if available and not expired.
     * @param {HTMLImageElement} img - The image element to process.
     */
    async function processImage(img) {
        // Do not process if the src is missing, not from pbs.twimg.com, or is already a local blob
        if (!img.src || !img.src.includes('pbs.twimg.com') || img.src.startsWith('blob:')) {
            return;
        }

        // Avoid reprocessing an image
        if (img.dataset.cacheProcessed === 'true') {
            return;
        }
        img.dataset.cacheProcessed = 'true';

        // Determine the image type to select the correct cache duration
        const isProfileIcon = img.src.includes('/profile_images/');
        const isTweetMedia = img.src.includes('/media/');
        let cacheDuration;

        if (isProfileIcon) {
            cacheDuration = ICON_CACHE_DURATION;
        } else if (isTweetMedia) {
            cacheDuration = MEDIA_CACHE_DURATION;
        } else {
            // Do not cache other image types (e.g., banners, card images)
            return;
        }

        // Use the image URL exactly as provided by the site to preserve aspect ratio
        const imageUrl = img.src;

        try {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(imageUrl);

            let isCacheValid = false;
            if (cachedResponse) {
                const cacheDate = cachedResponse.headers.get('x-cache-date');
                if (cacheDate && (Date.now() - new Date(parseInt(cacheDate))) < cacheDuration) {
                    isCacheValid = true;
                }
            }

            if (isCacheValid) {
                const blob = await cachedResponse.blob();
                img.src = URL.createObjectURL(blob);
                img.dataset.cachedFrom = 'true';
                setTimeout(() => { if(img.style) img.style.opacity = '1'; }, 200);
            } else {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    onload: async (response) => {
                        if (response.status === 200) {
                            const blob = response.response;
                            const headers = new Headers({
                                'Content-Type': blob.type,
                                'x-cache-date': Date.now().toString()
                            });
                            const responseToCache = new Response(blob, { headers });
                            await cache.put(imageUrl, responseToCache);

                            // Check if the image src is still the one we intended to cache before replacing it
                            if (img.src === imageUrl) {
                                img.src = URL.createObjectURL(blob);
                            }
                        }
                    },
                    onerror: (error) => {
                        console.error('Failed to fetch image for caching:', imageUrl, error);
                    }
                });
            }
        } catch (error) {
            console.error('Image Caching Script Error:', error);
        }
    }

    /**
     * Sets up a MutationObserver to watch for new images being added to the page.
     */
    function observeImages() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        if (node.tagName === 'IMG') {
                            processImage(node);
                        } else {
                            node.querySelectorAll('img').forEach(processImage);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also process images that might already be on the page when the script runs
        document.querySelectorAll('img').forEach(processImage);
    }

    // --- Script Execution ---
    if (document.body) {
        observeImages();
    } else {
        document.addEventListener('DOMContentLoaded', observeImages, { once: true });
    }
})();