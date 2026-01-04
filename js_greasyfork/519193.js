// ==UserScript==
// @name         Bluesky Media Only Toggle
// @description  Toggleable filter to show only those Bluesky posts containing media
// @author       @plonked.bsky.social
// @match       *://bsky.app/*
// @namespace    plonked
// @version      1.0.0
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/519193/Bluesky%20Media%20Only%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/519193/Bluesky%20Media%20Only%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FILTER_BUTTON_ID = 'bsky-media-filter-btn';
    const HIDDEN_CLASS = 'bsky-hidden-post';
    const HAS_MEDIA_CLASS = 'bsky-has-media';
    const STORAGE_KEY = 'bsky-media-filter-active';

    const POST_SELECTORS = {
        feedItem: '[data-testid^="feedItem-by-"]',
        postPage: '[data-testid^="postThreadItem-by-"]',
        searchItem: 'div[role="link"][tabindex="0"]'
    };

    const styles = `
        .${HIDDEN_CLASS} {
            display: none !important;
        }
    `;

    let isFilterActive = GM_getValue(STORAGE_KEY, false);

    const findVideoInPost = (post) => {
        return post.querySelector('video[poster^="https://video.bsky.app/"], video[src^="https://t.gifs.bsky.app/"]');
    };

    const findImagesInPost = (post) => {
        return Array.from(post.querySelectorAll('img[src^="https://cdn.bsky.app/img/feed_thumbnail/"]'));
    };

    const hasMedia = (post) => {
        if (post.classList.contains(HAS_MEDIA_CLASS)) {
            return true;
        }

        const video = findVideoInPost(post);
        const images = findImagesInPost(post);
        const containsMedia = video || images.length > 0;

        if (containsMedia) {
            post.classList.add(HAS_MEDIA_CLASS);
        }

        return containsMedia;
    };

    const processPost = (post) => {
        if (post.classList.contains(HAS_MEDIA_CLASS)) {
            post.classList.toggle(HIDDEN_CLASS, false);
            return;
        }

        const containsMedia = hasMedia(post);

        if (containsMedia) {
            post.classList.toggle(HIDDEN_CLASS, false);
            return;
        }

        post.classList.toggle(HIDDEN_CLASS, isFilterActive);
    };

    const toggleFilter = () => {
        isFilterActive = !isFilterActive;
        GM_setValue(STORAGE_KEY, isFilterActive);

        const button = document.querySelector(`#${FILTER_BUTTON_ID}`);
        const text = button.querySelector('.filter-text');
        text.textContent = isFilterActive ? 'All Posts' : 'Media Only';

        document.querySelectorAll(Object.values(POST_SELECTORS).join(',')).forEach(post => {
            if (post.classList.contains(HAS_MEDIA_CLASS)) {
                post.classList.remove(HIDDEN_CLASS);
            } else {
                post.classList.toggle(HIDDEN_CLASS, isFilterActive);
            }
        });
    };

    const createFilterButton = () => {
        const navMenu = document.querySelector('nav[role="navigation"]');
        if (!navMenu) return;

        const settingsLink = Array.from(navMenu.querySelectorAll('a')).find(a => a.getAttribute('aria-label') === 'Settings');
        if (!settingsLink) return;

        const button = document.createElement('a');
        button.id = FILTER_BUTTON_ID;
        button.className = 'css-175oi2r r-1loqt21 r-1otgn73';
        button.role = 'button';
        button.style.cssText = `
            flex-direction: row;
            align-items: center;
            padding: 12px;
            border-radius: 8px;
            gap: 8px;
            outline-offset: -1px;
            transition-property: color, background-color;
            transition-timing-function: cubic-bezier(0.17, 0.73, 0.14, 1);
            transition-duration: 100ms;
            cursor: pointer;
        `;

        const iconContainer = document.createElement('div');
        iconContainer.className = 'css-175oi2r';
        iconContainer.style.cssText = 'align-items: center; justify-content: center; z-index: 10; width: 24px; height: 24px;';

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('fill', 'none');
        svg.setAttribute('width', '28');
        svg.setAttribute('height', '28');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.style.color = 'rgb(241, 243, 245)';

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute('fill', 'hsl(211, 20%, 95.3%)');
        path.setAttribute('d', 'M2 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 0v4h4V6H4zm10-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v4h4V6h-4zM2 16a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4zm2 0v4h4v-4H4zm10-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zm0 2v4h4v-4h-4z');

        svg.appendChild(path);
        iconContainer.appendChild(svg);

        const text = document.createElement('div');
        text.className = 'css-146c3p1 filter-text';
        text.style.cssText = `
            font-size: 18.75px;
            letter-spacing: 0px;
            color: rgb(241, 243, 245);
            font-weight: 400;
            line-height: 18.75px;
            font-family: InterVariable, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica;
        `;
        text.textContent = isFilterActive ? 'All Posts' : 'Media Only';

        button.appendChild(iconContainer);
        button.appendChild(text);
        button.addEventListener('click', toggleFilter);

        settingsLink.parentNode.insertBefore(button, settingsLink.nextSibling);
    };

    const addStyles = () => {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    };

    const initialize = () => {
        addStyles();
        createFilterButton();

        const observer = new MutationObserver((mutations) => {
            if (mutations.some(mutation => mutation.addedNodes.length)) {
                document.querySelectorAll(Object.values(POST_SELECTORS).join(',')).forEach(post => {
                    if (!post.classList.contains(HAS_MEDIA_CLASS)) {
                        processPost(post);
                    }
                });
            }

            if (!document.querySelector(`#${FILTER_BUTTON_ID}`)) {
                createFilterButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.querySelectorAll(Object.values(POST_SELECTORS).join(',')).forEach(processPost);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();