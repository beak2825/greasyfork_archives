// ==UserScript==
// @name         Universal Booru Tag Copier
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Add a copy button to copy all non-meta tags from major booru sites with settings
// @author       Zelest Carlyone
// @match        https://danbooru.donmai.us/*
// @match        https://safebooru.donmai.us/*
// @match        https://gelbooru.com/*
// @match        https://*.gelbooru.com/*
// @match        https://rule34.xxx/*
// @match        https://e621.net/*
// @match        https://e926.net/*
// @match        https://konachan.*/*
// @match        https://yande.re/*
// @match        https://*.zerochan.net/*
// @match        https://*.sankakucomplex.com/*
// @match        https://safebooru.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538319/Universal%20Booru%20Tag%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/538319/Universal%20Booru%20Tag%20Copier.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Settings management
    const SETTINGS_KEY = 'booru_tag_copier_settings';

    function getSettings() {
        const defaultSettings = {
            categoryOrder: ['general', 'character', 'copyright', 'artist'],
            filterCensor: false
        };

        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
        } catch (e) {
            return defaultSettings;
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    function cleanTagName(tagName) {
        // List of face emoticons that should keep their underscores
        const emoticons = ["o_o", "0_0", "|_|", "._.", "^_^", ">_<", "@_@", ">_@", "+_+", "+_-", "=_=", "<o>_<o>", "<|>_<|>"];

        // If it's an emoticon, keep it as-is
        if (emoticons.includes(tagName)) {
            return tagName;
        }

        // Otherwise, replace underscores with spaces
        return tagName.replace(/_/g, " ");
    }

    // Detect which site we're on
    function detectSite() {
        const hostname = window.location.hostname.toLowerCase();

        // Danbooru family
        if (hostname.includes("danbooru") || hostname.includes("safebooru.donmai")) {
            return "danbooru";
        }
        // Gelbooru family (includes rule34.xxx, safebooru.org, etc.)
        else if (hostname.includes("gelbooru") || hostname.includes("rule34.xxx") || hostname.includes("safebooru.org")) {
            return "gelbooru";
        }
        // E621/E926 family
        else if (hostname.includes("e621") || hostname.includes("e926")) {
            return "e621";
        }
        // Moebooru family (Konachan, Yande.re, etc.)
        else if (hostname.includes("konachan") || hostname.includes("yande.re")) {
            return "moebooru";
        }
        // Sankaku family
        else if (hostname.includes("sankakucomplex")) {
            return "sankaku";
        }
        // Zerochan
        else if (hostname.includes("zerochan")) {
            return "zerochan";
        }

        return null;
    }

    // Get site-specific selectors
    function getSiteConfig(site) {
        if (site === "danbooru") {
            return {
                tagSection: "#tag-list",
                categories: [
                    { selector: "ul.general-tag-list li", name: "general" },
                    { selector: "ul.character-tag-list li", name: "character" },
                    { selector: "ul.copyright-tag-list li", name: "copyright" },
                    { selector: "ul.artist-tag-list li", name: "artist" },
                ],
                getTagName: (item) => {
                    // Try data-tag-name first
                    const dataName = item.getAttribute("data-tag-name");
                    if (dataName) return dataName;

                    // Fallback: try to get from search link
                    const searchLink = item.querySelector("a.search-tag");
                    if (searchLink) return searchLink.textContent?.trim();

                    return null;
                },
            };
        } else if (site === "gelbooru") {
            return {
                tagSection: "#tag-list, #tag-sidebar",
                categories: [
                    { selector: "li.tag-type-general", name: "general" },
                    { selector: "li.tag-type-character", name: "character" },
                    { selector: "li.tag-type-copyright", name: "copyright" },
                    { selector: "li.tag-type-artist", name: "artist" },
                ],
                getTagName: (item) => {
                    const link = item.querySelector('a[href*="tags="]');
                    return link ? link.textContent?.trim() : null;
                },
            };
        } else if (site === "e621") {
            return {
                tagSection: "#tag-list",
                categories: [
                    { selector: "ul.general-tag-list li.tag-list-item", name: "general" },
                    { selector: "ul.character-tag-list li.tag-list-item", name: "character" },
                    { selector: "ul.copyright-tag-list li.tag-list-item", name: "copyright" },
                    { selector: "ul.artist-tag-list li.tag-list-item", name: "artist" },
                ],
                getTagName: (item) => {
                    const nameAttr = item.getAttribute("data-name");
                    if (nameAttr) return nameAttr;
                    const nameSpan = item.querySelector(".tag-list-name");
                    return nameSpan ? nameSpan.textContent?.trim() : null;
                },
            };
        } else if (site === "moebooru") {
            return {
                tagSection: "#tag-sidebar",
                categories: [
                    { selector: "li.tag-type-general", name: "general" },
                    { selector: "li.tag-type-character", name: "character" },
                    { selector: "li.tag-type-copyright", name: "copyright" },
                    { selector: "li.tag-type-artist", name: "artist" },
                ],
                getTagName: (item) => {
                    const nameAttr = item.getAttribute("data-name");
                    if (nameAttr) return nameAttr;
                    const link = item.querySelector('a[href*="tags="]');
                    return link ? link.textContent?.trim() : null;
                },
            };
        } else if (site === "sankaku") {
            return {
                tagSection: "#tag-sidebar, .tag-sidebar",
                categories: [
                    { selector: 'li[class*="tag-type-general"]', name: "general" },
                    { selector: 'li[class*="tag-type-character"]', name: "character" },
                    { selector: 'li[class*="tag-type-copyright"]', name: "copyright" },
                    { selector: 'li[class*="tag-type-artist"]', name: "artist" },
                ],
                getTagName: (item) => {
                    const link = item.querySelector("a");
                    return link ? link.textContent?.trim() : null;
                },
            };
        } else if (site === "zerochan") {
            return {
                tagSection: "#tags, .tags",
                categories: [{ selector: 'a[href*="/"]', name: "general" }],
                getTagName: (item) => item.textContent?.trim(),
            };
        }

        return null;
    }

    // Category display names and icons
    const categoryInfo = {
        general: { label: 'General Tags', icon: '🏷️', color: '#0073e6' },
        character: { label: 'Character Tags', icon: '👤', color: '#00aa00' },
        copyright: { label: 'Copyright/Series', icon: '©️', color: '#dd00dd' },
        artist: { label: 'Artist Tags', icon: '🎨', color: '#ee8800' }
    };

    // Create settings panel
    function createSettingsPanel() {
        const settings = getSettings();

        const panel = document.createElement('div');
        panel.id = 'tag-copier-settings';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #0073e6;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: sans-serif;
            font-size: 14px;
            color: #333;
            min-width: 350px;
            max-width: 400px;
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #0073e6;">Tag Copier Settings</h3>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                    Tag Order (drag to reorder):
                </label>
                <div id="category-order-list" style="
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 5px;
                    background: #f8f9fa;
                ">
                    <!-- Categories will be added here -->
                </div>
                <div style="margin-top: 5px; font-size: 11px; color: #666;">
                    💡 Drag categories to change the order they appear in copied tags
                </div>
            </div>

            <label style="display: block; margin-bottom: 20px; cursor: pointer;">
                <input type="checkbox" id="filterCensor" ${settings.filterCensor ? 'checked' : ''}
                       style="margin-right: 8px;">
                Filter out tags containing "censor"
            </label>

            <div style="text-align: right;">
                <button id="settings-cancel" style="margin-right: 10px; padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                <button id="settings-save" style="padding: 8px 16px; background: #0073e6; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
            </div>
        `;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'tag-copier-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        // Add category items
        const orderList = panel.querySelector('#category-order-list');
        settings.categoryOrder.forEach((category, index) => {
            const info = categoryInfo[category];
            const item = createCategoryItem(category, info, index);
            orderList.appendChild(item);
        });

        // Setup drag and drop
        setupDragAndDrop(orderList);

        // Event handlers
        panel.querySelector('#settings-save').addEventListener('click', () => {
            const newSettings = {
                categoryOrder: getCategoryOrder(orderList),
                filterCensor: panel.querySelector('#filterCensor').checked
            };
            saveSettings(newSettings);
            closeSettingsPanel();
            showFeedback("⚙️ Settings saved!", "#28a745");
        });

        panel.querySelector('#settings-cancel').addEventListener('click', closeSettingsPanel);
        overlay.addEventListener('click', closeSettingsPanel);
    }

    function createCategoryItem(category, info, index) {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.draggable = true;
        item.dataset.category = category;
        item.style.cssText = `
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            margin: 5px 0;
            cursor: move;
            display: flex;
            align-items: center;
            transition: all 0.2s;
        `;

        item.innerHTML = `
            <span style="font-size: 18px; margin-right: 10px;">${info.icon}</span>
            <span style="flex: 1; font-weight: 500;">${info.label}</span>
            <span style="color: #999; font-size: 11px;">☰</span>
        `;

        // Hover effect
        item.addEventListener('mouseenter', () => {
            item.style.background = '#f0f0f0';
            item.style.borderColor = info.color;
        });
        item.addEventListener('mouseleave', () => {
            item.style.background = 'white';
            item.style.borderColor = '#ddd';
        });

        return item;
    }

    function setupDragAndDrop(container) {
        let draggedItem = null;

        container.addEventListener('dragstart', (e) => {
            draggedItem = e.target.closest('.category-item');
            if (draggedItem) {
                draggedItem.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        container.addEventListener('dragend', (e) => {
            if (draggedItem) {
                draggedItem.style.opacity = '1';
            }
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const afterElement = getDragAfterElement(container, e.clientY);
            if (afterElement == null) {
                container.appendChild(draggedItem);
            } else {
                container.insertBefore(draggedItem, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.category-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function getCategoryOrder(container) {
        const items = container.querySelectorAll('.category-item');
        return Array.from(items).map(item => item.dataset.category);
    }

    function closeSettingsPanel() {
        const panel = document.getElementById('tag-copier-settings');
        const overlay = document.getElementById('tag-copier-overlay');
        if (panel) panel.remove();
        if (overlay) overlay.remove();
    }

    // Wait for the page to load and add button
    function addCopyButton() {
        const site = detectSite();
        if (!site) {
            console.log("Tag Copier: Unsupported site");
            return;
        }

        console.log(`Tag Copier: Detected site: ${site}`);
        const config = getSiteConfig(site);

        console.log("Tag Copier: Looking for tag list...");

        // Try to find the tag list section
        const tagSection = document.querySelector(config.tagSection);
        if (!tagSection) {
            console.log("Tag Copier: No tag section found");
            return;
        }

        console.log("Tag Copier: Found tag section!");

        // Check if button already exists
        if (document.querySelector("#tag-copy-button")) {
            console.log("Tag Copier: Button already exists");
            return;
        }

        console.log("Tag Copier: Adding copy button...");

        // Create button container
        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            z-index: 1000;
            display: flex;
            gap: 5px;
        `;

        // Create the copy button
        const copyButton = document.createElement("button");
        copyButton.id = "tag-copy-button";
        copyButton.innerHTML = "📋 Copy Tags";
        copyButton.style.cssText = `
            background: #0073e6;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-family: sans-serif;
        `;

        // Create settings button
        const settingsButton = document.createElement("button");
        settingsButton.id = "tag-settings-button";
        settingsButton.innerHTML = "⚙️";
        settingsButton.title = "Settings";
        settingsButton.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 5px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-family: sans-serif;
        `;

        // Add hover effects
        copyButton.addEventListener("mouseenter", () => {
            copyButton.style.background = "#005bb5";
        });
        copyButton.addEventListener("mouseleave", () => {
            copyButton.style.background = "#0073e6";
        });

        settingsButton.addEventListener("mouseenter", () => {
            settingsButton.style.background = "#5a6268";
        });
        settingsButton.addEventListener("mouseleave", () => {
            settingsButton.style.background = "#6c757d";
        });

        // Add click handlers
        copyButton.addEventListener("click", () => copyTags(site));
        settingsButton.addEventListener("click", createSettingsPanel);

        // Add buttons to container
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(settingsButton);

        // Make tag section container relative positioned so button positions correctly
        tagSection.style.position = "relative";

        // Add button container to the tag section
        tagSection.appendChild(buttonContainer);
        console.log("Tag Copier: Buttons added successfully!");
    }

    function copyTags(site) {
        console.log("Tag Copier: Copy button clicked!");
        const config = getSiteConfig(site);
        const settings = getSettings();
        const tagsByCategory = {
            artist: [],
            general: [],
            character: [],
            copyright: []
        };

        config.categories.forEach((category) => {
            console.log(`Tag Copier: Looking for ${category.name} tags...`);

            // Universal approach: just look for the selector and extract tags
            const tagItems = document.querySelectorAll(category.selector);
            console.log(`Tag Copier: Found ${tagItems.length} ${category.name} tags`);

            tagItems.forEach((item) => {
                const tagName = config.getTagName(item);
                if (tagName && tagName.length > 0) {
                    let cleanedTag = cleanTagName(tagName);

                    // Filter out censor tags if setting is enabled
                    if (settings.filterCensor && cleanedTag.toLowerCase().includes('censor')) {
                        console.log(`Tag Copier: Filtered out censor tag: ${cleanedTag}`);
                        return;
                    }

                    // Add "artist:" prefix for artist tags
                    if (category.name === "artist") {
                        cleanedTag = "artist:" + cleanedTag;
                    }

                    // Store in appropriate category
                    const categoryName = category.name === "general" ? "general" : category.name;
                    if (tagsByCategory[categoryName]) {
                        tagsByCategory[categoryName].push(cleanedTag);
                    } else {
                        tagsByCategory.general.push(cleanedTag);
                    }

                    console.log(`Tag Copier: Added ${category.name} tag: ${tagName} -> ${cleanedTag}`);
                }
            });
        });

        // Combine tags based on user-defined order
        const allTags = [];
        settings.categoryOrder.forEach(category => {
            if (tagsByCategory[category]) {
                allTags.push(...tagsByCategory[category]);
            }
        });

        console.log(`Tag Copier: Total tags collected: ${allTags.length}`);
        console.log("Tag Copier: Tags:", allTags);

        // Join tags with commas and copy to clipboard
        const tagString = allTags.join(", ");
        console.log("Tag Copier: Final tag string:", tagString);

        if (tagString.length === 0) {
            console.log("Tag Copier: No tags found to copy!");
            showFeedback("❌ No tags found", "#dc3545");
            return;
        }

        // Copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(tagString)
                .then(() => {
                console.log("Tag Copier: Successfully copied to clipboard");
                showFeedback("✅ Copied!", "#28a745");
            })
                .catch((err) => {
                console.error("Tag Copier: Failed to copy tags:", err);
                fallbackCopy(tagString);
            });
        } else {
            console.log("Tag Copier: Using fallback copy method");
            fallbackCopy(tagString);
        }
    }

    function fallbackCopy(text) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const result = document.execCommand("copy");
            if (result) {
                console.log("Tag Copier: Fallback copy successful");
                showFeedback("✅ Copied!", "#28a745");
            } else {
                console.log("Tag Copier: Fallback copy failed");
                showFeedback("❌ Copy failed", "#dc3545");
            }
        } catch (err) {
            console.error("Tag Copier: Fallback copy error:", err);
            showFeedback("❌ Copy failed", "#dc3545");
        }

        document.body.removeChild(textArea);
    }

    function showFeedback(message, color) {
        const button = document.querySelector("#tag-copy-button");
        if (!button) return;

        const originalText = button.innerHTML;
        const originalColor = button.style.background;

        button.innerHTML = message;
        button.style.background = color;

        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalColor;
        }, 1500);
    }

    // Initialize when DOM is ready
    function initialize() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", addCopyButton);
        } else {
            addCopyButton();
        }

        // Also run when navigating (for single-page app behavior)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(addCopyButton, 500); // Small delay for content to load
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Start the script
    initialize();
})();