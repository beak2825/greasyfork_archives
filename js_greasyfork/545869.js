// ==UserScript==
// @name         Google Maps Enhanced Photos
// @namespace    https://github.com/gncnpk/google-maps-enhanced-photos
// @version      0.0.3
// @description  Filter photos and videos in Google Maps contributions
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://www.google.com/maps/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com/maps
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545869/Google%20Maps%20Enhanced%20Photos.user.js
// @updateURL https://update.greasyfork.org/scripts/545869/Google%20Maps%20Enhanced%20Photos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInit = false;
    let oldHref = document.location.href;

    // Store observers for cleanup
    let containerObserver = null;

    // UI elements
    let popup, filterContainer, placeFilterContainer;
    let autoLoadEnabled = false;
    let currentFilter = 'all'; // 'all', 'photos', 'videos'
    let currentPlaceFilter = 'all'; // 'all' or specific place name

    // Container references
    let contentContainer = null;
    let scrollContainer = null;

    // Most viewed element tracking
    let mostViewedElement = null;
    let mostViewedCount = 0;

    // Place tracking
    let availablePlaces = new Set();

    // Multi-language photo and video keywords
    const PHOTO_KEYWORDS = [
        // English
        'photo', 'picture', 'image', 'pic',
        // German
        'foto', 'bild',
        // French
        'photo', 'image',
        // Spanish
        'foto', 'imagen',
        // Italian
        'foto', 'immagine',
        // Portuguese
        'foto', 'imagem',
        // Dutch
        'foto', 'afbeelding',
        // Russian
        'фото',
        // Japanese
        '写真', 'しゃしん',
        // Chinese (Simplified & Traditional)
        '照片', '相片',
        // Korean
        '사진',
        // Arabic
        'صورة',
        // Polish
        'zdjęcie', 'foto',
        // Czech
        'fotografie', 'obrázek',
        // Swedish
        'foto', 'bild',
        // Norwegian
        'foto', 'bilde',
        // Danish
        'foto', 'billede',
        // Finnish
        'kuva', 'valokuva',
        // Hungarian
        'fotó', 'kép',
        // Turkish
        'fotoğraf', 'resim',
        // Hebrew
        'תמונה'
    ];

    const VIDEO_KEYWORDS = [
        // English
        'video', 'movie', 'clip',
        // German
        'video', 'film',
        // French
        'vidéo', 'film',
        // Spanish
        'vídeo', 'video', 'película',
        // Italian
        'video', 'filmato',
        // Portuguese
        'vídeo', 'filme',
        // Dutch
        'video', 'film',
        // Russian
        'видео',
        // Japanese
        'ビデオ', '動画', 'びでお', 'どうが',
        // Chinese (Simplified & Traditional)
        '视频', '影片', '錄像',
        // Korean
        '비디오', '영상',
        // Arabic
        'فيديو',
        // Polish
        'wideo', 'film',
        // Czech
        'video', 'film',
        // Swedish
        'video', 'film',
        // Norwegian
        'video', 'film',
        // Danish
        'video', 'film',
        // Finnish
        'video', 'elokuva',
        // Hungarian
        'videó', 'film',
        // Turkish
        'video', 'film',
        // Hebrew
        'וידאו', 'סרטון'
    ];

    // Function to check if an aria-label contains photo keywords
    function hasPhotoKeyword(ariaLabel) {
        if (!ariaLabel) return false;
        const lowerLabel = ariaLabel.toLowerCase();
        return PHOTO_KEYWORDS.some(keyword =>
            lowerLabel.includes(keyword.toLowerCase())
        );
    }

    // Function to check if an aria-label contains video keywords
    function hasVideoKeyword(ariaLabel) {
        if (!ariaLabel) return false;
        const lowerLabel = ariaLabel.toLowerCase();
        return VIDEO_KEYWORDS.some(keyword =>
            lowerLabel.includes(keyword.toLowerCase())
        );
    }

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .photo-video-popup {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            padding: 15px;
            z-index: 9999;
            width: 250px;
            font-family: Arial, sans-serif;
            max-height: 80vh;
            overflow-y: auto;
        }
        .filter-btn {
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 8px 12px;
            margin: 4px 2px;
            cursor: pointer;
            font-size: 12px;
            width: calc(50% - 4px);
            display: inline-block;
            text-align: center;
        }
        .filter-btn.active {
            background: #4285f4;
            color: white;
            border-color: #4285f4;
        }
        .place-filter-select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
            margin-top: 5px;
            background: white;
        }
        .auto-load-btn, .scroll-to-most-viewed-btn {
            background: #34a853;
            border: none;
            border-radius: 4px;
            color: white;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
            width: 100%;
            margin-top: 8px;
        }
        .auto-load-btn.enabled {
            background: #ea4335;
        }
        .scroll-to-most-viewed-btn {
            background: #ff9800;
        }
        .scroll-to-most-viewed-btn:hover {
            background: #f57c00;
        }
        .scroll-to-most-viewed-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .drag-handle {
            cursor: move;
            font-weight: bold;
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .stats {
            line-height: 1.25em;
        }
        .most-viewed-info {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
            padding: 5px;
            background: #f9f9f9;
            border-radius: 3px;
        }
        .filter-section {
            margin-bottom: 15px;
        }
        .filter-header {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
        }
    `;
    document.head.appendChild(style);

    // Find content container (photos/videos grid)
    function findContentContainer() {
        // Look for the container that holds photos/videos
        const containers = document.querySelectorAll('.m6QErb.XiKgde');

        for (let container of containers) {
            // Check if container has photo/video items using our keyword functions
            const mediaElements = container.querySelectorAll('.xUc6Hf[aria-label]');
            const hasMedia = Array.from(mediaElements).some(el =>
                hasPhotoKeyword(el.getAttribute('aria-label')) ||
                hasVideoKeyword(el.getAttribute('aria-label'))
            );

            if (hasMedia && container.children.length > 5) { // Reasonable threshold
                return container;
            }
        }
        return null;
    }

    // Find scroll container
    function findScrollContainer() {
        if (contentContainer) {
            let container = contentContainer;
            while (container && container !== document.body) {
                const style = getComputedStyle(container);
                if ((style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                    container.scrollHeight > container.clientHeight) {
                    return container;
                }
                container = container.parentElement;
            }
        }

        // Fallback: find any scrollable container with media
        const scrollableElements = Array.from(document.querySelectorAll('*')).filter(el => {
            const style = getComputedStyle(el);
            const hasScrollableY = (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                el.scrollHeight > el.clientHeight;

            if (!hasScrollableY) return false;

            // Check for media using our keyword functions
            const mediaElements = el.querySelectorAll('.xUc6Hf[aria-label]');
            return Array.from(mediaElements).some(element =>
                hasPhotoKeyword(element.getAttribute('aria-label')) ||
                hasVideoKeyword(element.getAttribute('aria-label'))
            );
        });

        return scrollableElements.length > 0 ? scrollableElements[0] : null;
    }

    // Extract place name from a post element
    function getPlaceFromPost(postElement) {
        const placeElement = postElement.querySelector(".UwKPnd .fgD3Vc.fontTitleSmall");
        return placeElement ? placeElement.innerText.trim() : null;
    }

    // Scan all posts and collect unique places
    function updateAvailablePlaces() {
        if (!contentContainer) return;

        const newPlaces = new Set();

        Array.from(contentContainer.children).forEach(item => {
            const place = getPlaceFromPost(item);
            if (place) {
                newPlaces.add(place);
            }
        });

        // Check if places have changed
        const placesChanged = newPlaces.size !== availablePlaces.size ||
            [...newPlaces].some(place => !availablePlaces.has(place));

        availablePlaces = newPlaces;

        // Update place filter dropdown if places changed
        if (placesChanged) {
            updatePlaceFilterDropdown();
        }
    }

    // Update the place filter dropdown
    function updatePlaceFilterDropdown() {
        const placeSelect = popup?.querySelector('.place-filter-select');
        if (!placeSelect) return;

        const currentValue = placeSelect.value;
        placeSelect.innerHTML = '<option value="all">All Places</option>';

        const sortedPlaces = [...availablePlaces].sort();
        sortedPlaces.forEach(place => {
            const option = document.createElement('option');
            option.value = place;
            option.textContent = place;
            placeSelect.appendChild(option);
        });

        // Restore previous selection if it still exists
        if (currentValue && availablePlaces.has(currentValue)) {
            placeSelect.value = currentValue;
            currentPlaceFilter = currentValue;
        } else if (currentValue !== 'all') {
            // Reset to 'all' if previous selection no longer exists
            currentPlaceFilter = 'all';
            placeSelect.value = 'all';
        }
    }

    // Find element with most views (respecting current filters)
    function findMostViewedElement() {
        if (!contentContainer) {
            mostViewedElement = null;
            mostViewedCount = 0;
            return;
        }

        const viewElements = document.querySelectorAll("div.WqkvRc.fontBodySmall.BfMscf > div.HtPsUd");

        if (viewElements.length === 0) {
            mostViewedElement = null;
            mostViewedCount = 0;
            return;
        }

        let maxViews = 0;
        let maxElement = null;

        viewElements.forEach(element => {
            // Find the parent post container
            let postContainer = element;
            while (postContainer && !postContainer.parentElement?.classList.contains('m6QErb')) {
                postContainer = postContainer.parentElement;
            }

            // Skip if we can't find the post container or if it's hidden by the filter
            if (!postContainer || getComputedStyle(postContainer).display === 'none') {
                return;
            }

            const viewText = element.innerText.replace(/,/g, '');
            const views = parseInt(viewText.replace(/"|\,|\./g, ''));

            if (!isNaN(views) && views > maxViews) {
                maxViews = views;
                maxElement = element;
            }
        });

        mostViewedElement = maxElement;
        mostViewedCount = maxViews;
    }

    // Scroll to most viewed element
    function scrollToMostViewed() {
        if (!mostViewedElement || !scrollContainer) {
            return;
        }

        // Find the parent post container
        let postContainer = mostViewedElement;
        while (postContainer && !postContainer.matches('.m6QErb.XiKgde > *')) {
            postContainer = postContainer.parentElement;
        }

        if (postContainer) {
            // Scroll the element into view
            postContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Add temporary highlight effect
            const originalTransition = postContainer.style.transition;
            const originalBackground = postContainer.style.backgroundColor;

            postContainer.style.transition = 'background-color 0.3s ease';
            postContainer.style.backgroundColor = '#fff3cd';

            setTimeout(() => {
                postContainer.style.backgroundColor = originalBackground;
                setTimeout(() => {
                    postContainer.style.transition = originalTransition;
                }, 300);
            }, 1500);
        }
    }

    // Filter content based on selection
    function filterContent() {
        if (!contentContainer) return;

        // Scroll to top when filtering
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }

        Array.from(contentContainer.children).forEach(item => {
            // Use our keyword functions to detect photos and videos
            const mediaElements = item.querySelectorAll('.xUc6Hf[aria-label]');
            const hasPhoto = Array.from(mediaElements).some(el =>
                hasPhotoKeyword(el.getAttribute('aria-label'))
            );
            const hasVideo = Array.from(mediaElements).some(el =>
                hasVideoKeyword(el.getAttribute('aria-label'))
            );

            const itemPlace = getPlaceFromPost(item);

            let visible = true;

            // Apply media type filter
            switch (currentFilter) {
                case 'photos':
                    visible = hasPhoto;
                    break;
                case 'videos':
                    visible = hasVideo;
                    break;
                case 'all':
                default:
                    visible = true;
                    break;
            }

            // Apply place filter
            if (visible && currentPlaceFilter !== 'all') {
                visible = itemPlace === currentPlaceFilter;
            }

            item.style.display = visible ? '' : 'none';
        });

        updateStats();
    }

    // Update statistics
    function updateStats() {
        if (!contentContainer) return;

        const allItems = Array.from(contentContainer.children);
        const visibleItems = allItems.filter(item => getComputedStyle(item).display !== 'none');

        let photoCount = 0;
        let videoCount = 0;

        visibleItems.forEach(item => {
            const mediaElements = item.querySelectorAll('.xUc6Hf[aria-label]');

            Array.from(mediaElements).forEach(element => {
                const ariaLabel = element.getAttribute('aria-label');
                if (hasPhotoKeyword(ariaLabel)) {
                    photoCount++;
                } else if (hasVideoKeyword(ariaLabel)) {
                    videoCount++;
                }
            });
        });

        // Update available places
        updateAvailablePlaces();

        // Find most viewed element
        findMostViewedElement();

        const statsDiv = popup.querySelector('.stats');
        if (statsDiv) {
            let statsText = `${visibleItems.length} posts<br>${photoCount} photos<br>${videoCount} videos`;
            if (currentPlaceFilter !== 'all') {
                statsText += `<br>Place: ${currentPlaceFilter}`;
            }
            statsDiv.innerHTML = statsText;
        }

        // Update most viewed info
        const mostViewedInfo = popup.querySelector('.most-viewed-info');
        const scrollBtn = popup.querySelector('.scroll-to-most-viewed-btn');

        if (mostViewedInfo && scrollBtn) {
            if (mostViewedElement && mostViewedCount > 0) {
                mostViewedInfo.innerHTML = `Most viewed: ${mostViewedCount.toLocaleString()} views`;
                scrollBtn.disabled = false;
                scrollBtn.textContent = 'Go to Most Viewed';
            } else {
                mostViewedInfo.innerHTML = 'No view data found';
                scrollBtn.disabled = true;
                scrollBtn.textContent = 'No Views Found';
            }
        }

        // Auto-scroll if enabled
        if (autoLoadEnabled && scrollContainer) {
            setTimeout(() => {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }, 100);
        }
    }

    // Toggle auto load
    function toggleAutoLoad() {
        autoLoadEnabled = !autoLoadEnabled;

        const autoLoadBtn = popup.querySelector('.auto-load-btn');
        if (autoLoadBtn) {
            autoLoadBtn.textContent = autoLoadEnabled ? 'Disable Auto Load' : 'Enable Auto Load';
            autoLoadBtn.classList.toggle('enabled', autoLoadEnabled);
        }

        if (autoLoadEnabled && scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    // Make element draggable
    function makeDraggable(el, handleSelector) {
        const handle = el.querySelector(handleSelector);
        if (!handle) return;

        handle.style.cursor = 'move';
        let offsetX = 0, offsetY = 0;

        handle.addEventListener('pointerdown', e => {
            const r = el.getBoundingClientRect();
            el.style.left = `${r.left}px`;
            el.style.top = `${r.top}px`;
            el.style.right = 'auto';
            el.style.transform = 'none';
            offsetX = e.clientX - r.left;
            offsetY = e.clientY - r.top;
            el.setPointerCapture(e.pointerId);
            e.preventDefault();
        });

        el.addEventListener('pointermove', e => {
            if (!el.hasPointerCapture(e.pointerId)) return;
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        });

        ['pointerup', 'pointercancel'].forEach(evt => {
            el.addEventListener(evt, e => {
                if (el.hasPointerCapture(e.pointerId)) {
                    el.releasePointerCapture(e.pointerId);
                }
            });
        });
    }

    // Create popup UI
    function createPopup() {
        popup = document.createElement('div');
        popup.className = 'photo-video-popup';

        // Drag handle / stats
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats drag-handle';
        statsDiv.textContent = 'Photo/Video Filter';
        popup.appendChild(statsDiv);

        // Media type filter section
        const mediaFilterSection = document.createElement('div');
        mediaFilterSection.className = 'filter-section';

        const mediaFilterHeader = document.createElement('div');
        mediaFilterHeader.className = 'filter-header';
        mediaFilterHeader.textContent = 'Filter by Media Type';
        mediaFilterSection.appendChild(mediaFilterHeader);

        filterContainer = document.createElement('div');

        const filters = [
            { id: 'all', label: 'All' },
            { id: 'photos', label: 'Photos' },
            { id: 'videos', label: 'Videos' }
        ];

        filters.forEach(filter => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = filter.label;
            if (filter.id === currentFilter) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterContainer.querySelectorAll('.filter-btn').forEach(b =>
                    b.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                currentFilter = filter.id;
                filterContent();
            });

            filterContainer.appendChild(btn);
        });

        mediaFilterSection.appendChild(filterContainer);
        popup.appendChild(mediaFilterSection);

        // Place filter section
        const placeFilterSection = document.createElement('div');
        placeFilterSection.className = 'filter-section';

        const placeFilterHeader = document.createElement('div');
        placeFilterHeader.className = 'filter-header';
        placeFilterHeader.textContent = 'Filter by Place';
        placeFilterSection.appendChild(placeFilterHeader);

        const placeSelect = document.createElement('select');
        placeSelect.className = 'place-filter-select';
        placeSelect.innerHTML = '<option value="all">All Places</option>';

        placeSelect.addEventListener('change', (e) => {
            currentPlaceFilter = e.target.value;
            filterContent();
        });

        placeFilterSection.appendChild(placeSelect);
        popup.appendChild(placeFilterSection);

        // Most viewed info
        const mostViewedInfo = document.createElement('div');
        mostViewedInfo.className = 'most-viewed-info';
        mostViewedInfo.textContent = 'Searching for views...';
        popup.appendChild(mostViewedInfo);

        // Scroll to most viewed button
        const scrollToMostViewedBtn = document.createElement('button');
        scrollToMostViewedBtn.className = 'scroll-to-most-viewed-btn';
        scrollToMostViewedBtn.textContent = 'Go to Most Viewed';
        scrollToMostViewedBtn.addEventListener('click', scrollToMostViewed);
        popup.appendChild(scrollToMostViewedBtn);

        // Auto load button
        const autoLoadBtn = document.createElement('button');
        autoLoadBtn.className = 'auto-load-btn';
        autoLoadBtn.textContent = 'Enable Auto Load';
        autoLoadBtn.addEventListener('click', toggleAutoLoad);
        popup.appendChild(autoLoadBtn);

        document.body.appendChild(popup);
        makeDraggable(popup, '.drag-handle');
    }

    // Watch for container changes
    function setupContainerWatcher() {
        let retryCount = 0;
        const maxRetries = 30;

        function trySetup() {
            console.log(`Looking for content container (attempt ${retryCount + 1}/${maxRetries})`);

            const container = findContentContainer();
            if (!container) {
                retryCount++;
                if (retryCount < maxRetries) {
                    setTimeout(trySetup, 1000);
                } else {
                    console.warn('Could not find content container');
                }
                return;
            }

            console.log('Found content container:', container);
            contentContainer = container;
            scrollContainer = findScrollContainer();

            if (scrollContainer) {
                console.log('Found scroll container:', scrollContainer);
            }

            // Initial update
            updateStats();
            filterContent();

            // Watch for changes
            containerObserver = new MutationObserver(() => {
                updateStats();
                if (currentFilter !== 'all' || currentPlaceFilter !== 'all') {
                    filterContent();
                }
            });

            containerObserver.observe(contentContainer, {
                childList: true,
                subtree: true
            });
        }

        trySetup();
    }

    // Cleanup function
    function cleanup() {
        console.log('Cleaning up Photo/Video Filter');

        if (popup && popup.parentNode) {
            popup.parentNode.removeChild(popup);
            popup = null;
        }

        if (containerObserver) {
            containerObserver.disconnect();
            containerObserver = null;
        }

        contentContainer = null;
        scrollContainer = null;
        filterContainer = null;
        placeFilterContainer = null;
        autoLoadEnabled = false;
        currentFilter = 'all';
        currentPlaceFilter = 'all';
        mostViewedElement = null;
        mostViewedCount = 0;
        availablePlaces.clear();
        isInit = false;
    }

    // Check if we should initialize
    function checkInitState() {
        const shouldInit = window.location.href.includes('/contrib/') &&
                          window.location.href.includes('/photos');

        if (shouldInit && !isInit) {
            console.log('Initializing Photo/Video Filter');
            isInit = true;
            createPopup();
            setupContainerWatcher();
        } else if (!shouldInit && isInit) {
            cleanup();
        }
    }

    // Initialize on DOM ready and watch for URL changes
    document.addEventListener("DOMContentLoaded", function() {
        const bodyList = document.querySelector('body');

        const observer = new MutationObserver(function(mutations) {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                checkInitState();
            }
        });

        observer.observe(bodyList, {
            childList: true,
            subtree: true
        });

        checkInitState();
    });
})();
