// ==UserScript==
// @name        Bluesky Image/Video Download Button
// @namespace   KanashiiWolf
// @match       https://bsky.app/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_info
// @grant       GM_addStyle
// @version     2.1.3
// @author      KanashiiWolf, the-nelsonator, coredumperror
// @description Adds a download button to Bluesky images and videos.
// @license     MIT
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
        defaultTemplate: "@<%username>-bsky-<%post_id>-<%img_num>",
        
        // Regex to extract the post ID from a standard Bluesky URL
        postUrlRegex: /\/profile\/[^/]+\/post\/[A-Za-z0-9]+/,
        
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
        iconPath: "M925.248 356.928l-258.176-258.176a64 64 0 0 0-45.248-18.752H144a64 64 0 0 0-64 64v736a64 64 0 0 0 64 64h736a64 64 0 0 0 64-64V402.176a64 64 0 0 0-18.752-45.248zM288 144h192V256H288V144z m448 736H288V736h448v144z m144 0H800V704a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v176H144v-736H224V288a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V144h77.824l258.176 258.176V880z",
        checkPath: "M433 817L133 517l90-90 210 210L821 249l90 90z" // Simple checkmark for success state
    };

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

        /* Settings UI - Config button and inputs */
        .bsky-dl-settings-btn {
            display: flex; align-items: center; justify-content: center;
            margin-top: 10px; border: 2px solid; cursor: pointer; padding: 5px; font-weight: bold;
            transition: all 0.2s;
        }
        #filename-input-space { display: none; margin-top: 10px; text-align: center; padding: 5px; }

        /* Help Table for filename variables */
        .bsky-dl-help {
            display: none; margin-top: 10px; padding: 10px;
            border: 1px solid rgba(128,128,128, 0.3); border-radius: 5px;
            font-size: 12px; line-height: 1.4;
            background: rgba(128,128,128, 0.05); text-align: left;
        }
        .bsky-dl-help table { width: 100%; border-collapse: collapse; }
        .bsky-dl-help td { padding: 2px 4px; vertical-align: top; }
        .bsky-dl-help .var { font-family: monospace; font-weight: bold; white-space: nowrap; }
        .bsky-dl-help .desc { color: inherit; opacity: 0.9; }
        .bsky-dl-help .ex { opacity: 0.6; font-style: italic; }
    `;

    // Add styles to the document
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ========================================================================
    // 3. OBSERVER LOGIC
    // ========================================================================

    // Main observer callback to handle dynamic content loading (infinite scroll)
    const handleMutations = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (let node of mutation.addedNodes) {
                // Ensure we are working with an HTML Element
                if (!(node instanceof HTMLElement)) continue;

                // A. SETTINGS: Check if the Settings header was loaded to inject our config UI
                const settingsHeader = node.querySelector(CONFIG.selectors.settings);
                if (settingsHeader && !document.getElementById('filename-input-space')) {
                    injectSettingsUI(settingsHeader);
                }

                // B. DOWNLOAD ALL: Check for Bookmark buttons to inject "Download All" next to them
                const bookmarkBtns = node.matches(CONFIG.selectors.bookmark) ? [node] : node.querySelectorAll(CONFIG.selectors.bookmark);
                bookmarkBtns.forEach(btn => {
                    injectDownloadAllButton(btn);
                });

                // C. IMAGES: Check for new images in the feed
                node.querySelectorAll(CONFIG.selectors.images).forEach((img) => {
                    // Prevent double-processing
                    if (img && !img.hasAttribute("processed")) {
                        img.setAttribute('processed', '');
                        injectDownloadButton(img, false);

                        // Also try to inject "Download All" if we found an image but missed the bookmark button
                        const post = img.closest(CONFIG.selectors.postItem);
                        if (post) {
                            const bookmark = post.querySelector(CONFIG.selectors.bookmark);
                            if (bookmark) injectDownloadAllButton(bookmark);
                        }
                    }
                });

                // D. VIDEOS: Check for new videos in the feed
                node.querySelectorAll(CONFIG.selectors.videos).forEach((vid) => {
                    if (vid && !vid.hasAttribute("processed")) {
                        vid.setAttribute('processed', '');
                        injectDownloadButton(vid, true);

                        const post = vid.closest(CONFIG.selectors.postItem);
                        if (post) {
                            const bookmark = post.querySelector(CONFIG.selectors.bookmark);
                            if (bookmark) injectDownloadAllButton(bookmark);
                        }
                    }
                });

                // E. EXPANDED QUOTES: Special handling for expanded posts
                // Expanded views often have a specific DOM structure: Parent -> [FeedDOM, ExpandedDOM]
                // We target the second child (ExpandedDOM) specifically to find content within it.
                if (node.children && node.children.length === 2 && node.children[1].tagName === 'DIV') {
                    const expandedDom = node.children[1];
                    
                    // Force a scan specifically on the expanded DOM section
                    expandedDom.querySelectorAll(CONFIG.selectors.images).forEach((img) => {
                        if (img && !img.hasAttribute("processed")) {
                            img.setAttribute('processed', '');
                            injectDownloadButton(img, false);
                        }
                    });
                     expandedDom.querySelectorAll(CONFIG.selectors.videos).forEach((vid) => {
                        if (vid && !vid.hasAttribute("processed")) {
                            vid.setAttribute('processed', '');
                            injectDownloadButton(vid, true);
                        }
                    });
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

    // Injects the "Download All" button into the post footer
    function injectDownloadAllButton(bookmarkBtn) {
        // Guard clause to prevent duplicate buttons
        if (bookmarkBtn.hasAttribute("processed-all-dl")) return;

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
        bookmarkBtn.setAttribute("processed-all-dl", "");

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

            // Iterate through all media in the post and download sequentially
            for (let i = 0; i < mediaItems.length; i++) {
                const item = mediaItems[i];
                const isVideo = item.tagName.toLowerCase() === 'video';
                
                // Fetch metadata and prepare data object
                const data = await prepareDownloadData(item, isVideo, i);
                if (data) {
                    // Link this download to the individual button to update its state later
                    const btnParent = item.parentElement?.parentElement;
                    if (btnParent) {
                        data.btnElement = btnParent.querySelector('.bsky-dl-btn');
                    }
                    data.postContainer = postContainer;
                    
                    // Determine correct URL (src for IMG, poster for VIDEO)
                    const dlUrl = isVideo ? item.poster : (item.src || item.poster);
                    downloadContent(dlUrl, data);
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
        const isDownloaded = uniqueId && downloadHistory[uniqueId] === true;

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

    // Injects the Settings UI into the Bluesky settings page
    function injectSettingsUI(node) {
        const container = node.parentNode;
        
        // Create Input Field (Hidden by default)
        const settingsInput = document.createElement('input');
        settingsInput.id = 'filename-input-space';
        settingsInput.value = filenameTemplate;

        // Create Help Text (Hidden by default)
        const helpDiv = document.createElement('div');
        helpDiv.className = 'bsky-dl-help';
        helpDiv.innerHTML = `
            <table>
                <tr><td class="var">&lt;%uname&gt;</td><td class="desc">Short username</td><td class="ex">eg: oh8</td></tr>
                <tr><td class="var">&lt;%username&gt;</td><td class="desc">Full username</td><td class="ex">eg: oh8.bsky.social</td></tr>
                <tr><td class="var">&lt;%post_id&gt;</td><td class="desc">Post ID</td><td class="ex">eg: 3krmccyl4722w</td></tr>
                <tr><td class="var">&lt;%post_time&gt;</td><td class="desc">Post Timestamp</td><td class="ex">eg: 1715347800000</td></tr>
                <tr><td class="var">&lt;%timestamp&gt;</td><td class="desc">DL Timestamp</td><td class="ex">eg: 1550557810891</td></tr>
                <tr><td class="var">&lt;%img_num&gt;</td><td class="desc">Image Number</td><td class="ex">eg: 0, 1, 2</td></tr>
                <tr><td class="var">&lt;%title&gt;</td><td class="desc">ALT Text</td><td class="ex"></td></tr>
            </table>`;

        // Create Toggle Button
        const settingsBtn = document.createElement('div');
        settingsBtn.className = 'bsky-dl-settings-btn';
        settingsBtn.textContent = `DL Filename Template v${GM_info.script.version}`;

        // Handle Input Enter Key (Save & Close)
        settingsInput.addEventListener('keypress', (e) => {
            if (e.key === "Enter") {
                settingsInput.style.display = 'none';
                helpDiv.style.display = 'none';
                settingsBtn.style.display = 'flex';
                filenameTemplate = settingsInput.value;
                GM_setValue('filename', filenameTemplate);
            }
        });

        // Handle Button Click (Open Settings)
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            settingsBtn.style.display = 'none';
            settingsInput.style.display = 'block';
            helpDiv.style.display = 'block';
            settingsInput.focus();
            settingsInput.value = filenameTemplate;
        });

        // Create History Clear Button
        const clearBtn = document.createElement('div');
        clearBtn.className = 'bsky-dl-settings-btn';
        clearBtn.textContent = 'Clear Download History';
        clearBtn.style.color = '#e11d48';
        clearBtn.style.borderColor = '#e11d48';

        let confirmTimeout;

        // Handle Clear History Logic (Double click protection)
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // First Click: Ask for confirmation
            if (clearBtn.getAttribute('data-confirming') !== 'true') {
                clearBtn.setAttribute('data-confirming', 'true');
                clearBtn.textContent = 'Click again to confirm';
                clearBtn.style.backgroundColor = '#e11d48';
                clearBtn.style.color = 'white';
                clearBtn.dataset.lastClick = Date.now();

                // Reset if not confirmed within 3 seconds
                confirmTimeout = setTimeout(() => {
                    clearBtn.removeAttribute('data-confirming');
                    clearBtn.textContent = 'Clear Download History';
                    clearBtn.style.backgroundColor = 'transparent';
                    clearBtn.style.color = '#e11d48';
                }, 3000);
            } else {
                // Second Click: Perform Clear
                const timeDiff = Date.now() - parseInt(clearBtn.dataset.lastClick || 0);
                if (timeDiff < 250) return; // Debounce

                clearTimeout(confirmTimeout);
                downloadHistory = {};
                GM_setValue('dl_history', {});
                
                // Reset UI state for all visible buttons
                document.querySelectorAll('.bsky-dl-btn.downloaded').forEach(btn => {
                    btn.classList.remove('downloaded');
                    btn.innerHTML = `<svg viewBox="0 0 1024 1024"><path d="${CONFIG.iconPath}"></path></svg>`;
                });
                
                document.querySelectorAll('.bsky-dl-all-btn.downloaded').forEach(btn => {
                    btn.classList.remove('downloaded');
                });

                // Success Message
                clearBtn.removeAttribute('data-confirming');
                clearBtn.textContent = 'History Cleared!';
                setTimeout(() => {
                    clearBtn.textContent = 'Clear Download History';
                    clearBtn.style.backgroundColor = 'transparent';
                    clearBtn.style.color = '#e11d48';
                }, 1500);
            }
        });

        // Inject elements
        container.insertBefore(settingsBtn, node);
        container.insertBefore(clearBtn, node);
        container.insertBefore(settingsInput, settingsBtn);
        container.insertBefore(helpDiv, settingsBtn);
    }

    // ========================================================================
    // 5. DATA PREPARATION & LOGIC
    // ========================================================================

    // Fetches metadata (API) and constructs the file naming data
    async function prepareDownloadData(element, isVideo, index) {
        let username = "unknown", uname = "unknown", postId = "00000";

        // Step 1: Parse URL from the DOM to get Username and Post ID
        try {
            const postPath = getPostLink(element).split('/');
            username = postPath[2] || "unknown";
            uname = username.split('.')[0] || "unknown"; // Short username (before the dot)
            postId = postPath[4] || "00000";
        } catch (err) {
            console.error("BSKY-DL: Error parsing URL", err);
        }

        // Step 2: Determine image index
        const imageNumber = index !== undefined ? index : (isVideo ? 0 : getImageNumberDOM(element));

        // Step 3: Get Alt Text from DOM as fallback title
        let domTitle = "";
        try {
            const ariaElem = element.closest("[aria-label]");
            if (ariaElem) domTitle = ariaElem.getAttribute("aria-label").replace(/[/\\?%*:|"<>]/g, '-');
        } catch (e) { }

        // Construct Data Object
        const uniqueId = `${postId}_${imageNumber}`;
        const data = {
            uname: uname,
            username: username,
            postId: postId,
            postTime: 0,
            imageNumber: imageNumber,
            isVideo: isVideo,
            title: domTitle || "Image",
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

                if (!isVideo && apiData.thread.post.record.embed?.images) {
                    const apiAlt = apiData.thread.post.record.embed.images[imageNumber]?.alt;
                    if (apiAlt && apiAlt.trim() !== "") {
                        data.title = apiAlt.replace(/[/\\?%*:|"<>]/g, '-');
                    }
                }
            }
        } catch (err) {
            console.warn("BSKY-DL: API fetch failed, using fallbacks.", err);
        }

        // Final Fallbacks
        if (!data.postTime) data.postTime = Date.now();
        if (!data.title || data.title.trim() === "") data.title = "Image";

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

    // Logic to download content via Blob ID
    function downloadContent(url, data) {
        const urlArray = url.split('/');
        
        // Extract DID and CID from the CDN URL
        // Video URL structure and Image URL structure differ slightly
        const did = data.isVideo ? urlArray[4] : urlArray[6];
        const cid = data.isVideo ? urlArray[5] : urlArray[7].split('@')[0];

        // Fetch the raw blob from Bluesky's sync endpoint
        fetch(`https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${cid}`)
            .then(response => {
                if (!response.ok) throw new Error(`Couldn't retrieve blob! Response: ${response}`);
                return response.blob();
            })
            .then(blob => sendFile(data, blob))
            .catch(err => console.error(err));
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
        updateHistory(data.uniqueId);
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
    function updateHistory(uniqueId) {
        if (!uniqueId) return;
        downloadHistory[uniqueId] = true; 
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
        } catch(e) { return null; }
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
        } catch (e) { return 0; }
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
            while (pathMatch == null) {
                currentEl = currentEl.parentElement;
                if (!currentEl) break;
                // Stop if we hit a thread item wrapper to avoid grabbing wrong parent link
                if (currentEl.innerHTML.includes("postThreadItem")) break;
                
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

    // Replaces placeholders in the filename template
    function convertFilename(data) {
        return filenameTemplate
            .replace("<%uname>", data.uname)
            .replace("<%username>", data.username)
            .replace("<%post_id>", data.postId)
            .replace("<%post_time>", data.postTime)
            .replace("<%timestamp>", Date.now())
            .replace("<%img_num>", data.imageNumber)
            .replace("<%title>", data.title);
    }

})();