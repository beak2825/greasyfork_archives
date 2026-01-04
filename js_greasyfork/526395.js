// ==UserScript==
// @name         Bluesky Text-Only Feed (Remove Entire Post for Images/Videos)
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      1.2
// @description  Completely remove any Bluesky posts that contain images or videos. If a post only contains a link preview, just that preview is removed. Posts from whitelisted users remain intact.
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
// @downloadURL https://update.greasyfork.org/scripts/526395/Bluesky%20Text-Only%20Feed%20%28Remove%20Entire%20Post%20for%20ImagesVideos%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526395/Bluesky%20Text-Only%20Feed%20%28Remove%20Entire%20Post%20for%20ImagesVideos%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Only process pages other than notifications.
    function shouldProcessPage() {
        return window.location.pathname !== '/notifications';
    }

    function debugLog(type, data = null) {
        console.log(`[Bluesky Text-Only] ${type}:`, data || '');
    }

    function normalizeUsername(username) {
        return username.replace(/[\u200B\u200C\u200D\u200E\u200F\u202A-\u202F]/g, '').trim();
    }

    let blockedCount = 0;
    let menuCommandId = null;
    const processedPosts = new WeakSet();

    const storedWhitelist = JSON.parse(GM_getValue('whitelistedUsers', '[]'));
    const whitelistedUsers = storedWhitelist.map(u => normalizeUsername(u.toLowerCase()));

    function updateMenuCommand() {
        if (menuCommandId) {
            GM_unregisterMenuCommand(menuCommandId);
        }
        menuCommandId = GM_registerMenuCommand(
            `Configure Whitelist (${blockedCount} posts filtered)`,
            createWhitelistConfigUI
        );
    }

    function createWhitelistConfigUI() {
        const overlay = document.createElement('div');
        overlay.className = 'bluesky-filter-overlay';
        const dialog = document.createElement('div');
        dialog.className = 'bluesky-filter-dialog';
        dialog.innerHTML = `
            <h2>Bluesky Whitelist</h2>
            <p>Enter usernames one per line in the format: <code>@blueskyuser.bsky.social</code></p>
            <textarea spellcheck="false">${storedWhitelist.join('\n')}</textarea>
            <div class="button-container">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save</button>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        const closeDialog = () => {
            dialog.remove();
            overlay.remove();
        };

        dialog.querySelector('.save-btn').addEventListener('click', () => {
            const newWhitelist = dialog.querySelector('textarea')
                .value.split('\n')
                .map(u => normalizeUsername(u.toLowerCase()))
                .filter(u => u.length > 0);
            GM_setValue('whitelistedUsers', JSON.stringify(newWhitelist));
            blockedCount = 0;
            closeDialog();
            location.reload();
        });

        dialog.querySelector('.cancel-btn').addEventListener('click', closeDialog);
        overlay.addEventListener('click', closeDialog);
    }

    // Walk up the DOM to try to find the full post container.
    function getFullPostContainer(element) {
        let current = element;
        while (current && current !== document.body) {
            if (
                current.matches('div[role="link"]') ||
                current.matches('div[role="listitem"]') ||
                current.matches('article') ||
                current.classList.contains('css-175oi2r')
            ) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    // A deep recursive function to detect video content.
    function containsVideoElement(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;

        // Check if the node itself qualifies.
        if (node.matches && node.matches(
            'video, [aria-label*="Embedded video player"], [aria-label*="Unmute video"], [aria-label*="Time remaining"], [aria-label*="Play video"]'
        )) {
            return true;
        }

        // Use querySelector on this node to search its entire subtree.
        try {
            if (node.querySelector('video, [aria-label*="Embedded video player"], [aria-label*="Unmute video"], [aria-label*="Time remaining"], [aria-label*="Play video"]')) {
                return true;
            }
        } catch (e) {
            // Some nodes may not support querySelector.
        }

        // Look into shadow DOM if available.
        if (node.shadowRoot) {
            try {
                if (node.shadowRoot.querySelector('video, [aria-label*="Embedded video player"], [aria-label*="Unmute video"], [aria-label*="Time remaining"], [aria-label*="Play video"]')) {
                    return true;
                }
            } catch (e) {}
            for (const child of node.shadowRoot.childNodes) {
                if (child.nodeType === Node.ELEMENT_NODE && containsVideoElement(child)) {
                    return true;
                }
            }
        }

        // Finally, iterate through all child nodes (using childNodes for completeness).
        for (const child of node.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE && containsVideoElement(child)) {
                return true;
            }
        }
        return false;
    }

    // A new helper to look for media container cues.
    function hasMediaContainerHeuristic(element) {
        // Look for any descendant element with inline style containing "padding-top:" (with a percentage value)
        // that also has a descendant with an inline style containing "aspect-ratio:".
        const candidates = element.querySelectorAll("div[style*='padding-top:']");
        for (const candidate of candidates) {
            // Get the raw style attribute.
            const inlineStyle = candidate.getAttribute("style") || "";
            // Check if there's a padding-top percentage value.
            if (inlineStyle.match(/padding-top:\s*[\d.]+%/)) {
                // Now check for a descendant with an "aspect-ratio:".
                if (candidate.querySelector("div[style*='aspect-ratio:']")) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkAndMaybeRemove(postContainer, attempt) {
        const authorLink = postContainer.querySelector('a[href^="/profile/"]');
        let username = '';

        if (authorLink) {
            const profileHref = authorLink.getAttribute('href');
            if (profileHref) {
                username = normalizeUsername('@' + profileHref.replace(/^\/profile\//, '').toLowerCase());
            }
        }

        // Allow a few attempts for the username to be populated.
        if (!username && attempt < 3) {
            setTimeout(() => checkAndMaybeRemove(postContainer, attempt + 1), 300);
            return;
        }

        if (username && whitelistedUsers.includes(username)) {
            debugLog('Post belongs to whitelisted user', username);
            return;
        }

        // Media detection:
        // 1. Non-avatar images.
        const nonAvatarImages = Array.from(postContainer.querySelectorAll('img')).filter(img =>
            !img.closest('[data-testid="userAvatarImage"]')
        );
        // 2. Expo images.
        const hasExpoImage = postContainer.querySelector('[data-expoimage]') !== null;
        // 3. Video content using our deep recursive search.
        const hasVideoContent = containsVideoElement(postContainer);
        // 4. Media container heuristic (updated to catch any padding-top percentage with an aspect-ratio).
        const hasMediaContainer = hasMediaContainerHeuristic(postContainer);

        debugLog('Checking post for media', {
            username,
            nonAvatarImages,
            hasExpoImage,
            hasVideoContent,
            hasMediaContainer,
            rawHTML: postContainer.innerHTML
        });

        // If any media is detected, remove the post.
        if (
            nonAvatarImages.length > 0 ||
            hasExpoImage ||
            hasVideoContent ||
            hasMediaContainer
        ) {
            debugLog('Removing post due to media content', { username });
            postContainer.remove();
            blockedCount++;
            updateMenuCommand();
            return;
        }
    }

    function processPost(node) {
        if (!shouldProcessPage()) return;
        const postContainer = getFullPostContainer(node);
        if (!postContainer || processedPosts.has(postContainer)) return;
        processedPosts.add(postContainer);
        checkAndMaybeRemove(postContainer, 0);
    }

    function observePosts() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes).forEach(node => processPost(node));
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (shouldProcessPage()) observePosts();
    updateMenuCommand();
})();
