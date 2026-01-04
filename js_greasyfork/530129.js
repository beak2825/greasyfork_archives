// ==UserScript==
// @name              YouTubeSortByDuration
// @namespace         https://github.com/cloph-dsp/YouTubeSortByDuration
// @version           4.2
// @description       Supercharges your playlist management by sorting videos by duration.
// @author            cloph-dsp
// @originalAuthor    KohGeek
// @license           GPL-2.0-only
// @homepageURL       https://github.com/cloph-dsp/YouTubeSortByDuration
// @supportURL        https://github.com/cloph-dsp/YouTubeSortByDuration/issues
// @match             http://*.youtube.com/*
// @match             https://*.youtube.com/*
// @require           https://greasyfork.org/scripts/374849-library-onelementready-es7/code/Library%20%7C%20onElementReady%20ES7.js
// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/530129/YouTubeSortByDuration.user.js
// @updateURL https://update.greasyfork.org/scripts/530129/YouTubeSortByDuration.meta.js
// ==/UserScript==

// CSS styles
const css = `
    /* Container wrapper */
    .sort-playlist {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px;
        padding: 12px;
        background-color: var(--yt-spec-base-background);
        border-bottom: 1px solid var(--yt-spec-10-percent-layer);
        width: 100%;
        box-sizing: border-box;
    }
    /* Controls grouping */
    .sort-playlist-controls {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    /* Sort button wrapper */
    #sort-toggle-button {
        padding: 8px 16px;
        font-size: 14px;
        white-space: nowrap;
        cursor: pointer;
        background: none;
        outline: none;
    }
    /* Start (green) state */
    .sort-button-start {
        background-color: #28a745;
        color: #fff;
        border: 1px solid #28a745;
        border-radius: 4px;
        transition: background-color 0.3s, transform 0.2s;
    }
    .sort-button-start:hover {
        background-color: #218838;
        transform: translateY(-1px);
    }
    /* Stop (red) state */
    .sort-button-stop {
        background-color: #dc3545;
        color: #fff;
        border: 1px solid #dc3545;
        border-radius: 4px;
        transition: background-color 0.3s, transform 0.2s;
    }
    .sort-button-stop:hover {
        background-color: #c82333;
        transform: translateY(-1px);
    }
    /* Dropdown selector styling */
    .sort-select {
        padding: 6px 12px;
        font-size: 14px;
        border: 1px solid var(--yt-spec-10-percent-layer);
        border-radius: 4px;
        background-color: var(--yt-spec-base-background);
        color: var(--yt-spec-text-primary); /* ensure text is visible */
        transition: border-color 0.2s;
    }
    .sort-select option { color: var(--yt-spec-text-primary); }
    .sort-select:focus {
        border-color: var(--yt-spec-brand-link-text);
        box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.3);
        outline: none;
    }
    /* Status log element */
    .sort-log {
        margin-left: auto;
        padding: 6px 12px;
        font-size: 13px;
        background-color: var(--yt-spec-base-background);
        border: 1px solid var(--yt-spec-10-percent-layer);
        border-radius: 4px;
        color: var(--yt-spec-text-primary);
        white-space: nowrap;
    }
`

const modeAvailable = [
    { value: 'asc', label: 'by Shortest' },
    { value: 'desc', label: 'by Longest' }
];

const debug = false;

// Config
let isSorting = false;
let scrollLoopTime = 500;
let useAdaptiveDelay = true;
let baseDelayPerVideo = 5;
let minDelay = 10;
let maxDelay = 1000;
let fastModeThreshold = 200;

let sortMode = 'asc';
let autoScrollInitialVideoList = true;
let log = document.createElement('div');
let stopSort = false;

// Fire mouse event at coordinates
let fireMouseEvent = (type, elem, centerX, centerY) => {
    const event = new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: centerX,
        clientY: centerY
    });

    elem.dispatchEvent(event);
};

// Simulate drag between elements
let simulateDrag = (elemDrag, elemDrop) => {
    // Get positions
    let pos = elemDrag.getBoundingClientRect();
    let center1X = Math.floor((pos.left + pos.right) / 2);
    let center1Y = Math.floor((pos.top + pos.bottom) / 2);
    pos = elemDrop.getBoundingClientRect();
    let center2X = Math.floor((pos.left + pos.right) / 2);
    let center2Y = Math.floor((pos.top + pos.bottom) / 2);

    // Mouse events for dragged element
    fireMouseEvent("mousemove", elemDrag, center1X, center1Y);
    fireMouseEvent("mouseenter", elemDrag, center1X, center1Y);
    fireMouseEvent("mouseover", elemDrag, center1X, center1Y);
    fireMouseEvent("mousedown", elemDrag, center1X, center1Y);

    // Start drag
    fireMouseEvent("dragstart", elemDrag, center1X, center1Y);
    fireMouseEvent("drag", elemDrag, center1X, center1Y);
    fireMouseEvent("mousemove", elemDrag, center1X, center1Y);
    fireMouseEvent("drag", elemDrag, center2X, center2Y);
    fireMouseEvent("mousemove", elemDrop, center2X, center2Y);

    // Events over drop target
    fireMouseEvent("mouseenter", elemDrop, center2X, center2Y);
    fireMouseEvent("dragenter", elemDrop, center2X, center2Y);
    fireMouseEvent("mouseover", elemDrop, center2X, center2Y);
    fireMouseEvent("dragover", elemDrop, center2X, center2Y);

    // Complete drop
    fireMouseEvent("drop", elemDrop, center2X, center2Y);
    fireMouseEvent("dragend", elemDrag, center2X, center2Y);
    fireMouseEvent("mouseup", elemDrag, center2X, center2Y);
};

// Scroll to position or page bottom
let autoScroll = async (scrollTop = null) => {
    const element = document.scrollingElement;
    const destination = scrollTop !== null ? scrollTop : element.scrollHeight;
    element.scrollTop = destination;
    logActivity(`Scrolling page... 📜`);
    await new Promise(r => setTimeout(r, scrollLoopTime));
};

// Log message to UI
let logActivity = (message) => {
    if (log) {
        log.innerText = message;
    }
    if (debug) {
        console.log(message);
    }
};

// Create UI container
let renderContainerElement = () => {
    // Remove old container if any
    const existing = document.querySelector('.sort-playlist');
    if (existing) existing.remove();

    // Create new container
    const element = document.createElement('div');
    element.className = 'sort-playlist';
    element.style.margin = '8px 0';

    const controls = document.createElement('div');
    controls.className = 'sort-playlist-controls';
    element.appendChild(controls);

    // Insert above playlist video list
    const list = document.querySelector('ytd-playlist-video-list-renderer');
    if (list && list.parentNode) {
        list.parentNode.insertBefore(element, list);
    } else {
        console.error('Playlist video list not found for UI injection');
    }
};

// Create sort toggle button
let renderToggleButton = () => {
    const element = document.createElement('button');
    element.id = 'sort-toggle-button';
    element.className = 'style-scope sort-button-toggle sort-button-start';
    element.innerText = 'Sort Videos';
    
    element.onclick = async () => {
        if (!isSorting) {
            // Start
            isSorting = true;
            element.className = 'style-scope sort-button-toggle sort-button-stop';
            element.innerText = 'Stop Sorting';
            await activateSort();
            // Reset
            isSorting = false;
            element.className = 'style-scope sort-button-toggle sort-button-start';
            element.innerText = 'Sort Videos';
        } else {
            // Stop
            stopSort = true;
            isSorting = false;
            element.className = 'style-scope sort-button-toggle sort-button-start';
            element.innerText = 'Sort Videos';
        }
    };

    document.querySelector('.sort-playlist-controls').appendChild(element);
};

// Create dropdown selector
let renderSelectElement = (variable = 0, options = [], label = '') => {
    const element = document.createElement('select');
    element.className = 'style-scope sort-select';
    element.onchange = (e) => {
        if (variable === 0) {
            sortMode = e.target.value;
        } else if (variable === 1) {
            autoScrollInitialVideoList = e.target.value;
        }
    };

    options.forEach((option) => {
        const optionElement = document.createElement('option')
        optionElement.value = option.value
        optionElement.innerText = option.label
        element.appendChild(optionElement)
    });

    document.querySelector('.sort-playlist-controls').appendChild(element);
};

// Create number input
let renderNumberElement = (defaultValue = 0, label = '') => {
    const elementDiv = document.createElement('div');
    elementDiv.className = 'sort-playlist-div sort-margin-right-3px';
    elementDiv.innerText = label;

    const element = document.createElement('input');
    element.type = 'number';
    element.value = defaultValue;
    element.className = 'style-scope';
    element.oninput = (e) => { scrollLoopTime = +(e.target.value) };

    elementDiv.appendChild(element);
    document.querySelector('div.sort-playlist').appendChild(elementDiv);
};

// Create status log display
let renderLogElement = () => {
    log.className = 'style-scope sort-log';
    log.innerText = 'Please wait for the playlist to fully load before sorting...';
    document.querySelector('div.sort-playlist').appendChild(log);
};

// Add CSS to page
let addCssStyle = () => {
    const element = document.createElement('style');
    element.textContent = css;
    document.head.appendChild(element);
};

// Wait for YouTube to process drag
let waitForYoutubeProcessing = async () => {
    const maxWaitTime = Math.max(scrollLoopTime * 3, 1000);
    const startTime = Date.now();
    let isProcessed = false;
    
    logActivity(`Rearranging playlist... ⏳`);
    
    // Fast polling
    const pollInterval = Math.min(50, Math.max(25, scrollLoopTime * 0.1));
    
    while (!isProcessed && Date.now() - startTime < maxWaitTime && !stopSort) {
        await new Promise(r => setTimeout(r, pollInterval));
        
        const allDragPoints = document.querySelectorAll("ytd-item-section-renderer:first-of-type yt-icon#reorder");
        const currentItems = document.querySelectorAll("ytd-item-section-renderer:first-of-type div#content a#thumbnail.inline-block.ytd-thumbnail");
        
        if (allDragPoints.length > 0 && currentItems.length > 0 && 
            document.querySelectorAll('.ytd-continuation-item-renderer').length === 0) {
            isProcessed = true;
            const timeTaken = Date.now() - startTime;
            if (timeTaken > 1000) {
                logActivity(`Video moved successfully ✓`);
            }
            
            // Stabilization wait
            await new Promise(r => setTimeout(r, Math.min(180, scrollLoopTime * 0.25)));
            return true;
        }
    }
    
    // Recovery methods

    // Fast recovery approach
    if (!isProcessed) {
        logActivity(`Ensuring YouTube updates... ⏱️`);
        
        // Click body to refocus
        document.body.click();
        await new Promise(r => setTimeout(r, 275));
        
        // Check results
        let updatedDragPoints = document.querySelectorAll("ytd-item-section-renderer:first-of-type yt-icon#reorder");
        let allThumbnails = document.querySelectorAll("ytd-item-section-renderer:first-of-type div#content a#thumbnail.inline-block.ytd-thumbnail");
        
        if (updatedDragPoints.length > 0 && allThumbnails.length > 0) {
            logActivity(`Recovered playlist view ✓`);
            await new Promise(r => setTimeout(r, 540));
            
            // Force refresh
            window.dispatchEvent(new Event('resize'));
            await new Promise(r => setTimeout(r, 180));
            
            return true;
        }
        
        // Try faster recovery (2 attempts)
        for (let i = 0; i < 2 && !stopSort; i++) {
            const areas = [
                document.querySelector('.playlist-items'), 
                document.body
            ];
            
            // Click areas
            for (const area of areas) {
                if (area && !stopSort) {
                    area.click();
                    await new Promise(r => setTimeout(r, 125));
                }
            }
            
            // Slight scroll
            if (!stopSort) {
                const scrollElem = document.scrollingElement;
                const currentPos = scrollElem.scrollTop;
                scrollElem.scrollTop = currentPos + 10; 
                await new Promise(r => setTimeout(r, 125));
                scrollElem.scrollTop = currentPos;
            }
            
            // Check if successful
            updatedDragPoints = document.querySelectorAll("ytd-item-section-renderer:first-of-type yt-icon#reorder");
            allThumbnails = document.querySelectorAll("ytd-item-section-renderer:first-of-type div#content a#thumbnail.inline-block.ytd-thumbnail");
            
            if (updatedDragPoints.length > 0 && allThumbnails.length > 0) {
                logActivity(`Recovered after attempt ${i+1} ✓`);
                await new Promise(r => setTimeout(r, (540 + i * 125)));
                
                // Force refresh
                window.dispatchEvent(new Event('resize'));
                await new Promise(r => setTimeout(r, 175));
                
                return true;
            }
            
            await new Promise(r => setTimeout(r, 315 + i * 175));
        }
        
        // Final fallback
        if (!stopSort) {
            logActivity(`Attempting final recovery method...`);
            
            document.body.click();
            await new Promise(r => setTimeout(r, 225));
            
            const playlistHeader = document.querySelector('ytd-playlist-header-renderer');
            if (playlistHeader) playlistHeader.click();
            
            await new Promise(r => setTimeout(r, 725));
            // Final check
            updatedDragPoints = document.querySelectorAll("ytd-item-section-renderer:first-of-type yt-icon#reorder");
            allThumbnails = document.querySelectorAll("ytd-item-section-renderer:first-of-type div#content a#thumbnail.inline-block.ytd-thumbnail");
            if (updatedDragPoints.length > 0 && allThumbnails.length > 0) {
                logActivity(`Final recovery successful ✓`);
                await new Promise(r => setTimeout(r, 700)); 
                // Force refresh
                window.dispatchEvent(new Event('resize'));
                await new Promise(r => setTimeout(r, 175));
                return true;
            }
            logActivity(`Recovery failed - skipping operation`);
            return false;
        }
    }
    return isProcessed;
};

// Check if playlist is fully loaded
let isPlaylistFullyLoaded = (reportedCount, loadedCount) => {
    const hasSpinner = document.querySelector('.ytd-continuation-item-renderer') !== null;
    return reportedCount === loadedCount && !hasSpinner;
};

// Check if YouTube page is ready
let isYouTubePageReady = () => {
    const playlistContainer = document.querySelector("ytd-playlist-video-list-renderer");
    const videoCountElement = document.querySelector("ytd-playlist-sidebar-primary-info-renderer #stats span:first-child");
    const dragPoints = playlistContainer ? playlistContainer.querySelectorAll("yt-icon#reorder") : [];
    
    // Spinner detection
    const spinnerElements = document.querySelectorAll('.ytd-continuation-item-renderer, yt-icon-button.ytd-continuation-item-renderer, .circle.ytd-spinner');
    const hasVisibleSpinner = Array.from(spinnerElements).some(el => {
        const rect = el.getBoundingClientRect();
        return (rect.width > 0 && rect.height > 0 && 
                rect.top >= 0 && rect.top <= window.innerHeight);
    });
    
    const reportedCount = videoCountElement ? parseInt(videoCountElement.innerText, 10) : 0;
    const loadedCount = dragPoints.length;
    const youtubeLoadLimit = 100;
    
    // Check readiness
    const basicElementsReady = playlistContainer && videoCountElement && reportedCount > 0 && loadedCount > 0;
    const hasEnoughVideos = loadedCount >= 95 || loadedCount === reportedCount;
    const fullyLoaded = (!hasVisibleSpinner && hasEnoughVideos) || 
                         (loadedCount >= 0.97 * Math.min(reportedCount, youtubeLoadLimit));
    
    const isReady = basicElementsReady && fullyLoaded;
    
    // Show status
    if (isReady) {
        if (loadedCount < reportedCount) {
            logActivity(`✅ Ready: ${loadedCount}/${reportedCount} videos (YT limit)`);
        } else {
            logActivity(`✅ Ready: ${loadedCount}/${reportedCount} videos`);
        }
    } else if (basicElementsReady) {
        if (hasVisibleSpinner) {
            logActivity(`⏳ Loading: ${loadedCount}/${reportedCount} videos`);
        } else if (loadedCount < reportedCount && loadedCount > 0) {
            logActivity(`🔄 Waiting to scroll: ${loadedCount}/${reportedCount} videos`);
        } else {
            logActivity(`🔄 Waiting: ${loadedCount}/${reportedCount || '?'} videos`);
        }
    } else {
        logActivity(`🔄 Initializing...`);
    }
    return isReady;
};

let sortVideos = async (allAnchors, allDragPoints, expectedCount) => {
    // Verify playlist fully loaded
    if (allDragPoints.length !== expectedCount || allAnchors.length !== expectedCount) {
        logActivity("Playlist not fully loaded, waiting...");
        return -1;
    }
    // Build list of current handles with durations
    let list = [];
    for (let i = 0; i < expectedCount; i++) {
        // Handle missing duration text gracefully
        const txtElem = allAnchors[i].querySelector('#text');
        let timeSp = txtElem ? txtElem.innerText.trim().split(':').reverse() : [''];
        let t = timeSp.length === 1 ? (sortMode === 'asc' ? Infinity : -Infinity)
                : parseInt(timeSp[0]) + (timeSp[1] ? parseInt(timeSp[1]) * 60 : 0) + (timeSp[2] ? parseInt(timeSp[2]) * 3600 : 0);
        list.push({ handle: allDragPoints[i], time: t });
    }
    // Create sorted reference
    let sorted = [...list];
    sorted.sort((a, b) => sortMode === 'asc' ? a.time - b.time : b.time - a.time);
    // Find first mismatch and move
    for (let i = 0; i < expectedCount; i++) {
        if (list[i].handle !== sorted[i].handle) {
            let elemDrag = sorted[i].handle;
            let elemDrop = list[i].handle;
            logActivity(`Dragging video to position ${i}`);
            try {
                simulateDrag(elemDrag, elemDrop);
                if (useAdaptiveDelay && expectedCount > fastModeThreshold) {
                    // Fast static delay for large playlists
                    await new Promise(r => setTimeout(r, 100));
                } else {
                    await waitForYoutubeProcessing();
                }
            } catch (e) {
                console.error('Drag error:', e);
                logActivity('Error during move; retrying slowly... ⏳');
                // Fallback delay and retry
                await new Promise(r => setTimeout(r, scrollLoopTime));
            }
             // Return number of sorted items (index+1) to signal success
             return i + 1;
        }
    }
    // All in order
    return expectedCount;
}

// Main sorting function
let activateSort = async () => {
    // Reset scroll cap
    autoScrollAttempts = 0;
     // Set manual sorting mode
    const ensureManualSort = async () => {
        const sortButton = document.querySelector('yt-dropdown-menu[icon-label="Ordenar"] tp-yt-paper-button, yt-dropdown-menu[icon-label="Sort"] tp-yt-paper-button');
        if (!sortButton) {
            logActivity("Sort dropdown not found. Using current mode.");
            return;
        }
        
        // Check if dropdown is already open and close it first (clean state)
        const isDropdownOpen = document.querySelector('tp-yt-paper-listbox:not([hidden])');
        if (isDropdownOpen) {
            // Click away to close the dropdown
            document.body.click();
            await new Promise(r => setTimeout(r, 100));
        }
        
        // Open the dropdown menu
        logActivity("Opening sort dropdown...");
        sortButton.click();
        await new Promise(r => setTimeout(r, 200));
        
        // Verify dropdown is visible
        const dropdownMenu = document.querySelector('tp-yt-paper-listbox:not([hidden])');
        if (!dropdownMenu) {
            // Try once more if the dropdown didn't appear
            sortButton.click();
            await new Promise(r => setTimeout(r, 250));
        }
        
        // Ensure the dropdown is visible and select the manual option
        const manualOption = document.querySelector('tp-yt-paper-listbox a:first-child tp-yt-paper-item');
        if (manualOption) {
            // Check if already selected to avoid unnecessary clicks
            const isSelected = manualOption.hasAttribute('selected') || 
                              manualOption.classList.contains('iron-selected') ||
                              manualOption.getAttribute('aria-selected') === 'true';
            
            if (!isSelected) {
                manualOption.click();
                logActivity("Switched to Manual sort mode");
                await new Promise(r => setTimeout(r, 250));
            } else {
                logActivity("Manual sort mode already active");
            }
            
            // Ensure dropdown is closed by clicking away if still open
            const stillOpen = document.querySelector('tp-yt-paper-listbox:not([hidden])');
            if (stillOpen) {
                document.body.click();
                await new Promise(r => setTimeout(r, 100));
            }
            
            // Quick verification
            const verifySort = document.querySelector('.dropdown-trigger-text');
            if (verifySort && verifySort.textContent.toLowerCase().includes('manual')) {
                logActivity("Manual sort mode confirmed ✓");
            }
            
            return true;
        } else {
            // Fallback method if first item not found
            const allOptions = document.querySelectorAll('tp-yt-paper-listbox a tp-yt-paper-item');
            for (const option of allOptions) {
                if (option.textContent.toLowerCase().includes('manual')) {
                    option.click();
                    logActivity("Found and selected Manual sort mode");
                    await new Promise(r => setTimeout(r, 250));
                    
                    // Close dropdown
                    document.body.click();
                    return true;
                }
            }
            
            // Close dropdown if option not found
            document.body.click();
            logActivity("Manual sort option not found. Using current mode.");
            return false;
        }
    };

    const manualSortSet = await ensureManualSort();
    const videoCountElement = document.querySelector("ytd-playlist-sidebar-primary-info-renderer #stats span:first-child");
    let reportedVideoCount = videoCountElement ? parseInt(videoCountElement.innerText, 10) : 0;
    const playlistContainer = document.querySelector("ytd-playlist-video-list-renderer");
    let allDragPoints = playlistContainer ? playlistContainer.querySelectorAll("yt-icon#reorder") : [];
    let allAnchors;
    
    // Set optimal delay based on playlist size
    if (useAdaptiveDelay) {
        const needsScrolling = reportedVideoCount > 95 && allDragPoints.length < reportedVideoCount && autoScrollInitialVideoList;
        
        if (needsScrolling) {
            scrollLoopTime = Math.max(500, minDelay * 8);
            logActivity(`Using scroll-safe speed (${scrollLoopTime}ms)`);
        } else {
            let videoCount = reportedVideoCount || allDragPoints.length;
            
            if (videoCount <= fastModeThreshold) {
                let fastDelay = Math.max(75, baseDelayPerVideo * Math.sqrt(videoCount * 0.75));
                scrollLoopTime = Math.min(fastDelay, 350);
                logActivity(`Using fast mode: ${scrollLoopTime}ms}`);
            } else {
                let calculatedDelay = Math.max(100, baseDelayPerVideo * Math.log(videoCount) * 2.5);
                scrollLoopTime = Math.min(calculatedDelay, 800);
                logActivity(`Using adaptive delay: ${scrollLoopTime}ms}`);
            }
        }
    }
    
    let sortedCount = 0;
    let initialVideoCount = allDragPoints.length;
    let scrollRetryCount = 0;
    stopSort = false;
    let consecutiveRecoveryFailures = 0;
    let sortFailureCount = 0; // count sortVideos failures

    // Load all videos
    if (reportedVideoCount > allDragPoints.length && autoScrollInitialVideoList) {
        logActivity(`Playlist has ${reportedVideoCount} videos. Loading all...`);
        while (allDragPoints.length < reportedVideoCount && !stopSort && scrollRetryCount < 10) {
            await autoScroll();
            let newDragPoints = playlistContainer ? playlistContainer.querySelectorAll("yt-icon#reorder") : [];
            
            if (newDragPoints.length > allDragPoints.length) {
                allDragPoints = newDragPoints;
                scrollRetryCount = 0; // Reset on progress
                logActivity(`Loading videos (${allDragPoints.length}/${reportedVideoCount})`);
            } else {
                scrollRetryCount++;
                logActivity(`Scroll attempt ${scrollRetryCount}/10...`);
                await new Promise(r => setTimeout(r, 500 + scrollRetryCount * 100));
            }

            // Check for spinner
            const spinner = document.querySelector('.ytd-continuation-item-renderer');
            if (!spinner && allDragPoints.length < reportedVideoCount) {
                logActivity(`No spinner found, but not all videos loaded. Retrying...`);
                await new Promise(r => setTimeout(r, 1000));
            } else if (!spinner) {
                break; // Exit if no spinner and no new videos
            }
        }
    }


    initialVideoCount = allDragPoints.length;
    logActivity(initialVideoCount + " videos loaded for sorting.");
    if (scrollRetryCount >= 10) {
        logActivity("Max scroll attempts reached. Proceeding with available videos.");
    }
    
    let loadedLocation = document.scrollingElement.scrollTop;
    scrollRetryCount = 0;

    // Sort videos
    const sortStartTime = Date.now();
    const maxSortTime = 900000; // 15 minutes max

    // Check timeout
    if (Date.now() - sortStartTime > maxSortTime) {
        logActivity("Sorting timed out after 15 minutes.");
        return;
    }
    
    // Stall detection: break if no progress after multiple cycles
    let lastSortedCount = -1;
    let stallCount = 0;
    while (sortedCount < initialVideoCount && stopSort === false) {
        if (sortedCount === lastSortedCount) {
            stallCount++;
        } else {
            stallCount = 0;
            lastSortedCount = sortedCount;
        }
        if (stallCount >= 3) {
            logActivity('No further progress; ending sort to avoid hang');
            break;
        }
        
        sortFailureCount = 0;
        // Check timeout
        if (Date.now() - sortStartTime > maxSortTime) {
            logActivity("Sorting timed out after 15 minutes.");
            return;
        }
        
        // Reset after recovery failures
        if (consecutiveRecoveryFailures >= 3) {
            logActivity("Too many failures. Reattempting...");
            await new Promise(r => setTimeout(r, 1500));
            consecutiveRecoveryFailures = 0;
        }
        allDragPoints = playlistContainer ? playlistContainer.querySelectorAll("yt-icon#reorder") : [];
        allAnchors = playlistContainer ? playlistContainer.querySelectorAll("div#content a#thumbnail.inline-block.ytd-thumbnail") : [];
        scrollRetryCount = 0;

        // Ensure durations loaded (up to 3 auto-scroll attempts)
        let detailRetries = 0;
        while (!allAnchors[initialVideoCount - 1]?.querySelector("#text") && !stopSort && detailRetries < 3) {
            logActivity(`Loading video details... attempt ${detailRetries + 1}`);
            await autoScroll();
            // Refresh references
            allDragPoints = playlistContainer ? playlistContainer.querySelectorAll("yt-icon#reorder") : [];
            allAnchors = playlistContainer ? playlistContainer.querySelectorAll("div#content a#thumbnail.inline-block.ytd-thumbnail") : [];
            detailRetries++;
        }
        if (detailRetries >= 3) {
            logActivity("Proceeding without full duration details...");
            // Update expected count to actual loaded elements to avoid sort blocking
            initialVideoCount = allAnchors.length;
            allDragPoints = playlistContainer.querySelectorAll("yt-icon#reorder");
        }

         // Sort if elements available
         if (allAnchors.length > 0 && allDragPoints.length > 0) {
            // Perform sorting; negative indicates missing durations
            const res = await sortVideos(allAnchors, allDragPoints, initialVideoCount);
            if (res < 0) {
                sortFailureCount++;
                if (sortFailureCount >= 3) {
                    logActivity('Unable to load durations after multiple attempts; aborting sort');
                    sortedCount = initialVideoCount;
                    break;
                }
                logActivity(`Retrying due to missing data (${sortFailureCount}/3)...`);
                await autoScroll();
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }
             // Successful move
             sortedCount = res;
             consecutiveRecoveryFailures = 0;
        } else {
            logActivity("No video elements. Waiting...");
            await new Promise(r => setTimeout(r, 1500));
            consecutiveRecoveryFailures++;
        }
    }
    
    // Final status
    if (stopSort === true) {
        logActivity("Sorting canceled ⛔");
        stopSort = false;
    } else {
        logActivity(`Sorting complete ✓ (${sortedCount} videos)`);
        // Scroll to top to ensure the completion message is visible
        document.scrollingElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Initialize UI
let init = () => {
    onElementReady('ytd-playlist-video-list-renderer', false, () => {
        // Avoid duplicate
        if (document.querySelector('.sort-playlist')) return;

        autoScrollInitialVideoList = true;
        useAdaptiveDelay = true;

        addCssStyle();
        renderContainerElement();
        renderToggleButton();
        renderSelectElement(0, modeAvailable, 'Sort Order');
        renderLogElement();

        const checkInterval = setInterval(() => {
            if (isYouTubePageReady()) {
                logActivity('✓ Ready to sort');
                clearInterval(checkInterval);
            }
        }, 1000);
    });
};

// Initialize script
(() => {
    init();
    // Re-init UI on in-app navigation (guard for browsers without navigation API)
    if (window.navigation && typeof navigation.addEventListener === 'function') {
        navigation.addEventListener('navigate', () => {
            setTimeout(() => {
                if (!document.querySelector('.sort-playlist')) init();
            }, 500);
        });
    }
})();
