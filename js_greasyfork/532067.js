// ==UserScript==
// @name         Better YouTube Video Controls
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @description  Enhanced YouTube playback controls with privacy-focused features. Hold right arrow for fast playback, left for slow-mo, and track your last 20 videos' timestamps locally so you can resume watching where you left off. (no data sent to servers).
// @author       Henry Suen
// @match        *://*.youtube.com/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/532067/Better%20YouTube%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/532067/Better%20YouTube%20Video%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- USER CONFIGURABLE SETTINGS ---

    // Get user settings or use defaults
    let HOLD_RIGHT_PLAYBACK_SPEED = GM_getValue('holdRightPlaybackSpeed', 2);
    let HOLD_LEFT_PLAYBACK_SPEED = GM_getValue('holdLeftPlaybackSpeed', 0.25);
    let LONG_PRESS_THRESHOLD = GM_getValue('longPressThreshold', 250); // Default 250ms
    let SKIP_SECONDS = GM_getValue('skipSeconds', 5); // Default 5 seconds
    let RESUME_WATCHING_ENABLED = GM_getValue('resumeWatchingEnabled', true); // Default to on
    const MAX_HISTORY_SIZE = 20; // Number of videos to remember

    // Register menu commands for user configuration
    GM_registerMenuCommand('Set Right Arrow Hold Speed (Fast)', function() {
        const newSpeed = parseFloat(prompt('Enter playback speed when holding right arrow e.g.,1.5, 2.0(max):', HOLD_RIGHT_PLAYBACK_SPEED));
        if (!isNaN(newSpeed) && newSpeed >= 1 && newSpeed <= 2) {
            HOLD_RIGHT_PLAYBACK_SPEED = newSpeed;
            GM_setValue('holdRightPlaybackSpeed', newSpeed);
            alert(`Right arrow hold speed set to ${newSpeed}x`);
        } else {
            alert('Invalid value. Please enter a number between 1 and 2.');
        }
    });

    GM_registerMenuCommand('Set Left Arrow Hold Speed (Slow)', function() {
        const newSpeed = parseFloat(prompt('Enter playback speed when holding left arrow. e.g.,0.25(min), 0.5:', HOLD_LEFT_PLAYBACK_SPEED));
        if (!isNaN(newSpeed) && newSpeed >= 0.25 && newSpeed <= 1) {
            HOLD_LEFT_PLAYBACK_SPEED = newSpeed;
            GM_setValue('holdLeftPlaybackSpeed', newSpeed);
            alert(`Left arrow hold speed set to ${newSpeed}x`);
        } else {
            alert('Invalid value. Please enter a number between 0.2 and 1.');
        }
    });

    GM_registerMenuCommand('Set Skip Seconds', function() {
        const newSkip = parseInt(prompt('Enter seconds to skip on right/left arrow tap:', SKIP_SECONDS));
        if (!isNaN(newSkip) && newSkip > 0) {
            SKIP_SECONDS = newSkip;
            GM_setValue('skipSeconds', newSkip);
            alert(`Skip seconds set to ${newSkip}`);
        } else {
            alert('Invalid value. Please enter a positive number.');
        }
    });

    GM_registerMenuCommand('Toggle Resume Watching: ' + (RESUME_WATCHING_ENABLED ? 'ON' : 'OFF'), function() {
        RESUME_WATCHING_ENABLED = !RESUME_WATCHING_ENABLED;
        GM_setValue('resumeWatchingEnabled', RESUME_WATCHING_ENABLED);
        alert(`Resume Watching: ${RESUME_WATCHING_ENABLED ? 'Enabled ✓' : 'Disabled ✗'}`);
        // Refresh menu command label
        GM_registerMenuCommand('Toggle Resume Watching: ' + (RESUME_WATCHING_ENABLED ? 'ON' : 'OFF'), arguments.callee);
    });

    GM_registerMenuCommand('Clear Saved Video History', function() {
        clearVideoHistory();
        alert('Video history has been cleared.');
    });

    // --- END OF USER CONFIGURABLE SETTINGS ---

    // Store the original playback rate
    let originalPlaybackRate = 1.0;
    // Flag to track if we're handling a long press
    let isLongPress = false;
    // Track when the key was pressed
    let keyDownTime = 0;
    // Flag to ensure we only process one keydown at a time
    let keyAlreadyDown = false;
    // Track which key is being held
    let activeKey = null;
    // Reference to our speed indicator element
    let speedIndicator = null;
    // Reference to our timeout for detecting long press
    let longPressTimeout = null;
    // Our own UI indicator for actions
    let actionIndicator = null;
    // Timeout for hiding the action indicator
    let hideActionTimeout = null;
    // Variables for tracking video position
    let currentVideoId = null;
    let positionSaveInterval = null;
    let lastSavedPosition = 0;
    // Store the element that had focus before we blurred the progress bar
    let lastActiveElement = null;
    // Flag to track if resume was skipped due to timestamp in URL
    let resumeSkippedDueToTimestamp = false;
    // Debug mode for troubleshooting
    const DEBUG = false;

    // --- Utility Functions ---

    // Debug logging function
    function debugLog(...args) {
        if (DEBUG) {
            console.log('[YT Controls]', ...args);
        }
    }

    // Get video history array
    function getVideoHistory() {
        const history = GM_getValue('videoHistory', []);
        return Array.isArray(history) ? history : [];
    }

    // Save video history array
    function saveVideoHistory(history) {
        GM_setValue('videoHistory', history);
    }

    // Add a video to the history
    function addToVideoHistory(videoId) {
        if (!videoId) return;

        const originalHistory = getVideoHistory(); // Track original history before changes
        let history = [...originalHistory]; // Create a copy to modify

        // Remove the video ID if it's already in the history to avoid duplicates
        history = history.filter(item => item !== videoId);

        // Add the video ID to the beginning of the array
        history.unshift(videoId);

        // Limit the history size to MAX_HISTORY_SIZE
        if (history.length > MAX_HISTORY_SIZE) {
            history = history.slice(0, MAX_HISTORY_SIZE);
        }

        // Find videos that were in the original history but not in the new trimmed history
        const removedVideos = originalHistory.filter(id => !history.includes(id));

        // Delete timestamp data for removed videos
        removedVideos.forEach(removedId => {
            const safeKey = getSafeVideoKey(removedId);
            if (safeKey) {
                GM_deleteValue(safeKey); // Delete old timestamp data
                debugLog('Deleted old timestamp data for:', removedId);
            }
        });

        // Save the updated history
        saveVideoHistory(history);
        debugLog('Updated video history:', history);
    }

    // Clear all saved video history
    function clearVideoHistory() {
        GM_setValue('videoHistory', []);

        // Also clear all position values
        const allKeys = GM_listValues ? GM_listValues() : [];
        for (const key of allKeys) {
            if (key.startsWith('video_pos_')) {
                GM_deleteValue(key);
            }
        }

        debugLog('Video history cleared');
    }

    // Extract video ID from YouTube URL using multiple methods
    function getVideoId() {
        try {
            // Method 1: Using URLSearchParams (most reliable)
            const urlParams = new URLSearchParams(window.location.search);
            const vParam = urlParams.get('v');
            if (vParam) {
                debugLog('Video ID from URL params:', vParam);
                return vParam;
            }

            // Method 2: Try regex on full URL
            const url = window.location.href;
            const regex1 = /(?:v=|\/v\/|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/;
            const match1 = url.match(regex1);
            if (match1 && match1[1]) {
                debugLog('Video ID from URL regex:', match1[1]);
                return match1[1];
            }

            // Method 3: Look for it in page metadata
            const metaTag = document.querySelector('meta[property="og:video:url"], meta[itemprop="videoId"]');
            if (metaTag && metaTag.content) {
                const metaUrl = metaTag.content;
                const metaMatch = metaUrl.match(/([a-zA-Z0-9_-]{11})/);
                if (metaMatch && metaMatch[1]) {
                    debugLog('Video ID from meta tag:', metaMatch[1]);
                    return metaMatch[1];
                }
            }

            // Method 4: Look for video ID in the page content
            const pageContent = document.documentElement.innerHTML;
            const videoIdMatch = pageContent.match(/"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/);
            if (videoIdMatch && videoIdMatch[1]) {
                debugLog('Video ID from page content:', videoIdMatch[1]);
                return videoIdMatch[1];
            }

            debugLog('Could not find video ID');
            return null;
        } catch (e) {
            console.error('Error in getVideoId:', e);
            return null;
        }
    }

    // Make video ID safe for storage as a key
    function getSafeVideoKey(videoId) {
        if (!videoId) return null;

        // Encode the video ID for safety as a key
        return 'video_pos_' + encodeURIComponent(videoId);
    }

    // Check if URL has a timestamp parameter
    function hasTimestampInUrl() {
        const url = window.location.href;
        return url.includes("&t=") || url.includes("?t=");
    }

    // Extract timestamp value from URL
    function getTimestampFromUrl() {
        const url = window.location.href;
        const regex = /[?&]t=([0-9hms]+)/;
        const match = url.match(regex);

        if (!match) return 0;

        const value = match[1];

        // Handle numeric seconds format (e.g., t=120)
        if (/^\d+$/.test(value)) {
            return parseInt(value);
        }

        // Handle YouTube's time format (e.g., 1h2m3s)
        let seconds = 0;
        const hours = value.match(/(\d+)h/);
        const minutes = value.match(/(\d+)m/);
        const secs = value.match(/(\d+)s/);

        if (hours) seconds += parseInt(hours[1]) * 3600;
        if (minutes) seconds += parseInt(minutes[1]) * 60;
        if (secs) seconds += parseInt(secs[1]);

        return seconds;
    }

    // Save current video position
    function saveVideoPosition() {
        // Skip if resume watching is disabled
        if (!RESUME_WATCHING_ENABLED) return;

        const video = findYouTubeVideo();
        if (!video) return;

        const videoId = getVideoId();
        if (!videoId) return;

        const safeKey = getSafeVideoKey(videoId);
        if (!safeKey) return;

        // Only update if position changed significantly (more than 1 second)
        if (Math.abs(video.currentTime - lastSavedPosition) > 1) {
            lastSavedPosition = video.currentTime;

            // Add to video history
            addToVideoHistory(videoId);

            // Save position
            GM_setValue(safeKey, video.currentTime);
            debugLog('Saved position', videoId, video.currentTime);
        }
    }

    // Start tracking video position
    function startPositionTracking() {
        // Skip if resume watching is disabled
        if (!RESUME_WATCHING_ENABLED) return;

        // Clear any existing interval
        if (positionSaveInterval) {
            clearInterval(positionSaveInterval);
        }

        // Set up the new interval
        positionSaveInterval = setInterval(saveVideoPosition, 5000);

        // Update the current video ID
        currentVideoId = getVideoId();

        // Add to history immediately
        if (currentVideoId) {
            addToVideoHistory(currentVideoId);
            debugLog('Started tracking', currentVideoId);
        }
    }

    // Restore video position
    function restoreVideoPosition() {
        // Skip if resume watching is disabled
        if (!RESUME_WATCHING_ENABLED) return;

        const videoId = getVideoId();
        if (!videoId) return;

        debugLog('Attempting to restore position for', videoId);

        // Check if URL has a timestamp
        if (hasTimestampInUrl()) {
            resumeSkippedDueToTimestamp = true;
            // Show notification that resume was skipped
            showActionIndicator("Resume skipped: Timestamp in URL", 3000);
            debugLog('Resume skipped due to timestamp in URL');
            return;
        }

        // Reset the flag since there's no timestamp
        resumeSkippedDueToTimestamp = false;

        const safeKey = getSafeVideoKey(videoId);
        if (!safeKey) return;

        // Get the saved position
        const savedPosition = GM_getValue(safeKey, 0);

        debugLog('Retrieved saved position:', savedPosition);

        if (savedPosition > 0) {
            const video = findYouTubeVideo();
            if (video) {
                // Don't resume if we're near the start or very close to where we left off
                if (video.currentTime < 3 && savedPosition > 5) {
                    video.currentTime = savedPosition;

                    // Update YouTube's internal state to be aware of our time change
                    const ytplayer = findYouTubePlayer();
                    if (ytplayer && typeof ytplayer.seekTo === 'function') {
                        try {
                            ytplayer.seekTo(savedPosition, true);
                        } catch(e) {
                            debugLog('Error in ytplayer.seekTo', e);
                        }
                    }

                    // Show a notification that we've resumed
                    showActionIndicator(`Resumed at ${formatTime(savedPosition)}`, 3000);
                    debugLog('Resumed to', savedPosition);
                }
            }
        }
    }

    // Format time in MM:SS format
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Find video element on YouTube
    function findYouTubeVideo() {
        return document.querySelector('#movie_player video');
    }

    // Find YouTube player element
    function findYouTubePlayer() {
        return document.querySelector('#movie_player');
    }

    // Utility function to check if an element is an input field
    function isInputField(element) {
        if (!element) return false;
        const tagName = element.tagName.toLowerCase();
        const type = (element.type || '').toLowerCase();

        return (tagName === 'input' &&
                ['text', 'password', 'email', 'number', 'search', 'tel', 'url'].includes(type)) ||
               tagName === 'textarea' ||
               element.isContentEditable;
    }

    // Check if focus is on progress bar
    function isProgressBarFocused() {
        // There are multiple elements that make up the progress bar
        const progressBar = document.querySelector('.ytp-progress-bar');
        const scrubber = document.querySelector('.ytp-scrubber-container');
        const progressList = document.querySelectorAll('.ytp-progress-list');

        if (document.activeElement === progressBar ||
            document.activeElement === scrubber ||
            (progressList && Array.from(progressList).includes(document.activeElement))) {
            return true;
        }

        // Check for aria attributes that might indicate focus on progress controls
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.getAttribute('aria-valuemin') !== null ||
            activeElement.getAttribute('aria-valuemax') !== null ||
            activeElement.getAttribute('role') === 'slider'
        )) {
            // Check if it's in the player controls
            const isInControls = activeElement.closest('.ytp-chrome-bottom');
            return isInControls !== null;
        }

        return false;
    }

    // Remove focus from progress bar and trigger volume control
    function handleVolumeKeyOnProgressBar(isVolumeUp) {
        if (isProgressBarFocused()) {
            // Store the active element so we can restore it later
            lastActiveElement = document.activeElement;

            // Blur the progress bar
            if (lastActiveElement && lastActiveElement.blur) {
                lastActiveElement.blur();
            }

            // Move focus to the player itself
            const player = findYouTubePlayer();
            if (player && player.focus) {
                player.focus();
            }

            // Create and dispatch a synthetic key event to trigger YouTube's volume control
            // We do this after ensuring focus is off the progress bar
            setTimeout(() => {
                const event = new KeyboardEvent('keydown', {
                    key: isVolumeUp ? 'ArrowUp' : 'ArrowDown',
                    code: isVolumeUp ? 'ArrowUp' : 'ArrowDown',
                    keyCode: isVolumeUp ? 38 : 40,
                    which: isVolumeUp ? 38 : 40,
                    bubbles: true,
                    cancelable: true,
                    composed: true
                });

                // Dispatch to player element to ensure YouTube's volume control is triggered
                if (player) {
                    player.dispatchEvent(event);
                } else {
                    // Fallback to document if player can't be found
                    document.dispatchEvent(event);
                }
            }, 10);

            return true;
        }
        return false;
    }

    // --- UI Elements ---

    // Create the speed indicator UI element
    function createSpeedIndicator() {
        // Remove any existing indicator first
        removeSpeedIndicator();

        // Create a new indicator
        speedIndicator = document.createElement('div');
        speedIndicator.id = 'speed-indicator';
        speedIndicator.textContent = '1x'; // Default text - will be updated when shown

        // Style the indicator with larger text
        const style = speedIndicator.style;
        style.position = 'absolute';
        style.right = '20px';
        style.top = '20px';
        style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        style.color = 'white';
        style.padding = '8px 16px'; // Larger padding
        style.borderRadius = '6px';
        style.fontSize = '28px'; // Large font size
        style.fontWeight = 'bold';
        style.zIndex = '9999';
        style.display = 'none'; // Hidden by default
        style.opacity = '0';
        style.transition = 'opacity 0.3s ease';

        // Add it to the player
        const player = findYouTubePlayer();
        if (player) {
            player.appendChild(speedIndicator);
        } else {
            document.body.appendChild(speedIndicator);  // Fallback
        }

        return speedIndicator;
    }

    // Create action indicator for volume and skip
    function createActionIndicator() {
        if (actionIndicator) {
            return actionIndicator;
        }

        actionIndicator = document.createElement('div');
        actionIndicator.id = 'action-indicator';

        // Style the action indicator
        const style = actionIndicator.style;
        style.position = 'absolute';
        style.left = '50%';
        style.top = '50%';
        style.transform = 'translate(-50%, -50%)';
        style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        style.color = 'white';
        style.padding = '12px 20px';
        style.borderRadius = '8px';
        style.fontSize = '24px';
        style.fontWeight = 'bold';
        style.zIndex = '10000';
        style.display = 'none';
        style.opacity = '0';
        style.transition = 'opacity 0.3s ease';

        // Add it to the player
        const player = findYouTubePlayer();
        if (player) {
            player.appendChild(actionIndicator);
        } else {
            document.body.appendChild(actionIndicator);
        }

        return actionIndicator;
    }

    // Show the speed indicator with a fade-in effect
    function showSpeedIndicator(speed) {
        if (!speedIndicator) {
            speedIndicator = createSpeedIndicator();
        }
        speedIndicator.textContent = speed + 'x'; // Update with current speed
        speedIndicator.style.display = 'block';
        setTimeout(() => {
            speedIndicator.style.opacity = '1';
        }, 10);  // Small delay to ensure the transition works
    }

    // Hide the speed indicator with a fade-out effect
    function hideSpeedIndicator() {
        if (speedIndicator) {
            speedIndicator.style.opacity = '0';
            setTimeout(() => {
                speedIndicator.style.display = 'none';
            }, 300);  // Wait for the transition to complete
        }
    }

    // Remove the speed indicator completely
    function removeSpeedIndicator() {
        if (speedIndicator && speedIndicator.parentNode) {
            speedIndicator.parentNode.removeChild(speedIndicator);
            speedIndicator = null;
        }
    }

    // Show action indicator
    function showActionIndicator(text, duration = 1000) {
        // Clear any existing hide timeout
        if (hideActionTimeout) {
            clearTimeout(hideActionTimeout);
            hideActionTimeout = null;
        }

        const indicator = createActionIndicator();

        // If indicator is already visible, just update text without the fade-out/fade-in
        if (indicator.style.opacity === '1') {
            indicator.textContent = text;
        } else {
            indicator.textContent = text;
            indicator.style.display = 'block';

            // Use a timeout to ensure the transition works
            setTimeout(() => {
                indicator.style.opacity = '1';
            }, 10);
        }

        // Set a new timeout to hide the indicator
        hideActionTimeout = setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 300);
        }, duration);
    }

    // --- Action Functions ---

    // Function to perform a seek forward or backward
    function performSeek(forward = true) {
        const video = findYouTubeVideo();
        if (!video) return false;

        // Calculate new time
        const currentTime = video.currentTime;
        const newTime = currentTime + (forward ? SKIP_SECONDS : -SKIP_SECONDS);
        const finalTime = Math.max(0, newTime);

        // Update both the HTML5 video element and YouTube's internal state
        video.currentTime = finalTime;

        // Try to sync with YouTube's API
        const player = findYouTubePlayer();
        if (player && typeof player.seekTo === 'function') {
            try {
                player.seekTo(finalTime, true);
            } catch(e) {}
        }

        // Show our custom UI indicator
        showActionIndicator(`${forward ? 'Forward' : 'Backward'} ${SKIP_SECONDS}s`);
        return true;
    }

    // Function to change playback speed
    function changePlaybackSpeed(speed) {
        const video = findYouTubeVideo();
        if (!video) return false;

        // Set new speed
        video.playbackRate = speed;

        // Also try to set through YouTube's API if available
        const player = findYouTubePlayer();
        if (player && typeof player.setPlaybackRate === 'function') {
            try {
                player.setPlaybackRate(speed);
            } catch(e) {}
        }

        // Show indicator
        showSpeedIndicator(speed);

        return true;
    }

    // Function to reset playback speed
    function resetPlaybackSpeed() {
        const video = findYouTubeVideo();
        if (!video) return false;

        // Reset to original speed
        video.playbackRate = 1;

        // Also try to reset through YouTube's API
        const player = findYouTubePlayer();
        if (player && typeof player.setPlaybackRate === 'function') {
            try {
                player.setPlaybackRate(1);
            } catch(e) {}
        }

        // Hide speed indicator
        hideSpeedIndicator();

        return true;
    }

    // --- Key Event Handlers ---

    // Main handler for key down events
    const handleKeyDown = function(event) {
        // Skip if we're in an input field
        if (isInputField(document.activeElement)) return;

        // Handle arrow keys
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            // Prevent default immediately
            event.preventDefault();
            event.stopPropagation();

            // Store which key was pressed
            activeKey = event.key;

            // Only proceed if we found a video and it's the first keydown
            if (findYouTubeVideo() && !keyAlreadyDown) {
                keyAlreadyDown = true;
                keyDownTime = Date.now();

                // Set up a timeout to check for long press
                longPressTimeout = setTimeout(() => {
                    // If key is still being pressed after threshold
                    if (keyAlreadyDown) {
                        isLongPress = true;

                        // Different behavior based on which arrow key
                        if (activeKey === 'ArrowRight') {
                            // Right arrow for fast playback
                            changePlaybackSpeed(HOLD_RIGHT_PLAYBACK_SPEED);
                        } else if (activeKey === 'ArrowLeft') {
                            // Left arrow for slow playback
                            changePlaybackSpeed(HOLD_LEFT_PLAYBACK_SPEED);
                        }
                    }
                }, LONG_PRESS_THRESHOLD);
            }
        }
        // Handle up/down arrow keys on progress bar
        else if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && isProgressBarFocused()) {
            // Prevent default to avoid any time change
            event.preventDefault();
            event.stopPropagation();

            // Handle volume control properly by fixing focus and dispatching a new event
            handleVolumeKeyOnProgressBar(event.key === 'ArrowUp');
        }
    };

    // Main handler for key up events
    const handleKeyUp = function(event) {
        // Skip if we're in an input field
        if (isInputField(document.activeElement)) return;

        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            // Prevent default
            event.preventDefault();
            event.stopPropagation();

            // Only process if this is the active key (prevents issues with multiple keys)
            if (event.key === activeKey) {
                // Clear the timeout to prevent speed change activation if key was released quickly
                if (longPressTimeout) {
                    clearTimeout(longPressTimeout);
                    longPressTimeout = null;
                }

                // If this was a long press, reset playback speed
                if (isLongPress) {
                    resetPlaybackSpeed();
                } else if (keyAlreadyDown) {
                    // This was a quick tap, perform a seek
                    performSeek(event.key === 'ArrowRight');
                }

                // Reset tracking variables
                isLongPress = false;
                keyDownTime = 0;
                keyAlreadyDown = false;
                activeKey = null;
            }
        }
    };

    // --- Setup Functions ---

    // More comprehensive event handling
    function setupGlobalEventHandlers() {
        // Capture all keyboard events at the window level
        window.addEventListener('keydown', (e) => {
            // Skip if we're in an input field to allow normal typing
            if (isInputField(document.activeElement)) {
                return;
            }

            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                // Always handle left/right arrows
                handleKeyDown(e);
                // Always prevent propagation
                e.stopPropagation();
                e.preventDefault();
            } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && isProgressBarFocused()) {
                // For up/down, handle and prevent default when progress bar is focused
                handleKeyDown(e);
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);

        window.addEventListener('keyup', (e) => {
            // Skip if we're in an input field
            if (isInputField(document.activeElement)) {
                return;
            }

            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                // Call our handler first
                handleKeyUp(e);
                // Always prevent propagation to YouTube
                e.stopPropagation();
                e.preventDefault();
            }
        }, true);
    }

    // Additional handler for the YouTube player specifically
    function addYouTubePlayerHandlers() {
        const player = findYouTubePlayer();
        if (player) {
            // Create our indicators now that we have the player
            createSpeedIndicator();
            createActionIndicator();

            // Additional direct event listeners for the player
            player.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    e.stopPropagation();
                } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && isProgressBarFocused()) {
                    // For up/down on progress bar, handle and prevent
                    e.preventDefault();
                    e.stopPropagation();
                    handleVolumeKeyOnProgressBar(e.key === 'ArrowUp');
                }
            }, true);

            // Try to restore video position
            setTimeout(() => {
                restoreVideoPosition();
                startPositionTracking();
            }, 1500);  // Give YouTube a moment to initialize the video
        }
    }

    // Function to handle YouTube video element being added or replaced
    function handleVideoElementChange() {
        const video = findYouTubeVideo();
        if (video) {
            // Try to restore video position
            setTimeout(() => {
                restoreVideoPosition();
                startPositionTracking();
            }, 1500);  // Give YouTube a moment to initialize the video
        }
    }

    // Setup functions that will need to be called once the page is loaded
    function setupOnLoad() {
        // Set up the global event handlers
        setupGlobalEventHandlers();

        // Add player-specific handlers
        addYouTubePlayerHandlers();

        // Also try to intercept YouTube's internal keyboard event handling
        const originalDocKeyDown = document.onkeydown;
        const originalDocKeyUp = document.onkeyup;

        document.onkeydown = function(e) {
            // Skip if we're in an input field
            if (isInputField(document.activeElement)) {
                return originalDocKeyDown ? originalDocKeyDown(e) : true;
            }

            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                handleKeyDown(e);
                return false; // Prevent default
            } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && isProgressBarFocused()) {
                // Completely prevent default when progress bar is focused
                handleKeyDown(e);
                return false;
            }
            return originalDocKeyDown ? originalDocKeyDown(e) : true;
        };

        document.onkeyup = function(e) {
            // Skip if we're in an input field
            if (isInputField(document.activeElement)) {
                return originalDocKeyUp ? originalDocKeyUp(e) : true;
            }

            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                handleKeyUp(e);
                return false; // Prevent default
            }
            return originalDocKeyUp ? originalDocKeyUp(e) : true;
        };
    }

    // Watch for DOM changes to catch the player element if it loads after the script
    const observer = new MutationObserver(function(mutations) {
        // Look for the player
        if (!document.querySelector('#movie_player')) {
            return;
        }

        // Check if we need to set up the player
        if (!speedIndicator) {
            addYouTubePlayerHandlers();
        }

        // Also watch for video element changes
        const video = findYouTubeVideo();
        if (video && currentVideoId != getVideoId()) {
            handleVideoElementChange();
        }
    });

    // Start observing the document
    observer.observe(document, { childList: true, subtree: true });

    // Listen for navigation events (YouTube is a SPA)
    function handleNavigation() {
        // Check for video ID change
        const newVideoId = getVideoId();
        const currentId = currentVideoId;

        if (newVideoId && newVideoId !== currentId) {
            debugLog('Video ID changed from', currentId, 'to', newVideoId);
            currentVideoId = newVideoId;

            // Clear existing tracking
            if (positionSaveInterval) {
                clearInterval(positionSaveInterval);
                positionSaveInterval = null;
            }

            // Add to history
            addToVideoHistory(newVideoId);

            // Handle the video element for the new page
            handleVideoElementChange();
        }
    }

    // YouTube uses History API for navigation
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        handleNavigation();
    };

    window.addEventListener('popstate', handleNavigation);

    // Call setup once the page is fully loaded
    if (document.readyState === 'complete') {
        setupOnLoad();
    } else {
        window.addEventListener('load', setupOnLoad);
    }

    // Clean up when the page unloads
    window.addEventListener('unload', function() {
        // Save final position before unloading
        saveVideoPosition();

        removeSpeedIndicator();
        if (actionIndicator && actionIndicator.parentNode) {
            actionIndicator.parentNode.removeChild(actionIndicator);
        }
        observer.disconnect();
        if (longPressTimeout) {
            clearTimeout(longPressTimeout);
        }
        if (hideActionTimeout) {
            clearTimeout(hideActionTimeout);
        }
        if (positionSaveInterval) {
            clearInterval(positionSaveInterval);
        }
    });
})();