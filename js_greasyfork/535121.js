// ==UserScript==
// @name         X Gallery with Fancybox
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Replace X gallery with Fancybox v5.0.36
// @author       You
// @match        https://x.com/*
// @require      https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.js
// @resource     fancyboxCSS https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';

    // Inject Fancybox CSS
    GM_addStyle(GM_getResourceText('fancyboxCSS'));

    // Function to generate the original image URL
    function getOriginalImageUrl(src) {
        if (src.includes('?')) {
            const url = new URL(src);
            const params = new URLSearchParams(url.search);
            params.set('name', 'orig');
            return `${url.origin}${url.pathname}?${params.toString()}`;
        } else {
            return src + ':orig';
        }
    }

    // Function to collect all images and videos in the relevant container
    function getGalleryImages(target) {
        let mediaContainer;
        const tweet = target.closest('article[role="article"]');

        if (tweet) {
            mediaContainer = tweet;
        } else {
            mediaContainer = target.closest('[aria-label*="Timeline:"]');
            if (!mediaContainer) {
                mediaContainer = target.closest('[data-testid="tweetPhoto"]')?.parentElement?.parentElement || target.closest('[data-testid="videoPlayer"]')?.parentElement;
            }
        }

        if (!mediaContainer) return [];

        const items = [];
        mediaContainer.querySelectorAll('img[src*="pbs.twimg.com"]:not([src*="profile_images"])').forEach(img => {
            const src = getOriginalImageUrl(img.src);
            items.push({ src: src, type: 'image' });
        });
        mediaContainer.querySelectorAll('video[src*="video.twimg.com"]').forEach(video => {
            items.push({ src: video.src, type: 'video' });
        });
        return items;
    }

    // Function to open media in Fancybox
    function openFancybox(e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.target.closest('.fancybox__container')) {
            return;
        }

        const target = e.target;
        const galleryItems = getGalleryImages(target);
        let startIndex = 0;

        if (target.tagName === 'IMG' && target.src.includes('pbs.twimg.com') && !target.src.includes('profile_images')) {
            const clickedSrc = getOriginalImageUrl(target.src);
            startIndex = galleryItems.findIndex(item => item.src === clickedSrc);
        } else if (target.tagName === 'VIDEO' && target.src.includes('video.twimg.com')) {
            const clickedSrc = target.src;
            startIndex = galleryItems.findIndex(item => item.src === clickedSrc);
        }

        if (galleryItems.length > 0) {
            console.log('Opening Fancybox with gallery:', galleryItems);
            Fancybox.show(galleryItems.map(item => ({
                src: item.src,
                type: item.type
            })), {
                Html: { loop: false },
                startIndex: startIndex,
                hideScrollbar: false,
                autoFocus: false,
                trapFocus: false,
                Carousel: {
                    infinite: false,
                    transition: "slide",
                },
                Thumbs: false,
                Media: {
                    video: {
                        contentType: 'video/mp4',
                    }
                },
                Images: {
                    Panzoom: {
                        maxScale: 5,
                        mouseMoveFactor: 1.03,
                        mouseMoveFriction: 0.07
                    },
                },
                Toolbar: {
                    display: {
                        left: ["infobar"],
                        middle: [],
                        right: ["slideshow", "download", "thumbs", "close"],
                    },
                }
            });
        }
    }

    // Function to apply event listeners to media elements
    function addMediaListeners() {
        const mediaSelectors = 'img[src*="pbs.twimg.com"]:not([src*="profile_images"]), video[src*="video.twimg.com"]';

        // Target media within articles (for main timeline)
        document.querySelectorAll('article[role="article"] ' + mediaSelectors).forEach(media => {
            const parent = media.closest('a') || media.parentElement;
            if (parent) {
                parent.removeEventListener('click', openFancybox);
                parent.addEventListener('click', openFancybox);
            }
        });

        // Target media within the Media timeline directly
        const mediaTimeline = document.querySelector('[aria-label*="Timeline:"]');
        if (mediaTimeline) {
            mediaTimeline.querySelectorAll(mediaSelectors).forEach(media => {
                // Attach listener directly to the img/video
                media.removeEventListener('click', openFancybox);
                media.addEventListener('click', openFancybox);
            }
            );
        }
    }

    // Observe DOM changes for dynamically loaded content
    const observer = new MutationObserver(() => {
        addMediaListeners();
    });
    const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
    observer.observe(primaryColumn || document.body, { childList: true, subtree: true });

    // Run initially
    addMediaListeners();
})();
