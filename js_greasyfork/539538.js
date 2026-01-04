// ==UserScript==
// @name        YouTube Watched Date with Clear History and Playlist Support (Fixed Overlay)
// @namespace   github.com/darkdex52
// @version     1.6.2
// @description Stores and displays the last watched date for YouTube videos without overlapping playlist duration
// @author      darkdex52
// @license     GPL-3.0-or-later
// @match       *://www.youtube.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/539538/YouTube%20Watched%20Date%20with%20Clear%20History%20and%20Playlist%20Support%20%28Fixed%20Overlay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539538/YouTube%20Watched%20Date%20with%20Clear%20History%20and%20Playlist%20Support%20%28Fixed%20Overlay%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cache for processed thumbnails
    const processedThumbnails = new Set();
    let watched = {};
    let saveTimeout = null;
    let videoElement = null;
    let savedVideoId = null;

    // Initialize the script
    function init() {
        loadWatchedData();
        setupVideoListener();
        setupMutationObservers();
        showWatchedDates();
        tryAddClearButton();
    }

    // Load watched data with error handling
    function loadWatchedData() {
        try {
            watched = JSON.parse(localStorage.getItem('watchedVideos') || '{}');
        } catch (e) {
            console.error('Error loading watched videos data:', e);
            watched = {};
        }
    }

    // Save watched data with error handling
    function saveWatchedData() {
        try {
            localStorage.setItem('watchedVideos', JSON.stringify(watched));
        } catch (e) {
            console.error('Error saving watched videos data:', e);
        }
    }

    // Throttle function for performance
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Save watch date only if watched at least 10 seconds (throttled)
    const throttledTrySaveWatchDate = throttle(function() {
        if (!videoElement) return;
        if (videoElement.currentTime >= 10) {
            let url = new URL(window.location.href);
            let videoId = url.searchParams.get('v');
            if (videoId && videoId !== savedVideoId) {
                watched[videoId] = new Date().toISOString();
                saveWatchedData();
                savedVideoId = videoId;
                videoElement.removeEventListener('timeupdate', throttledTrySaveWatchDate);
            }
        }
    }, 1000);

    // Calculate relative time
    function timeAgo(dateString) {
        let parsed = new Date(dateString);
        if (isNaN(parsed)) return dateString;

        const now = new Date();
        const seconds = Math.floor((now.getTime() - parsed.getTime()) / 1000);

        if (seconds < 0) return 'Just now';

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";

        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";

        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";

        return seconds <= 5 ? "Just now" : seconds + " seconds ago";
    }

    // Set up video element listener
    function setupVideoListener() {
        if (videoElement) {
            videoElement.removeEventListener('timeupdate', throttledTrySaveWatchDate);
        }
        
        videoElement = document.querySelector('video');
        savedVideoId = null;
        
        if (videoElement) {
            videoElement.addEventListener('timeupdate', throttledTrySaveWatchDate);
        }
    }

    // Set up mutation observers
    function setupMutationObservers() {
        // Observer for URL changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setupVideoListener();
                showWatchedDates();
            }
        }).observe(document, {subtree: true, childList: true});

        // Observer for header changes (clear button)
        const headerObserver = new MutationObserver(() => {
            tryAddClearButton();
        });
        const header = document.querySelector("#container #start");
        if (header) {
            headerObserver.observe(header, {childList: true, subtree: true});
        }
    }

    // Display watched dates on thumbnails with playlist fix
    function showWatchedDates() {
        document.querySelectorAll('a#thumbnail[href^="/watch"], a#thumbnail[href*="list="]').forEach(el => {
            if (processedThumbnails.has(el)) return;
            
            let url = new URL(el.href, window.location.origin);
            let videoId = url.searchParams.get('v');
            
            if (videoId && watched[videoId]) {
                addWatchedLabel(el, videoId);
                processedThumbnails.add(el);
            }
        });
    }

    // Add watched label with playlist positioning fix
    function addWatchedLabel(element, videoId) {
        if (element.querySelector('.watched-date-label')) return;

        const isPlaylist = element.closest('ytd-playlist-video-renderer, ytd-playlist-panel-video-renderer');
        const label = document.createElement('span');
        label.className = 'watched-date-label';
        label.textContent = `Watched ${timeAgo(watched[videoId])}`;

        // Style adjustments for playlist items
        if (isPlaylist) {
            // Position above the duration in playlist view
            label.style.position = 'absolute';
            label.style.top = '5px';
            label.style.right = '5px';
            label.style.background = 'rgba(0, 0, 0, 0.7)';
            label.style.color = '#fff';
            label.style.padding = '2px 4px';
            label.style.fontSize = '10px';
            label.style.borderRadius = '2px';
            label.style.zIndex = '999';
        } else {
            // Original styling for non-playlist views
            label.style.position = 'absolute';
            label.style.bottom = '5px';
            label.style.left = '5px';
            label.style.background = 'rgba(0, 0, 0, 0.8)';
            label.style.color = '#fff';
            label.style.padding = '2px 5px';
            label.style.fontSize = '11px';
            label.style.borderRadius = '3px';
            label.style.zIndex = '1000';
        }

        label.style.whiteSpace = 'nowrap';
        label.style.pointerEvents = 'none';

        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === 'static') {
            element.style.position = 'relative';
        }

        element.appendChild(label);
    }

    // Add clear history button
    function tryAddClearButton() {
        if (document.getElementById('clearWatchHistoryBtn')) return;
        
        let header = document.querySelector("#container #start");
        if (!header) return;
        
        let btn = document.createElement('button');
        btn.id = 'clearWatchHistoryBtn';
        btn.textContent = 'Clear Watch History';
        btn.style.margin = '10px';
        btn.style.padding = '5px 10px';
        btn.style.background = '#cc0000';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '12px';
        
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your YouTube watch history stored locally?')) {
                watched = {};
                try {
                    localStorage.removeItem('watchedVideos');
                } catch (e) {
                    console.error('Error clearing watch history:', e);
                }
                processedThumbnails.clear();
                showWatchedDates();
            }
        });
        
        header.appendChild(btn);
    }

    // Event listeners
    window.addEventListener('popstate', () => {
        setupVideoListener();
        showWatchedDates();
    });

    document.addEventListener('yt-navigate-finish', () => {
        setupVideoListener();
        showWatchedDates();
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Periodically refresh watched dates
    setInterval(showWatchedDates, 15000);
})();