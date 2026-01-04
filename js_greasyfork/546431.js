// ==UserScript==
// @name         Nhentai Tag Commander
// @version      2.3
// @namespace    https://greasyfork.org/users/1261593
// @description  A Whole new system for Storing/Blacklisting/Marking tags and other settings to support it (includes Advanced Level Blacklisting separate from the nhentai blacklists)
// @author       john doe4
// @license      GPLv3
// @connect      nhentai.net
// @match        *://nhentai.net/*
// @exclude      *://nhentai.net/g/
// @icon         https://nhentai.net/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/546431/Nhentai%20Tag%20Commander.user.js
// @updateURL https://update.greasyfork.org/scripts/546431/Nhentai%20Tag%20Commander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_SETTINGS = {
        highlightCutoffThreshold: 0,
        defaultPriority: 10,
        minTagsThreshold: 10,
        showGreenBorder: false,
        transparentBackground: false,
        transparencyStrength: 0.5,
        tagPosition: 'left',
        sortTagsByPriority: false,
        markNoFavTagComics: true,
        removeTagBackground: false,
        tagTextColor: '#FFFFFF',
        shortcutKey: '',
        shortcutModifier: 'ctrlKey',
        showFloatingButton: true,
        floatingButtonPosition: 'bottom-left',
        useCustomTagTextColor: false,
        customTagBackgroundColor: '#000000',
        hideFavoriteIcon: false,
        lockSettingsButton: false,
        buttonTransparency: 0,
        betterBlacklist: false,
        enableCustomBlacklist: false,
        warnOnBlacklistedComics: false,
        blacklistAction: 'blur',
        allowTagCoexistence: false,
        showBlacklistIcon: true,
        infiniteScroll: true,
        removeNativeBlacklisted: false,
        coexistenceMode: 'balanced',
        forceLanguage: 'none',
        enableComicWhitelisting: false,
        removeAnnoyances: false,
        dontTouchFavorites: false,
        showMissingTags: false,
    };

    const SETTING_DESCRIPTIONS = {
        highlightCutoffThreshold: "Limits the maximum number of tags shown per comic. 0 for unlimited",
        defaultPriority: "The default priority value assigned to new tags",
        minTagsThreshold: "Minimum number of tags required before fetching complete tag data from API. Lower values means more API Calls and faster Response time, Higher values Means lower API Calls and slower Response time ⚠️To Not Get Flagged as a spamming Bot set it to 10 or higher⚠️",
        showGreenBorder: "Shows a Green border around comics whose tags were fetched via API that Nhentai couldn't get.",
        transparentBackground: "Makes tag indicator backgrounds semi-transparent you can adjust the transparency strength below for the desired opacity level.",
        transparencyStrength: "Controls how transparent the tag backgrounds are 0% = Fully Opaque, 100% = Fully Transparent.",
        tagPosition: "Choose whether tag indicators appear on the left or right side of comic thumbnails.",
        sortTagsByPriority: "Sorts tags on comic pages by priority with your favorite tags appearing first sorted by their priority values. ⚠️Warning This Will Break Adding/Removing Tags⚠️",
        markNoFavTagComics: "Shows a red indicator on comics that don't contain any of your favorite tags, helping you identify content to skip.",
        removeTagBackground: "Remove the black/dark background from tag labels on comic thumbnails for a cleaner look.",
        tagTextColor: "Choose the color for tag text labels on comic thumbnails.",
        shortcutKey: "Keyboard shortcut to open the settings menu. Use with Ctrl, Alt, or Shift modifiers.",
        shortcutModifier: "Modifier key to use with the shortcut (Ctrl, Alt, or Shift).",
        showFloatingButton: "Show a floating button on the page to quickly access settings.",
        floatingButtonPosition: "Position of the floating settings button on the page.",
        useCustomTagTextColor: "Enable custom tag text color. When disabled uses the default white text color.",
        customTagBackgroundColor: "Custom background color for tag indicators when custom text color is enabled.",
        hideFavoriteIcon: "Hides The Heart icon next to tags on comic pages when enabled.",
        lockSettingsButton: "Lock the settings button position to prevent accidental dragging.",
        buttonTransparency: "Controls the transparency of the floating settings button. 0% = fully opaque, 100% = nearly transparent.",
        betterBlacklist: "Uses the site's built-in blacklist to mark comics with blacklisted tags using Api Fetching and better detection. (This will fix the issue of some comics not being blacklisted)",
        enableCustomBlacklist: "Enable custom blacklist functionality with your own tag management.",
        warnOnBlacklistedComics: "Show a warning popup when viewing comics with blacklisted tags. (Works Best with Better Blacklist)",
        blacklistAction: "How to handle blacklisted comics: blur them or remove them completely.",
        allowTagCoexistence: "Allow Better Advanced Filter based On what you want.",
        showBlacklistIcon: "Show blacklist (X) icon next to tags when custom blacklist is enabled.",
        infiniteScroll: "Automatically load more pages as you scroll down on gallery listings.",
        removeNativeBlacklisted: "Removes comics that contain blacklisted tags from listings. (Works Best with Better Blacklist)",
        coexistenceMode: "Determines priority when both Blacklisted and Favorite tags exist. 'Blacklisted Priority': blacklist if any blacklisted tag exists. 'Favorite Priority': whitelist if any fav tag exists. 'Balanced': compare counts - more Blacklisted tags = blacklist, more Favorite tags = whitelist, Equal = whitelist.",
        forceLanguage: "Force only comics with specific language tags to be shown. English, Japanese, Chinese and None for all languages.",
        enableComicWhitelisting: "Enable whitelist functionality to allow specific comics even if they contain blacklisted tags.",
        removeAnnoyances: "Removes annoying elements from the page. ⚠️Dose Not Remove Ads Sry⚠️",
        dontTouchFavorites: " When enabled favorited comics will be exempt from all blacklist Actions, Warnings, Removal .",
        showMissingTags: "Shows Missing Tags that the Publisher didn't include in the tags Section and gets them via api.",
    };

    let settings = {};
    Object.keys(DEFAULT_SETTINGS).forEach(key => {
        settings[key] = GM_getValue(`setting_${key}`, DEFAULT_SETTINGS[key]);
    });
    settings.customTagBackgroundColor = GM_getValue('setting_customTagBackgroundColor', DEFAULT_SETTINGS.customTagBackgroundColor);
    settings.buttonTransparency = GM_getValue('setting_buttonTransparency', DEFAULT_SETTINGS.buttonTransparency);

    const processedItems = new Set();
    const processedTags = new Set();
    const processedItemsGlobal = new Map();
    const tagCache = new Map();
    const pendingFetches = new Set();
    const failedFetches = new Set();
    const allKnownTags = new Map();
    const comicNameTagMap = new Map();
    const processedComicNames = new Set();
    const blacklistedTags = new Set();
    const customBlacklistedTags = {};
    let siteBlacklistedTags = [];
    let infiniteLoadIsLoadingNextPage = false;
    const currentPagePath = window.location.pathname;
    let popularCaptions = new Set();
    let checkedCaptions = new Set();
    loadCheckedCaptionsFromStorage();
    let extractedSiteBlacklist = [];
    const whitelistedComics = {};
    const languageApiFailures = new Map();

    const LANGUAGE_TAGS = {
        'english': 12227,
        'japanese': 6346,
        'chinese': 29963,
        'none': null
    };
    const tagDetails = {};
    const tagKeys = GM_listValues();
    tagKeys.forEach(key => {
        if (key.startsWith('tag_')) {
            const tagId = key.slice(4);
            tagDetails[tagId] = GM_getValue(key);
        }
    });


    const customBlacklistKeys = GM_listValues().filter(key => key.startsWith('blacklist_'));
    customBlacklistKeys.forEach(key => {
        const tagId = key.slice(10);
        customBlacklistedTags[tagId] = GM_getValue(key);
    });


    try {
        const scriptTags = document.querySelectorAll('script');
        for (const script of scriptTags) {
            if (script.textContent.includes('blacklisted_tags:')) {
                const match = script.textContent.match(/blacklisted_tags:\s*\[([\d,\s]+)\]/);
                if (match) {
                    extractedSiteBlacklist = match[1].split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                    break;
                }
            }
        }
    } catch (e) {}


    const whitelistedComicKeys = GM_listValues().filter(key => key.startsWith('whitelist_'));
    whitelistedComicKeys.forEach(key => {
        const comicId = key.slice(10);
        whitelistedComics[comicId] = GM_getValue(key);
    });

    function getCurrentBlacklistedTags() {
        if (settings.enableCustomBlacklist) {
            return Object.keys(customBlacklistedTags).map(id => parseInt(id));
        }
        return extractedSiteBlacklist;
    }

    function removeBlacklistedTagsFromDOM() {
        if (!settings.enableCustomBlacklist) return;

        try {
            const scriptTags = document.querySelectorAll('script');
            for (const script of scriptTags) {
                if (script.textContent.includes('blacklisted_tags:')) {
                    const originalContent = script.textContent;
                    const updatedContent = originalContent.replace(
                        /blacklisted_tags:\s*\[[^\]]*\]/,
                        'blacklisted_tags: []'
                    );
                    if (originalContent !== updatedContent) {
                        script.textContent = updatedContent;
                    }
                    break;
                }
            }
        } catch (e) {
            console.error('Error removing blacklisted tags from DOM:', e);
        }
    }

    const savedComicNameTagMap = GM_getValue('comic_name_tag_map', '{}');
    try {
        const parsed = JSON.parse(savedComicNameTagMap);
        Object.entries(parsed).forEach(([name, tags]) => {
            comicNameTagMap.set(name, tags);
        });
    } catch (e) {}

    const savedProcessedNames = GM_getValue('processed_comic_names', '[]');
    try {
        const parsed = JSON.parse(savedProcessedNames);
        parsed.forEach(name => {
            processedComicNames.add(name);
        });
    } catch (e) {}

    GM_registerMenuCommand("⚙️ Tag Highlighter Settings", openSettingsMenu);

    document.addEventListener('keydown', (e) => {
        if (settings.shortcutKey && e.code === settings.shortcutKey &&
            ((settings.shortcutModifier === 'ctrlKey' && e.ctrlKey) ||
             (settings.shortcutModifier === 'altKey' && e.altKey) ||
             (settings.shortcutModifier === 'shiftKey' && e.shiftKey))) {
            e.preventDefault();
            openSettingsMenu();
        }
    });

    function updateBlacklistLevels() {
        if (!settings.enableCustomBlacklist) {
            const existingLevels = document.querySelectorAll('.blacklist-level, .tag-level-display');
            existingLevels.forEach(level => level.remove());
            return;
        }

        const allTags = document.querySelectorAll('.tag');
        allTags.forEach(tag => {
            const match = tag.className.match(/tag-(\d+)/);
            if (match) {
                const tagId = parseInt(match[1]);

                const existingLevels = tag.querySelectorAll('.blacklist-level, .tag-level-display');
                existingLevels.forEach(level => level.remove());

                if (customBlacklistedTags[tagId]) {
                    const level = customBlacklistedTags[tagId].level || 1;

                    const shouldShowLevel = level >= 1;

                    if (shouldShowLevel) {
                        const levelSpan = document.createElement('span');
                        levelSpan.className = 'blacklist-level';
                        levelSpan.textContent = `x${level}`;
                        levelSpan.style.cssText = `
                        background-color: #ff4444 !important;
                        color: white !important;
                        padding: 2px 4px !important;
                        border-radius: 2px !important;
                        font-size: 10px !important;
                        margin-left: 5px !important;
                        font-weight: bold !important;
                        display: inline-block !important;
                    `;

                        const nameSpan = tag.querySelector('.name');
                        if (nameSpan) {
                            nameSpan.appendChild(levelSpan);
                        } else {
                            tag.appendChild(levelSpan);
                        }
                    }
                }
            }
        });
    }

    function updateBlacklistIconAndLevelVisibility() {
        const blacklistButtons = document.querySelectorAll('.blacklistTagButton');
        blacklistButtons.forEach(button => {
            if (settings.showBlacklistIcon) {
                button.style.display = 'inline-block';
            } else {
                button.style.display = 'none';
            }
        });

        updateBlacklistLevels();
    }

    function observeBlacklistChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('tag')) {
                                shouldUpdate = true;
                            }
                            const tags = node.querySelectorAll && node.querySelectorAll('.tag');
                            if (tags && tags.length > 0) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });

            if (shouldUpdate) {
                setTimeout(() => {
                    updateBlacklistLevels();
                    sortTagsOnComicPage();
                }, 50);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function updateDynamicStyles() {
        const existingStyle = document.getElementById('dynamic-tag-styles');
        if (existingStyle) existingStyle.remove();

        const opacity = settings.transparentBackground ? settings.transparencyStrength : 0.66;
        let backgroundStyle;

        if (settings.removeTagBackground) {
            backgroundStyle = 'transparent';
        } else if (settings.useCustomTagTextColor && settings.customTagBackgroundColor) {
            const hex = settings.customTagBackgroundColor;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            backgroundStyle = `rgba(${r}, ${g}, ${b}, ${1 - opacity})`;
        } else {
            backgroundStyle = `rgba(0, 0, 0, ${1 - opacity})`;
        }

        const dynamicCSS = `
        .tag-highlight-dot {
            ${settings.tagPosition === 'right' ? 'right: 5px; left: auto;' : 'left: 5px;'}
            background-color: ${backgroundStyle} !important;
        }
        .tag-highlight-dot span {
            color: ${settings.useCustomTagTextColor ? settings.tagTextColor : '#FFFFFF'} !important;
        }
        .tag-fetched {
            ${settings.showGreenBorder ? 'border: 1px solid #0A900A !important; border-radius: 3px;' : ''}
        }
        .no-fav-tag-indicator {
            position: absolute;
            ${settings.tagPosition === 'right' ? 'left: 5px;' : 'right: 5px;'}
            top: 5px;
            background-color: rgba(255, 0, 0, ${Math.max(1 - opacity, 0.6)});
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            z-index: 15;
            pointer-events: none;
        }
        .floating-settings-btn {
            position: fixed;
            z-index: 1000;
            background-color: rgba(43, 43, 43, ${1 - (settings.buttonTransparency / 100)});
            color: white;
            border: 2px solid #0A900A;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            display: ${settings.showFloatingButton ? 'flex' : 'none'};
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, ${0.3 * (1 - settings.buttonTransparency / 100)});
            transition: all 0.1s ease;
            user-select: none;
            opacity: ${Math.max(0.1, 1 - (settings.buttonTransparency / 100))};
        }
        .floating-settings-btn:hover {
            background-color: #0A900A;
            transform: scale(1.1);
        }
        .floating-settings-btn.dragging {
            cursor: grabbing;
            transition: none;
        }
        .floating-settings-btn.drag-disabled {
            pointer-events: none;
        }
        .star-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 2px;
            margin: 0 5px;
            border-radius: 3px;
            transition: color 0.5s ease;
            color: #0A900A;
        }
        .addTagButton {
            display: ${settings.hideFavoriteIcon ? 'none' : 'inline-block'} !important;
        }
        .blacklistTagButton {
   display: ${settings.showBlacklistIcon ? 'inline-block' : 'none'} !important;
           }
.blacklist-level {
   background-color: #ff4444 !important;
   color: white !important;
   padding: 2px 4px !important;
   border-radius: 2px !important;
   font-size: 10px !important;
   margin-left: 5px !important;
   font-weight: bold !important;
   display: inline-block !important;
}
        .original-tags {
            visibility: hidden !important;
            position: absolute !important;
            left: -9999px !important;
        }
        .hidden-original {
            display: none !important;
        }
        .sorted-tags-layer {
            position: relative;
        }
        .custom-slider {
            position: relative;
            width: 150px;
            height: 6px;
            background-color: #444;
            border-radius: 3px;
            cursor: pointer;
        }
        .custom-slider-bar {
            height: 100%;
            background-color: #0A900A;
            border-radius: 3px;
            transition: width 0.2s ease;
        }
        .custom-slider-handle {
            position: absolute;
            top: -7px;
            width: 20px;
            height: 20px;
            background-color: #0A900A;
            border-radius: 50%;
            cursor: grab;
            transform: translateX(-50%);
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .custom-slider-handle:hover {
            transform: translateX(-50%) scale(1.1);
        }
        .custom-slider-handle.dragging {
            cursor: grabbing;
            transform: translateX(-50%) scale(1.2);
        }
        .custom-slider-mark {
            position: absolute;
            width: 2px;
            height: 6px;
            background-color: #666;
            border-radius: 1px;
        }
        .custom-slider-labels {
            position: absolute;
            top: 22px;
            width: 100%;
            height: 15px;
        }
        .custom-slider-label {
            position: absolute;
            font-size: 10px;
            color: #ccc;
            transform: translateX(-50%);
            white-space: nowrap;
        }
        .custom-blacklist-row {
            opacity: 0.5;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .custom-blacklist-row.enabled {
            opacity: 1;
            pointer-events: auto;
        }
        .blacklistTagButton {
            background: none;
            border: none;
            cursor: pointer;
            padding: 2px;
            margin: 0 5px;
            border-radius: 3px;
            transition: color 0.5s ease;
        }
        .gallery.blacklisted {
            transition: all 0.3s ease;
        }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-tag-styles';
        styleElement.textContent = dynamicCSS;
        document.head.appendChild(styleElement);
    }

    function updateBlacklistIconVisibility() {
        updateBlacklistIconAndLevelVisibility();
    }

    GM_addStyle(`
    #tag-modal, #settings-modal, #edit-tag-modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        padding: 20px;
        background-color: #2b2b2b;
        color: #fff;
        border: 1px solid #444;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    #tag-modal::-webkit-scrollbar, #settings-modal::-webkit-scrollbar, #edit-tag-modal::-webkit-scrollbar {
        display: none;
    }

    #settings-modal {
        width: 800px;
    }

    .modal label {
        display: block;
        margin-bottom: 8px;
        color: #fff;
        font-weight: bold;
        font-size: 14px;
    }

    .modal input[type="text"],
    .modal input[type="number"],
    .modal input[type="color"],
    .modal input[type="range"],
    .modal select,
    .modal textarea {
        width: 100%;
        max-width: 200px;
        margin-bottom: 10px;
        padding: 8px;
        background-color: #444;
        color: #fff;
        border: 1px solid #555;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
    }

    .modal input[type="color"] {
        background-color: #222;
        padding: 4px;
        height: 40px;
        cursor: pointer;
    }

    .modal input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
        border: none;
        border-radius: 4px;
    }

    .modal input[type="color"]::-webkit-color-swatch {
        border: none;
        border-radius: 4px;
    }

    .modal textarea {
        max-width: 100%;
        resize: vertical;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .modal textarea::-webkit-scrollbar {
        display: none;
    }

    .modal button {
        margin: 5px 5px 5px 0;
        background-color: #555;
        color: #fff;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.2s;
    }

    .modal button:hover {
        background-color: #666;
    }

    .modal button.primary {
        background-color: ${settings.addHighlightColor || '#0d7a1c'};
    }

    .modal button.primary:hover {
        background-color: ${settings.addHighlightColor ? adjustBrightness(settings.addHighlightColor, -20) : '#0a6218'};
    }

    .modal button.danger {
        background-color: ${settings.removeHighlightColor || '#AD2204'};
    }

    .modal button.danger:hover {
        background-color: ${settings.removeHighlightColor ? adjustBrightness(settings.removeHighlightColor, -20) : '#8f1c04'};
    }

    #modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 999;
    }

    .settings-section {
        margin-bottom: 20px;
        padding: 15px;
        background-color: #333;
        border-radius: 6px;
        position: relative;
    }

    .settings-section h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #fff;
        font-size: 16px;
    }

    .setting-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 15px;
    position: relative;
    flex-wrap: wrap;
    justify-content: space-between;
}

    .setting-row label {
        flex: 0 0 220px;
        margin-bottom: 0;
        min-width: 220px;
        cursor: help;
        text-align: left;
        white-space: nowrap;
    }

    .setting-row input,
    .setting-row select {
        flex: 0 0 auto;
        min-width: 120px;
        margin-left: auto;
    }

    .setting-row input[type="range"] {
        width: 150px;
        flex: 0 0 150px;
    }

    .setting-row input[type="color"] {
        width: 60px;
        height: 40px;
        flex: 0 0 60px;
    }

    .range-display {
        min-width: 60px;
        text-align: center;
        color: #0A900A;
        font-weight: bold;
        flex: 0 0 60px;
        font-size: 14px;
        margin-left: 10px;
    }

    .checkbox-container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
    white-space: nowrap;
}

    .checkbox-container input[type="checkbox"] {
        width: auto;
        max-width: none;
        margin: 0;
        min-width: auto;
    }

    .shortcut-input-group {
        display: flex;
        gap: 5px;
        align-items: center;
        flex: 0 0 auto;
        flex-wrap: nowrap;
    }

    .shortcut-input-group select {
        max-width: 80px;
        min-width: 60px;
    }

    .shortcut-input-group input {
        max-width: 25px !important;
        min-width: 25px !important;
        width: 25px !important;
        text-align: center;
        text-transform: uppercase;
        padding: 4px 2px !important;
    }

    #existing-tags-container, #tag-management-container {
        margin-top: 20px;
    }

    #existing-tags-list, #managed-tags-list, #blacklisted-tags-list {
        max-height: 220px;
        overflow-y: auto;
        background-color: #333;
        padding: 10px;
        border: 1px solid #444;
        border-radius: 6px;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    #existing-tags-list::-webkit-scrollbar, #managed-tags-list::-webkit-scrollbar, #blacklisted-tags-list::-webkit-scrollbar {
        display: none;
    }

    #existing-tags-list div, #managed-tags-list div, #blacklisted-tags-list div {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        background-color: #444;
        border-radius: 4px;
        font-size: 13px;
        text-align: left;
    }

    .tag-search-input {
        width: calc(100% - 20px);
        margin-bottom: 15px;
        padding: 8px;
        background-color: #444;
        color: #fff;
        border: 1px solid #555;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
    }

    .tag-loading {
        opacity: 0.7;
        position: relative;
    }

    .tag-loading::after {
        content: '';
        position: absolute;
        top: 5px;
        right: 5px;
        width: 12px;
        height: 12px;
        border: 2px solid #fff;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 5;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .tabs {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 2px solid #444;
        background-color: #333;
        border-radius: 6px 6px 0 0;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .tabs::-webkit-scrollbar {
        display: none;
    }

    .tab {
        padding: 12px 20px;
        background-color: transparent;
        border: none;
        color: #ccc;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
    }

    .tab.active {
        color: #fff;
        border-bottom-color: #0A900A;
        background-color: rgba(10, 144, 10, 0.1);
    }

    .tab:hover {
        background-color: #444;
        color: #fff;
    }

    .tab-content {
        display: none;
    }

    .tab-content.active {
        display: block;
    }

    .tooltip {
        position: fixed !important;
        background-color: #1a1a1a;
        color: #fff;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        max-width: 280px;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        border: 1px solid #555;
        line-height: 1.3;
        display: none;
        pointer-events: none;
    }

    .button-group {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    .priority-badge {
        background-color: #0A900A;
        color: white;
        padding: 2px 5px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
        margin-left: 5px;
    }

    .duplicate-options {
        display: flex;
        gap: 15px;
        align-items: center;
        flex: 0 0 auto;
        flex-wrap: nowrap;
    }

    .duplicate-options label {
        margin: 0;
        min-width: auto;
        cursor: pointer;
        font-size: 13px;
        flex: 0 0 auto;
        white-space: nowrap;
    }
    .tag-text-color-row {
        opacity: 0.5;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    .tag-text-color-row.enabled {
        opacity: 1;
        pointer-events: auto;
    }

    .custom-tag-background-row {
        opacity: 0.5;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    .custom-tag-background-row.enabled {
        opacity: 1;
        pointer-events: auto;
    }
    .better-blacklist-row {
    opacity: 0.5;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.better-blacklist-row.enabled {
    opacity: 1;
    pointer-events: auto;
}
#NHI_loader_icon {
    height: 355px;
    line-height: 355px;
    text-align: center;
}
#NHI_loader_icon > div {
    display: inline-flex;
}
.loader {
    color: #ed2553;
    font-size: 10px;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    position: relative;
    text-indent: -9999em;
    animation: mulShdSpin 1.3s infinite linear;
    transform: translateZ(0);
}

@keyframes mulShdSpin {
    0%, 100% {
        box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
    }
    12.5% {
        box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
    }
    25% {
        box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
    }
    37.5% {
        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
    }
    50% {
        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
    }
    62.5% {
        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
    }
    75% {
        box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
    }
    87.5% {
        box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
    }
}
.blurred-content {
    filter: blur(5px) !important;
}
.coexistence-mode-row {
    opacity: 0.5;
    pointer-events: none;
    transition: opacity 0.3s ease;
    margin-top: 10px;
}
.coexistence-mode-row.enabled {
    opacity: 1;
    pointer-events: auto;
}
.comic-whitelist-row {
    opacity: 0.5;
    pointer-events: none;
    transition: opacity 0.3s ease;
}
.comic-whitelist-row.enabled {
    opacity: 1;
    pointer-events: auto;
}
.whitelist-floating-btn {
    position: fixed;
    left: 850px;
    top: 450px;
    z-index: 10003;
    background-color: rgba(10, 144, 10, 0.9);
    color: white;
    border: 2px solid #0A900A;
    border-radius: 8px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
    filter: none !important;
    backdrop-filter: none !important;
}
.whitelist-floating-btn:hover {
    background-color: #0A900A;
    transform: scale(1.05);
}

.custom-tooltip-window {
    position: fixed;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: #fff;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    max-width: 320px;
    z-index: 999999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    border: 1px solid #444;
    line-height: 1.4;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    backdrop-filter: blur(10px);
}

.tooltip-content {
    position: relative;
    z-index: 2;
}

.tooltip-arrow {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #1a1a1a;
    z-index: 1;
}

.tooltip-arrow::before {
    content: '';
    position: absolute;
    bottom: -9px;
    left: -9px;
    width: 0;
    height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 9px solid #444;
}
.whitelist-inline-btn {
    background-color: rgba(10, 144, 10, 0.9);
    color: white;
    border: 2px solid #0A900A;
    border-radius: 8px;
    padding: 15px 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
    transition: all 0.3s ease;
    display: inline-block;
}

.whitelist-inline-btn:hover {
    background-color: #0A900A;
    transform: scale(1.05);
}
#whitelisted-comics-list {
    max-height: 220px;
    overflow-y: auto;
    background-color: #333;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 6px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    min-height: 100px;
}

#whitelisted-comics-list::-webkit-scrollbar {
    display: none;
}
#whitelisted-comics-list:empty::before {
    content: 'No whitelisted comics yet...';
    color: #666;
    font-style: italic;
    display: block;
    text-align: center;
    padding: 20px;
}
#whitelisted-comics-list div {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    background-color: #444;
    border-radius: 4px;
    font-size: 13px;
    text-align: left;
}

`);

    function adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    function createCustomSlider(container, value, min, max, step, onChange) {
        const slider = document.createElement('div');
        slider.className = 'custom-slider';

        const bar = document.createElement('div');
        bar.className = 'custom-slider-bar';

        const handle = document.createElement('div');
        handle.className = 'custom-slider-handle';

        if (container.id === 'button-transparency-slider') {
            const marks = document.createElement('div');
            marks.className = 'custom-slider-marks';

            const labels = document.createElement('div');
            labels.className = 'custom-slider-labels';

            const markPositions = [0, 25, 50, 75, 100];
            markPositions.forEach(pos => {
                const mark = document.createElement('div');
                mark.className = 'custom-slider-mark';
                mark.style.left = pos + '%';
                marks.appendChild(mark);
            });

            slider.appendChild(labels);
        }

        function updateSlider(val) {
            const percentage = ((val - min) / (max - min)) * 100;
            bar.style.width = percentage + '%';
            handle.style.left = percentage + '%';
        }

        function handleMove(e) {
            const rect = slider.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            const newValue = min + (percentage / 100) * (max - min);
            const steppedValue = Math.round(newValue / step) * step;
            updateSlider(steppedValue);
            if (onChange) onChange(steppedValue);
        }

        let isDragging = false;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            handle.classList.add('dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                handleMove(e);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.classList.remove('dragging');
            }
        });

        slider.addEventListener('click', (e) => {
            if (!isDragging) {
                handleMove(e);
            }
        });

        slider.appendChild(bar);
        slider.appendChild(handle);

        updateSlider(value);
        container.appendChild(slider);

        return slider;
    }

    function createFloatingButton() {
        if (document.getElementById('floating-settings-btn')) return;

        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'floating-settings-btn';
        floatingBtn.className = 'floating-settings-btn';
        floatingBtn.innerHTML = '⚙️';
        floatingBtn.title = 'Open Tag Highlighter Settings';

        let position = GM_getValue('floating_button_position', null);

        if (!position) {
            const positions = {
                'top-left': { x: 20, y: 20 },
                'top-right': { x: window.innerWidth - 70, y: 20 },
                'bottom-left': { x: 20, y: window.innerHeight - 70 },
                'bottom-right': { x: window.innerWidth - 70, y: window.innerHeight - 70 }
            };
            const defaultPos = positions[settings.floatingButtonPosition] || positions['bottom-left'];
            position = defaultPos;
            GM_setValue('floating_button_position', position);
        }

        if (position.x == null || position.y == null || isNaN(position.x) || isNaN(position.y)) {
            position = { x: 20, y: window.innerHeight - 70 };
            GM_setValue('floating_button_position', position);
        }

        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;
        const constrainedX = Math.max(0, Math.min(position.x, maxX));
        const constrainedY = Math.max(0, Math.min(position.y, maxY));

        floatingBtn.style.left = constrainedX + 'px';
        floatingBtn.style.top = constrainedY + 'px';
        floatingBtn.style.right = 'auto';
        floatingBtn.style.bottom = 'auto';

        floatingBtn.addEventListener('click', openSettingsMenu);

        if (!settings.lockSettingsButton) {
            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };

            floatingBtn.addEventListener('mousedown', (e) => {
                if (e.button === 0) {
                    isDragging = true;
                    floatingBtn.classList.add('dragging');
                    const rect = floatingBtn.getBoundingClientRect();
                    dragOffset.x = e.clientX - rect.left;
                    dragOffset.y = e.clientY - rect.top;
                    e.preventDefault();
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    requestAnimationFrame(() => {
                        const x = e.clientX - dragOffset.x;
                        const y = e.clientY - dragOffset.y;

                        const maxX = window.innerWidth - floatingBtn.offsetWidth;
                        const maxY = window.innerHeight - floatingBtn.offsetHeight;

                        const constrainedX = Math.max(0, Math.min(x, maxX));
                        const constrainedY = Math.max(0, Math.min(y, maxY));

                        floatingBtn.style.left = constrainedX + 'px';
                        floatingBtn.style.top = constrainedY + 'px';
                        floatingBtn.style.right = 'auto';
                        floatingBtn.style.bottom = 'auto';
                    });
                }
            });

            document.addEventListener('mouseup', (e) => {
                if (isDragging) {
                    isDragging = false;
                    floatingBtn.classList.remove('dragging');

                    const newPosition = {
                        x: parseInt(floatingBtn.style.left),
                        y: parseInt(floatingBtn.style.top)
                    };
                    GM_setValue('floating_button_position', newPosition);
                }
            });
        } else {
            floatingBtn.style.cursor = 'pointer';
            floatingBtn.title = 'Open Tag Highlighter Settings (Position Locked)';
        }

        document.body.appendChild(floatingBtn);
    }

    const heartIcon = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
    </svg>
    `;

    const xIcon = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;

    const modalHtml = `
    <!-- =============================================== -->
    <!-- MODAL OVERLAY -->
    <!-- =============================================== -->
    <div id="modal-overlay"></div>

    <!-- =============================================== -->
    <!-- TAG MODAL START -->
    <!-- =============================================== -->
    <div id="tag-modal" class="modal">
        <h3>Add New Tag</h3>
        <label for="tag-name">Tag Name:</label>
        <input type="text" id="tag-name" placeholder="Enter tag name">

        <label for="tag-priority">Priority:</label>
        <input type="number" id="tag-priority" value="10" min="0" max="100">

        <label for="tag-color">Color:</label>
        <input type="color" id="tag-color" value="#32a852">

        <button id="save-tag" class="primary">💾 Save</button>
        <button id="cancel-tag">❌ Cancel</button>

        <!-- Existing Tags Container -->
        <div id="existing-tags-container">
            <h3>Existing Tags</h3>
            <div id="existing-tags-list"></div>
        </div>
        <!-- Existing Tags Container END -->
    </div>
    <!-- TAG MODAL END -->
    <!-- =============================================== -->

    <!-- =============================================== -->
    <!-- SETTINGS MODAL START -->
    <!-- =============================================== -->
    <div id="settings-modal" class="modal">
        <h2>🎯 Nhentai Tag Commander Settings</h2>

        <!-- Tab Navigation -->
        <div class="tabs">
            <button class="tab active" data-tab="general">⚙️ General</button>
            <button class="tab" data-tab="appearance">🎨 Appearance</button>
            <button class="tab" data-tab="blacklist">🚫 Blacklist</button>
            <button class="tab" data-tab="tags">🏷️ Management</button>
            <button class="tab" data-tab="whitelist">☯️ B/W Listed</button>
            <button class="tab" data-tab="interface">🖥️ Interface</button>
        </div>
        <!-- Tab Navigation END -->

        <!-- =============================================== -->
        <!-- GENERAL TAB START -->
        <!-- =============================================== -->
        <div id="general-tab" class="tab-content active">
            <div class="settings-section">
                <h3>🔧 Core Functionality</h3>

                <div class="setting-row" data-tooltip="highlightCutoffThreshold">
                    <label>Max Tags Listed:</label>
                    <input type="number" id="setting-highlight-cutoff" min="0" value="${settings.highlightCutoffThreshold}">
                </div>

                <div class="setting-row" data-tooltip="defaultPriority">
                    <label>Default Priority:</label>
                    <input type="number" id="setting-default-priority" min="0" max="100" value="${settings.defaultPriority}">
                </div>

                <div class="setting-row" data-tooltip="minTagsThreshold">
                    <label>Minimum Tag Threshold:</label>
                    <input type="number" id="setting-min-tags" min="1" max="50" value="${settings.minTagsThreshold}">
                </div>

                <div class="setting-row" data-tooltip="forceLanguage">
                    <label>Force Language:</label>
                    <select id="setting-force-language">
                        <option value="none" ${settings.forceLanguage === 'none' ? 'selected' : ''}>None</option>
                        <option value="english" ${settings.forceLanguage === 'english' ? 'selected' : ''}>English</option>
                        <option value="japanese" ${settings.forceLanguage === 'japanese' ? 'selected' : ''}>Japanese</option>
                        <option value="chinese" ${settings.forceLanguage === 'chinese' ? 'selected' : ''}>Chinese</option>
                    </select>
                </div>

                <div class="setting-row" data-tooltip="infiniteScroll">
                    <label>Infinite Scroll:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-infinite-scroll" ${settings.infiniteScroll ? 'checked' : ''}>
                        <span>Auto-load pages</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="removeAnnoyances">
                    <label>Remove Annoyances:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-remove-annoyances" ${settings.removeAnnoyances ? 'checked' : ''}>
                        <span>Remove Annoyances</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="showMissingTags">
    <label>Show Missing Tags:</label>
    <div class="checkbox-container">
        <input type="checkbox" id="setting-show-missing-tags" ${settings.showMissingTags ? 'checked' : ''}>
        <span>Fetch Missing Tags</span>
    </div>
</div>

            </div>
        </div>
        <!-- GENERAL TAB END -->
        <!-- =============================================== -->

        <!-- =============================================== -->
        <!-- APPEARANCE TAB START -->
        <!-- =============================================== -->
        <div id="appearance-tab" class="tab-content">
            <div class="settings-section">
                <h3>🎨 Visual Customization</h3>

                <div class="setting-row" data-tooltip="tagPosition">
                    <label>Tag Position:</label>
                    <select id="setting-tag-position">
                        <option value="left" ${settings.tagPosition === 'left' ? 'selected' : ''}>Left</option>
                        <option value="right" ${settings.tagPosition === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                </div>

                <div class="setting-row" data-tooltip="sortTagsByPriority">
                    <label>Sort Tags by Priority:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-sort-tags" ${settings.sortTagsByPriority ? 'checked' : ''}>
                        <span>Tag sorting</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="showGreenBorder">
                    <label>Show Green Border For API Fetched Tags:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-green-border" ${settings.showGreenBorder ? 'checked' : ''}>
                        <span>Show border</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="markNoFavTagComics">
                    <label>Mark Comics With No Favorite Tags:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-mark-no-fav" ${settings.markNoFavTagComics ? 'checked' : ''}>
                        <span>Show indicator</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="removeTagBackground">
                    <label>Remove Tag Background:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-remove-tag-bg" ${settings.removeTagBackground ? 'checked' : ''}>
                        <span>Hide background</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="hideFavoriteIcon">
                    <label>Hide Favorite Icon:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-hide-favorite-icon" ${settings.hideFavoriteIcon ? 'checked' : ''}>
                        <span>Hide Heart icon</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="transparentBackground">
                    <label>Transparency:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-transparent-bg" ${settings.transparentBackground ? 'checked' : ''}>
                        <span>Background transparency</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="transparencyStrength">
                    <label>Transparency Strength:</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div id="transparency-strength-slider" style="flex: 1;"></div>
                        <span class="range-display" id="transparency-strength-display">${Math.round(settings.transparencyStrength * 100)}%</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="useCustomTagTextColor">
                    <label>Use Custom Tag Text Color:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-use-custom-tag-text-color" ${settings.useCustomTagTextColor ? 'checked' : ''}>
                        <span>Custom color</span>
                    </div>
                </div>

                <div class="setting-row tag-text-color-row ${settings.useCustomTagTextColor ? 'enabled' : ''}" data-tooltip="tagTextColor">
                    <label>Tag Text Color:</label>
                    <input type="color" id="setting-tag-text-color" value="${settings.tagTextColor}">
                </div>

                <div class="setting-row custom-tag-background-row ${settings.useCustomTagTextColor ? 'enabled' : ''}" data-tooltip="customTagBackgroundColor">
                    <label>Tag Background Color:</label>
                    <input type="color" id="setting-custom-tag-background-color" value="${settings.customTagBackgroundColor}">
                </div>
            </div>
        </div>
        <!-- APPEARANCE TAB END -->
        <!-- =============================================== -->

        <!-- =============================================== -->
        <!-- TAGS MANAGEMENT TAB START -->
        <!-- =============================================== -->
        <div id="tags-tab" class="tab-content">
            <div class="settings-section">
                <h3>📚 Tag Management</h3>
                <input type="text" id="tag-search" class="tag-search-input" placeholder="Search favorite tags...">
                <div id="managed-tags-list"></div>
            </div>
        </div>
        <!-- TAGS MANAGEMENT TAB END -->
        <!-- =============================================== -->

        <!-- =============================================== -->
        <!-- INTERFACE TAB START -->
        <!-- =============================================== -->
        <div id="interface-tab" class="tab-content">
            <div class="settings-section">
                <h3>🖥️ Interface Options</h3>

                <div class="setting-row" data-tooltip="shortcutKey">
                    <label>Keyboard Shortcut:</label>
                    <div class="shortcut-input-group">
                        <select id="setting-shortcut-modifier">
                            <option value="ctrlKey" ${settings.shortcutModifier === 'ctrlKey' ? 'selected' : ''}>Ctrl</option>
                            <option value="altKey" ${settings.shortcutModifier === 'altKey' ? 'selected' : ''}>Alt</option>
                            <option value="shiftKey" ${settings.shortcutModifier === 'shiftKey' ? 'selected' : ''}>Shift</option>
                        </select>
                        <span>+</span>
                        <input type="text" id="setting-shortcut-key" value="${settings.shortcutKey.replace('Key', '')}" maxlength="1" placeholder="S">
                    </div>
                </div>

                <div class="setting-row" data-tooltip="showFloatingButton">
                    <label>Show Floating Settings Button:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-floating-button" ${settings.showFloatingButton ? 'checked' : ''}>
                        <span>Show floating button</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="lockSettingsButton">
                    <label>Lock Settings Button:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-lock-settings-button" ${settings.lockSettingsButton ? 'checked' : ''}>
                        <span>Enable Lock</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="buttonTransparency">
                    <label>Button Transparency:</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div id="button-transparency-slider" style="flex: 1;"></div>
                        <span class="range-display" id="button-transparency-display">${settings.buttonTransparency}%</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- INTERFACE TAB END -->
        <!-- =============================================== -->

        <!-- =============================================== -->
        <!-- BLACKLIST TAB START -->
        <!-- =============================================== -->
        <div id="blacklist-tab" class="tab-content">
            <div class="settings-section">
                <h3>🚫Blacklist Settings</h3>

                <div class="setting-row" data-tooltip="removeNativeBlacklisted">
                    <label>Remove Blacklisted Tags:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-remove-native-blacklisted" ${settings.removeNativeBlacklisted ? 'checked' : ''}>
                        <span>Removes blacklisted</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="warnOnBlacklistedComics">
                    <label>Warn On Blacklisted Comics:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-warn-blacklisted" ${settings.warnOnBlacklistedComics ? 'checked' : ''}>
                        <span>Show warning popup</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="betterBlacklist">
                    <label>Better Blacklist:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-better-blacklist" ${settings.betterBlacklist ? 'checked' : ''}>
                        <span>Better Site Blacklist</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="dontTouchFavorites">
                    <label>Don't Touch Favorite Comics:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-dont-touch-favorites" ${settings.dontTouchFavorites ? 'checked' : ''}>
                        <span>Protect Favorite comics</span>
                    </div>
                </div>

                <div class="setting-row" data-tooltip="enableCustomBlacklist">
                    <label>Enable Custom Blacklist:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-custom-blacklist" ${settings.enableCustomBlacklist ? 'checked' : ''}>
                        <span>Custom blacklist</span>
                    </div>
                </div>

                <div class="setting-row custom-blacklist-row ${settings.enableCustomBlacklist ? 'enabled' : ''}" data-tooltip="enableComicWhitelisting">
                    <label>Enable Comic Whitelisting:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-comic-whitelisting" ${settings.enableComicWhitelisting ? 'checked' : ''}>
                        <span>Comic whitelist</span>
                    </div>
                </div>

                <div class="setting-row custom-blacklist-row ${settings.enableCustomBlacklist ? 'enabled' : ''}" data-tooltip="showBlacklistIcon">
    <label>Show Blacklist Icon:</label>
    <div class="checkbox-container">
        <input type="checkbox" id="setting-show-blacklist-icon" ${settings.showBlacklistIcon ? 'checked' : ''}>
        <span>Show X icon</span>
    </div>
</div>

                <div class="setting-row custom-blacklist-row ${settings.enableCustomBlacklist ? 'enabled' : ''}" data-tooltip="blacklistAction">
                    <label>Custom Blacklisted Tags:</label>
                    <select id="setting-blacklist-action">
                        <option value="blur" ${settings.blacklistAction === 'blur' ? 'selected' : ''}>Blur</option>
                        <option value="remove" ${settings.blacklistAction === 'remove' ? 'selected' : ''}>Remove</option>
                    </select>
                </div>

                <div class="setting-row custom-blacklist-row ${settings.enableCustomBlacklist ? 'enabled' : ''}" data-tooltip="allowTagCoexistence">
                    <label>Advanced Filter:</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="setting-allow-coexistence" ${settings.allowTagCoexistence ? 'checked' : ''}>
                        <span>Filter Tags</span>
                    </div>
                </div>

                <div class="setting-row coexistence-mode-row ${settings.enableCustomBlacklist && settings.allowTagCoexistence ? 'enabled' : ''}" data-tooltip="coexistenceMode">
                    <label>Filter Mode:</label>
                    <select id="setting-coexistence-mode">
                        <option value="blacklisted" ${settings.coexistenceMode === 'blacklisted' ? 'selected' : ''}>Blacklisted Priority</option>
                        <option value="favorite" ${settings.coexistenceMode === 'favorite' ? 'selected' : ''}>Favorite Priority</option>
                        <option value="balanced" ${settings.coexistenceMode === 'balanced' ? 'selected' : ''}>Balanced</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- BLACKLIST TAB END -->
        <!-- =============================================== -->

        <!-- =============================================== -->
        <!-- WHITELIST TAB START -->
        <!-- =============================================== -->
        <div id="whitelist-tab" class="tab-content">
            <div class="settings-section">
                <h3>🚫Blacklist & ✅Whitelist</h3>

                <div style="display: flex; gap: 20px;">
                    <!-- Blacklisted Tags Section -->
                    <div style="flex: 1;">
                        <h3>🚫 Blacklisted Tags</h3>
                        <input type="text" id="blacklist-search" class="tag-search-input" placeholder="Search blacklisted tags...">
                        <div id="blacklisted-tags-list"></div>
                    </div>

                    <!-- Whitelisted Comics Section -->
                    <div style="flex: 1;" class="comic-whitelist-row ${settings.enableCustomBlacklist && settings.enableComicWhitelisting ? 'enabled' : ''}">
                        <h3>✅ Whitelisted Comics</h3>
                        <input type="text" id="whitelist-search" class="tag-search-input" placeholder="Search whitelisted comics...">
                        <div id="whitelisted-comics-list"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- WHITELIST TAB END -->
        <!-- =============================================== -->

        <!-- =============================================== -->
        <!-- MODAL FOOTER START -->
        <!-- =============================================== -->
        <div style="margin-top: 20px; text-align: center; border-top: 1px solid #444; padding-top: 15px; position: relative; z-index: 1001;">
            <button id="save-settings" class="primary">💾 Save Settings</button>
            <button id="reset-settings" class="danger">🔄 Reset to Defaults</button>
            <button id="close-settings">❌ Close</button>
        </div>
        <!-- MODAL FOOTER END -->
        <!-- =============================================== -->

        <!-- Tooltip -->
        <div class="tooltip" id="settings-tooltip"></div>
    </div>
    <!-- SETTINGS MODAL END -->
    <!-- =============================================== -->
`;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    updateDynamicStyles();
    createFloatingButton();

    function filterManagedTags(searchTerm) {
        const managedTagsList = document.getElementById('managed-tags-list');
        const tagItems = managedTagsList.querySelectorAll('div');

        tagItems.forEach(item => {
            const tagNameElement = item.querySelector('span strong');
            if (tagNameElement) {
                const tagName = tagNameElement.textContent.toLowerCase();
                if (tagName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    }

    function setupTooltips() {
        const settingsRows = document.querySelectorAll('.setting-row[data-tooltip]');
        let tooltipTimeout;
        let currentTooltip = null;

        function createTooltipWindow(content, targetElement) {

            if (currentTooltip) {
                currentTooltip.remove();
                currentTooltip = null;
            }

            const tooltipWindow = document.createElement('div');
            tooltipWindow.className = 'custom-tooltip-window';
            tooltipWindow.innerHTML = `
            <div class="tooltip-content">${content}</div>
            <div class="tooltip-arrow"></div>
        `;

            document.body.appendChild(tooltipWindow);
            currentTooltip = tooltipWindow;


            const rect = targetElement.getBoundingClientRect();
            const tooltipRect = tooltipWindow.getBoundingClientRect();

            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            let top = rect.bottom + 10;

            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
            }
            if (top + tooltipRect.height > window.innerHeight - 10) {
                top = rect.top - tooltipRect.height - 10;
                tooltipWindow.querySelector('.tooltip-arrow').style.transform = 'rotate(180deg)';
                tooltipWindow.querySelector('.tooltip-arrow').style.top = 'auto';
                tooltipWindow.querySelector('.tooltip-arrow').style.bottom = '-8px';
            }

            tooltipWindow.style.left = `${left}px`;
            tooltipWindow.style.top = `${top}px`;
            tooltipWindow.style.opacity = '1';
        }

        settingsRows.forEach(row => {
            const label = row.querySelector('label');
            if (!label) return;

            label.addEventListener('mouseenter', (e) => {
                const tooltipKey = row.getAttribute('data-tooltip');
                if (SETTING_DESCRIPTIONS[tooltipKey]) {
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = setTimeout(() => {
                        createTooltipWindow(SETTING_DESCRIPTIONS[tooltipKey], e.target);
                    }, 500);
                }
            });

            label.addEventListener('mouseleave', () => {
                clearTimeout(tooltipTimeout);
                if (currentTooltip) {
                    currentTooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (currentTooltip) {
                            currentTooltip.remove();
                            currentTooltip = null;
                        }
                    }, 200);
                }
            });
        });

        document.addEventListener('click', () => {
            if (currentTooltip) {
                currentTooltip.remove();
                currentTooltip = null;
            }
        });
    }

    function setupTagTextColorToggle() {
        const useCustomCheckbox = document.getElementById('setting-use-custom-tag-text-color');
        const tagTextColorRow = document.querySelector('.tag-text-color-row');
        const customBackgroundRow = document.querySelector('.custom-tag-background-row');

        if (useCustomCheckbox && tagTextColorRow && customBackgroundRow) {
            useCustomCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    tagTextColorRow.classList.add('enabled');
                    customBackgroundRow.classList.add('enabled');
                } else {
                    tagTextColorRow.classList.remove('enabled');
                    customBackgroundRow.classList.remove('enabled');
                }
            });
        }
    }

    function setupButtonTransparencySlider() {
        const container = document.getElementById('button-transparency-slider');
        const display = document.getElementById('button-transparency-display');

        if (container && !container.querySelector('.custom-slider')) {
            createCustomSlider(container, settings.buttonTransparency, 0, 100, 1, (value) => {
                container.dataset.value = value;
                display.textContent = value + '%';
            });
        }
    }
    function setupTransparencyStrengthSlider() {
        const container = document.getElementById('transparency-strength-slider');
        const display = document.getElementById('transparency-strength-display');

        if (container && display && !container.querySelector('.custom-slider')) {
            createCustomSlider(container, settings.transparencyStrength * 100, 0, 100, 5, (value) => {
                container.dataset.value = value / 100;
                display.textContent = value + '%';
            });
        }
    }

    function setupCustomBlacklistToggle() {
        const enableCheckbox = document.getElementById('setting-custom-blacklist');
        const coexistenceCheckbox = document.getElementById('setting-allow-coexistence');
        const customRows = document.querySelectorAll('.custom-blacklist-row');
        const coexistenceModeRow = document.querySelector('.coexistence-mode-row');
        const warnCheckbox = document.getElementById('setting-warn-blacklisted');
        const warnRow = document.querySelector('.setting-row[data-tooltip="warnOnBlacklistedComics"]');
        const removeBlacklistedCheckbox = document.getElementById('setting-remove-native-blacklisted');
        const removeBlacklistedRow = document.querySelector('.setting-row[data-tooltip="removeNativeBlacklisted"]');
        const betterBlacklistCheckbox = document.getElementById('setting-better-blacklist');
        const betterBlacklistRow = document.querySelector('.setting-row[data-tooltip="betterBlacklist"]');
        const blacklistTagsSection = document.querySelector('#blacklisted-tags-list').closest('.settings-section');
        const comicWhitelistRows = document.querySelectorAll('.comic-whitelist-row');
        const whitelistCheckbox = document.getElementById('setting-comic-whitelisting');
        const blacklistManagementSection = document.querySelector('#whitelist-tab .settings-section');

        function updateCustomBlacklistState() {
            const isCustomEnabled = enableCheckbox ? enableCheckbox.checked : false;
            const isCoexistenceEnabled = coexistenceCheckbox ? coexistenceCheckbox.checked : false;
            const isWhitelistEnabled = whitelistCheckbox ? whitelistCheckbox.checked : false;

            customRows.forEach(row => {
                if (isCustomEnabled) {
                    row.classList.add('enabled');
                } else {
                    row.classList.remove('enabled');
                }
            });

            if (coexistenceModeRow) {
                if (isCustomEnabled && isCoexistenceEnabled) {
                    coexistenceModeRow.classList.add('enabled');
                } else {
                    coexistenceModeRow.classList.remove('enabled');
                }
            }

            comicWhitelistRows.forEach(row => {
                if (isCustomEnabled && isWhitelistEnabled) {
                    row.classList.add('enabled');
                } else {
                    row.classList.remove('enabled');
                }
            });

            if (blacklistManagementSection) {
                if (isCustomEnabled) {
                    blacklistManagementSection.style.opacity = '1';
                    blacklistManagementSection.style.pointerEvents = 'auto';
                } else {
                    blacklistManagementSection.style.opacity = '0.5';
                    blacklistManagementSection.style.pointerEvents = 'none';
                }
            }

            if (warnCheckbox && warnRow) {
                if (isCustomEnabled) {
                    warnRow.style.opacity = '0.5';
                    warnRow.style.pointerEvents = 'none';
                    warnCheckbox.disabled = true;
                    warnCheckbox.checked = false;
                } else {
                    warnRow.style.opacity = '1';
                    warnRow.style.pointerEvents = 'auto';
                    warnCheckbox.disabled = false;
                }
            }

            if (removeBlacklistedCheckbox && removeBlacklistedRow) {
                if (isCustomEnabled) {
                    removeBlacklistedRow.style.opacity = '0.5';
                    removeBlacklistedRow.style.pointerEvents = 'none';
                    removeBlacklistedCheckbox.disabled = true;
                    removeBlacklistedCheckbox.checked = false;
                } else {
                    removeBlacklistedRow.style.opacity = '1';
                    removeBlacklistedRow.style.pointerEvents = 'auto';
                    removeBlacklistedCheckbox.disabled = false;
                }
            }

            if (betterBlacklistCheckbox && betterBlacklistRow) {
                if (isCustomEnabled) {
                    betterBlacklistRow.style.opacity = '0.5';
                    betterBlacklistRow.style.pointerEvents = 'none';
                    betterBlacklistCheckbox.disabled = true;
                    betterBlacklistCheckbox.checked = false;
                } else {
                    betterBlacklistRow.style.opacity = '1';
                    betterBlacklistRow.style.pointerEvents = 'auto';
                    betterBlacklistCheckbox.disabled = false;
                }
            }

        }

        if (enableCheckbox) {
            enableCheckbox.addEventListener('change', updateCustomBlacklistState);
        }

        if (coexistenceCheckbox) {
            coexistenceCheckbox.addEventListener('change', updateCustomBlacklistState);
        }

        if (whitelistCheckbox) {
            whitelistCheckbox.addEventListener('change', updateCustomBlacklistState);
        }

        updateCustomBlacklistState();
    }

    function setupBetterBlacklistToggle() {
        const enableCheckbox = document.getElementById('setting-better-blacklist');
        const betterBlacklistRows = document.querySelectorAll('.better-blacklist-row');

        if (enableCheckbox) {
            enableCheckbox.addEventListener('change', (e) => {
                betterBlacklistRows.forEach(row => {
                    if (e.target.checked) {
                        row.classList.add('enabled');
                    } else {
                        row.classList.remove('enabled');
                    }
                });
            });
        }
    }


    function setupBlacklistSearch() {
        const searchInput = document.getElementById('blacklist-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                filterBlacklistedTags(searchTerm);
            });
        }
    }

    function setupWhitelistSearch() {
        const searchInput = document.getElementById('whitelist-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                filterWhitelistedComics(searchTerm);
            });
        }
    }

    function updateBlacklistedTagsList() {
        const blacklistedTagsList = document.getElementById('blacklisted-tags-list');
        if (!blacklistedTagsList) return;

        blacklistedTagsList.innerHTML = '';

        for (const [id, details] of Object.entries(customBlacklistedTags)) {
            const level = details.level || 1;
            const tagItem = document.createElement('div');
            tagItem.innerHTML = `
            <span style="color: #ff4444;">
                <strong>(lvl${level}) ${details.name}</strong> (ID: ${id})
            </span>
            <div class="button-group">
                <button class="danger" data-tag-id="${id}" data-remove-blacklist="true">🗑️ Remove</button>
            </div>
        `;

            const removeBtn = tagItem.querySelector('.danger');
            removeBtn.addEventListener('click', () => {
                delete customBlacklistedTags[id];
                GM_deleteValue(`blacklist_${id}`);
                updateBlacklistedTagsList();
                refreshAllItems();
            });

            blacklistedTagsList.appendChild(tagItem);
        }
    }

    function filterBlacklistedTags(searchTerm) {
        const blacklistedTagsList = document.getElementById('blacklisted-tags-list');
        const tagItems = blacklistedTagsList.querySelectorAll('div');

        tagItems.forEach(item => {
            const tagNameElement = item.querySelector('span strong');
            if (tagNameElement) {
                const tagName = tagNameElement.textContent.toLowerCase();
                if (tagName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    }

    function updateWhitelistedComicsList() {
        const whitelistedComicsList = document.getElementById('whitelisted-comics-list');
        if (!whitelistedComicsList) return;

        whitelistedComicsList.innerHTML = '';

        for (const [id, details] of Object.entries(whitelistedComics)) {
            const comicItem = document.createElement('div');
            comicItem.innerHTML = `
            <span style="color: #0A900A;">
                <strong>${details.name}</strong> (ID: ${id})
            </span>
            <div class="button-group">
                <button class="danger" data-comic-id="${id}" data-remove-whitelist="true">🗑️ Remove</button>
            </div>
        `;

            const removeBtn = comicItem.querySelector('.danger');
            removeBtn.addEventListener('click', () => {
                delete whitelistedComics[id];
                GM_deleteValue(`whitelist_${id}`);
                updateWhitelistedComicsList();
                refreshAllItems();
            });

            whitelistedComicsList.appendChild(comicItem);
        }
    }

    function filterWhitelistedComics(searchTerm) {
        const whitelistedComicsList = document.getElementById('whitelisted-comics-list');
        const comicItems = whitelistedComicsList.querySelectorAll('div');

        comicItems.forEach(item => {
            const comicNameElement = item.querySelector('span strong');
            if (comicNameElement) {
                const comicName = comicNameElement.textContent.toLowerCase();
                if (comicName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    }

    function createWhitelistButton() {
        if (!settings.enableCustomBlacklist || !settings.enableComicWhitelisting) return;
        if (!window.location.pathname.match(/\/g\/\d+/)) return;
        if (document.getElementById('whitelist-floating-btn')) return;


        const blacklistContainer = document.querySelector('.container.blacklist.warning');

        if (blacklistContainer) {

            const whitelistBtn = document.createElement('div');
            whitelistBtn.id = 'whitelist-floating-btn';
            whitelistBtn.className = 'whitelist-inline-btn';
            whitelistBtn.innerHTML = '✅ Add To Whitelist';
            whitelistBtn.title = 'Add this comic to whitelist';

            whitelistBtn.addEventListener('click', handleWhitelistClick);


            blacklistContainer.appendChild(whitelistBtn);
        } else {

            const whitelistBtn = document.createElement('div');
            whitelistBtn.id = 'whitelist-floating-btn';
            whitelistBtn.className = 'whitelist-floating-btn';
            whitelistBtn.innerHTML = '✅ Add To Whitelist';
            whitelistBtn.title = 'Add this comic to whitelist';

            whitelistBtn.addEventListener('click', handleWhitelistClick);
            document.body.appendChild(whitelistBtn);
        }
    }

    function handleWhitelistClick() {
        const comicId = window.location.pathname.match(/\/g\/(\d+)/)[1];


        const storedComicData = getStoredComicData(comicId);
        let comicName = storedComicData.name;

        if (!comicName) {
            const comicNameElement = document.querySelector('h1 .pretty');
            comicName = comicNameElement ? comicNameElement.textContent.trim() : `Comic ${comicId}`;
        }

        if (comicName.length > 25) {
            comicName = comicName.substring(0, 25) + '...';
        }

        whitelistedComics[comicId] = {
            name: comicName,
            id: comicId
        };
        GM_setValue(`whitelist_${comicId}`, whitelistedComics[comicId]);


        document.querySelectorAll('.blurred-content').forEach(el => {
            el.classList.remove('blurred-content');
            el.style.filter = '';
            el.style.pointerEvents = '';
        });

        const contentDiv = document.getElementById('content');
        if (contentDiv && contentDiv.innerHTML.includes('Comic Contains Blacklisted Tag')) {
            location.reload();
        }

        const whitelistBtn = document.getElementById('whitelist-floating-btn');
        if (whitelistBtn) {
            whitelistBtn.remove();
        }

        const unblurredLogo = document.getElementById('unblurred-logo');
        if (unblurredLogo) {
            unblurredLogo.remove();
        }
    }

    function isComicWhitelisted(comicId) {
        return settings.enableComicWhitelisting && whitelistedComics[comicId];
    }

    function isComicFavorited() {
        if (!settings.dontTouchFavorites) return false;

        const favoriteButton = document.querySelector('#favorite.btn.btn-primary');
        if (!favoriteButton) return false;

        const textElement = favoriteButton.querySelector('.text');
        if (textElement && textElement.textContent.trim() === 'Unfavorite') {
            return true;
        }

        return false;
    }
    function isInFavoritesPage(item) {
        if (!settings.dontTouchFavorites) return false;
        if (window.location.pathname.startsWith('/favorites')) {
            if (item && item.classList && item.classList.contains('gallery-favorite')) {
                return true;
            }


            const favContainer = document.getElementById('favcontainer');
            if (favContainer && item && favContainer.contains(item)) {
                return true;
            }
        }

        const recentFavContainer = document.getElementById('recent-favorites-container');
        if (recentFavContainer && item && recentFavContainer.contains(item)) {
            return true;
        }

        return false;
    }

    function cleanupFavoritesPageBlacklist() {
        if (!settings.dontTouchFavorites) return;

        const favoritesSelectors = [
            '#favcontainer .gallery.blacklisted',
            '.gallery.blacklisted.gallery-favorite',
            '#recent-favorites-container .gallery.blacklisted'
        ];

        const blacklistedGalleries = document.querySelectorAll(favoritesSelectors.join(', '));

        blacklistedGalleries.forEach(gallery => {

            gallery.classList.remove('blacklisted');

            gallery.style.filter = '';
            gallery.style.opacity = '';
            gallery.style.display = '';

            if (!gallery.classList.contains('gallery')) {
                gallery.classList.add('gallery');
            }
        });
    }

    function manageComicDataLimit() {
        const maxComicData = 5;
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const allKeys = GM_listValues();
        const comicDataKeys = allKeys.filter(key => key.startsWith('comic_data_'));


        comicDataKeys.forEach(key => {
            const data = GM_getValue(key, null);
            if (data && data.timestamp && data.timestamp < sevenDaysAgo) {
                GM_deleteValue(key);
                const comicId = key.replace('comic_data_', '');
                try {
                    sessionStorage.removeItem(`comic_data_${comicId}`);
                } catch (e) {}
            }
        });

        const remainingKeys = GM_listValues().filter(key => key.startsWith('comic_data_'));

        if (remainingKeys.length > maxComicData) {
            const comicDataEntries = remainingKeys.map(key => {
                const data = GM_getValue(key, null);
                return {
                    key: key,
                    timestamp: data ? data.timestamp : 0,
                    data: data
                };
            }).filter(entry => entry.data !== null);

            comicDataEntries.sort((a, b) => a.timestamp - b.timestamp);

            const toDelete = comicDataEntries.length - maxComicData;

            for (let i = 0; i < toDelete; i++) {
                const keyToDelete = comicDataEntries[i].key;
                GM_deleteValue(keyToDelete);

                const comicId = keyToDelete.replace('comic_data_', '');
                try {
                    sessionStorage.removeItem(`comic_data_${comicId}`);
                } catch (e) {}
            }
        }
    }

    function storeComicDataSafely() {
        if (!window.location.pathname.match(/\/g\/\d+/)) return;

        const comicId = window.location.pathname.match(/\/g\/(\d+)/)[1];
        const comicNameElement = document.querySelector('h1 .pretty');
        const comicName = comicNameElement ? comicNameElement.textContent.trim() : null;

        if (comicName && comicId) {
            const comicData = {
                name: comicName,
                id: comicId,
                timestamp: Date.now()
            };

            try {
                sessionStorage.setItem(`comic_data_${comicId}`, JSON.stringify(comicData));
            } catch (e) {}

            GM_setValue(`comic_data_${comicId}`, comicData);

            manageComicDataLimit();
        }
    }

    function getStoredComicData(comicId) {

        try {
            const sessionData = sessionStorage.getItem(`comic_data_${comicId}`);
            if (sessionData) {
                return JSON.parse(sessionData);
            }
        } catch (e) {

        }


        const storedData = GM_getValue(`comic_data_${comicId}`, null);
        return storedData || { name: null, id: comicId };
    }

    function cleanupOldComicData() {
        manageComicDataLimit();
    }


    const fullTagCache = new Map();
    function fetchFullTagsFromAPI(galleryId) {
        return new Promise((resolve, reject) => {
            if (fullTagCache.has(galleryId)) {
                resolve(fullTagCache.get(galleryId));
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://nhentai.net/api/gallery/${galleryId}`,
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': navigator.userAgent
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        const tags = data.tags || [];
                        fullTagCache.set(galleryId, tags);
                        resolve(tags);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Timeout'))
            });
        });
    }

    function formatCount(count) {
        if (count >= 1000) {
            let formatted = (count / 1000).toFixed(1);
            if (formatted.endsWith('.0')) {
                formatted = formatted.slice(0, -2);
            }
            return formatted + 'K';
        }
        return count.toString();
    }

    function createTagElement(tag) {
        const tagElement = document.createElement('a');
        const tagNameFormatted = tag.name.replace(/\s+/g, '-');
        tagElement.href = `/tag/${tagNameFormatted}/`;
        tagElement.className = `tag tag-${tag.id}`;
        tagElement.innerHTML = `<span class="name">${tag.name}</span><span class="count">${formatCount(tag.count)}</span>`;
        return tagElement;
    }


    function findOrCreateCategoryContainer(type, parent) {
        const typeToLabelMap = {
            tag: 'Tags:',
            artist: 'Artists:',
            character: 'Characters:',
            parody: 'Parodies:',
            group: 'Groups:',
            category: 'Categories:',
            language: 'Languages:'
        };
        const label = typeToLabelMap[type] || `${type.charAt(0).toUpperCase() + type.slice(1)}:`;

        let container = Array.from(parent.querySelectorAll('.tag-container')).find(el => {
            const textContent = el.cloneNode(true);
            textContent.querySelectorAll('.tags').forEach(span => span.remove());
            return textContent.textContent.trim().startsWith(label);
        });

        if (!container) {
            container = document.createElement('div');
            container.className = 'tag-container field-name';
            container.innerHTML = `
                ${label}
                <span class="tags"></span>
            `;
            const pagesContainer = parent.querySelector('.tag-container.field-name:last-of-type');
            if (pagesContainer && (pagesContainer.textContent.includes('Pages:') || pagesContainer.textContent.includes('Uploaded:'))) {
                parent.insertBefore(container, pagesContainer);
            } else {
                parent.appendChild(container);
            }
        }
        return container;
    }

    async function addMissingTagsToPage() {
        if (!settings.showMissingTags || !window.location.pathname.match(/\/g\/\d+/)) return;
        const comicIdMatch = window.location.pathname.match(/\/g\/(\d+)/);
        if (!comicIdMatch) return;
        const comicId = comicIdMatch[1];
        try {
            const apiTags = await fetchFullTagsFromAPI(comicId);
            if (!apiTags || apiTags.length === 0) return;

            const existingTagIds = new Set();
            document.querySelectorAll('#tags .tag[class*="tag-"]').forEach(tagEl => {
                const match = tagEl.className.match(/tag-(\d+)/);
                if (match) existingTagIds.add(parseInt(match[1]));
            });
            const missingTags = apiTags.filter(apiTag => !existingTagIds.has(apiTag.id));
            if (missingTags.length === 0) return;

            const tagContainerParent = document.getElementById('tags');
            if (!tagContainerParent) return;
            missingTags.forEach(tag => {
                const categoryContainer = findOrCreateCategoryContainer(tag.type, tagContainerParent);
                const tagsSpan = categoryContainer.querySelector('.tags');
                if (tagsSpan) {
                    const newTagEl = createTagElement(tag);
                    tagsSpan.appendChild(newTagEl);

                    if (categoryContainer.classList.contains('hidden')) {
                        categoryContainer.classList.remove('hidden');
                    }
                }
            });
            processedTags.clear();

        } catch (error) {
            console.error('Error adding missing tags:', error);
        }
    }


    function openSettingsMenu() {
        const settingsModal = document.getElementById('settings-modal');
        const modalOverlay = document.getElementById('modal-overlay');

        if (!settingsModal || !modalOverlay) {
            console.error('Settings modal elements not found');
            return;
        }

        updateManagedTagsList();
        updateBlacklistedTagsList();
        updateWhitelistedComicsList();
        setupWhitelistSearch();
        setupSettingsTabs();
        setupTooltips();
        setupTagSearch();
        setupTagTextColorToggle();
        setupCustomBlacklistToggle();
        setupBetterBlacklistToggle();
        setupBlacklistSearch();


        settingsModal.style.display = 'block';
        modalOverlay.style.display = 'block';


        setTimeout(() => {
            setupButtonTransparencySlider();
            setupTransparencyStrengthSlider();
        }, 100);
    }


    function setupRangeDisplays() {
        const transparencyRange = document.getElementById('setting-transparency-strength');
        const transparencyDisplay = document.getElementById('transparency-display');

        transparencyRange.addEventListener('input', (e) => {
            transparencyDisplay.textContent = Math.round(e.target.value * 100) + '%';
        });
    }

    function setupSettingsTabs() {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        const lastActiveTab = GM_getValue('last_active_tab', 'general');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));

                tab.classList.add('active');
                const targetTab = `${tab.dataset.tab}-tab`;
                document.getElementById(targetTab).classList.add('active');

                GM_setValue('last_active_tab', tab.dataset.tab);
            });
        });

        const targetTab = document.querySelector(`[data-tab="${lastActiveTab}"]`);
        if (targetTab) {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            targetTab.classList.add('active');
            document.getElementById(`${lastActiveTab}-tab`).classList.add('active');
        }
    }

    function setupTagSearch() {
        const searchInput = document.getElementById('tag-search');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterManagedTags(searchTerm);
        });
    }

    function updateManagedTagsList() {
        const managedTagsList = document.getElementById('managed-tags-list');
        managedTagsList.innerHTML = '';

        const sortedTags = Object.entries(tagDetails).sort((a, b) => {
            const priorityA = a[1].priority ?? settings.defaultPriority;
            const priorityB = b[1].priority ?? settings.defaultPriority;
            return priorityB - priorityA;
        });

        for (const [id, details] of sortedTags) {
            const tagItem = document.createElement('div');
            tagItem.innerHTML = `
                <span style="color: ${details.color};">
                    <strong>${details.name}</strong><span class="priority-badge">${details.priority}</span> (ID: ${id})
                </span>
                <div class="button-group">
                    <button class="danger" data-tag-id="${id}" data-remove="true">🗑️ Remove</button>
                </div>
            `;

            const removeBtn = tagItem.querySelector('.danger');
            removeBtn.addEventListener('click', () => removeTag(id));

            managedTagsList.appendChild(tagItem);
        }
    }

    function removeTag(tagId) {
        delete tagDetails[tagId];
        GM_deleteValue(`tag_${tagId}`);
        updateManagedTagsList();
        refreshAllItems();
    }

    function getGalleryId(item) {
        const link = item.querySelector('a[href*="/g/"]');
        if (link) {
            const match = link.href.match(/\/g\/(\d+)/);
            if (match) return match[1];
        }

        const dataId = item.getAttribute('data-id');
        if (dataId) return dataId;

        const caption = item.querySelector('.caption');
        if (caption && caption.getAttribute('data-id')) {
            return caption.getAttribute('data-id');
        }

        const img = item.querySelector('img[data-src], img[src]');
        if (img) {
            const imgSrc = img.getAttribute('data-src') || img.src;
            const match = imgSrc.match(/\/(\d+)\/cover\./);
            if (match) return match[1];
        }

        for (const attr of item.attributes) {
            if (attr.name.includes('id') && /^\d+$/.test(attr.value)) {
                return attr.value;
            }
        }

        return null;
    }

    function fetchGalleryTagsFromAPI(galleryId) {
        return new Promise((resolve, reject) => {
            if (pendingFetches.has(galleryId)) {
                setTimeout(() => {
                    resolve(tagCache.get(galleryId) || []);
                }, 1000);
                return;
            }

            if (tagCache.has(galleryId)) {
                resolve(tagCache.get(galleryId));
                return;
            }

            if (failedFetches.has(galleryId)) {
                resolve([]);
                return;
            }

            pendingFetches.add(galleryId);

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://nhentai.net/api/gallery/${galleryId}`,
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                    'Referer': 'https://nhentai.net/',
                    'User-Agent': navigator.userAgent
                },
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            const tagIds = [];

                            if (data.tags && Array.isArray(data.tags)) {
                                data.tags.forEach(tag => {
                                    if (tag.id) {
                                        tagIds.push(parseInt(tag.id));
                                        allKnownTags.set(tag.id.toString(), tag.name);
                                    }
                                });
                            }

                            tagCache.set(galleryId, tagIds);
                            pendingFetches.delete(galleryId);
                            resolve(tagIds);
                        } else if (response.status === 404) {
                            failedFetches.add(galleryId);
                            tagCache.set(galleryId, []);
                            pendingFetches.delete(galleryId);
                            resolve([]);
                        } else {
                            pendingFetches.delete(galleryId);
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    } catch (error) {
                        pendingFetches.delete(galleryId);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    pendingFetches.delete(galleryId);
                    reject(error);
                },
                ontimeout: function() {
                    pendingFetches.delete(galleryId);
                    reject(new Error('Timeout'));
                }
            });
        });
    }

    function checkBlacklist(item) {
        if (settings.dontTouchFavorites && window.location.pathname.match(/\/g\/\d+/) && isComicFavorited()) {
            item.classList.remove('blacklisted');
            item.style.filter = '';
            item.style.opacity = '';
            item.style.display = '';
            return;
        }

        if (settings.dontTouchFavorites &&
            (window.location.pathname.startsWith('/favorites') ||
             document.getElementById('recent-favorites-container')?.contains(item))) {
            item.classList.remove('blacklisted');
            item.style.filter = '';
            item.style.opacity = '';
            item.style.display = '';
            return;
        }

        const galleryId = getGalleryId(item);
        if (isComicWhitelisted(galleryId)) {
            item.classList.remove('blacklisted');
            item.style.filter = '';
            item.style.opacity = '';
            item.style.display = '';
            return;
        }

        if (!settings.betterBlacklist && !settings.enableCustomBlacklist) return;

        const dataTags = item.getAttribute('data-tags');
        if (!dataTags) return;

        const tags = dataTags.split(' ').map(Number).filter(tag => !isNaN(tag) && tag > 0);
        let isBlacklisted = false;
        let blacklistedCount = 0;
        let favoriteCount = 0;

        const currentBlacklist = getCurrentBlacklistedTags();

        tags.forEach(tag => {
            if (currentBlacklist.includes(tag)) {
                blacklistedCount++;
            }
            if (tagDetails[tag]) {
                favoriteCount++;
            }
        });

        isBlacklisted = blacklistedCount > 0;

        if (settings.enableCustomBlacklist && settings.allowTagCoexistence && favoriteCount > 0) {
            const customBlacklistedCount = tags.filter(tag => customBlacklistedTags[tag]).length;

            if (customBlacklistedCount > 0 && favoriteCount > 0) {
                if (settings.coexistenceMode === 'favorite') {
                    isBlacklisted = false;
                } else if (settings.coexistenceMode === 'blacklisted') {
                    isBlacklisted = true;
                } else if (settings.coexistenceMode === 'balanced') {
                    let weightedBlacklistScore = 0;
                    tags.forEach(tag => {
                        if (customBlacklistedTags[tag]) {
                            const level = customBlacklistedTags[tag].level || 1;
                            weightedBlacklistScore += level;
                        }
                    });

                    if (favoriteCount > weightedBlacklistScore) {
                        isBlacklisted = false;
                    } else if (weightedBlacklistScore > favoriteCount) {
                        isBlacklisted = true;
                    } else {
                        isBlacklisted = false;
                    }
                }
            }
        }

        if (isBlacklisted) {
            if (settings.betterBlacklist && !settings.enableCustomBlacklist) {
                if (!item.classList.contains('blacklisted')) {
                    item.classList.add('blacklisted');
                }
                return;
            }

            if (settings.enableCustomBlacklist) {
                const action = settings.blacklistAction;

                if (action === 'blur') {
                    item.style.filter = 'blur(10px)';
                    item.style.opacity = '0.5';
                } else if (action === 'remove') {
                    item.style.display = 'none';
                }

                if (!item.classList.contains('blacklisted')) {
                    item.classList.remove('gallery');
                    item.classList.add('gallery', 'blacklisted');
                }
            }
        } else {
            item.classList.remove('blacklisted');
            item.style.filter = '';
            item.style.opacity = '';
            item.style.display = '';
        }
    }

    function checkPageBlacklist() {
        if (settings.dontTouchFavorites && isComicFavorited()) {
            return;
        }
        const currentComicId = window.location.pathname.match(/\/g\/(\d+)/);
        if (currentComicId && isComicWhitelisted(currentComicId[1])) {
            return;
        }
        if (!window.location.pathname.match(/\/g\/\d+/)) return;

        const tags = document.querySelectorAll('.tag');
        const pageTagIds = [];
        const processedTagIds = new Set();

        tags.forEach(tag => {
            const match = tag.className.match(/tag-(\d+)/);
            if (match) {
                const tagId = parseInt(match[1]);
                if (!processedTagIds.has(tagId)) {
                    pageTagIds.push(tagId);
                    processedTagIds.add(tagId);
                }
            }
        });

        const blacklistedPageTags = [];
        let shouldTakeAction = false;
        let shouldShowWarning = false;

        if (settings.betterBlacklist && !settings.enableCustomBlacklist) {
            pageTagIds.forEach(tagId => {
                if (extractedSiteBlacklist.includes(tagId)) {
                    const tagName = getTagNameById(tagId) || allKnownTags.get(tagId.toString()) || `Tag ${tagId}`;
                    if (!blacklistedPageTags.find(t => t.id === tagId)) {
                        blacklistedPageTags.push({ name: tagName, id: tagId });
                    }
                    shouldTakeAction = true;
                }
            });

            if (shouldTakeAction && settings.warnOnBlacklistedComics) {
                shouldShowWarning = true;
            }
        }

        if (settings.enableCustomBlacklist) {
            let customBlacklistedCount = 0;
            let favoriteCount = 0;
            pageTagIds.forEach(tagId => {
                if (customBlacklistedTags[tagId]) {
                    if (!blacklistedPageTags.find(t => t.id === tagId)) {
                        blacklistedPageTags.push({
                            name: customBlacklistedTags[tagId].name,
                            id: tagId,
                            level: customBlacklistedTags[tagId].level || 1
                        });
                    }
                    customBlacklistedCount += (customBlacklistedTags[tagId].level || 1);
                }
                if (tagDetails[tagId]) {
                    favoriteCount++;
                }
            });
            shouldTakeAction = customBlacklistedCount > 0;

            if (settings.allowTagCoexistence && customBlacklistedCount > 0 && favoriteCount > 0) {
                if (settings.coexistenceMode === 'favorite') {
                    shouldTakeAction = false;
                } else if (settings.coexistenceMode === 'blacklisted') {
                    shouldTakeAction = true;
                } else if (settings.coexistenceMode === 'balanced') {
                    if (favoriteCount > customBlacklistedCount) {
                        shouldTakeAction = false;
                    } else if (customBlacklistedCount > favoriteCount) {
                        shouldTakeAction = true;
                    } else {
                        shouldTakeAction = false;
                    }
                }
            }

            if (shouldTakeAction) {
                if (settings.blacklistAction === 'blur') {
                    blurPageContent();
                } else if (settings.blacklistAction === 'remove') {
                    const contentDiv = document.getElementById('content');
                    if (contentDiv) {
                        const uniqueTagsMap = new Map();
                        blacklistedPageTags.forEach(tag => {
                            uniqueTagsMap.set(tag.id, tag);
                        });

                        const blacklistTagsHTML = Array.from(uniqueTagsMap.values())
                        .map(tag => {
                            const tagElement = document.querySelector(`.tag-${tag.id}`);
                            if (tagElement) {
                                const clonedTag = tagElement.cloneNode(true);

                                const countSpans = clonedTag.querySelectorAll('.count, .blacklist-level');
                                countSpans.forEach(span => span.remove());

                                return `<li>${clonedTag.outerHTML}</li>`;
                            } else {
                                return `<li><span class="tag" style="background-color: #ff4444; color: white; padding: 2px 6px; border-radius: 3px;">${tag.name}</span></li>`;
                            }
                        })
                        .join('');

                        contentDiv.innerHTML = `
                        <div class="container blacklist warning">
                            <h1>Comic Contains Blacklisted Tag</h1>
                            <p>This Comic Contains the following Blacklisted Tags (Custom Blacklist Only):</p>
                            <ul style="text-align: left; margin: 15px 0; list-style: none; padding: 0;">
                                ${blacklistTagsHTML}
                            </ul>
                            <p>You can change these settings in 🚫 Blacklist Settings Page</p>
                        </div>
                    `;
                    }
                }
            }
        }

        if (shouldShowWarning && blacklistedPageTags.length > 0) {
            showBlacklistWarning(blacklistedPageTags);
        }
        if (shouldTakeAction) {
            setTimeout(() => {
                createWhitelistButton();
            }, 100);
        }
    }

    function getTagNameById(tagId) {
        try {
            const scriptTags = document.querySelectorAll('script');
            for (const script of scriptTags) {
                if (script.textContent.includes('blacklisted_tags:')) {
                    return null;
                }
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    function blurPageContent() {
        const elementsToBlur = document.querySelectorAll('body > *:not(#settings-modal):not(#tag-modal):not(#edit-tag-modal):not(#modal-overlay):not(.tooltip):not(.floating-settings-btn)');
        elementsToBlur.forEach(element => {
            if (!element.classList.contains('modal') &&
                !element.id.includes('modal') &&
                !element.classList.contains('tooltip') &&
                !element.classList.contains('floating-settings-btn') &&
                element.id !== 'floating-settings-btn') {
                element.classList.add('blurred-content');
                element.style.filter = 'blur(5px)';
                element.style.pointerEvents = 'none';
            }
        });

        const logoElement = document.querySelector('a.logo');
        if (logoElement) {
            const unblurredLogo = logoElement.cloneNode(true);
            unblurredLogo.id = 'unblurred-logo';
            unblurredLogo.style.cssText = `
            position: fixed;
            left: 0px;
            top: 0px;
            z-index: 9999;
            filter: none !important;
            pointer-events: auto !important;
            padding: 10px;
            border-radius: 5px;
        `;
            document.body.appendChild(unblurredLogo);
        }
    }

    function removeAnnoyances() {
        if (!settings.removeAnnoyances) return;

        const aiJerkOffLink = document.querySelector('nav div ul li a[href*="tsyndicate.com"]');
        if (aiJerkOffLink) {
            aiJerkOffLink.closest('li').remove();
        }

        const twitterLink = document.querySelector('nav div ul li a[href*="twitter.com"]');
        if (twitterLink) {
            twitterLink.closest('li').remove();
        }

        const alertWarning = document.querySelector('.alert-warning.alert.announcement');
        if (alertWarning) {
            alertWarning.remove();
        }
    }
    function showBlacklistWarning(tags) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

        const warning = document.createElement('div');
        warning.style.cssText = `
        background-color: #2b2b2b;
        color: #fff;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        text-align: center;
        border: 2px solid #ff4444;
        position: relative;
        z-index: 10001;
        max-height: 80vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #666 #2b2b2b;
        filter: none !important;
    `;

        warning.innerHTML = `
        <h2 style="color: #ff4444; margin-top: 0;">⚠️ Warning</h2>
        <p><strong>This Page Contains Blacklisted Tags:</strong></p>
        <ul style="text-align: left; margin: 15px 0; max-height: 200px; overflow-y: auto;">
            ${tags.map(tag => `<li>${tag.name} (${tag.id})</li>`).join('')}
        </ul>
        <button id="close-blacklist-warning" style="
            background-color: #0A900A;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        ">Close Warning</button>
    `;

        overlay.appendChild(warning);
        document.body.appendChild(overlay);

        document.getElementById('close-blacklist-warning').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    async function checkLanguageFilter(item) {
        if (settings.forceLanguage === 'none') return true;

        const requiredLanguageTag = LANGUAGE_TAGS[settings.forceLanguage];
        if (!requiredLanguageTag) return true;

        const onPageTags = (item.getAttribute('data-tags') || '').split(' ').map(Number).filter(tag => !isNaN(tag) && tag > 0);
        const allLanguageTagIds = Object.values(LANGUAGE_TAGS).filter(id => id !== null);

        const hasKnownLanguageTag = onPageTags.some(tagId => allLanguageTagIds.includes(tagId));

        let tagsToFilter = onPageTags;

        if (!hasKnownLanguageTag) {
            const galleryId = getGalleryId(item);
            const failures = languageApiFailures.get(galleryId) || 0;

            if (galleryId && failures < 5) {
                try {
                    const apiTags = await fetchGalleryTagsFromAPI(galleryId);
                    if (apiTags && apiTags.length > 0) {
                        tagsToFilter = apiTags;
                        languageApiFailures.delete(galleryId);
                    }
                } catch (error) {
                    languageApiFailures.set(galleryId, failures + 1);
                }
            }
        }

        const hasRequiredLanguage = tagsToFilter.includes(requiredLanguageTag);
        const hasOtherLanguages = allLanguageTagIds
        .filter(tagId => tagId !== requiredLanguageTag)
        .some(tagId => tagsToFilter.includes(tagId));

        if (!hasRequiredLanguage || hasOtherLanguages) {
            item.style.display = 'none';
            return false;
        }

        return true;
    }

    async function processItem(item) {
        try {

            if (isInFavoritesPage(item)) {
                return;
            }
            const galleryId = getGalleryId(item);
            const itemId = galleryId || item.getAttribute('data-tags') || item.innerHTML.slice(0, 100);

            if (processedItems.has(itemId)) {
                return;
            }

            let dataTags = item.getAttribute('data-tags');
            if (!dataTags) {
                const img = item.querySelector('img[data-src]');
                if (img && img.getAttribute('data-src')) {
                    img.setAttribute('src', img.getAttribute('data-src'));
                }
                return;
            }


            if (!(await checkLanguageFilter(item))) {
                processedItems.add(itemId);
                return;
            }

            let tags = dataTags.split(' ').map(Number).filter(tag => !isNaN(tag) && tag > 0);
            if (tags.length < settings.minTagsThreshold && galleryId && !failedFetches.has(galleryId)) {
                item.classList.add('tag-loading');
                try {
                    const fetchedTags = await fetchGalleryTagsFromAPI(galleryId);
                    if (fetchedTags && fetchedTags.length > tags.length) {
                        tags = fetchedTags;
                        item.setAttribute('data-tags', tags.join(' '));


                        if (!(await checkLanguageFilter(item))) {
                            processedItems.add(itemId);
                            return;
                        }

                        if (settings.showGreenBorder) {
                            item.classList.add('tag-fetched');
                        }
                    }
                } catch (error) {
                    setTimeout(() => {
                        failedFetches.delete(galleryId);

                    }, 300000);
                } finally {
                    item.classList.remove('tag-loading');
                }
            }

            const matchingTags = tags.filter(tag => tag in tagDetails);
            if (matchingTags.length > 0) {
                highlightDotItem(item, matchingTags);
            } else if (settings.markNoFavTagComics) {
                addNoFavTagIndicator(item);
            }

            checkBlacklist(item);
            processedItems.add(itemId);
        } catch (error) {}
    }

    function addNoFavTagIndicator(item) {
        const existing = item.querySelector('.no-fav-tag-indicator');
        if (existing) existing.remove();

        const indicator = document.createElement('div');
        indicator.className = 'no-fav-tag-indicator';
        indicator.textContent = 'No Fav Tags';
        item.appendChild(indicator);
    }

    function updateButtonAppearance(button, isHighlighted) {
        if (isHighlighted) {
            button.style.color = settings.removeHighlightColor || '#AD2204';
            button.setAttribute('title', 'Remove Highlight');
            button.classList.add('favorited');
        } else {
            button.style.color = settings.addHighlightColor || '#0A900A';
            button.setAttribute('title', 'Add Highlight');
            button.classList.remove('favorited');
        }
    }

    function updateTagContainerAppearance(tagContainer, tagId, isHighlighted) {
        if (isHighlighted && tagDetails[tagId]) {
            tagContainer.style.outline = `2px solid ${tagDetails[tagId].color}`;
            tagContainer.style.outlineOffset = '-2px';
            tagContainer.style.borderRadius = '5px';
        } else {
            tagContainer.style.outline = 'none';
        }
    }

    function highlightDotItem(item, matchingTags) {
        try {
            const existingDots = item.querySelectorAll('.tag-highlight-dot');
            const existingIndicator = item.querySelector('.no-fav-tag-indicator');
            existingDots.forEach(dot => dot.remove());
            if (existingIndicator) existingIndicator.remove();

            item.style.position = 'relative';

            matchingTags.sort((a, b) => {
                const priorityA = tagDetails[a]?.priority ?? settings.defaultPriority;
                const priorityB = tagDetails[b]?.priority ?? settings.defaultPriority;
                return priorityB - priorityA;
            });

            let tagHighlightAmt = matchingTags.length;
            if(settings.highlightCutoffThreshold > 0) {
                tagHighlightAmt = Math.min(settings.highlightCutoffThreshold, tagHighlightAmt);
            }

            for (let i = 0; i < tagHighlightAmt; i++) {
                const tag = matchingTags[i];
                const tagDetail = tagDetails[tag];
                if (tagDetail) {
                    const dotContainer = document.createElement('div');
                    dotContainer.className = 'tag-highlight-dot';
                    dotContainer.style.display = 'flex';
                    dotContainer.style.alignItems = 'center';
                    dotContainer.style.position = 'absolute';
                    dotContainer.style.top = `${5 + i * 20}px`;
                    dotContainer.style.padding = '1px 5px';
                    dotContainer.style.borderRadius = '5px';
                    dotContainer.style.pointerEvents = 'none';
                    dotContainer.style.zIndex = '10';

                    if (settings.tagPosition === 'right') {
                        dotContainer.style.right = '5px';
                        dotContainer.style.left = 'auto';
                    } else {
                        dotContainer.style.left = '5px';
                        dotContainer.style.right = 'auto';
                    }

                    if (!settings.removeTagBackground) {
                        const opacity = settings.transparentBackground ?
                              (1 - settings.transparencyStrength) : 0.66;
                        dotContainer.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
                    } else {
                        dotContainer.style.backgroundColor = 'transparent';
                    }

                    const dot = document.createElement('div');
                    dot.style.width = '15px';
                    dot.style.height = '15px';
                    dot.style.backgroundColor = tagDetail.color;
                    dot.style.borderRadius = '50%';
                    dot.style.marginRight = '5px';
                    dot.style.flexShrink = '0';

                    const tagName = document.createElement('span');
                    tagName.innerText = tagDetail.name;
                    tagName.style.fontSize = '12px';
                    tagName.style.whiteSpace = 'nowrap';
                    tagName.style.overflow = 'hidden';
                    tagName.style.textOverflow = 'ellipsis';

                    if (settings.useCustomTagTextColor) {
                        tagName.style.color = settings.tagTextColor + ' !important';
                    } else {
                        tagName.style.color = '#FFFFFF !important';
                    }

                    dotContainer.appendChild(dot);
                    dotContainer.appendChild(tagName);

                    const potentialBottomPosition = 5 + (i + 1) * 20;
                    if (potentialBottomPosition <= (item.offsetHeight || 250)) {
                        item.appendChild(dotContainer);
                    } else {
                        break;
                    }
                }
            }
        } catch (error) {}
    }

    function sortTagsOnComicPage() {
        if (!settings.sortTagsByPriority) {
            const existingSortedLayer = document.querySelector('.sorted-tags-layer');
            if (existingSortedLayer) {
                existingSortedLayer.remove();
            }

            const tagContainer = document.querySelector('#tags');
            if (tagContainer) {
                const originalTags = tagContainer.querySelectorAll('.tag-container.original-tags');
                originalTags.forEach(section => {
                    section.classList.remove('original-tags');
                    section.style.visibility = '';
                    section.style.position = '';
                    section.style.left = '';
                });

                const hiddenOriginals = tagContainer.querySelectorAll('.hidden-original');
                hiddenOriginals.forEach(element => {
                    element.classList.remove('hidden-original');
                    element.style.display = '';
                });
            }
            return;
        }

        if (!window.location.pathname.match(/\/g\/\d+/)) return;

        const tagContainer = document.querySelector('#tags');
        if (!tagContainer) return;

        if (tagContainer.querySelector('.sorted-tags-layer')) return;

        const allContainers = Array.from(tagContainer.children);

        const tagSectionsToSort = allContainers.filter(section => {
            return section.classList.contains('tag-container') && section.querySelectorAll('.tag').length > 0;
        });

        if (tagSectionsToSort.length === 0) return;

        const sortedLayer = document.createElement('div');
        sortedLayer.className = 'sorted-tags-layer';

        allContainers.forEach(container => {
            if (tagSectionsToSort.includes(container)) {
                container.classList.add('original-tags');

                const clonedSection = container.cloneNode(true);
                clonedSection.classList.remove('original-tags');

                const tags = Array.from(clonedSection.querySelectorAll('.tag'));

                tags.sort((a, b) => {
                    const aMatch = a.className.match(/tag-(\d+)/);
                    const bMatch = b.className.match(/tag-(\d+)/);

                    if (!aMatch || !bMatch) return 0;

                    const aId = aMatch[1];
                    const bId = bMatch[1];
                    const aMarked = tagDetails[aId];
                    const bMarked = tagDetails[bId];
                    const aBlacklisted = customBlacklistedTags[aId];
                    const bBlacklisted = customBlacklistedTags[bId];

                    if (aBlacklisted && bBlacklisted) {

                        const aLevel = aBlacklisted.level || 1;
                        const bLevel = bBlacklisted.level || 1;
                        return aLevel - bLevel;
                    }

                    if (aBlacklisted && !bBlacklisted) return 1;
                    if (!aBlacklisted && bBlacklisted) return -1;

                    if (aMarked && bMarked) {
                        const aPriority = aMarked.priority ?? settings.defaultPriority;
                        const bPriority = bMarked.priority ?? settings.defaultPriority;
                        return bPriority - aPriority;
                    }

                    if (aMarked && !bMarked) return -1;
                    if (!aMarked && bMarked) return 1;

                    return 0;
                });

                const tagList = clonedSection.querySelector('.tags') || clonedSection;
                tagList.innerHTML = '';
                tags.forEach(tag => {
                    tag.style.userSelect = '';
                    tag.style.webkitUserSelect = '';
                    tag.style.mozUserSelect = '';

                    const nameElement = tag.querySelector('.name');
                    if (nameElement) {
                        nameElement.style.userSelect = '';
                        nameElement.style.webkitUserSelect = '';
                        nameElement.style.mozUserSelect = '';
                    }

                    tagList.appendChild(tag);
                });

                sortedLayer.appendChild(clonedSection);
            } else {
                const clonedContainer = container.cloneNode(true);
                sortedLayer.appendChild(clonedContainer);

                container.style.display = 'none';
                container.classList.add('hidden-original');
            }
        });

        tagContainer.appendChild(sortedLayer);
    }

    function showBlacklistLevelDialog(tagId, tagName, button) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
        background-color: #2b2b2b;
        color: #fff;
        padding: 30px;
        border-radius: 10px;
        max-width: 400px;
        text-align: center;
        border: 2px solid #ff4444;
        filter: none !important;
    `;

        dialog.innerHTML = `
        <h3 style="margin-top: 0; color: #ff4444;">Set Blacklist Level</h3>
        <p>Tag: <strong>${tagName}</strong></p>
        <p>Select the blacklist level (1-5):</p>
        <select id="blacklist-level-select" style="
            background-color: #444;
            color: #fff;
            border: 1px solid #555;
            padding: 5px 10px;
            border-radius: 4px;
            margin: 10px 0;
        ">
            <option value="1">Level 1 (Normal)</option>
            <option value="2">Level 2 (Counts as 2 tags)</option>
            <option value="3">Level 3 (Counts as 3 tags)</option>
            <option value="4">Level 4 (Counts as 4 tags)</option>
            <option value="5">Level 5 (Counts as 5 tags)</option>
        </select>
        <br>
        <button id="confirm-blacklist" style="
            background-color: #ff4444;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        ">Add to Blacklist</button>
        <button id="cancel-blacklist" style="
            background-color: #666;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        ">Cancel</button>
    `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        document.getElementById('confirm-blacklist').addEventListener('click', () => {
            const level = parseInt(document.getElementById('blacklist-level-select').value);
            customBlacklistedTags[tagId] = {
                name: tagName,
                id: tagId,
                level: level
            };
            GM_setValue(`blacklist_${tagId}`, customBlacklistedTags[tagId]);
            button.style.color = '#ff4444';
            button.title = `Remove from Blacklist (Level ${level})`;

            updateBlacklistLevels();

            overlay.remove();
            refreshAllItems();
        });

        document.getElementById('cancel-blacklist').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    function addTagLevelDisplay(button, level) {
        setTimeout(updateBlacklistLevels, 50);
    }

    function addTagButtons() {
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            try {
                const match = tag.className.match(/tag-(\d+)/);
                if (!match) return;

                const tagId = match[1];

                if (processedTags.has(tagId) || tag.querySelector('.addTagButton')) {
                    return;
                }

                const buttonContainer = tag.querySelector('.count');
                if (!buttonContainer) return;

                const addButton = document.createElement('div');
                addButton.classList.add('addTagButton');
                addButton.setAttribute('alt', 'add-tag');
                addButton.style.cursor = 'pointer';
                addButton.style.display = 'inline-block';
                addButton.style.color = '#0A900A';

                const addButtonIcon = document.createElement('div');
                addButtonIcon.innerHTML = heartIcon;
                addButtonIcon.style.width = '18px';
                addButtonIcon.style.height = '18px';

                const isHighlighted = tagId in tagDetails;

                if (isHighlighted) {
                    addButton.classList.add('favorited');
                    addButton.setAttribute('title', 'Remove Highlight');
                    addButton.style.color = '#AD2204';
                } else {
                    addButton.classList.remove('favorited');
                    addButton.setAttribute('title', 'Add Highlight');
                    addButton.style.color = '#0A900A';
                }

                updateTagContainerAppearance(tag, tagId, isHighlighted);

                addButton.appendChild(addButtonIcon);
                buttonContainer.appendChild(addButton);

                addButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();

                    const currentTagMatch = tag.className.match(/tag-(\d+)/);
                    if (!currentTagMatch) return false;

                    const currentTagId = currentTagMatch[1];

                    const allTagButtons = document.querySelectorAll(`.tag-${currentTagId} .addTagButton`);

                    if (tagDetails[currentTagId]) {
                        delete tagDetails[currentTagId];
                        GM_deleteValue(`tag_${currentTagId}`);

                        allTagButtons.forEach(btn => {
                            updateButtonAppearance(btn, false);
                        });

                        const allTagContainers = document.querySelectorAll(`.tag-${currentTagId}`);
                        allTagContainers.forEach(container => {
                            updateTagContainerAppearance(container, currentTagId, false);
                        });

                        refreshAllItems();
                    } else {
                        const tagName = tag.querySelector('.name')?.innerText || `Tag ${currentTagId}`;
                        toggleTagPopup(currentTagId, tagName, addButton, tag);
                    }

                    return false;
                });

                if (settings.enableCustomBlacklist && settings.showBlacklistIcon) {
                    const blacklistButton = document.createElement('div');
                    blacklistButton.classList.add('blacklistTagButton');
                    blacklistButton.style.cursor = 'pointer';
                    blacklistButton.style.display = settings.showBlacklistIcon ? 'inline-block' : 'none';
                    blacklistButton.style.marginLeft = '5px';

                    const blacklistIcon = document.createElement('div');
                    blacklistIcon.innerHTML = xIcon;
                    blacklistIcon.style.width = '9px';
                    blacklistIcon.style.height = '16px';

                    const isBlacklisted = customBlacklistedTags[tagId];
                    blacklistButton.style.color = isBlacklisted ? '#ff4444' : '#666';
                    blacklistButton.title = isBlacklisted ? 'Remove from Blacklist' : 'Add to Blacklist';

                    blacklistButton.appendChild(blacklistIcon);
                    buttonContainer.appendChild(blacklistButton);
                    if (settings.enableCustomBlacklist && settings.showBlacklistedTagBorder && customBlacklistedTags[tagId]) {
                        tag.classList.add('blacklisted-border');
                    } else {
                        tag.classList.remove('blacklisted-border');
                    }

                    blacklistButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (customBlacklistedTags[tagId]) {
                            delete customBlacklistedTags[tagId];
                            GM_deleteValue(`blacklist_${tagId}`);
                            blacklistButton.style.color = '#666';
                            blacklistButton.title = 'Add to Blacklist';
                            const levelDisplay = blacklistButton.parentNode.querySelector('.tag-level-display');
                            if (levelDisplay) levelDisplay.remove();
                            updateBlacklistLevels();
                        } else {
                            const tagName = tag.querySelector('.name')?.innerText || `Tag ${tagId}`;
                            showBlacklistLevelDialog(tagId, tagName, blacklistButton);
                        }
                        refreshAllItems();
                        return false;
                    });
                }

                processedTags.add(tagId);

                const tagName = tag.querySelector('.name')?.innerText;
                if (tagName) {
                    allKnownTags.set(tagId, tagName);
                }
            } catch (error) {}
        });

        setTimeout(sortTagsOnComicPage, 100);
    }

    function toggleTagPopup(tagId, tagName, button, tagContainer) {
        if (button.dataset.processing === 'true') return;
        button.dataset.processing = 'true';

        setTimeout(() => {
            button.dataset.processing = 'false';
        }, 1000);

        const tagModal = document.getElementById('tag-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const existingTagsList = document.getElementById('existing-tags-list');

        existingTagsList.innerHTML = '';
        const sortedTagDetails = Object.entries(tagDetails).sort((a, b) => {
            const priorityA = a[1].priority ?? settings.defaultPriority;
            const priorityB = b[1].priority ?? settings.defaultPriority;
            return priorityB - priorityA;
        });

        for (const [id, details] of sortedTagDetails) {
            const tagItem = document.createElement('div');
            tagItem.innerHTML = `
            <span style="color: ${details.color};">${details.name}</span>
            <span class="priority-badge">${details.priority}</span>`;
            existingTagsList.appendChild(tagItem);
        }

        document.getElementById('tag-name').value = tagName;
        document.getElementById('tag-priority').value = settings.defaultPriority;
        document.getElementById('tag-color').value = '#32a852';
        tagModal.style.display = 'block';
        modalOverlay.style.display = 'block';

        const saveBtn = document.getElementById('save-tag');
        const cancelBtn = document.getElementById('cancel-tag');
        const newSaveBtn = saveBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);

        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        newSaveBtn.addEventListener('click', () => {
            const newTagName = document.getElementById('tag-name').value.trim();
            const priority = parseInt(document.getElementById('tag-priority').value);
            const color = document.getElementById('tag-color').value;

            if (newTagName && !isNaN(priority)) {
                tagDetails[tagId] = { name: newTagName, color: color, priority: priority };
                GM_setValue(`tag_${tagId}`, tagDetails[tagId]);

                const allTagButtons = document.querySelectorAll(`.tag-${tagId} .addTagButton`);
                allTagButtons.forEach(btn => {
                    updateButtonAppearance(btn, true);
                });

                const allTagContainers = document.querySelectorAll(`.tag-${tagId}`);
                allTagContainers.forEach(container => {
                    updateTagContainerAppearance(container, tagId, true);
                });

                refreshAllItems();
            }

            tagModal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });

        newCancelBtn.addEventListener('click', () => {
            tagModal.style.display = 'none';
            modalOverlay.style.display = 'none';
        });
    }

    function refreshAllItems() {
        processedItems.clear();
        const galleryItems = document.querySelectorAll('.gallery');
        galleryItems.forEach(item => {
            processItem(item);
        });

        setTimeout(sortTagsOnComicPage, 100);
    }

    function updateBlacklistIconsVisibility() {
        const blacklistButtons = document.querySelectorAll('.blacklistTagButton');
        blacklistButtons.forEach(button => {
            button.style.display = settings.showBlacklistIcon ? 'inline-block' : 'none';
        });
    }

    function observeTagChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('tag')) {
                                shouldUpdate = true;
                            }
                            const tags = node.querySelectorAll && node.querySelectorAll('.tag');
                            if (tags && tags.length > 0) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });

            if (shouldUpdate) {
                setTimeout(() => {
                    updateBlacklistLevels();
                }, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    observeTagChanges();

    function saveSettings() {
        const previousCustomBlacklistState = settings.enableCustomBlacklist;

        settings.highlightCutoffThreshold = parseInt(document.getElementById('setting-highlight-cutoff').value);
        settings.defaultPriority = parseInt(document.getElementById('setting-default-priority').value);
        settings.minTagsThreshold = parseInt(document.getElementById('setting-min-tags').value);
        settings.showGreenBorder = document.getElementById('setting-green-border').checked;
        settings.transparentBackground = document.getElementById('setting-transparent-bg').checked;
        const transparencySlider = document.getElementById('transparency-strength-slider');
        if (transparencySlider && transparencySlider.dataset.value) {
            settings.transparencyStrength = parseFloat(transparencySlider.dataset.value);
        } else {
            settings.transparencyStrength = settings.transparencyStrength || 0.5;
        }
        settings.tagPosition = document.getElementById('setting-tag-position').value;
        settings.sortTagsByPriority = document.getElementById('setting-sort-tags').checked;
        settings.markNoFavTagComics = document.getElementById('setting-mark-no-fav').checked;
        settings.removeTagBackground = document.getElementById('setting-remove-tag-bg').checked;
        settings.tagTextColor = document.getElementById('setting-tag-text-color').value;
        settings.useCustomTagTextColor = document.getElementById('setting-use-custom-tag-text-color').checked;
        settings.customTagBackgroundColor = document.getElementById('setting-custom-tag-background-color').value;
        settings.showFloatingButton = document.getElementById('setting-floating-button').checked;
        settings.shortcutModifier = document.getElementById('setting-shortcut-modifier').value;
        settings.hideFavoriteIcon = document.getElementById('setting-hide-favorite-icon').checked;
        settings.lockSettingsButton = document.getElementById('setting-lock-settings-button').checked;
        settings.buttonTransparency = parseInt(document.getElementById('button-transparency-slider').dataset.value || 0);
        settings.blacklistAction = document.getElementById('setting-blacklist-action').value;
        settings.allowTagCoexistence = document.getElementById('setting-allow-coexistence').checked;
        settings.infiniteScroll = document.getElementById('setting-infinite-scroll').checked;
        settings.removeNativeBlacklisted = document.getElementById('setting-remove-native-blacklisted').checked;
        settings.enableComicWhitelisting = document.getElementById('setting-comic-whitelisting').checked;
        settings.removeAnnoyances = document.getElementById('setting-remove-annoyances').checked;
        settings.dontTouchFavorites = document.getElementById('setting-dont-touch-favorites').checked;
        settings.betterBlacklist = document.getElementById('setting-better-blacklist').checked;
        settings.enableCustomBlacklist = document.getElementById('setting-custom-blacklist').checked;
        settings.warnOnBlacklistedComics = document.getElementById('setting-warn-blacklisted').checked;
        settings.removeNativeBlacklisted = document.getElementById('setting-remove-native-blacklisted').checked;
        settings.showBlacklistIcon = document.getElementById('setting-show-blacklist-icon').checked;
        settings.showMissingTags = document.getElementById('setting-show-missing-tags').checked;

        setTimeout(() => {
            updateBlacklistIconsVisibility();
            processedTags.clear();
            addTagButtons();
        }, 100);

        if (settings.enableCustomBlacklist) {
            settings.betterBlacklist = false;
            settings.warnOnBlacklistedComics = false;
            settings.removeNativeBlacklisted = false;
        }

        const forceLanguageSelect = document.getElementById('setting-force-language');
        if (forceLanguageSelect) {
            settings.forceLanguage = forceLanguageSelect.value;
        }

        const coexistenceModeSelect = document.getElementById('setting-coexistence-mode');
        if (coexistenceModeSelect) {
            settings.coexistenceMode = coexistenceModeSelect.value;
        }

        const shortcutKeyValue = document.getElementById('setting-shortcut-key').value.toUpperCase();
        settings.shortcutKey = shortcutKeyValue ? `Key${shortcutKeyValue}` : '';

        Object.keys(settings).forEach(key => {
            GM_setValue(`setting_${key}`, settings[key]);
        });
        removeAnnoyances();
        updateDynamicStyles();
        updateBlacklistLevels();

        const existingBtn = document.getElementById('floating-settings-btn');
        if (existingBtn) existingBtn.remove();
        createFloatingButton();

        refreshAllItems();
        closeSettings();

        if (!previousCustomBlacklistState && settings.enableCustomBlacklist) {
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    }

    function resetSettings() {
        if (confirm('Reset All settings to Defaults ❗Note: This Dose Not Remove Added Tags')) {

            Object.keys(DEFAULT_SETTINGS).forEach(key => {
                GM_deleteValue(`setting_${key}`);
                settings[key] = DEFAULT_SETTINGS[key];
            });


            document.getElementById('setting-highlight-cutoff').value = settings.highlightCutoffThreshold;
            document.getElementById('setting-default-priority').value = settings.defaultPriority;
            document.getElementById('setting-min-tags').value = settings.minTagsThreshold;
            document.getElementById('setting-force-language').value = settings.forceLanguage;
            document.getElementById('setting-infinite-scroll').checked = settings.infiniteScroll;


            document.getElementById('setting-tag-position').value = settings.tagPosition;
            document.getElementById('setting-sort-tags').checked = settings.sortTagsByPriority;
            document.getElementById('setting-green-border').checked = settings.showGreenBorder;
            document.getElementById('setting-mark-no-fav').checked = settings.markNoFavTagComics;
            document.getElementById('setting-remove-tag-bg').checked = settings.removeTagBackground;
            document.getElementById('setting-hide-favorite-icon').checked = settings.hideFavoriteIcon;
            document.getElementById('setting-transparent-bg').checked = settings.transparentBackground;
            document.getElementById('setting-use-custom-tag-text-color').checked = settings.useCustomTagTextColor;
            document.getElementById('setting-tag-text-color').value = settings.tagTextColor;
            document.getElementById('setting-custom-tag-background-color').value = settings.customTagBackgroundColor;
            document.getElementById('setting-show-missing-tags').checked = settings.showMissingTags;


            const transparencySlider = document.getElementById('transparency-strength-slider');
            const transparencyDisplay = document.getElementById('transparency-strength-display');
            if (transparencySlider && transparencyDisplay) {
                transparencySlider.dataset.value = settings.transparencyStrength;
                transparencyDisplay.textContent = Math.round(settings.transparencyStrength * 100) + '%';

                const sliderElement = transparencySlider.querySelector('.custom-slider');
                if (sliderElement) {
                    const percentage = (settings.transparencyStrength * 100);
                    const bar = sliderElement.querySelector('.custom-slider-bar');
                    const handle = sliderElement.querySelector('.custom-slider-handle');
                    if (bar) bar.style.width = percentage + '%';
                    if (handle) handle.style.left = percentage + '%';
                }
            }


            document.getElementById('setting-shortcut-modifier').value = settings.shortcutModifier;
            document.getElementById('setting-shortcut-key').value = settings.shortcutKey.replace('Key', '');
            document.getElementById('setting-floating-button').checked = settings.showFloatingButton;
            document.getElementById('setting-lock-settings-button').checked = settings.lockSettingsButton;


            const buttonTransparencySlider = document.getElementById('button-transparency-slider');
            const buttonTransparencyDisplay = document.getElementById('button-transparency-display');
            if (buttonTransparencySlider && buttonTransparencyDisplay) {
                buttonTransparencySlider.dataset.value = settings.buttonTransparency;
                buttonTransparencyDisplay.textContent = settings.buttonTransparency + '%';

                const sliderElement = buttonTransparencySlider.querySelector('.custom-slider');
                if (sliderElement) {
                    const percentage = settings.buttonTransparency;
                    const bar = sliderElement.querySelector('.custom-slider-bar');
                    const handle = sliderElement.querySelector('.custom-slider-handle');
                    if (bar) bar.style.width = percentage + '%';
                    if (handle) handle.style.left = percentage + '%';
                }
            }


            document.getElementById('setting-remove-native-blacklisted').checked = settings.removeNativeBlacklisted;
            document.getElementById('setting-warn-blacklisted').checked = settings.warnOnBlacklistedComics;
            document.getElementById('setting-better-blacklist').checked = settings.betterBlacklist;
            document.getElementById('setting-custom-blacklist').checked = settings.enableCustomBlacklist;
            document.getElementById('setting-comic-whitelisting').checked = settings.enableComicWhitelisting;
            document.getElementById('setting-show-blacklist-icon').checked = settings.showBlacklistIcon;
            document.getElementById('setting-blacklist-action').value = settings.blacklistAction;
            document.getElementById('setting-allow-coexistence').checked = settings.allowTagCoexistence;
            document.getElementById('setting-coexistence-mode').value = settings.coexistenceMode;

            setupTagTextColorToggle();
            setupCustomBlacklistToggle();
            setupBetterBlacklistToggle();

            updateDynamicStyles();

            const existingBtn = document.getElementById('floating-settings-btn');
            if (existingBtn) existingBtn.remove();
            createFloatingButton();

            refreshAllItems();

        }
    }

    function closeSettings() {
        const settingsModal = document.getElementById('settings-modal');
        const editTagModal = document.getElementById('edit-tag-modal');
        const tagModal = document.getElementById('tag-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const tooltip = document.getElementById('settings-tooltip');

        if (settingsModal) settingsModal.style.display = 'none';
        if (editTagModal) editTagModal.style.display = 'none';
        if (tagModal) tagModal.style.display = 'none';
        if (modalOverlay) modalOverlay.style.display = 'none';
        if (tooltip) tooltip.style.display = 'none';
    }

    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('reset-settings').addEventListener('click', resetSettings);
    document.getElementById('close-settings').addEventListener('click', closeSettings);

    document.addEventListener('click', (e) => {
        const modalOverlay = document.getElementById('modal-overlay');
        if (e.target === modalOverlay) {
            closeSettings();
        }
    });

    let observerTimeout;
    function observeNewNodes(mutations) {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            const newItems = new Set();
            const newTags = new Set();

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('gallery')) {
                            newItems.add(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('.gallery').forEach(item => {
                                newItems.add(item);
                            });
                        }

                        if (node.classList && node.classList.contains('tag')) {
                            newTags.add(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('.tag').forEach(tag => {
                                newTags.add(tag);
                            });
                        }
                    }
                });
            });

            newItems.forEach(item => {
                const img = item.querySelector('img[data-src]');
                if (img && img.getAttribute('data-src')) {
                    img.setAttribute('src', img.getAttribute('data-src'));
                }
                processItem(item);
            });

            if (newTags.size > 0) {
                addTagButtons();
            }
        }, 100);
    }


    function initializeDuplicateDetection() {
        if (currentPagePath === "/" || currentPagePath === "/") {
            collectPopularCaptions();
            removeDuplicatesFromNewUploads();
        }
    }

    function collectPopularCaptions() {
        popularCaptions.clear();

        const popularContainer = document.querySelector(".container.index-container.index-popular");
        if (popularContainer) {
            popularContainer.querySelectorAll(".gallery .caption").forEach(function(caption) {
                const captionText = caption.textContent.trim();
                if (captionText) {
                    popularCaptions.add(captionText);
                }
            });
        }
    }

    function removeDuplicatesFromNewUploads() {
        if (popularCaptions.size === 0) return;

        const newUploadsContainer = document.querySelector(".container.index-container:not(.index-popular)");
        if (newUploadsContainer) {
            const galleries = newUploadsContainer.querySelectorAll(".gallery");
            let removedCount = 0;

            galleries.forEach(function(gallery) {
                const caption = gallery.querySelector(".caption");
                const captionText = caption ? caption.textContent.trim() : '';
                if (captionText && popularCaptions.has(captionText)) {
                    gallery.remove();
                    checkedCaptions.add(captionText);
                    removedCount++;
                }
            });

            if (removedCount > 0) {
                saveCheckedCaptionsToStorage();
            }
        }
    }

    function checkNewComicsForDuplicates(newComics) {
        if (popularCaptions.size === 0 || allComicsChecked()) {
            return newComics;
        }

        const filteredComics = [];

        newComics.forEach(function(comic) {
            const caption = comic.querySelector(".caption");
            const captionText = caption ? caption.textContent.trim() : '';

            if (captionText && popularCaptions.has(captionText)) {
                checkedCaptions.add(captionText);
            } else {
                filteredComics.push(comic);
            }
        });

        return filteredComics;
    }

    function allComicsChecked() {
        const allChecked = checkedCaptions.size >= popularCaptions.size && popularCaptions.size > 0;
        if (allChecked) {
        }
        return allChecked;
    }
    function saveCheckedCaptionsToStorage() {
        try {
            const checkedArray = Array.from(checkedCaptions);
            GM_setValue('checked_captions', JSON.stringify(checkedArray));
        } catch (e) {
            console.error("Error saving checked captions:", e);
        }
    }

    function loadCheckedCaptionsFromStorage() {
        try {
            const savedCheckedCaptions = GM_getValue('checked_captions', '[]');
            const parsed = JSON.parse(savedCheckedCaptions);
            checkedCaptions.clear();
            parsed.forEach(caption => {
                checkedCaptions.add(caption);
            });
        } catch (e) {
            console.error("Error loading checked captions:", e);
            checkedCaptions.clear();
        }
    }

    function clearCheckedCaptionsStorage() {
        checkedCaptions.clear();
        GM_deleteValue('checked_captions');
    }

    function handleBlacklistedRemoval() {
        if (!settings.removeNativeBlacklisted) return;

        const blacklistObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('gallery') && node.classList.contains('blacklisted')) {
                            if (settings.dontTouchFavorites &&
                                (window.location.pathname.startsWith('/favorites') ||
                                 document.getElementById('recent-favorites-container')?.contains(node))) {
                                node.classList.remove('blacklisted');
                                node.style.filter = '';
                                node.style.opacity = '';
                                node.style.display = '';
                                return;
                            }
                            node.remove();
                        }
                        if (node.querySelectorAll) {
                            const blacklistedGalleries = node.querySelectorAll('.gallery.blacklisted');
                            blacklistedGalleries.forEach(gallery => {
                                if (settings.dontTouchFavorites &&
                                    (window.location.pathname.startsWith('/favorites') ||
                                     document.getElementById('recent-favorites-container')?.contains(gallery))) {
                                    gallery.classList.remove('blacklisted');
                                    gallery.style.filter = '';
                                    gallery.style.opacity = '';
                                    gallery.style.display = '';
                                    return;
                                }
                                gallery.remove();
                            });
                        }
                    }
                });

                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList && target.classList.contains('gallery') && target.classList.contains('blacklisted')) {
                        if (settings.dontTouchFavorites &&
                            (window.location.pathname.startsWith('/favorites') ||
                             document.getElementById('recent-favorites-container')?.contains(target))) {
                            target.classList.remove('blacklisted');
                            target.style.filter = '';
                            target.style.opacity = '';
                            target.style.display = '';
                            return;
                        }
                        target.remove();
                    }
                }
            });
        });

        blacklistObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });



        const removeBlacklisted = () => {
            if (!settings.removeNativeBlacklisted) return;

            if (settings.dontTouchFavorites &&
                (window.location.pathname.startsWith('/favorites') ||
                 document.getElementById('recent-favorites-container'))) {
                cleanupFavoritesPageBlacklist();
                return;
            }

            const blacklistedGalleries = document.querySelectorAll(".gallery.blacklisted");
            blacklistedGalleries.forEach(gallery => {
                if (settings.dontTouchFavorites &&
                    document.getElementById('recent-favorites-container')?.contains(gallery)) {
                    gallery.classList.remove('blacklisted');
                    gallery.style.filter = '';
                    gallery.style.opacity = '';
                    gallery.style.display = '';
                    return;
                }

                const dataTags = gallery.getAttribute('data-tags');
                if (dataTags) {
                    const tags = dataTags.split(' ').map(Number).filter(tag => !isNaN(tag) && tag > 0);

                    const siteBlacklisted = extractedSiteBlacklist.some(blacklistedTag => tags.includes(blacklistedTag));
                    const customBlacklisted = Object.keys(customBlacklistedTags).some(blacklistedTag => tags.includes(parseInt(blacklistedTag)));

                    if (siteBlacklisted || customBlacklisted || gallery.classList.contains('blacklisted')) {
                        gallery.remove();
                    }
                } else if (gallery.classList.contains('blacklisted')) {
                    gallery.remove();
                }
            });
        };

        if (settings.removeNativeBlacklisted) {
            removeBlacklisted();
            setInterval(removeBlacklisted, 2000);
        }
    }

    function infiniteLoadHandling() {
        if (!settings.infiniteScroll) return;

        const paginator = document.querySelector(".pagination");
        if (!paginator || currentPagePath === "/favorites/") {
            return;
        }

        const lastPageLink = paginator.querySelector(".last");
        if (!lastPageLink) {
            return;
        }

        const lastPageNum = parseInt(lastPageLink.getAttribute("href").split("page=")[1]);
        if (!lastPageNum || lastPageNum <= 1) {
            return;
        }

        const queryWithNoPage = window.location.search.replace(/[\?\&]page=\d+/, "").replace(/^\&/, "?");
        const finalUrlWithoutPageNum = `${window.location.pathname + queryWithNoPage + (queryWithNoPage.length ? "&" : "?")}page=`;

        window.addEventListener('scroll', () => {
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 15) {
                const currentPageLinks = document.querySelectorAll(".pagination > .page.current");
                if (currentPageLinks.length === 0) return;

                const lastCurrentPage = currentPageLinks[currentPageLinks.length - 1];
                const loadingPageNum = parseInt(lastCurrentPage.getAttribute("href").split("page=")[1]) + 1;

                tryLoadInNextPageComics(loadingPageNum, lastPageNum, finalUrlWithoutPageNum);
            }
        });

        const autoLoadInterval = setInterval(() => {
            const currentPageLinks = document.querySelectorAll(".pagination > .page.current");
            if (currentPageLinks.length === 0) {
                clearInterval(autoLoadInterval);
                return;
            }

            const lastCurrentPage = currentPageLinks[currentPageLinks.length - 1];
            const loadingPageNum = parseInt(lastCurrentPage.getAttribute("href").split("page=")[1]) + 1;

            if (loadingPageNum > lastPageNum) {
                clearInterval(autoLoadInterval);
                return;
            }

            const doc = document.documentElement;
            if (doc.scrollHeight <= doc.clientHeight) {
                tryLoadInNextPageComics(loadingPageNum, lastPageNum, finalUrlWithoutPageNum);
            }
        }, 200);
    }

    function tryLoadInNextPageComics(pageNumToLoad, lastPageNum, fetchUrlWithoutPageNum, retryNum = 0, maxFetchAttempts = 5) {
        if (retryNum === 0 && infiniteLoadIsLoadingNextPage) {
            return;
        }

        if (pageNumToLoad > lastPageNum) {
            return;
        }

        infiniteLoadIsLoadingNextPage = true;

        const containerSelector = ".index-container:not(.advertisement, .index-popular)";
        const container = document.querySelector(containerSelector);
        if (container) {
            container.insertAdjacentHTML('beforeend', '<div id="NHI_loader_icon" class="gallery"><div><span class="loader"></span></div></div>');
        }

        fetch(fetchUrlWithoutPageNum + pageNumToLoad)
            .then(response => response.text())
            .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            let comicsToAdd = Array.from(tempDiv.querySelectorAll("div.gallery")).filter(comic =>
                                                                                         !comic.classList.contains("blacklisted") && comic.id !== "NHI_loader_icon"
                                                                                        );

            if (settings.infiniteScroll && !allComicsChecked()) {
                const originalCount = comicsToAdd.length;
                comicsToAdd = checkNewComicsForDuplicates(comicsToAdd);
                const filteredCount = comicsToAdd.length;

                if (originalCount !== filteredCount) {
                    saveCheckedCaptionsToStorage();
                }
            }

            comicsToAdd.forEach(comic => {
                if (settings.removeNativeBlacklisted) {
                    if (comic.classList.contains("blacklisted")) {
                        return;
                    }

                    const tags = comic.getAttribute("data-tags");
                    if (tags) {
                        const tagArray = tags.trim().split(" ");
                        if (getCurrentBlacklistedTags().some(blacklistedTag => tagArray.includes(String(blacklistedTag)))) {
                            return;
                        }
                    }
                }

                const comicHref = comic.querySelector(".cover")?.getAttribute("href");
                if (comicHref && document.querySelector(`.container:not(.index-popular) .cover[href='${comicHref}']`)) {
                    return;
                }

                const img = comic.querySelector("img");
                if (img && img.getAttribute("data-src")) {
                    img.setAttribute("src", img.getAttribute("data-src"));
                }

                if (container) {
                    container.appendChild(comic);
                }
            });

            const paginatorItem = document.querySelector(`.pagination > .page[href$='page=${pageNumToLoad}']`);
            if (paginatorItem) {
                paginatorItem.classList.add("current");
            } else {
                const nextButton = document.querySelector(".pagination > .next");
                if (nextButton) {
                    nextButton.insertAdjacentHTML('beforebegin', `<a href="${fetchUrlWithoutPageNum}${pageNumToLoad}" class="page current">${pageNumToLoad}</a>`);
                }
            }

            const loader = document.getElementById("NHI_loader_icon");
            if (loader) loader.remove();
            infiniteLoadIsLoadingNextPage = false;

            refreshAllItems();
        })
            .catch(error => {
            const loader = document.getElementById("NHI_loader_icon");
            if (loader) loader.remove();

            if (retryNum < maxFetchAttempts) {
                setTimeout(() => {
                    tryLoadInNextPageComics(pageNumToLoad, lastPageNum, fetchUrlWithoutPageNum, retryNum + 1, maxFetchAttempts);
                }, 1000);
            } else {
                infiniteLoadIsLoadingNextPage = false;
            }
        });
    }

    function init() {
        if (!document.getElementById('settings-modal')) {
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer);
        }
        updateDynamicStyles();
        clearCheckedCaptionsStorage();
        createFloatingButton();
        observeBlacklistChanges();
        let initAttempts = 0;
        const maxAttempts = 10;

        async function attemptInit() {
            try {
                storeComicDataSafely();
                removeBlacklistedTagsFromDOM();
                removeAnnoyances();
                await addMissingTagsToPage();
                cleanupFavoritesPageBlacklist();
                if (document.querySelector(".container.index-container, #favcontainer.container, #recent-favorites-container, #related-container")) {
                    handleBlacklistedRemoval();
                    initializeDuplicateDetection();
                    infiniteLoadHandling();
                }

                addTagButtons();
                const observer = new MutationObserver(observeNewNodes);
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: false,
                    characterData: false
                });

                const galleryItems = document.querySelectorAll('.gallery');
                galleryItems.forEach(item => {
                    processItem(item);
                });
                setTimeout(sortTagsOnComicPage, 500);
                setTimeout(checkPageBlacklist, 1000);
                setTimeout(updateBlacklistLevels, 1200);
            } catch (error) {
                initAttempts++;
                if (initAttempts < maxAttempts) {
                    setTimeout(attemptInit, 1000 * initAttempts);
                }
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attemptInit);
        } else {
            attemptInit();
        }
        setTimeout(() => {
            cleanupOldComicData();
        }, 5000);
        window.addEventListener('load', () => {
            setTimeout(() => {
                addTagButtons();
                refreshAllItems();
                sortTagsOnComicPage();
                updateBlacklistLevels();
            }, 1000);
        });

        setInterval(async () => {
            const unprocessedItems = Array.from(document.querySelectorAll('.gallery')).filter(item => {
                const galleryId = getGalleryId(item);
                const itemId = galleryId || item.getAttribute('data-tags') || item.innerHTML.slice(0, 100);
                return !processedItems.has(itemId);
            });

            if (unprocessedItems.length > 0) {
                for (const item of unprocessedItems) {
                    await processItem(item);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            const incompleteItems = Array.from(document.querySelectorAll('.gallery')).filter(item => {
                const dataTags = item.getAttribute('data-tags');
                if (!dataTags) return false;
                const tagCount = dataTags.split(' ').filter(tag => tag.trim() && !isNaN(parseInt(tag))).length;
                return tagCount < settings.minTagsThreshold && tagCount > 0 && !item.classList.contains('tag-loading');
            });
            if (incompleteItems.length > 0) {
                const batch = incompleteItems.slice(0, 3);
                for (const item of batch) {
                    const itemId = getGalleryId(item) ||
                          item.getAttribute('data-tags') || item.innerHTML.slice(0, 100);
                    processedItems.delete(itemId);
                    await processItem(item);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            const unprocessedTags = document.querySelectorAll('.tag:not(.processed-tag)');
            if (unprocessedTags.length > 0) {
                addTagButtons();
                unprocessedTags.forEach(tag => {
                    tag.classList.add('processed-tag');
                });
            }
            sortTagsOnComicPage();
            cleanupFavoritesPageBlacklist();
        }, 10000);

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const visibleItems = Array.from(document.querySelectorAll('.gallery')).filter(item => {
                    const rect = item.getBoundingClientRect();
                    return rect.top < window.innerHeight &&
                        rect.bottom > 0;
                });

                visibleItems.forEach(item => {
                    const galleryId = getGalleryId(item);
                    const itemId = galleryId || item.getAttribute('data-tags') || item.innerHTML.slice(0, 100);
                    if (!processedItems.has(itemId)) {
                        processItem(item);
                    }
                });
            }, 300);
        });
    }

    init();
})();