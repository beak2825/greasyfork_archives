// ==UserScript==
// @name          Tampermonkey Video Filter v4
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  Filters posts with videos using dynamic content detection, improved performance.
// @author       harryangstrom, xdegeneratex, remuru, AI Assistant
// @match        https://*.coomer.party/*
// @match        https://*.coomer.su/*
// @match        https://*.coomer.st/*
// @match        https://*.kemono.su/*
// @match        https://*.kemono.party/*
// @match        https://*.kemono.cr/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537668/Tampermonkey%20Video%20Filter%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/537668/Tampermonkey%20Video%20Filter%20v4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VIDEO_EXTENSIONS = ['mp4', 'm4v', 'mov', 'webm'];
    const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
    const POSTS_PER_PAGE = 50;
    const API_DELAY = 1000;
    const SUBSTRING_TITLE_LENGTH = 100;
    const LS_COLLAPSE_KEY = 'videoFilterPanelCollapsed_v1';
    const LS_PAGES_KEY = 'videoFilterPageRange_v1';
    let currentDomain = window.location.hostname;
    let allFoundVideoUrls = [];
    let videoIntersectionObserver = null;
    let isPanelCollapsed = false;
    const uiContainer = document.createElement('div');
    uiContainer.id = 'video-filter-ui';
    uiContainer.style.position = 'fixed';
    uiContainer.style.bottom = '10px';
    uiContainer.style.right = '10px';
    uiContainer.style.backgroundColor = '#2c2c2e';
    uiContainer.style.color = '#e0e0e0';
    uiContainer.style.border = '1px solid #444444';
    const initialUiContainerPadding = '12px';
    uiContainer.style.padding = initialUiContainerPadding;
    uiContainer.style.zIndex = '9999';
    uiContainer.style.fontFamily = 'Arial, sans-serif';
    uiContainer.style.fontSize = '14px';
    uiContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
    uiContainer.style.borderRadius = '4px';
    uiContainer.style.transition = 'width 0.2s ease-in-out, height 0.2s ease-in-out, padding 0.2s ease-in-out';
    const collapseButton = document.createElement('button');
    collapseButton.id = 'video-filter-collapse-button';
    collapseButton.innerHTML = '»';
    collapseButton.title = 'Collapse/Expand Panel';
    collapseButton.style.position = 'absolute';
    collapseButton.style.bottom = '8px';
    collapseButton.style.left = '8px';
    collapseButton.style.width = '25px';
    collapseButton.style.height = '60px';
    collapseButton.style.display = 'flex';
    collapseButton.style.alignItems = 'center';
    collapseButton.style.justifyContent = 'center';
    collapseButton.style.padding = '0';
    collapseButton.style.fontSize = '16px';
    collapseButton.style.backgroundColor = '#4a4a4c';
    collapseButton.style.color = '#f0f0f0';
    collapseButton.style.border = '1px solid #555555';
    collapseButton.style.borderRadius = '3px';
    collapseButton.style.cursor = 'pointer';
    collapseButton.style.zIndex = '1';
    const panelMainContent = document.createElement('div');
    panelMainContent.id = 'video-filter-main-content';
    panelMainContent.style.marginLeft = '30px';
    const pageRangeInput = document.createElement('input');
    pageRangeInput.type = 'text';
    pageRangeInput.id = 'video-filter-page-range';
    pageRangeInput.value = '1';
    pageRangeInput.placeholder = 'e.g., 1, 2-5, 7';
    pageRangeInput.style.width = '100px';
    pageRangeInput.style.marginRight = '8px';
    pageRangeInput.style.padding = '6px 8px';
    pageRangeInput.style.backgroundColor = '#1e1e1e';
    pageRangeInput.style.color = '#e0e0e0';
    pageRangeInput.style.border = '1px solid #555555';
    pageRangeInput.style.borderRadius = '3px';
    const filterButton = document.createElement('button');
    filterButton.id = 'video-filter-button';
    filterButton.textContent = 'Filter Videos';
    const copyUrlsButton = document.createElement('button');
    copyUrlsButton.id = 'video-copy-urls-button';
    copyUrlsButton.textContent = 'Copy Video URLs';
    copyUrlsButton.disabled = true;
    const baseButtonBg = '#3a3a3c';
    const hoverButtonBg = '#4a4a4c';
    const disabledButtonBg = '#303030';
    const disabledButtonColor = '#777777';
    collapseButton.onmouseenter = () => {
        if (collapseButton.style.backgroundColor !== disabledButtonBg) collapseButton.style.backgroundColor = hoverButtonBg;
    };
    collapseButton.onmouseleave = () => {
        if (collapseButton.style.backgroundColor !== disabledButtonBg) collapseButton.style.backgroundColor = '#4a4a4c';
    };

    function styleButton(button, disabled = false) {
        if (disabled) {
            button.style.backgroundColor = disabledButtonBg;
            button.style.color = disabledButtonColor;
            button.style.cursor = 'default';
        } else {
            button.style.backgroundColor = baseButtonBg;
            button.style.color = '#f0f0f0';
            button.style.cursor = 'pointer';
        }
        button.style.marginRight = '8px';
        button.style.padding = '6px 12px';
        button.style.border = '1px solid #555555';
        button.style.borderRadius = '3px';
    }
    [filterButton, copyUrlsButton].forEach(btn => {
        styleButton(btn, btn.disabled);
        btn.onmouseenter = () => {
            if (!btn.disabled) btn.style.backgroundColor = hoverButtonBg;
        };
        btn.onmouseleave = () => {
            if (!btn.disabled) btn.style.backgroundColor = baseButtonBg;
        };
    });
    const statusMessage = document.createElement('div');
    statusMessage.id = 'video-filter-status';
    statusMessage.style.marginTop = '8px';
    statusMessage.style.fontSize = '12px';
    statusMessage.style.minHeight = '15px';
    statusMessage.style.color = '#cccccc';
    panelMainContent.appendChild(document.createTextNode('Pages: '));
    panelMainContent.appendChild(pageRangeInput);
    panelMainContent.appendChild(filterButton);
    panelMainContent.appendChild(copyUrlsButton);
    panelMainContent.appendChild(statusMessage);
    uiContainer.appendChild(collapseButton);
    uiContainer.appendChild(panelMainContent);
    document.body.appendChild(uiContainer);

    function togglePanelCollapse() {
        isPanelCollapsed = !isPanelCollapsed;
        if (isPanelCollapsed) {
            panelMainContent.style.display = 'none';
            collapseButton.innerHTML = '«';
            uiContainer.style.width = '41px';
            uiContainer.style.height = '80px';
            uiContainer.style.padding = '0';
        } else {
            panelMainContent.style.display = 'block';
            collapseButton.innerHTML = '»';
            uiContainer.style.width = '';
            uiContainer.style.height = '';
            uiContainer.style.padding = initialUiContainerPadding;
        }
        localStorage.setItem(LS_COLLAPSE_KEY, isPanelCollapsed.toString());
    }

    function setupVideoIntersectionObserver() {
        if (videoIntersectionObserver) {
            videoIntersectionObserver.disconnect();
        }
        const options = {
            root: null,
            rootMargin: '200px 0px',
            threshold: 0.01
        };
        videoIntersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const videoElement = entry.target;
                    const sourceElement = videoElement.querySelector('source[data-src]');
                    if (sourceElement) {
                        const videoUrl = sourceElement.getAttribute('data-src');
                        sourceElement.setAttribute('src', videoUrl);
                        videoElement.load();
                        sourceElement.removeAttribute('data-src');
                        observer.unobserve(videoElement);
                    }
                }
            });
        }, options);
    }

    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        switch (type) {
            case 'error':
                statusMessage.style.color = '#ff6b6b';
                break;
            case 'success':
                statusMessage.style.color = '#76c7c0';
                break;
            case 'info':
            default:
                statusMessage.style.color = '#cccccc';
                break;
        }
        if (type === 'success' && message.includes("Copied")) {
            setTimeout(() => {
                if (statusMessage.textContent === message) {
                    statusMessage.textContent = '';
                    statusMessage.style.color = '#cccccc';
                }
            }, 3000);
        }
    }

    function parsePageRange(inputStr) {
        const pages = new Set();
        if (!inputStr || inputStr.trim() === '') {
            showStatus('Error: Page range cannot be empty.', 'error');
            return null;
        }
        const parts = inputStr.split(',');
        for (const part of parts) {
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-');
                const start = parseInt(startStr, 10);
                const end = parseInt(endStr, 10);
                if (isNaN(start) || isNaN(end) || start <= 0 || end < start) {
                    showStatus(`Error: Invalid range "${part}". Start must be > 0 and end >= start.`, 'error');
                    return null;
                }
                for (let i = start; i <= end; i++) pages.add(i);
            } else {
                const page = parseInt(part, 10);
                if (isNaN(page) || page <= 0) {
                    showStatus(`Error: Invalid page number "${part}". Must be > 0.`, 'error');
                    return null;
                }
                pages.add(page);
            }
        }
        if (pages.size === 0) {
            showStatus('Error: No valid pages specified.', 'error');
            return null;
        }
        return Array.from(pages).sort((a, b) => a - b);
    }

    // --- PAGE CONTEXT AND API HANDLING ---

    /**
     * Analyzes the current URL to determine the page context (e.g., user profile, search results, popular posts).
     * @returns {object|null} A context object or null if the context is not recognized.
     */
    function determinePageContext() {
        const pathname = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('q');
        const userProfileMatch = pathname.match(/^\/([^/]+)\/user\/([^/]+)$/);
        if (userProfileMatch && !query) return {
            type: 'profile',
            service: userProfileMatch[1],
            userId: userProfileMatch[2]
        };
        if (userProfileMatch && query) return {
            type: 'user_search',
            service: userProfileMatch[1],
            userId: userProfileMatch[2],
            query
        };
        if (pathname === '/posts/popular') {
            return {
                type: 'popular_posts',
                date: searchParams.get('date') || 'none',
                period: searchParams.get('period') || 'recent'
            };
        };
        if (pathname === '/posts') return {
            type: 'global_search',
            query: query || null
        };
        console.error('Video Filter: Unknown page structure for context.', pathname, window.location.search);
        return null;
    }

    /**
     * Constructs the appropriate API URL based on the determined page context and offset.
     * @param {object} context - The context object from determinePageContext.
     * @param {number} offset - The post offset for pagination.
     * @returns {string|null} The constructed API URL or null.
     */
    function buildApiUrl(context, offset) {
        let baseApiUrl = `https://${currentDomain}/api/v1`;
        let queryParams = [`o=${offset}`];
        switch (context.type) {
            case 'profile':
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;
            case 'user_search':
                queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseApiUrl}/${context.service}/user/${context.userId}/posts?${queryParams.join('&')}`;
            case 'global_search':
                if (context.query) queryParams.push(`q=${encodeURIComponent(context.query)}`);
                return `${baseApiUrl}/posts?${queryParams.join('&')}`;
            case 'popular_posts':
                if (context.date != 'none') queryParams.push(`date=${encodeURIComponent(context.date)}`);
                queryParams.push(`period=${encodeURIComponent(context.period)}`);
                return `${baseApiUrl}/posts/popular?${queryParams.join('&')}`;
            default:
                return null;
        }
    }

    function fetchData(apiUrl) {
        const headers = {
            "Accept": "text/css",
            "Referer": window.location.href,
            "User-Agent": navigator.userAgent,
            "X-Requested-With": "XMLHttpRequest"
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: headers,
                onload: resp => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try {
                            resolve(JSON.parse(resp.responseText));
                        } catch (e) {
                            reject(`Error parsing JSON from ${apiUrl}: ${e.message}`);
                        }
                    } else {
                        reject(`API request failed for ${apiUrl}: ${resp.status} ${resp.statusText}`);
                    }
                },
                onerror: resp => reject(`API request error for ${apiUrl}: ${resp.statusText || 'Network error'}`)
            });
        });
    }

    function isVideoFile(filenameOrPath) {
        if (!filenameOrPath) return false;
        const lowerName = filenameOrPath.toLowerCase();
        return VIDEO_EXTENSIONS.some(ext => lowerName.endsWith('.' + ext));
    }

    function isImageFile(filenameOrPath) {
        if (!filenameOrPath) return false;
        const lowerName = filenameOrPath.toLowerCase();
        return IMAGE_EXTENSIONS.some(ext => lowerName.endsWith('.' + ext));
    }

    function getPostPreviewUrl(post, apiPreviewsEntry) {
        if (apiPreviewsEntry && apiPreviewsEntry.length > 0 && apiPreviewsEntry[0] && apiPreviewsEntry[0].server && apiPreviewsEntry[0].path) {
            return `${apiPreviewsEntry[0].server}${apiPreviewsEntry[0].path}`;
        }
        if (post.file && post.file.path && isImageFile(post.file.path)) return `https://${currentDomain}/data${post.file.path}`;
        if (post.attachments) {
            for (const attachment of post.attachments) {
                if (attachment.path && isImageFile(attachment.path)) return `https://${currentDomain}/data${attachment.path}`;
            }
        }
        return null;
    }

    function getFirstVideoUrlFromPost(post) {
        const domain = `https://${currentDomain}/data`;
        if (post.file && isVideoFile(post.file.path)) {
            return domain + post.file.path;
        }
        if (post.attachments) {
            for (const att of post.attachments) {
                if (isVideoFile(att.path)) {
                    return domain + att.path;
                }
            }
        }
        return null;
    }

    function createPostCardHtml(post, previewUrl) {
        const postDate = new Date(post.published || post.added);
        const formattedDate = postDate.toLocaleString();
        const dateTimeAttr = postDate.toISOString();
        const attachmentCount = post.attachments ? post.attachments.length : 0;
        const attachmentText = attachmentCount === 1 ? "1 Attachment" : `${attachmentCount} Attachments`;
        let displayTitle = (post.title || '').trim();
        if (!displayTitle && post.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            let contentForTitle = (tempDiv.textContent || "").trim();
            if (contentForTitle) {
                displayTitle = contentForTitle.substring(0, SUBSTRING_TITLE_LENGTH) + (contentForTitle.length > SUBSTRING_TITLE_LENGTH ? '...' : '');
            }
        }
        displayTitle = displayTitle || 'No Title';
        const firstVideoUrl = getFirstVideoUrlFromPost(post);
        const posterAttribute = previewUrl ? `poster="${previewUrl}"` : '';
        const mediaHtml = `
            <div style="text-align: center; margin-bottom: 5px; background-color: #000;">
                <video class="lazy-load-video" controls preload="none" width="100%" style="max-height: 300px; display: block;" ${posterAttribute}>
                    <source data-src="${firstVideoUrl}" type="video/mp4">
                </video>
            </div>`;
        const postLink = `/${post.service}/user/${post.user}/post/${post.id}`;
        return `
        <article class="post-card post-card--preview">
          <a class="fancy-link" href="${postLink}" target="_blank" rel="noopener noreferrer">
           <header class="post-card__header" title="${displayTitle.replace(/"/g, '"')}">${displayTitle}</header>
           ${mediaHtml}
           <footer class="post-card__footer">
             <div>
                <div>
                  <time datetime="${dateTimeAttr}">${formattedDate}</time>
                  <div>${attachmentCount > 0 ? attachmentText : 'No Attachments'}</div>
                </div>
              </div>
            </footer>
          </a>
        </article>`;
    }

    async function handleFilter() {
        showStatus('');
        filterButton.textContent = 'Filtering...';
        styleButton(filterButton, true);
        filterButton.disabled = true;
        styleButton(copyUrlsButton, true);
        copyUrlsButton.disabled = true;
        allFoundVideoUrls = [];
        setupVideoIntersectionObserver();
        const pagesToFetch = parsePageRange(pageRangeInput.value);
        if (!pagesToFetch) {
            styleButton(filterButton, false);
            filterButton.disabled = false;
            return;
        }

        localStorage.setItem(LS_PAGES_KEY, pageRangeInput.value);

        const context = determinePageContext();
        if (!context) {
            showStatus('Error: Page context invalid for filtering.', 'error');
            styleButton(filterButton, false);
            filterButton.disabled = false;
            return;
        }
        const postListContainer = document.querySelector('.card-list__items');
        if (!postListContainer) {
            showStatus('Error: Post container not found.', 'error');
            styleButton(filterButton, false);
            filterButton.disabled = false;
            return;
        }
        postListContainer.style.setProperty('--card-size', '350px');
        postListContainer.innerHTML = '';
        document.querySelectorAll('.paginator menu, .content > menu.Paginator').forEach(menu => menu.style.display = 'none');
        const paginatorInfo = document.querySelector('.paginator > small, .content > div > small.subtle-text');
        if (paginatorInfo) paginatorInfo.textContent = `Filtering posts...`;
        let totalVideoPostsFound = 0;
        for (let i = 0; i < pagesToFetch.length; i++) {
            const pageNum = pagesToFetch[i];
            const offset = (pageNum - 1) * POSTS_PER_PAGE;
            const apiUrl = buildApiUrl(context, offset);
            if (!apiUrl) {
                showStatus('Error: Could not build API URL.', 'error');
                break;
            }
            filterButton.textContent = `Filtering Page ${i + 1}/${pagesToFetch.length}...`;
            showStatus(`Fetching page ${pageNum}...`, 'info');
            try {
                const apiResponse = await fetchData(apiUrl);
                let posts = Array.isArray(apiResponse) ? apiResponse : (apiResponse.results || apiResponse.posts);
                if (!Array.isArray(posts)) {
                    console.error("Could not extract a valid posts array from API response:", apiResponse);
                    showStatus(`Warning: Unexpected API structure on page ${pageNum}.`, 'error');
                    continue;
                }
                for (let postIndex = 0; postIndex < posts.length; postIndex++) {
                    const post = posts[postIndex];
                    const firstVideoUrl = getFirstVideoUrlFromPost(post);
                    if (firstVideoUrl) {
                        totalVideoPostsFound++;
                        allFoundVideoUrls.push(firstVideoUrl);
                        const cardHtml = createPostCardHtml(post, null);
                        postListContainer.insertAdjacentHTML('beforeend', cardHtml);
                    }
                }
                if (paginatorInfo) paginatorInfo.textContent = `Showing ${totalVideoPostsFound} video posts.`;
            } catch (error) {
                showStatus(`Error on page ${pageNum}: ${error}`, 'error');
                console.error("Filter error:", error);
            }
            if (i < pagesToFetch.length - 1) await new Promise(resolve => setTimeout(resolve, API_DELAY));
        }
        postListContainer.querySelectorAll('video.lazy-load-video').forEach(videoEl => {
            if (videoEl.querySelector('source[data-src]')) {
                videoIntersectionObserver.observe(videoEl);
            }
        });
        filterButton.textContent = 'Filter Videos';
        styleButton(filterButton, false);
        filterButton.disabled = false;
        if (totalVideoPostsFound > 0) {
            showStatus(`Filter complete. Found ${totalVideoPostsFound} video posts.`, 'success');
            styleButton(copyUrlsButton, false);
            copyUrlsButton.disabled = false;
        } else {
            showStatus('Filter complete. No video posts found.', 'info');
            styleButton(copyUrlsButton, true);
            copyUrlsButton.disabled = true;
        }
    }

    function handleCopyUrls() {
        if (allFoundVideoUrls.length === 0) {
            showStatus("No video URLs to copy.", 'error');
            return;
        }
        const uniqueUrls = [...new Set(allFoundVideoUrls)];
        GM_setClipboard(uniqueUrls.join('\n'));
        copyUrlsButton.textContent = `Copied ${uniqueUrls.length} URLs!`;
        showStatus(`Copied ${uniqueUrls.length} unique video URLs!`, 'success');
        setTimeout(() => {
            copyUrlsButton.textContent = 'Copy Video URLs';
        }, 3000);
    }

    function handleUrlChangeAndSetStatus() {
        console.log("Video Filter: URL change detected or initial load.");
        const currentContext = determinePageContext();
        allFoundVideoUrls = [];
        styleButton(copyUrlsButton, true);
        copyUrlsButton.disabled = true;
        if (videoIntersectionObserver) {
            videoIntersectionObserver.disconnect();
        }
        if (currentContext) {
            showStatus("Filter ready.", 'info');
            styleButton(filterButton, false);
            filterButton.disabled = false;
        } else {
            showStatus("Page context not recognized. Filter disabled.", 'error');
            styleButton(filterButton, true);
            filterButton.disabled = true;
        }
    }

    /**
     * Loads saved settings from localStorage and applies them to the UI.
     */
    function loadSettings() {
        const savedPages = localStorage.getItem(LS_PAGES_KEY);
        if (savedPages) {
            pageRangeInput.value = savedPages;
        }
    }

    // --- SCRIPT INITIALIZATION ---

    filterButton.addEventListener('click', handleFilter);
    copyUrlsButton.addEventListener('click', handleCopyUrls);
    collapseButton.addEventListener('click', togglePanelCollapse);

    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('custompushstate'));
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('customreplacestate'));
    };
    window.addEventListener('popstate', handleUrlChangeAndSetStatus);
    window.addEventListener('custompushstate', handleUrlChangeAndSetStatus);
    window.addEventListener('customreplacestate', handleUrlChangeAndSetStatus);

    const initiallyCollapsed = localStorage.getItem(LS_COLLAPSE_KEY) === 'true';
    if (initiallyCollapsed) {
        togglePanelCollapse();
    }

    loadSettings();
    handleUrlChangeAndSetStatus();

})();