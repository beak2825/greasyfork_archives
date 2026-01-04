// ==UserScript==
// @name         YouTube Timestamps
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Shows YouTube timestamps from comments using API
// @author       ris58h
// @match        https://www.youtube.com/*
// @match        https://www.youtube-nocookie.com/embed/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_log
// @connect      youtube.com
// @connect      www.youtube.com
// @connect      youtube.googleapis.com
// @connect      googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/538022/YouTube%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/538022/YouTube%20Timestamps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const API_KEY = 'AIzaSyBPdAZENonapCKJ37XScR80aXfpJwWABnA';
    const MAX_COMMENTS = 200;
    const PREVIEW_BORDER_SIZE = 2;
    const PREVIEW_MARGIN = 8;

    // Enhanced logging function
    function log(...args) {
        if (typeof GM_log !== 'undefined') {
            GM_log(...args);
        } else {
            console.log('[YouTube Timestamps]', ...args);
        }
    }

    log('Script started');

    // Add CSS (same as extension)
    GM_addStyle(`
        .ytp-scrubber-container {
            pointer-events: none;
        }

        .__youtube-timestamps__bar {
            width: 100%;
            height: 100%;
            position: absolute;
            transform: scaleX(1);
            z-index: 35;
        }

        .__youtube-timestamps__stamp {
            height: 100%;
            min-width: 3px;
            max-width: 5px;
            width: 0.5%;
            position: fixed;
            background-color: #3ea6ff;
        }

        .__youtube-timestamps__preview-wrapper {
            position: relative;
            left: 50%;
        }

        .__youtube-timestamps__preview {
            position: absolute;
            overflow: auto;
            background-color: white;
            bottom: 10px;
            box-sizing: border-box;
            padding: 8px;
            display: none;
            z-index: 1000;
        }

        .__youtube-timestamps__preview__author {
            display: flex;
            align-items: center;
        }

        .__youtube-timestamps__preview__avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
        }

        .__youtube-timestamps__preview__name {
            color: #030303;
            font-size: 13px;
            font-weight: 500;
            line-height: 18px;
            margin-left: 8px;
        }

        .__youtube-timestamps__preview__text {
            color: #030303;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            margin-top: 8px;
            white-space: pre-line;
            word-break: break-word;
            max-height: 200px;
            overflow-y: auto;
        }

        .__youtube-timestamps__preview__text-stamp {
            color: #065fd4;
            font-weight: bold;
        }

        #__youtube-timestamps__context-menu {
            width: 230px;
        }

@media (prefers-color-scheme: dark) {
    .__youtube-timestamps__preview {
        background-color: #181818 !important;
        color: white !important;
    }

    .__youtube-timestamps__preview__name,
    .__youtube-timestamps__preview__text {
        color: white !important;
    }

    .__youtube-timestamps__preview__text-stamp {
        color: #3ea6ff !important;
    }
}
    `);


    // Main function
    function main() {
        log('Running main()');
        const videoId = getVideoId();
        log('Video ID:', videoId);
        if (!videoId) {
            log('No video ID found, exiting');
            return;
        }

        fetchTimeComments(videoId)
            .then(timeComments => {
                log('Fetched time comments:', timeComments.length);
                if (videoId !== getVideoId()) {
                    log('Video changed during fetch, aborting');
                    return;
                }
                addTimeComments(timeComments);
            })
            .catch(error => {
                log('Error in fetchTimeComments:', error);
            });
    }

    // Helper functions
    function getVideoId() {
        try {
            if (window.location.pathname === '/watch') {
                const params = new URLSearchParams(window.location.search);
                return params.get('v');
            } else if (window.location.pathname.startsWith('/embed/')) {
                return window.location.pathname.substring('/embed/'.length);
            }
            return null;
        } catch (error) {
            log('Error in getVideoId:', error);
            return null;
        }
    }

    function getVideo() {
        const video = document.querySelector('#movie_player video');
        if (!video) {
            log('Video element not found');
        }
        return video;
    }

    function fetchTimeComments(videoId) {
        log('Starting fetchTimeComments for video:', videoId);
        return fetchComments(videoId).then(comments => {
            log('Total comments fetched:', comments.length);
            const timeComments = [];

            for (const comment of comments) {
                const tsContexts = getTimestampContexts(comment.text);
                if (isChaptersComment(tsContexts)) {
                    log('Skipping chapters comment');
                    continue;
                }

                for (const tsContext of tsContexts) {
                    timeComments.push({
                        commentId: comment.commentId,
                        authorAvatar: comment.authorAvatar,
                        authorName: comment.authorName,
                        timestamp: tsContext.timestamp,
                        time: tsContext.time,
                        text: tsContext.text
                    });
                }
            }

            log('Found time comments:', timeComments.length);
            return timeComments;
        }).catch(error => {
            log('Error in fetchComments:', error);
            return [];
        });
    }

    function isChaptersComment(tsContexts) {
        return tsContexts.length >= 3 && tsContexts[0].time === 0;
    }

    async function fetchComments(videoId) {
        log('Starting fetchComments for video:', videoId);
        let allComments = [];
        let pageToken = '';
        let totalFetched = 0;

        try {
            while (totalFetched < MAX_COMMENTS) {
                const response = await fetchCommentsPage(videoId, pageToken);
                const { comments, nextPageToken } = processCommentsResponse(response);

                allComments = allComments.concat(comments);
                totalFetched += comments.length;

                log(`Fetched ${comments.length} comments (total: ${totalFetched})`);

                if (!nextPageToken || totalFetched >= MAX_COMMENTS) {
                    break;
                }

                pageToken = nextPageToken;
            }

            return allComments;
        } catch (error) {
            log('Error in fetchComments:', error);
            throw error;
        }
    }

    function fetchCommentsPage(videoId, pageToken = '') {
        return new Promise((resolve, reject) => {
            const url = `https://www.googleapis.com/youtube/v3/commentThreads?key=${API_KEY}&videoId=${videoId}&part=snippet,replies&maxResults=100&pageToken=${pageToken}`;

            log(`Fetching comments page with token: ${pageToken || 'none'}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            log('Error parsing response:', e);
                            reject('Failed to parse response');
                        }
                    } else {
                        log('API error:', response.status, response.statusText);
                        reject(`API error: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    log('Network error:', error);
                    reject('Network error');
                }
            });
        });
    }

    function processCommentsResponse(response) {
        const comments = [];
        const items = response.items || [];

        items.forEach(item => {
            // Process top-level comment
            const topLevelComment = item.snippet.topLevelComment.snippet;
            comments.push({
                commentId: item.id,
                authorName: topLevelComment.authorDisplayName,
                authorAvatar: topLevelComment.authorProfileImageUrl,
                text: topLevelComment.textOriginal,
                likes: topLevelComment.likeCount
            });

            // Process replies if any
            if (item.replies && item.replies.comments) {
                item.replies.comments.forEach(reply => {
                    comments.push({
                        commentId: reply.id,
                        authorName: reply.snippet.authorDisplayName,
                        authorAvatar: reply.snippet.authorProfileImageUrl,
                        text: reply.snippet.textOriginal,
                        likes: reply.snippet.likeCount
                    });
                });
            }
        });

        return {
            comments,
            nextPageToken: response.nextPageToken || ''
        };
    }

    function getTimestampContexts(text) {
        try {
            log('Finding timestamps in text');
            const result = [];
            const positions = findTimestamps(text);
            log('Found timestamp positions:', positions.length);

            for (const position of positions) {
                const timestamp = text.substring(position.from, position.to);
                const time = parseTimestamp(timestamp);
                if (time === null) {
                    log('Invalid timestamp format:', timestamp);
                    continue;
                }

                result.push({
                    text,
                    time,
                    timestamp
                });
            }

            return result;
        } catch (error) {
            log('Error in getTimestampContexts:', error);
            return [];
        }
    }

    function findTimestamps(text) {
        const result = [];
        const timestampPattern = /(\d?\d:)?(\d?\d:)\d\d/g;
        let match;

        while ((match = timestampPattern.exec(text))) {
            result.push({
                from: match.index,
                to: timestampPattern.lastIndex
            });
        }

        return result;
    }

    function parseTimestamp(ts) {
        try {
            const parts = ts.split(':').reverse();
            const secs = parseInt(parts[0]);
            if (secs > 59) {
                log('Invalid seconds in timestamp:', ts);
                return null;
            }

            const mins = parseInt(parts[1]);
            if (mins > 59) {
                log('Invalid minutes in timestamp:', ts);
                return null;
            }

            const hours = parseInt(parts[2]) || 0;
            return secs + (60 * mins) + (60 * 60 * hours);
        } catch (error) {
            log('Error parsing timestamp:', ts, error);
            return null;
        }
    }
    function addTimeComments(timeComments) {
        try {
            log('Adding time comments to bar');
            const bar = getOrCreateBar();
            const video = getVideo();
            if (!video) {
                log('No video element found');
                return;
            }
            const videoDuration = video.duration;
            log('Video duration:', videoDuration);

            let contextMenuTimeComment = null;

            for (const tc of timeComments) {
                if (tc.time > videoDuration) {
                    log('Skipping timestamp beyond video duration:', tc.time);
                    continue;
                }
                const stamp = document.createElement('div');
                stamp.classList.add('__youtube-timestamps__stamp');
                const offset = tc.time / videoDuration * 100;
                stamp.style.left = `calc(${offset}% - 2px)`;
                bar.appendChild(stamp);

                stamp.addEventListener('mouseenter', () => {
                    showPreview(tc);
                });

                stamp.addEventListener('mouseleave', () => {
                    hidePreview();
                });

                stamp.addEventListener('wheel', withWheelThrottle((deltaY) => {
                    const preview = getOrCreatePreview();
                    if (preview) {
                        preview.scrollBy(0, deltaY);
                    }
                }));

                stamp.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (tc === contextMenuTimeComment && isContextMenuVisible()) {
                        hideContextMenu();
                    } else {
                        showContextMenu(tc, e.pageX, e.pageY);
                        contextMenuTimeComment = tc;
                    }
                });
            }
            log('Added all time comments to bar');
        } catch (error) {
            log('Error in addTimeComments:', error);
        }
    }

    function getOrCreateBar() {
        let bar = document.querySelector('.__youtube-timestamps__bar');
        if (!bar) {
            let container = document.querySelector('#movie_player .ytp-timed-markers-container');
            if (!container) {
                container = document.querySelector('#movie_player .ytp-progress-list');
            }
            bar = document.createElement('div');
            bar.classList.add('__youtube-timestamps__bar');
            container.appendChild(bar);
        }
        return bar;
    }

    function removeBar() {
        const bar = document.querySelector('.__youtube-timestamps__bar');
        if (bar) {
            bar.remove();
        }
    }

    function getTooltip() {
        return document.querySelector('#movie_player .ytp-tooltip');
    }

function showPreview(timeComment) {
    try {
        log('Showing preview for comment:', timeComment);
        const tooltip = getTooltip();
        if (!tooltip) {
            log('Tooltip element not found');
            return;
        }

        const preview = getOrCreatePreview();
        if (!preview) {
            log('Preview element not found');
            return;
        }

        // Reset preview state completely
        preview.style.display = 'block';
        preview.style.visibility = 'visible';
        preview.style.opacity = '1';

        // Set content
        const avatarImg = preview.querySelector('.__youtube-timestamps__preview__avatar');
        if (avatarImg) {
            avatarImg.src = timeComment.authorAvatar || '';
            avatarImg.onerror = () => {
                avatarImg.src = 'https://www.gstatic.com/youtube/img/originals/promo/ytr-logo-for-search_160x160.png';
            };
        }

        const nameElement = preview.querySelector('.__youtube-timestamps__preview__name');
        if (nameElement) {
            nameElement.textContent = timeComment.authorName || 'Anonymous';
        }

        const textElement = preview.querySelector('.__youtube-timestamps__preview__text');
        if (textElement) {
            textElement.innerHTML = '';
            textElement.appendChild(highlightTextFragment(timeComment.text, timeComment.timestamp));
        }

        // Position the preview (keep your existing positioning code)
        const tooltipBg = tooltip.querySelector('.ytp-tooltip-bg');
        const tooltipBgWidth = tooltipBg ? tooltipBg.style.width : '160px';
        const previewWidth = tooltipBgWidth.endsWith('px') ? parseFloat(tooltipBgWidth) : 160;
        preview.style.width = (previewWidth + 2*PREVIEW_BORDER_SIZE) + 'px';

        const halfPreviewWidth = previewWidth / 2;
        const playerRect = document.querySelector('#movie_player .ytp-progress-bar').getBoundingClientRect();
        const pivot = preview.parentElement.getBoundingClientRect().left;
        const minPivot = playerRect.left + halfPreviewWidth;
        const maxPivot = playerRect.right - halfPreviewWidth;
        let previewLeft;
        if (pivot < minPivot) {
            previewLeft = playerRect.left - pivot;
        } else if (pivot > maxPivot) {
            previewLeft = -previewWidth + (playerRect.right - pivot);
        } else {
            previewLeft = -halfPreviewWidth;
        }
        preview.style.left = (previewLeft - PREVIEW_BORDER_SIZE) + 'px';

        // Scroll to highlighted text
        const highlightedTextFragment = preview.querySelector('.__youtube-timestamps__preview__text-stamp');
        if (highlightedTextFragment) {
            highlightedTextFragment.scrollIntoView({block: 'nearest'});
        }

    } catch (error) {
        log('Error in showPreview:', error);
    }
}


// Update the getOrCreatePreview function to ensure proper structure:
function getOrCreatePreview() {
    const tooltip = getTooltip();
    if (!tooltip) {
        log('YouTube tooltip element not found');
        return null;
    }

    // Check for existing preview
    let previewWrapper = tooltip.querySelector('.__youtube-timestamps__preview-wrapper');
    let preview = previewWrapper ? previewWrapper.querySelector('.__youtube-timestamps__preview') : null;

    if (preview) return preview;

    // Create new preview structure
    previewWrapper = document.createElement('div');
    previewWrapper.className = '__youtube-timestamps__preview-wrapper';
    previewWrapper.style.position = 'relative';
    previewWrapper.style.left = '50%';

    preview = document.createElement('div');
    preview.className = '__youtube-timestamps__preview';
    preview.style.cssText = `
        position: absolute;
        overflow-y: auto;
        background-color: white;
        bottom: 23px;
        box-sizing: border-box;
        padding: 8px;
        display: none;
        z-index: 9999;
        max-height: 200px;
        scrollbar-width: thin;  /* For Firefox */
    `;

    // Webkit scrollbar styling
    GM_addStyle(`
        .__youtube-timestamps__preview::-webkit-scrollbar {
            width: 6px;
        }
        .__youtube-timestamps__preview::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.2);
            border-radius: 3px;
        }
    `);

    // Create author section
    const authorDiv = document.createElement('div');
    authorDiv.className = '__youtube-timestamps__preview__author';
    authorDiv.style.display = 'flex';
    authorDiv.style.alignItems = 'center';

    const avatarImg = document.createElement('img');
    avatarImg.className = '__youtube-timestamps__preview__avatar';
    avatarImg.style.cssText = `
        width: 16px;
        height: 16px;
    `;

    const nameSpan = document.createElement('span');
    nameSpan.className = '__youtube-timestamps__preview__name';
    nameSpan.style.cssText = `
        color: #030303;
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        margin-left: 8px;
    `;

    // Create text section - REMOVE ALL OVERFLOW PROPERTIES HERE
    const textDiv = document.createElement('div');
    textDiv.className = '__youtube-timestamps__preview__text';
    textDiv.style.cssText = `
        color: #030303;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        margin-top: 8px;
        white-space: pre-line;
        overflow: visible;  /* Explicitly set to visible */
    `;

    // Assemble structure
    authorDiv.appendChild(avatarImg);
    authorDiv.appendChild(nameSpan);
    preview.appendChild(authorDiv);
    preview.appendChild(textDiv);
    previewWrapper.appendChild(preview);
    tooltip.insertAdjacentElement('afterbegin', previewWrapper);

    return preview;
}

function highlightTextFragment(text, fragment) {
    if (!text || !fragment) return document.createTextNode(text || '');

    const result = document.createDocumentFragment();
    const parts = text.split(fragment);

    for (let i = 0; i < parts.length; i++) {
        if (parts[i]) {
            result.appendChild(document.createTextNode(parts[i]));
        }
        if (i < parts.length - 1) {
            const span = document.createElement('span');
            span.className = '__youtube-timestamps__preview__text-stamp';
            span.style.cssText = `
                color: #065fd4;
                font-weight: bold;
            `;
            span.textContent = fragment;
            result.appendChild(span);
        }
    }

    return result;
}
function positionPreview(preview) {
    const tooltip = getTooltip();
    if (!tooltip || !preview) return;

    // Get tooltip background for sizing reference
    const tooltipBg = tooltip.querySelector('.ytp-tooltip-bg');
    const tooltipBgWidth = tooltipBg ? tooltipBg.style.width : '160px';
    const previewWidth = tooltipBgWidth.endsWith('px') ? parseFloat(tooltipBgWidth) : 160;
    preview.style.width = (previewWidth + 2 * PREVIEW_BORDER_SIZE) + 'px';

    // Calculate horizontal positioning
    const halfPreviewWidth = previewWidth / 2;
    const playerRect = document.querySelector('#movie_player .ytp-progress-bar')?.getBoundingClientRect();
    if (!playerRect) return;

    const pivot = preview.parentElement.getBoundingClientRect().left;
    const minPivot = playerRect.left + halfPreviewWidth;
    const maxPivot = playerRect.right - halfPreviewWidth;
    let previewLeft;

    if (pivot < minPivot) {
        previewLeft = playerRect.left - pivot;
    } else if (pivot > maxPivot) {
        previewLeft = -previewWidth + (playerRect.right - pivot);
    } else {
        previewLeft = -halfPreviewWidth;
    }

    preview.style.left = (previewLeft - PREVIEW_BORDER_SIZE) + 'px';

    // Adjust for any text above video preview
    const textAboveVideoPreview = tooltip.querySelector('.ytp-tooltip-edu');
    if (textAboveVideoPreview) {
        preview.style.bottom = (10 + textAboveVideoPreview.clientHeight) + 'px';
    }

    // Set max height based on available space
    const tooltipTop = tooltip.style.top;
    if (tooltipTop.endsWith('px')) {
        let previewHeight = parseFloat(tooltipTop) - 2 * PREVIEW_MARGIN;
        if (textAboveVideoPreview) {
            previewHeight -= textAboveVideoPreview.clientHeight;
        }
        if (previewHeight > 0) {
            preview.style.maxHeight = previewHeight + 'px';
        }
    }
}

function hidePreview() {
    const preview = document.querySelector('.__youtube-timestamps__preview');
    if (preview) {
        preview.style.display = 'none';
    }
}
    function parseParams(href) {
        const noHash = href.split('#')[0];
        const paramString = noHash.split('?')[1];
        const params = {};
        if (paramString) {
            const paramsArray = paramString.split('&');
            for (const kv of paramsArray) {
                const tmparr = kv.split('=');
                params[tmparr[0]] = tmparr[1];
            }
        }
        return params;
    }

    function withWheelThrottle(callback) {
        let deltaYAcc = 0;
        let afRequested = false;
        return (e) => {
            e.preventDefault();

            deltaYAcc += e.deltaY;

            if (afRequested) {
                return;
            }
            afRequested = true;

            window.requestAnimationFrame(() => {
                callback(deltaYAcc);

                deltaYAcc = 0;
                afRequested = false;
            });
        };
    }

    function showContextMenu(timeComment, x, y) {
        const contextMenu = getOrCreateContextMenu();
        contextMenu.style.display = '';
        adjustContextMenuSizeAndPosition(contextMenu, x, y);
        fillContextMenuData(contextMenu, timeComment);
    }

    function fillContextMenuData(contextMenu, timeComment) {
        contextMenu.dataset.commentId = timeComment.commentId;
    }

    function adjustContextMenuSizeAndPosition(contextMenu, x, y) {
        const menuHeight = contextMenu.querySelector('.ytp-panel-menu').clientHeight;
        contextMenu.style.height = menuHeight + 'px';
        contextMenu.style.top = (y - menuHeight) + 'px';
        contextMenu.style.left = x + 'px';
    }

    function getOrCreateContextMenu() {
        let contextMenu = getContextMenu();
        if (!contextMenu) {
            contextMenu = document.createElement('div');
            contextMenu.id = '__youtube-timestamps__context-menu';
            contextMenu.classList.add('ytp-popup');
            document.body.appendChild(contextMenu);

            const panelElement = document.createElement('div');
            panelElement.classList.add('ytp-panel');
            contextMenu.appendChild(panelElement);

            const menuElement = document.createElement('div');
            menuElement.classList.add('ytp-panel-menu');
            panelElement.appendChild(menuElement);

            menuElement.appendChild(menuItemElement("Open in New Tab", () => {
                const videoId = getVideoId();
                const commentId = contextMenu.dataset.commentId;
                window.open(`https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`, '_blank');
            }));
        }
        return contextMenu;
    }

    function menuItemElement(label, callback) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('ytp-menuitem');
        itemElement.addEventListener('click', callback);

        const iconElement = document.createElement('div');
        iconElement.classList.add('ytp-menuitem-icon');
        itemElement.appendChild(iconElement);

        const labelElement = document.createElement('div');
        labelElement.classList.add('ytp-menuitem-label');
        labelElement.textContent = label;
        itemElement.appendChild(labelElement);

        return itemElement;
    }

    function getContextMenu() {
        return document.querySelector('#__youtube-timestamps__context-menu');
    }

    function isContextMenuVisible() {
        const contextMenu = getContextMenu();
        return contextMenu && !contextMenu.style.display;
    }

    function hideContextMenu() {
        const contextMenu = getContextMenu();
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    }

    function removeContextMenu() {
        const contextMenu = getContextMenu();
        if (contextMenu) {
            contextMenu.remove();
        }
    }

    // Mutation observer for URL changes
    let currentHref = document.location.href;
    const observer = new MutationObserver(() => {
        if (currentHref !== document.location.href) {
            currentHref = document.location.href;
            removeBar();
            removeContextMenu();
            main();
        }
    });
    observer.observe(document.querySelector("body"), {childList: true, subtree: true});

    // Event listeners for clicks outside stamps
    document.addEventListener('click', e => {
        const stamp = e.target.closest('.__youtube-timestamps__stamp');
        if (!stamp) {
            hideContextMenu();
        }
    }, true);

    document.addEventListener('contextmenu', e => {
        const stamp = e.target.closest('.__youtube-timestamps__stamp');
        if (!stamp) {
            hideContextMenu();
        }
    }, true);

    // Initialize
    main();
})();