// ==UserScript==
// @name         Bluesky Text-Only Feed With Placeholders
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      1.3
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
// @downloadURL https://update.greasyfork.org/scripts/526467/Bluesky%20Text-Only%20Feed%20With%20Placeholders.user.js
// @updateURL https://update.greasyfork.org/scripts/526467/Bluesky%20Text-Only%20Feed%20With%20Placeholders.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function debugLog(label, data) {
        console.log(`[Bluesky Text-Only] ${label}:`, data);
    }
    debugLog("Script starting", "");

    GM_addStyle(`
    .bluesky-filter-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    }
    .bluesky-filter-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        color: #333;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(0,0,0,0.5);
        z-index: 10000;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
    }
    .bluesky-filter-dialog h2 {
        color: #0079d3;
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 0;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }
    .bluesky-filter-dialog textarea {
        width: 100%;
        height: 200px;
        margin-top: 10px;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #f9f9f9;
        color: #000;
        font-family: monospace;
    }
    .bluesky-filter-dialog .button-container {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    .bluesky-filter-dialog button {
        margin-left: 0;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1em;
        transition: opacity 0.2s ease-in-out;
    }
    .bluesky-filter-dialog button.cancel-btn {
        background: #f2f2f2;
        color: #333;
    }
    .bluesky-filter-dialog button.save-btn {
        background: #0079d3;
        color: white;
    }
    .bluesky-filter-dialog button:hover {
        opacity: 0.9;
    }
`);

    const isFirefox = navigator.userAgent.includes("Firefox");
    let blockedCount = 0;
    let menuCommandId = null;
    const processedPosts = new WeakSet();

    const storedWhitelist = JSON.parse(GM_getValue('whitelistedUsers', '[]'));
    const whitelistedUsers = storedWhitelist.map(u => normalizeUsername(u.toLowerCase()));

    function normalizeUsername(username) {
        return username.replace(/[\u200B\u200C\u200D\u200E\u200F\u202A-\u202F]/g, '').trim();
    }

    function updateMenuCommand() {
        debugLog("updateMenuCommand called. blockedCount", blockedCount);
        if (isFirefox) {
            if (!menuCommandId) {
                try {
                    menuCommandId = GM_registerMenuCommand('Configure Whitelist', createWhitelistConfigUI);
                } catch (e) {
                    debugLog("Error registering menu command on Firefox", e);
                }
            }
        } else {
            try {
                if (menuCommandId) {
                    GM_unregisterMenuCommand(menuCommandId);
                }
                menuCommandId = GM_registerMenuCommand(
                    `Configure Whitelist (${blockedCount} posts filtered)`,
                    createWhitelistConfigUI
                );
            } catch (e) {
                debugLog("Error registering menu command", e);
            }
        }
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

    function getFullPostContainer(element) {
        let current = element;
        while (current && current !== document.body) {
            if (
                current.matches('div[role="link"], div[role="listitem"], article') ||
                current.classList.contains('css-175oi2r')
            ) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    function containsVideoElement(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
        if (node.matches && node.matches(
            'video, [aria-label*="Embedded video player"], [aria-label*="Unmute video"], [aria-label*="Play video"]'
        )) {
            return true;
        }
        try {
            if (node.querySelector('video, [aria-label*="Embedded video player"], [aria-label*="Unmute video"], [aria-label*="Play video"]')) {
                return true;
            }
        } catch (e) { }
        if (node.shadowRoot) {
            try {
                if (node.shadowRoot.querySelector('video, [aria-label*="Embedded video player"], [aria-label*="Unmute video"], [aria-label*="Play video"]')) {
                    return true;
                }
            } catch (e) { }
            for (const child of node.shadowRoot.childNodes) {
                if (child.nodeType === Node.ELEMENT_NODE && containsVideoElement(child)) {
                    return true;
                }
            }
        }
        for (const child of node.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE && containsVideoElement(child)) {
                return true;
            }
        }
        return false;
    }

    function hasMediaContainerHeuristic(element) {
        const candidates = element.querySelectorAll("div[style*='padding-top:']");
        for (const candidate of candidates) {
            const inlineStyle = candidate.getAttribute("style") || "";
            if (inlineStyle.match(/padding-top:\s*[\d.]+%/)) {
                if (candidate.querySelector("div[style*='aspect-ratio:']")) {
                    return true;
                }
            }
        }
        return false;
    }

    // Helper: Returns true if any ancestor of 'element' has been marked as whitelisted.
    function isDescendantOfWhitelisted(element) {
        let current = element;
        while (current && current !== document.body) {
            if (current.dataset && current.dataset.blueskyWhitelisted === 'true') {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    function checkAndMaybeRemove(postContainer, attempt) {
        // If the post is already marked as whitelisted, do nothing.
        if (postContainer.dataset.blueskyWhitelisted === 'true') {
            return;
        }

        const authorLink = postContainer.querySelector('a[href^="/profile/"]');
        let username = '';
        if (authorLink) {
            const profileHref = authorLink.getAttribute('href');
            if (profileHref) {
                username = normalizeUsername('@' + profileHref.replace(/^\/profile\//, '').toLowerCase());
            }
        }

        if (username && whitelistedUsers.includes(username)) {
            debugLog('Post belongs to whitelisted user', username);
            postContainer.dataset.blueskyWhitelisted = 'true';
            return;
        }

        // If username isn't found, try a few more times.
        if (!username && attempt < 6) {
            setTimeout(() => checkAndMaybeRemove(postContainer, attempt + 1), 300);
            return;
        }

        // After retries, if username is still missing, check the post's text for any whitelisted handle.
        if (!username) {
            for (let whitelisted of whitelistedUsers) {
                if (postContainer.textContent.toLowerCase().includes(whitelisted)) {
                    debugLog('Post appears to be whitelisted based on text content', whitelisted);
                    postContainer.dataset.blueskyWhitelisted = 'true';
                    return;
                }
            }
        }

        // Proceed to check for media and hide it if found.
        const nonAvatarImages = Array.from(postContainer.querySelectorAll('img')).filter(img =>
            !img.closest('[data-testid="userAvatarImage"]')
        );
        const hasExpoImage = postContainer.querySelector('[data-expoimage]') !== null;
        const hasVideoContent = containsVideoElement(postContainer);
        const hasMediaContainer = hasMediaContainerHeuristic(postContainer);

        if (nonAvatarImages.length > 0 || hasExpoImage || hasVideoContent || hasMediaContainer) {
            const mediaDiv = postContainer.querySelector('div.css-175oi2r.r-18u37iz.r-1cvj4g8');
            if (mediaDiv) {
                mediaDiv.style.display = 'none';
            } else {
                postContainer.style.display = 'none';
            }
            blockedCount++;
            updateMenuCommand();
        }
    }

    function processPost(node) {
        const postContainer = getFullPostContainer(node);
        if (!postContainer) return;
        // If any ancestor of this container is already whitelisted, skip processing.
        if (isDescendantOfWhitelisted(postContainer)) return;
        if (processedPosts.has(postContainer)) return;
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

    observePosts();
    updateMenuCommand();
})();
