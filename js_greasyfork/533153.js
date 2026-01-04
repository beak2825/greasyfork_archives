// ==UserScript==
// @name         Audio Controls with Auto-Play and Speed Management
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Controls audio playback with speed adjustment and enhanced auto-play methods
// @author       You
// @match        https://inovel*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533153/Audio%20Controls%20with%20Auto-Play%20and%20Speed%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/533153/Audio%20Controls%20with%20Auto-Play%20and%20Speed%20Management.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEFAULT_PLAYBACK_RATE = 0.7;
    const AUTO_PLAY_DELAY = 5000; // 5 seconds
    const AUDIO_SELECTOR = 'audio[controls]';
    const MAX_RETRY_ATTEMPTS = 3; // Maximum number of retry attempts
    const RETRY_DELAY = 1000; // Delay between retries in milliseconds
    const RATE_CHECK_INTERVAL = 800; // Check playback rate every 800ms
    const INACTIVITY_TIMEOUT = 7000; // Auto-minimize after 4 seconds of inactivity

    // New autoplay configuration
    const AUTOPLAY_METHOD_TIMEOUT = 2000; // Timeout between different autoplay methods
    const USE_INTERACTION_METHOD = true;   // Method 1: User interaction simulation
    const USE_PROGRESSIVE_LOAD = true;     // Method 2: Progressive loading
    const USE_AUDIO_CONTEXT = true;        // Method 3: Web Audio API

    // State variables
    let audioElement = null;
    let playbackRate = parseFloat(localStorage.getItem('audio_playback_rate')) || DEFAULT_PLAYBACK_RATE;
    let isMinimized = localStorage.getItem('audio_controls_minimized') === 'true' || false;
    let countdownTimer = null;
    let rateCheckInterval = null;
    let retryAttempts = 0;
    let hasUserInteracted = false;
    let lastRateApplication = 0;
    let inactivityTimer = null;
    let audioContext = null; // Store AudioContext instance

    // Position settings - load from localStorage or use defaults
    let bubblePosition = JSON.parse(localStorage.getItem('audio_bubble_position')) || { top: '20px', left: '20px' };

    // Create main container for all controls
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        position: fixed;
        z-index: 9999;
        font-family: Arial, sans-serif;
    `;
    document.body.appendChild(mainContainer);

    // Create the expanded control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'audio-control-panel';
    controlPanel.style.cssText = `
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-width: 120px;
    `;

    // Create version display at the top (more compact)
    const versionDisplay = document.createElement('div');
    versionDisplay.style.cssText = `
        color: #aaaaaa;
        font-size: 9px;
        text-align: right;
        margin: 0 0 2px 0;
        font-style: italic;
    `;
    versionDisplay.textContent = `v2.4`;
    controlPanel.appendChild(versionDisplay);

    // Create the minimized bubble view
    const bubbleView = document.createElement('div');
    bubbleView.className = 'audio-bubble';
    bubbleView.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        user-select: none;
    `;

    // Create bubble icon
    const bubbleIcon = document.createElement('div');
    bubbleIcon.style.cssText = `
        font-size: 20px;
        color: white;
    `;
    bubbleIcon.innerHTML = '🔊';  // Will be updated based on audio state
    bubbleView.appendChild(bubbleIcon);

    // Create countdown/message display
    const countdownDisplay = document.createElement('div');
    countdownDisplay.style.cssText = `
        color: #ffcc00;
        font-size: 12px;
        text-align: center;
        margin-bottom: 5px;
        font-weight: bold;
        height: 18px; /* Fixed height to prevent layout shifts */
    `;
    countdownDisplay.textContent = '';
    controlPanel.appendChild(countdownDisplay);

    // Create play/pause button (icon only)
    const playPauseButton = document.createElement('button');
    playPauseButton.style.cssText = `
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 8px 0;
        text-align: center;
        font-size: 18px;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
    `;
    playPauseButton.innerHTML = '▶️';
    controlPanel.appendChild(playPauseButton);

    // Create speed control container
    const speedControlContainer = document.createElement('div');
    speedControlContainer.style.cssText = `
        display: flex;
        gap: 5px;
        width: 100%;
    `;
    controlPanel.appendChild(speedControlContainer);

    // Create speed down button (icon only)
    const speedDownButton = document.createElement('button');
    speedDownButton.style.cssText = `
        background-color: #795548;
        border: none;
        color: white;
        padding: 6px 0;
        text-align: center;
        font-size: 18px;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
    `;
    speedDownButton.innerHTML = '🐢';
    speedControlContainer.appendChild(speedDownButton);

    // Create speed up button (icon only)
    const speedUpButton = document.createElement('button');
    speedUpButton.style.cssText = `
        background-color: #009688;
        border: none;
        color: white;
        padding: 6px 0;
        text-align: center;
        font-size: 18px;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
    `;
    speedUpButton.innerHTML = '🐇';
    speedControlContainer.appendChild(speedUpButton);

    // Create speed display
    const speedDisplay = document.createElement('div');
    speedDisplay.style.cssText = `
        color: white;
        font-size: 12px;
        text-align: center;
        margin-top: 2px;
    `;
    speedDisplay.textContent = `${playbackRate.toFixed(1)}x`;
    controlPanel.appendChild(speedDisplay);

    // Create minimize button (icon only)
    const minimizeButton = document.createElement('button');
    minimizeButton.style.cssText = `
        background-color: #607D8B;
        border: none;
        color: white;
        padding: 4px 0;
        text-align: center;
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 5px;
    `;
    minimizeButton.innerHTML = '−';
    controlPanel.appendChild(minimizeButton);

    // Function to reset the inactivity timer
    function resetInactivityTimer() {
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }

        if (!isMinimized) {
            inactivityTimer = setTimeout(() => {
                toggleMinimized(); // Auto-minimize after timeout
            }, INACTIVITY_TIMEOUT);
        }
    }

    // Function to toggle between expanded and minimized views
    function toggleMinimized() {
        isMinimized = !isMinimized;
        updateViewState();

        // Reset inactivity timer when toggling
        resetInactivityTimer();

        // Save state to localStorage
        localStorage.setItem('audio_controls_minimized', isMinimized);
    }

    // Function to update the current view based on minimized state
    function updateViewState() {
        // Clear the container first
        while (mainContainer.firstChild) {
            mainContainer.removeChild(mainContainer.firstChild);
        }

        if (isMinimized) {
            // Show bubble view
            mainContainer.appendChild(bubbleView);

            // Set position based on saved values
            mainContainer.style.top = bubblePosition.top;
            mainContainer.style.left = bubblePosition.left;
            mainContainer.style.right = 'auto';
            mainContainer.style.bottom = 'auto';

            // Clear any inactivity timer
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
                inactivityTimer = null;
            }
        } else {
            // Show expanded control panel
            mainContainer.appendChild(controlPanel);

            // If coming from minimized state, place in the same position
            // Otherwise use default bottom right
            if (bubblePosition) {
                mainContainer.style.top = bubblePosition.top;
                mainContainer.style.left = bubblePosition.left;
                mainContainer.style.right = 'auto';
                mainContainer.style.bottom = 'auto';
            } else {
                mainContainer.style.top = 'auto';
                mainContainer.style.left = 'auto';
                mainContainer.style.right = '20px';
                mainContainer.style.bottom = '20px';
            }

            // Start inactivity timer
            resetInactivityTimer();
        }
    }

    // Make only the bubble draggable
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    bubbleView.addEventListener('mousedown', function(e) {
        // Only initiate drag if user holds for a brief moment
        setTimeout(() => {
            if (e.buttons === 1) { // Left mouse button
                isDragging = true;
                dragOffsetX = e.clientX - mainContainer.getBoundingClientRect().left;
                dragOffsetY = e.clientY - mainContainer.getBoundingClientRect().top;
                bubbleView.style.cursor = 'grabbing';
            }
        }, 100);
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !isMinimized) return;

        e.preventDefault();

        // Only allow vertical movement (Y-axis)
        const newTop = e.clientY - dragOffsetY;

        // Keep within viewport bounds
        const maxY = window.innerHeight - bubbleView.offsetHeight;

        // Only update Y position, keep X position the same
        mainContainer.style.top = `${Math.max(0, Math.min(maxY, newTop))}px`;
    });

    document.addEventListener('mouseup', function(event) {
        if (isDragging && isMinimized) {
            isDragging = false;
            bubbleView.style.cursor = 'pointer';

            // Save the position (only top changes, left stays the same)
            bubblePosition = {
                top: mainContainer.style.top,
                left: bubblePosition.left // Keep the same left position
            };
            localStorage.setItem('audio_bubble_position', JSON.stringify(bubblePosition));

            // Prevent click if we were dragging
            event.preventDefault();
            return false;
        } else if (isMinimized && (event.target === bubbleView || bubbleView.contains(event.target))) {
            // If it was a click (not drag) on the bubble, expand
            toggleMinimized();
        }
    });

    // Add touch support for mobile devices - only for bubble
    bubbleView.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        isDragging = true;
        dragOffsetX = touch.clientX - mainContainer.getBoundingClientRect().left;
        dragOffsetY = touch.clientY - mainContainer.getBoundingClientRect().top;

        // Prevent scrolling while dragging
        e.preventDefault();
    });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging || !isMinimized) return;

        const touch = e.touches[0];

        // Only allow vertical movement (Y-axis)
        const newTop = touch.clientY - dragOffsetY;

        // Keep within viewport bounds
        const maxY = window.innerHeight - bubbleView.offsetHeight;

        // Only update Y position, keep X position the same
        mainContainer.style.top = `${Math.max(0, Math.min(maxY, newTop))}px`;

        // Prevent scrolling while dragging
        e.preventDefault();
    });

    document.addEventListener('touchend', function(event) {
        if (isDragging && isMinimized) {
            isDragging = false;

            // Save the position (only top changes, left stays the same)
            bubblePosition = {
                top: mainContainer.style.top,
                left: bubblePosition.left // Keep the same left position
            };
            localStorage.setItem('audio_bubble_position', JSON.stringify(bubblePosition));

            // If touch distance was very small, treat as click
            const touchMoved = Math.abs(event.changedTouches[0].clientY - (parseInt(mainContainer.style.top) + dragOffsetY)) > 5;

            if (!touchMoved && (event.target === bubbleView || bubbleView.contains(event.target))) {
                toggleMinimized();
            }
        }
    });

    // Reset inactivity timer on user interaction with the control panel
    controlPanel.addEventListener('mouseenter', resetInactivityTimer);
    controlPanel.addEventListener('mousemove', resetInactivityTimer);
    controlPanel.addEventListener('click', resetInactivityTimer);
    controlPanel.addEventListener('touchstart', resetInactivityTimer);

    // Add click event for minimize button
    minimizeButton.addEventListener('click', toggleMinimized);

    // Method 1: Enhanced User Interaction Simulation
    function autoPlayWithInteraction() {
        if (!audioElement) return Promise.reject('No audio element found');

        return new Promise((resolve, reject) => {
            // Update UI to show we're using this method
            countdownDisplay.textContent = 'Method 1...';

            // Create and trigger various user interaction events
            const interactionEvents = ['touchend', 'click', 'keydown'];
            interactionEvents.forEach(eventType => {
                document.dispatchEvent(new Event(eventType, { bubbles: true }));
            });

            // Force load to ensure content is ready
            try {
                audioElement.load();
            } catch (e) {
                console.log('[Audio Controls] Load error:', e);
            }

            // Ensure volume is set to user's preferred level
            audioElement.volume = 1.0;

            // Ensure playback rate is set
            audioElement.playbackRate = playbackRate;

            // Try playback with interaction flag
            audioElement.play()
                .then(() => {
                    console.log('[Audio Controls] Method 1 successful');
                    resolve();
                })
                .catch(err => {
                    console.log('[Audio Controls] Method 1 failed:', err);
                    reject(err);
                });
        });
    }

    // Method 2: Progressive Media Loading Strategy
    function autoPlayWithProgressiveLoading() {
        if (!audioElement) return Promise.reject('No audio element found');

        return new Promise((resolve, reject) => {
            // Update UI
            countdownDisplay.textContent = 'Method 2...';

            // Store original values to restore later
            const originalVolume = audioElement.volume || 1.0;
            let volumeSetSuccessful = false;
            let loadTriggered = false;
            let canPlayHandlerSet = false;

            // Function to attempt playback once media can play
            const onCanPlay = () => {
                // Start with very low volume
                try {
                    audioElement.volume = 0.001;
                    volumeSetSuccessful = true;
                } catch (volErr) {
                    console.log('[Audio Controls] Could not set volume:', volErr);
                }

                // Clean up handler to avoid duplicate calls
                if (canPlayHandlerSet) {
                    audioElement.removeEventListener('canplay', onCanPlay);
                    canPlayHandlerSet = false;
                }

                // Attempt playback
                audioElement.play()
                    .then(() => {
                        if (volumeSetSuccessful) {
                            // Gradually restore volume
                            const volumeIncrease = setInterval(() => {
                                if (audioElement.volume < originalVolume) {
                                    audioElement.volume = Math.min(originalVolume, audioElement.volume + 0.1);
                                } else {
                                    clearInterval(volumeIncrease);
                                }
                            }, 200);
                        }

                        console.log('[Audio Controls] Method 2 successful');
                        resolve();
                    })
                    .catch(err => {
                        console.log('[Audio Controls] Method 2 failed:', err);
                        // Restore volume regardless
                        if (volumeSetSuccessful) {
                            audioElement.volume = originalVolume;
                        }
                        reject(err);
                    });
            };

            // Set up timeout to avoid hanging
            const timeout = setTimeout(() => {
                if (canPlayHandlerSet) {
                    audioElement.removeEventListener('canplay', onCanPlay);
                    canPlayHandlerSet = false;
                }

                // Make one final direct attempt before rejecting
                audioElement.play()
                    .then(resolve)
                    .catch(err => reject('Timed out waiting for canplay event: ' + err));

                // Restore volume
                if (volumeSetSuccessful) {
                    audioElement.volume = originalVolume;
                }
            }, 3000);

            try {
                // Listen for media ready state
                audioElement.addEventListener('canplay', onCanPlay);
                canPlayHandlerSet = true;

                // Force reload to trigger events
                try {
                    audioElement.load();
                    loadTriggered = true;
                    console.log('[Audio Controls] Load triggered for Method 2');
                } catch (e) {
                    console.log('[Audio Controls] Load failed:', e);
                }

                // If currentTime > 0, we're resuming, so try direct play as well
                if (audioElement.currentTime > 0) {
                    // Try direct playback too for quicker resume
                    audioElement.play()
                        .then(() => {
                            clearTimeout(timeout);
                            if (canPlayHandlerSet) {
                                audioElement.removeEventListener('canplay', onCanPlay);
                            }
                            resolve();
                        })
                        .catch(err => {
                            console.log('[Audio Controls] Direct resume attempt failed:', err);
                            // Continue waiting for canplay event
                        });
                }
            } catch (e) {
                clearTimeout(timeout);
                reject(e);
            }
        });
    }

    // Method 3: Audio Context API Fallback
    function autoPlayWithAudioContext() {
        if (!audioElement) return Promise.reject('No audio element found');

        return new Promise((resolve, reject) => {
            // Update UI
            countdownDisplay.textContent = 'Method 3...';

            try {
                // Create audio context if not already created
                if (!audioContext) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (!AudioContext) {
                        return reject('AudioContext not supported');
                    }

                    audioContext = new AudioContext();
                }

                // Resume context if suspended
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }

                // Create a silent buffer to unlock audio context
                const buffer = audioContext.createBuffer(1, 1, 22050);
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start(0);

                // Try using a different approach with media source
                try {
                    // Disconnect any existing connections
                    audioElement._mediaSource = audioElement._mediaSource || audioContext.createMediaElementSource(audioElement);
                    audioElement._mediaSource.connect(audioContext.destination);
                } catch (sourceErr) {
                    // If we already created a media source (which can only be done once),
                    // this will error but we can ignore it
                    console.log('[Audio Controls] Media source already created:', sourceErr);
                }

                // Ensure correct playback rate
                audioElement.playbackRate = playbackRate;

                // Try to play using standard method after unlocking
                audioElement.play()
                    .then(() => {
                        console.log('[Audio Controls] Method 3 successful');
                        resolve();
                    })
                    .catch(err => {
                        console.log('[Audio Controls] Method 3 failed:', err);
                        reject(err);
                    });
            } catch (e) {
                console.log('[Audio Controls] Audio context error:', e);
                reject(e);
            }
        });
    }

    // Function to attempt playback with all methods sequentially
    function attemptAutoPlay() {
        // Reset retry counter
        retryAttempts = 0;

        // Update UI to show we're attempting playback
        playPauseButton.innerHTML = '⏳';
        countdownDisplay.textContent = 'Starting...';

        // Special case for resuming from a non-zero position
        const isResuming = audioElement && audioElement.currentTime > 0 && !audioElement.ended;

        // Chain promises to try each method in sequence
        let playPromise;

        if (isResuming) {
            // If resuming, attempt direct playback first
            playPromise = new Promise((resolve, reject) => {
                console.log("[Audio Controls] Attempting direct resume from:", audioElement.currentTime);
                countdownDisplay.textContent = 'Resuming...';

                audioElement.play()
                    .then(() => {
                        console.log("[Audio Controls] Direct resume successful");
                        resolve();
                    })
                    .catch(err => {
                        console.log("[Audio Controls] Direct resume failed:", err);
                        reject(err);
                    });
            });
        } else if (USE_INTERACTION_METHOD) {
            playPromise = autoPlayWithInteraction();
        } else {
            playPromise = Promise.reject('Method 1 disabled');
        }

        // Try Method 2 if initial method fails
        playPromise
            .catch(err => {
                console.log('[Audio Controls] Trying next method...');
                if (USE_PROGRESSIVE_LOAD) {
                    return new Promise(resolve => {
                        // Add a short delay before trying the next method
                        setTimeout(() => {
                            autoPlayWithProgressiveLoading().then(resolve).catch(err => {
                                throw err;
                            });
                        }, 500);
                    });
                }
                return Promise.reject('Method 2 disabled');
            })
            // Try Method 3 if Method 2 fails
            .catch(err => {
                console.log('[Audio Controls] Trying final method...');
                if (USE_AUDIO_CONTEXT) {
                    return new Promise(resolve => {
                        // Add a short delay before trying the next method
                        setTimeout(() => {
                            autoPlayWithAudioContext().then(resolve).catch(err => {
                                throw err;
                            });
                        }, 500);
                    });
                }
                return Promise.reject('Method 3 disabled');
            })
            // Handle final success or failure
            .then(() => {
                // Success with any method
                updatePlayPauseButton();
                countdownDisplay.textContent = '';
                hasUserInteracted = true;
            })
            .catch(err => {
                console.log('[Audio Controls] All auto-play methods failed:', err);
                // All methods failed, show message and enable manual play
                countdownDisplay.textContent = 'Tap to play';
                playPauseButton.innerHTML = '▶️';
                updatePlayPauseButton();
            });
    }

    // Apply playback rate to all audio elements
    function applyPlaybackRateToAllAudio() {
        const now = Date.now();
        // Throttle frequent applications (but still allow force flag to override)
        if ((now - lastRateApplication) < 500) return;

        lastRateApplication = now;
        const allAudioElements = document.querySelectorAll(AUDIO_SELECTOR);

        if (allAudioElements.length > 0) {
            allAudioElements.forEach(audio => {
                if (audio.playbackRate !== playbackRate) {
                    audio.playbackRate = playbackRate;
                    console.log(`[Audio Controls] Applied rate ${playbackRate.toFixed(1)}x to audio element`);
                }
            });

            // If our main audio element isn't set yet, use the first one found
            if (!audioElement && allAudioElements.length > 0) {
                audioElement = allAudioElements[0];
                initializeAudio();
            }
        }
    }

    // Function to find audio element with immediate rate application
    function findAudioElement() {
        const allAudio = document.querySelectorAll(AUDIO_SELECTOR);

        if (allAudio.length > 0) {
            // Apply rate to all audio elements found
            applyPlaybackRateToAllAudio();

            // If we haven't set our main audio element yet, do so now
            if (!audioElement) {
                audioElement = allAudio[0];
                initializeAudio();
                // Make sure bubble icon gets updated immediately
                updateBubbleIcon();
                return true;
            } else {
                // Check if our tracked audio element has changed
                if (audioElement !== allAudio[0]) {
                    audioElement = allAudio[0];
                    initializeAudio();
                    updateBubbleIcon();
                }
            }
        }

        // Try again after a short delay if no audio found
        setTimeout(findAudioElement, 300);
        return false;
    }

    // Function to format time in MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // Function to run the countdown timer
    function startCountdown(seconds) {
        // Clear any existing countdown
        if (countdownTimer) {
            clearInterval(countdownTimer);
        }

        let remainingSeconds = seconds;
        updateCountdownDisplay(remainingSeconds);

        countdownTimer = setInterval(() => {
            remainingSeconds--;
            updateCountdownDisplay(remainingSeconds);

            if (remainingSeconds <= 0) {
                clearInterval(countdownTimer);
                countdownTimer = null;

                // Use new autoplay function when countdown reaches zero
                if (audioElement) {
                    attemptAutoPlay();
                }
            }
        }, 1000);
    }

    // Function to update countdown display
    function updateCountdownDisplay(seconds) {
        countdownDisplay.textContent = `Auto ${seconds}s`;
    }

    // Function to play audio with retry mechanism (legacy - kept for backward compatibility)
    function playAudioWithRetry() {
        attemptAutoPlay();
    }

    // Function to initialize audio controls
    function initializeAudio() {
        if (!audioElement) return;

        // Immediately set playback rate
        audioElement.playbackRate = playbackRate;

        // Set preload to auto for better playback
        audioElement.preload = 'auto';

        // Update UI based on current state
        updatePlayPauseButton();

        // Get duration when metadata is loaded and start countdown
        if (audioElement.readyState >= 1) {
            handleAudioLoaded();
        } else {
            audioElement.addEventListener('loadedmetadata', handleAudioLoaded);
        }

        // Add event listener to ensure playback rate is maintained
        audioElement.addEventListener('ratechange', function() {
            // If something else changed the rate, reset it to our value
            if (this.playbackRate !== playbackRate) {
                console.log("[Audio Controls] Rate changed externally, resetting to", playbackRate);
                this.playbackRate = playbackRate;
            }
        });

        // Add event listeners
        audioElement.addEventListener('play', function() {
            updatePlayPauseButton();
            // Update bubble icon specifically
            updateBubbleIcon();
        });

        audioElement.addEventListener('pause', function() {
            updatePlayPauseButton();
            // Update bubble icon specifically
            updateBubbleIcon();
        });

        audioElement.addEventListener('ended', function() {
            updatePlayPauseButton();
            // Update bubble icon specifically
            updateBubbleIcon();
        });

        // Initial update of bubble icon
        updateBubbleIcon();
    }

    // Function to handle audio loaded event
    function handleAudioLoaded() {
        if (!audioElement) return;

        // Ensure playback rate is set
        audioElement.playbackRate = playbackRate;

        // Update bubble icon based on current state
        updateBubbleIcon();

        // Start countdown for auto-play (5 seconds)
        const countdownSeconds = Math.floor(AUTO_PLAY_DELAY / 1000);
        startCountdown(countdownSeconds);
    }

    // Function to update the bubble icon based on audio state
    function updateBubbleIcon() {
        if (!audioElement) {
            bubbleIcon.innerHTML = '🔊'; // Default icon when no audio
            return;
        }

        if (audioElement.paused) {
            bubbleIcon.innerHTML = '▶️'; // Play icon when paused (showing what will happen on click)
        } else {
            bubbleIcon.innerHTML = '⏸️'; // Pause icon when playing (showing what will happen on click)
        }
    }

    // Function to update play/pause button state
    function updatePlayPauseButton() {
        if (!audioElement) return;

        // Ensure playback rate is correct
        if (audioElement.playbackRate !== playbackRate) {
            audioElement.playbackRate = playbackRate;
        }

        if (audioElement.paused) {
            playPauseButton.innerHTML = '▶️';
            playPauseButton.style.backgroundColor = '#4CAF50';
        } else {
            playPauseButton.innerHTML = '⏸️';
            playPauseButton.style.backgroundColor = '#F44336';

            // If playing, clear countdown
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
                countdownDisplay.textContent = '';
            }
        }

        // Update bubble icon
        updateBubbleIcon();
    }

    // Function to create a "resume" toast notification
    function showResumeToast(position) {
        // Create and style the toast
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Format the time nicely
        const formattedTime = formatTime(position);
        toast.textContent = `Resuming from ${formattedTime}`;

        // Add to document
        document.body.appendChild(toast);

        // Fade in
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        // Remove after 2 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    // Function to toggle play/pause with better resume handling
    function togglePlayPause() {
        if (!audioElement) return;

        // Reset inactivity timer on user interaction
        resetInactivityTimer();

        // Set flag for user interaction
        hasUserInteracted = true;

        // Ensure playback rate is set correctly
        if (audioElement.playbackRate !== playbackRate) {
            audioElement.playbackRate = playbackRate;
        }

        if (audioElement.paused) {
            // Check if currentTime is > 0, indicating playback was started before
            if (audioElement.currentTime > 0 && !audioElement.ended) {
                // Show resume toast if resuming from a significant position (more than 3 seconds in)
                if (audioElement.currentTime > 3) {
                    showResumeToast(audioElement.currentTime);
                }

                // Simply resume playback without using autoplay methods
                console.log("[Audio Controls] Resuming playback from position:", audioElement.currentTime);

                // Update UI immediately to provide feedback
                playPauseButton.innerHTML = '⏳';
                countdownDisplay.textContent = 'Resuming...';

                audioElement.play()
                    .then(() => {
                        updatePlayPauseButton();
                        countdownDisplay.textContent = '';
                    })
                    .catch(err => {
                        console.log("[Audio Controls] Resume failed, trying autoplay methods:", err);
                        attemptAutoPlay();
                    });
            } else {
                // If starting from beginning or after ended, try all methods
                attemptAutoPlay();
            }
        } else {
            audioElement.pause();
            updatePlayPauseButton();
        }
    }

    // Function to update playback speed
    function updatePlaybackSpeed(newRate) {
        // Reset inactivity timer on user interaction
        resetInactivityTimer();

        playbackRate = newRate;

        // Apply to all audio elements immediately
        applyPlaybackRateToAllAudio();

        // Update display
        speedDisplay.textContent = `${playbackRate.toFixed(1)}x`;

        // Save to localStorage
        localStorage.setItem('audio_playback_rate', playbackRate);
    }

    // Function to decrease playback speed
    function decreaseSpeed() {
        const newRate = Math.max(0.5, playbackRate - 0.1);
        updatePlaybackSpeed(newRate);
    }

    // Function to increase playback speed
    function increaseSpeed() {
        const newRate = Math.min(2.5, playbackRate + 0.1);
        updatePlaybackSpeed(newRate);
    }

    // Set up event listeners for buttons
    playPauseButton.addEventListener('click', togglePlayPause);
    speedDownButton.addEventListener('click', decreaseSpeed);
    speedUpButton.addEventListener('click', increaseSpeed);

    // Make bubble clickable with smart behavior
    bubbleView.addEventListener('click', function() {
        if (audioElement) {
            if (audioElement.paused) {
                // If audio exists and is paused, try to play it
                togglePlayPause();

                // After attempting to play, check if we're still paused (play failed)
                // and expand the controls in that case for more options
                setTimeout(() => {
                    if (audioElement.paused) {
                        toggleMinimized();
                    }
                }, 300);
            } else {
                // If we're playing, expand the panel
                toggleMinimized();
            }
        } else {
            // If no audio, just expand
            toggleMinimized();
        }
    });

    // Start periodic rate check interval and UI updates
    function startRateCheckInterval() {
        if (rateCheckInterval) {
            clearInterval(rateCheckInterval);
        }

        rateCheckInterval = setInterval(() => {
            applyPlaybackRateToAllAudio();

            // Update bubble icon even when minimized
            if (isMinimized && audioElement) {
                updateBubbleIcon();
            }
        }, RATE_CHECK_INTERVAL);
    }

    // Create an observer to watch for new audio elements
    const audioObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                let foundNewAudio = false;

                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeName === 'AUDIO' ||
                        (node.nodeType === 1 && node.querySelector(AUDIO_SELECTOR))) {
                        foundNewAudio = true;
                    }
                });

                if (foundNewAudio) {
                    // Immediately apply rate to any new audio elements
                    applyPlaybackRateToAllAudio();

                    // Reset audio element and reinitialize if needed
                    if (!audioElement) {
                        findAudioElement();
                    }
                }
            }
        });
    });

    // Function to immediately apply playback rate when the DOM is ready
    function onDOMReady() {
        console.log("[Audio Controls] DOM Content Loaded - initializing audio controls");

        // Try to unlock audio context early for iOS
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioContext = new AudioContext();

                // Create and play silent buffer
                const buffer = audioContext.createBuffer(1, 1, 22050);
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start(0);

                // Resume if needed
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }

                console.log("[Audio Controls] AudioContext initialized:", audioContext.state);
            }
        } catch (e) {
            console.log("[Audio Controls] Early AudioContext initialization error:", e);
        }

        // Set up global event handlers for iOS audio unlocking
        const unlockEvents = ['touchstart', 'touchend', 'mousedown', 'keydown'];
        const unlockAudio = function() {
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }

            // Remove these event listeners once used
            unlockEvents.forEach(event => {
                document.removeEventListener(event, unlockAudio);
            });
        };

        // Add unlock event listeners
        unlockEvents.forEach(event => {
            document.addEventListener(event, unlockAudio, false);
        });

        // Immediately try to find and configure audio
        applyPlaybackRateToAllAudio();
        findAudioElement();

        // Start the rate check interval
        startRateCheckInterval();

        // Start observing the document
        audioObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize as soon as the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
        // DOM already loaded, initialize immediately
        onDOMReady();
    }

    // Double-check when page is fully loaded
    window.addEventListener('load', function() {
        console.log("[Audio Controls] Window loaded - ensuring audio playback rate");
        applyPlaybackRateToAllAudio();
    });

    // Initialize the view state
    updateViewState();
})();