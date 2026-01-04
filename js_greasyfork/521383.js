// ==UserScript==
// @name         Universal Video Sharpener
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Applies video sharpening filter to streaming videos across websites with smooth transitions
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521383/Universal%20Video%20Sharpener.user.js
// @updateURL https://update.greasyfork.org/scripts/521383/Universal%20Video%20Sharpener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        sharpnessValue: 0.0003,
        contrastBoost: 0.997,
        brightnessBoost: 1.02,
        transitionDuration: '0.5s',
        debugMode: false
    };

    // Logging function
    function log(message) {
        if (CONFIG.debugMode) {
            console.log(`[Video Sharpener] ${message}`);
        }
    }

    // Create SVG filter more efficiently
    function createSVGFilter() {
        if (document.getElementById('universal-sharpness-filter')) return;

        const svgNamespace = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNamespace, 'svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.setAttribute('id', 'universal-sharpness-filter');

        const filter = document.createElementNS(svgNamespace, 'filter');
        filter.setAttribute('id', 'sharpness-filter');

        const feConvolve = document.createElementNS(svgNamespace, 'feConvolveMatrix');
        feConvolve.setAttribute('order', '3');
        feConvolve.setAttribute('preserveAlpha', 'true');
        feConvolve.setAttribute('kernelMatrix', '0 -1 0 -1 5 -1 0 -1 0');

        filter.appendChild(feConvolve);
        svg.appendChild(filter);

        document.body.appendChild(svg);
        log('SVG Filter created');
    }

    // Setup transition style
    function setupTransitionStyle() {
        if (document.getElementById('sharpener-transition-style')) return;

        const style = document.createElement('style');
        style.id = 'sharpener-transition-style';
        style.textContent = `
            .video-sharpener-transition {
                transition: filter ${CONFIG.transitionDuration} ease-in-out !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Detect if an element is likely a video
    function isVideoElement(element) {
        return element instanceof HTMLVideoElement &&
               element.videoWidth > 0 &&
               element.videoHeight > 0;
    }

    // Apply sharpness filter with transition
    function applySharpnessFilter(video, isEnabled) {
        if (!video) return;

        try {
            // Add transition class if not already present
            if (!video.classList.contains('video-sharpener-transition')) {
                video.classList.add('video-sharpener-transition');
            }

            if (isEnabled) {
                const { contrastBoost, brightnessBoost } = CONFIG;
                // Start with no filter and then apply gradually
                requestAnimationFrame(() => {
                    video.style.filter = `
                        url(#sharpness-filter)
                        contrast(${contrastBoost})
                        brightness(${brightnessBoost})
                    `;
                });
                video.dataset.sharpened = 'true';
                log('Sharpness filter applied');
            } else {
                video.style.filter = 'none';
                delete video.dataset.sharpened;
                log('Sharpness filter removed');
            }
        } catch (error) {
            console.error('Error applying sharpness filter:', error);
        }
    }

    // Update all videos on the page
    function updateAllVideos(isEnabled) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (isVideoElement(video)) {
                applySharpnessFilter(video, isEnabled);
            }
        });
    }

    // Main processing function
    function processVideos() {
        const isScriptEnabled = GM_getValue('universalSharpenerEnabled', false);
        const videos = document.querySelectorAll('video:not([data-sharpened])');
        videos.forEach(video => {
            if (isVideoElement(video)) {
                applySharpnessFilter(video, isScriptEnabled);
            }
        });
    }

    // Toggle function with notification
    function toggleSharpener() {
        const currentState = GM_getValue('universalSharpenerEnabled', false);
        const newState = !currentState;
        GM_setValue('universalSharpenerEnabled', newState);

        if (newState) {
            createSVGFilter();
        }

        // Update all existing videos
        updateAllVideos(newState);

        // Show notification
        GM_notification({
            text: `Video Sharpener: ${newState ? 'Enabled' : 'Disabled'}`,
            timeout: 2000,
            title: 'Video Sharpener'
        });
    }

    // Initialize script
    function initScript() {
        // Get initial state
        const isEnabled = GM_getValue('universalSharpenerEnabled', false);

        // Create SVG filter if enabled
        if (isEnabled) {
            createSVGFilter();
        }

        // Setup transition styles
        setupTransitionStyle();

        // Register menu command with state indicator
        GM_registerMenuCommand(
            `${isEnabled ? '✓' : '✗'} Toggle Video Sharpener`,
            toggleSharpener
        );

        // Use IntersectionObserver for efficient video tracking
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && isVideoElement(entry.target)) {
                    processVideos();
                }
            });
        }, { threshold: 0.5 });

        // Start observing new videos
        const videoObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO') {
                        observer.observe(node);
                    }
                });
            });
        });

        // Observe the entire document for new videos
        videoObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Observe existing videos
        document.querySelectorAll('video').forEach(video => {
            observer.observe(video);
        });

        // Initial processing and periodic check
        processVideos();
        setInterval(processVideos, 2000);
    }

    // Start script
    initScript();
})();