// ==UserScript==
// @name         YouTube - Prevent Autoplay On Channels
// @description  Prevents videos from autoplaying on YouTube channel pages
// @namespace    http://tampermonkey.net/
// @icon         https://cdn-icons-png.flaticon.com/64/2504/2504965.png
// @supportURL   https://github.com/5tratz/Tampermonkey-Scripts/issues
// @version      0.1.0
// @author       5tratz
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/watch?v=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544198/YouTube%20-%20Prevent%20Autoplay%20On%20Channels.user.js
// @updateURL https://update.greasyfork.org/scripts/544198/YouTube%20-%20Prevent%20Autoplay%20On%20Channels.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ================= CONFIG ================= */
    const CONFIG = {
        PAUSE_WINDOW: 2000,    // How long to aggressively pause preview videos (ms)
        AGGRESSIVE_INTERVAL: 150, // Interval during aggressive phase (ms)
        CHECK_INTERVAL: 1000,  // Fallback check interval (ms)
        NAVIGATION_DELAY: 300  // Delay after navigation (ms)
    };

    /* ================= STATE ================= */
    let isActive = false;
    let aggressiveTimer = null;

    /* ================= UTILS ================= */

    function isChannelPage() {
        return (
            location.pathname.startsWith('/@') ||
            location.pathname.startsWith('/channel/') ||
            location.pathname.startsWith('/c/') ||
            location.pathname.startsWith('/user/')
        );
    }

    function pauseVideoElement(video) {
        if (!video || video.paused) return false;
        
        try {
            video.pause();
            // Set playback rate to 0 to ensure it doesn't autoplay
            video.playbackRate = 0;
            
            // Prevent the next 'play' event
            const preventPlay = (e) => {
                e.preventDefault();
                video.pause();
            };
            
            video.addEventListener('play', preventPlay, { once: true });
            return true;
        } catch (error) {
            console.debug('Failed to pause video:', error);
            return false;
        }
    }

    function pauseAnyPlayingVideo() {
        if (!isChannelPage() || !isActive) return false;
        
        const videos = document.querySelectorAll('video');
        let pausedAny = false;
        
        videos.forEach(video => {
            if (pauseVideoElement(video)) {
                pausedAny = true;
            }
        });
        
        return pausedAny;
    }

    /* ================= CORE LOGIC ================= */

    function startAggressivePausing() {
        if (aggressiveTimer) {
            clearInterval(aggressiveTimer);
        }
        
        const start = Date.now();
        aggressiveTimer = setInterval(() => {
            pauseAnyPlayingVideo();
            
            if (Date.now() - start > CONFIG.PAUSE_WINDOW) {
                clearInterval(aggressiveTimer);
                aggressiveTimer = null;
            }
        }, CONFIG.AGGRESSIVE_INTERVAL);
    }

    function enforceNoAutoplay() {
        if (!isChannelPage()) {
            isActive = false;
            return;
        }
        
        isActive = true;
        startAggressivePausing();
    }

    /* ================= NAVIGATION & OBSERVER ================= */

    function onNavigate() {
        setTimeout(enforceNoAutoplay, CONFIG.NAVIGATION_DELAY);
    }

    // Use MutationObserver to catch dynamically loaded videos
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            if (!isChannelPage() || !isActive) return;
            
            // Check if new video elements were added
            const hasNewVideos = mutations.some(mutation => 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeName === 'VIDEO' || 
                    (node.querySelector && node.querySelector('video'))
                )
            );
            
            if (hasNewVideos) {
                setTimeout(() => pauseAnyPlayingVideo(), 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }

    /* ================= INITIALIZATION ================= */

    function init() {
        // Clean up any existing timers/observers
        if (aggressiveTimer) {
            clearInterval(aggressiveTimer);
            aggressiveTimer = null;
        }
        
        // Set up event listeners
        document.addEventListener('yt-navigate-finish', onNavigate);
        document.addEventListener('yt-page-data-updated', onNavigate);
        
        // Set up mutation observer
        setupMutationObserver();
        
        // Initial check
        setTimeout(() => enforceNoAutoplay(), 500);
        
        // Fallback periodic check (less frequent)
        const fallbackInterval = setInterval(() => {
            if (isChannelPage()) {
                pauseAnyPlayingVideo();
            }
        }, CONFIG.CHECK_INTERVAL);
        
        // Cleanup on script unload
        window.addEventListener('beforeunload', () => {
            clearInterval(fallbackInterval);
        });
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();