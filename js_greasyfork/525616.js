// ==UserScript==
// @name         Wyze Thumbnail Slideshow
// @namespace    http://ptelectronics.net
// @version      1.9.14
// @description  Adds a slideshow feature to Wyze Events page with keyboard navigation, playback speed control, interactive timeline, and more
// @author       Math Shamenson
// @match        https://my.wyze.com/events*
// @grant        GM_xmlhttpRequest
// @connect      wyze-event-streaming-prod.a.momentohq.com
// @license      MIT
// @run-at       document-idle
// @supportURL   https://greasyfork.org/scripts/SCRIPT_ID/feedback
// @homepageURL  https://greasyfork.org/scripts/SCRIPT_ID
// @downloadURL https://update.greasyfork.org/scripts/525616/Wyze%20Thumbnail%20Slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/525616/Wyze%20Thumbnail%20Slideshow.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 1. State variables
    // 2. Logger
    // 3. Core slideshow logic
    // 4. UI initialization and styles
    // 5. Controls and features
    // 6. Memory management
    // 7. Initialization system
    // End of IIFE

    // ------------------------------
    //       SHARED SLIDESHOW STATE
    // ------------------------------
    let thumbnails = []; // Array of objects: { src, videoSrc }
    let currentIndex = 0;
    let interval = null;
    let isPlaying = false;
    let speed = 1000; // Default: 1s
    const MIN_SPEED = 200; // Min speed (0.2s)
    const MAX_SPEED = 5000; // Max speed (5s)
    let slideshowInitialized = false;

    // For lazy-loading IntersectionObserver
    let thumbnailObserver = null;

    // --------------------------------
    //             LOGGER
    // --------------------------------
    const Logger = {
        levels: {
            ERROR: 'ERROR',
            WARN:  'WARN',
            INFO:  'INFO',
            DEBUG: 'DEBUG'
        },

        log(level, message, error = null) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] [${level}] ${message}`;

            if (localStorage.getItem('wyzeSlideshow_debug') === 'false') {
                console.log(logMessage);
                if (error) console.error(error);
            }

            if (!window.wyzeSlideshowLogs) window.wyzeSlideshowLogs = [];
            window.wyzeSlideshowLogs.push({ timestamp, level, message, error });

            if (window.wyzeSlideshowLogs.length > 1000) {
                window.wyzeSlideshowLogs.shift();
            }
        }
    };
    // DOM Observer Functions
function observeDOMChanges() {
    let debounceTimeout;
    const observer = new MutationObserver((mutationsList) => {
        Logger.log(Logger.levels.DEBUG, `MutationObserver saw ${mutationsList.length} mutations.`);
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            collectThumbnailsAndUpdateUI();
        }, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    Logger.log(Logger.levels.INFO, 'MutationObserver initialized.');
}

// Lazy Loading Functions
function improvedThumbnailCollection() {
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    thumbnailObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    Logger.log(Logger.levels.DEBUG, `Lazy-loaded thumbnail: ${img.alt}`);
                }
                thumbnailObserver.unobserve(img);
            }
        });
    }, observerOptions);

    Logger.log(Logger.levels.INFO, 'IntersectionObserver for lazy-loading initialized.');
}
    // Set playback speed (referenced in keyboard controls)
function setPlaybackSpeed(multiplier) {
    if (multiplier === 1) {
        speed = 1000;
    } else {
        speed = Math.floor(1000 / multiplier);
    }
    speed = Math.max(MIN_SPEED, Math.min(speed, MAX_SPEED));

    if (isPlaying) {
        pauseSlideshow();
        startSlideshowInterval();
    }
    updateSpeedDisplay();
    Logger.log(Logger.levels.INFO, `Playback speed set via multiplier (${multiplier}). New speed: ${speed}ms.`);
}

// Jump to percentage (used in timeline navigation)
function jumpToPercentage(percent) {
    if (thumbnails.length === 0) return;

    const targetIndex = Math.floor((percent / 100) * thumbnails.length);
    currentIndex = Math.min(targetIndex, thumbnails.length - 1);
    updateSlideshow();
    Logger.log(Logger.levels.INFO, `Jumped to ${percent}% (index: ${currentIndex})`);
}

// Show/hide thumbnail preview functions
function showThumbnailPreview(index, x, y) {
    if (!thumbnails[index]) return;

    let preview = document.getElementById('timeline-preview');
    if (!preview) {
        preview = document.createElement('div');
        preview.id = 'timeline-preview';
        preview.style.cssText = `
            position: fixed;
            background: white;
            padding: 5px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 10004;
            pointer-events: none;
        `;
        document.body.appendChild(preview);
    }

    const img = new Image();
    img.src = thumbnails[index].src;
    img.style.maxWidth = '200px';
    img.style.maxHeight = '150px';

    preview.innerHTML = '';
    preview.appendChild(img);

    preview.style.left = `${x - preview.offsetWidth/2}px`;
    preview.style.top = `${y - preview.offsetHeight - 10}px`;
    preview.style.display = 'block';
}

function hideThumbnailPreview() {
    const preview = document.getElementById('timeline-preview');
    if (preview) {
        preview.style.display = 'none';
    }
}

// Button Management
function addStartButton() {
    let btn = document.getElementById('start-slideshow-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'start-slideshow-btn';
        btn.textContent = 'Start Slideshow';
        btn.className = 'slideshow-button';
        btn.onclick = startSlideshow;
        document.body.appendChild(btn);
        Logger.log(Logger.levels.INFO, 'Start Slideshow button added.');
    } else {
        btn.style.display = 'block';
        Logger.log(Logger.levels.DEBUG, 'Start Slideshow button already exists, now ensured visible.');
    }
}

// Close functions
function closeSlideshow() {
    pauseSlideshow();
    const container = document.getElementById('slideshow-container');
    if (container) {
        container.style.display = 'none';
        Logger.log(Logger.levels.INFO, 'Slideshow closed.');
    }
}

// Timeline management functions
function handleKeyboard(e) {
    const container = document.getElementById('slideshow-container');
    if (!container || container.style.display === 'none') return;

    switch (e.key) {
        case 'ArrowLeft':
            prevImage();
            break;
        case 'ArrowRight':
            nextImage();
            break;
        case ' ':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'Escape':
            closeSlideshow();
            break;
        case '+':
        case '=':
            increaseSpeed();
            break;
        case '-':
            decreaseSpeed();
            break;
        default:
            break;
    }
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSlideshow();
        Logger.log(Logger.levels.INFO, 'Slideshow paused.');
    } else {
        startSlideshowInterval();
        Logger.log(Logger.levels.INFO, 'Slideshow playing.');
    }
}

// Memory management
function cleanupUnusedThumbnails() {
    const MAX_CACHED_THUMBNAILS = 50;
    if (thumbnails.length > MAX_CACHED_THUMBNAILS) {
        const excess = thumbnails.length - MAX_CACHED_THUMBNAILS;
        const removed = thumbnails.splice(MAX_CACHED_THUMBNAILS, excess);
        Logger.log(Logger.levels.INFO, `Cleaned up ${removed.length} excess thumbnails from memory.`);

        // Clean up DOM thumbnails
        const unusedThumbs = document.querySelectorAll('.slideshow-thumbnail:not(.active)');
        unusedThumbs.forEach((thumb) => {
            thumb.src = '';
            thumb.remove();
            Logger.log(Logger.levels.DEBUG, 'Removed unused thumbnail from DOM.');
        });
    }
}

    // --------------------------------
    //        CORE SLIDESHOW LOGIC
    // --------------------------------

    function startSlideshow() {
        Logger.log(Logger.levels.INFO, 'Starting slideshow...');
        collectThumbnailsAndUpdateUI();

        const container = document.getElementById('slideshow-container');
        if (!container) {
            Logger.log(Logger.levels.ERROR, 'Slideshow container not found.');
            return;
        }

        if (thumbnails.length > 0) {
            currentIndex = 0;
            updateSlideshow();
            container.style.display = 'flex';
            togglePlayPause(); // Start playing by default
            Logger.log(Logger.levels.INFO, 'Slideshow started.');
        } else {
            notifyNoThumbnails();
            Logger.log(Logger.levels.WARN, 'No thumbnails to display.');
        }
    }

function updateSlideshow() {
    const container = document.getElementById('slideshow-container');
    const link = document.getElementById('slideshow-link');
    const img = document.getElementById('slideshow-image');

    if (!container || !img || thumbnails.length === 0) {
        Logger.log(Logger.levels.WARN, 'No container/image or thumbnails available for slideshow.');
        return;
    }

    currentIndex = (currentIndex + thumbnails.length) % thumbnails.length;
    const currentThumbnail = thumbnails[currentIndex];

    if (currentThumbnail) {
        if (currentThumbnail.needsRotation) {
            img.classList.add('doorbell-orientation');
            link.classList.add('doorbell-container');
            container.classList.add('has-rotated-image');
        } else {
            img.classList.remove('doorbell-orientation');
            link.classList.remove('doorbell-container');
            container.classList.remove('has-rotated-image');
        }

        img.src = currentThumbnail.src;

        if (link) {
            link.onclick = (e) => {
                e.preventDefault();
                playVideo(currentThumbnail.videoSrc);
            };
            link.href = '#';
        }

        Logger.log(Logger.levels.INFO, `Displaying thumbnail ${currentIndex + 1}/${thumbnails.length} (rotation: ${currentThumbnail.needsRotation})`);
        updateProgressBar();
    }
}
    // [Previous functions through createHelpOverlay() remain unchanged]

    // --------------------------------
    //      COLLECT THUMBNAILS
    // --------------------------------
/*
    function collectThumbnails() {
        thumbnails = [];
        const eventDivs = document.querySelectorAll('div[id^="event_"]');

        Logger.log(Logger.levels.INFO, `Found ${eventDivs.length} event containers`);

        eventDivs.forEach(eventDiv => {
            const imgWrapper = eventDiv.querySelector('.VideoWrap img');

            if (imgWrapper) {
                const src = imgWrapper.dataset.src || imgWrapper.src;

                // Extract event ID using updated pattern for Wyze's current system
                const match = src.match(/wyze-thumbnail-service-prod\/(.+?)_\d+\.jpg/);
                if (match) {
                    const eventId = match[1];
                    // Construct video URL using Wyze's streaming service endpoint
                    const videoSrc = `https://wyze-event-streaming-prod.a.momentohq.com/cache/wyze-streaming-service-prod/${eventId}.mp4`;

                    thumbnails.push({ src, videoSrc });
                    Logger.log(Logger.levels.DEBUG, `Added thumbnail for event ${eventId}`);
                } else {
                    Logger.log(Logger.levels.DEBUG, `Could not parse event ID from thumbnail URL: ${src}`);
                }
            }
        });

        Logger.log(Logger.levels.INFO, `Collected ${thumbnails.length} thumbnails`);
        updateStartButtonVisibility();
    }
*/

function collectThumbnails() {
    thumbnails = [];
    const eventDivs = document.querySelectorAll('div[id^="event_"]');

    Logger.log(Logger.levels.INFO, `Found ${eventDivs.length} event containers`);

    eventDivs.forEach(eventDiv => {
        const imgWrapper = eventDiv.querySelector('.VideoWrap img');

        if (imgWrapper) {
            const src = imgWrapper.dataset.src || imgWrapper.src;

            if (!src) {
                Logger.log(Logger.levels.DEBUG, 'No src found for image wrapper');
                return;
            }

            // Check if this is a doorbell camera image that needs rotation
            const needsRotation = src.includes('wyze-device-alarm-file-face.s3.us-west-2.amazonaws.com');

            let eventId = null;
            let videoSrc = null;

            // Multiple pattern matching
            let match = src.match(/wyze-thumbnail-service-prod\/(.+?)_\d+\.jpg/) ||
                       src.match(/cp-t-usw2\.s3[^\/]*\/([^_]+)_\d+\.jpg/) ||
                       src.match(/momentohq\.com\/([^_]+)_\d+\.jpg/) ||
                       src.match(/([a-f0-9-]{36})/i) ||
                       src.match(/(\w+)\/\d{4}-\d{2}-\d{2}\/(\w+)/); // New pattern for alarm files

            if (match) {
                eventId = match[1];
                videoSrc = `https://wyze-event-streaming-prod.a.momentohq.com/cache/wyze-streaming-service-prod/${eventId}.mp4`;

                thumbnails.push({
                    src,
                    videoSrc,
                    eventId,
                    needsRotation: needsRotation,
                    timestamp: eventDiv.getAttribute('data-timestamp') || null
                });

                Logger.log(Logger.levels.DEBUG, `Added thumbnail for event ${eventId} (rotation: ${needsRotation}), src: ${src}`);
            }
        }
    });

    // Sort thumbnails by timestamp if available
    if (thumbnails.length > 0 && thumbnails[0].timestamp) {
        thumbnails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    Logger.log(Logger.levels.INFO, `Collected ${thumbnails.length} thumbnails`);
    updateStartButtonVisibility();
}


    // --------------------------------
    //       VIDEO PLAYER CONTROL
    // --------------------------------

    function playVideo(videoSrc) {
        const videoPlayer = document.querySelector('video.vjs-tech');
        const spinner = document.getElementById('loading-spinner');

        if (!videoPlayer) {
            Logger.log(Logger.levels.ERROR, 'Video player element not found.');
            notifyVideoPlayerNotFound();
            return;
        }

        if (spinner) spinner.style.display = 'block';

        // Using GM_xmlhttpRequest for cross-origin video requests
        GM_xmlhttpRequest({
            method: 'GET',
            url: videoSrc,
            responseType: 'blob',
            onload: function(response) {
                const blobUrl = URL.createObjectURL(response.response);

                videoPlayer.pause();
                videoPlayer.src = blobUrl;
                videoPlayer.load();

                videoPlayer.play()
                    .then(() => {
                        Logger.log(Logger.levels.INFO, `Playing video: ${videoSrc}`);
                        if (spinner) spinner.style.display = 'none';
                    })
                    .catch(error => {
                        Logger.log(Logger.levels.ERROR, `Error playing video: ${videoSrc}`, error);
                        notifyVideoError();
                        if (spinner) spinner.style.display = 'none';
                    });

                videoPlayer.addEventListener('ended', () => {
                    URL.revokeObjectURL(blobUrl);
                }, { once: true });
            },
            onerror: function(error) {
                Logger.log(Logger.levels.ERROR, `Failed to fetch video: ${videoSrc}`, error);
                notifyVideoError();
                if (spinner) spinner.style.display = 'none';
            }
        });
    }

// After the Logger object but before UI initialization:

function collectThumbnailsAndUpdateUI() {
    collectThumbnails();
    updateSlideshowUI();
}

function updateSlideshowUI() {
    const container = document.getElementById('slideshow-container');
    if (!container) return;
    updateProgressBar();
}

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
        Logger.log(Logger.levels.DEBUG, `Preloading image: ${src}`);
    });
}

// Navigation Functions
function prevImage() {
    pauseSlideshow();
    currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    Logger.log(Logger.levels.DEBUG, 'Navigating to previous image.');
    updateSlideshow();
}

function nextImage() {
    pauseSlideshow();
    currentIndex = (currentIndex + 1) % thumbnails.length;
    Logger.log(Logger.levels.DEBUG, 'Navigating to next image.');
    updateSlideshow();
}



    function startSlideshowInterval() {
    isPlaying = true;

    // Start auto-play with dynamic thumbnail updates
    interval = setInterval(() => {
        // Refresh thumbnails dynamically
        collectThumbnails();

        // Ensure the index stays within bounds
        if (currentIndex >= thumbnails.length) {
            currentIndex = 0; // Loop back to the start if out of bounds
        }

        updateSlideshow();

        // Increment to the next slide
        currentIndex = (currentIndex + 1) % thumbnails.length;

    }, speed);

    Logger.log(Logger.levels.INFO, `Slideshow interval started (speed: ${speed}ms).`);
}


function pauseSlideshow() {
    isPlaying = false;
    if (interval) {
        clearInterval(interval);
        interval = null;
        Logger.log(Logger.levels.DEBUG, 'Slideshow interval cleared.');
    }
}

// Speed Control Functions
function increaseSpeed() {
    speed = Math.max(MIN_SPEED, speed - 200);
    if (isPlaying) {
        pauseSlideshow();
        startSlideshowInterval();
    }
    updateSpeedDisplay();
    Logger.log(Logger.levels.INFO, `Playback speed increased to ${speed}ms`);
}

function decreaseSpeed() {
    speed = Math.min(MAX_SPEED, speed + 200);
    if (isPlaying) {
        pauseSlideshow();
        startSlideshowInterval();
    }
    updateSpeedDisplay();
    Logger.log(Logger.levels.INFO, `Playback speed decreased to ${speed}ms`);
}

function resetSpeed() {
    speed = 1000;
    if (isPlaying) {
        pauseSlideshow();
        startSlideshowInterval();
    }
    updateSpeedDisplay();
    Logger.log(Logger.levels.INFO, 'Playback speed reset to default');
}

function updateSpeedDisplay() {
    const speedDisplay = document.getElementById('speed-display');
    if (speedDisplay) {
        speedDisplay.textContent = `Speed: ${speed} ms`;
    }
}

// Notification Functions
function notifyNoThumbnails() {
    const el = document.getElementById('no-thumbnails-notification');
    if (el) {
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 3000);
        Logger.log(Logger.levels.INFO, 'Displayed "No thumbnails" notification');
    }
}

function notifyVideoError() {
    const el = document.getElementById('video-error-notification');
    if (el) {
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 3000);
        Logger.log(Logger.levels.INFO, 'Displayed "Video error" notification');
    }
}

function notifyVideoPlayerNotFound() {
    const el = document.getElementById('video-player-not-found-notification');
    if (el) {
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 3000);
        Logger.log(Logger.levels.INFO, 'Displayed "Video player not found" notification');
    }
}

// Display Control Functions
function toggleFullscreen() {
    const container = document.getElementById('slideshow-container');
    if (!container) return;

    try {
        if (!document.fullscreenElement) {
            container.requestFullscreen();
            Logger.log(Logger.levels.INFO, 'Entered fullscreen mode');
        } else {
            document.exitFullscreen();
            Logger.log(Logger.levels.INFO, 'Exited fullscreen mode');
        }
    } catch (error) {
        Logger.log(Logger.levels.ERROR, 'Fullscreen toggle failed', error);
    }
}

function toggleMute() {
    const videoPlayer = document.querySelector('video.vjs-tech');
    if (videoPlayer) {
        videoPlayer.muted = !videoPlayer.muted;
        Logger.log(Logger.levels.INFO, `Video ${videoPlayer.muted ? 'muted' : 'unmuted'}`);
    }
}

function toggleHelpOverlay() {
    const helpOverlay = document.getElementById('slideshow-help-overlay');
    if (helpOverlay) {
        const isHidden = helpOverlay.style.display === 'none' || !helpOverlay.style.display;
        helpOverlay.style.display = isHidden ? 'block' : 'none';
        Logger.log(Logger.levels.INFO, `Help overlay ${isHidden ? 'shown' : 'hidden'}`);
    }
}

function updateStartButtonVisibility() {
    const startBtn = document.getElementById('start-slideshow-btn');
    if (startBtn) {
        startBtn.style.display = thumbnails.length > 0 ? 'block' : 'none';
        Logger.log(Logger.levels.DEBUG, `Start button visibility updated: ${thumbnails.length > 0 ? 'visible' : 'hidden'}`);
    }
}
    function updateProgressBar() {
    const progress = document.getElementById('progress');
    if (!progress) {
        Logger.log(Logger.levels.DEBUG, 'No progress bar found.');
        return;
    }

    if (thumbnails.length <= 1) {
        progress.style.width = '100%';
        return;
    }

    const percent = ((currentIndex + 1) / thumbnails.length) * 100;
    progress.style.width = percent + '%';
    Logger.log(Logger.levels.DEBUG, `Progress bar updated to ${percent}%`);
}

function handleButtonClick(label) {
    Logger.log(Logger.levels.DEBUG, `Button clicked: ${label}`);
    switch (label) {
        case 'Prev':
            prevImage();
            break;
        case 'Play/Pause':
            togglePlayPause();
            break;
        case 'Next':
            nextImage();
            break;
        case 'Faster':
            increaseSpeed();
            break;
        case 'Slower':
            decreaseSpeed();
            break;
        case 'Reset Speed':
            resetSpeed();
            break;
        case 'Close':
            closeSlideshow();
            break;
        default:
            Logger.log(Logger.levels.WARN, `Unknown button label: ${label}`);
            break;
    }
}
// --------------------------------
    //         UI INITIALIZATION
    // --------------------------------

function injectOrientationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .doorbell-orientation {
            transform: rotate(90deg);
            transform-origin: center center;
            width: auto;
            height: auto;
            max-width: 80vh;  /* Use viewport height for better scaling */
            max-height: 80vw; /* Use viewport width for better scaling */
            object-fit: contain;
            margin: auto;
        }

        .doorbell-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 2rem;
            box-sizing: border-box;
        }

        /* Ensure the slideshow container can accommodate rotated images */
        #slideshow-container.has-rotated-image {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #slideshow-container {
                position: fixed;
                top: 5%;
                left: 5%;
                width: 90%;
                height: 90%;
                background: rgba(0, 0, 0, 0.95);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                border-radius: 10px;
                border: 2px solid #fff;
                overflow: hidden;
            }
            #slideshow-link {
                display: block;
                max-width: 95%;
                max-height: 75%;
                cursor: pointer;
                text-align: center;
            }
            #slideshow-image {
                max-width: 100%;
                max-height: 100%;
                border-radius: 5px;
            }
            #progress-bar {
                width: 90%;
                height: 30px;
                background: gray;
                margin-top: 10px;
                border-radius: 10px;
                cursor: pointer;
                position: relative;
            }
            #progress {
                height: 100%;
                background: limegreen;
                width: 0%;
                border-radius: 10px;
                transition: width 0.5s ease;
            }
            .slideshow-button, .speed-button {
                margin: 5px;
                padding: 10px 15px;
                border: none;
                border-radius: 5px;
                background-color: #007BFF;
                color: white;
                font-size: 16px;
                cursor: pointer;
            }
            .slideshow-button:hover, .speed-button:hover {
                background-color: #0056b3;
            }
            #speed-display {
                margin-top: 10px;
                font-size: 16px;
            }
            #start-slideshow-btn {
                position: fixed;
                bottom: 10px;
                right: 150px;
                z-index: 10001;
                padding: 10px 15px;
                border: none;
                border-radius: 5px;
                background-color: #28a745;
                color: white;
                font-size: 16px;
                cursor: pointer;
            }
            /* Enhanced visibility for the start button */
            #start-slideshow-btn:hover {
                background-color: #218838;
                transform: scale(1.05);
                transition: all 0.2s ease;
            }
            .slideshow-thumbnail.active {
                border: 3px solid #007BFF;
                border-radius: 5px;
            }
            /* Improved loading spinner visibility */
            #loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: none;
                z-index: 10002;
                background: rgba(0, 0, 0, 0.7);
                padding: 20px;
                border-radius: 10px;
            }
            /* Enhanced notification styling */
            #no-thumbnails-notification,
            #video-error-notification,
            #video-player-not-found-notification {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.8);
                padding: 20px;
                border-radius: 5px;
                z-index: 10003;
                color: white;
                font-size: 18px;
                text-align: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }
            /* Accessibility improvements */
            .slideshow-button:focus,
            .slideshow-thumbnail:focus {
                outline: 3px solid #007BFF;
                outline-offset: 2px;
                box-shadow: 0 0 5px rgba(0,123,255,0.5);
            }
            /* Help overlay styling */
            #slideshow-help-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10001;
                display: none;
            }
            .help-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                color: black;
                max-width: 80%;
                max-height: 80%;
                overflow-y: auto;
            }
            .help-content h3 {
                margin-top: 0;
                color: #007BFF;
            }
            .help-content ul {
                list-style-type: none;
                padding: 0;
            }
            .help-content li {
                margin: 10px 0;
                padding: 5px 0;
                border-bottom: 1px solid #eee;
            }
        `;
        document.head.appendChild(style);
        Logger.log(Logger.levels.INFO, 'Enhanced styles injected.');
    }

    // Enhanced UI creation with better error handling
    function createSlideshowUI() {
        const container = document.createElement('div');
        container.id = 'slideshow-container';
        container.style.display = 'none';

        // Link & main image with improved error handling
        const link = document.createElement('a');
        link.id = 'slideshow-link';
        link.href = '#';
        const img = document.createElement('img');
        img.id = 'slideshow-image';
        img.onerror = () => {
            Logger.log(Logger.levels.ERROR, 'Failed to load image');
            img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ccc"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23666">Error</text></svg>';
        };
        link.appendChild(img);
        container.appendChild(link);

        // Improved spinner with better visibility
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.innerHTML = `
            <div style="text-align: center;">
                <img src="https://i.imgur.com/llF5iyg.gif" alt="Loading..." width="50" height="50">
                <div style="margin-top: 10px; color: white;">Loading video...</div>
            </div>
        `;
        container.appendChild(spinner);

        // Enhanced progress bar with better visual feedback
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        const progress = document.createElement('div');
        progress.id = 'progress';
        progressBar.appendChild(progress);
        container.appendChild(progressBar);

        // Improved control buttons with better accessibility
        const controlContainer = document.createElement('div');
        controlContainer.style.marginTop = '10px';
        controlContainer.style.display = 'flex';
        controlContainer.style.flexWrap = 'wrap';
        controlContainer.style.justifyContent = 'center';

        const controls = [
            { label: 'Prev', icon: '⏮' },
            { label: 'Play/Pause', icon: '⏯' },
            { label: 'Next', icon: '⏭' },
            { label: 'Faster', icon: '⚡' },
            { label: 'Slower', icon: '🐢' },
            { label: 'Reset Speed', icon: '⟲' },
            { label: 'Close', icon: '✖' }
        ];

        controls.forEach(({ label, icon }) => {
            const btn = document.createElement('button');
            btn.textContent = `${icon} ${label}`;
            btn.className = 'slideshow-button';
            btn.setAttribute('aria-label', label);
            btn.onclick = () => handleButtonClick(label);
            controlContainer.appendChild(btn);
        });
        container.appendChild(controlContainer);

        // Enhanced thumbnail preview container
        const thumbnailPreviewContainer = document.createElement('div');
        thumbnailPreviewContainer.id = 'thumbnail-preview-container';
        thumbnailPreviewContainer.style.display = 'flex';
        thumbnailPreviewContainer.style.flexWrap = 'wrap';
        thumbnailPreviewContainer.style.marginTop = '10px';
        container.appendChild(thumbnailPreviewContainer);

        // Improved speed display with better visibility
        const speedDisplay = document.createElement('div');
        speedDisplay.id = 'speed-display';
        speedDisplay.textContent = `Speed: ${speed} ms`;
        container.appendChild(speedDisplay);

        // Enhanced notifications
        const notifications = [
            { id: 'no-thumbnails-notification', text: 'No thumbnails found to start the slideshow.' },
            { id: 'video-error-notification', text: 'Failed to play the selected video.' },
            { id: 'video-player-not-found-notification', text: 'Video player not found on the page.' }
        ];

        notifications.forEach(({ id, text }) => {
            const notification = document.createElement('div');
            notification.id = id;
            notification.style.display = 'none';
            notification.textContent = text;
            container.appendChild(notification);
        });

        document.body.appendChild(container);

        // Enhanced progress bar interaction
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            currentIndex = Math.floor(percent * thumbnails.length);
            updateSlideshow();
            pauseSlideshow();
            Logger.log(Logger.levels.INFO, `Scrubbed to index ${currentIndex + 1}/${thumbnails.length}`);
        });

        // Enhanced keyboard controls
        window.addEventListener('keydown', handleKeyboard);

        Logger.log(Logger.levels.INFO, 'Enhanced slideshow UI created.');
    }
// --------------------------------
    //  ENHANCED KEYBOARD AND TOUCH CONTROLS
    // --------------------------------
/*
    const touchControls = {
        initialize() {
            const container = document.getElementById('slideshow-container');
            if (!container) return;

            // Track touch positions for gesture detection
            let touchStartX = 0;
            let touchEndX = 0;
            let touchStartY = 0;
            let touchEndY = 0;
            let touchStartTime = 0;

            container.addEventListener('touchstart', (e) => {
                // Store initial touch coordinates and time
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
                touchStartTime = Date.now();
            });

            container.addEventListener('touchend', (e) => {
                // Calculate touch movement and duration
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                const touchDuration = Date.now() - touchStartTime;
                handleGesture();
            });

            function handleGesture() {
                const SWIPE_THRESHOLD = 50; // Minimum distance for swipe
                const SWIPE_TIME_LIMIT = 300; // Maximum time for swipe (ms)
                const touchDuration = Date.now() - touchStartTime;
                const swipeDistanceX = touchEndX - touchStartX;
                const swipeDistanceY = touchEndY - touchStartY;

                // Only process quick, intentional swipes
                if (touchDuration <= SWIPE_TIME_LIMIT) {
                    if (Math.abs(swipeDistanceX) > SWIPE_THRESHOLD &&
                        Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
                        if (swipeDistanceX > 0) {
                            prevImage();
                            Logger.log(Logger.levels.INFO, 'Swiped right => Previous image');
                        } else {
                            nextImage();
                            Logger.log(Logger.levels.INFO, 'Swiped left => Next image');
                        }
                    }
                }
            }
        }
    };
*/
    // --------------------------------
    //   ENHANCED TIMELINE NAVIGATION
    // --------------------------------

    const timelineNavigation = {
        initialize() {
            const progressBar = document.getElementById('progress-bar');
            if (!progressBar) return;

            let isDragging = false;
            let wasPlaying = false;

            // Enhanced drag handling with play state management
            progressBar.addEventListener('mousedown', (e) => {
                isDragging = true;
                wasPlaying = isPlaying;
                pauseSlideshow();
                updateTimelinePosition(e);
                Logger.log(Logger.levels.DEBUG, 'Started dragging progress bar');
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                updateTimelinePosition(e);
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    // Restore previous play state if was playing
                    if (wasPlaying) {
                        startSlideshowInterval();
                    }
                    Logger.log(Logger.levels.DEBUG, 'Stopped dragging progress bar');
                }
            });

         function updateTimelinePosition(e) {
             const progressBar = document.getElementById('progress-bar');
             if (!progressBar) return;

             const rect = progressBar.getBoundingClientRect();
             const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
             const targetIndex = Math.floor(percent * thumbnails.length);

             // Preload the thumbnail for the target index if not already loaded
             if (thumbnails[targetIndex] && !thumbnails[targetIndex].loaded) {
                 preloadImage(thumbnails[targetIndex].src).then(() => {
                     thumbnails[targetIndex].loaded = true;
                     Logger.log(Logger.levels.DEBUG, `Preloaded thumbnail for scrubbing: ${thumbnails[targetIndex].src}`);
                 }).catch((error) => {
                     Logger.log(Logger.levels.ERROR, `Failed to preload thumbnail for scrubbing: ${error.message}`);
                 });
             }

             // Update current index and slideshow
             currentIndex = targetIndex;
             updateSlideshow();
         }


            // Add hover preview functionality
            let previewTimeout;
            progressBar.addEventListener('mousemove', (e) => {
                clearTimeout(previewTimeout);
                previewTimeout = setTimeout(() => {
                    if (!isDragging) {
                        const rect = progressBar.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        const previewIndex = Math.floor(percent * thumbnails.length);
                        showThumbnailPreview(previewIndex, e.clientX, e.clientY);
                    }
                }, 100);
            });

            progressBar.addEventListener('mouseleave', () => {
                clearTimeout(previewTimeout);
                hideThumbnailPreview();
            });
        }
    };




    // --------------------------------
    //    ENHANCED KEYBOARD SHORTCUTS
    // --------------------------------

    const enhancedKeyboardControls = {
        initialize() {
            // Map of keyboard shortcuts to their actions
            const shortcuts = {
                'f': () => toggleFullscreen(),
                'm': () => toggleMute(),
                '1': () => setPlaybackSpeed(1),
                '2': () => setPlaybackSpeed(2),
                '3': () => setPlaybackSpeed(0.5),
                'h': () => toggleHelpOverlay(),
                // Number keys 1-9 for quick navigation
                ...[...Array(9)].reduce((acc, _, i) => ({
                    ...acc,
                    [`${i + 1}`]: () => jumpToPercentage((i + 1) * 10)
                }), {})
            };

            document.addEventListener('keydown', (e) => {
                // Only process shortcuts if slideshow is visible
                const container = document.getElementById('slideshow-container');
                if (!container || container.style.display === 'none') return;

                if (shortcuts[e.key]) {
                    e.preventDefault();
                    shortcuts[e.key]();
                    Logger.log(Logger.levels.INFO, `Keyboard shortcut: ${e.key}`);
                }
            });
        }
    };


// --------------------------------
    //    ENHANCED HELP OVERLAY SYSTEM
    // --------------------------------

    function createHelpOverlay() {
        const helpOverlay = document.createElement('div');
        helpOverlay.id = 'slideshow-help-overlay';

        // Creating a more comprehensive and organized help content
        helpOverlay.innerHTML = `
            <div class="help-content">
                <h3>Wyze Slideshow Controls</h3>
                <div style="margin-bottom: 20px;">
                    <h4>Navigation</h4>
                    <ul>
                        <li>←/→ : Navigate between images</li>
                        <li>Space : Play/Pause slideshow</li>
                        <li>1-9 : Jump to percentage through slideshow (1=10%, 9=90%)</li>
                        <li>Esc : Close slideshow</li>
                    </ul>
                </div>
                <div style="margin-bottom: 20px;">
                    <h4>Playback Control</h4>
                    <ul>
                        <li>+ / = : Increase speed</li>
                        <li>- : Decrease speed</li>
                        <li>R : Reset speed to default</li>
                        <li>M : Toggle video mute</li>
                    </ul>
                </div>
                <div style="margin-bottom: 20px;">
                    <h4>Display Options</h4>
                    <ul>
                        <li>F : Toggle fullscreen</li>
                        <li>H : Toggle this help overlay</li>
                    </ul>
                </div>
                <div style="margin-bottom: 20px;">
                    <h4>Touch Controls</h4>
                    <ul>
                        <li>Swipe Left : Next image</li>
                        <li>Swipe Right : Previous image</li>
                        <li>Double Tap : Play/Pause</li>
                    </ul>
                </div>
                <div>
                    <h4>Timeline Navigation</h4>
                    <ul>
                        <li>Click or drag the progress bar to navigate</li>
                        <li>Hover over progress bar to preview thumbnails</li>
                    </ul>
                </div>
            </div>
        `;

        // Add click handler to close help overlay when clicking outside content
        helpOverlay.addEventListener('click', (e) => {
            if (e.target === helpOverlay) {
                toggleHelpOverlay();
            }
        });

        document.body.appendChild(helpOverlay);
        Logger.log(Logger.levels.INFO, 'Enhanced help overlay created');
    }

    // --------------------------------
    //    ACCESSIBILITY ENHANCEMENTS
    // --------------------------------

    const accessibilityEnhancements = {
        initialize() {
            const container = document.getElementById('slideshow-container');
            if (!container) return;

            // Add ARIA attributes for better screen reader support
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', 'Thumbnail Slideshow');

            // Enhance keyboard navigation
            this.setupKeyboardNav();
            // Add announcements for screen readers
            this.setupLiveRegion();
            // Enhance button labels
            this.enhanceButtonLabels();

            Logger.log(Logger.levels.INFO, 'Accessibility enhancements initialized');
        },

        setupKeyboardNav() {
            // Add tabindex to make elements focusable
            const focusableElements = document.querySelectorAll('.slideshow-button, .slideshow-thumbnail');
            focusableElements.forEach(el => {
                el.setAttribute('tabindex', '0');
            });

            // Add key handlers for focused elements
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (document.activeElement.classList.contains('slideshow-thumbnail')) {
                        e.preventDefault();
                        const index = parseInt(document.activeElement.dataset.index);
                        if (!isNaN(index)) {
                            currentIndex = index;
                            updateSlideshow();
                        }
                    }
                }
            });
        },

        setupLiveRegion() {
            // Create an ARIA live region for dynamic announcements
            const liveRegion = document.createElement('div');
            liveRegion.id = 'slideshow-announcer';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        },

        enhanceButtonLabels() {
            // Add descriptive ARIA labels to buttons
            const buttons = document.querySelectorAll('.slideshow-button');
            buttons.forEach(button => {
                const action = button.textContent.trim();
                let description = '';

                switch (action) {
                    case 'Prev':
                        description = 'View previous image';
                        break;
                    case 'Next':
                        description = 'View next image';
                        break;
                    case 'Play/Pause':
                        description = 'Toggle slideshow playback';
                        break;
                    // Add cases for other buttons
                }

                if (description) {
                    button.setAttribute('aria-label', description);
                }
            });
        },

        announce(message) {
            // Make announcement in live region
            const announcer = document.getElementById('slideshow-announcer');
            if (announcer) {
                announcer.textContent = message;
            }
        }
    };

    // --------------------------------
    //    DEBUG TOOLS AND MONITORING
    // --------------------------------

    const debugTools = {
        initialize() {
            // Create debug interface accessible via console
            window.WyzeSlideshow = {
                version: '1.9.14',
                getThumbnails: () => thumbnails,
                getCurrentState: () => ({
                    currentIndex,
                    isPlaying,
                    speed,
                    thumbnailCount: thumbnails.length
                }),
                forceRefresh: () => {
                    collectThumbnailsAndUpdateUI();
                    Logger.log(Logger.levels.INFO, 'Forced refresh of thumbnails');
                },
                clearCache: () => {
                    thumbnails = [];
                    currentIndex = 0;
                    updateSlideshow();
                    Logger.log(Logger.levels.INFO, 'Cleared thumbnails cache');
                },
                // Add performance monitoring
                getPerformanceMetrics: () => this.getPerformanceMetrics(),
                // Add error tracking
                getErrorLog: () => this.getErrorLog()
            };

            // Initialize performance monitoring
            this.initializePerformanceMonitoring();

            Logger.log(Logger.levels.INFO, 'Debug tools initialized');
        },

        initializePerformanceMonitoring() {
            this.performanceMetrics = {
                loadTimes: [],
                errorCount: 0,
                lastRefresh: Date.now()
            };

            // Monitor thumbnail loading performance
            const originalPreloadImage = window.preloadImage;
            window.preloadImage = (src) => {
                const startTime = performance.now();
                originalPreloadImage(src).then(() => {
                    const loadTime = performance.now() - startTime;
                    this.performanceMetrics.loadTimes.push(loadTime);
                });
            };
        },

        getPerformanceMetrics() {
            const loadTimes = this.performanceMetrics.loadTimes;
            return {
                averageLoadTime: loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length,
                maxLoadTime: Math.max(...loadTimes),
                minLoadTime: Math.min(...loadTimes),
                errorCount: this.performanceMetrics.errorCount,
                uptime: Date.now() - this.performanceMetrics.lastRefresh
            };
        },

        getErrorLog() {
            return window.wyzeSlideshowLogs.filter(log =>
                log.level === Logger.levels.ERROR || log.level === Logger.levels.WARN
            );
        }
    };
// --------------------------------
    //    MEMORY MANAGEMENT SYSTEM
    // --------------------------------
/*
    const memoryManager = {
        initialize() {
            // Configure memory management settings
            this.settings = {
                maxCachedThumbnails: 50,
                // Maximum number of thumbnails to keep in memory
                cleanupInterval: 30000,
                // Run cleanup every 30 seconds
                preloadLimit: 5,
                // Number of images to preload ahead/behind
                maxLogEntries: 1000,
                // Maximum number of log entries to retain
                gcThreshold: 100
                // Run garbage collection suggestion after this many operations
            };

            // Initialize counters for garbage collection monitoring
            this.operationCount = 0;

            // Start periodic cleanup
            this.startPeriodicCleanup();

            Logger.log(Logger.levels.INFO, 'Memory management system initialized');
        },

        startPeriodicCleanup() {
            // Set up periodic cleanup of unused resources
            setInterval(() => {
                this.cleanupUnusedThumbnails();
                this.cleanupUnusedBlobs();
                this.pruneLogEntries();
                this.checkMemoryUsage();
            }, this.settings.cleanupInterval);
        },

        cleanupUnusedThumbnails() {
            // Remove excess thumbnails while keeping currently visible and adjacent ones
            if (thumbnails.length > this.settings.maxCachedThumbnails) {
                // Determine range of thumbnails to keep
                const keepStart = Math.max(0, currentIndex - this.settings.preloadLimit);
                const keepEnd = Math.min(thumbnails.length, currentIndex + this.settings.preloadLimit);

                // Remove thumbnails outside the keep range
                const removedThumbnails = thumbnails.splice(this.settings.maxCachedThumbnails);

                Logger.log(Logger.levels.INFO,
                    `Cleaned up ${removedThumbnails.length} excess thumbnails from memory`);

                // Clean up associated DOM elements
                this.cleanupThumbnailDOM();
            }
        },

        cleanupThumbnailDOM() {
            // Remove thumbnail elements that are no longer needed
            const unusedThumbs = document.querySelectorAll('.slideshow-thumbnail:not(.active)');
            unusedThumbs.forEach(thumb => {
                thumb.src = '';
                // Clear the source to help with memory
                thumb.remove();
                Logger.log(Logger.levels.DEBUG, 'Removed unused thumbnail from DOM');
            });
        },

        cleanupUnusedBlobs() {
            // Revoke any outstanding blob URLs that are no longer needed
            const blobUrls = Array.from(document.querySelectorAll('video'))
                .map(video => video.src)
                .filter(src => src.startsWith('blob:'));

            blobUrls.forEach(url => {
                if (!document.querySelector(`video[src="${url}"]`)) {
                    URL.revokeObjectURL(url);
                    Logger.log(Logger.levels.DEBUG, `Revoked unused blob URL: ${url}`);
                }
            });
        },

        pruneLogEntries() {
            // Keep log size manageable by removing oldest entries
            if (window.wyzeSlideshowLogs?.length > this.settings.maxLogEntries) {
                const exceeding = window.wyzeSlideshowLogs.length - this.settings.maxLogEntries;
                window.wyzeSlideshowLogs.splice(0, exceeding);
                Logger.log(Logger.levels.DEBUG, `Pruned ${exceeding} old log entries`);
            }
        },

        checkMemoryUsage() {
            // Monitor operation count and suggest garbage collection if needed
            this.operationCount++;

            if (this.operationCount >= this.settings.gcThreshold) {
                this.operationCount = 0;

                // Log memory usage statistics if available
                if (window.performance?.memory) {
                    const memory = window.performance.memory;
                    Logger.log(Logger.levels.INFO,
                        `Memory usage: ${Math.round(memory.usedJSHeapSize / 1048576)}MB ` +
                        `of ${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`);
                }
            }
        }
    };
*/
    // --------------------------------
    //    FINAL INITIALIZATION SYSTEM
    // --------------------------------

    function initializeSlideshowSystem() {
        // Check if we're already initialized to prevent duplicate setup
        if (slideshowInitialized) {
            Logger.log(Logger.levels.WARN, 'Slideshow system already initialized');
            return;
        }

        try {
            // Initialize core components in specific order
            injectStyles();
            injectOrientationStyles();
            createSlideshowUI();
            createHelpOverlay();
            addStartButton();

            // Initialize feature systems
            improvedThumbnailCollection();
            //memoryManager.initialize();
            // touchControls.initialize();
            timelineNavigation.initialize();
            enhancedKeyboardControls.initialize();
            accessibilityEnhancements.initialize();
            debugTools.initialize();

            // Set up DOM observation for dynamic content
            observeDOMChanges();

            // Perform initial thumbnail collection
            collectThumbnailsAndUpdateUI();

            slideshowInitialized = true;
            Logger.log(Logger.levels.INFO, 'Slideshow system fully initialized');
        } catch (error) {
            Logger.log(Logger.levels.ERROR, 'Error during slideshow initialization', error);
            // Attempt to cleanup if initialization fails
            performEmergencyCleanup();
        }
    }

function performEmergencyCleanup() {
    try {
        // Define the elements array with IDs of elements to remove
        const elements = [
            'slideshow-container',
            'start-slideshow-btn',
            'slideshow-help-overlay',
            'timeline-preview',
            'loading-spinner',
            'slideshow-announcer'
        ];

        // Remove DOM elements
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });

        // Rest of the function remains the same...
    } catch (error) {
        Logger.log(Logger.levels.ERROR, 'Error during emergency cleanup', error);
    }
}

// Initialize when page is ready
if (document.readyState === 'loading') {
    window.addEventListener('load', initializeSlideshowSystem);
} else {
    initializeSlideshowSystem();
}

})();
// End of IIFE