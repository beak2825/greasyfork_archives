// ==UserScript==
// @name        Bluesky Image/Video Download Button
// @namespace   KanashiiWolf
// @match       https://bsky.app/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_info
// @grant       GM_addStyle
// @version     2.2.0
// @author      KanashiiWolf, the-nelsonator, coredumperror
// @description Adds a download button to Bluesky images and videos.
// @license     MIT
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/513021/Bluesky%20ImageVideo%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/513021/Bluesky%20ImageVideo%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================================
    // 1. CONFIGURATION
    // ========================================================================

    const CONFIG = {
        // Template for naming downloaded files
        defaultTemplate: '@<%username>-bsky-<%post_id>-<%img_num>',

        // Regex to extract the post ID from a standard Bluesky URL
        postUrlRegex: /\/profile\/[^\/]+\/post\/[A-Za-z0-9]+/, // Corrected regex escaping

        // DOM Selectors used to find specific elements on the page
        selectors: {
            images: 'img[src^="https://cdn.bsky.app/img/feed_thumbnail"]', // Target feed images
            videos: 'video[poster^="https://video.bsky.app/watch"]',       // Target feed videos
            settings: '[href="/settings/account"]',                         // Target settings menu for injection
            bookmark: '[data-testid="postBookmarkBtn"]',                     // Target bookmark button to place "Download All" next to
            
            // Containers that hold a post link (Feed, Thread, Search results)
            postItem: '[data-testid^="feedItem-by-"], [data-testid^="postThreadItem-by-"], div[role="link"]', 
            
            // Container for quoted posts (requires specific handling)
            quotePost: '[aria-label^="Post by"]'
        },
        // SVG paths for UI icons
        iconPath: 'M925.248 356.928l-258.176-258.176a64 64 0 0 0-45.248-18.752H144a64 64 0 0 0-64 64v736a64 64 0 0 0 64 64h736a64 64 0 0 0 64-64V402.176a64 64 0 0 0-18.752-45.248zM288 144h192V256H288V144z m448 736H288V736h448v144z m144 0H800V704a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v176H144v-736H224V288a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V144h77.824l258.176 258.176V880z',
        checkPath: 'M433 817L133 517l90-90 210 210L821 249l90 90z' // Simple checkmark for success state
    };

    const WHATS_NEW = [
        'Added the ability to look at and manage download history.',
        'Added the ability to export download history.',
        'Added the ability to save all media within the post as a ZIP.',
        'Rebuilt the settings to be a modal that can also be called from a menu item on your userscript manager.'
    ];

    // ========================================================================
    // 2. STATE & STYLES
    // ========================================================================

    // Retrieve user preferences and history from Tampermonkey storage
    let filenameTemplate = GM_getValue('filename', CONFIG.defaultTemplate);
    let downloadHistory = GM_getValue('dl_history', {});

    // Inject Custom CSS for the buttons and settings UI
    const css = `
        /* Single Image Button - Top Left overlay */
        .bsky-dl-btn {
            cursor: pointer; z-index: 999; display: flex; align-items: center; justify-content: center;
            position: absolute; left: 5px; top: 5px;
            background: rgba(0, 0, 0, 0.5); color: white;
            height: 30px; width: 30px; border-radius: 50%;
            transition: background 0.2s, color 0.2s;
        }
        .bsky-dl-btn:hover { background: rgba(0, 0, 0, 0.8); }
        .bsky-dl-btn svg { width: 16px; height: 16px; fill: currentColor; }
        
        /* Download All Button - Placed in the post footer actions */
        .bsky-dl-all-btn {
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; padding: 5px; border-radius: 999px;
            transition: background 0.2s, color 0.2s;
            color: rgb(111, 131, 159); /* Matches native Bluesky action icon color */
            margin-right: -4px; 
        }
        .bsky-dl-all-btn:hover { background-color: rgba(0, 0, 0, 0.05); }
        .bsky-dl-all-btn svg { width: 18px; height: 18px; fill: currentColor; }

        /* Success State (Green Checkmark) */
        .bsky-dl-btn.downloaded, .bsky-dl-all-btn.downloaded { color: #4caf50; }
        .bsky-dl-btn.downloaded { background: rgba(0, 0, 0, 0.7); }
        .bsky-dl-btn.downloaded svg, .bsky-dl-all-btn.downloaded svg { width: 20px; height: 20px; }

        /* Settings UI - Config button */
        .bsky-dl-settings-btn {
            display: flex; align-items: center; justify-content: center;
            margin-top: 10px; border: 2px solid; cursor: pointer; padding: 5px; font-weight: bold;
            transition: all 0.2s;
            border-radius: 4px;
        }
        .bsky-dl-settings-btn:hover { opacity: 0.8; }

        /* MODAL STYLES */
        .bsky-dl-overlay {
            position: fixed; left: 0; top: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5); z-index: 2147483647;
            backdrop-filter: blur(4px);
            display: flex; justify-content: center; align-items: center;
        }
        .bsky-dl-modal {
            background: #fff; color: #000;
            border-radius: 8px; padding: 24px;
            width: 400px; max-width: 90vw;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex; flex-direction: column;
            transition: width 0.3s, max-width 0.3s;
        }
        @media (prefers-color-scheme: dark) {
            .bsky-dl-modal { background: #161e27; color: #fff; }
        }
        .bsky-dl-modal.expanded { width: 900px; max-width: 95vw; }
        
        .bsky-dl-modal h3 {
            margin: 0 0 20px 0; text-align: center;
            font-size: 20px; font-weight: 700;
        }

        /* Settings Form Elements */
        .bsky-dl-option-group {
            border: 1px solid rgba(128,128,128,0.2);
            border-radius: 4px;
            padding: 12px; margin-bottom: 12px;
            background: rgba(128,128,128,0.05);
        }
        .bsky-dl-label {
            display: block; margin-bottom: 8px; 
            font-size: 14px; font-weight: 600; 
            color: inherit;
        }
        
        .bsky-dl-textarea {
            width: 100%; min-height: 80px;
            background: rgba(255,255,255,0.1); color: inherit;
            border: 1px solid rgba(128,128,128,0.3);
            border-radius: 4px; padding: 8px;
            font-family: monospace; font-size: 12px;
            margin-top: 8px; box-sizing: border-box;
        }
        .bsky-dl-textarea:focus { outline: none; border-color: #208bfe; box-shadow: 0 0 0 2px rgba(32, 139, 254, 0.2); }
        
        .bsky-dl-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
        .bsky-dl-tag {
            background-color: transparent;
            color: #208bfe;
            border: 1px solid #208bfe;
            padding: 4px 8px; border-radius: 4px;
            font-size: 11px; font-weight: 700; cursor: pointer;
            transition: 0.2s; font-family: monospace;
        }
        .bsky-dl-tag:hover { background-color: #208bfe; color: white; }

        .bsky-dl-btn-primary {
            background: #208bfe; color: white;
            border: none; border-radius: 4px;
            padding: 12px 24px; font-size: 15px; font-weight: 700;
            cursor: pointer; transition: 0.2s;
            width: 100%; text-align: center;
            margin-top: 10px;
        }
        .bsky-dl-btn-primary:hover { opacity: 0.9; }

        /* History Layout */
        .bsky-dl-layout { display: flex; gap: 0; height: 400px; transition: gap 0.3s; }
        .bsky-dl-modal.expanded .bsky-dl-layout { gap: 16px; }

        .bsky-dl-list {
            flex: 1; overflow-y: auto;
            border: 1px solid rgba(128,128,128,0.2);
            border-radius: 4px; padding: 4px;
        }
        
        .bsky-dl-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px; border-bottom: 1px solid rgba(128,128,128,0.1);
            transition: background 0.2s;
        }
        .bsky-dl-row.active { background: rgba(32, 139, 254, 0.1); border-left: 3px solid #208bfe; }
        .bsky-dl-row:last-child { border-bottom: none; }
        
        .bsky-dl-link {
            color: inherit; text-decoration: none; font-size: 13px;
            font-family: monospace; cursor: pointer;
        }
        .bsky-dl-link:hover { text-decoration: underline; color: #0085ff; }

        .bsky-dl-btn-sm {
            background: transparent; color: #e11d48;
            border: 1px solid #e11d48; border-radius: 4px;
            font-size: 10px; padding: 2px 6px; cursor: pointer;
        }
        .bsky-dl-btn-sm:hover { background: #e11d48; color: white; }

        /* Preview Pane */
        .bsky-dl-preview {
            flex: 0; width: 0; overflow: hidden;
            border: 0; opacity: 0; transition: all 0.3s;
            display: flex; justify-content: center; align-items: center;
            background: rgba(128,128,128,0.05); border-radius: 4px;
            position: relative;
        }
        .bsky-dl-modal.expanded .bsky-dl-preview {
            flex: 1.5; width: auto; opacity: 1;
            border: 1px solid rgba(128,128,128,0.2);
            padding: 10px;
        }
        .bsky-dl-close-preview {
            position: absolute; top: 5px; right: 10px;
            font-size: 24px; cursor: pointer; opacity: 0.6; z-index: 10;
        }
        .bsky-dl-close-preview:hover { opacity: 1; color: #e11d48; }
        
        /* Preview Card */
        .bsky-card { width: 100%; height: 100%; overflow-y: auto; }
        .bsky-card-header { display: flex; align-items: center; margin-bottom: 10px; }
        .bsky-card-avatar { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; object-fit: cover; }
        .bsky-card-user { display: flex; flex-direction: column; }
        .bsky-card-name { font-weight: bold; font-size: 15px; }
        .bsky-card-handle { font-size: 13px; opacity: 0.7; }
        .bsky-card-text { font-size: 15px; margin-bottom: 10px; white-space: pre-wrap; line-height: 1.4; }
        
        .bsky-card-media { 
            display: grid; gap: 4px; margin-bottom: 10px; border-radius: 8px; overflow: hidden; 
            width: 100%;
        }
        .bsky-media-1 { grid-template-columns: 1fr; }
        .bsky-media-2 { grid-template-columns: 1fr 1fr; }
        .bsky-media-3 { grid-template-columns: 1fr 1fr; }
        .bsky-media-4 { grid-template-columns: 1fr 1fr; }

        .bsky-card-img {
            width: 100%; height: auto; max-height: 300px; 
            object-fit: contain; background: #000;
            display: block; margin: 0 auto;
        }
        .bsky-card-date { font-size: 12px; opacity: 0.6; }

        .bsky-dl-modal-footer { margin-top: 15px; text-align: right; }
        .bsky-dl-modal-close {
            background: transparent; color: inherit; border: 1px solid currentColor; padding: 8px 16px;
            border-radius: 4px; cursor: pointer; font-weight: bold; opacity: 0.7;
        }
        .bsky-dl-modal-close:hover { opacity: 1; }

        /* What's New Modal */
        .bsky-wn-modal {
            position: fixed; top: 20px; right: 20px; width: 300px;
            background: #fff; color: #000;
            border-radius: 8px; padding: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            z-index: 2147483647; border: 1px solid rgba(128,128,128,0.2);
            animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (prefers-color-scheme: dark) {
            .bsky-wn-modal { background: #161e27; color: #fff; border-color: #2e4052; }
        }
        @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
        
        .bsky-wn-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .bsky-wn-title { font-weight: 700; font-size: 16px; display: flex; align-items: center; gap: 6px; }
        .bsky-wn-tag { background: #208bfe; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
        
        .bsky-wn-close { cursor: pointer; font-size: 20px; opacity: 0.5; line-height: 1; }
        .bsky-wn-close:hover { opacity: 1; }
        
        .bsky-wn-list { list-style: none; padding: 0; margin: 0; font-size: 13px; line-height: 1.5; opacity: 0.9; }
        .bsky-wn-list li { margin-bottom: 8px; display: flex; gap: 8px; }
        .bsky-wn-list li:before { content: "•"; color: #208bfe; font-weight: bold; }
    `;

    // Add styles to the document
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    // Register Menu Commands
    GM_registerMenuCommand('Settings', openSettings);
    GM_registerMenuCommand('View History', viewHistory);
    GM_registerMenuCommand('Export History (JSON)', exportHistory);

    // ========================================================================
    // 3. OBSERVER LOGIC
    // ========================================================================

    // Helper to process a single media item (image or video)
    const processMediaItem = (item, isVideo) => {
        if (item && !item.hasAttribute('processed')) {
            item.setAttribute('processed', '');
            injectDownloadButton(item, isVideo);

            // Try to inject "Download All" if we found media but missed the bookmark button
            const post = item.closest(CONFIG.selectors.postItem);
            if (post) {
                const bookmark = post.querySelector(CONFIG.selectors.bookmark);
                if (bookmark) injectDownloadAllButton(bookmark);
            }
        }
    };

    // Scan a specific node (and its children) for actionable elements
    const scanNode = (node) => {
        // A. SETTINGS: Check if the Settings header was loaded to inject our config UI
        const settingsHeader = node.querySelector(CONFIG.selectors.settings);
        if (settingsHeader && !document.getElementById('bsky-dl-settings-btn')) {
            injectSettingsUI(settingsHeader);
        }

        // B. DOWNLOAD ALL: Check for Bookmark buttons to inject "Download All" next to them
        if (node.matches(CONFIG.selectors.bookmark)) {
            injectDownloadAllButton(node);
        } else {
            node.querySelectorAll(CONFIG.selectors.bookmark).forEach(btn => injectDownloadAllButton(btn));
        }

        // C. IMAGES
        node.querySelectorAll(CONFIG.selectors.images).forEach(img => processMediaItem(img, false));

        // D. VIDEOS
        node.querySelectorAll(CONFIG.selectors.videos).forEach(vid => processMediaItem(vid, true));

        // E. EXPANDED QUOTES: Special handling for expanded posts
        // Expanded views often have a specific DOM structure: Parent -> [FeedDOM, ExpandedDOM]
        // We target the second child (ExpandedDOM) specifically to find content within it.
        if (node.children && node.children.length === 2 && node.children[1].tagName === 'DIV') {
            const expandedDom = node.children[1];
            expandedDom.querySelectorAll(CONFIG.selectors.images).forEach(img => processMediaItem(img, false));
            expandedDom.querySelectorAll(CONFIG.selectors.videos).forEach(vid => processMediaItem(vid, true));
        }
    };

    // Main observer callback to handle dynamic content loading (infinite scroll)
    const handleMutations = (mutationList) => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement) {
                    scanNode(node);
                }
            }
        }
    };

    // Initialize the observer on the entire document body
    const observer = new MutationObserver(handleMutations);
    observer.observe(document, { childList: true, subtree: true });

    // ========================================================================
    // 4. UI INJECTION & EVENT HANDLING
    // ========================================================================

    // Settings Modal
    function openSettings() {
        const overlay = createElement('div', { class: 'bsky-dl-overlay' });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        const modal = createElement('div', { class: 'bsky-dl-modal' });
        const title = createElement('h3', {}, {}, 'Download Settings');
        
        // Option Group: History
        const historyGroup = createElement('div', { class: 'bsky-dl-option-group' });
        const historyLabel = createElement('label', { class: 'bsky-dl-label' }, { display: 'flex', alignItems: 'center', cursor: 'pointer' });
        const historyInput = createElement('input', { type: 'checkbox' }, { marginRight: '8px' });
        historyInput.checked = GM_getValue('save_history', true);
        historyInput.onchange = () => GM_setValue('save_history', historyInput.checked);
        
        historyLabel.appendChild(historyInput);
        historyLabel.appendChild(document.createTextNode('Remember download history'));
        historyGroup.appendChild(historyLabel);

        // Option Group: Packaging
        const packagingGroup = createElement('div', { class: 'bsky-dl-option-group' });
        const packagingLabel = createElement('label', { class: 'bsky-dl-label' }, { display: 'flex', alignItems: 'center', cursor: 'pointer' });
        const packagingInput = createElement('input', { type: 'checkbox' }, { marginRight: '8px' });
        packagingInput.checked = GM_getValue('enable_packaging', false);
        packagingInput.onchange = () => GM_setValue('enable_packaging', packagingInput.checked);
        
        packagingLabel.appendChild(packagingInput);
        packagingLabel.appendChild(document.createTextNode('Package multiple files into a ZIP'));
        packagingGroup.appendChild(packagingLabel);

        // Option Group: Filename
        const fileGroup = createElement('div', { class: 'bsky-dl-option-group' });
        
        // Preview Box
        const previewContainer = createElement('div', {}, { 
            marginBottom: '10px', padding: '8px', 
            background: 'rgba(32, 139, 254, 0.1)', 
            border: '1px solid rgba(32, 139, 254, 0.3)',
            borderRadius: '4px', fontSize: '12px',
            fontFamily: 'monospace', wordBreak: 'break-all'
        });
        const previewLabel = createElement('div', {}, { fontWeight: 'bold', marginBottom: '4px', opacity: '0.8' }, 'Preview:');
        const previewText = createElement('div', {}, {}, '');
        previewContainer.appendChild(previewLabel);
        previewContainer.appendChild(previewText);

        const label = createElement('label', { class: 'bsky-dl-label' }, {}, 'File Name Pattern');
        
        const textarea = createElement('textarea', { class: 'bsky-dl-textarea', spellcheck: 'false' });
        textarea.value = GM_getValue('filename', CONFIG.defaultTemplate);
        
        // Mock Data for Preview
        const mockData = {
            uname: 'oh8',
            username: 'oh8.bsky.social',
            postId: '3krmccyl4722w',
            postTime: 1715347800000,
            imageNumber: 0,
            title: 'A cute cat'
        };

        const updatePreview = () => {
            let tmpl = textarea.value;
            const result = tmpl
                .replace('<%uname>', mockData.uname)
                .replace('<%username>', mockData.username)
                .replace('<%post_id>', mockData.postId)
                .replace('<%post_time>', mockData.postTime)
                .replace('<%timestamp>', Date.now())
                .replace('<%img_num>', mockData.imageNumber)
                .replace('<%title>', mockData.title);
            previewText.textContent = result + '.jpg';
        };

        textarea.addEventListener('input', updatePreview);
        
        // Tags Helper
        const tagsContainer = createElement('div', { class: 'bsky-dl-tags' });
        const tags = [
            { tag: '<%uname>', desc: 'Short username (e.g. oh8)' },
            { tag: '<%username>', desc: 'Full username (e.g. oh8.bsky.social)' },
            { tag: '<%post_id>', desc: 'Post ID (e.g. 3krmccyl4722w)' },
            { tag: '<%post_time>', desc: 'Post Timestamp (e.g. 1715347800000)' },
            { tag: '<%timestamp>', desc: 'Download Timestamp (e.g. 1550557810891)' },
            { tag: '<%img_num>', desc: 'Image Number (e.g. 0, 1, 2)' },
            { tag: '<%title>', desc: 'Alt Text (from image description)' }
        ];

        tags.forEach(t => {
            const tagEl = createElement('span', { class: 'bsky-dl-tag', title: t.desc }, {}, t.tag);
            tagEl.onclick = () => {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = t.tag;
                textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + text.length;
                textarea.focus();
                updatePreview();
            };
            tagsContainer.appendChild(tagEl);
        });

        fileGroup.appendChild(previewContainer);
        fileGroup.appendChild(label);
        fileGroup.appendChild(textarea);
        fileGroup.appendChild(tagsContainer);

        // Initialize Preview
        updatePreview();

        const saveBtn = createElement('button', { class: 'bsky-dl-btn-primary' }, {}, 'Save');
        saveBtn.onclick = () => {
            GM_setValue('filename', textarea.value);
            // Update local variable if needed, though most functions fetch fresh
            filenameTemplate = textarea.value;
            overlay.remove();
        };
        
        const footer = createElement('div', { class: 'bsky-dl-modal-footer' });
        const closeBtn = createElement('button', { class: 'bsky-dl-modal-close' }, {}, 'Cancel');
        closeBtn.onclick = () => overlay.remove();

        footer.appendChild(closeBtn);

        modal.appendChild(title);
        modal.appendChild(historyGroup);
        modal.appendChild(packagingGroup);
        modal.appendChild(fileGroup);
        modal.appendChild(saveBtn);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }


    // ========================================================================
    // 4. UI INJECTION & EVENT HANDLING
    // ========================================================================

    // Injects the "Download All" button into the post footer
    function injectDownloadAllButton(bookmarkBtn) {
        // Guard clause to prevent duplicate buttons
        if (bookmarkBtn.hasAttribute('processed-all-dl')) return;

        // Find the main post container
        const postContainer = bookmarkBtn.closest(CONFIG.selectors.postItem);
        if (!postContainer) return;

        // Ensure there is actual media to download
        const mediaItems = getValidMedia(postContainer);
        if (mediaItems.length === 0) return;

        // Find the container for the action buttons (Reply, Repost, Like, etc.)
        const container = bookmarkBtn.parentNode;
        if (!container) return;

        // Mark as processed
        bookmarkBtn.setAttribute('processed-all-dl', '');

        // Create the button element
        const downloadAllBtn = document.createElement('div');
        downloadAllBtn.className = 'bsky-dl-all-btn';
        downloadAllBtn.title = 'Download All Images';
        downloadAllBtn.innerHTML = `<svg viewBox="0 0 1024 1024"><path d="${CONFIG.iconPath}"></path></svg>`;

        // Insert before the bookmark button
        container.insertBefore(downloadAllBtn, bookmarkBtn);
        
        // Initial state check (turn green if already downloaded)
        updatePostButtonState(postContainer, downloadAllBtn);

        // Click Handler for Download All
        downloadAllBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation(); // Stop event bubbling to prevent opening the post

            const mediaItems = getValidMedia(postContainer);
            if (mediaItems.length === 0) return;

            const enablePackaging = GM_getValue('enable_packaging', false);

            if (enablePackaging && mediaItems.length > 1) {
                // Check if JSZip is available
                if (typeof JSZip === 'undefined') {
                    alert('BSKY-DL: JSZip library not loaded. Cannot create ZIP.');
                    return;
                }

                console.log('BSKY-DL: Starting ZIP packaging for', mediaItems.length, 'items');

                // Visual Feedback: Show "Loading" state
                downloadAllBtn.style.opacity = '0.5';
                downloadAllBtn.style.pointerEvents = 'none';

                const zip = new JSZip();
                let zipName = 'bluesky_media';

                // Process all items in parallel
                const promises = mediaItems.map(async (item, i) => {
                    const isVideo = item.tagName.toLowerCase() === 'video';
                    
                    try {
                        const data = await prepareDownloadData(item, isVideo, i);
                        if (!data) return;

                        // Use first item for zip name
                        // Use the first item's data for the ZIP filename, but inject count instead of index
                        if (i === 0) {
                            const zipInfo = { ...data, imageNumber: mediaItems.length };
                            zipName = convertFilename(zipInfo);
                            console.log('BSKY-DL: ZIP Name set to:', zipName);
                        }

                        const dlUrl = isVideo ? item.poster : (item.src || item.poster);
                        const blob = await fetchBlueskyBlob(dlUrl, isVideo);
                        
                        if (blob) {
                            const ext = getExtensionFromBlob(blob);
                            const filename = `${convertFilename(data)}.${ext}`;
                            zip.file(filename, blob);
                            
                            // UI Update logic
                            if (!data.btnElement) {
                                const btnParent = item.parentElement?.parentElement;
                                if (btnParent) {
                                    data.btnElement = btnParent.querySelector('.bsky-dl-btn');
                                }
                            }
                            updateHistory(data);
                            if (data.btnElement) markButtonAsDownloaded(data.btnElement);
                        }
                    } catch (err) {
                        console.error('BSKY-DL: Error processing item', i, err);
                    }
                });

                await Promise.all(promises);

                if (Object.keys(zip.files).length > 0) {
                    console.log('BSKY-DL: Generating ZIP...');
                    try {
                        const content = await zip.generateAsync({ type: 'blob' });
                        console.log('BSKY-DL: ZIP generated. Size:', content.size);
                        
                        const blobUrl = URL.createObjectURL(content);
                        // Sanitize filename
                        const safeZipName = zipName.replace(/[/\\?%*:|"<>]/g, '-');
                        const zipFilename = `${safeZipName}.zip`;

                        console.log('BSKY-DL: Triggering download for', zipFilename);
                        fallbackDownload(blobUrl, zipFilename);
                        
                        updatePostButtonState(postContainer, downloadAllBtn);
                        console.log('BSKY-DL: ZIP download triggered');
                    } catch (err) {
                        console.error('BSKY-DL: ZIP Generation failed', err);
                        alert('Failed to generate ZIP file.');
                    }
                } else {
                    console.warn('BSKY-DL: No files added to ZIP');
                    alert('BSKY-DL: Failed to download any files for ZIP.');
                }

                // Restore Button State
                downloadAllBtn.style.opacity = '1';
                downloadAllBtn.style.pointerEvents = 'auto';

            } else {
                // SEQUENTIAL DOWNLOAD MODE (Legacy)
                for (let i = 0; i < mediaItems.length; i++) {
                    const item = mediaItems[i];
                    const isVideo = item.tagName.toLowerCase() === 'video';
                    
                    const data = await prepareDownloadData(item, isVideo, i);
                    if (data) {
                        const btnParent = item.parentElement?.parentElement;
                        if (btnParent) {
                            data.btnElement = btnParent.querySelector('.bsky-dl-btn');
                        }
                        data.postContainer = postContainer;
                        
                        const dlUrl = isVideo ? item.poster : (item.src || item.poster);
                        downloadContent(dlUrl, data);
                    }
                }
            }
        });
    }

    // Injects individual download buttons onto images/videos
    function injectDownloadButton(element, isVideo = false) {
        if (!element) return;

        const mediaUrl = isVideo ? element.poster : element.src;
        let downloadBtnParent;

        // Determine where to attach the button (usually the parent wrapper)
        if (mediaUrl.includes('feed_thumbnail') || isVideo) {
            downloadBtnParent = element.parentElement.parentElement;
        } else {
            return;
        }

        // Avoid injecting on very small thumbnails (likely avatars or quote previews)
        const grandParent = downloadBtnParent.parentElement;
        if (grandParent && grandParent.style.maxWidth === '100px') return;

        // Calculate a unique ID for history tracking
        const postContainer = element.closest(CONFIG.selectors.postItem) || element.closest(CONFIG.selectors.quotePost);
        const validMedia = postContainer ? getValidMedia(postContainer) : [];
        const index = validMedia.indexOf(element); 
        const safeIndex = index >= 0 ? index : (isVideo ? 0 : getImageNumberDOM(element));

        const uniqueId = getBlobId(element, isVideo, safeIndex);
        const isDownloaded = uniqueId && !!downloadHistory[uniqueId];

        // Create the button
        const downloadBtn = document.createElement('div');
        downloadBtn.className = isDownloaded ? 'bsky-dl-btn downloaded' : 'bsky-dl-btn';
        
        // Choose icon based on history state
        const pathData = isDownloaded ? CONFIG.checkPath : CONFIG.iconPath;
        downloadBtn.innerHTML = `<svg viewBox="0 0 1024 1024"><path d="${pathData}"></path></svg>`;

        // Ensure parent is relative so absolute positioning works
        if (getComputedStyle(downloadBtnParent).position === 'static') {
            downloadBtnParent.style.position = 'relative';
        }
        downloadBtnParent.appendChild(downloadBtn);

        // Click Handler for Single Download
        downloadBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();

            const data = await prepareDownloadData(element, isVideo, safeIndex);
            data.uniqueId = uniqueId;
            data.btnElement = downloadBtn;

            downloadContent(mediaUrl, data);
        });

        // Prevent dragging the button
        downloadBtn.addEventListener('mousedown', e => e.preventDefault());
    }

    // ========================================================================
    // 5. DATA PREPARATION & LOGIC
    // ========================================================================

    // Fetches metadata (API) and constructs the file naming data
    async function prepareDownloadData(element, isVideo, index) {
        let username = 'unknown', uname = 'unknown', postId = '00000';

        // Step 1: Parse URL from the DOM to get Username and Post ID
        try {
            const postPath = getPostLink(element).split('/');
            username = postPath[2] || 'unknown';
            uname = username.split('.')[0] || 'unknown'; // Short username (before the dot)
            postId = postPath[4] || '00000';
        } catch (err) {
            console.error('BSKY-DL: Error parsing URL', err);
        }

        // Step 2: Determine image index
        const imageNumber = index !== undefined ? index : (isVideo ? 0 : getImageNumberDOM(element));

        // Step 3: Get Alt Text from DOM as fallback title
        let domTitle = '';
        try {
            const ariaElem = element.closest('[aria-label]');
            if (ariaElem) domTitle = ariaElem.getAttribute('aria-label').replace(/[/\\?%*:|"<>]/g, '-'); // Corrected escaping for quotes and backslashes
        } catch { }

        // Construct Data Object
        const uniqueId = `${postId}_${imageNumber}`;
        const data = {
            uname: uname,
            username: username,
            postId: postId,
            postTime: 0,
            imageNumber: imageNumber,
            isVideo: isVideo,
            title: domTitle || 'Image',
            uniqueId: uniqueId,
            btnElement: null,
            postContainer: null
        };

        // Step 4: Fetch detailed metadata from Bluesky API
        // This is primarily to get the exact creation time and full Alt Text
        try {
            const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${username}/app.bsky.feed.post/${postId}&depth=0&parentHeight=0`);
            if (response.ok) {
                const apiData = await response.json();
                data.postTime = Date.parse(`${apiData.thread.post.record.createdAt}`);

                let embed = apiData.thread.post.record.embed;
                if (embed && embed['$type'] === 'app.bsky.embed.recordWithMedia') {
                    embed = embed.media;
                }

                if (!isVideo && embed?.images) {
                    const apiAlt = embed.images[imageNumber]?.alt;
                    if (apiAlt && apiAlt.trim() !== '') {
                        data.title = apiAlt.replace(/[/\\?%*:|"<>]/g, '-'); // Corrected escaping
                    }
                }
            }
        } catch (err) {
            console.warn('BSKY-DL: API fetch failed, using fallbacks.', err);
        }

        // Final Fallbacks
        if (!data.postTime) data.postTime = Date.now();
        if (!data.title || data.title.trim() === '') data.title = 'Image';

        return data;
    }

    // Helper to find all valid media items in a container
    // Filters out items belonging to Quoted Posts inside the current post
    function getValidMedia(postContainer) {
        if (!postContainer) return [];
        const candidates = postContainer.querySelectorAll(`${CONFIG.selectors.images}, ${CONFIG.selectors.videos}`);
        
        return Array.from(candidates).filter(el => {
            // Filter: Ensure media belongs to THIS post, not a nested quoted post
            const quoteParent = el.closest(CONFIG.selectors.quotePost);
            if (quoteParent && quoteParent !== postContainer && postContainer.contains(quoteParent)) {
                return false;
            }
            // Filter: Ignore tiny thumbnails
            const wrapper = el.parentElement?.parentElement?.parentElement;
            if (wrapper && wrapper.style.maxWidth === '100px') {
                return false;
            }
            return true;
        });
    }

    // Updates the visual state of the "Download All" button
    function updatePostButtonState(postContainer, specificBtn = null) {
        if (!postContainer) return;
        
        const btn = specificBtn || postContainer.querySelector('.bsky-dl-all-btn');
        if (!btn) return;

        const mediaItems = getValidMedia(postContainer);
        if (mediaItems.length === 0) return;

        let allDownloaded = true;

        // Check if every item in this post is in our history
        for (let i = 0; i < mediaItems.length; i++) {
            const item = mediaItems[i];
            const isVideo = item.tagName.toLowerCase() === 'video';
            const uniqueId = getBlobId(item, isVideo, i);
            
            if (!uniqueId || !downloadHistory[uniqueId]) {
                allDownloaded = false;
                break;
            }
        }

        // If all are downloaded, turn the main button green
        if (allDownloaded) {
            markButtonAsDownloaded(btn);
        }
    }

    // ========================================================================
    // 6. NETWORK & DOWNLOAD
    // ========================================================================

    // Fetch the raw blob from Bluesky's CDN
    async function fetchBlueskyBlob(url, isVideo) {
        const urlArray = url.split('/');
        // Extract DID and CID from the CDN URL
        // Video URL structure and Image URL structure differ slightly
        const did = isVideo ? urlArray[4] : urlArray[6];
        const cid = isVideo ? urlArray[5] : urlArray[7].split('@')[0];

        try {
            // Attempt 1: Fetch via Bluesky Sync API (High Quality)
            if (!did || !cid) throw new Error('Could not parse DID/CID');
            
            const response = await fetch(`https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${cid}`);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return await response.blob();
        } catch (err) {
            console.warn('BSKY-DL: High-quality fetch failed, falling back to CDN.', err);
            
            try {
                // Attempt 2: Fetch via CDN URL (Fallback)
                // Note: This might get the thumbnail version if that's what the URL points to, but it's better than nothing.
                const fallbackResponse = await fetch(url);
                if (!fallbackResponse.ok) throw new Error(`CDN Error: ${fallbackResponse.status}`);
                return await fallbackResponse.blob();
            } catch (fatalErr) {
                console.error('BSKY-DL: All fetch attempts failed.', fatalErr);
                return null;
            }
        }
    }

    // Logic to download content via Blob ID
    async function downloadContent(url, data) {
        const blob = await fetchBlueskyBlob(url, data.isVideo);
        if (blob) {
            sendFile(data, blob);
        }
    }

    // Triggers the browser download behavior
    function sendFile(data, blob) {
        // Construct filename and extension
        const filename = convertFilename(data) + `.${getExtensionFromBlob(blob)}`;
        
        // Create invisible anchor tag to trigger download
        const downloadEl = document.createElement('a');
        downloadEl.href = URL.createObjectURL(blob);
        downloadEl.download = filename;
        document.body.appendChild(downloadEl);
        downloadEl.click();
        document.body.removeChild(downloadEl);
        
        // Clean up memory
        URL.revokeObjectURL(downloadEl.href);

        // Update History and UI
        updateHistory(data);
        if (data.btnElement) {
            markButtonAsDownloaded(data.btnElement);
        }
        
        // Update "Download All" status
        const post = data.btnElement ? data.btnElement.closest(CONFIG.selectors.postItem) : data.postContainer;
        if (post) {
            updatePostButtonState(post);
        }
    }

    // Persist download history
    function updateHistory(data) {
        if (!GM_getValue('save_history', true)) return;

        const uniqueId = data.uniqueId;
        if (!uniqueId) return;
        
        // Store rich data for the history viewer
        downloadHistory[uniqueId] = {
            username: data.username,
            handle: data.uname,
            postId: data.postId,
            timestamp: Date.now()
        };
        GM_setValue('dl_history', downloadHistory);
    }

    // Visual helper to turn button green
    function markButtonAsDownloaded(btn) {
        if (!btn) return;
        if (btn.classList.contains('downloaded')) return; 
        
        btn.classList.add('downloaded');
        btn.innerHTML = `<svg viewBox="0 0 1024 1024"><path d="${CONFIG.checkPath}"></path></svg>`;
    }

    // ========================================================================
    // 7. UTILITY HELPERS
    // ========================================================================
    
    // Helper to create elements with attributes and styles
    function createElement(tag, attributes = {}, styles = {}, text = '') {
        const el = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
        Object.entries(styles).forEach(([key, value]) => el.style[key] = value);
        if (text) el.textContent = text;
        return el;
    }

    // Clear all history
    function clearHistory() {
        if (!confirm('Are you sure you want to clear all download history? This cannot be undone.')) return;

        downloadHistory = {};
        GM_setValue('dl_history', {});

        // Reset UI buttons on the page
        document.querySelectorAll('.bsky-dl-btn.downloaded').forEach(btn => {
            btn.classList.remove('downloaded');
            btn.innerHTML = `<svg viewBox="0 0 1024 1024"><path d="${CONFIG.iconPath}"></path></svg>`;
        });
        document.querySelectorAll('.bsky-dl-all-btn.downloaded').forEach(btn => {
            btn.classList.remove('downloaded');
        });

        // Update Modal if open
        const list = document.querySelector('.bsky-dl-list');
        if (list) {
            list.innerHTML = '<div style="padding:10px; text-align:center; opacity:0.7">No history found.</div>';
        }
        
        // Clear Preview
        const preview = document.querySelector('.bsky-dl-preview');
        if (preview) {
            preview.innerHTML = '';
            const placeholder = createElement('div', {}, { opacity: '0.6' }, 'Select an item to view details.');
            preview.appendChild(placeholder);
        }
    }

    // Export history as JSON
    function exportHistory() {
        const history = GM_getValue('dl_history', {});
        const ids = Object.keys(history);
        
        if (ids.length === 0) {
            alert('No history to export.');
            return;
        }

        const exportData = ids.map(id => {
            const entry = history[id];
            if (entry === true) {
                return { id: id, legacy: true };
            }
            return {
                id: id,
                ...entry,
                url: `https://bsky.app/profile/${entry.username}/post/${entry.postId}`
            };
        });

        const blob = new Blob([JSON.stringify(exportData, null, 4)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bsky_download_history_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // Injects the Settings UI into the Bluesky settings page
    function injectSettingsUI(node) {
        const container = node.parentNode;
        
        const settingsBtn = createElement('div', { id: 'bsky-dl-settings-btn', class: 'bsky-dl-settings-btn' }, {}, `DL Settings v${GM_info.script.version}`);

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openSettings();
        });

        const viewHistoryBtn = createElement('div', { class: 'bsky-dl-settings-btn' }, { color: '#208bfe', borderColor: '#208bfe', marginTop: '10px' }, 'View Download History');

        viewHistoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            viewHistory();
        });

        container.insertBefore(settingsBtn, node);
        container.insertBefore(viewHistoryBtn, node);
    }

    // View History Modal
    function viewHistory() {
        const overlay = createElement('div', { class: 'bsky-dl-overlay' });
            
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    
        const modal = createElement('div', { class: 'bsky-dl-modal' });
        const title = createElement('h3', {}, { textAlign: 'center', margin: '0 0 15px 0' }, 'Download History');
            
        const layout = createElement('div', { class: 'bsky-dl-layout' });
        const list = createElement('div', { class: 'bsky-dl-list' });
        const preview = createElement('div', { class: 'bsky-dl-preview' });
        const previewPlaceholder = createElement('div', {}, { opacity: '0.6' }, 'Select an item to view details.');
        preview.appendChild(previewPlaceholder);
    
        const groupedHistory = {};
        Object.keys(downloadHistory).forEach(key => {
            const entry = downloadHistory[key];
            // Handle legacy boolean entries
            if (entry === true) return; 
                
            if (!groupedHistory[entry.postId]) {
                groupedHistory[entry.postId] = {
                    ...entry,
                    // Keep track of all keys associated with this post for deletion
                    keys: []
                };
            }
            groupedHistory[entry.postId].keys.push(key);
            // Update timestamp to the most recent one
            if (entry.timestamp > groupedHistory[entry.postId].timestamp) {
                groupedHistory[entry.postId].timestamp = entry.timestamp;
            }
        });
    
        const sortedPostIds = Object.keys(groupedHistory).sort((a, b) => {
            return groupedHistory[b].timestamp - groupedHistory[a].timestamp;
        });
    
        if (sortedPostIds.length === 0) {
            list.innerHTML = '<div style="padding:10px; text-align:center; opacity:0.7">No history found.</div>';
        } else {
            sortedPostIds.forEach(postId => {
                const entry = groupedHistory[postId];
                const row = createHistoryRow(entry, postId, modal, list, preview, previewPlaceholder);
                list.appendChild(row);
            });
        }
    
        const footer = createElement('div', { class: 'bsky-dl-modal-footer' });
            
        const clearBtn = createElement('button', { class: 'bsky-dl-modal-close' }, { float: 'left', color: '#e11d48', borderColor: '#e11d48' }, 'Clear History');
        clearBtn.onclick = () => clearHistory();
    
        const exportBtn = createElement('button', { class: 'bsky-dl-modal-close' }, { marginRight: '10px' }, 'Export JSON');
        exportBtn.onclick = () => exportHistory();
    
        const closeBtn = createElement('button', { class: 'bsky-dl-modal-close' }, {}, 'Close');
        closeBtn.onclick = () => overlay.remove();
            
        footer.appendChild(clearBtn);
        footer.appendChild(exportBtn);
        footer.appendChild(closeBtn);
            
        layout.appendChild(list);
        layout.appendChild(preview);
        modal.appendChild(title);
        modal.appendChild(layout);
        modal.appendChild(footer);
        overlay.appendChild(modal);
            
        document.body.appendChild(overlay);
    }
    
    function createHistoryRow(entry, postId, modal, list, preview, previewPlaceholder) {
        const row = createElement('div', { class: 'bsky-dl-row' });
        const idLink = createElement('div', { class: 'bsky-dl-link' }, {}, postId);
            
        idLink.addEventListener('click', async () => {
            modal.classList.add('expanded');
            preview.innerHTML = '';
                
            list.querySelectorAll('.bsky-dl-row').forEach(r => r.classList.remove('active'));
            row.classList.add('active');
                
            const closePrev = createElement('div', { class: 'bsky-dl-close-preview' }, {}, '×');
            closePrev.onclick = (e) => {
                e.stopPropagation();
                modal.classList.remove('expanded');
                list.querySelectorAll('.bsky-dl-row').forEach(r => r.classList.remove('active'));
                preview.innerHTML = '';
                preview.appendChild(previewPlaceholder);
            };
            preview.appendChild(closePrev);
    
            const loading = createElement('div', {}, { opacity: '0.6' }, 'Loading preview...');
            preview.appendChild(loading);
    
            try {
                const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${entry.username}/app.bsky.feed.post/${entry.postId}&depth=0&parentHeight=0`);
                if (!response.ok) throw new Error('Failed to fetch post');
                    
                const json = await response.json();
                const post = json.thread.post;
                const record = post.record;
                const author = post.author;
    
                loading.remove();
                    
                const card = createPreviewCard(author, record, post);
                preview.appendChild(card);
    
            } catch (e) {
                console.error(e);
                loading.textContent = 'Error loading preview. Post may be deleted.';
            }
        });
    
        const actions = createElement('div', {}, { display: 'flex', gap: '5px', alignItems: 'center' });
    
        const openBtn = createElement('a', { 
            href: `https://bsky.app/profile/${entry.username}/post/${entry.postId}`,
            target: '_blank',
            class: 'bsky-dl-btn-sm'
        }, { textDecoration: 'none', color: '#208bfe', borderColor: '#208bfe' }, 'OPEN ↗');
        actions.appendChild(openBtn);
    
        const delBtn = createElement('div', { class: 'bsky-dl-btn-sm' }, {}, 'DELETE');
        delBtn.onclick = () => {
            if (confirm(`Remove post ${postId} and all its media from history?`)) {
                entry.keys.forEach(k => delete downloadHistory[k]);
                GM_setValue('dl_history', downloadHistory);
                row.remove();
            }
        };
    
        actions.appendChild(delBtn);
    
        row.appendChild(idLink);
        row.appendChild(actions);
        return row;
    }
    
    function createPreviewCard(author, record, post) {
        const card = createElement('div', { class: 'bsky-card' });
                            
        const header = createElement('div', { class: 'bsky-card-header' });
        const avatar = createElement('img', { class: 'bsky-card-avatar', src: author.avatar || '' });
        const user = createElement('div', { class: 'bsky-card-user' });
        const name = createElement('div', { class: 'bsky-card-name' }, {}, author.displayName || author.handle);
        const handle = createElement('div', { class: 'bsky-card-handle' }, {}, `@${author.handle}`);
            
        user.appendChild(name);
        user.appendChild(handle);
        header.appendChild(avatar);
        header.appendChild(user);
            
        const text = createElement('div', { class: 'bsky-card-text' }, {}, record.text || '');
    
        const mediaContainer = createElement('div', { class: 'bsky-card-media' });
            
        let images = [];
        let videoThumbnail = null;
            
        // Helper to extract media from embed
        const extractMedia = (embed) => {
            if (!embed) return;
                
            if (embed.images) {
                images = embed.images;
            } 
            else if (embed.thumbnail) {
                videoThumbnail = embed.thumbnail; // External media often has a thumbnail
            }
            if (embed.media) {
                extractMedia(embed.media);
            }
        };
            
        if (post.embed) {
            extractMedia(post.embed);
                    
            if (post.embed['$type'] === 'app.bsky.embed.video#view' && post.embed.thumbnail) {
                videoThumbnail = post.embed.thumbnail;
            }
        }
    
        if (images.length > 0) {
            mediaContainer.classList.add(`bsky-media-${Math.min(images.length, 4)}`);
            images.forEach(img => {
                const imgEl = createElement('img', { class: 'bsky-card-img', src: img.fullsize || img.thumb });
                mediaContainer.appendChild(imgEl);
            });
        } else if (videoThumbnail) {
            mediaContainer.classList.add('bsky-media-1');
            const imgEl = createElement('img', { class: 'bsky-card-img', src: videoThumbnail });
                    
            const playOverlay = createElement('div', {}, {
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', pointerEvents: 'none'
            }, '▶');
                    
            const wrapper = createElement('div', {}, { position: 'relative' });
            wrapper.appendChild(imgEl);
            wrapper.appendChild(playOverlay);
            mediaContainer.appendChild(wrapper);
        }
            
        card.appendChild(header);
        card.appendChild(text);
        if (mediaContainer.hasChildNodes()) card.appendChild(mediaContainer);
            
        const footerRow = createElement('div', { class: 'bsky-card-footer' }, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' });
        const date = createElement('div', { class: 'bsky-card-date' }, {}, new Date(record.createdAt).toLocaleString());
            
        footerRow.appendChild(date);
        card.appendChild(footerRow);
            
        return card;
    }
    // Generates the Unique ID for history checking
    function getBlobId(element, isVideo, index) {
        try {
            const link = getPostLink(element);
            const pathParts = link.split('/');
            // Expecting format: /profile/{user}/post/{id}
            if (pathParts.length >= 5) {
                const postId = pathParts[4];
                return `${postId}_${index}`;
            }
        } catch { return null; }
        return null;
    }

    // Gets the index of an image within its post
    function getImageNumberDOM(image) {
        try {
            const ancestor = image.closest(CONFIG.selectors.postItem) || document.body;
            const postImages = ancestor.querySelectorAll(CONFIG.selectors.images);
            for (let i = 0; i < postImages.length; i++) {
                if (postImages[i].src === image.src) return i;
            }
        } catch { return 0; }
        return 0;
    }

    // Robust function to find the Link associated with the Post
    // This is critical for determining the Post ID
    function getPostLink(element) {
        const isVideo = element.tagName.toLowerCase() === 'video';
        const sep = isVideo && element.poster ? element.poster : element.src;
        
        let path = window.location.pathname;

        // STRATEGY 1: Traverse UP to find a parent anchor tag
        if (element.parentElement) {
            let currentEl = element;
            let pathMatch = null;

            // Immediate check on parent
            if (currentEl.parentElement.innerHTML.split(sep)[0]) {
                pathMatch = currentEl.parentElement.innerHTML.split(sep)[0].match(CONFIG.postUrlRegex);
            }

            // Loop upwards
            while (!pathMatch) {
                currentEl = currentEl.parentElement;
                if (!currentEl) break;
                // Stop if we hit a thread item wrapper to avoid grabbing wrong parent link
                if (currentEl.innerHTML.includes('postThreadItem')) break;
                
                if (currentEl.innerHTML.split(sep)[0]) {
                    pathMatch = currentEl.innerHTML.split(sep)[0].match(CONFIG.postUrlRegex);
                }
            }
            if (pathMatch) return pathMatch[0];
        }

        // STRATEGY 2: Fallback - Search DOWN into the container
        // Useful for Expanded Views where the media isn't wrapped in the link anchor
        const container = element.closest(CONFIG.selectors.postItem) || element.closest(CONFIG.selectors.quotePost);
        if (container) {
            // Iterate all potential links to avoid grabbing one from a NESTED quote
            const links = container.querySelectorAll('a[href*="/post/"]');
            for (const link of links) {
                const linkQuoteParent = link.closest(CONFIG.selectors.quotePost);
                
                // CRITICAL FIX: If link belongs to a nested quote (child of current container), skip it.
                // We only want the link belonging to the immediate container.
                if (linkQuoteParent && linkQuoteParent !== container && container.contains(linkQuoteParent)) {
                    continue;
                }
                return link.getAttribute('href');
            }
        }

        return path;
    }

    // Helper to map MIME types to file extensions
    function getExtensionFromBlob(blob) {
        const mimeTypeToExtension = {
            'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
            'image/webp': 'webp', 'image/svg+xml': 'svg',
            'video/mp4': 'mp4', 'video/webm': 'webm', 'video/ogg': 'ogv'
        };
        if (mimeTypeToExtension[blob.type]) return mimeTypeToExtension[blob.type];
        
        // Fallback: try to guess from blob name property if available
        if (blob.name) {
            const lastDotIndex = blob.name.lastIndexOf('.');
            if (lastDotIndex !== -1) return blob.name.substring(lastDotIndex + 1).toLowerCase();
        }
        return '';
    }

    // Fallback download method using anchor tag
    function fallbackDownload(blobUrl, filename) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Delay revocation to ensure download starts
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }

    // Replaces placeholders in the filename template
    function convertFilename(data) {
        return filenameTemplate
            .replace('<%uname>', data.uname)
            .replace('<%username>', data.username)
            .replace('<%post_id>', data.postId)
            .replace('<%post_time>', data.postTime)
            .replace('<%timestamp>', Date.now())
            .replace('<%img_num>', data.imageNumber)
            .replace('<%title>', data.title);
    }

    // ========================================================================
    // 8. WHAT'S NEW MODAL
    // ========================================================================

    function showWhatsNew() {
        const modal = createElement('div', { class: 'bsky-wn-modal' });
        
        // Header
        const header = createElement('div', { class: 'bsky-wn-header' });
        const title = createElement('div', { class: 'bsky-wn-title' }, {}, 'What\'s New');
        const versionTag = createElement('span', { class: 'bsky-wn-tag' }, {}, `v${GM_info.script.version}`);
        title.appendChild(versionTag);
        
        const closeBtn = createElement('div', { class: 'bsky-wn-close' }, {}, '×');
        closeBtn.onclick = () => {
            GM_setValue('last_version', GM_info.script.version);
            modal.style.transform = 'translateX(120%)';
            setTimeout(() => modal.remove(), 500);
        };
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const list = createElement('ul', { class: 'bsky-wn-list' });
        WHATS_NEW.forEach(item => {
            const li = createElement('li', {}, {}, item);
            list.appendChild(li);
        });
        
        modal.appendChild(header);
        modal.appendChild(list);
        document.body.appendChild(modal);
    }

    function checkVersion() {
        const lastVersion = GM_getValue('last_version', '0.0.0');
        if (lastVersion !== GM_info.script.version) {
            // Delay slightly to ensure page is interactive
            setTimeout(showWhatsNew, 1500);
        }
    }

    checkVersion();

})();