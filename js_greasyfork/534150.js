// ==UserScript==
// @name            YouTube Temporary Playlist (Floating + Dockable + Drag&Drop + Autoplay)
// @name:de         YouTube Temporary Playlist (Floating + Dockable + Drag&Drop + Autoplay)
// @namespace       https://greasyfork.org/users/928242
// @version         1.2.0
// @description     A userscript that adds a floating, dockable playlist to YouTube with drag & drop functionality, autoplay, and cross-tab synchronization.
// @description:de  Ein Benutzerskript, das YouTube eine schwebende, andockbare Wiedergabeliste mit Drag & Drop-Funktionalität, Autoplay und tabübergreifender Synchronisierung hinzufügt.
// @author          Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match           https://www.youtube.com/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addValueChangeListener
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/534150/YouTube%20Temporary%20Playlist%20%28Floating%20%2B%20Dockable%20%2B%20DragDrop%20%2B%20Autoplay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534150/YouTube%20Temporary%20Playlist%20%28Floating%20%2B%20Dockable%20%2B%20DragDrop%20%2B%20Autoplay%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Fix for TrustedHTML issues in some browsers
     */
    if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: string => string
        });
    }

    /**
     * Constants and Configuration
     */
    const CONFIG = {
        // Storage keys for persistence across tabs/sessions
        STORAGE: {
            PLAYLIST: "tempPlaylist",
            AUTOPLAY: "playlistActive",
            POSITION: "tempPlaylistPos",
            DOCKED: "tempPlaylistDocked"
        },
        // UI settings
        UI: {
            DEFAULT_WIDTH: "400px",
            COLLAPSED_WIDTH: "200px",
            MAX_HEIGHT: "400px",
            MIN_HEIGHT: "40px",
            AUTO_HIDE_DELAY: 3000 // 3 seconds delay before auto-hiding
        }
    };

    /**
     * State variables
     */
    let state = {
        playlist: GM_getValue(CONFIG.STORAGE.PLAYLIST, []),
        autoplayEnabled: GM_getValue(CONFIG.STORAGE.AUTOPLAY, false),
        savedPos: GM_getValue(CONFIG.STORAGE.POSITION, { left: null, top: null }),
        isDocked: GM_getValue(CONFIG.STORAGE.DOCKED, false),
        collapsed: false,
        isDragging: false,
        currentDraggedVideoInfo: null,
        dragOffset: { x: 0, y: 0 },
        autoHideTimer: null,
        videoPlaying: false
    };

    /**
     * Creates and injects CSS styles for the playlist
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
        .autoPlaylistOverlay {
            position: fixed;
            background: rgba(0,0,0,0.85);
            color: white;
            padding: 10px;
            border-radius: 12px;
            z-index: 9999;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .autoPlaylistOverlay #playlist {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 100px;
            border: 1px dashed white;
            padding: 5px;
            overflow-y: auto;
            transition: max-height 0.5s ease;
            padding-bottom: 50px;
            scrollbar-width: thin;
            scrollbar-color: white transparent;
        }
        .autoPlaylistOverlay #playlist::-webkit-scrollbar {
            width: 6px;
        }
        .autoPlaylistOverlay #playlist::-webkit-scrollbar-thumb {
            background: white;
            border-radius: 10px;
        }
        .autoPlaylistOverlay button {
            padding: 5px 10px;
            background: rgba(255,255,255,0.1);
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: background 0.3s;
            font-weight: bold;
        }
        .autoPlaylistOverlay button:hover {
            background: rgba(255,255,255,0.3);
        }
        .autoPlaylistOverlay button[data-index] {
            padding: 5px;
            background: none;
            border: none;
            border-radius: 8px;
            color: red;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .autoPlaylistOverlay button[data-index]:hover {
            background: rgba(255, 0, 0, 0.2);
        }
        .playlist-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.05);
            transition: background 0.2s;
            cursor: pointer;
        }
        .playlist-item:hover {
            background: rgba(255,255,255,0.1);
        }
        `;
        document.head.appendChild(style);
    }

    /**
     * Creates the main floating overlay interface
     * @returns {Object} References to DOM elements
     */
    function createInterface() {
        const overlay = document.createElement('div');
        overlay.className = "autoPlaylistOverlay";
        overlay.innerHTML = `
            <div id="header" style="display:flex; justify-content:space-between; align-items:center; cursor:move;">
                <h3 id="overlayTitle" style="margin:0; font-size:16px;">AutoPlayList</h3>
                <button id="collapseButton" style="background:none; border:none; color:white; font-size:18px; cursor:pointer;">_</button>
            </div>
            <div id="playlist">Drag Videos Here</div>
            <div id="controls" style="display:flex; flex-wrap:wrap; justify-content:center; gap:5px;">
                <button id="addCurrentVideo" title="Add current video to playlist">Current Video</button>
                <button id="toggleAutoplay" title="Enables autplay for AutoPlayList after video end">Enable Autoplay</button>
                <button id="clearPlaylist" title="Delete all items in playlist">Clear Playlist</button>
                <button id="dockToggle" title="Toggle between docked and moveable overlay">Dock</button>
            </div>
        `;
        document.body.appendChild(overlay);

        return {
            overlay,
            playlistDiv: overlay.querySelector("#playlist"),
            addCurrentButton: overlay.querySelector("#addCurrentVideo"),
            toggleButton: overlay.querySelector("#toggleAutoplay"),
            clearButton: overlay.querySelector("#clearPlaylist"),
            dockButton: overlay.querySelector("#dockToggle"),
            collapseButton: overlay.querySelector("#collapseButton"),
            overlayTitle: overlay.querySelector("#overlayTitle"),
            controlsDiv: overlay.querySelector("#controls"),
            header: overlay.querySelector("#header")
        };
    }

    /**
     * Storage/Persistence methods
     */
    const storage = {
        savePlaylist: () => GM_setValue(CONFIG.STORAGE.PLAYLIST, state.playlist),
        saveAutoplayState: () => GM_setValue(CONFIG.STORAGE.AUTOPLAY, state.autoplayEnabled),
        savePosition: (left, top) => GM_setValue(CONFIG.STORAGE.POSITION, { left, top }),
        saveDockState: () => GM_setValue(CONFIG.STORAGE.DOCKED, state.isDocked)
    };

    /**
     * Updates the playlist container title with current count
     * @param {Object} elements - DOM elements references
     */
    function updateTitle(elements) {
        elements.overlayTitle.textContent = `AutoPlayList (${state.playlist.length})`;
    }

    /**
     * Applies docked or floating position based on current state
     * @param {Object} elements - DOM elements references
     */
    function applyDockState(elements) {
        const { overlay, dockButton } = elements;
        const { isDocked, collapsed } = state;

        if (isDocked) {
            overlay.style.position = 'fixed';
            overlay.style.top = 'unset';
            overlay.style.left = 'unset';
            overlay.style.bottom = '0';
            overlay.style.right = '10px';
            overlay.style.borderRadius = '12px 12px 0 0';
            overlay.style.width = collapsed ? CONFIG.UI.COLLAPSED_WIDTH : CONFIG.UI.DEFAULT_WIDTH;
            overlay.style.maxHeight = collapsed ? CONFIG.UI.MIN_HEIGHT : CONFIG.UI.MAX_HEIGHT;
            overlay.style.height = 'auto';
            overlay.style.padding = collapsed ? '5px 10px' : '10px';
            dockButton.textContent = 'Undock';
        } else {
            overlay.style.position = 'fixed';
            overlay.style.top = 'unset';
            overlay.style.left = 'unset';
            overlay.style.bottom = '20px';
            overlay.style.right = '20px';
            overlay.style.borderRadius = '12px';
            overlay.style.width = collapsed ? CONFIG.UI.COLLAPSED_WIDTH : CONFIG.UI.DEFAULT_WIDTH;
            overlay.style.maxHeight = collapsed ? CONFIG.UI.MIN_HEIGHT : CONFIG.UI.MAX_HEIGHT;
            overlay.style.height = 'auto';
            overlay.style.padding = collapsed ? '5px 10px' : '10px';
            dockButton.textContent = 'Dock';
        }
    }

    /**
     * Ensures the overlay stays within window boundaries
     * @param {Object} pos - Position coordinates
     * @param {Object} elements - DOM elements references
     * @returns {Object} Adjusted position coordinates
     */
    function clampPosition(pos, elements) {
        const overlayWidth = elements.overlay.offsetWidth;
        const overlayHeight = elements.overlay.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let left = pos.left;
        let top = pos.top;

        if (left < 0) left = 0;
        if (top < 0) top = 0;
        if (left + overlayWidth > windowWidth) left = windowWidth - overlayWidth-50;
        if (top + overlayHeight > windowHeight) top = windowHeight - overlayHeight-50;

        return { left, top };
    }

    /**
     * Renders the playlist items based on current state
     * @param {Object} elements - DOM elements references
     */
    function renderPlaylist(elements) {
        const { playlistDiv } = elements;

        updateTitle(elements);
        playlistDiv.innerHTML = '';

        if (state.playlist.length === 0) {
            playlistDiv.textContent = 'Drag Videos Here';
            return;
        }

        state.playlist.forEach((video, index) => {
            const thumbnailUrl = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

            const item = document.createElement('div');
            item.classList.add('playlist-item');
            item.draggable = true;
            item.dataset.index = index;

            item.innerHTML = `
                <div style="font-weight:bold; width:20px; text-align:center;">${index + 1}</div>
                <img src="${thumbnailUrl}" style="width: 80px; height: 45px; object-fit: cover; border-radius:4px;">
                <div style="flex:1; overflow:hidden;">
                    <div class="title" style="
                        font-size:14px;
                        font-weight:bold;
                        overflow:hidden;
                        display:-webkit-box;
                        -webkit-line-clamp:2;
                        -webkit-box-orient:vertical;
                        text-overflow: ellipsis;
                    ">${video.title}</div>
                    <div style="font-size:12px; color:lightgray;">${video.channel}</div>
                </div>
                <button data-index="${index}" style="color:red;">❌</button>
            `;

            setupPlaylistItemEvents(item, index, elements);
            playlistDiv.appendChild(item);
        });
    }

    /**
     * Sets up event handlers for playlist items
     * @param {HTMLElement} item - The playlist item element
     * @param {number} index - Index of the item in the playlist
     * @param {Object} elements - DOM elements references
     */
    function setupPlaylistItemEvents(item, index, elements) {
        let isItemDragging = false;

        // Drag & drop reordering
        item.addEventListener('dragstart', (e) => {
            isItemDragging = true;
            e.dataTransfer.setData('text/plain', index);
        });

        item.addEventListener('dragend', () => {
            isItemDragging = false;
        });

        // Play video on click
        item.addEventListener('click', (e) => {
            if (isItemDragging || e.target.tagName === 'BUTTON') return;
            window.location.href = state.playlist[index].url;
        });

        // Title expansion on hover
        item.addEventListener('mouseenter', () => {
            const title = item.querySelector('.title');
            title.style.overflow = 'visible';
            title.style.webkitLineClamp = 'unset';
        });

        item.addEventListener('mouseleave', () => {
            const title = item.querySelector('.title');
            title.style.overflow = 'hidden';
            title.style.webkitLineClamp = '2';
        });

        // Item reordering via drag & drop
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            item.style.background = 'rgba(255,255,255,0.1)';
        });

        item.addEventListener('dragleave', () => {
            item.style.background = 'rgba(255,255,255,0.05)';
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.style.background = 'rgba(255,255,255,0.05)';

            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const toIndex = parseInt(item.dataset.index, 10);

            if (fromIndex !== toIndex) {
                const movedItem = state.playlist.splice(fromIndex, 1)[0];
                state.playlist.splice(toIndex, 0, movedItem);
                storage.savePlaylist();
                renderPlaylist(elements);
            }
        });
    }

    /**
     * Sets up the overlay drag functionality with improved performance
     * @param {Object} elements - DOM elements references
     */
    function setupOverlayDrag(elements) {
        const { header, overlay } = elements;
        let rafId = null;

        // Use requestAnimationFrame for smooth rendering
        function updatePosition(x, y) {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }

            rafId = requestAnimationFrame(() => {
                const left = x - state.dragOffset.x;
                const top = y - state.dragOffset.y;

                overlay.style.left = `${left}px`;
                overlay.style.top = `${top}px`;
                overlay.style.bottom = 'unset';
                overlay.style.right = 'unset';

                rafId = null;
            });
        }

        header.addEventListener('mousedown', (e) => {
            if (state.isDocked || e.target.id === 'collapseButton') return;

            state.isDragging = true;

            // Calculate offset relative to the header
            const rect = overlay.getBoundingClientRect();
            state.dragOffset.x = e.clientX - rect.left;
            state.dragOffset.y = e.clientY - rect.top;

            // Make sure we're using fixed positioning
            overlay.style.position = 'fixed';
            overlay.style.bottom = 'unset';
            overlay.style.right = 'unset';

            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (state.isDocked || !state.isDragging) return;
            updatePosition(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', () => {
            if (!state.isDragging) return;

            state.isDragging = false;
            document.body.style.userSelect = '';

            if (!state.isDocked) {
                // Apply clamping to ensure we stay within window boundaries
                const left = parseFloat(overlay.style.left) || 0;
                const top = parseFloat(overlay.style.top) || 0;

                const finalPosition = clampPosition({
                    left: left,
                    top: top
                }, elements);

                // Apply the clamped position
                overlay.style.left = `${finalPosition.left}px`;
                overlay.style.top = `${finalPosition.top}px`;

                storage.savePosition(finalPosition.left, finalPosition.top);
            }
        });
    }

    /**
     * Sets up behavior for docking the overlay
     * @param {Object} elements - DOM elements references
     */
    function setupDockButton(elements) {
        const { dockButton } = elements;

        dockButton.addEventListener('click', () => {
            state.isDocked = !state.isDocked;
            storage.saveDockState();
            applyDockState(elements);
        });
    }

    /**
     * Sets up collapse/expand behavior
     * @param {Object} elements - DOM elements references
     */
    function setupCollapseButton(elements) {
        const { collapseButton, playlistDiv, controlsDiv, overlay } = elements;

        collapseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCollapse(elements);
        });
    }

    /**
     * Toggles the collapsed state of the playlist
     * @param {Object} elements - DOM elements references
     * @param {boolean} [forceCollapse] - Force a specific collapse state
     */
    function toggleCollapse(elements, forceCollapse = null) {
        const { playlistDiv, controlsDiv, overlay } = elements;

        if (forceCollapse !== null) {
            state.collapsed = forceCollapse;
        } else {
            state.collapsed = !state.collapsed;
        }

        if (state.collapsed) {
            playlistDiv.style.maxHeight = '0';
            playlistDiv.style.display = 'none';
            controlsDiv.style.display = 'none';
            overlay.style.width = CONFIG.UI.COLLAPSED_WIDTH;
            overlay.style.padding = '5px 10px';
            if (state.isDocked) {
                overlay.style.bottom = '0';
                overlay.style.right = '10px';
                overlay.style.borderRadius = '12px 12px 0 0';
            }
        } else {
            playlistDiv.style.maxHeight = '300px';
            playlistDiv.style.display = 'flex';
            controlsDiv.style.display = 'flex';
            overlay.style.width = CONFIG.UI.DEFAULT_WIDTH;
            overlay.style.padding = '10px';
            if (state.isDocked) {
                overlay.style.bottom = '0';
                overlay.style.right = '10px';
                overlay.style.borderRadius = '12px 12px 0 0';
            }
        }
    }

    /**
     * Sets up drag & drop to add videos to playlist
     * @param {Object} elements - DOM elements references
     */
    function setupPlaylistDrop(elements) {
        const { playlistDiv } = elements;

        // Handle dragover events
        playlistDiv.addEventListener('dragover', (e) => {
            e.preventDefault();
            playlistDiv.style.background = 'rgba(0, 150, 255, 0.2)';
            playlistDiv.style.border = '2px dashed #00f';
        });

        // Reset styles when drag leaves
        playlistDiv.addEventListener('dragleave', () => {
            playlistDiv.style.background = '';
            playlistDiv.style.border = '1px dashed white';
        });

        // Process dropped items
        playlistDiv.addEventListener('drop', (e) => {
            e.preventDefault();
            playlistDiv.style.background = '';
            playlistDiv.style.border = '1px dashed white';

            if (state.currentDraggedVideoInfo) {
                state.playlist.push(state.currentDraggedVideoInfo);
                storage.savePlaylist();
                renderPlaylist(elements);
                state.currentDraggedVideoInfo = null;
            } else {
                const data = e.dataTransfer.getData('text/plain');
                if (data && data.includes('youtube.com/watch')) {
                    const videoId = (new URL(data)).searchParams.get('v') || '';
                    state.playlist.push({
                        url: data,
                        id: videoId,
                        title: "Unknown Title",
                        channel: "Unknown Channel"
                    });
                    storage.savePlaylist();
                    renderPlaylist(elements);
                }
            }
        });
    }

    /**
     * Sets up delete functionality for playlist items
     * @param {Object} elements - DOM elements references
     */
    function setupPlaylistDelete(elements) {
        const { playlistDiv } = elements;

        playlistDiv.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' && e.target.hasAttribute('data-index')) {
                const idx = parseInt(e.target.getAttribute('data-index'), 10);
                if (!isNaN(idx)) {
                    state.playlist.splice(idx, 1);
                    storage.savePlaylist();
                    renderPlaylist(elements);
                }
                e.stopPropagation();
            }
        });
    }

    /**
     * Extracts current video information from the YouTube page
     * @returns {Object|null} Video information or null if not on a video page
     */
    function getCurrentVideoInfo() {
        // Check if we're on a video page
        if (!window.location.pathname.includes('/watch')) {
            return null;
        }

        try {
            // Get video ID from URL
            const videoId = new URL(window.location.href).searchParams.get('v');
            if (!videoId) return null;

            // Get video title
            const titleElement = document.querySelector('h1.ytd-watch-metadata');
            const title = titleElement ? titleElement.textContent.trim() : 'Unknown Title';

            // Get channel name
            const channelElement = document.querySelector('ytd-channel-name#channel-name a, #owner-name a');
            const channel = channelElement ? channelElement.textContent.trim() : 'Unknown Channel';

            return {
                url: window.location.href,
                id: videoId,
                title: title,
                channel: channel
            };
        } catch (error) {
            console.error("Error getting current video info:", error);
            return null;
        }
    }

    /**
     * Adds current video button to the controls
     * @param {Object} elements - DOM elements references
     */
    function setupCurrentVideoButton(elements) {
        const { addCurrentButton } = elements;

        // Add icon for better visibility
        addCurrentButton.innerHTML = `<span style="font-size:14px;">➕</span> Current Video`;

        // Setup click handler
        addCurrentButton.addEventListener('click', () => {
            const videoInfo = getCurrentVideoInfo();

            if (videoInfo) {
                // Check if video is already in playlist
                const existingIndex = state.playlist.findIndex(v => v.id === videoInfo.id);

                if (existingIndex >= 0) {
                    // Video already exists - provide visual feedback
                    addCurrentButton.textContent = 'Already Added';
                    addCurrentButton.style.background = 'rgba(255,255,255,0.2)';

                    // Reset button after a short delay
                    setTimeout(() => {
                        addCurrentButton.innerHTML = `<span style="font-size:14px;">➕</span> Current Video`;
                        addCurrentButton.style.background = 'rgba(255,255,255,0.1)';
                    }, 1500);

                    return;
                }

                // Add to playlist
                state.playlist.push(videoInfo);
                storage.savePlaylist();
                renderPlaylist(elements);

                // Provide visual feedback
                addCurrentButton.textContent = 'Added! ✓';
                addCurrentButton.style.background = 'rgba(0,255,0,0.2)';

                // Reset button after a short delay
                setTimeout(() => {
                    addCurrentButton.innerHTML = `<span style="font-size:14px;">➕</span> Current Video`;
                    addCurrentButton.style.background = 'rgba(255,255,255,0.1)';
                }, 1500);
            } else {
                // Not on a video page or couldn't get info
                addCurrentButton.textContent = 'No Video Found';
                addCurrentButton.style.background = 'rgba(255,0,0,0.2)';

                // Reset button after a short delay
                setTimeout(() => {
                    addCurrentButton.innerHTML = `<span style="font-size:14px;">➕</span> Current Video`;
                    addCurrentButton.style.background = 'rgba(255,255,255,0.1)';
                }, 1500);
            }
        });

        // Update button visibility based on page type
        function updateButtonVisibility() {
            const isVideoPage = window.location.pathname.includes('/watch');
            addCurrentButton.style.opacity = isVideoPage ? '1' : '0.5';
        }

        // Initial visibility update
        updateButtonVisibility();

        // Listen for navigation changes
        const observer = new MutationObserver(() => {
            updateButtonVisibility();
        });

        observer.observe(document.querySelector('head > title'), { subtree: true, characterData: true, childList: true });
    }

    /**
     * Sets up autoplay toggle functionality
     * @param {Object} elements - DOM elements references
     */
    function setupAutoplayToggle(elements) {
        const { toggleButton } = elements;

        toggleButton.addEventListener('click', () => {
            state.autoplayEnabled = !state.autoplayEnabled;
            toggleButton.textContent = state.autoplayEnabled ? "Disable Autoplay" : "Enable Autoplay";
            storage.saveAutoplayState();
        });
    }

    /**
     * Sets up playlist clear button
     * @param {Object} elements - DOM elements references
     */
    function setupClearButton(elements) {
        const { clearButton } = elements;

        clearButton.addEventListener('click', () => {
            state.playlist = [];
            storage.savePlaylist();
            renderPlaylist(elements);
        });
    }

    /**
     * Sets up autoplay functionality for videos
     */
    function setupVideoAutoplay() {
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (!video) return;

            video.addEventListener('ended', () => {
                if (!state.autoplayEnabled || state.playlist.length === 0) return;

                const currentUrl = location.href;
                const nextIndex = state.playlist.findIndex(v => currentUrl.includes(v.id));

                if (nextIndex >= 0 && nextIndex < state.playlist.length - 1) {
                    // Add a small delay before navigating to next video
                    setTimeout(() => {
                        window.location.href = state.playlist[nextIndex + 1].url;
                    }, 300);
                } else {
                    state.autoplayEnabled = false;
                    storage.saveAutoplayState();
                    document.querySelector("#toggleAutoplay").textContent = "Enable Autoplay";
                }
            }, { once: true });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Setup auto-hide functionality when video is playing
     * @param {Object} elements - DOM elements references
     */
    function setupAutoHideOnPlay(elements) {
        const { overlay } = elements;

        // Video play/pause state detection
        const observeVideo = () => {
            const observer = new MutationObserver(() => {
                const video = document.querySelector('video');
                if (!video) return;

                // Setup play/pause event listeners if not already attached
                if (!video.dataset.playlistEventsBound) {
                    video.dataset.playlistEventsBound = "true";

                    // When video plays, dock and collapse after delay
                    video.addEventListener('play', () => {
                        state.videoPlaying = true;
                        // Clear any existing timer
                        if (state.autoHideTimer) {
                            clearTimeout(state.autoHideTimer);
                        }

                        // Set timer to hide after delay
                        state.autoHideTimer = setTimeout(() => {
                            if (!state.isDocked) {
                                state.isDocked = true;
                                storage.saveDockState();
                                applyDockState(elements);
                            }

                            if (!state.collapsed) {
                                toggleCollapse(elements, true); // Force collapse
                            }
                        }, CONFIG.UI.AUTO_HIDE_DELAY);
                    });

                    // When video pauses, show the playlist again
                    video.addEventListener('pause', () => {
                        state.videoPlaying = false;

                        // Clear any hide timer
                        if (state.autoHideTimer) {
                            clearTimeout(state.autoHideTimer);
                            state.autoHideTimer = null;
                        }

                        // Only expand if it was auto-collapsed (while playing)
                        if (state.collapsed && !state.isDragging) {
                            toggleCollapse(elements, false); // Force expand
                        }
                    });
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        };

        // Start observing for video elements
        observeVideo();

        // Also handle navigation events to reattach listeners
        window.addEventListener('yt-navigate-finish', () => {
            // Reset bound state so we can reattach listeners
            const video = document.querySelector('video');
            if (video) {
                delete video.dataset.playlistEventsBound;
            }
            observeVideo();
        });
    }

    /**
     * Sets up handling for YouTube video dragging
     */
    function setupYouTubeDragHandling() {
        document.addEventListener('dragstart', (e) => {
            const videoEl = e.target.closest('ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer');
            if (videoEl) {
                const anchor = videoEl.querySelector('a[href*="/watch?v="]');
                if (!anchor) return;

                const videoUrl = anchor.href;
                const videoId = (new URL(videoUrl)).searchParams.get('v') || '';

                const titleEl = videoEl.querySelector('#video-title, yt-formatted-string#video-title');
                const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';

                const channelEl = videoEl.querySelector('ytd-channel-name a, .ytd-channel-name #text');
                const channel = channelEl ? channelEl.textContent.trim() : 'Unknown Channel';

                state.currentDraggedVideoInfo = {
                    url: videoUrl,
                    id: videoId,
                    title: title,
                    channel: channel
                };
            }
        });
    }

    /**
     * Sets up synchronization across tabs
     * @param {Object} elements - DOM elements references
     */
    function setupCrossBrowserSync(elements) {
        GM_addValueChangeListener(CONFIG.STORAGE.PLAYLIST, (_, __, newValue) => {
            state.playlist = newValue;
            renderPlaylist(elements);
        });

        GM_addValueChangeListener(CONFIG.STORAGE.AUTOPLAY, (_, __, newValue) => {
            state.autoplayEnabled = newValue;
            elements.toggleButton.textContent = state.autoplayEnabled ? "Disable Autoplay" : "Enable Autoplay";
        });

        GM_addValueChangeListener(CONFIG.STORAGE.POSITION, (_, __, newValue) => {
            if (state.isDocked) return;
            const clamped = clampPosition(newValue, elements);
            elements.overlay.style.left = `${clamped.left}px`;
            elements.overlay.style.top = `${clamped.top}px`;
        });

        GM_addValueChangeListener(CONFIG.STORAGE.DOCKED, (_, __, newValue) => {
            state.isDocked = newValue;
            applyDockState(elements);
        });
    }

    /**
     * Handles window resize events
     * @param {Object} elements - DOM elements references
     */
    function setupWindowEvents(elements) {
        const { overlay } = elements;

        // Handle window resize
        window.addEventListener('resize', () => {
            if (state.isDocked) return;
            const clamped = clampPosition({ left: overlay.offsetLeft, top: overlay.offsetTop }, elements);
            overlay.style.left = `${clamped.left}px`;
            overlay.style.top = `${clamped.top}px`;
            storage.savePosition(clamped.left, clamped.top);
        });

        // Hide overlay during fullscreen video
        document.addEventListener('fullscreenchange', () => {
            const isFullscreen = !!document.fullscreenElement;
            overlay.style.display = isFullscreen ? 'none' : 'flex';
        });
    }

    /**
     * Restores the overlay position from saved state
     * @param {Object} elements - DOM elements references
     */
    function restorePosition(elements) {
        const { overlay } = elements;
        const { savedPos } = state;

        if (!state.isDocked && savedPos.left !== null && savedPos.top !== null) {
            const clamped = clampPosition(savedPos, elements);
            overlay.style.left = `${clamped.left}px`;
            overlay.style.top = `${clamped.top}px`;
            overlay.style.bottom = 'unset';
            overlay.style.right = 'unset';
        }
    }

    /**
     * Main initialization function
     */
    function init() {
        // Setup UI
        injectStyles();
        const elements = createInterface();

        // Apply initial state
        applyDockState(elements);
        renderPlaylist(elements);
        restorePosition(elements);

        // Set initial autoplay button text
        elements.toggleButton.textContent = state.autoplayEnabled ? "Disable Autoplay" : "Enable Autoplay";

        // Setup event handlers
        setupOverlayDrag(elements);
        setupCollapseButton(elements);
        setupPlaylistDrop(elements);
        setupPlaylistDelete(elements);
        setupCurrentVideoButton(elements);
        setupAutoplayToggle(elements);
        setupClearButton(elements);
        setupDockButton(elements);
        setupVideoAutoplay();
        setupAutoHideOnPlay(elements);
        setupYouTubeDragHandling();
        setupCrossBrowserSync(elements);
        setupWindowEvents(elements);
    }

    // Start everything
    init();
})();
