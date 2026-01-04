// ==UserScript==
// @name         视频播放保持焦点 + 播放完提醒（安全二合一）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  模拟页面聚焦，防止视频暂停 + 播放结束提醒，适用于雨课堂等平台，风险极低
// @match        *://*.yuketang.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535931/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%BF%9D%E6%8C%81%E7%84%A6%E7%82%B9%20%2B%20%E6%92%AD%E6%94%BE%E5%AE%8C%E6%8F%90%E9%86%92%EF%BC%88%E5%AE%89%E5%85%A8%E4%BA%8C%E5%90%88%E4%B8%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/535931/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%BF%9D%E6%8C%81%E7%84%A6%E7%82%B9%20%2B%20%E6%92%AD%E6%94%BE%E5%AE%8C%E6%8F%90%E9%86%92%EF%BC%88%E5%AE%89%E5%85%A8%E4%BA%8C%E5%90%88%E4%B8%80%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // You might need to change these selectors based on your course website.
    // Use your browser's developer tools (F12) to inspect the video player and find the correct selector for the play button.
    // Common selectors might be:
    // 'button.play-button'
    // 'div.video-player-controls .play'
    // 'video' // Sometimes just interacting with the video element itself works
    // 'button[aria-label="Play"]'
    const PLAY_BUTTON_SELECTORS = [
        'button.play-button',
        'div.video-player-controls .play',
        'button[aria-label="Play"]',
        'button[title="Play"]',
        'a.play-button',
        'div[role="button"].play-button',
        // Add more potential selectors here based on your website
        'video', // Include video element itself as a fallback
    ];

    // How often to check for the play button (in milliseconds)
    const CHECK_INTERVAL = 1000; // Check every 1 second

    // How long to keep checking for the play button (in milliseconds)
    const MAX_CHECK_TIME = 30000; // Stop checking after 30 seconds

    // --- Auto Play Logic ---
    let checkAttempts = 0;
    const autoPlayInterval = setInterval(() => {
        checkAttempts++;
        if (checkAttempts * CHECK_INTERVAL > MAX_CHECK_TIME) {
            console.log('AutoPlay script: Max check time reached, stopping auto play check.');
            clearInterval(autoPlayInterval);
            return;
        }

        let playButtonClicked = false;
        for (const selector of PLAY_BUTTON_SELECTORS) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`AutoPlay script: Found element with selector "${selector}"`, element);
                // Check if it's a video element and if it's paused
                if (element.tagName === 'VIDEO') {
                     if (element.paused) {
                         console.log('AutoPlay script: Video is paused, attempting to play.');
                         element.play().then(() => {
                             console.log('AutoPlay script: Video play() successful.');
                             playButtonClicked = true;
                             clearInterval(autoPlayInterval); // Stop checking once played
                         }).catch(error => {
                             console.warn('AutoPlay script: Video play() failed:', error);
                             // Continue checking if play failed, maybe it's not ready yet
                         });
                     } else {
                         console.log('AutoPlay script: Video is already playing.');
                         playButtonClicked = true;
                         clearInterval(autoPlayInterval); // Stop checking if already playing
                     }
                } else {
                    // Assume it's a button or clickable element
                    console.log('AutoPlay script: Found potential play button, attempting to click.');
                    element.click();
                    console.log('AutoPlay script: Clicked element.');
                    playButtonClicked = true;
                    clearInterval(autoPlayInterval); // Stop checking once clicked
                }

                if (playButtonClicked) {
                    break; // Exit the loop if we found and interacted with an element
                }
            }
        }

        if (playButtonClicked) {
             console.log('AutoPlay script: Auto play action performed.');
        } else {
             console.log(`AutoPlay script: Play button not found after ${checkAttempts} attempts.`);
        }

    }, CHECK_INTERVAL);


    // --- Prevent Pause on Blur Logic ---
    // This part tries to trick the website into thinking the tab is always visible.
    // It overrides document.hidden and document.visibilityState properties.
    // Note: This might not work on all websites, as some might use other methods to detect focus.

    console.log('AutoPlay script: Attempting to prevent pause on blur.');

    // Store original properties
    const originalDocumentHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
    const originalDocumentVisibilityState = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');

    // Override properties if they exist
    if (originalDocumentHidden && originalDocumentHidden.configurable) {
        Object.defineProperty(Document.prototype, 'hidden', {
            get: function() { return false; }, // Always report as not hidden
            configurable: true // Allow redefining later if needed
        });
        console.log('AutoPlay script: Overrode document.hidden');
    } else {
         console.warn('AutoPlay script: Could not override document.hidden');
    }

    if (originalDocumentVisibilityState && originalDocumentVisibilityState.configurable) {
         Object.defineProperty(Document.prototype, 'visibilityState', {
            get: function() { return 'visible'; }, // Always report as visible
            configurable: true // Allow redefining later if needed
         });
         console.log('AutoPlay script: Overrode document.visibilityState');
    } else {
         console.warn('AutoPlay script: Could not override document.visibilityState');
    }

    // You might also need to simulate 'focus' or 'visibilitychange' events periodically
    // This is more complex and might not be necessary depending on the website.
    // Example (uncomment and adapt if needed):
    /*
    setInterval(() => {
        try {
            window.dispatchEvent(new Event('focus'));
            document.dispatchEvent(new Event('visibilitychange'));
        } catch (e) {
            console.warn('AutoPlay script: Failed to dispatch events:', e);
        }
    }, 5000); // Dispatch events every 5 seconds
    */


    console.log('AutoPlay script: Initialization complete.');

})();
