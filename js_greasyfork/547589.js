// ==UserScript==
// @name         Chaturbate Multi-Room Animator (Draggable + Minimizable)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Animate multiple Chaturbate rooms simultaneously with draggable/minimizable panel
// @author       You
// @match        https://chaturbate.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547589/Chaturbate%20Multi-Room%20Animator%20%28Draggable%20%2B%20Minimizable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547589/Chaturbate%20Multi-Room%20Animator%20%28Draggable%20%2B%20Minimizable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration with localStorage persistence
    let config = {
        simultaneousRooms: 5,
        animationSpeed: 2000,
        enabled: false,
        panelPosition: { x: null, y: null },
        isMinimized: false
    };

    // Drag state
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // Simple save function that definitely gets called
    function simpleSave() {
        try {
            localStorage.setItem('multiRoom_rooms', config.simultaneousRooms);
            localStorage.setItem('multiRoom_speed', config.animationSpeed);
            if (config.panelPosition.x !== null && config.panelPosition.y !== null) {
                localStorage.setItem('multiRoom_panel_x', config.panelPosition.x);
                localStorage.setItem('multiRoom_panel_y', config.panelPosition.y);
            }
            localStorage.setItem('multiRoom_minimized', config.isMinimized);
        } catch (e) {
            console.error('❌ Error saving settings:', e);
        }
    }

    // Simple load function
    function simpleLoad() {
        try {
            const rooms = localStorage.getItem('multiRoom_rooms');
            const speed = localStorage.getItem('multiRoom_speed');
            const panelX = localStorage.getItem('multiRoom_panel_x');
            const panelY = localStorage.getItem('multiRoom_panel_y');
            const minimized = localStorage.getItem('multiRoom_minimized');

            if (rooms) config.simultaneousRooms = parseInt(rooms);
            if (speed) {
                const loadedSpeed = parseInt(speed);
                // Ensure speed is within new bounds (10-500ms)
                config.animationSpeed = Math.max(10, Math.min(500, loadedSpeed));
            }
            if (panelX && panelY) {
                config.panelPosition.x = parseInt(panelX);
                config.panelPosition.y = parseInt(panelY);
            }
            if (minimized !== null) {
                config.isMinimized = minimized === 'true';
            }

            console.log('📋 Settings loaded:', {rooms: config.simultaneousRooms, speed: config.animationSpeed});
        } catch (e) {
            console.error('❌ Error loading settings:', e);
        }
    }

    let animationInterval;
    let roomElements = [];
    let controlPanel;
    let isPaused = false;
    let isCompletelyDisabled = false;
    let mutationObserver = null;

    // Create control panel
    function createControlPanel() {
        // Remove existing panel if it exists
        const existingPanel = document.getElementById('multi-room-animator-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        controlPanel = document.createElement('div');
        controlPanel.id = 'multi-room-animator-panel';

        // Determine initial position
        let initialX = config.panelPosition.x !== null ? config.panelPosition.x : (window.innerWidth - 250);
        let initialY = config.panelPosition.y !== null ? config.panelPosition.y : 10;

        controlPanel.style.cssText = `
            position: fixed;
            left: ${initialX}px;
            top: ${initialY}px;
            background: #1a1a1a;
            border: 2px solid #ff6b35;
            border-radius: 7px;
            padding: 0;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 13px;
            color: white;
            min-width: 224px;
            box-shadow: 0 3px 12px rgba(0,0,0,0.5);
            transform: scale(0.8);
            transform-origin: top left;
            user-select: none;
        `;

        // Create draggable title bar
        const titleBar = document.createElement('div');
        titleBar.id = 'panel-title-bar';
        titleBar.style.cssText = `
            padding: 8px 12px;
            cursor: move;
            background: linear-gradient(135deg, #ff6b35, #ff8555);
            border-radius: 5px 5px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const titleContainer = document.createElement('div');
        titleContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        const title = document.createElement('h3');
        title.style.cssText = 'margin: 0; color: white; font-size: 15px; pointer-events: none;';
        title.textContent = 'Multi-Room Animator';

        const dragIcon = document.createElement('span');
        dragIcon.style.cssText = 'color: rgba(255,255,255,0.7); pointer-events: none; font-size: 18px;';
        dragIcon.textContent = '⋮⋮';

        titleContainer.appendChild(title);
        titleContainer.appendChild(dragIcon);

        // Add minimize button
        const minimizeBtn = document.createElement('button');
        minimizeBtn.id = 'minimize-btn';
        minimizeBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 2px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.2s;
            min-width: 24px;
        `;
        minimizeBtn.textContent = config.isMinimized ? '+' : '−';
        minimizeBtn.title = config.isMinimized ? 'Restore' : 'Minimize';

        titleBar.appendChild(titleContainer);
        titleBar.appendChild(minimizeBtn);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.id = 'panel-content';
        contentContainer.style.cssText = 'padding: 12px;';
        if (config.isMinimized) {
            contentContainer.style.display = 'none';
        }

        // Create elements step by step
        const roomCountDiv = document.createElement('div');
        roomCountDiv.style.marginBottom = '9px';

        const roomCountLabel = document.createElement('label');
        roomCountLabel.style.cssText = 'display: block; margin-bottom: 4px; font-size: 12px;';
        roomCountLabel.textContent = 'Simultaneous rooms to animate:';

        const roomCountInput = document.createElement('input');
        roomCountInput.type = 'number';
        roomCountInput.id = 'simultaneous-room-count';
        roomCountInput.value = config.simultaneousRooms;
        roomCountInput.min = '1';
        roomCountInput.max = '50';
        roomCountInput.style.cssText = 'width: 48px; padding: 4px; background: #333; color: white; border: 1px solid #555; font-size: 12px;';

        const speedDiv = document.createElement('div');
        speedDiv.style.marginBottom = '9px';

        const speedLabel = document.createElement('label');
        speedLabel.style.cssText = 'display: block; margin-bottom: 4px; font-size: 12px;';
        speedLabel.innerHTML = `Refresh interval (ms): <span id="speed-display">${config.animationSpeed}</span>`;

        const speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.id = 'animation-speed';
        speedInput.value = config.animationSpeed;
        speedInput.min = '10';
        speedInput.max = '500';
        speedInput.step = '10';
        speedInput.style.cssText = 'width: 64px; padding: 4px; background: #333; color: white; border: 1px solid #555; font-size: 12px;';

        const buttonDiv = document.createElement('div');

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggle-animation';
        toggleBtn.textContent = 'Start';
        toggleBtn.style.cssText = `
            background: #ff6b35;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 4px;
            font-size: 12px;
        `;

        const disableBtn = document.createElement('button');
        disableBtn.id = 'disable-script';
        disableBtn.textContent = 'Disable';
        disableBtn.style.cssText = `
            background: #dc3545;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 4px;
            font-size: 12px;
        `;

        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = 'margin-top: 9px; font-size: 11px; color: #ccc;';
        statusDiv.innerHTML = `
            Status: <span id="status">Stopped</span><br>
            Rooms found: <span id="room-count-display">0</span><br>
            Animating: <span id="animating-display">-</span>
        `;

        // Assemble the panel
        roomCountDiv.appendChild(roomCountLabel);
        roomCountDiv.appendChild(roomCountInput);

        speedDiv.appendChild(speedLabel);
        speedDiv.appendChild(speedInput);

        buttonDiv.appendChild(toggleBtn);
        buttonDiv.appendChild(disableBtn);

        contentContainer.appendChild(roomCountDiv);
        contentContainer.appendChild(speedDiv);
        contentContainer.appendChild(buttonDiv);
        contentContainer.appendChild(statusDiv);

        controlPanel.appendChild(titleBar);
        controlPanel.appendChild(contentContainer);

        document.body.appendChild(controlPanel);

        // Setup minimize functionality
        minimizeBtn.onclick = (e) => {
            e.stopPropagation();
            config.isMinimized = !config.isMinimized;

            if (config.isMinimized) {
                contentContainer.style.display = 'none';
                minimizeBtn.textContent = '+';
                minimizeBtn.title = 'Restore';
            } else {
                contentContainer.style.display = 'block';
                minimizeBtn.textContent = '−';
                minimizeBtn.title = 'Minimize';
            }

            simpleSave();
        };

        // Setup drag functionality
        setupDragFunctionality(titleBar, minimizeBtn);

        // Setup event listeners immediately after creation
        setupEventListeners();
    }

    // Setup drag functionality for the panel
    function setupDragFunctionality(titleBar, minimizeBtn) {
        titleBar.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            if (e.target === minimizeBtn) return;
            e.preventDefault();
            isDragging = true;

            const rect = controlPanel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            controlPanel.style.opacity = '0.8';
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();

            let newX = e.clientX - dragOffset.x;
            let newY = e.clientY - dragOffset.y;

            const scale = 0.8;
            const panelWidth = controlPanel.offsetWidth * scale;
            const panelHeight = controlPanel.offsetHeight * scale;

            newX = Math.max(0, Math.min(newX, window.innerWidth - panelWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - panelHeight));

            controlPanel.style.left = newX + 'px';
            controlPanel.style.top = newY + 'px';

            config.panelPosition.x = newX;
            config.panelPosition.y = newY;
        }

        function stopDrag() {
            if (!isDragging) return;
            isDragging = false;
            controlPanel.style.opacity = '1';
            simpleSave();
        }
    }

    // Setup event listeners for control panel
    function setupEventListeners() {
        try {
            const toggleBtn = controlPanel.querySelector('#toggle-animation');
            const disableBtn = controlPanel.querySelector('#disable-script');
            const roomCountInput = controlPanel.querySelector('#simultaneous-room-count');
            const speedInput = controlPanel.querySelector('#animation-speed');

            if (toggleBtn) {
                toggleBtn.onclick = () => toggleAnimation();
            }

            if (disableBtn) {
                disableBtn.onclick = () => {
                    completelyDisableScript();
                };
            }

            if (speedInput) {
                speedInput.onchange = (e) => {
                    const newSpeed = parseInt(e.target.value);
                    config.animationSpeed = newSpeed;
                    simpleSave();
                    updateSpeedDisplay();
                    if (config.enabled) {
                        restartAnimation();
                    }
                };

                speedInput.oninput = (e) => {
                    const newSpeed = parseInt(e.target.value);
                    if (!isNaN(newSpeed)) {
                        config.animationSpeed = newSpeed;
                        simpleSave();
                        updateSpeedDisplay();
                        if (config.enabled) {
                            restartAnimation();
                        }
                    }
                };
            }

            if (roomCountInput) {
                roomCountInput.onchange = (e) => {
                    const newCount = parseInt(e.target.value);
                    config.simultaneousRooms = newCount;
                    simpleSave();
                    updateAnimatingDisplay();
                    if (config.enabled) {
                        restartAnimation();
                    }
                };

                roomCountInput.oninput = (e) => {
                    const newCount = parseInt(e.target.value);
                    if (!isNaN(newCount)) {
                        config.simultaneousRooms = newCount;
                        simpleSave();
                        updateAnimatingDisplay();
                        if (config.enabled) {
                            restartAnimation();
                        }
                    }
                };
            }

        } catch (error) {
            console.error('❌ Error in setupEventListeners:', error);
        }
    }

    // Update speed display
    function updateSpeedDisplay() {
        try {
            const speedDisplay = document.getElementById('speed-display');
            const speedInput = document.getElementById('animation-speed');

            if (speedDisplay) {
                speedDisplay.textContent = config.animationSpeed;
            }

            if (speedInput) {
                speedInput.value = config.animationSpeed;
            }
        } catch (error) {
            console.error('❌ Error updating speed display:', error);
        }
    }

    // Check if an element is meaningfully visible in the viewport
    function isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        // Calculate how much of the element is visible
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, windowHeight);
        const visibleLeft = Math.max(rect.left, 0);
        const visibleRight = Math.min(rect.right, windowWidth);

        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibleWidth = Math.max(0, visibleRight - visibleLeft);
        const visibleArea = visibleHeight * visibleWidth;

        const totalArea = rect.height * rect.width;
        const visibilityPercentage = totalArea > 0 ? (visibleArea / totalArea) : 0;

        // Element must be at least 50% visible and have substantial visible area
        return visibilityPercentage >= 0.5 && visibleHeight >= 100;
    }

    // Get visible rooms from all found rooms
    function getVisibleRooms() {
        if (roomElements.length === 0) return [];

        const visibleRooms = roomElements.filter(room => isElementVisible(room));

        return visibleRooms;
    }

    // Find room elements on the page
    function findRoomElements() {
        const selectors = [
            'li[class*="room"]',
            '.roomCard',
            'div[class*="room"]',
            '.room_list_room',
            '.room-card',
            '[data-room]'
        ];

        const previousCount = roomElements.length;
        roomElements = [];

        for (let selector of selectors) {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    roomElements = Array.from(elements);
                    break;
                }
            } catch (e) {
                console.log(`Selector "${selector}" failed:`, e);
            }
        }

        if (roomElements.length !== previousCount) {
            console.log(`✅ Found ${roomElements.length} rooms on page (was ${previousCount})`);
        }

        updateRoomCountDisplay();
        return roomElements.length > 0;
    }

    // Update the room count display
    function updateRoomCountDisplay() {
        try {
            const display = document.getElementById('room-count-display');
            if (display) {
                display.textContent = roomElements.length;
            }
            updateAnimatingDisplay();
        } catch (error) {
            console.error('❌ Error updating room count display:', error);
        }
    }

    // Update the animating rooms display
    function updateAnimatingDisplay() {
        try {
            const animatingDisplay = document.getElementById('animating-display');
            if (animatingDisplay) {
                if (config.enabled && roomElements.length > 0) {
                    const visibleRooms = getVisibleRooms();
                    const actualCount = Math.min(config.simultaneousRooms, visibleRooms.length);
                    animatingDisplay.textContent = `${actualCount} visible rooms`;
                } else {
                    animatingDisplay.textContent = '-';
                }
            }
        } catch (error) {
            console.error('❌ Error updating animating display:', error);
        }
    }

    // Completely disable the script and remove all traces
    function completelyDisableScript() {
        console.log('🛑 completelyDisableScript() function called');

        try {
            // Stop animation
            isCompletelyDisabled = true;
            config.enabled = false;

            // Clear ALL intervals (in case there are multiple)
            if (animationInterval) {
                clearInterval(animationInterval);
                animationInterval = null;
                console.log('✅ Animation interval cleared');
            }

            // Clear all timeouts and intervals that might be running
            const highestId = window.setTimeout(() => {}, 0);
            for (let i = 0; i < highestId; i++) {
                window.clearTimeout(i);
                window.clearInterval(i);
            }
            console.log('✅ All timeouts and intervals cleared');

            // Stop mutation observer
            if (mutationObserver) {
                mutationObserver.disconnect();
                mutationObserver = null;
                console.log('✅ Mutation observer disconnected');
            }

            // Stop all video previews immediately
            console.log('🛑 Stopping all video previews...');
            roomElements.forEach(room => {
                // Remove preview images
                const preview = room.querySelector('.direct-video-preview');
                const border = room.querySelector('.animation-border');
                if (preview) preview.remove();
                if (border) border.remove();

                // Force stop all videos
                const videos = room.querySelectorAll('video');
                videos.forEach(video => {
                    video.pause();
                    video.currentTime = 0;
                    video.src = '';
                    video.load();
                });
            });
            console.log('✅ All video previews stopped and cleaned');

            // Remove the control panel
            if (controlPanel) {
                controlPanel.remove();
                controlPanel = null;
                console.log('✅ Control panel removed');
            }

            // Force garbage collection by nullifying everything
            roomElements = null;
            config = null;

            console.log('🎉 Script completely disabled. CPU usage should drop now.');
            alert('Script fully disabled! CPU usage should drop. Refresh page to re-enable.');

        } catch (error) {
            console.error('❌ Error in completelyDisableScript:', error);
        }
    }

    // Create direct video preview using direct URL
    function createDirectVideoPreview(roomElement, username) {
        try {
            // Remove any existing preview and border
            const existingPreview = roomElement.querySelector('.direct-video-preview');
            const existingBorder = roomElement.querySelector('.animation-border');
            if (existingPreview) {
                existingPreview.remove();
            }
            if (existingBorder) {
                existingBorder.remove();
            }

            // Create the direct thumbnail URL with cache busting
            const cacheBuster = Math.random();
            const thumbnailUrl = `https://thumb.live.mmcdn.com/minifwap/${username}.jpg?${cacheBuster}`;

            // Create image element for the preview
            const previewImg = document.createElement('img');
            previewImg.className = 'direct-video-preview';

            // Create border overlay element
            const borderOverlay = document.createElement('div');
            borderOverlay.className = 'animation-border';
            borderOverlay.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                box-shadow: inset 0 0 0 2px rgba(40, 167, 69, 0.8) !important;
                z-index: 10000 !important;
                pointer-events: none !important;
            `;

            // Add to DOM first, then set src to ensure it's connected
            const thumbnailContainer = roomElement.querySelector('.room_thumbnail_container');
            const existingImg = roomElement.querySelector('img');

            if (thumbnailContainer) {
                thumbnailContainer.style.position = 'relative';
                thumbnailContainer.appendChild(previewImg);
                thumbnailContainer.appendChild(borderOverlay);
            } else if (existingImg && existingImg.parentElement) {
                existingImg.parentElement.style.position = 'relative';
                existingImg.parentElement.appendChild(previewImg);
                existingImg.parentElement.appendChild(borderOverlay);
            } else {
                roomElement.style.position = 'relative';
                roomElement.appendChild(previewImg);
                roomElement.appendChild(borderOverlay);
            }

            // Set image styles
            previewImg.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                z-index: 9999 !important;
                pointer-events: none !important;
            `;

            // Add error handler
            previewImg.onerror = () => {
                previewImg.remove();
                borderOverlay.remove();
            };

            // Set the src
            previewImg.src = thumbnailUrl;

            return previewImg;

        } catch (error) {
            return null;
        }
    }

    // Remove direct video preview
    function removeDirectVideoPreview(roomElement) {
        try {
            const existingPreview = roomElement.querySelector('.direct-video-preview');
            const existingBorder = roomElement.querySelector('.animation-border');
            if (existingPreview) {
                existingPreview.remove();
            }
            if (existingBorder) {
                existingBorder.remove();
            }
        } catch (error) {
            // Silently handle errors
        }
    }

    // Animate multiple rooms simultaneously - DIRECT URL METHOD
    function animateMultipleRooms() {
        if (roomElements.length === 0 || isCompletelyDisabled) return;

        // Get only the visible rooms
        const visibleRooms = getVisibleRooms();
        if (visibleRooms.length === 0) {
            return;
        }

        const roomsToAnimate = Math.min(config.simultaneousRooms, visibleRooms.length);

        // Get current usernames that should be animated
        const currentUsernames = [];
        for (let i = 0; i < roomsToAnimate; i++) {
            const room = visibleRooms[i];
            if (room) {
                const roomLink = room.querySelector('a[data-room]');
                const username = roomLink ? roomLink.getAttribute('data-room') : null;
                if (username) {
                    currentUsernames.push({ room, username });
                }
            }
        }

        // Remove previews for rooms that are no longer being animated
        roomElements.forEach((room) => {
            const existingPreview = room.querySelector('.direct-video-preview');
            if (existingPreview) {
                const roomLink = room.querySelector('a[data-room]');
                const username = roomLink ? roomLink.getAttribute('data-room') : null;

                // Only remove if this room is not in current animation list
                if (!currentUsernames.some(item => item.username === username)) {
                    removeDirectVideoPreview(room);
                }
            }
        });

        // Create or update previews for current rooms
        currentUsernames.forEach(({ room, username }) => {
            const existingPreview = room.querySelector('.direct-video-preview');

            if (existingPreview) {
                // Force update by creating a new image and replacing when loaded
                const cacheBuster = Math.random();
                const thumbnailUrl = `https://thumb.live.mmcdn.com/minifwap/${username}.jpg?${cacheBuster}`;

                // Create a new image to preload
                const newImg = document.createElement('img');
                newImg.className = 'direct-video-preview';
                newImg.style.cssText = `
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    z-index: 9999 !important;
                    pointer-events: none !important;
                `;

                newImg.onload = () => {
                    // Replace the old image with the new one only after it's loaded
                    if (existingPreview.parentNode) {
                        existingPreview.parentNode.replaceChild(newImg, existingPreview);
                    }
                };

                newImg.onerror = () => {
                    newImg.remove();
                };

                newImg.src = thumbnailUrl;
            } else {
                // Create new preview
                createDirectVideoPreview(room, username);
            }
        });

        updateAnimatingDisplay();
    }

    // Restart animation
    function restartAnimation() {
        console.log(`🔄 Restarting invisible animation: ${config.simultaneousRooms} rooms, ${config.animationSpeed}ms interval`);

        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }

        if (config.enabled) {
            animationInterval = setInterval(animateMultipleRooms, config.animationSpeed);
            animateMultipleRooms(); // Start immediately
        }
    }

    // Start animation
    function startAnimation() {
        if (isCompletelyDisabled) return;

        console.log('🚀 Starting invisible multi-room animation...');

        if (!findRoomElements()) {
            alert(`No room elements found!

Try these steps:
1. Make sure you're on a page with room listings
2. Try the "Refresh" button after the page loads completely`);
            return;
        }

        console.log(`✅ Found ${roomElements.length} rooms, starting INVISIBLE animation (no scrolling, no borders)`);
        config.enabled = true;

        animationInterval = setInterval(animateMultipleRooms, config.animationSpeed);
        animateMultipleRooms(); // Start immediately

        updateUI();
    }

    // Stop animation
    function stopAnimation() {
        console.log('⏹️ Stopping invisible animation...');
        config.enabled = false;

        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }

        // Remove all previews
        roomElements.forEach(room => {
            removeDirectVideoPreview(room);
        });

        updateUI();
        updateAnimatingDisplay();
    }

    // Toggle animation
    function toggleAnimation() {
        if (config.enabled) {
            stopAnimation();
        } else {
            startAnimation();
        }
    }

    // Update UI elements
    function updateUI() {
        try {
            const toggleBtn = document.getElementById('toggle-animation');
            const status = document.getElementById('status');

            if (toggleBtn) {
                toggleBtn.textContent = config.enabled ? 'Stop' : 'Start';
                toggleBtn.style.background = config.enabled ? '#dc3545' : '#ff6b35';
            }

            if (status) {
                status.textContent = config.enabled ? 'Running' : 'Stopped';
                status.style.color = config.enabled ? '#4CAF50' : '#ccc';
            }
        } catch (error) {
            console.error('❌ Error updating UI:', error);
        }
    }

    // Initialize when page loads
    function init() {
        console.log('🚀 Multi-Room Animator v2.3 (with drag and minimize) starting...');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        simpleLoad();

        setTimeout(() => {
            createControlPanel();
            if (findRoomElements()) {
                // Auto-start animation after everything is set up
                setTimeout(() => {
                    startAnimation();
                }, 500);
            }
        }, 1000);
    }

    // Handle navigation changes
    let currentUrl = location.href;
    mutationObserver = new MutationObserver(() => {
        if (isCompletelyDisabled) return;

        // Check for URL changes (tab changes)
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            console.log('🔄 Page navigation detected, updating rooms...');

            setTimeout(() => {
                // Re-find rooms on the new page
                if (findRoomElements()) {
                    console.log('✅ Rooms updated after navigation');
                } else {
                    console.log('⚠️ No rooms found after navigation');
                }
            }, 1500); // Wait a bit longer for content to load
        }

        // Also check for content changes (rooms loading/changing)
        const roomContainers = document.querySelectorAll('li[class*="room"], .roomCard');
        if (roomContainers.length !== roomElements.length && roomContainers.length > 0) {
            console.log(`🔄 Room count changed: ${roomElements.length} → ${roomContainers.length}`);

            setTimeout(() => {
                findRoomElements();
            }, 500);
        }
    });
    mutationObserver.observe(document, { subtree: true, childList: true });

    // Start the script
    init();

})();