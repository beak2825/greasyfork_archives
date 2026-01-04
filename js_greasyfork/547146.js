// ==UserScript==
// @name         CSTAT Orientation Timer Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass timer restrictions on Texas A&M CSTAT Online Orientation pages
// @author       Bean0-0
// @license      MIT
// @match        https://cstat-onlineorientation.tamu.edu/*
// @match        *://cstat-onlineorientation.tamu.edu/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547146/CSTAT%20Orientation%20Timer%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/547146/CSTAT%20Orientation%20Timer%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('CSTAT Orientation Timer Bypass loaded');

    // Override setTimeout and setInterval to bypass timers
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    // Override setTimeout to intercept timer-based delays
    window.setTimeout = function(callback, delay, ...args) {
        // Only bypass very long delays (likely orientation timers), keep shorter ones intact
        if (delay > 30000) { // Only affect delays longer than 30 seconds
            console.log(`Bypassing setTimeout delay: ${delay}ms -> 1000ms`);
            delay = 1000;
        }
        const id = originalSetTimeout.call(this, callback, delay, ...args);
        return id;
    };

    // Override setInterval to intercept repeating timers
    window.setInterval = function(callback, delay, ...args) {
        // Only affect very long intervals, leave normal ones alone
        if (delay > 30000) {
            console.log(`Bypassing setInterval delay: ${delay}ms -> 5000ms`);
            delay = 5000;
        }
        const id = originalSetInterval.call(this, callback, delay, ...args);
        return id;
    };

    // Function to force enable navigation elements
    function enableNavigation() {
        // Look for disabled navigation elements and enable them
        const disabledElements = document.querySelectorAll('[disabled], .disabled, [aria-disabled="true"]');
        disabledElements.forEach(element => {
            element.removeAttribute('disabled');
            element.classList.remove('disabled');
            element.setAttribute('aria-disabled', 'false');
            element.style.pointerEvents = 'auto';
            element.style.opacity = '1';
        });

        // Look for next/continue buttons and enable them
        const nextButtons = document.querySelectorAll('button[class*="next"], button[class*="continue"], a[class*="next"], a[class*="continue"], .next-button, .continue-button, [data-action*="next"], [data-action*="continue"]');
        nextButtons.forEach(button => {
            button.removeAttribute('disabled');
            button.classList.remove('disabled');
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        });

        // Look for locked content and unlock it
        const lockedElements = document.querySelectorAll('.locked, [class*="locked"], [data-locked="true"]');
        lockedElements.forEach(element => {
            element.classList.remove('locked');
            element.removeAttribute('data-locked');
            element.style.pointerEvents = 'auto';
            element.style.opacity = '1';
        });
    }

    // Function to override common timer-related variables
    function overrideTimerVariables() {
        // Common timer variables that might be used
        if (window.FEATURE_SETTINGS) {
            window.FEATURE_SETTINGS.showTimedReleaseTopics = false;
            console.log('Disabled timed release topics');
        }

        // Try to find and override timer-related configurations
        if (window.orientationConfig) {
            window.orientationConfig.timer = false;
            window.orientationConfig.timedRelease = false;
        }

        // Override video player timers if present
        if (window.kalturaPlayer) {
            try {
                window.kalturaPlayer.duration = 0.1;
            } catch (e) {
                console.log('Could not override Kaltura player duration');
            }
        }
    }

    // Function to simulate video completion
    function simulateVideoCompletion() {
        // Dispatch video end events
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.duration && video.currentTime < video.duration) {
                video.currentTime = video.duration;
                video.dispatchEvent(new Event('ended'));
                video.dispatchEvent(new Event('timeupdate'));
                console.log('Simulated video completion');
            }
        });

        // Try to trigger Kaltura player events
        if (window.kalturaPlayer) {
            try {
                window.kalturaPlayer.dispatchEvent('ended');
                window.kalturaPlayer.dispatchEvent('timeupdate');
            } catch (e) {
                console.log('Could not dispatch Kaltura events');
            }
        }
    }

    // Function to add bypass controls to the page
    function addBypassControls() {
        if (document.getElementById('timer-bypass-controls')) return;

        const controlPanel = document.createElement('div');
        controlPanel.id = 'timer-bypass-controls';
        controlPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #a61830;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        controlPanel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold;">Timer Bypass Controls</div>
            <button id="enable-nav-btn" style="margin: 2px; padding: 5px; background: #fff; color: #a61830; border: none; border-radius: 3px; cursor: pointer;">Enable Navigation</button><br>
            <button id="complete-video-btn" style="margin: 2px; padding: 5px; background: #fff; color: #a61830; border: none; border-radius: 3px; cursor: pointer;">Complete Videos</button><br>
            <button id="skip-timers-btn" style="margin: 2px; padding: 5px; background: #fff; color: #a61830; border: none; border-radius: 3px; cursor: pointer;">Skip All Timers</button><br>
            <button id="toggle-bypass-btn" style="margin: 2px; padding: 5px; background: #fff; color: #a61830; border: none; border-radius: 3px; cursor: pointer;">Toggle Auto-Bypass</button>
            <div id="bypass-status" style="margin-top: 5px; font-size: 10px;">Auto-Bypass: ON</div>
        `;

        document.body.appendChild(controlPanel);

        // Add event listeners with better functionality
        let autoBypassEnabled = true;

        document.getElementById('enable-nav-btn').addEventListener('click', enableNavigation);
        document.getElementById('complete-video-btn').addEventListener('click', simulateVideoCompletion);

        document.getElementById('skip-timers-btn').addEventListener('click', () => {
            // Force skip any visible timers or waiting periods
            const waitingElements = document.querySelectorAll('[class*="wait"], [class*="timer"], [class*="countdown"]');
            waitingElements.forEach(el => el.style.display = 'none');

            // Try to click any "skip" or "continue" buttons
            const skipButtons = document.querySelectorAll('button[class*="skip"], a[class*="skip"], [data-action*="skip"]');
            skipButtons.forEach(btn => btn.click());

            enableNavigation();
            simulateVideoCompletion();
            console.log('Attempted to skip all timers');
        });

        document.getElementById('toggle-bypass-btn').addEventListener('click', () => {
            autoBypassEnabled = !autoBypassEnabled;
            document.getElementById('bypass-status').textContent = `Auto-Bypass: ${autoBypassEnabled ? 'ON' : 'OFF'}`;
            console.log(`Auto-bypass ${autoBypassEnabled ? 'enabled' : 'disabled'}`);
        });
    }

    // Function to handle page mutations and continuously bypass restrictions
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            // Throttle the mutation handling to prevent performance issues
            clearTimeout(window.mutationTimeout);
            window.mutationTimeout = setTimeout(() => {
                enableNavigation();
            }, 500); // Wait 500ms before processing changes
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'class', 'aria-disabled']
        });
    }

    // Initialize when DOM is ready
    function initialize() {
        overrideTimerVariables();
        enableNavigation();
        addBypassControls();
        setupMutationObserver();

        // Much less aggressive periodic check - only every 10 seconds
        setInterval(() => {
            enableNavigation();
        }, 10000);

        console.log('Timer bypass initialized');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also try to initialize immediately for early interception
    setTimeout(initialize, 100);

})();
