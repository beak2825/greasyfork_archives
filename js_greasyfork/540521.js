// ==UserScript==
// @name         Rumble Video Speed Controller
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically sets Rumble videos to custom speed (excludes live streams)
// @author       Dave121
// @match        https://*.rumble.com/*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/540521/Rumble%20Video%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/540521/Rumble%20Video%20Speed%20Controller.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    // =============================================
    // Configure your desired video speed here (1.0 is normal speed)
    const PLAYBACK_SPEED = 2.0;
    // =============================================
    
    // Function to check if current stream is live
    function isLiveStream() {
        // Check for live chat toggle button (most reliable indicator)
        const chatToggleBtn = document.querySelector('.media-page-chat-container-toggle-btn[data-js="media_page_chat_container_toggle_btn"]');
        if (chatToggleBtn) {
            return true;
        }
        
        // Check for "Streaming now" text
        const streamingNowElement = document.querySelector('.media-description-info-stream-time');
        if (streamingNowElement && streamingNowElement.textContent.includes('Streaming now')) {
            return true;
        }
        
        // Alternative check for live indicators
        const liveIndicators = document.querySelectorAll('*');
        for (let element of liveIndicators) {
            const text = element.textContent.toLowerCase();
            if (text.includes('streaming now') || text.includes('live now') || text.includes('• live')) {
                return true;
            }
        }
        
        return false;
    }
    
    // Function to set video speed
    function setVideoSpeed() {
        const videos = document.querySelectorAll('video');
        const isLive = isLiveStream();
        const targetSpeed = isLive ? 1.0 : PLAYBACK_SPEED;
        
        videos.forEach(video => {
            video.playbackRate = targetSpeed;
            
            // Add speed indicator to the UI
            const footerButtons = document.querySelector('.video-footer-buttons');
            if (footerButtons && !document.querySelector('.speed-indicator')) {
                const speedIndicator = document.createElement('span');
                speedIndicator.className = 'speed-indicator';
                speedIndicator.textContent = `Speed: ${targetSpeed}x${isLive ? ' (Live)' : ''}`;
                speedIndicator.style.cssText = 'margin-left: 10px; color: #fff; font-size: 12px; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 3px;';
                footerButtons.appendChild(speedIndicator);
            }
        });
    }
    
    // Initial setup when page loads
    window.addEventListener('load', setVideoSpeed);
    
    // Monitor for dynamically loaded videos and page changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'VIDEO') {
                        setTimeout(setVideoSpeed, 100); // Small delay to ensure DOM is ready
                    }
                });
            }
        });
    });
    
    // Start observing the document for added video elements
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // Handle play events
    document.addEventListener('play', function(e) {
        if (e.target.nodeName === 'VIDEO') {
            const isLive = isLiveStream();
            const targetSpeed = isLive ? 1.0 : PLAYBACK_SPEED;
            e.target.playbackRate = targetSpeed;
        }
    }, true);
    
    // Re-check speed when navigating between videos (for single-page app behavior)
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            setTimeout(setVideoSpeed, 500); // Delay to allow page to load
        }
    }, 1000);
})();