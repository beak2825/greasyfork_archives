// ==UserScript==
// @name         Reddit Image Gallery Arrow Navigation
// @namespace    https://reddit.com
// @version      1.9.2
// @description  Navigate Reddit image galleries using arrow keys, made with the help of ChatGPT, Thanks ChatGPT!
// @author       TheFantasticLoki
// @match        https://*.reddit.com/*
// @grant        none
// @license      MIT
// @homepage     https://github.com/TheFantasticLoki/Tampermonkey-Scripts
// @homepageURL  https://github.com/TheFantasticLoki/Tampermonkey-Scripts
// @supportURL   https://github.com/TheFantasticLoki/Tampermonkey-Scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/518645/Reddit%20Image%20Gallery%20Arrow%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/518645/Reddit%20Image%20Gallery%20Arrow%20Navigation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Set the debug variable to control logging
    const debug = false;

    let activeGallery = null;

    const simulateClick = (button) => {
        if (button) {
            try {
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                button.dispatchEvent(event);
                if (debug) console.log('Dispatched click event successfully');
            } catch (err) {
                if (debug) console.error('Error dispatching click event:', err);
            }
        } else {
            if (debug) console.log('Button not interactable or not found.');
        }
    };

    const handleKeyDown = (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (!activeGallery) {
            if (debug) console.log('No active gallery to navigate.');
            return;
        }

        if (e.key === 'ArrowLeft') {
            if (debug) console.log('Left arrow pressed');
            const prevButton = activeGallery.querySelector('button[aria-label="Previous page"]');
            if (debug) console.log('Previous Button:', prevButton);
            simulateClick(prevButton);
        }

        if (e.key === 'ArrowRight') {
            if (debug) console.log('Right arrow pressed');
            const nextButton = activeGallery.querySelector('button[aria-label="Next page"]');
            if (debug) console.log('Next Button:', nextButton);
            simulateClick(nextButton);
        }
    };

    const handleMouseEnter = (e) => {
        const galleryCarousel = e.currentTarget;
        if (galleryCarousel && galleryCarousel.shadowRoot) {
            activeGallery = galleryCarousel.shadowRoot;
            if (debug) console.log('Mouse entered gallery-carousel. Active gallery set:', activeGallery);
        }
    };

    const handleMouseLeave = () => {
        activeGallery = null;
        if (debug) console.log('Mouse left gallery-carousel. Active gallery cleared.');
    };

    const detectPopup = () => {
        const lightbox = document.querySelector('#shreddit-media-lightbox');
        if (lightbox) {
            const gallery = lightbox.querySelector('gallery-carousel');
            if (gallery && gallery.shadowRoot) {
                activeGallery = gallery.shadowRoot;
                if (debug) console.log('Gallery popup detected. Active gallery set:', activeGallery);
            }
        }
    };

    const observeDOMChanges = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.id === 'shreddit-media-lightbox') {
                            if (debug) console.log('Lightbox detected:', node);
                            detectPopup();
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    const attachHoverListeners = () => {
        document.querySelectorAll('gallery-carousel').forEach((carousel) => {
            carousel.addEventListener('mouseenter', handleMouseEnter);
            carousel.addEventListener('mouseleave', handleMouseLeave);
        });
    };

    const observeFeed = () => {
        const feedObserver = new MutationObserver(() => {
            attachHoverListeners(); // Reattach listeners as new galleries load
        });

        feedObserver.observe(document.body, { childList: true, subtree: true });
    };

    // Initial setup
    document.addEventListener('keydown', handleKeyDown);
    observeDOMChanges();
    observeFeed();

    // Attach listeners for initial galleries
    attachHoverListeners();

    if (debug) console.log('Script initialized.');
})();