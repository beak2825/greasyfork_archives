// ==UserScript==
// @name         8chan Lightweight Extended Suite (Currently not working)
// @namespace    https://greasyfork.org/en/scripts/533173
// @version      2.6.2
// @description  Minimalist extender for 8chan with in-line replies, spoiler revealing and media preview for videos & images
// @author       impregnator
// @match        https://8chan.moe/*
// @match        https://8chan.se/*
// @match        https://8chan.cc/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533173/8chan%20Lightweight%20Extended%20Suite%20%28Currently%20not%20working%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533173/8chan%20Lightweight%20Extended%20Suite%20%28Currently%20not%20working%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process images and replace spoiler placeholders with thumbnails
    function processImages(images, isCatalog = false) {
        images.forEach(img => {
            // Check if the image is a spoiler placeholder (custom or default)
            if (img.src.includes('custom.spoiler') || img.src.includes('spoiler.png')) {
                let fullFileUrl;
                if (isCatalog) {
                    // Catalog: Get the href from the parent <a class="linkThumb">
                    const link = img.closest('a.linkThumb');
                    if (link) {
                        // Construct the thumbnail URL based on the thread URL
                        fullFileUrl = link.href;
                        const threadMatch = fullFileUrl.match(/\/([a-z0-9]+)\/res\/([0-9]+)\.html$/i);
                        if (threadMatch && threadMatch[1] && threadMatch[2]) {
                            const board = threadMatch[1];
                            const threadId = threadMatch[2];
                            // Fetch the thread page to find the actual image URL
                            fetchThreadImage(board, threadId).then(thumbnailUrl => {
                                if (thumbnailUrl) {
                                    img.src = thumbnailUrl;
                                }
                            });
                        }
                    }
                } else {
                    // Thread: Get the parent <a> element containing the full-sized file URL
                    const link = img.closest('a.imgLink');
                    if (link) {
                        // Extract the full-sized file URL
                        fullFileUrl = link.href;
                        // Extract the file hash (everything after /.media/ up to the extension)
                        const fileHash = fullFileUrl.match(/\/\.media\/([a-f0-9]+)\.[a-z0-9]+$/i);
                        if (fileHash && fileHash[1]) {
                            // Construct the thumbnail URL using the current domain
                            const thumbnailUrl = `${window.location.origin}/.media/t_${fileHash[1]}`;
                            // Replace the spoiler image with the thumbnail
                            img.src = thumbnailUrl;
                        }
                    }
                }
            }
        });
    }

    // Function to fetch the thread page and extract the thumbnail URL
    async function fetchThreadImage(board, threadId) {
        try {
            const response = await fetch(`https://${window.location.host}/${board}/res/${threadId}.html`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            // Find the first image in the thread's OP post
            const imgLink = doc.querySelector('.uploadCell a.imgLink');
            if (imgLink) {
                const fullFileUrl = imgLink.href;
                const fileHash = fullFileUrl.match(/\/\.media\/([a-f0-9]+)\.[a-z0-9]+$/i);
                if (fileHash && fileHash[1]) {
                    return `${window.location.origin}/.media/t_${fileHash[1]}`;
                }
            }
            return null;
        } catch (error) {
            console.error('Error fetching thread image:', error);
            return null;
        }
    }

    // Process existing images on page load
    const isCatalogPage = window.location.pathname.includes('catalog.html');
    if (isCatalogPage) {
        const initialCatalogImages = document.querySelectorAll('.catalogCell a.linkThumb img');
        processImages(initialCatalogImages, true);
    } else {
        const initialThreadImages = document.querySelectorAll('.uploadCell img');
        processImages(initialThreadImages, false);
    }

    // Set up MutationObserver to handle dynamically added posts
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                // Check each added node for new images
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (isCatalogPage) {
                            const newCatalogImages = node.querySelectorAll('.catalogCell a.linkThumb img');
                            processImages(newCatalogImages, true);
                        } else {
                            const newThreadImages = node.querySelectorAll('.uploadCell img');
                            processImages(newThreadImages, false);
                        }
                    }
                });
            }
        });
    });

    // Observe changes to the document body, including child nodes and subtrees
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

//Opening all posts from the catalog in a new tag section

// Add click event listener to catalog thumbnail images
document.addEventListener('click', function(e) {
    // Check if the clicked element is an image inside a catalog cell
    if (e.target.tagName === 'IMG' && e.target.closest('.catalogCell')) {
        // Find the parent link with class 'linkThumb'
        const link = e.target.closest('.linkThumb');
        if (link) {
            // Prevent default link behavior
            e.preventDefault();
            // Open the thread in a new tab
            window.open(link.href, '_blank');
        }
    }
});

//Automatically redirect to catalog section

// Redirect to catalog if on a board's main page, excluding overboard pages
(function() {
    const currentPath = window.location.pathname;
    // Check if the path matches a board's main page (e.g., /v/, /a/) but not overboard pages
    if (currentPath.match(/^\/[a-zA-Z0-9]+\/$/) && !currentPath.match(/^\/(sfw|overboard)\/$/)) {
        // Redirect to the catalog page
        window.location.replace(currentPath + 'catalog.html');
    }
})();

// Text spoiler revealer

(function() {
    // Function to reveal spoilers
    function revealSpoilers() {
        const spoilers = document.querySelectorAll('span.spoiler');
        spoilers.forEach(spoiler => {
            // Override default spoiler styles to make text visible
            spoiler.style.background = 'none';
            spoiler.style.color = 'inherit';
            spoiler.style.textShadow = 'none';
        });
    }

    // Run initially for existing spoilers
    revealSpoilers();

    // Set up MutationObserver to watch for new spoilers
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                // Check if new nodes contain spoilers
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newSpoilers = node.querySelectorAll('span.spoiler');
                        newSpoilers.forEach(spoiler => {
                            spoiler.style.background = 'none';
                            spoiler.style.color = 'inherit';
                            spoiler.style.textShadow = 'none';
                        });
                    }
                });
            }
        });
    });

    // Observe the document body for changes (new posts)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

//Hash navigation
// Add # links to backlinks and quote links for scrolling
(function() {
    // Function to add # link to backlinks and quote links
    function addHashLinks(container = document) {
        const links = container.querySelectorAll('.panelBacklinks a, .altBacklinks a, .divMessage .quoteLink');
        links.forEach(link => {
            // Skip if # link already exists or processed
            if (link.nextSibling && link.nextSibling.classList && link.nextSibling.classList.contains('hash-link-container')) return;
            if (link.dataset.hashProcessed) return;
            // Create # link as a span to avoid <a> processing
            const hashLink = document.createElement('span');
            hashLink.textContent = ' #';
            hashLink.style.cursor = 'pointer';
            hashLink.style.color = '#0000EE'; // Match link color
            hashLink.title = 'Scroll to post';
            hashLink.className = 'hash-link';
            hashLink.dataset.hashListener = 'true'; // Mark as processed
            // Wrap # link in a span to isolate it
            const container = document.createElement('span');
            container.className = 'hash-link-container';
            container.appendChild(hashLink);
            link.insertAdjacentElement('afterend', container);
            link.dataset.hashProcessed = 'true'; // Mark as processed
        });
    }

    // Event delegation for hash link clicks to mimic .linkSelf behavior
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('hash-link')) {
            e.preventDefault();
            e.stopPropagation();
            const link = e.target.closest('.hash-link-container').previousElementSibling;
            const postId = link.textContent.replace('>>', '');
            if (document.getElementById(postId)) {
                window.location.hash = `#${postId}`;
                console.log(`Navigated to post #${postId}`);
            } else {
                console.log(`Post ${postId} not found`);
            }
        }
    }, true);

    // Process existing backlinks and quote links on page load
    addHashLinks();
    console.log('Hash links applied on page load');

    // Patch inline reply logic to apply hash links to new inline content
    if (window.tooltips) {
        // Patch loadTooltip to apply hash links after content is loaded
        const originalLoadTooltip = tooltips.loadTooltip;
        tooltips.loadTooltip = function(element, quoteUrl, sourceId, isInline) {
            originalLoadTooltip.apply(this, arguments);
            if (isInline) {
                // Wait for content to be fully loaded
                setTimeout(() => {
                    addHashLinks(element);
                    console.log('Hash links applied to loaded tooltip content:', quoteUrl);
                }, 0);
            }
        };

        // Patch addLoadedTooltip to ensure hash links are applied
        const originalAddLoadedTooltip = tooltips.addLoadedTooltip;
        tooltips.addLoadedTooltip = function(htmlContents, tooltip, quoteUrl, replyId, isInline) {
            originalAddLoadedTooltip.apply(this, arguments);
            if (isInline) {
                addHashLinks(htmlContents);
                console.log('Hash links applied to inline tooltip content:', quoteUrl);
            }
        };

        // Patch addInlineClick to apply hash links after appending
        const originalAddInlineClick = tooltips.addInlineClick;
        tooltips.addInlineClick = function(quote, innerPost, isBacklink, quoteTarget, sourceId) {
            if (!quote.href || quote.classList.contains('hash-link') || quote.closest('.hash-link-container') || quote.href.includes('#q')) {
                console.log('Skipped invalid or hash link:', quote.href || quote.textContent);
                return;
            }
            // Clone quote to remove existing listeners
            const newQuote = quote.cloneNode(true);
            quote.parentNode.replaceChild(newQuote, quote);
            quote = newQuote;

            // Reapply hover events
            tooltips.addHoverEvents(quote, innerPost, quoteTarget, sourceId);
            console.log('Hover events reapplied for:', quoteTarget.quoteUrl);

            // Add click handler
            quote.addEventListener('click', function(e) {
                console.log('linkQuote clicked:', quoteTarget.quoteUrl);
                if (!tooltips.inlineReplies) {
                    console.log('inlineReplies disabled');
                    return;
                }
                e.preventDefault();
                e.stopPropagation();

                // Find or create replyPreview
                let replyPreview = innerPost.querySelector('.replyPreview');
                if (!replyPreview) {
                    replyPreview = document.createElement('div');
                    replyPreview.className = 'replyPreview';
                    innerPost.appendChild(replyPreview);
                }

                // Check for duplicates or loading
                if (tooltips.loadingPreviews[quoteTarget.quoteUrl] ||
                    tooltips.quoteAlreadyAdded(quoteTarget.quoteUrl, innerPost)) {
                    console.log('Duplicate or loading:', quoteTarget.quoteUrl);
                    return;
                }

                // Create and load inline post
                const placeHolder = document.createElement('div');
                placeHolder.style.whiteSpace = 'normal';
                placeHolder.className = 'inlineQuote';
                tooltips.loadTooltip(placeHolder, quoteTarget.quoteUrl, sourceId, true);

                // Verify post loaded
                if (!placeHolder.querySelector('.linkSelf')) {
                    console.log('Failed to load post:', quoteTarget.quoteUrl);
                    return;
                }

                // Add close button
                const close = document.createElement('a');
                close.innerText = 'X';
                close.className = 'closeInline';
                close.onclick = () => placeHolder.remove();
                placeHolder.querySelector('.postInfo').prepend(close);

                // Process quotes in the new inline post
                Array.from(placeHolder.querySelectorAll('.linkQuote'))
                    .forEach(a => tooltips.processQuote(a, false, true));

                if (tooltips.bottomBacklinks) {
                    const alts = placeHolder.querySelector('.altBacklinks');
                    if (alts && alts.firstChild) {
                        Array.from(alts.firstChild.children)
                            .forEach(a => tooltips.processQuote(a, true));
                    }
                }

                // Append to replyPreview and apply hash links
                replyPreview.appendChild(placeHolder);
                addHashLinks(placeHolder);
                console.log('Inline post appended and hash links applied:', quoteTarget.quoteUrl);

                tooltips.removeIfExists();
            }, true);
        };

        // Patch processQuote to skip hash links
        const originalProcessQuote = tooltips.processQuote;
        tooltips.processQuote = function(quote, isBacklink) {
            if (!quote.href || quote.classList.contains('hash-link') || quote.closest('.hash-link-container') || quote.href.includes('#q')) {
                console.log('Skipped invalid or hash link in processQuote:', quote.href || quote.textContent);
                return;
            }
            originalProcessQuote.apply(this, arguments);
        };
    }

    // Set up MutationObserver to handle dynamically added or updated backlinks and quote links
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check for new backlink or quote link <a> elements
                        const newLinks = node.matches('.panelBacklinks a, .altBacklinks a, .divMessage .quoteLink') ? [node] : node.querySelectorAll('.panelBacklinks a, .altBacklinks a, .divMessage .quoteLink');
                        newLinks.forEach(link => {
                            addHashLinks(link.parentElement);
                            console.log('Hash links applied to new link:', link.textContent);
                        });
                    }
                });
            }
        });
    });

    // Observe changes to the posts container
    const postsContainer = document.querySelector('.divPosts') || document.body;
    observer.observe(postsContainer, {
        childList: true,
        subtree: true
    });
})();
//--Hash navigation

//Inline reply chains

(function() {
    'use strict';

    console.log('Userscript is running');

    // Add CSS for visual nesting
    const style = document.createElement('style');
    style.innerHTML = `
        .inlineQuote .replyPreview {
            margin-left: 20px;
            border-left: 1px solid #ccc;
            padding-left: 10px;
        }
        .closeInline {
            color: #ff0000;
            cursor: pointer;
            margin-left: 5px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Wait for tooltips to initialize
    window.addEventListener('load', function() {
        if (!window.tooltips) {
            console.error('tooltips module not found');
            return;
        }
        console.log('tooltips module found');

        // Ensure Inline Replies is enabled
        if (!tooltips.inlineReplies) {
            console.log('Enabling Inline Replies');
            localStorage.setItem('inlineReplies', 'true');
            tooltips.inlineReplies = true;

            // Check and update the checkbox, retrying if not yet loaded
            const enableCheckbox = () => {
                const inlineCheckbox = document.getElementById('settings-SW5saW5lIFJlcGxpZX');
                if (inlineCheckbox) {
                    inlineCheckbox.checked = true;
                    console.log('Inline Replies checkbox checked');
                    return true;
                }
                console.warn('Inline Replies checkbox not found, retrying...');
                return false;
            };

            // Try immediately
            if (!enableCheckbox()) {
                // Retry every 500ms up to 5 seconds
                let attempts = 0;
                const maxAttempts = 10;
                const interval = setInterval(() => {
                    if (enableCheckbox() || attempts >= maxAttempts) {
                        clearInterval(interval);
                        if (attempts >= maxAttempts) {
                            console.error('Failed to find Inline Replies checkbox after retries');
                        }
                    }
                    attempts++;
                }, 500);
            }
        } else {
            console.log('Inline Replies already enabled');
        }

        // Override addLoadedTooltip to ensure replyPreview exists
        const originalAddLoadedTooltip = tooltips.addLoadedTooltip;
        tooltips.addLoadedTooltip = function(htmlContents, tooltip, quoteUrl, replyId, isInline) {
            console.log('addLoadedTooltip called for:', quoteUrl);
            originalAddLoadedTooltip.apply(this, arguments);
            if (isInline) {
                let replyPreview = htmlContents.querySelector('.replyPreview');
                if (!replyPreview) {
                    replyPreview = document.createElement('div');
                    replyPreview.className = 'replyPreview';
                    htmlContents.appendChild(replyPreview);
                }
            }
        };

        // Override addInlineClick for nested replies, excluding post number links
        tooltips.addInlineClick = function(quote, innerPost, isBacklink, quoteTarget, sourceId) {
            // Skip post number links (href starts with #q)
            if (quote.href.includes('#q')) {
                console.log('Skipping post number link:', quote.href);
                return;
            }

            // Remove existing listeners by cloning
            const newQuote = quote.cloneNode(true);
            quote.parentNode.replaceChild(newQuote, quote);
            quote = newQuote;

            // Reapply hover events to preserve preview functionality
            tooltips.addHoverEvents(quote, innerPost, quoteTarget, sourceId);
            console.log('Hover events reapplied for:', quoteTarget.quoteUrl);

            // Add click handler
            quote.addEventListener('click', function(e) {
                console.log('linkQuote clicked:', quoteTarget.quoteUrl);
                if (!tooltips.inlineReplies) {
                    console.log('inlineReplies disabled');
                    return;
                }
                e.preventDefault();
                e.stopPropagation(); // Prevent site handlers

                // Find or create replyPreview
                let replyPreview = innerPost.querySelector('.replyPreview');
                if (!replyPreview) {
                    replyPreview = document.createElement('div');
                    replyPreview.className = 'replyPreview';
                    innerPost.appendChild(replyPreview);
                }

                // Check for duplicates or loading
                if (tooltips.loadingPreviews[quoteTarget.quoteUrl] ||
                    tooltips.quoteAlreadyAdded(quoteTarget.quoteUrl, innerPost)) {
                    console.log('Duplicate or loading:', quoteTarget.quoteUrl);
                    return;
                }

                // Create and load inline post
                const placeHolder = document.createElement('div');
                placeHolder.style.whiteSpace = 'normal';
                placeHolder.className = 'inlineQuote';
                tooltips.loadTooltip(placeHolder, quoteTarget.quoteUrl, sourceId, true);

                // Verify post loaded
                if (!placeHolder.querySelector('.linkSelf')) {
                    console.log('Failed to load post:', quoteTarget.quoteUrl);
                    return;
                }

                // Add close button
                const close = document.createElement('a');
                close.innerText = 'X';
                close.className = 'closeInline';
                close.onclick = () => placeHolder.remove();
                placeHolder.querySelector('.postInfo').prepend(close);

                // Process quotes in the new inline post
                Array.from(placeHolder.querySelectorAll('.linkQuote'))
                    .forEach(a => tooltips.processQuote(a, false, true));

                if (tooltips.bottomBacklinks) {
                    const alts = placeHolder.querySelector('.altBacklinks');
                    if (alts && alts.firstChild) {
                        Array.from(alts.firstChild.children)
                            .forEach(a => tooltips.processQuote(a, true));
                    }
                }

                // Append to replyPreview
                replyPreview.appendChild(placeHolder);
                console.log('Inline post appended:', quoteTarget.quoteUrl);

                tooltips.removeIfExists();
            }, true); // Use capture phase
        };

        // Reprocess all existing linkQuote and backlink elements, excluding post numbers
        console.log('Reprocessing linkQuote elements');
        const quotes = document.querySelectorAll('.linkQuote, .panelBacklinks a');
        quotes.forEach(quote => {
            const innerPost = quote.closest('.innerPost, .innerOP');
            if (!innerPost) {
                console.log('No innerPost found for quote:', quote.href);
                return;
            }

            // Skip post number links
            if (quote.href.includes('#q')) {
                console.log('Skipping post number link:', quote.href);
                return;
            }

            const isBacklink = quote.parentElement.classList.contains('panelBacklinks') ||
                               quote.parentElement.classList.contains('altBacklinks');
            const quoteTarget = api.parsePostLink(quote.href);
            const sourceId = api.parsePostLink(innerPost.querySelector('.linkSelf').href).post;

            tooltips.addInlineClick(quote, innerPost, isBacklink, quoteTarget, sourceId);
        });

        // Observe for dynamically added posts
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    const newQuotes = node.querySelectorAll('.linkQuote, .panelBacklinks a');
                    newQuotes.forEach(quote => {
                        if (quote.dataset.processed || quote.href.includes('#q')) {
                            if (quote.href.includes('#q')) {
                                console.log('Skipping post number link:', quote.href);
                            }
                            return;
                        }
                        quote.dataset.processed = 'true';
                        const innerPost = quote.closest('.innerPost, .innerOP');
                        if (!innerPost) return;

                        const isBacklink = quote.parentElement.classList.contains('panelBacklinks') ||
                                           quote.parentElement.classList.contains('altBacklinks');
                        const quoteTarget = api.parsePostLink(quote.href);
                        const sourceId = api.parsePostLink(innerPost.querySelector('.linkSelf').href).post;

                        tooltips.addInlineClick(quote, innerPost, isBacklink, quoteTarget, sourceId);
                    });
                });
            });
        });
        observer.observe(document.querySelector('.divPosts') || document.body, {
            childList: true,
            subtree: true
        });
        console.log('MutationObserver set up');
    });
})();

//--Inline replies

//Auto TOS Accept with Delay
(function() {
    'use strict';

    // Check if on the disclaimer page
    if (window.location.pathname === '/.static/pages/disclaimer.html') {
        // Redirect to confirmed page after 1-second delay
        setTimeout(() => {
            window.location.replace('.static/pages/confirmed.html');
            console.log('Automatically redirected from disclaimer to confirmed page after 1-second delay');
        }, 1000);
    }
})();
//--Auto TOS Accept with Delay

//Media Auto-Preview
// Auto-preview images and videos on hover for un-expanded thumbnails, disabling native hover
(function() {
    'use strict';

    // Disable native hover preview
    localStorage.setItem('hoveringImage', 'false'); // Disable "Image Preview on Hover" setting
    if (window.thumbs && typeof window.thumbs.removeHoveringExpand === 'function') {
        window.thumbs.removeHoveringExpand(); // Remove native hover listeners
    }
    // Override addHoveringExpand to prevent re-enabling
    if (window.thumbs) {
        window.thumbs.addHoveringExpand = function() {
            // Do nothing to prevent native hover preview
            console.log('Native hover preview (addHoveringExpand) blocked by userscript');
        };
    }

    // Supported file extensions for images and videos
    const supportedExtensions = {
        image: ['.gif', '.webp', '.png', '.jfif', '.pjpeg', '.jpeg', '.pjp', '.jpg', '.bmp', '.dib', '.svgz', '.svg'],
        video: ['.webm', '.m4v', '.mp4', '.ogm', '.ogv', '.avi', '.asx', '.mpg', '.mpeg']
    };

    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.style.position = 'fixed';
    previewContainer.style.zIndex = '1000';
    previewContainer.style.pointerEvents = 'none'; // Allow clicks to pass through
    previewContainer.style.display = 'none';
    document.body.appendChild(previewContainer);

    // Function to check if URL is a supported image or video
    function isSupportedMedia(url) {
        const ext = (url.match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase();
        return supportedExtensions.image.includes(ext) || supportedExtensions.video.includes(ext);
    }

    // Function to check if URL is a video
    function isVideo(url) {
        const ext = (url.match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase();
        return supportedExtensions.video.includes(ext);
    }

    // Function to check if link is in un-expanded state
    function isUnexpanded(link) {
        const thumbnail = link.querySelector('img:not(.imgExpanded)');
        const expanded = link.querySelector('img.imgExpanded');
        return thumbnail && window.getComputedStyle(thumbnail).display !== 'none' &&
               (!expanded || window.getComputedStyle(expanded).display === 'none');
    }

    // Function to calculate preview dimensions
    function getPreviewDimensions(naturalWidth, naturalHeight) {
        // Detect zoom level
        const zoomLevel = window.devicePixelRatio || 1; // Fallback to 1 if undefined
        // Content area (excludes scrollbar) for max size
        const maxWidth = document.documentElement.clientWidth;
        const maxHeight = document.documentElement.clientHeight;
        // Screen resolution for small media check
        const screenWidth = window.screen.width || 1920; // Fallback to 1920
        const screenHeight = window.screen.height || 1080; // Fallback to 1080

        // If media fits within screen resolution, use full native size
        if (naturalWidth <= screenWidth && naturalHeight <= screenHeight) {
            let width = naturalWidth;
            let height = naturalHeight;

            // If native size exceeds content area, scale down
            const scaleByWidth = maxWidth / width;
            const scaleByHeight = maxHeight / height;
            const scale = Math.min(scaleByWidth, scaleByHeight, 1);
            width = Math.round(width * scale);
            height = Math.round(height * scale);

            return { width, height };
        }

        // Otherwise, adjust for zoom and scale to fit content area
        let width = naturalWidth / zoomLevel;
        let height = naturalHeight / zoomLevel;

        const scaleByWidth = maxWidth / width;
        const scaleByHeight = maxHeight / height;
        const scale = Math.min(scaleByWidth, scaleByHeight, 1);
        width = Math.round(width * scale);
        height = Math.round(height * scale);

        return { width, height };
    }

    // Function to position preview near cursor
    function positionPreview(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const previewWidth = previewContainer.offsetWidth;
        const previewHeight = previewContainer.offsetHeight;

        // Skip if dimensions are not yet available
        if (previewWidth === 0 || previewHeight === 0) {
            return;
        }

        // Use content area for positioning (excludes scrollbar)
        const maxWidth = document.documentElement.clientWidth;
        const maxHeight = document.documentElement.clientHeight;

        // Calculate centered position
        const centerX = (maxWidth - previewWidth) / 2;
        const centerY = (maxHeight - previewHeight) / 2;

        // Allow cursor to influence position with a bounded offset
        const maxOffset = 100; // Maximum pixels to shift from center
        const cursorOffsetX = Math.max(-maxOffset, Math.min(maxOffset, mouseX - maxWidth / 2));
        const cursorOffsetY = Math.max(-maxOffset, Math.min(maxOffset, mouseY - maxHeight / 2));

        // Calculate initial position with cursor influence
        let left = centerX + cursorOffsetX;
        let top = centerY + cursorOffsetY;

        // Ensure preview stays fully within content area
        left = Math.max(0, Math.min(left, maxWidth - previewWidth));
        top = Math.max(0, Math.min(top, maxHeight - previewHeight));

        previewContainer.style.left = `${left}px`;
        previewContainer.style.top = `${top}px`;
    }

    // Function to show preview
    function showPreview(link, event) {
        if (!isUnexpanded(link)) return; // Skip if expanded
        const url = link.href;
        if (!isSupportedMedia(url)) return;

        // Clear existing preview
        previewContainer.innerHTML = '';

        if (isVideo(url)) {
            // Create video element
            const video = document.createElement('video');
            video.src = url;
            video.autoplay = true;
            video.muted = false; // Play with audio
            video.loop = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '100%';

            // Set dimensions and position when metadata is loaded
            video.onloadedmetadata = () => {
                const { width, height } = getPreviewDimensions(video.videoWidth, video.videoHeight);
                video.width = width;
                video.height = height;
                previewContainer.style.width = `${width}px`;
                previewContainer.style.height = `${height}px`;
                previewContainer.style.display = 'block'; // Show after dimensions are set
                positionPreview(event);
            };

            previewContainer.appendChild(video);
        } else {
            // Create image element
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';

            // Set dimensions and position when image is loaded
            img.onload = () => {
                const { width, height } = getPreviewDimensions(img.naturalWidth, img.naturalHeight);
                img.width = width;
                img.height = height;
                previewContainer.style.width = `${width}px`;
                previewContainer.style.height = `${height}px`;
                previewContainer.style.display = 'block'; // Show after dimensions are set
                positionPreview(event);
            };

            previewContainer.appendChild(img);
        }
    }

    // Function to hide preview
    function hidePreview() {
        previewContainer.style.display = 'none';
        // Stop video playback
        const video = previewContainer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        previewContainer.innerHTML = '';
    }

    // Function to apply hover events to links
    function applyHoverEvents(container = document) {
        const links = container.querySelectorAll('.uploadCell a.imgLink');
        links.forEach(link => {
            // Skip if already processed
            if (link.dataset.previewProcessed) return;
            link.dataset.previewProcessed = 'true';

            link.addEventListener('mouseenter', (e) => {
                showPreview(link, e);
            });

            link.addEventListener('mousemove', (e) => {
                if (previewContainer.style.display === 'block') {
                    positionPreview(e);
                }
            });

            link.addEventListener('mouseleave', () => {
                hidePreview();
            });

            // Hide preview on click if expanded
            link.addEventListener('click', () => {
                if (!isUnexpanded(link)) {
                    hidePreview();
                }
            });
        });
    }

    // Apply hover events to existing links on page load
    applyHoverEvents();
    console.log('Media preview events applied on page load');

    // Patch inline reply logic to apply hover events to new inline content
    if (window.tooltips) {
        // Patch loadTooltip to apply hover events after content is loaded
        const originalLoadTooltip = tooltips.loadTooltip;
        tooltips.loadTooltip = function(element, quoteUrl, sourceId, isInline) {
            originalLoadTooltip.apply(this, arguments);
            if (isInline) {
                setTimeout(() => {
                    applyHoverEvents(element);
                    console.log('Media preview events applied to loaded tooltip content:', quoteUrl);
                }, 0);
            }
        };

        // Patch addLoadedTooltip to ensure hover events are applied
        const originalAddLoadedTooltip = tooltips.addLoadedTooltip;
        tooltips.addLoadedTooltip = function(htmlContents, tooltip, quoteUrl, replyId, isInline) {
            originalAddLoadedTooltip.apply(this, arguments);
            if (isInline) {
                applyHoverEvents(htmlContents);
                console.log('Media preview events applied to inline tooltip content:', quoteUrl);
            }
        };
    }

    // Set up MutationObserver to handle dynamically added posts
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Handle new posts and inline replies
                        const newLinks = node.matches('.uploadCell a.imgLink') ? [node] : node.querySelectorAll('.uploadCell a.imgLink');
                        newLinks.forEach(link => {
                            applyHoverEvents(link.parentElement);
                            console.log('Media preview events applied to new link:', link.href);
                        });
                    }
                });
            }
        });
    });

    // Observe changes to the posts container
    const postsContainer = document.querySelector('.divPosts') || document.body;
    observer.observe(postsContainer, {
        childList: true,
        subtree: true
    });
})();
//--Media Auto-Preview

//Post Age Tooltip
// Show a tooltip with time elapsed since post when hovering over date/time
(function() {
    'use strict';

    // Create tooltip container
    const tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.zIndex = '1000';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // Parse timestamp (e.g., "04/16/2025 (Wed) 21:23:21")
    function parseTimestamp(text) {
        const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4}).*?(\d{2}):(\d{2}):(\d{2})$/);
        if (!match) return null;
        const [, month, day, year, hours, minutes, seconds] = match;
        const isoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        const date = new Date(isoString);
        return isNaN(date.getTime()) ? null : date;
    }

    // Format elapsed time
    function formatElapsedTime(postDate) {
        const now = new Date();
        const diffMs = now - postDate;
        if (diffMs < 0) return 'Just now';

        const diffSeconds = Math.floor(diffMs / 1000);
        if (diffSeconds < 60) {
            return `${diffSeconds} second${diffSeconds === 1 ? '' : 's'} ago`;
        }

        const diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
        }

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            const remainingMinutes = diffMinutes % 60;
            return `${diffHours} hour${diffHours === 1 ? '' : 's'} and ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'} ago`;
        }

        const diffDays = Math.floor(diffHours / 24);
        const remainingHours = diffHours % 24;
        return `${diffDays} day${diffDays === 1 ? '' : 's'} and ${remainingHours} hour${remainingHours === 1 ? '' : 's'} ago`;
    }

    // Position tooltip above element
    function positionTooltip(event, element) {
        const rect = element.getBoundingClientRect();
        const left = event.clientX;
        const top = rect.top - tooltip.offsetHeight - 5;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    // Show tooltip
    function showTooltip(element, event) {
        const postDate = parseTimestamp(element.textContent);
        if (!postDate) {
            tooltip.style.display = 'none';
            return;
        }

        tooltip.textContent = formatElapsedTime(postDate);
        tooltip.style.display = 'block';
        positionTooltip(event, element);
    }

    // Hide tooltip
    function hideTooltip() {
        tooltip.style.display = 'none';
    }

    // Apply tooltip events to labelCreated elements
    function applyTooltipEvents(container = document) {
        const dateSpans = container.querySelectorAll('span.labelCreated');
        dateSpans.forEach(span => {
            // Remove existing listeners to avoid duplicates
            span.removeEventListener('mouseenter', showTooltip);
            span.removeEventListener('mouseleave', hideTooltip);

            span.addEventListener('mouseenter', (e) => {
                showTooltip(span, e);
            });

            span.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        });
    }

    // Apply tooltip events on page load
    applyTooltipEvents();
    console.log('Post age tooltip events applied on page load');

    // Patch inline reply logic
    if (window.tooltips) {
        const originalLoadTooltip = tooltips.loadTooltip;
        tooltips.loadTooltip = function(element, quoteUrl, sourceId, isInline) {
            originalLoadTooltip.apply(this, arguments);
            if (isInline) {
                setTimeout(() => {
                    applyTooltipEvents(element);
                    console.log('Post age tooltip events applied to loaded tooltip content:', quoteUrl);
                }, 0);
            }
        };

        const originalAddLoadedTooltip = tooltips.addLoadedTooltip;
        tooltips.addLoadedTooltip = function(htmlContents, tooltip, quoteUrl, replyId, isInline) {
            originalAddLoadedTooltip.apply(this, arguments);
            if (isInline) {
                applyTooltipEvents(htmlContents);
                console.log('Post age tooltip events applied to inline tooltip content:', quoteUrl);
            }
        };
    }

//Force-Enable Local Times
(function() {
    'use strict';
    localStorage.setItem('localTime', 'true');
    console.log('Local Times setting enabled');
})();

    // MutationObserver for dynamically added posts
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newSpans = node.matches('span.labelCreated') ? [node] : node.querySelectorAll('span.labelCreated');
                        newSpans.forEach(span => {
                            applyTooltipEvents(span.parentElement);
                            console.log('Post age tooltip events applied to new span:', span.textContent);
                        });
                    }
                });
            }
        });
    });

    // Observe posts container
    const postsContainer = document.querySelector('.divPosts') || document.body;
    observer.observe(postsContainer, {
        childList: true,
        subtree: true
    });
})();
//--Post Age Tooltip

//Last Read Post Tracker
(function() {
    'use strict';

    // Only run on thread pages (e.g., /vyt/res/24600.html)
    if (!window.location.pathname.match(/\/res\/\d+\.html$/)) {
        console.log('Not a thread page, exiting Last Read Post Tracker');
        return;
    }

    // Get thread ID from URL (e.g., "24600" from /vyt/res/24600.html)
    const threadIdMatch = window.location.pathname.match(/(\d+)\.html$/);
    if (!threadIdMatch) {
        console.error('Could not extract thread ID from URL:', window.location.pathname);
        return;
    }
    const threadId = threadIdMatch[1];

    // Load last read posts from localStorage
    let lastReadPosts = {};
    try {
        lastReadPosts = JSON.parse(localStorage.getItem('lastReadPosts') || '{}');
    } catch (e) {
        console.error('Failed to parse lastReadPosts from localStorage:', e);
    }
    let lastReadPostId = lastReadPosts[threadId] || null;
    let currentArrow = null;

    // Throttle function to limit scroll event frequency
    function throttle(fn, wait) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= wait) {
                lastCall = now;
                fn(...args);
            }
        };
    }

    // Add arrow to a post (only called on page load)
    function addArrow(postContainer) {
        if (currentArrow) {
            currentArrow.remove();
            currentArrow = null;
        }
        const postInfo = postContainer.querySelector('.postInfo.title');
        if (!postInfo) {
            console.error('postInfo.title not found in postContainer:', postContainer.outerHTML);
            return;
        }
        const arrow = document.createElement('span');
        arrow.textContent = '→';
        arrow.style.color = '#ff0000';
        arrow.style.marginLeft = '5px';
        postInfo.appendChild(arrow);
        currentArrow = arrow;
        console.log(`Added arrow to post on load: ${postContainer.id || postContainer.className}`);
    }

    // Update last read post based on scroll position (no arrow during scroll)
    function updateLastReadPost() {
        const posts = document.querySelectorAll('.postCell, .postContainer');
        if (!posts.length) {
            console.warn('No post elements found. Available classes:',
                Array.from(document.querySelectorAll('[class*="post"], [class*="reply"]'))
                    .map(el => el.className)
                    .filter((v, i, a) => a.indexOf(v) === i));
            // Retry after a short delay if no posts are found
            setTimeout(() => requestAnimationFrame(updateLastReadPost), 500);
            return;
        }

        let newLastReadPostId = lastReadPostId;
        posts.forEach(post => {
            const rect = post.getBoundingClientRect();
            // Extract post ID from id or linkQuote
            let postId = post.id.match(/^(?:pc|p|post-)?(\d+)$/)?.[1];
            if (!postId) {
                const linkQuote = post.querySelector('.linkQuote');
                postId = linkQuote?.textContent.trim().replace('>>', '') || null;
            }
            if (!postId) {
                console.warn('Could not extract post ID from:', post.outerHTML);
                return;
            }
            // Consider post read if its top is above viewport center and visible
            if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
                newLastReadPostId = postId;
            }
        });

        if (newLastReadPostId && newLastReadPostId !== lastReadPostId) {
            lastReadPostId = newLastReadPostId;
            console.log(`Tracked last read post for thread ${threadId}: ${lastReadPostId} (no arrow)`);
        }
    }

    // Save last read post to localStorage when leaving the thread
    function saveLastReadPost() {
        if (lastReadPostId) {
            lastReadPosts[threadId] = lastReadPostId;
            try {
                localStorage.setItem('lastReadPosts', JSON.stringify(lastReadPosts));
                console.log(`Saved last read post for thread ${threadId}: ${lastReadPostId}`);
            } catch (e) {
                console.error('Failed to save lastReadPosts to localStorage:', e);
            }
        }
    }

// Scroll to last read post on load and show arrow (MODIFIED for v2.5.2 base)
    function scrollToLastReadPost() {
        // --- Check for conditions where we should NOT scroll to the stored last read post ---
        const currentHash = window.location.hash;
        const referrer = document.referrer; // Check referrer
        // Check if referrer is from an overboard page
        const isFromOverboard = referrer.includes('/overboard') || referrer.includes('/sfw');
        // Check if the hash targets a specific post (e.g., #12345)
        const hasPostHash = currentHash.match(/^#(\d+)$/);

        // Condition 1: Came from overboard AND there's a specific post hash (#postId)
        if (hasPostHash && isFromOverboard) {
            console.log('[Last Read Tracker] Overboard navigation with post hash detected. Skipping scroll to last read post. Allowing default browser scroll.');
            // Let the browser handle the scroll based on the hash.
            // The Shared Link Handler below will also see this hash but might refine scroll/clear hash later if needed.
            return; // Exit without scrolling to stored position
        }

        // Condition 2: Page loaded with a specific post hash (#postId), even if not from overboard
        // This check prevents this module from overriding the Shared Link Handler's job,
        // which should handle scrolling to the *target* post ID in this case.
        if (hasPostHash && !isFromOverboard) {
             console.log('[Last Read Tracker] Initial post hash detected (not from overboard). Skipping scroll to stored last read post (handled by Shared Link Handler).');
             return; // Exit without scrolling to stored position
        }

        // --- If neither condition above was met, proceed with original logic ---
        // Check if we have a stored lastReadPostId for this thread
        if (lastReadPostId) {
            // Find the post container using the lastReadPostId FROM STORAGE
            // Original querySelector from v2.5.2:
            const postContainer = document.querySelector(`[id="pc${lastReadPostId}"], [id="p${lastReadPostId}"], [id="post-${lastReadPostId}"], .postCell .linkQuote[href*="${lastReadPostId}"], .postContainer .linkQuote[href*="${lastReadPostId}"]`)?.closest('.postCell, .postContainer');

            if (postContainer) {
                // Scroll to the *stored* last read post because no initial #postId hash was present
                postContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                addArrow(postContainer); // Add arrow only when scrolling to stored position
                console.log(`[Last Read Tracker] Scrolled to stored last read post: ${lastReadPostId}`);
            } else {
                // Post container not found in DOM yet, maybe retry
                console.warn(`[Last Read Tracker] Stored last read post container for ID ${lastReadPostId} not found, retrying in 500ms...`);
                // Retry only if the DOM might still be loading (don't retry indefinitely if Conditions 1 or 2 were met earlier)
                 setTimeout(scrollToLastReadPost, 500);
            }
        } else {
            // No stored last read post ID for this thread
            console.log('[Last Read Tracker] No stored last read post found for thread:', threadId);
        }
    }

    // Wait for DOM to be fully ready
    function initialize() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            scrollToLastReadPost();
            // Attach throttled scroll handler using requestAnimationFrame
            const throttledUpdate = throttle(() => requestAnimationFrame(updateLastReadPost), 200);
            window.addEventListener('scroll', throttledUpdate);
            // Log DOM state for debugging
            console.log('Initial post elements found:', document.querySelectorAll('.postCell, .postContainer').length);
        } else {
            setTimeout(initialize, 100); // Retry until DOM is ready
        }
    }

    // Start initialization
    initialize();

    // Save last read post when leaving the thread
    window.addEventListener('beforeunload', saveLastReadPost);

    console.log('Last Read Post Tracker initialized for thread', threadId);
})();
//--Last Read Post Tracker

//Post Number Click Hash Purge
(function() {
    'use strict';

    // Event delegation for post number clicks (.linkQuote with #q<postId> in .postInfo.title)
    document.addEventListener('click', function(e) {
        const link = e.target.closest('.postInfo.title .linkQuote[href*="#q"]');
        if (link) {
            e.preventDefault(); // Block qr.js's default hash-setting
            e.stopPropagation(); // Stop other handlers
            const postId = link.href.match(/#q(\d+)/)?.[1];
            if (!postId) {
                console.warn('Could not extract post ID from link:', link.href);
                return;
            }
            const post = document.getElementById(postId);
            if (!post) {
                console.warn(`Post ${postId} not found for quick reply`);
                return;
            }

            // Preserve current scroll position
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            console.log(`Preserving scroll position: x=${scrollX}, y=${scrollY}`);

            // Temporarily block scrollIntoView to prevent qr.js scrolling
            const originalScrollIntoView = Element.prototype.scrollIntoView;
            Element.prototype.scrollIntoView = function() {
                console.log(`Blocked scrollIntoView for post ${postId} during click`);
            };

            // Manually trigger quick reply
            if (window.qr && typeof window.qr.showQr === 'function') {
                window.qr.showQr(postId);
                // Restore scrollIntoView
                Element.prototype.scrollIntoView = originalScrollIntoView;
                // Clear any hash using only history.replaceState
                history.replaceState(null, '', window.location.pathname);
                // Ensure no residual hash
                if (window.location.hash) {
                    console.log(`Residual hash detected: ${window.location.hash}, clearing`);
                    history.replaceState(null, '', window.location.pathname);
                }
                // Restore scroll position to counter any changes
                window.scrollTo(scrollX, scrollY);
                console.log(`Post number click #q${postId}, opened quick reply, cleared hash, restored scroll: x=${scrollX}, y=${scrollY}`);
            } else {
                console.warn('qr.showQr not available, falling back to default behavior');
                // Allow default behavior if qr.js is unavailable
                Element.prototype.scrollIntoView = originalScrollIntoView;
                window.location.hash = `#q${postId}`;
            }
        }
    }, true);
})();
//--Post Number Click Hash Purge

//Quick Reply Clear Button
(function() {
    'use strict';

    // Function to add Clear button to quick reply form
    function addClearButton() {
        const qrForm = document.querySelector('#quick-reply');
        if (!qrForm) {
            console.log('Quick reply form not found');
            return;
        }

        // Check if Clear button already exists
        if (qrForm.querySelector('.qr-clear-button')) {
            console.log('Clear button already added');
            return;
        }

        // Create Clear button
        const clearButton = document.createElement('button');
        clearButton.type = 'button'; // Prevent form submission
        clearButton.className = 'qr-clear-button';
        clearButton.textContent = 'Clear';
        clearButton.style.marginLeft = '5px';
        clearButton.style.padding = '2px 6px';
        clearButton.style.cursor = 'pointer';
        clearButton.style.border = '1px solid';
        clearButton.style.borderRadius = '3px';

        // Add click handler to clear all fields
        clearButton.addEventListener('click', () => {
            const qrBody = qrForm.querySelector('#qrbody');
            const qrName = qrForm.querySelector('#qrname');
            const qrSubject = qrForm.querySelector('#qrsubject');
            if (qrBody) qrBody.value = '';
            if (qrName) qrName.value = '';
            if (qrSubject) qrSubject.value = '';
            console.log('Cleared all quick reply fields');
        });

        // Insert button after the submit button or at the end of the form
        const submitButton = qrForm.querySelector('input[type="submit"]');
        if (submitButton) {
            submitButton.insertAdjacentElement('afterend', clearButton);
        } else {
            qrForm.appendChild(clearButton);
        }
        console.log('Added Clear button to quick reply form');
    }

    // Function to clear message body only
    function clearMessageBody() {
        const qrBody = document.querySelector('#qrbody');
        if (qrBody) {
            qrBody.value = '';
            console.log('Cleared quick reply message body');
        } else {
            console.log('Quick reply message body not found');
        }
    }

    // Track quick reply display state
    let isQrVisible = document.querySelector('#quick-reply') && window.getComputedStyle(document.querySelector('#quick-reply')).display !== 'none';

    // Observe quick reply form for display changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const qrForm = document.querySelector('#quick-reply');
                if (!qrForm) return;
                const isNowVisible = window.getComputedStyle(qrForm).display !== 'none';
                if (isNowVisible && !isQrVisible) {
                    // Quick reply opened
                    addClearButton();
                    console.log('Quick reply opened, added Clear button');
                } else if (!isNowVisible && isQrVisible) {
                    // Quick reply closed
                    clearMessageBody();
                }
                isQrVisible = isNowVisible;
            }
        });
    });

    // Start observing the quick reply form (if it exists)
    const qrForm = document.querySelector('#quick-reply');
    if (qrForm) {
        observer.observe(qrForm, {
            attributes: true,
            attributeFilter: ['style']
        });
        // Initial check
        if (window.getComputedStyle(qrForm).display !== 'none') {
            addClearButton();
            isQrVisible = true;
        }
    }

    // Handle direct close button clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.close-btn')) {
            clearMessageBody();
        }
    }, true);

    console.log('Quick Reply Clear Button initialized');
})();
//--Quick Reply Clear Button

//Hash Quote Click Hash Purge
(function() {
    'use strict';

    // Event delegation for hash quote clicks (.hash-link)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('hash-link')) {
            e.preventDefault(); // Block original Hash navigation handler
            e.stopPropagation(); // Stop other handlers
            const link = e.target.closest('.hash-link-container').previousElementSibling;
            if (!link || !link.textContent.startsWith('>>')) {
                console.warn('Invalid hash link or no associated quote:', e.target);
                return;
            }
            const postId = link.textContent.replace('>>', '');
            const post = document.getElementById(postId);
            if (!post) {
                console.warn(`Post ${postId} not found for hash quote navigation`);
                return;
            }

            // Preserve current scroll position as fallback
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            console.log(`Preserving scroll position for hash quote: x=${scrollX}, y=${scrollY}`);

            // Scroll to post
            post.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Set hash temporarily to trigger scroll (if needed by browser)
            window.location.hash = `#${postId}`;
            // Immediately clear hash
            history.replaceState(null, '', window.location.pathname);
            // Ensure no residual hash
            if (window.location.hash) {
                console.log(`Residual hash detected: ${window.location.hash}, clearing`);
                history.replaceState(null, '', window.location.pathname);
            }
            // Restore scroll position if browser overrides
            window.scrollTo(scrollX, scrollY);
            console.log(`Hash quote click #${postId}, scrolled to post, cleared hash, restored scroll: x=${scrollX}, y=${scrollY}`);
        }
    }, true);
})();
//--Hash Quote Click Hash Purge

//Shared Post Link Handler with Overboard Handling (for v2.5.2 base)
(function() {
    'use strict';

    // Only run on thread pages
    if (!window.location.pathname.match(/\/res\/\d+\.html$/)) {
        // console.log('[Shared Link Handler] Not a thread page, exiting.');
        return;
    }

    const initialHash = window.location.hash;
    const referrer = document.referrer;
    const isFromOverboard = referrer.includes('/overboard') || referrer.includes('/sfw');
    console.log(`[Shared Link Handler] Initial Load - Hash: "${initialHash}", Referrer: "${referrer}", FromOverboard: ${isFromOverboard}`);

    const postIdMatch = initialHash.match(/^#(\d+)$/);
    const isDirectPostLink = !!postIdMatch;
    const targetPostId = postIdMatch ? postIdMatch[1] : null;

    // Handle direct shared links (e.g., #123456)
    if (isDirectPostLink && targetPostId) {
        console.log(`[Shared Link Handler] Direct post link detected: #${targetPostId}`);
        // The modified Last Read Tracker already prevents scrolling to the *stored* position
        // if this hash exists. Now we just need to handle the scrolling *to the target*
        // and the hash clearing, respecting the overboard case.

        window.addEventListener('load', () => {
             // Use a small timeout to allow the browser's potential initial scroll to happen first
             setTimeout(() => {
                const post = document.getElementById(targetPostId) ||
                            document.querySelector(`.postCell .linkQuote[href*="${targetPostId}"], .postContainer .linkQuote[href*="${targetPostId}"]`)?.closest('.postCell, .postContainer');

                if (post) {
                    if (!isFromOverboard) {
                        // If NOT from overboard, ensure we scroll smoothly to the target post
                        console.log('[Shared Link Handler] Scrolling to target post (not from overboard).');
                        post.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Clear the hash AFTER scrolling to prevent conflicts
                        history.replaceState(null, '', window.location.pathname);
                        console.log('[Shared Link Handler] Cleared shared post hash after scrolling.');
                    } else {
                        // If FROM overboard, the browser should handle the initial scroll.
                        // We *still* want to clear the hash afterwards to prevent conflicts
                        // with the Last Read Tracker saving logic or subsequent interactions.
                        console.log('[Shared Link Handler] From overboard link. Browser should have scrolled. Clearing hash.');
                        history.replaceState(null, '', window.location.pathname);
                        console.log('[Shared Link Handler] Cleared shared post hash (from overboard).');
                    }
                } else {
                    // Post specified in hash not found
                    console.warn(`[Shared Link Handler] Shared post ${targetPostId} not found.`);
                    // Clear the invalid hash anyway
                    history.replaceState(null, '', window.location.pathname);
                    console.log('[Shared Link Handler] Cleared non-existent shared post hash.');
                }
            }, 100); // 100ms delay
        }, { once: true });
    }
    // Handle quick reply hashes (#q<postId>) on load (regardless of referrer)
    else if (initialHash.match(/^#q\d+$/)) {
        console.log('[Shared Link Handler] Quick reply hash detected on load.');
        window.addEventListener('load', () => {
            // Preserve current scroll position (could be 0,0 or where Last Read Tracker scrolled)
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            // Clear quick reply hash
            history.replaceState(null, '', window.location.pathname);
            // Restore scroll position just in case clearing the hash triggered a scroll
            window.scrollTo(scrollX, scrollY);
            console.log(`[Shared Link Handler] Cleared quick reply hash ${initialHash} on load, restored scroll: x=${scrollX}, y=${scrollY}`);
        }, { once: true });
    }
    // If no initial hash, do nothing - Last Read Tracker handles it.

    // --- Hash Change Listener ---
    // Block ALL default hashchange scrolling triggered by site scripts or manual hash changes
    // for post/QR hashes, as the script should manage scrolling and state.
    window.addEventListener('hashchange', (e) => {
        const currentHash = window.location.hash;
        // Check for #q<digits> or #<digits>
        if (currentHash.match(/^#(q)?\d+$/)) {
             console.log(`[Shared Link Handler] Hashchange event detected for ${currentHash}. Preventing default and clearing.`);
             e.preventDefault(); // Prevent default scroll/action
             e.stopPropagation(); // Prevent other listeners (like site's qr.js)
             const scrollX = window.scrollX;
             const scrollY = window.scrollY;
             // Clear the hash immediately
             history.replaceState(null, '', window.location.pathname);
             // Restore scroll position
             window.scrollTo(scrollX, scrollY);
             // console.log(`[Shared Link Handler] Blocked hashchange, cleared hash ${currentHash}, restored scroll: x=${scrollX}, y=${scrollY}`);
        }
    }, true); // Use capture phase

    console.log('[Shared Link Handler] Initialized.');
})();
//--Shared Post Link Handler with Overboard Handling (for v2.5.2 base)