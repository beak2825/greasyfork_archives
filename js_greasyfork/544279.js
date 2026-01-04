// ==UserScript==
// @name         YouTube Auto-Like at 40%
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Automatically likes YouTube videos when 40% watched
// @author       Awesome
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544279/YouTube%20Auto-Like%20at%2040%25.user.js
// @updateURL https://update.greasyfork.org/scripts/544279/YouTube%20Auto-Like%20at%2040%25.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Only execute on watch pages
    if (!window.location.pathname.startsWith('/watch')) {
        return;
    }
    
    let hasLikedCurrentVideo = false;
    let currentVideoId = null;
    let progressCheckInterval = null;
    
    // Function to get the current video ID from URL
    function getCurrentVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }
    
    // Function to get video player element
    function getVideoPlayer() {
        return document.querySelector('video');
    }
    
    // Function to find and click the like button
    function clickLikeButton() {
        const likeButton = document.querySelector('#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button');
        
        if (likeButton) {
            // Check if video is already liked (button has aria-pressed="true")
            const isAlreadyLiked = likeButton.getAttribute('aria-pressed') === 'true';
            
            if (!isAlreadyLiked) {
                likeButton.click();
                console.log('YouTube Auto-Like: Video liked at 80% progress!');
                return true;
            } else {
                console.log('YouTube Auto-Like: Video already liked');
                return true;
            }
        }
        return false;
    }
    
    // Function to check video progress
    function checkVideoProgress() {
        const video = getVideoPlayer();
        if (!video) return;
        
        const currentTime = video.currentTime;
        const duration = video.duration;
        
        if (duration && currentTime) {
            const progressPercentage = (currentTime / duration) * 100;
            
            // Like the video when it reaches 40% and hasn't been liked yet
            if (progressPercentage >= 40 && !hasLikedCurrentVideo) {
                if (clickLikeButton()) {
                    hasLikedCurrentVideo = true;
                    // Stop checking progress for this video
                    if (progressCheckInterval) {
                        clearInterval(progressCheckInterval);
                        progressCheckInterval = null;
                    }
                }
            }
        }
    }
    
    // Function to start monitoring a new video
    function startMonitoring() {
        const newVideoId = getCurrentVideoId();
        
        // Reset if we're on a new video
        if (newVideoId !== currentVideoId) {
            currentVideoId = newVideoId;
            hasLikedCurrentVideo = false;
            
            // Clear existing interval
            if (progressCheckInterval) {
                clearInterval(progressCheckInterval);
            }
            
            // Wait a bit for the page to load, then start monitoring
            setTimeout(() => {
                progressCheckInterval = setInterval(checkVideoProgress, 5000); // Check every 5 seconds
                console.log('YouTube Auto-Like: Started monitoring video progress');
            }, 2000);
        }
    }
    
    // Start monitoring when script loads
    startMonitoring();
    
    // Monitor for navigation changes (YouTube is a SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Check if we're still on a watch page
            if (window.location.pathname.startsWith('/watch')) {
                startMonitoring();
            } else {
                // Stop monitoring if we leave watch page
                if (progressCheckInterval) {
                    clearInterval(progressCheckInterval);
                    progressCheckInterval = null;
                }
            }
        }
    }).observe(document, { subtree: true, childList: true });
    
    console.log('YouTube Auto-Like userscript loaded');
})();