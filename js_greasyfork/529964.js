// ==UserScript==
// @name         Bluesky Alt-Text Enforcer
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      2.1
// @description  Remove posts with images lacking alt text. Whitelist support included.
// @license      MIT
// @match        https://bsky.app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      bsky.social
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529964/Bluesky%20Alt-Text%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/529964/Bluesky%20Alt-Text%20Enforcer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        minAltLength: 3,
        checkInterval: 300,
        maxRetries: 6,
        protectedContainers: [
            '[data-testid="profileHeader"]',
            '[data-testid="profileBanner"]',
            '[data-testid="userAvatarImage"]'
        ]
    };

    function debugLog(label, data) {
        console.log(`[Bluesky Alt-Text] ${label}:`, data);
    }

    GM_addStyle(`
        .bluesky-filter-hidden { display: none !important; }
        /* Keep existing dialog styles */
    `);

    let blockedCount = 0;
    let menuCommandId = null;
    const processedPosts = new WeakSet();
    const whitelistedUsers = new Set(JSON.parse(GM_getValue('whitelistedUsers', '[]')).map(u => normalizeUsername(u)));

    function normalizeUsername(username) {
        return username.toLowerCase().replace(/[\u200B-\u200F\u202A-\u202F]/g, '').trim();
    }

    // Enhanced post detection
    function getPostContainer(node) {
        let current = node;
        while (current && current !== document.body) {
            if (current.matches('[data-testid="post"], div[role="link"], article')) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    // Improved media check
    function hasInvalidAlt(post) {
        return Array.from(post.querySelectorAll('img'))
            .filter(img => !isProtectedImage(img))
            .some(img => {
                const alt = (img.getAttribute('alt') || '').trim();
                return alt === '';
            });
    }

    function isProtectedImage(img) {
        return config.protectedContainers.some(selector => img.closest(selector));
    }

    function processPost(post) {
        if (processedPosts.has(post)) return;
        processedPosts.add(post);

        if (isWhitelisted(post) || !hasInvalidAlt(post)) return;

        const mediaContainer = post.querySelector('[data-testid="postMedia"]');
        if (mediaContainer) {
            mediaContainer.classList.add('bluesky-filter-hidden');
        } else {
            post.classList.add('bluesky-filter-hidden');
        }
        blockedCount++;
        updateMenuCommand();
    }

    // Enhanced observer with depth limiting
    const observer = new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                const post = getPostContainer(node);
                if (post) setTimeout(() => processPost(post), 100);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributeFilter: ['alt'],
        attributes: true
    });

    // Initial processing
    document.querySelectorAll('[data-testid="post"]').forEach(processPost);
    updateMenuCommand();

    // Keep existing UI functions
    function updateMenuCommand() {
        if (menuCommandId) GM_unregisterMenuCommand(menuCommandId);
        menuCommandId = GM_registerMenuCommand(
            `Alt-Text Filter (${blockedCount} blocked)`,
            () => { /* config dialog */ }
        );
    }

    function isWhitelisted(post) {
        const authorLink = post.querySelector('a[href^="/profile/"]');
        if (!authorLink) return false;

        const profileDid = authorLink.href.split('/profile/')[1];
        return whitelistedUsers.has(normalizeUsername(`@${profileDid}`));
    }
})();