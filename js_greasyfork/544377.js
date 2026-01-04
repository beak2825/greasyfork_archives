// ==UserScript==
// @name         VideoMaximizerEnhancednofilter
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  op, selects the highest video resolution, and enhances video with increased sharpness, contrast, and vibrance. Uses MutationObserver to handle dynamically added elements. Adaptively adjusts canvas resolution starting from a saved pixel count (or 1080p), increasing every 10 seconds if stable, to maximize pixels while maintaining 60fps, and saves the estimated pixel count for smooth playback.
// @author       Grok
// @match        *://*/*
// @grant        none
// @license      none
// @copyright    Copyright (c) 2025 carlyiooo

// @downloadURL https://update.greasyfork.org/scripts/544377/VideoMaximizerEnhancednofilter.user.js
// @updateURL https://update.greasyfork.org/scripts/544377/VideoMaximizerEnhancednofilter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store original styles and states
    let originalStyles = new Map();
    let originalVideoStyles = new Map();
    let isMaximized = false;
    let canvasContext = null;
    let canvas = null;

    // Elements to explicitly hide
    const elementsToHide = [
        'header.header',                              // Main header element
        'div._51a88326.ec31f16c',                    // Ad banner
        'div.container-3b1bc',                       // Navigation bar
        'div.search-section',                        // Search section
        'div.thumb-list--sidebar',                   // Related videos
        'div.list-c8ee1',                            // Video recommendation list
        'div.container-c8ee1',                       // Loader container
        'a.containerLink-44fe3',                     // Advertisement link
        'div.tabSet-792ed.tabSet-0c900',             // Related video tabs
        'div.container-90841.desktop-90841',          // Show more button
        'button.button-390e8.xh-button',             // Report inappropriate video button (class-based)
        '[data-tooltip="Report inappropriate video"]', // Report button (attribute-based fallback)
        'button.rb-new__button--like',               // Like button
        'button.rb-new__button--dislike',           // Dislike button
        'div.rb-new__info',                          // Rating info
        'div.header-24e64',                          // Header with FapHouse link and categories
        'div.sqkj-MkMsp-b.sqkj-MkMsp-a',           // Auto-generated ad banner
        'div.sqkj-MkMcam-thumb',                    // Cam ad
        'a.xh-button.button.gray.large.about-control', // About button
        'button.xh-button.button.button-c7c46.gray.large.square', // Comment buttons
        'button.root-64d24.color-secondary-64d24.xhButton-2a3c5.desktop-2a3c5.buttonBackground-2a3c5', // Share button
        'a.xh-button.trigger.no-arrow',              // Favorite button
        'div.width-wrap.section-container',           // Search section with logo and dropdowns
        'div.login-section',                         // Login/user section
        'div.top-menu.width-wrap',                   // Top menu with navigation
        'div.top-header',                            // Top header
        '.controls-info',                            // xhamster3.com specific
        '#video-tags-list-container',                // xhamster3.com specific
        '[data-role="related-tabs-container"]',      // xhamster3.com specific
        '.comments-section',                         // xhamster3.com specific
        '[data-role="sqkj-MkMbottom"]',             // xhamster3.com specific
        '[data-role="sqkj-MkMunder-comments"]',      // xhamster3.com specific
        'div.item-container',                        // Webcam ad container
        'div.more-button',                           // More Girls button
        'div.sqkj-MkMcam-wgt',                      // Webcam widget with title and thumbnails
        'div.hmHlN-Vplsp-b.hmHlN-Vplsp-a',          // Auto-generated banner container
        'div.hmHlN-Vplcam-wgt',                     // Webcam widget with live links
        'div.root-66d4c',                           // Element with top icon
        'div.UTh-Fgndsp-b.UTh-Fgndsp-a',           // Additional auto-generated banner container
        'div.DVQX-mfsp-b.DVQX-mfsp-a',              // Problematic auto-generated banner
        'div[data-role="auto-generated-banner-container"]', // Nested auto-generated banner container
        'div[data-role="DVQX-mfbanner-underplayer"]', // Underplayer banner container
        'div.Ela-vlKPsp-b.Ela-vlKPsp-a'             // Specific ad banner to hide
    ];

    // Check video source for resolution
    function checkVideoSource(video) {
        const source = video.src || video.currentSrc || (video.querySelector('source')?.src);
        console.log('Video source:', source);
        if (source && (source.includes('4320p') || source.includes('8k') || source.includes('2160p') || source.includes('4k') || source.includes('1080p'))) {
            console.log(`Video already at ${source.includes('4320p') || source.includes('8k') ? '8K' : source.includes('2160p') || source.includes('4k') ? '4K' : '1080p'}`);
            return true;
        }
        return false;
    }

    // UI fallback to select quality
    function selectQualityViaUI() {
        console.log('Attempting to select highest quality via UI');
        const qualityMenuSelectors = [
            '.xp-settings-inner-list .quality', '.xh-player-quality-list', '.xh-player-control-quality',
            '.xh-player-menu-quality', '.xplayer-quality-menu', '.xplayer-settings-quality'
        ];
        const qualityMenu = qualityMenuSelectors.map(sel => document.querySelector(sel)).find(el => el);
        if (!qualityMenu) {
            console.log('No quality menu found in UI');
            const settingsMenu = document.querySelector('.xp-settings-inner-list');
            if (settingsMenu && settingsMenu.classList.contains('xh-helper-hidden')) {
                settingsMenu.classList.remove('xh-helper-hidden');
                console.log('Forced quality menu visibility');
                return selectQualityViaUI();
            }
            return false;
        }
        const qualityOptions = qualityMenu.querySelectorAll('[data-value], .xh-player-quality-item, li');
        if (!qualityOptions.length) {
            console.log('No quality options found in menu');
            return false;
        }
        const highestQuality = Array.from(qualityOptions).reduce((max, opt) => {
            const quality = parseInt(opt.getAttribute('data-value')?.match(/\d+/) || opt.textContent.match(/\d+/) || 0);
            return quality > max.quality ? { element: opt, quality } : max;
        }, { element: null, quality: 0 });
        if (highestQuality.element && highestQuality.quality >= 1080) {
            console.log(`Selecting highest quality via UI: ${highestQuality.quality}p`);
            highestQuality.element.click();
            return true;
        }
        console.log('Failed to select highest quality via UI');
        return false;
    }

    // Set quality via xplayer.qualityList
    function setQualityViaXplayer(xplayer) {
        console.log('Attempting to set quality via xplayer.qualityList');
        if (!xplayer || !xplayer.qualityList) {
            console.log('xplayer or qualityList not found');
            return Promise.resolve(false);
        }
        return new Promise(resolve => {
            let attempts = 0;
            const maxAttempts = 25;
            const checkInterval = 1000;
            const checkQualities = () => {
                if (xplayer.qualityList.items?.length > 0) {
                    const qualities = xplayer.qualityList.items;
                    console.log(`Available qualities: ${qualities.map(q => q.name || q.height || 'unknown').join(', ')}`);
                    const highest = qualities.reduce((max, q, i) => {
                        const quality = parseInt(q.name || q.height || 0);
                        return quality > max.quality ? { index: i, quality } : max;
                    }, { index: -1, quality: 0 });
                    if (highest.index >= 0) {
                        try {
                            xplayer.qualityList.set(highest.index);
                            console.log(`Set quality to: ${highest.quality}p`);
                            resolve(true);
                        } catch (e) {
                            console.error('Error setting quality:', e);
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }
                } else if (attempts++ < maxAttempts) {
                    console.log(`Waiting for qualityList, attempt ${attempts}`);
                    setTimeout(checkQualities, checkInterval);
                } else {
                    console.log('No valid qualities after waiting');
                    resolve(false);
                }
            };
            checkQualities();
        });
    }

    // Find and set HLS quality
    async function setHighestQualityForHLS(video) {
        console.log('Checking for HLS instance');
        const hlsChecks = [
            () => video.hls && (console.log('HLS found on video.hls'), video.hls),
            () => window.xplayer?.hls && (console.log('HLS found on window.xplayer.hls'), window.xplayer.hls),
            () => window.xplayer?.core?.hls && (console.log('HLS found on window.xplayer.core.hls'), window.xplayer.core.hls),
            () => window.xplayer?.core?.sourceController?.hls && (console.log('HLS found on window.xplayer.core.sourceController.hls'), window.xplayer.core.sourceController.hls)
        ];
        const hls = hlsChecks.map(check => check()).find(h => h);
        if (window.xplayer) {
            console.log('xplayer properties:', Object.keys(window.xplayer));
            console.log('core properties:', Object.keys(window.xplayer.core || {}));
            console.log('sourceController properties:', Object.keys(window.xplayer.core?.sourceController || {}));
        }
        if (checkVideoSource(video)) {
            return true;
        }
        if (hls) {
            if (hls.levels?.length > 0) {
                const highestLevel = hls.levels.reduce((max, level, i) => {
                    const quality = parseInt(level.height || level.name || 0);
                    return quality > max.quality ? { index: i, quality } : max;
                }, { index: -1, quality: 0 });
                hls.currentLevel = highestLevel.index;
                console.log(`Set HLS to: ${highestLevel.quality}p`);
                return true;
            }
            return new Promise(resolve => {
                hls.on('hlsManifestLoaded', () => {
                    if (hls.levels?.length > 0) {
                        const highestLevel = hls.levels.reduce((max, level, i) => {
                            const quality = parseInt(level.height || level.name || 0);
                            return quality > max.quality ? { index: i, quality } : max;
                        }, { index: -1, quality: 0 });
                        hls.currentLevel = highestLevel.index;
                        console.log(`Set HLS to: ${highestLevel.quality}p`);
                        resolve(true);
                    } else {
                        console.log('No HLS levels available after manifest loaded');
                        resolve(false);
                    }
                });
            });
        }
        console.log('No HLS instance found');
        if (window.xplayer && await setQualityViaXplayer(window.xplayer)) {
            return true;
        }
        return selectQualityViaUI();
    }

    // Retry logic for resolution selection
    async function trySetHighestQuality(video) {
        let attempts = 0;
        const maxAttempts = 50;
        const delay = 5000;
        while (attempts++ < maxAttempts) {
            if (await setHighestQualityForHLS(video)) return;
            console.log(`Attempt ${attempts} failed, retrying in ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        console.log(`Failed after ${maxAttempts} attempts`);
        selectQualityViaUI();
    }

    // Canvas-based rendering for maximum pixel generation
    function setupCanvasRendering(video) {
        console.log('Setting up canvas rendering for maximum pixel generation');
        canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '9999';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.objectFit = 'fill';

        // Adaptive resolution starting from saved pixel count or 1080p
        const minWidth = 1920; // Minimum 1080p
        const minHeight = 1080;
        const maxWidth = 30720; // Cap to prevent crashes
        const maxHeight = 17280;
        const aspectRatio = 16 / 9; // Common video aspect ratio
        let baseWidth, baseHeight;

        // Load saved pixel count or default to 1080p (2,073,600 pixels)
        const savedPixelCount = localStorage.getItem('smoothPixelCount');
        let pixelCount = savedPixelCount ? parseInt(savedPixelCount) : 1920 * 1080;
        console.log(`Loaded saved pixel count: ${savedPixelCount ? savedPixelCount : 'none, using default 2073600'}`);

        // Calculate initial resolution from pixel count, maintaining aspect ratio
        baseWidth = Math.sqrt(pixelCount * aspectRatio);
        baseHeight = baseWidth / aspectRatio;
        let multiplier = 1.0; // Initial multiplier

        // Set initial canvas resolution
        canvas.width = Math.min(baseWidth * multiplier * window.devicePixelRatio, maxWidth);
        canvas.height = Math.min(baseHeight * multiplier * window.devicePixelRatio, maxHeight);
        canvas.width = Math.max(canvas.width, minWidth);
        canvas.height = Math.max(canvas.height, minHeight);
        console.log(`Initial rendering at ${canvas.width}x${canvas.height} pixels, pushing ${canvas.width * canvas.height} pixels (${(canvas.width * canvas.height / 1000000).toFixed(1)} million pixels)`);

        canvasContext = canvas.getContext('2d', { alpha: false }); // Optimize for performance
        document.body.appendChild(canvas);
        video.style.display = 'none'; // Hide original video

        let lastTime = performance.now();
        let frameCount = 0;
        let totalRenderTime = 0;
        const maxRenderTime = 16.67; // Target 60fps (1000ms / 60)
        const targetRenderTime = 15; // Safe threshold to increase resolution
        const increaseFactor = 1.1; // Increase resolution by 10%
        const decreaseFactor = 0.9; // Decrease resolution by 10%
        let lastAdjustmentTime = performance.now();

        function drawFrame() {
            const currentTime = performance.now();
            const renderTime = currentTime - lastTime;
            totalRenderTime += renderTime;
            frameCount++;

            // Check every 10 seconds
            if (currentTime - lastAdjustmentTime >= 10000) {
                const avgRenderTime = totalRenderTime / frameCount;
                console.log(`Average frame render time: ${avgRenderTime.toFixed(2)}ms`);

                // Adjust resolution based on render time
                if (avgRenderTime < targetRenderTime) {
                    // Increase resolution if render time is low
                    multiplier *= increaseFactor;
                    const newWidth = Math.min(baseWidth * multiplier * window.devicePixelRatio, maxWidth);
                    const newHeight = Math.min(baseHeight * multiplier * window.devicePixelRatio, maxHeight);
                    if (newWidth > canvas.width || newHeight > canvas.height) {
                        canvas.width = Math.max(newWidth, minWidth);
                        canvas.height = Math.max(newHeight, minHeight);
                        console.log(`Increased resolution to ${canvas.width}x${canvas.height} pixels, pushing ${canvas.width * canvas.height} pixels (${(canvas.width * canvas.height / 1000000).toFixed(1)} million pixels)`);
                        // Save pixel count as it's stable
                        localStorage.setItem('smoothPixelCount', canvas.width * canvas.height);
                        console.log(`Saved pixel count: ${canvas.width * canvas.height}`);
                    }
                } else if (avgRenderTime > maxRenderTime) {
                    // Decrease resolution if render time is too high
                    multiplier *= decreaseFactor;
                    const newWidth = Math.min(baseWidth * multiplier * window.devicePixelRatio, maxWidth);
                    const newHeight = Math.min(baseHeight * multiplier * window.devicePixelRatio, maxHeight);
                    canvas.width = Math.max(newWidth, minWidth);
                    canvas.height = Math.max(newHeight, minHeight);
                    console.log(`Decreased resolution to ${canvas.width}x${canvas.height} pixels, pushing ${canvas.width * canvas.height} pixels (${(canvas.width * canvas.height / 1000000).toFixed(1)} million pixels)`);
                    console.warn('Performance warning: High render time, resolution reduced to maintain 60fps');
                    // Save pixel count as it's the highest stable value
                    localStorage.setItem('smoothPixelCount', canvas.width * canvas.height);
                    console.log(`Saved pixel count: ${canvas.width * canvas.height}`);
                }

                frameCount = 0;
                totalRenderTime = 0;
                lastAdjustmentTime = currentTime;
            }

            lastTime = currentTime;
            canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawFrame);
        }
        drawFrame();

        return canvas;
    }

    // Clean up canvas rendering
    function cleanupCanvasRendering(video) {
        if (canvasContext && canvas) {
            console.log('Cleaning up canvas rendering');
            canvasContext = null;
            canvas.remove();
            canvas = null;
            video.style.display = '';
        }
    }

    // Function to hide specific elements
    function hideSpecificElements() {
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`Hiding elements for selector "${selector}": ${elements.length} found`);
            elements.forEach(el => {
                if (!originalStyles.has(el)) {
                    originalStyles.set(el, el.style.display || '');
                    console.log(`Hiding element: ${el.tagName}.${el.className || ''}[${el.getAttribute('data-tooltip') || ''}]`);
                }
                el.style.display = 'none';
            });
        });
    }

    // Observe DOM for dynamically added elements
    function observeDynamicElements(video) {
        const observer = new MutationObserver((mutations) => {
            console.log('DOM mutation detected, checking for elements to hide');
            hideSpecificElements();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        video.addEventListener('pause', () => {
            console.log('Video paused, disconnecting observer');
            observer.disconnect();
        }, { once: true });
        video.addEventListener('ended', () => {
            console.log('Video ended, disconnecting observer');
            observer.disconnect();
        }, { once: true });
    }

    // Function to hide all body children except video's parent and control bar
    function hideBodyElements(video, canvas) {
        const parent = video.parentElement;
        const controlBar = document.querySelector('div.control-bar');
        const bodyChildren = document.querySelectorAll('body > *');
        bodyChildren.forEach(el => {
            if (el !== parent && !el.contains(video) && (!controlBar || !el.contains(controlBar)) && el !== canvas) {
                if (!originalStyles.has(el)) {
                    originalStyles.set(el, el.style.display || '');
                    console.log(`Hiding body child: ${el.tagName}.${el.className || ''}`);
                }
                el.style.display = 'none';
            }
        });
    }

    // Function to restore all hidden elements
    function restoreElements() {
        originalStyles.forEach((display, el) => {
            console.log(`Restoring element: ${el.tagName}.${el.className || ''}[${el.getAttribute('data-tooltip') || ''}]`);
            el.style.display = display;
        });
        originalStyles.clear();
    }

    // Function to maximize video
    function maximizeVideo(video) {
        if (!isMaximized) {
            originalVideoStyles.set(video, {
                position: video.style.position,
                top: video.style.top,
                left: video.style.left,
                width: video.style.width,
                height: video.style.height,
                zIndex: video.style.zIndex,
                objectFit: video.style.objectFit
            });

            const canvas = setupCanvasRendering(video);
            isMaximized = true;
            hideBodyElements(video, canvas);
            hideSpecificElements();
            observeDynamicElements(video);
        }
    }

    // Function to restore video
    function restoreVideo(video) {
        if (isMaximized) {
            const styles = originalVideoStyles.get(video);
            if (styles) {
                video.style.position = styles.position;
                video.style.top = styles.top;
                video.style.left = styles.left;
                video.style.width = styles.width;
                video.style.height = styles.height;
                video.style.zIndex = styles.zIndex;
                video.style.objectFit = styles.objectFit;
            }
            cleanupCanvasRendering(video);
            isMaximized = false;
            originalVideoStyles.clear();
            restoreElements();
        }
    }

    // Observe video elements
    function observeVideoElement(container) {
        const video = container.querySelector('video');
        if (video) {
            if (!video.dataset.listenersAdded) {
                video.dataset.listenersAdded = 'true';
                console.log('Adding listeners for video element');

                video.addEventListener('play', () => {
                    console.log('Video play event triggered');
                    maximizeVideo(video);
                    trySetHighestQuality(video);
                });

                video.addEventListener('pause', () => {
                    console.log('Video pause event triggered');
                    restoreVideo(video);
                    setTimeout(() => trySetHighestQuality(video), 2000);
                });

                video.addEventListener('ended', () => {
                    console.log('Video ended event triggered');
                    restoreVideo(video);
                });
            } else {
                console.log('Listeners already added for this video element');
            }
        } else {
            console.log('No video element, observing container...');
            const observer = new MutationObserver((mutations, obs) => {
                const video = container.querySelector('video');
                const startButton = container.querySelector('.xplayer-start-button');
                if (video && (!startButton || startButton.style.display === 'none')) {
                    obs.disconnect();
                    if (!video.dataset.listenersAdded) {
                        video.dataset.listenersAdded = 'true';
                        console.log('Adding listeners for dynamically added video element');

                        video.addEventListener('play', () => {
                            console.log('Video play event triggered');
                            maximizeVideo(video);
                            trySetHighestQuality(video);
                        });

                        video.addEventListener('pause', () => {
                            console.log('Video pause event triggered');
                            restoreVideo(video);
                            setTimeout(() => trySetHighestQuality(video), 2000);
                        });

                        video.addEventListener('ended', () => {
                            console.log('Video ended event triggered');
                            restoreVideo(video);
                        });
                    } else {
                        console.log('Listeners already added for dynamically added video');
                    }
                }
            });
            observer.observe(container, { childList: true, subtree: true });
        }
    }

    // Initialize
    function initialize() {
        console.log('Initializing Video Maximizer');
        const container = document.getElementById('player-container') || document.body;
        observeVideoElement(container);
        // Initial hide for late-loaded elements
        hideSpecificElements();
        // Continuous monitoring for dynamic elements even before video plays
        const continuousObserver = new MutationObserver(() => {
            console.log('Continuous DOM mutation detected, checking for elements to hide');
            hideSpecificElements();
        });
        continuousObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    initialize();
})();