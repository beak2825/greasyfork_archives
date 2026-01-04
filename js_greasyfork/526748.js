// ==UserScript==
// @name         YT Speed Controller
// @namespace    -/-
// @version      1.0.1
// @description  Lightweight speed control for YouTube with persistence
// @author       Dataraj
// @match        https://www.youtube.com/*
// @license     MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526748/YT%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/526748/YT%20Speed%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'youtube-speed-value';
    const SPEED_STEP = 0.1;
    let speedDisplay = null;
    let isInitialized = false;

    // Debounce function to limit execution frequency
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function initSpeedControl() {
        if (isInitialized) return;

        const video = document.querySelector('video');
        const timeDisplay = document.querySelector('.ytp-time-display');
        if (!video || !timeDisplay) return;

        // Create speed display if not exists
        if (!speedDisplay) {
            speedDisplay = document.createElement('span');
            speedDisplay.style.marginLeft = '10px';
            timeDisplay.appendChild(speedDisplay);
        }

        // Apply saved speed
        const savedSpeed = parseFloat(localStorage.getItem(STORAGE_KEY)) || 1.0;
        video.playbackRate = savedSpeed;
        updateDisplay(savedSpeed);

        // Show guide only once per session
        if (!sessionStorage.getItem('guide-shown')) {
            showTemporaryGuide();
            sessionStorage.setItem('guide-shown', 'true');
        }

        isInitialized = true;
    }

    // Simplified speed display update
    function updateDisplay(speed) {
        if (speedDisplay) {
            speedDisplay.textContent = speed === 1 ? '' : `${speed.toFixed(1)}x`;
        }
    }

    // Optimized speed indicator
    function showSpeedIndicator(speed) {
        const bezel = document.querySelector('.ytp-bezel-text');
        if (!bezel) return;

        const container = bezel.parentNode.parentNode;
        bezel.textContent = `${speed.toFixed(1)}x`;
        container.style.display = '';

        setTimeout(() => container.style.display = 'none', 500);
    }

    // Simplified guide
    function showTemporaryGuide() {
        const guide = document.createElement('div');
        guide.innerHTML = `
            <div style="position:fixed;bottom:20px;right:20px;background:rgba(0,0,0,0.8);
                color:white;padding:12px;border-radius:6px;z-index:9999;font-family:Arial">
                <div>Speed Controls:</div>
                <div>] - Speed up</div>
                <div>[ - Slow down</div>
                <div>p - Reset to 1x</div>
            </div>
        `;
        document.body.appendChild(guide);
        setTimeout(() => guide.remove(), 5000);
    }

    // Efficient keyboard handler
    function handleKeypress(e) {
        if (document.activeElement.tagName === 'INPUT') return;

        const video = document.querySelector('video');
        if (!video) return;

        let newSpeed = video.playbackRate;

        switch(e.key) {
            case ']':
                newSpeed = Math.min(16, newSpeed + SPEED_STEP);
                break;
            case '[':
                newSpeed = Math.max(0.1, newSpeed - SPEED_STEP);
                break;
            case 'p':
                newSpeed = 1.0;
                break;
            default:
                return;
        }

        video.playbackRate = newSpeed;
        localStorage.setItem(STORAGE_KEY, newSpeed.toString());
        updateDisplay(newSpeed);
        showSpeedIndicator(newSpeed);
    }

    // Optimized initialization
    function init() {
        // Remove any existing event listeners
        document.removeEventListener('keydown', handleKeypress);

        // Add single event listener for keyboard controls
        document.addEventListener('keydown', handleKeypress);

        // Debounced initialization for navigation changes
        const debouncedInit = debounce(() => {
            if (window.location.pathname.includes('/watch')) {
                isInitialized = false;
                initSpeedControl();
            }
        }, 1000);

        // Listen for URL changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                debouncedInit();
            }
        }).observe(document, {subtree: true, childList: true});

        // Initial setup
        debouncedInit();
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();