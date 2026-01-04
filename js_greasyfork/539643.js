// ==UserScript==
// @name         Universal Video Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Universal video controls: B=+10s, V=-5s, X=+0.1 speed, Z=-0.1 speed, R=reset speed, G=2x, H=3x, J=4x
// @author       Stroage 05
// @licence MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539643/Universal%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/539643/Universal%20Video%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalSpeed = 1.0;
    let currentVideo = null;

    // Function to get the currently active video
    function getActiveVideo() {
        const videos = document.querySelectorAll('video');

        // Try to find a playing video first
        for (let video of videos) {
            if (!video.paused && !video.ended) {
                return video;
            }
        }

        // If no playing video, return the largest visible video
        let largestVideo = null;
        let largestArea = 0;

        for (let video of videos) {
            const rect = video.getBoundingClientRect();
            const area = rect.width * rect.height;

            // Check if video is visible
            if (area > largestArea && rect.width > 0 && rect.height > 0) {
                largestVideo = video;
                largestArea = area;
            }
        }

        return largestVideo || videos[0] || null;
    }

    // Function to show speed notification
    function showSpeedNotification(speed) {
        // Remove existing notification
        const existing = document.getElementById('video-speed-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'video-speed-notification';
        notification.textContent = `${speed.toFixed(1)}x`;

        notification.style.position = 'fixed';
        notification.style.top = '25%';
        notification.style.left = '25%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.background = 'rgba(0, 0, 0, 0.55)';
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '8px';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.fontSize = '18px';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '999999';
        notification.style.pointerEvents = 'none';
        notification.style.userSelect = 'none';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';

        document.body.appendChild(notification);

        // Force reflow to ensure styles are applied
        notification.offsetHeight;

        // Auto-remove after 0.7 seconds
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 700);
    }

    // Function to show time notification
    function showTimeNotification(action) {
        const video = getActiveVideo();
        if (!video) return;

        // Remove existing notification
        const existing = document.getElementById('video-time-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'video-time-notification';

        const currentTime = Math.floor(video.currentTime);
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        notification.textContent = `${action} | ${timeStr}`;
        notification.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 1.5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 1500);
    }

    // Store original speed when video loads
    function initializeVideo(video) {
        if (video && video !== currentVideo) {
            currentVideo = video;
            originalSpeed = video.playbackRate || 1.0;
        }
    }

    // Keyboard event handler
    function handleKeyPress(e) {
        // Don't trigger if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        const video = getActiveVideo();
        if (!video) return;

        // Initialize video if it's new
        initializeVideo(video);

        const key = e.key.toLowerCase();

        switch (key) {
            case 'b':
                // Forward 10 seconds
                video.currentTime = Math.min(video.currentTime + 10, video.duration || video.currentTime + 10);
                showTimeNotification('Forward +10s');
                e.preventDefault();
                break;

            case 'v':
                // Reverse 5 seconds
                video.currentTime = Math.max(video.currentTime - 5, 0);
                showTimeNotification('Rewind -5s');
                e.preventDefault();
                break;

            case 'x':
                // Increase speed by 0.1
                video.playbackRate = Math.min(video.playbackRate + 0.1, 16.0);
                showSpeedNotification(video.playbackRate);
                e.preventDefault();
                break;

            case 'z':
                // Decrease speed by 0.1
                video.playbackRate = Math.max(video.playbackRate - 0.1, 0.1);
                showSpeedNotification(video.playbackRate);
                e.preventDefault();
                break;

            case 'r':
                // Reset to original speed (only if no modifier keys are pressed)
                if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                    video.playbackRate = originalSpeed;
                    showSpeedNotification(video.playbackRate);
                    e.preventDefault();
                }
                break;

            case 'g':
                // Set speed to 2x
                video.playbackRate = 2.0;
                showSpeedNotification(video.playbackRate);
                e.preventDefault();
                break;

            case 'h':
                // Set speed to 3x
                video.playbackRate = 3.0;
                showSpeedNotification(video.playbackRate);
                e.preventDefault();
                break;

            case 'j':
                // Set speed to 4x
                video.playbackRate = 4.0;
                showSpeedNotification(video.playbackRate);
                e.preventDefault();
                break;
        }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyPress, true);

    // Monitor for new videos (for dynamic content)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'VIDEO') {
                        initializeVideo(node);
                    } else if (node.querySelector) {
                        const videos = node.querySelectorAll('video');
                        videos.forEach(initializeVideo);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initialize existing videos
    document.addEventListener('DOMContentLoaded', () => {
        const videos = document.querySelectorAll('video');
        videos.forEach(initializeVideo);
    });

    // If DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const videos = document.querySelectorAll('video');
            videos.forEach(initializeVideo);
        });
    } else {
        const videos = document.querySelectorAll('video');
        videos.forEach(initializeVideo);
    }

    console.log('Universal Video Controls loaded! Controls: B=+10s, V=-5s, X=+0.1 speed, Z=-0.1 speed, R=reset speed, G=2x, H=3x, J=4x');
})();