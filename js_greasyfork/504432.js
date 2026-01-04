// ==UserScript==
// @name        Remove Blacklisted Images with Sidebar
// @namespace   http://tampermonkey.net/
// @version     1.5
// @description Adds a sidebar to manage and display blacklisted tags and hides or shows images based on the blacklist on rule34.xxx.
// @author      Dramorian
// @match       https://rule34.xxx/index.php?page=post*
// @match       https://rule34.xxx/index.php?page=favorites*
// @match       https://rule34.xxx/index.php?page=comment*
// @exclude     https://rule34.xxx/index.php?page=post&s=view*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/504432/Remove%20Blacklisted%20Images%20with%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/504432/Remove%20Blacklisted%20Images%20with%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        DEBUG: true,
        SELECTORS: {
            IMAGES: 'img[title], div[id^="p"] > div.col1.thumb > a > img',
            FAVORITES: 'img[title]',
            COMMENTS: 'div[id^="p"] > div.col1.thumb > a > img',
            SIDEBAR_TARGET: 'div.tag-search',
            SIDEBAR_FALLBACK: '#content > h1'
        },
        STORAGE_KEYS: {
            DISABLED_TAGS: 'disabled_tags',
            TAG_BLACKLIST: 'tag_blacklist'
        }
    };

    // Utility functions
    const Logger = {
        log: (...args) => CONFIG.DEBUG && console.log('[Blacklist Manager]', ...args),
        error: (...args) => console.error('[Blacklist Manager]', ...args)
    };

    const Utils = {
        getCookie(name) {
            const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith(`${name}=`));
            return cookie ? cookie.split('=')[1] : null;
        },

        decodeBlacklist(encodedString) {
            return decodeURIComponent(encodedString).split('%20');
        },

        createElementFromHTML(html) {
            const container = document.createElement('div');
            container.innerHTML = html.trim();
            return container.firstChild;
        },

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };

    // Storage manager
    class StorageManager {
        static getDisabledTags() {
            try {
                return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.DISABLED_TAGS) || '[]');
            } catch (e) {
                Logger.error('Failed to parse disabled tags from localStorage:', e);
                return [];
            }
        }

        static setDisabledTags(tags) {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEYS.DISABLED_TAGS, JSON.stringify(tags));
            } catch (e) {
                Logger.error('Failed to save disabled tags to localStorage:', e);
            }
        }

        static clearDisabledTags() {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.DISABLED_TAGS);
        }

        static isTagDisabled(tag) {
            return this.getDisabledTags().includes(tag);
        }
    }

    // Blacklist manager
    class BlacklistManager {
        static getTagBlacklist() {
            const cookieValue = Utils.getCookie(CONFIG.STORAGE_KEYS.TAG_BLACKLIST);
            const blacklist = cookieValue ? Utils.decodeBlacklist(cookieValue) : [];
            Logger.log('Retrieved blacklist:', blacklist);
            return blacklist;
        }

        static containsExactTag(title, tags) {
            return tags.some(tag => {
                const regex = new RegExp(`\\b${tag}\\b`, 'i');
                const contains = regex.test(title);
                if (contains) Logger.log(`Title "${title}" contains tag "${tag}"`);
                return contains;
            });
        }

        static isTagDetectedOnPage(tag) {
            const elements = document.querySelectorAll(CONFIG.SELECTORS.IMAGES);
            return Array.from(elements).some(el => {
                const title = el.getAttribute('title');
                return title && this.containsExactTag(title, [tag]);
            });
        }

        static countPostsWithTag(tag) {
            const favoriteCount = this._countPostsBySelector(CONFIG.SELECTORS.FAVORITES, tag);
            const commentCount = this._countPostsBySelector(CONFIG.SELECTORS.COMMENTS, tag);
            const total = favoriteCount + commentCount;
            Logger.log(`Post count for tag ${tag}: ${total}`);
            return total;
        }

        static _countPostsBySelector(selector, tag) {
            const images = document.querySelectorAll(selector);
            return Array.from(images).filter(img => {
                const title = img.getAttribute('title');
                return title && this.containsExactTag(title, [tag]);
            }).length;
        }
    }

    // Post visibility manager
    class PostVisibilityManager {
        static updatePostsVisibility(tag, displayValue, important = false) {
            const elements = document.querySelectorAll(CONFIG.SELECTORS.IMAGES);

            elements.forEach(el => {
                const title = el.getAttribute('title');
                if (!title) return;

                const shouldUpdate = displayValue === '' ||
                    BlacklistManager.containsExactTag(title, [tag]);

                if (shouldUpdate) {
                    const parent = el.closest('span') || el.closest('div[id^="p"]');
                    if (parent) {
                        parent.style.display = displayValue;
                        if (important) {
                            parent.style.setProperty('display', displayValue, 'important');
                        }

                        const action = displayValue === 'none' ? 'Hiding' : 'Showing';
                        Logger.log(`${action} post for tag "${tag}"`);
                    }
                }
            });
        }

        static showPostsWithTags(tags) {
            tags.forEach(tag => this.updatePostsVisibility(tag, ''));
        }

        static hidePostsWithTags(tags) {
            if (tags.length === 0) return;
            tags.forEach(tag => this.updatePostsVisibility(tag, 'none', true));
        }

        static applyFiltering() {
            const disabledTags = StorageManager.getDisabledTags();
            const allTags = BlacklistManager.getTagBlacklist();
            const enabledTags = allTags.filter(tag => !disabledTags.includes(tag));

            Logger.log('Applying filtering - Disabled:', disabledTags, 'Enabled:', enabledTags);

            this.hidePostsWithTags(enabledTags);
            this.showPostsWithTags(disabledTags);
        }
    }

    // Sidebar manager
    class SidebarManager {
        constructor() {
            this.sidebar = null;
            this.isCollapsed = true;
        }

        create() {
            const targetElement = this._findInsertionTarget();
            if (!targetElement) {
                Logger.error('Suitable element for sidebar insertion not found.');
                return;
            }

            this.sidebar = this._createSidebarElement();
            targetElement.insertAdjacentElement('afterend', this.sidebar);

            this._attachEventListeners();
            this.update();

            Logger.log('Sidebar created and initialized');
        }

        _findInsertionTarget() {
            return document.querySelector(CONFIG.SELECTORS.SIDEBAR_TARGET) ||
                   document.querySelector(CONFIG.SELECTORS.SIDEBAR_FALLBACK);
        }

        _createSidebarElement() {
            const sidebarHTML = `
                <div id="blacklist-box">
                    <div id="sidebar-header">
                        <h2>Blacklisted</h2>
                        <button id="toggle-header" aria-label="Toggle Sidebar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class="toggle-icon">
                                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                            </svg>
                        </button>
                    </div>
                    <div id="sidebar-content" style="display: none;">
                        <ul id="blacklist-list" style="list-style: none;"></ul>
                    </div>
                    <div id="sidebar-footer">
                        <button id="disable-all-blacklists">Disable All</button>
                        <button id="re-enable-all-blacklists" style="display: none;">Re-enable All</button>
                    </div>
                </div>
            `;

            return Utils.createElementFromHTML(sidebarHTML);
        }

        _attachEventListeners() {
            // Toggle button
            const toggleButton = this.sidebar.querySelector('#toggle-header');
            const icon = toggleButton.querySelector('svg');

            toggleButton.addEventListener('click', () => {
                this._toggleCollapse(icon);
            });

            // Control buttons
            const disableAllBtn = this.sidebar.querySelector('#disable-all-blacklists');
            const enableAllBtn = this.sidebar.querySelector('#re-enable-all-blacklists');

            disableAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this._disableAllTags();
            });

            enableAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this._enableAllTags();
            });
        }

        _toggleCollapse(icon) {
            const content = this.sidebar.querySelector('#sidebar-content');
            this.isCollapsed = !this.isCollapsed;

            content.style.display = this.isCollapsed ? 'none' : 'block';
            icon.style.transform = this.isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)';
            icon.style.transition = 'transform 0.25s ease';

            Logger.log('Sidebar toggled:', this.isCollapsed ? 'collapsed' : 'expanded');
        }

        _disableAllTags() {
            const allTags = BlacklistManager.getTagBlacklist();
            StorageManager.setDisabledTags(allTags);
            this._toggleButtons(true);
            this.update();
            PostVisibilityManager.applyFiltering();
            Logger.log('All tags disabled');
        }

        _enableAllTags() {
            StorageManager.clearDisabledTags();
            this._toggleButtons(false);
            this.update();
            PostVisibilityManager.applyFiltering();
            Logger.log('All tags enabled');
        }

        _toggleButtons(allDisabled) {
            const disableBtn = this.sidebar.querySelector('#disable-all-blacklists');
            const enableBtn = this.sidebar.querySelector('#re-enable-all-blacklists');

            disableBtn.style.display = allDisabled ? 'none' : 'inline';
            enableBtn.style.display = allDisabled ? 'inline' : 'none';
        }

        update() {
            if (!this.sidebar) return;

            const blacklist = BlacklistManager.getTagBlacklist();
            const detectedTags = blacklist.filter(tag =>
                BlacklistManager.isTagDetectedOnPage(tag)
            );

            this._updateTagList(detectedTags);
            this._updateVisibility(detectedTags);
        }

        _updateTagList(detectedTags) {
            const listElement = this.sidebar.querySelector('#blacklist-list');
            listElement.innerHTML = '';

            let totalHiddenPosts = 0;

            detectedTags.forEach(tag => {
                const isDisabled = StorageManager.isTagDisabled(tag);
                const hiddenCount = BlacklistManager.countPostsWithTag(tag);

                if (!isDisabled) {
                    totalHiddenPosts += hiddenCount;
                }

                const listItem = this._createTagListItem(tag, isDisabled, hiddenCount);
                listElement.appendChild(listItem);
            });

            // Update header with total count
            const header = this.sidebar.querySelector('h2');
            header.textContent = `Blacklisted (${totalHiddenPosts})`;

            // Attach checkbox listeners
            this._attachCheckboxListeners();
        }

        _createTagListItem(tag, isDisabled, hiddenCount) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <label>
                    <input type="checkbox" class="blacklist-checkbox"
                           data-tag="${encodeURIComponent(tag)}"
                           ${isDisabled ? '' : 'checked'}>
                    ${tag} <span class="count">${hiddenCount}</span>
                </label>
            `;
            return listItem;
        }

        _attachCheckboxListeners() {
            const checkboxes = this.sidebar.querySelectorAll('.blacklist-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const tag = decodeURIComponent(e.target.getAttribute('data-tag'));
                    const isEnabled = e.target.checked;

                    this._toggleTag(tag, isEnabled);
                    Logger.log(`Tag "${tag}" ${isEnabled ? 'enabled' : 'disabled'}`);
                });
            });
        }

        _toggleTag(tag, isEnabled) {
            let disabledTags = StorageManager.getDisabledTags();

            if (isEnabled) {
                disabledTags = disabledTags.filter(t => t !== tag);
            } else {
                if (!disabledTags.includes(tag)) {
                    disabledTags.push(tag);
                }
            }

            StorageManager.setDisabledTags(disabledTags);
            PostVisibilityManager.applyFiltering();
        }

        _updateVisibility(detectedTags) {
            const sidebar = this.sidebar;

            if (detectedTags.length === 0) {
                sidebar.style.display = 'none';
                Logger.log('No blacklisted tags detected. Sidebar hidden.');
            } else {
                sidebar.style.display = '';
            }
        }
    }

    // Native sidebar cleanup
    class NativeSidebarManager {
        static removeNativeEffects() {
            this._handleBlacklistCount();
            this._removeSidebarElement();
        }

        static _handleBlacklistCount() {
            const blacklistCountElement = document.getElementById('blacklist-count');
            if (!blacklistCountElement) return;

            const postCount = parseInt(blacklistCountElement.textContent, 10);
            if (postCount > 0) {
                const hiddenLink = blacklistCountElement
                    .closest('h5')
                    ?.querySelector('a');

                if (hiddenLink) {
                    hiddenLink.click();
                    Logger.log('Clicked native "Hidden" button to remove blacklist effect');
                }
            }
        }

        static _removeSidebarElement() {
            const blacklistSidebar = document.getElementById('blacklisted-sidebar');
            if (blacklistSidebar) {
                blacklistSidebar.remove();
                Logger.log('Removed native blacklisted-sidebar element');
            }
        }
    }

    // Main application
    class BlacklistApp {
        constructor() {
            this.sidebarManager = new SidebarManager();
        }

        init() {
            try {
                // Clean up native effects first
                NativeSidebarManager.removeNativeEffects();

                // Create and initialize sidebar
                this.sidebarManager.create();

                // Apply initial filtering
                PostVisibilityManager.applyFiltering();

                Logger.log('Blacklist application initialized successfully');
            } catch (error) {
                Logger.error('Failed to initialize application:', error);
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new BlacklistApp().init();
        });
    } else {
        new BlacklistApp().init();
    }
})();
