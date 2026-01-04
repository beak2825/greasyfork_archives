// ==UserScript==
// @name         Bluesky Content Manager BETA
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      3.02
// @description  Powerful content filtering for Bluesky: block keywords, enforce alt text, and auto-whitelist accounts you follow.
// @license      MIT
// @match        https://bsky.app/*
// @icon         https://i.ibb.co/YySpmDk/Bluesky-Content-Manager.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      bsky.social
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529877/Bluesky%20Content%20Manager%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/529877/Bluesky%20Content%20Manager%20BETA.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    class Utilities {
        debugLog(label, data) {
            console.log(`[Bluesky Content Manager] ${label}:`, data);
        }

        normalizeUsername(username) {
            return username.toLowerCase()
                .replace(/[\u200B-\u200F\u202A-\u202F]/g, '')
                .trim();
        }

        escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        cleanText(text) {
            return text.normalize('NFKD')
                .replace(/\s+/g, ' ')
                .toLowerCase()
                .trim();
        }

        getPostContainer(node) {
            let current = node;
            while (current && current !== document.body) {
                if (current.matches('[data-testid="post"], div[role="link"], article')) {
                    return current;
                }
                current = current.parentElement;
            }
            return null;
        }

        shouldProcessPage() {
            return window.location.pathname !== '/notifications';
        }

        isWhitelisted(post, whitelistedUsers) {
            const authorLink = post.querySelector('a[href^="/profile/"]');
            if (!authorLink) return false;
            const profileIdentifier = authorLink.href.split('/profile/')[1].split(/[/?#]/)[0];
            return whitelistedUsers.has(this.normalizeUsername(`@${profileIdentifier}`));
        }
    }

    class BlueskyAPI {
        constructor(utilities) {
            this.utilities = utilities;
            this.sessionToken = null;
            this.currentUserDid = null;
            this.profileCache = new Map();
            this.cacheTTL = 30 * 60 * 1000; // 30 minutes in milliseconds
        }

        async waitForAuth() {
            return new Promise((resolve, reject) => {
                const maxAttempts = 30;
                let attempts = 0;
                const checkAuth = () => {
                    attempts++;
                    const session = localStorage.getItem('BSKY_STORAGE');
                    if (session) {
                        try {
                            const parsed = JSON.parse(session);
                            if (parsed.session?.accounts?.[0]?.accessJwt) {
                                this.sessionToken = parsed.session.accounts[0].accessJwt;
                                this.currentUserDid = parsed.session.accounts[0].did;
                                this.utilities.debugLog('Auth Success', 'Token retrieved');
                                resolve(true);
                                return;
                            }
                        } catch (e) {
                            this.utilities.debugLog('Auth Error', e);
                        }
                    }
                    if (attempts >= maxAttempts) {
                        reject('Authentication timeout');
                        return;
                    }
                    setTimeout(checkAuth, 1000);
                };
                checkAuth();
            });
        }

        async autoWhitelistFollowedAccounts(whitelistedUsers) {
            if (!this.sessionToken || !this.currentUserDid) {
                this.utilities.debugLog('AutoWhitelist', 'Missing session token or current user DID');
                return;
            }

            try {
                // Clear expired cache entries
                const now = Date.now();
                for (const [key, value] of this.profileCache.entries()) {
                    if (now - value.timestamp > this.cacheTTL) {
                        this.profileCache.delete(key);
                    }
                }

                const follows = await this.fetchAllFollows();
                follows.forEach(follow => {
                    let handle = (follow.subject && follow.subject.handle) || follow.handle;
                    if (handle) {
                        if (!handle.startsWith('@')) handle = '@' + handle;
                        const normalized = this.utilities.normalizeUsername(handle);
                        whitelistedUsers.add(normalized);
                        // Cache with timestamp
                        this.profileCache.set(normalized, {
                            handle: handle,
                            timestamp: Date.now()
                        });
                    }
                });
                this.utilities.debugLog('AutoWhitelist', `Whitelisted ${whitelistedUsers.size} accounts`);
            } catch (err) {
                this.utilities.debugLog('AutoWhitelist Error', err);
            }
        }

        async fetchAllFollows(cursor = null, accumulated = []) {
            let url = `https://bsky.social/xrpc/app.bsky.graph.getFollows?actor=${encodeURIComponent(this.currentUserDid)}`;
            if (cursor) url += `&cursor=${cursor}`;

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': `Bearer ${this.sessionToken}`,
                        'Accept': 'application/json'
                    },
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                const newAccumulated = accumulated.concat(data.follows || []);
                                if (data.cursor) {
                                    this.fetchAllFollows(data.cursor, newAccumulated).then(resolve).catch(reject);
                                } else {
                                    resolve(newAccumulated);
                                }
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            reject(`HTTP ${response.status}`);
                        }
                    },
                    onerror: (err) => reject(err)
                });
            });
        }
    }

    class FilterEngine {
        constructor(utilities, api) {
            this.utilities = utilities;
            this.api = api;
            this.filteredTerms = (JSON.parse(GM_getValue('filteredTerms', '[]')) || [])
                .map(t => t.trim().toLowerCase());
            this.whitelistedUsers = new Set((JSON.parse(GM_getValue('whitelistedUsers', '[]')) || [])
                .map(u => this.utilities.normalizeUsername(u)));
            this.blockedCount = 0;
            this.processingQueue = new Set();
            this.processingTimeout = null;
            this.updateCallback = null;
        }

        async initialize() {
            await this.api.autoWhitelistFollowedAccounts(this.whitelistedUsers);
        }

        setUpdateCallback(callback) {
            this.updateCallback = callback;
        }

        queuePost(post) {
            this.processingQueue.add(post);
            if (this.processingTimeout) {
                clearTimeout(this.processingTimeout);
            }
            this.processingTimeout = setTimeout(() => this.processQueue(), 100);
        }

        processQueue() {
            const postsToProcess = Array.from(this.processingQueue);
            this.processingQueue.clear();
            postsToProcess.forEach(post => this.processPost(post));
        }

        async processPost(post) {
            if (this.isWhitelisted(post)) return false;

            const postContainer = this.utilities.getPostContainer(post);
            if (!postContainer) return false;

            if (this.checkAuthorFilter(post) ||
                this.checkContentFilter(post) ||
                this.checkMediaFilter(post) ||
                this.checkAriaLabelsFilter(post)) {
                postContainer.remove();
                this.blockedCount++;
                if (this.updateCallback) this.updateCallback();
                return true;
            }
            return false;
        }

        isWhitelisted(post) {
            const authorLink = post.querySelector('a[href^="/profile/"]');
            if (!authorLink) return false;
            const profileIdentifier = authorLink.href.split('/profile/')[1].split(/[/?#]/)[0];
            return this.whitelistedUsers.has(this.utilities.normalizeUsername(`@${profileIdentifier}`));
        }

        checkAuthorFilter(post) {
            const authorLink = post.querySelector('a[href^="/profile/"]');
            if (!authorLink) return false;

            const nameElement = authorLink.querySelector('span');
            const rawAuthorName = nameElement ? nameElement.textContent : authorLink.textContent;
            const cleanedAuthorName = this.utilities.cleanText(rawAuthorName);

            return this.filteredTerms.some(term => {
                const pattern = new RegExp(this.utilities.escapeRegExp(term), 'i');
                return pattern.test(rawAuthorName.toLowerCase()) || pattern.test(cleanedAuthorName);
            });
        }

        checkContentFilter(post) {
            const postContentElement = post.querySelector('div[data-testid="postText"]');
            if (!postContentElement) return false;

            const rawPostText = postContentElement.textContent;
            const cleanedPostText = this.utilities.cleanText(rawPostText);

            return this.filteredTerms.some(term => {
                const pattern = new RegExp(this.utilities.escapeRegExp(term), 'i');
                return pattern.test(rawPostText.toLowerCase()) || pattern.test(cleanedPostText);
            });
        }

        checkMediaFilter(post) {
            const imageElements = post.querySelectorAll('img');
            if (imageElements.length === 0) return false;

            const altTexts = Array.from(imageElements).map(img => img.alt);
            const cleanedAltTexts = altTexts.map(alt => this.utilities.cleanText(alt));

            return this.filteredTerms.some(term => {
                const pattern = new RegExp(this.utilities.escapeRegExp(term), 'i');
                return altTexts.some(alt => pattern.test(alt.toLowerCase())) ||
                       cleanedAltTexts.some(alt => pattern.test(alt));
            });
        }

        checkAriaLabelsFilter(post) {
            const ariaLabelElements = post.querySelectorAll('[aria-label]');
            if (ariaLabelElements.length === 0) return false;

            const ariaLabels = Array.from(ariaLabelElements).map(el => el.getAttribute('aria-label'));
            const cleanedAriaLabels = ariaLabels.map(label => this.utilities.cleanText(label));

            return this.filteredTerms.some(term => {
                const pattern = new RegExp(this.utilities.escapeRegExp(term), 'i');
                return ariaLabels.some(label => pattern.test(label.toLowerCase())) ||
                       cleanedAriaLabels.some(label => pattern.test(label));
            });
        }
    }

    class AltTextEnforcer {
        constructor(utilities) {
            this.utilities = utilities;
            this.enabled = GM_getValue('altTextEnforcementEnabled', true);
            this.protectedContainers = [
                '[data-testid="profileHeader"]',
                '[data-testid="profileBanner"]',
                '[data-testid="userAvatarImage"]'
            ];
            this.lastCheckTime = 0;
        }

        checkPost(post) {
            if (!this.enabled || this.utilities.isWhitelisted(post, [])) return false;

            const now = Date.now();
            if (now - this.lastCheckTime < 200) return false;
            this.lastCheckTime = now;

            if (this.hasInvalidAlt(post)) {
                const mediaContainer = post.querySelector('[data-testid="postMedia"]');
                if (mediaContainer) {
                    mediaContainer.classList.add('bluesky-filter-hidden');
                } else {
                    post.classList.add('bluesky-filter-hidden');
                }
                return true;
            }
            return false;
        }

        hasInvalidAlt(element) {
            const visibleImages = Array.from(element.querySelectorAll('img'))
                .filter(img => {
                    const rect = img.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0 && !this.isProtectedImage(img);
                });

            return visibleImages.some(img => {
                const alt = (img.getAttribute('alt') || '').trim();
                return alt === '';
            });
        }

        isProtectedImage(img) {
            return this.protectedContainers.some(selector => img.closest(selector));
        }

        setEnabled(enabled) {
            this.enabled = enabled;
            GM_setValue('altTextEnforcementEnabled', enabled);
        }
    }

    class ContentManagerUI {
        constructor(filterEngine, altTextEnforcer, updateCallback) {
            this.filterEngine = filterEngine;
            this.altTextEnforcer = altTextEnforcer;
            this.menuCommandId = null;
            this.dialogElements = null;
            this.filterEngine.setUpdateCallback(updateCallback);
        }

        getDialogStyles() {
            return `
            .bluesky-filter-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 1000000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                min-width: 300px;
                max-width: 350px;
                font-family: Arial, sans-serif;
                color: #333;
            }
            .bluesky-filter-dialog h2 {
                margin-top: 0;
                color: #0079d3;
                font-size: 1.5em;
                font-weight: bold;
            }
            .bluesky-filter-dialog p {
                font-size: 0.9em;
                margin-bottom: 10px;
                color: #555;
            }
            .bluesky-filter-dialog textarea {
                width: calc(100% - 16px);
                height: 150px;
                padding: 8px;
                margin: 10px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-family: monospace;
                background: #f9f9f9;
                color: #000;
            }
            .bluesky-filter-dialog label {
                display: block;
                margin-top: 10px;
                font-size: 0.9em;
                color: #333;
            }
            .bluesky-filter-dialog input[type="checkbox"] {
                margin-right: 6px;
            }
            .bluesky-filter-dialog .button-container {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 10px;
            }
            .bluesky-filter-dialog button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1em;
            }
            .bluesky-filter-dialog .save-btn {
                background-color: #0079d3;
                color: white;
            }
            .bluesky-filter-dialog .cancel-btn {
                background-color: #f2f2f2;
                color: #333;
            }
            .bluesky-filter-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 999999;
            }
            `;
        }

        updateMenuCommand(blockedCount) {
            if (this.menuCommandId) {
                GM_unregisterMenuCommand(this.menuCommandId);
            }
            this.menuCommandId = GM_registerMenuCommand(
                `Configure Filters (${blockedCount} blocked)`,
                () => this.showConfigUI()
            );
        }

        showConfigUI() {
            // Clean up any existing dialog first
            this.cleanupDialog();

            const overlay = document.createElement('div');
            overlay.className = 'bluesky-filter-overlay';

            const dialog = document.createElement('div');
            dialog.className = 'bluesky-filter-dialog';
            dialog.innerHTML = `
                <h2>Bluesky Content Manager</h2>
                <p>Blocklist Keywords (one per line). Filtering is case-insensitive.</p>
                <textarea spellcheck="false">${this.filterEngine.filteredTerms.join('\n')}</textarea>
                <label>
                    <input type="checkbox" ${this.altTextEnforcer.enabled ? 'checked' : ''}>
                    Enable Alt-Text Enforcement
                </label>
                <div class="button-container">
                    <button class="cancel-btn">Cancel</button>
                    <button class="save-btn">Save</button>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(dialog);

            this.dialogElements = { overlay, dialog };

            const saveBtn = dialog.querySelector('.save-btn');
            const cancelBtn = dialog.querySelector('.cancel-btn');
            const checkbox = dialog.querySelector('input[type="checkbox"]');

            const saveHandler = async () => {
                const textareaValue = dialog.querySelector('textarea').value;
                const newKeywords = textareaValue.split('\n')
                    .map(k => k.trim().toLowerCase())
                    .filter(k => k.length > 0);

                await GM_setValue('filteredTerms', JSON.stringify(newKeywords));
                this.filterEngine.filteredTerms = newKeywords;

                this.altTextEnforcer.setEnabled(checkbox.checked);

                this.filterEngine.blockedCount = 0;
                this.cleanupDialog();
                location.reload();
            };

            const cancelHandler = () => {
                this.cleanupDialog();
            };

            saveBtn.addEventListener('click', saveHandler, { once: true });
            cancelBtn.addEventListener('click', cancelHandler, { once: true });
            overlay.addEventListener('click', cancelHandler, { once: true });
        }

        cleanupDialog() {
            if (this.dialogElements) {
                const { overlay, dialog } = this.dialogElements;
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                if (dialog && dialog.parentNode) dialog.parentNode.removeChild(dialog);
                this.dialogElements = null;
            }
        }

        cleanup() {
            this.cleanupDialog();
            if (this.menuCommandId) {
                GM_unregisterMenuCommand(this.menuCommandId);
                this.menuCommandId = null;
            }
        }
    }

    class BlueskyContentManager {
        constructor() {
            this.utilities = new Utilities();
            this.api = new BlueskyAPI(this.utilities);
            this.filterEngine = new FilterEngine(this.utilities, this.api);
            this.altTextEnforcer = new AltTextEnforcer(this.utilities);
            this.ui = new ContentManagerUI(this.filterEngine, this.altTextEnforcer, this.updateBlockedCount.bind(this));

            this.blockedCount = 0;
            this.observer = null;
            this.init();
        }

        async init() {
            this.injectStyles();
            await this.api.waitForAuth();
            await this.filterEngine.initialize();
            this.setupObservers();
            this.ui.updateMenuCommand(this.blockedCount);
            this.utilities.debugLog('Script Loaded', {
                version: '3.03',
                timestamp: new Date().toISOString()
            });

            // Clean up on page navigation
            window.addEventListener('beforeunload', this.cleanup.bind(this));
        }

        cleanup() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            this.ui.cleanup();
        }

        updateBlockedCount() {
            this.blockedCount = this.filterEngine.blockedCount;
            this.ui.updateMenuCommand(this.blockedCount);
        }

        injectStyles() {
            const CSS = `
            .bluesky-filter-hidden { display: none !important; }
            .content-filtered {
                display: none !important;
                height: 0 !important;
                overflow: hidden !important;
            }
            ${this.ui.getDialogStyles()}
            `;
            GM_addStyle(CSS);
        }

        setupObservers() {
            if (!this.utilities.shouldProcessPage()) return;

            document.querySelectorAll('[data-testid="post"], article, div[role="link"]')
                .forEach(post => this.processPost(post));

            this.observer = new MutationObserver(mutations => {
                if (!this.utilities.shouldProcessPage()) return;

                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        Array.from(mutation.addedNodes)
                            .filter(node => node.nodeType === Node.ELEMENT_NODE)
                            .forEach(node => this.handleNewNode(node));
                    } else if (mutation.type === 'attributes' &&
                              (mutation.attributeName === 'alt' || mutation.attributeName === 'aria-label')) {
                        const container = this.utilities.getPostContainer(mutation.target);
                        if (container) this.filterEngine.queuePost(container);
                    }
                });
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['alt', 'aria-label']
            });
        }

        handleNewNode(node) {
            const authorLinks = node.querySelectorAll('a[href^="/profile/"]');
            const images = node.querySelectorAll('img');
            const ariaLabels = node.querySelectorAll('[aria-label]');

            if (authorLinks.length > 0 || images.length > 0 || ariaLabels.length > 0) {
                const container = this.utilities.getPostContainer(node) || node;
                this.filterEngine.queuePost(container);
            }
        }

        async processPost(post) {
            if (!this.utilities.shouldProcessPage() ||
                post.classList.contains('bluesky-processed')) {
                return;
            }

            const wasFiltered = await this.filterEngine.processPost(post);
            const wasHiddenByAltText = this.altTextEnforcer.checkPost(post);

            if (wasFiltered || wasHiddenByAltText) {
                this.updateBlockedCount();
            }

            post.classList.add('bluesky-processed');
        }
    }

    // Instantiate the manager
    const manager = new BlueskyContentManager();

    // Clean up when the script is unloaded
    (function() {
        const originalUnload = window.onunload;
        window.onunload = function() {
            if (typeof originalUnload === 'function') {
                originalUnload();
            }
            manager.cleanup();
        };
    })();
})();