// ==UserScript==
// @name         Reddit Bypass Enhancer
// @version      2.4
// @description  Bypass "open in app" prompts, unblur NSFW content & thumbnails, remove spoiler overlays.
// @author       UniverseDev
// @license      GPL-3.0-or-later
// @match        https://www.reddit.com/*
// @match        https://sh.reddit.com/*
// @grant        none
// @run-at       document-start
// @noframes
// @namespace    https://greasyfork.org/en/users/1030895-universedev
// @downloadURL https://update.greasyfork.org/scripts/520603/Reddit%20Bypass%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/520603/Reddit%20Bypass%20Enhancer.meta.js
// ==/UserScript==

'use strict';

(function () {
    function queryElementsDeep(selector) {
        const elements = new Set();
        try {
            document.querySelectorAll(selector).forEach(el => elements.add(el));
            document.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot) {
                    el.shadowRoot.querySelectorAll(selector).forEach(shadowEl => elements.add(shadowEl));
                }
            });
        } catch (error) {
            console.error("Error in queryElementsDeep:", error);
        }
        return [...elements];
    }

    const SELECTORS = {
        nsfwModal: 'shreddit-async-loader[bundlename*="nsfw_blocking_modal"]',
        promptContainer: 'xpromo-nsfw-blocking-container > *',
        prompt: '.prompt',
        blurredContainer: 'shreddit-blurred-container',
        thumbnailBlur: '.thumbnail-blur',
        communityHighlightCard: 'community-highlight-card',
        thumbnailImage: 'img.mb-0.h-full.w-full.object-cover',
        thumbnailShadow: '.thumbnail-shadow',
        mediaBackground: '.bg-media-background',
        blurredSpan: 'span.inner.blurred',
        scrim: '.absolute.top-0.left-0.w-full.h-full.bg-scrim',
        imageFilter: 'img.mb-0.h-full.w-full.object-cover',
        video: 'shreddit-player, video',
        mediaTelemetryObserver: 'media-telemetry-observer',
        spoilerOverlay: '.absolute.inset-0.overflow-visible.flex.items-center.justify-center'
    };

    function removeNSFWBlock() {
        try {
            document.querySelector(SELECTORS.nsfwModal)?.remove();
            document.querySelector(SELECTORS.promptContainer)?.shadowRoot?.querySelector(SELECTORS.prompt)?.remove();

            document.getElementById("nsfw-qr-dialog")?.remove();
            document.querySelector("body > div:nth-child(7)")?.remove();

            document.querySelectorAll('body > *').forEach(el => {
                if (el.style.backdropFilter) el.style.backdropFilter = 'none';
            });

            document.querySelectorAll(SELECTORS.blurredContainer).forEach(container => {
                try {
                    if (container.shadowRoot?.innerHTML && container.firstElementChild) {
                        container.firstElementChild.addEventListener('click', e => {
                            e.preventDefault();
                            if (e.target.closest(SELECTORS.mediaTelemetryObserver)) {
                                e.stopPropagation();
                            }
                            container.classList.add('clicked-container');
                            e.target.click();
                        }, { once: true });

                        container.firstElementChild.click();
                    }
                } catch (error) {
                    console.error("Error processing blurred container:", error, container);
                }
            });

            document.querySelectorAll(SELECTORS.thumbnailBlur).forEach(el => el.classList.remove('thumbnail-blur'));
            document.querySelectorAll(SELECTORS.communityHighlightCard).forEach(card => card.removeAttribute('blurred'));
            document.querySelectorAll(SELECTORS.imageFilter).forEach(img => img.style.removeProperty('filter'));
            document.querySelectorAll(SELECTORS.video).forEach(video => video.classList.remove('blur'));
            document.querySelector(SELECTORS.thumbnailShadow)?.remove();
            document.querySelector(SELECTORS.mediaBackground)?.style.setProperty('background-color', 'transparent');

            queryElementsDeep(SELECTORS.blurredSpan).forEach(span => span.style.removeProperty('filter'));
            queryElementsDeep(SELECTORS.scrim).forEach(scrim => scrim.remove());
            queryElementsDeep(SELECTORS.spoilerOverlay).forEach(spoiler => spoiler.remove());

            document.querySelectorAll('div.thumbnail-shadow').forEach(div => {
                if (div.querySelector('svg[icon-name="nsfw-fill"]')) {
                    div.remove();
                }
            });

        } catch (error) {
            console.error("Error in removeNSFWBlock:", error);
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                removeNSFWBlock();
                break;
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    const shredditCheckInterval = setInterval(() => {
        if (!document.querySelector('shreddit-app')) {
            observer.disconnect();
            clearInterval(shredditCheckInterval);
        }
    }, 5000);
})();