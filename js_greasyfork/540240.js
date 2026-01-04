// ==UserScript==
// @name         Disable Video Autoplay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevents videos from autoplaying on websites and adds a play button overlay
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540240/Disable%20Video%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/540240/Disable%20Video%20Autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // User-configurable options
    const config = {
        // List of domains where autoplay blocking is disabled (e.g. 'youtube.com')
        allowlist: [],
        // List of domains where autoplay blocking is always enabled (leave empty to target all sites)
        denylist: [],
        // Show a play button overlay on videos
        showPlayButton: true,
        // Enable debug logging in the console
        debug: false
    };

    // Decide if the current site should be processed based on allowlist/denylist
    function shouldProcessSite() {
        const currentDomain = window.location.hostname.replace('www.', '');
        
        // Skip processing if the site is in the allowlist
        if (config.allowlist.some(site => currentDomain.includes(site))) {
            logDebug('Site in allowlist, skipping');
            return false;
        }
        
        // Only process if denylist is empty or the site is in the denylist
        if (config.denylist.length > 0 && !config.denylist.some(site => currentDomain.includes(site))) {
            logDebug('Site not in denylist, skipping');
            return false;
        }
        
        return true;
    }

    // Print debug messages if debug mode is enabled
    function logDebug(message) {
        if (config.debug) {
            console.log('[Disable Autoplay]', message);
        }
    }

    // Remove autoplay from <video> elements and prevent programmatic autoplay
    function processVideoElement(video) {
        if (video.hasAttribute('autoplay')) {
            video.removeAttribute('autoplay');
            video.pause();
            logDebug('Removed autoplay attribute from video element');
        }
        
        // Unmute video (some sites use muted+autoplay to bypass restrictions)
        video.muted = false;
        
        // Prevent autoplay even if triggered by scripts
        video.addEventListener('play', function(e) {
            if (!video.hasAttribute('data-user-initiated')) {
                video.pause();
                logDebug('Prevented automatic playback');
            }
        }, true);
        
        // Add overlay if enabled and not already present
        if (config.showPlayButton && !video.hasAttribute('data-overlay-added')) {
            addPlayButtonOverlay(video);
        }
    }

    // Modify <iframe> embeds (e.g. YouTube, Vimeo) to disable autoplay
    function processIframeElement(iframe) {
        // Special handling for YouTube/Vimeo embeds
        if (iframe.src && iframe.src.match(/youtube|vimeo/i)) {
            const currentSrc = iframe.src;
            // If autoplay=1, set to 0
            if (currentSrc.includes('autoplay=1')) {
                iframe.src = currentSrc.replace('autoplay=1', 'autoplay=0');
                logDebug('Disabled autoplay for embedded video iframe');
            } else if (!currentSrc.includes('autoplay=0')) {
                // If no autoplay param, add autoplay=0
                iframe.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'autoplay=0';
                logDebug('Added autoplay=0 parameter to iframe');
            }
        }
        
        // For other iframes, try to replace autoplay=1 with autoplay=0 in the src
        else if (iframe.src && iframe.src.includes('autoplay')) {
            try {
                iframe.src = iframe.src.replace(/autoplay=1/g, 'autoplay=0');
                logDebug('Modified autoplay parameter in iframe src');
            } catch (e) {
                logDebug('Could not modify iframe src: ' + e.message);
            }
        }
    }

    // Add a play button overlay to the video element
    function addPlayButtonOverlay(video) {
        // Don't add overlay if already present
        if (video.hasAttribute('data-overlay-added')) {
            return;
        }
        
        // Mark as processed so overlay isn't added again
        video.setAttribute('data-overlay-added', 'true');
        
        // Create overlay container
        const container = document.createElement('div');
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.2);
            z-index: 10000;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        container.classList.add('autoplay-disabled-overlay');
        
        // Create the circular play button
        const playButton = document.createElement('div');
        playButton.style.cssText = `
            width: 60px;
            height: 60px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Create the triangle play icon
        const playIcon = document.createElement('div');
        playIcon.style.cssText = `
            width: 0;
            height: 0;
            border-top: 15px solid transparent;
            border-bottom: 15px solid transparent;
            border-left: 25px solid white;
            margin-left: 5px;
        `;
        
        // Assemble overlay
        playButton.appendChild(playIcon);
        container.appendChild(playButton);
        
        // Make sure the parent is positioned for absolute overlay
        const videoParent = video.parentElement;
        videoParent.style.position = videoParent.style.position || 'relative';
        videoParent.appendChild(container);
        
        // Show overlay on hover
        videoParent.addEventListener('mouseenter', () => {
            container.style.opacity = '1';
        });
        
        videoParent.addEventListener('mouseleave', () => {
            container.style.opacity = '0';
        });
        
        // Play video when overlay is clicked
        container.addEventListener('click', () => {
            video.setAttribute('data-user-initiated', 'true');
            video.play()
                .then(() => {
                    // Hide overlay when playback starts
                    container.style.display = 'none';
                    logDebug('Video playback started by user');
                })
                .catch(err => {
                    logDebug('Error starting video playback: ' + err.message);
                    // Keep overlay visible if playback fails
                });
        });
        
        logDebug('Added play button overlay to video');
    }

    // Scan and process all <video> and <iframe> elements currently in the DOM
    function processExistingMedia() {
        document.querySelectorAll('video').forEach(processVideoElement);
        document.querySelectorAll('iframe').forEach(processIframeElement);
        logDebug('Processed existing media elements');
    }

    // Watch for new videos/iframes added dynamically and process them
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let needsProcessing = false;
            
            // If any new nodes are added, flag for processing
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    needsProcessing = true;
                }
            });
            
            // Batch process after a short delay
            if (needsProcessing) {
                setTimeout(() => {
                    processExistingMedia();
                }, 100); // Let DOM settle
            }
        });
        
        // Observe the whole document for added nodes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        logDebug('Mutation observer set up for dynamic content');
    }

    // Main entry point: set up everything
    function initialize() {
        if (!shouldProcessSite()) {
            return;
        }
        
        logDebug('Initializing autoplay blocker');
        
        // Add style for overlays
        const style = document.createElement('style');
        style.textContent = `
            video[data-overlay-added] {
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
        
        // Process any existing media right away
        processExistingMedia();
        
        // Watch for new media
        setupMutationObserver();
        
        // Re-scan after short delays to catch late-loaded elements
        setTimeout(processExistingMedia, 1000);
        setTimeout(processExistingMedia, 3000);
    }

    // Run as soon as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
