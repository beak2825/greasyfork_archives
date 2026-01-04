// ==UserScript==
// @name         IDriveSafely.com auto skip
// @namespace    auto clicker 
// @version      4.2
// @description  Auto-click navigation button when enabled, auto-play videos
// @author       💩p💩o💩o
// @match        https://app.idrivesafely.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543619/IDriveSafelycom%20auto%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/543619/IDriveSafelycom%20auto%20skip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("IDriveSafely Auto Skip Script Started v4.2");
    
    let videoPlayed = false;
    let continueLearningButtonClicked = false;
    let lastButtonState = null;
    let lastUrl = window.location.href;
    
    // Function to check if an element appears disabled in any way
    function isButtonDisabled(button) {
        if (!button) return true;
        
        // Check standard disabled property
        if (button.disabled) return true;
        
        // Check disabled attribute
        if (button.hasAttribute('disabled')) return true;
        
        // Check aria-disabled
        if (button.getAttribute('aria-disabled') === 'true') return true;
        
        // Check for disabled class
        const classList = button.className || '';
        if (classList.includes('disabled') || classList.includes('btn-disabled')) return true;
        
        // Check if button has opacity suggesting it's disabled
        const computedStyle = window.getComputedStyle(button);
        if (computedStyle.opacity < 0.5) return true;
        
        // Check if button has pointer-events: none
        if (computedStyle.pointerEvents === 'none') return true;
        
        // Check parent elements for disabled state
        let parent = button.parentElement;
        while (parent && parent !== document.body) {
            if (parent.classList && parent.classList.contains('disabled')) return true;
            parent = parent.parentElement;
        }
        
        return false;
    }
    
    // Function to check if any video is playing
    function isVideoPlaying() {
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            if (video && !video.paused && video.currentTime > 0) {
                return true;
            }
        }
        return false;
    }
    
    // Function to auto-play video
    function autoPlayVideo() {
        if (videoPlayed || isVideoPlaying()) {
            if (!videoPlayed && isVideoPlaying()) {
                console.log("Video is already playing");
                videoPlayed = true;
            }
            return;
        }
        
        // Try to find and play video directly
        const videoElements = document.querySelectorAll('video');
        for (const video of videoElements) {
            if (video && video.paused && video.readyState >= 2) {
                console.log("Found video element - attempting to play directly");
                video.play().then(() => {
                    console.log("Video started playing successfully");
                    videoPlayed = true;
                }).catch(err => {
                    console.log("Direct video play failed:", err.message);
                    // Don't set videoPlayed = true here, let other methods try
                });
                // Give direct play a chance before trying other methods
                return;
            }
        }
        
        // Wait a bit before trying click methods to allow direct play attempt to complete
        setTimeout(() => {
            if (isVideoPlaying()) {
                videoPlayed = true;
                return;
            }
            
            // Try clicking the video poster (most reliable based on user feedback)
            const videoPoster = document.querySelector('.vjs-poster');
            if (videoPoster) {
                console.log("Video poster found - clicking to trigger playback");
                videoPoster.click();
                
                // Check if video started after a short delay
                setTimeout(() => {
                    if (isVideoPlaying()) {
                        console.log("Video started after poster click");
                        videoPlayed = true;
                    }
                }, 500);
                return;
            }
            
            // Try clicking the video container div (since clicking anywhere works)
            const videoContainer = document.querySelector('[data-vjs-player="true"]') || 
                                  document.querySelector('.video-js');
            if (videoContainer) {
                console.log("Video container found - clicking to trigger playback");
                
                // Try to simulate user interaction more thoroughly
                videoContainer.focus();
                
                // Create and dispatch a click event
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    buttons: 1
                });
                videoContainer.dispatchEvent(clickEvent);
                
                // Also try direct click
                videoContainer.click();
                
                // Check if video started after a short delay
                setTimeout(() => {
                    if (isVideoPlaying()) {
                        console.log("Video started after container click");
                        videoPlayed = true;
                    }
                }, 500);
                return;
            }
            
            // Try clicking the custom play button
            const customPlayButton = document.querySelector('[data-test="playButton"]');
            if (customPlayButton && !isButtonDisabled(customPlayButton)) {
                console.log("Custom Play button found - clicking!");
                customPlayButton.click();
                setTimeout(() => {
                    if (isVideoPlaying()) {
                        console.log("Video started after play button click");
                        videoPlayed = true;
                    }
                }, 500);
                return;
            }
            
            // Try clicking the Video.js play button
            const vjsPlayButton = document.querySelector('.vjs-big-play-button');
            if (vjsPlayButton && !isButtonDisabled(vjsPlayButton)) {
                console.log("Video.js Play button found - clicking!");
                vjsPlayButton.click();
                setTimeout(() => {
                    if (isVideoPlaying()) {
                        console.log("Video started after Video.js button click");
                        videoPlayed = true;
                    }
                }, 500);
                return;
            }
            
            // Try the original play button selector
            const playButton = document.querySelector('[title="Play Video"]');
            if (playButton && !isButtonDisabled(playButton)) {
                console.log("Play Video button found - clicking!");
                playButton.click();
                setTimeout(() => {
                    if (isVideoPlaying()) {
                        console.log("Video started after play button click");
                        videoPlayed = true;
                    }
                }, 500);
                return;
            }
        }, 300);
    }
    
    // Function to check if we're on a video page
    function isVideoPage() {
        return document.querySelector('.gritCourseflowNode--video') !== null ||
               document.querySelector('video') !== null ||
               document.querySelector('.video-js') !== null;
    }
    
    // Function to reset state when page changes
    function checkPageChange() {
        if (window.location.href !== lastUrl) {
            console.log("Page changed - resetting state");
            videoPlayed = false;
            continueLearningButtonClicked = false;
            lastButtonState = null;
            lastUrl = window.location.href;
        }
    }
    
    // Main function to handle button clicks
    function clickButtons() {
        // Check if page changed
        checkPageChange();
        
        console.log("Checking for buttons and videos...");
        
        // Check for continue learning button first
        if (!continueLearningButtonClicked) {
            const continueButton = document.querySelector('[data-test="continueLearningButton"]');
            if (continueButton && !isButtonDisabled(continueButton)) {
                console.log("Continue Learning button found and enabled - clicking!");
                continueButton.click();
                continueLearningButtonClicked = true;
            }
        }
        
        // Check if we're on a video page and auto-play if needed
        if (isVideoPage()) {
            autoPlayVideo();
        }
        
        // Check for navigation arrow button
        const arrowButton = document.querySelector('#arrow-next') || 
                          document.querySelector('[data-test="courseflow-forward"]') ||
                          document.querySelector('button[id*="arrow"]') ||
                          document.querySelector('button[class*="arrow"]');
        
        if (arrowButton) {
            const isDisabled = isButtonDisabled(arrowButton);
            
            // Log state change
            if (lastButtonState !== isDisabled) {
                console.log(`Navigation button state changed: ${isDisabled ? 'DISABLED' : 'ENABLED'}`);
                lastButtonState = isDisabled;
            }
            
            if (!isDisabled) {
                console.log("Navigation button is ENABLED - clicking!");
                arrowButton.click();
                // Reset flags after navigation
                videoPlayed = false;
                continueLearningButtonClicked = false;
                console.log("Button clicked! Flags reset.");
            } else {
                console.log("Navigation button is disabled - waiting...");
            }
        } else {
            console.log("No navigation button found on page");
        }
    }
    
    // Add mutation observer to detect when video elements are added to the page
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // Check if video elements were added
                const addedVideos = Array.from(mutation.addedNodes).some(node => 
                    node.nodeName === 'VIDEO' || 
                    (node.querySelector && node.querySelector('video'))
                );
                
                if (addedVideos && !videoPlayed) {
                    console.log("New video element detected");
                    setTimeout(autoPlayVideo, 1000); // Give it more time to fully load
                }
            }
        }
    });
    
    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Run immediately on load with a longer delay
    setTimeout(clickButtons, 2000);
    
    // Then run every 2 seconds (faster than original but not too aggressive)
    setInterval(clickButtons, 2000);
    
    console.log("Script initialized - checking buttons and videos every 2 seconds");
})();