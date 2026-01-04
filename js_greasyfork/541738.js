// ==UserScript==
// @name         Odysee 2x Speed for Non-Live Videos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically sets Odysee video playback speed to 2x except for live streams
// @author       Dave121
// @match        https://odysee.com/*
// @grant        none
// @license        none
// @downloadURL https://update.greasyfork.org/scripts/541738/Odysee%202x%20Speed%20for%20Non-Live%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/541738/Odysee%202x%20Speed%20for%20Non-Live%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let processed = new Set();
    
    function isLiveStream() {
        // Check for live indicators in the page
        const liveIndicators = [
            '.livestream-indicator',
            '.live-indicator',
            '[data-live="true"]',
            '.live-badge',
            '.streaming-live'
        ];
        
        // Check for live text content
        const pageText = document.body.innerText.toLowerCase();
        const liveKeywords = ['live now', 'streaming live', 'live stream'];
        
        // Check DOM for live indicators
        for (const selector of liveIndicators) {
            if (document.querySelector(selector)) {
                return true;
            }
        }
        
        // Check for live keywords in page text
        for (const keyword of liveKeywords) {
            if (pageText.includes(keyword)) {
                return true;
            }
        }
        
        // Check URL for live indicators
        const url = window.location.href.toLowerCase();
        if (url.includes('/live/') || url.includes('live=true')) {
            return true;
        }
        
        // Check if video duration is not available (common for live streams)
        const video = document.querySelector('video');
        if (video && (isNaN(video.duration) || video.duration === Infinity)) {
            return true;
        }
        
        return false;
    }
    
    function setVideoSpeed() {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // Skip if already processed this video element
            if (processed.has(video)) {
                return;
            }
            
            // Wait for video to load metadata
            if (video.readyState >= 1) {
                processVideo(video);
            } else {
                video.addEventListener('loadedmetadata', () => processVideo(video), { once: true });
            }
        });
    }
    
    function processVideo(video) {
        // Mark as processed
        processed.add(video);
        
        // Check if this is a live stream
        if (isLiveStream()) {
            console.log('Odysee Userscript: Live stream detected, keeping normal speed');
            return;
        }
        
        // Set playback speed to 2x
        try {
            video.playbackRate = 2.0;
            console.log('Odysee Userscript: Set playback speed to 2x');
        } catch (error) {
            console.error('Odysee Userscript: Error setting playback speed:', error);
        }
    }
    
    // Initial check
    setTimeout(setVideoSpeed, 1000);
    
    // Monitor for new videos (for SPA navigation)
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'VIDEO' || node.querySelector('video')) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        
        if (shouldCheck) {
            setTimeout(setVideoSpeed, 500);
        }
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also check on URL changes (for SPA navigation)
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            processed.clear(); // Clear processed videos for new page
            setTimeout(setVideoSpeed, 1500);
        }
    }, 1000);
    
    // Check when videos start playing
    document.addEventListener('play', (event) => {
        if (event.target.tagName === 'VIDEO' && !processed.has(event.target)) {
            setTimeout(() => processVideo(event.target), 100);
        }
    }, true);
    
})();