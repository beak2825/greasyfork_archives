// ==UserScript==
// @name         Video Speed Controller (Control speed on videos in any website)
// @namespace    https://github.com/lcs-dev1/userscripts
// @version      1.1.1
// @description  Adds speed control to all videos on a website. Supports site-specific customization.
// @author       lcs-dev1
// @match        *://*/*
// @license      Apache License 2.0
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/534111/Video%20Speed%20Controller%20%28Control%20speed%20on%20videos%20in%20any%20website%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534111/Video%20Speed%20Controller%20%28Control%20speed%20on%20videos%20in%20any%20website%29.meta.js
// ==/UserScript==

/**
 * @typedef {Object} VideoControllerData
 * @property {HTMLElement} controller - The controller element
 * @property {number|null} hideTimer - Timer ID for hiding the controller
 * @property {boolean} isSticky - Whether the controller should stay visible
 * @property {HTMLSelectElement} speedSelector - Speed selector dropdown
 * @property {HTMLInputElement} customSpeedInput - Custom speed input field
 */

/**
 * @typedef {Object} SiteRule
 * @property {function(HTMLVideoElement): boolean} shouldAddController - Function to determine if a controller should be added to a video
 */

/**
 * @typedef {Object.<string, SiteRule>} SiteRules
 */

(function() {
    'use strict';

    const uniquePrefix = 'tm_vid_speed_ver__1-1-1';
    
    /**
     * Log debug messages
     * @param {any[]} messages - Message to log
     * @returns {void}
     */
    function debugLog(...messages) {
        GM_log('[Video Speed Controller]', ...messages);
    }

    // ====================================
    // SITE-SPECIFIC RULES CONFIGURATION
    // ====================================
    
    /**
     * Add new site rules here for easy configuration
     * @type {SiteRules}
     */
    const siteRules = {
        'primevideo.com': {
            /**
             * Only add controller to videos with blob: source
             * @param {HTMLVideoElement} video - The video element to check
             * @returns {boolean} - Whether a controller should be added
             */
            shouldAddController: function(video) {
                const src = video.src || '';
                return src.startsWith('blob:');
            }
        },
    };
    
    /**
     * Helper function to determine if we're on a specific site
     * @returns {string|null} - Site name if matched, null otherwise
     */
    function getCurrentSite() {
        // Get hostname and extract domain without subdomain
        const fullHostname = window.location.hostname;
        
        // Extract the base domain (removing subdomains like www)
        // This regex takes a hostname like "www.example.com" and extracts "example.com"
        const domainMatch = fullHostname.match(/([^.]+\.[^.]+)$/);
        const baseDomain = domainMatch ? domainMatch[1] : fullHostname;
        
        // Directly check if we have rules for this domain
        return siteRules[baseDomain] ? baseDomain : null;
    }
    
    const currentSite = getCurrentSite();
    
    /**
     * Function to check if a video should have a controller
     * @param {HTMLVideoElement} video - The video element to check
     * @returns {boolean} - Whether a controller should be added
     */
    function shouldAddController(video) {
        // If we're on a site with special rules, apply them
        if (currentSite && siteRules[currentSite].shouldAddController) {
            return siteRules[currentSite].shouldAddController(video);
        }
        
        // Default behavior for all other sites: add controller to all videos
        return true;
    }
    // ====================================
    // END SITE-SPECIFIC RULES
    // ====================================

    /** Speed options available in the dropdown */
    const speeds = [0.1, 0.5, 1, 1.5, 2, 2.5, 3, 4];

    // CSS styles with unique class names
    const styles = `
        .${uniquePrefix}controller {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.7) !important;
            color: white;
            padding: 5px;
            border-radius: 4px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        .${uniquePrefix}controller.${uniquePrefix}visible {
            opacity: 1;
            pointer-events: auto;
        }
        .${uniquePrefix}controller .${uniquePrefix}label {
            margin-right: 5px;
        }
        .${uniquePrefix}controller select {
            background-color: rgba(0, 0, 0, 0.7) !important;
            appearance: auto !important;
            color: white;
            width: fit-content;
            border: 1px solid white;
            border-radius: 3px;
            padding: 2px;
            margin-right: 8px;
            font-size: 14px;
        }
        .${uniquePrefix}controller input {
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border: 1px solid white;
            border-radius: 3px;
            padding: 2px;
            width: 50px;
            margin-right: 5px;
            font-size: 14px;
        }
        .${uniquePrefix}controller button {
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border: 1px solid white;
            border-radius: 3px;
            padding: 2px 5px;
            margin-right: 5px;
            font-size: 14px;
            cursor: pointer;
        }
        .${uniquePrefix}controller button:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        video.${uniquePrefix}enhanced {
            z-index: auto !important;
        }
    `;

    // Add styles to document
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    /**
     * Global tracking of active videos and controllers
     * @type {Map<HTMLVideoElement, VideoControllerData>}
     */
    const activeVideos = new Map();

    // Track mouse position globally
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateControllerVisibility();
    });

    /**
     * Function to update controller visibility based on mouse position
     * @returns {void}
     */
    function updateControllerVisibility() {
        activeVideos.forEach((data, video) => {
            const rect = video.getBoundingClientRect();
            const isMouseOver = (
                mouseX >= rect.left &&
                mouseX <= rect.right &&
                mouseY >= rect.top &&
                mouseY <= rect.bottom
            );
            const isVisible = data.controller.classList.contains(uniquePrefix + 'visible');
            
            // Handle showing controller when mouse is over video
            if (isMouseOver) {
                // Show controller if not already visible
                if (!isVisible) {
                    data.controller.classList.add(uniquePrefix + 'visible');
                }
                
                // Reset hide timer
                clearTimeout(data.hideTimer);
                data.hideTimer = setTimeout(() => {
                    if (!data.isSticky) {
                        data.controller.classList.remove(uniquePrefix + 'visible');
                    }
                }, 2000);
                return;
            }
            
            // When mouse is not over video and controller isn't sticky, hide it
            if (isVisible && !data.isSticky) {
                data.controller.classList.remove(uniquePrefix + 'visible');
            }
        });
    }

    /**
     * Function to apply playback rate to a video
     * @param {HTMLVideoElement} video - The video element to modify
     * @param {number} rate - The playback rate to apply
     * @returns {void}
     */
    function applyPlaybackRate(video, rate) {
        // Validate inputs
        if (!video || isNaN(rate) || rate <= 0) {
            return;
        }
        
        // Apply rate to video
        video.playbackRate = rate;
        video.dataset.preferredRate = rate.toString();

        // Get controller data
        const data = activeVideos.get(video);
        if (!data) {
            return;
        }
        
        // Update dropdown if available
        if (data.speedSelector) {
            updateSpeedSelector(data.speedSelector, rate);
        }
        
        // Update custom input if available
        if (data.customSpeedInput) {
            data.customSpeedInput.value = rate.toString();
        }
    }
    
    /**
     * Helper function to update speed selector dropdown
     * @param {HTMLSelectElement} selector - The speed selector element
     * @param {number} rate - The playback rate
     */
    function updateSpeedSelector(selector, rate) {
        const options = selector.options;
        
        // Check if rate matches a preset option
        for (let i = 0; i < options.length; i++) {
            if (parseFloat(options[i].value) === rate) {
                selector.selectedIndex = i;
                return;
            }
        }
        
        // If no match and "custom" option exists, select it
        const customOption = selector.querySelector('option[value="custom"]');
        if (customOption) {
            selector.value = "custom";
        }
    }

    /**
     * Check for videos and add speed controller
     * @returns {void}
     */
    function initVideoSpeedControl() {
        const videos = document.querySelectorAll('video:not(.' + uniquePrefix + 'enhanced)');

        videos.forEach((video, index) => {
            // Skip videos that shouldn't have controllers
            if (!shouldAddController(video)) {
                // Mark as enhanced to avoid rechecking
                video.classList.add(uniquePrefix + 'enhanced');
                return;
            }

            // Mark video as enhanced
            video.classList.add(uniquePrefix + 'enhanced');

            // Create controller element
            const controller = document.createElement('div');
            controller.className = uniquePrefix + 'controller';
            controller.setAttribute('id', uniquePrefix + 'controller-' + index);

            // Create preset selector label
            const presetLabel = document.createElement('span');
            presetLabel.className = uniquePrefix + 'label';
            presetLabel.textContent = 'Preset:';

            // Create speed selector
            const speedSelector = document.createElement('select');

            speeds.forEach(speed => {
                const option = document.createElement('option');
                option.value = speed.toString();
                option.textContent = speed + 'x';
                if (speed === 1) {
                    option.selected = true;
                }
                speedSelector.appendChild(option);
            });

            // Add custom option
            const customOption = document.createElement('option');
            customOption.value = "custom";
            customOption.textContent = "Custom";
            speedSelector.appendChild(customOption);

            // Create custom speed label
            const customLabel = document.createElement('span');
            customLabel.className = uniquePrefix + 'label';
            customLabel.textContent = 'Custom:';

            // Create custom speed input
            const customSpeedInput = document.createElement('input');
            customSpeedInput.type = "number";
            customSpeedInput.min = "0.1";
            customSpeedInput.max = "16";
            customSpeedInput.step = "0.1";
            customSpeedInput.value = "1.0";
            customSpeedInput.placeholder = "Speed";

            // Create apply button
            const applyButton = document.createElement('button');
            applyButton.textContent = "Apply";

            // Listen for speed selector changes
            speedSelector.addEventListener('change', function() {
                if (this.value === "custom") return;
                
                const rate = parseFloat(this.value);
                applyPlaybackRate(video, rate);
            });

            // Listen for custom speed input changes
            customSpeedInput.addEventListener('keyup', function(e) {
                if (e.key !== 'Enter') return;
                
                const rate = parseFloat(this.value);
                if (rate > 0) applyPlaybackRate(video, rate);
            });

            // Listen for apply button click
            applyButton.addEventListener('click', function() {
                const rate = parseFloat(customSpeedInput.value);
                if (rate > 0) applyPlaybackRate(video, rate);
            });

            // Ensure playback rate is maintained when video plays
            video.addEventListener('play', function() {
                const savedRateStr = this.dataset.preferredRate;
                if (!savedRateStr) return;
                
                const savedRate = parseFloat(savedRateStr);
                if (this.playbackRate === savedRate) return;
                
                this.playbackRate = savedRate;
            });

            // Also check playback rate periodically to ensure it sticks
            setInterval(() => {
                const savedRateStr = video.dataset.preferredRate;
                if (!savedRateStr || video.paused) return;
                
                const savedRate = parseFloat(savedRateStr);
                if (video.playbackRate === savedRate) return;
                
                video.playbackRate = savedRate;
            }, 1000);

            // Prevent controller mouse events from bubbling
            controller.addEventListener('mouseenter', function(e) {
                e.stopPropagation();
                activeVideos.get(video).isSticky = true;
            });

            controller.addEventListener('mouseleave', function(e) {
                e.stopPropagation();
                activeVideos.get(video).isSticky = false;
                updateControllerVisibility();
            });

            // Add elements to controller
            controller.appendChild(presetLabel);
            controller.appendChild(speedSelector);
            controller.appendChild(customLabel);
            controller.appendChild(customSpeedInput);
            controller.appendChild(applyButton);

            // Add controller directly to document body
            document.body.appendChild(controller);

            // Store data for this video
            activeVideos.set(video, {
                controller: controller,
                hideTimer: null,
                isSticky: false,
                speedSelector: speedSelector,
                customSpeedInput: customSpeedInput
            });

            /**
             * Position the controller based on video position
             * @returns {void}
             */
            function positionController() {
                const rect = video.getBoundingClientRect();
                controller.style.position = 'fixed';
                controller.style.top = (rect.top + 10) + 'px';
                controller.style.left = (rect.left + 10) + 'px';
            }

            // Position controller initially
            positionController();

            // Update position on window resize and scroll
            window.addEventListener('resize', positionController);
            window.addEventListener('scroll', positionController);

            // Initialize playback rate from video if it already has one set
            if (video.playbackRate !== 1) {
                applyPlaybackRate(video, video.playbackRate);
            }

            // Flash controller briefly
            controller.classList.add(uniquePrefix + 'visible');
            setTimeout(() => {
                if (!activeVideos.get(video).isSticky) {
                    controller.classList.remove(uniquePrefix + 'visible');
                }
            }, 1000);
        });
    }

    // Run after page and resources are loaded
    window.addEventListener('load', function() {
        initVideoSpeedControl();

        // Set up a single observer to detect both new videos and attribute changes
        const observer = new MutationObserver(function(mutations) {
            let videoAdded = false;

            mutations.forEach(mutation => {
                // Case 1: Check for new videos in added nodes
                videoAdded = videoAdded || checkForNewVideos(mutation);
                
                // Case 2: Check for src attribute changes on videos that need controller updates
                videoAdded = videoAdded || checkForSrcChanges(mutation);
            });

            if (videoAdded) {
                initVideoSpeedControl();
            }
        });

        // Observe both child additions and attribute changes in one observer
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src'],
            attributeOldValue: true
        });
    });
    
    /**
     * Check if a mutation contains new videos
     * @param {MutationRecord} mutation - The mutation record to check
     * @returns {boolean} - Whether new videos were found
     */
    function checkForNewVideos(mutation) {
        if (!mutation.addedNodes.length) return false;
        
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            
            // Direct video element
            if (node.nodeName === 'VIDEO') return true;
            
            // Element that might contain videos
            if (node.nodeType === 1 && 
                node.querySelector('video:not(.' + uniquePrefix + 'enhanced)')) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Check if a mutation represents a src change that needs controller updates
     * @param {MutationRecord} mutation - The mutation record to check
     * @returns {boolean} - Whether video controllers need updating
     */
    function checkForSrcChanges(mutation) {
        // Skip if not on a site with special rules or not a src change on a video
        if (!currentSite || 
            mutation.type !== 'attributes' || 
            mutation.attributeName !== 'src' || 
            mutation.target.nodeName !== 'VIDEO') {
            return false;
        }
        
        const video = /** @type {HTMLVideoElement} */ (mutation.target);
        
        // Skip if not a video we've already processed
        if (!video.classList.contains(uniquePrefix + 'enhanced')) {
            return false;
        }
        
        const shouldHave = shouldAddController(video);
        const hasController = activeVideos.has(video);
        
        // Case: Video should have controller but doesn't
        if (shouldHave && !hasController) {
            video.classList.remove(uniquePrefix + 'enhanced');
            return true; // Will trigger initVideoSpeedControl()
        }
        
        // Case: Video shouldn't have controller but does
        if (!shouldHave && hasController) {
            const data = activeVideos.get(video);
            if (data?.controller) {
                data.controller.remove();
            }
            activeVideos.delete(video);
        }
        
        return false;
    }
})();