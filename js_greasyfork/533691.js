// ==UserScript==
// @license MIT
// @name         YouTube Auto Heart Comments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically hearts comments on your YouTube videos
// @author       __plasma (Patched by Claude)
// @match        https://studio.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533691/YouTube%20Auto%20Heart%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/533691/YouTube%20Auto%20Heart%20Comments.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Add styles
    GM_addStyle(`
        #youtube-auto-heart-settings {
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 9999;
            background-color: #FF0000;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        #youtube-auto-heart-counter {
            position: fixed;
            bottom: 10px;
            left: 150px;
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 12px;
        }
        .youtube-auto-heart-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            animation: fadeInOut 2s forwards;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
        }
    `);

    // Configuration
    const CONFIG = {
        checkInterval: 1000, // Check every second
        showNotifications: true,
        maxCommentsPerBatch: 50,
        heartDelay: 100, // Delay between heart clicks
        scrollDelay: 3000, // Delay between auto-scroll actions (milliseconds)
        scrollStep: 500, // Pixels to scroll down each time
        debug: true // Enable debugging
    };

    // Variables to track state
    let processedComments = new Set();
    let isProcessing = false;
    let isEnabled = GM_getValue('autoHeartEnabled', true);
    let heartInterval;
    let urlCheckInterval;
    let totalHearted = GM_getValue('totalHearted', 0);
    let counterElement = null;
    let currentUrl = location.href;
    let lastCheckTime = 0;
    let isStudioComments = false;

    // Debugging function
    function debug(message) {
        if (CONFIG.debug) {
            console.log(`[YouTube Auto Heart Debug] ${message}`);
        }
    }

    // Function to show notifications
    function showNotification(message) {
        if (!CONFIG.showNotifications) return;
        const existingNotification = document.querySelector('.youtube-auto-heart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        const notification = document.createElement('div');
        notification.className = 'youtube-auto-heart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }

    // Update the counter display
    function updateCounter() {
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.id = 'youtube-auto-heart-counter';
            document.body.appendChild(counterElement);
        }
        counterElement.textContent = `Hearts: ${totalHearted}`;
        GM_setValue('totalHearted', totalHearted);
    }

    // Check if a comment is already hearted
    function isCommentHearted(heartButton) {
        if (!heartButton) return true; // If button doesn't exist, assume we can't heart it

        if (isStudioComments) {
            // Studio-specific checks
            const heartIcon = heartButton.querySelector('tp-yt-iron-icon');
            if (heartIcon && heartIcon.getAttribute('icon') === 'favorite') {
                debug('Comment already hearted (Studio - filled heart icon)');
                return true;
            }
            if (heartButton.getAttribute('data-hearted') === 'true' ||
                heartButton.classList.contains('hearted')) {
                debug('Comment already hearted (Studio - data-hearted/hearted class)');
                return true;
            }
        } else {
            // Regular YouTube checks
            if (heartButton.getAttribute('aria-pressed') === 'true' ||
                heartButton.querySelector('.yt-spec-icon-badge-shape__icon--filled')) {
                debug('Comment already hearted (Regular - aria-pressed/filled icon)');
                return true;
            }
        }

        // Common checks for both interfaces
        if (heartButton.getAttribute('aria-label') &&
            (heartButton.getAttribute('aria-label').includes('Remove heart') ||
             heartButton.getAttribute('aria-label').includes('Hearted'))) {
            debug('Comment already hearted (Common - aria-label)');
            return true;
        }

        debug('Comment determined NOT to be hearted');
        return false;
    }

    // Process comments in batches
    function processCommentBatch(commentBatch) {
        if (commentBatch.length === 0) {
            isProcessing = false;
            return;
        }
        let processedCount = 0;
        for (let i = 0; i < commentBatch.length; i++) {
            const current = commentBatch[i];
            setTimeout(() => {
                try {
                    if (current.button && document.body.contains(current.button) && !isCommentHearted(current.button)) {
                        debug(`Clicking heart button for comment: ${current.id}`);
                        current.button.click();
                        processedCount++;
                        totalHearted++;
                        if (totalHearted % 5 === 0) {
                            updateCounter();
                        }
                        processedComments.add(current.id);
                    } else {
                        processedComments.add(current.id); // Mark as processed even if already hearted
                    }
                } catch (e) {
                    debug(`Error when clicking heart: ${e.message} for comment: ${current.id}`);
                    processedComments.add(current.id);
                }
                if (i === commentBatch.length - 1) {
                    if (processedCount > 0) {
                        showNotification(`Hearted ${processedCount} comments`);
                        console.log(`[YouTube Auto Heart] Hearted ${processedCount} comments in this batch.`);
                        updateCounter();
                    } else {
                        debug("No comments were hearted in this batch.");
                    }
                    isProcessing = false;
                }
            }, i * CONFIG.heartDelay);
        }
    }

    // Find heart buttons based on context
    function findHeartButtons(contextElement = document) {
        let selectors = [];
        if (isStudioComments) {
            selectors = [
                'ytcp-comment-creator-heart#creator-heart ytcp-icon-button',
                'ytcp-comment-action-buttons#action-buttons ytcp-icon-button[aria-label*="Heart"]',
                'tp-yt-iron-icon[icon="favorite_border"]'
            ];
        } else {
            selectors = [
                '#like-button button[aria-label*="Heart"]',
                'button[aria-label="Heart"]',
                '#actions button[aria-label*="heart"]'
            ];
        }
        return contextElement.querySelectorAll(selectors.join(', '));
    }

    // Find comment elements based on context
    function findCommentElements() {
        let selectors = [];
        if (isStudioComments) {
            selectors = [
                'ytcp-comment-thread',
                'ytcp-comment'
            ];
        } else {
            selectors = [
                'ytd-comment-thread-renderer',
                'ytd-comment-renderer'
            ];
        }
        return document.querySelectorAll(selectors.join(', '));
    }

    // Main function to find and heart comments
    function heartComments() {
        if (isProcessing || !isEnabled) return;

        isStudioComments = window.location.href.startsWith('https://studio.youtube.com/');
        debug(`Processing comments. Is Studio: ${isStudioComments}. URL: ${window.location.href}`);

        if (Date.now() - lastCheckTime < 1500) {
            debug("Delaying check due to recent URL change.");
            return;
        }

        isProcessing = true;
        try {
            const commentElements = findCommentElements();
            if (!commentElements || commentElements.length === 0) {
                debug('No comment elements found on page.');
                isProcessing = false;
                return;
            }

            debug(`Found ${commentElements.length} comment elements.`);
            let commentsToProcess = [];

            for (let i = 0; i < commentElements.length; i++) {
                if (commentsToProcess.length >= CONFIG.maxCommentsPerBatch) {
                    debug(`Reached batch limit (${CONFIG.maxCommentsPerBatch})`);
                    break;
                }

                const commentElement = commentElements[i];
                let commentId = commentElement.getAttribute('comment-id') ||
                                commentElement.getAttribute('data-comment-id') ||
                                commentElement.id;

                if (!commentId) {
                    let commentTextElement = commentElement.querySelector(isStudioComments ? '.comment-text-content, .comment-content, #content-text' : '#content-text');
                    let commentText = commentTextElement ? commentTextElement.textContent.trim().slice(0, 30) : `no-text-${i}`;
                    commentId = `comment-${commentText}-${Date.now()}-${Math.random()}`;
                }

                if (processedComments.has(commentId)) {
                    continue;
                }

                const heartButtonsInComment = findHeartButtons(commentElement);
                if (heartButtonsInComment.length === 0) {
                    processedComments.add(commentId);
                    continue;
                }

                const heartButton = heartButtonsInComment[0];
                if (heartButton && !heartButton.disabled && !isCommentHearted(heartButton)) {
                    debug(`Found unhearted comment: ${commentId}`);
                    commentsToProcess.push({
                        element: commentElement,
                        button: heartButton,
                        id: commentId
                    });
                } else {
                    processedComments.add(commentId);
                }
            }

            if (commentsToProcess.length > 0) {
                debug(`Collected ${commentsToProcess.length} comments to process in this batch.`);
                processCommentBatch(commentsToProcess);
            } else {
                debug('No new unhearted comments found in this check.');
                isProcessing = false;
            }
        } catch (error) {
            console.error('[YouTube Auto Heart] Error in heartComments:', error);
            debug(`Error in heartComments: ${error.message}`);
            isProcessing = false;
        }
    }

    // Auto-scroll functionality
    let lastScrollPosition = 0;
    let scrollInterval;

    function startAutoScroll() {
        if (scrollInterval) return; // Prevent multiple intervals
        debug('Starting auto-scroll interval...');
        scrollInterval = setInterval(() => {
            const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
            if (currentScrollPosition <= lastScrollPosition) {
                debug('Scrolling down...');
                window.scrollBy(0, CONFIG.scrollStep); // Scroll down by scrollStep pixels
            }
            lastScrollPosition = currentScrollPosition;
        }, CONFIG.scrollDelay);
    }

    function stopAutoScroll() {
        if (scrollInterval) {
            debug('Stopping auto-scroll interval...');
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }

    // Check for URL changes
    function checkUrlChange() {
        const newUrl = location.href;
        if (newUrl !== currentUrl) {
            debug(`URL changed from ${currentUrl} to ${newUrl}`);
            const oldUrlBase = currentUrl.split('?')[0].split('#')[0];
            const newUrlBase = newUrl.split('?')[0].split('#')[0];
            currentUrl = newUrl;
            lastCheckTime = Date.now();
            if (oldUrlBase !== newUrlBase) {
                processedComments.clear();
                console.log('[YouTube Auto Heart] URL base changed, cleared processed comments history.');
                debug('URL base changed, cleared processed comments set.');
                setTimeout(heartComments, 500);
            } else {
                debug("URL changed but base is the same, not clearing history.");
            }
        }
    }

    // Add settings button
    function addSettingsButton() {
        if (document.getElementById('youtube-auto-heart-settings')) return;
        const settingsButton = document.createElement('button');
        settingsButton.id = 'youtube-auto-heart-settings';
        settingsButton.textContent = isEnabled ? '❤️ Auto Heart (ON)' : '🤍 Auto Heart (OFF)';
        settingsButton.style.backgroundColor = isEnabled ? '#FF0000' : '#666666';
        settingsButton.addEventListener('click', () => {
            isEnabled = !isEnabled;
            GM_setValue('autoHeartEnabled', isEnabled);
            settingsButton.textContent = isEnabled ? '❤️ Auto Heart (ON)' : '🤍 Auto Heart (OFF)';
            settingsButton.style.backgroundColor = isEnabled ? '#FF0000' : '#666666';
            if (isEnabled) {
                startAutoHeartProcess();
                startAutoScroll(); // Start auto-scroll when enabling the script
                showNotification('YouTube Auto Heart is now enabled');
                debug("Auto Heart Enabled via button");
                heartComments();
            } else {
                stopAutoHeartProcess();
                stopAutoScroll(); // Stop auto-scroll when disabling the script
                showNotification('YouTube Auto Heart is now disabled');
                debug("Auto Heart Disabled via button");
            }
        });
        document.body.appendChild(settingsButton);
        updateCounter();
    }

    // Start auto heart process
    function startAutoHeartProcess() {
        if (!heartInterval) {
            debug(`Starting heart interval (${CONFIG.checkInterval}ms)`);
            heartInterval = setInterval(heartComments, CONFIG.checkInterval);
        }
    }

    // Stop auto heart process
    function stopAutoHeartProcess() {
        if (heartInterval) {
            debug("Stopping heart interval");
            clearInterval(heartInterval);
            heartInterval = null;
        }
        isProcessing = false;
    }

    // Initialize script
    function initScript() {
        console.log('[YouTube Auto Heart] Initializing script v1.8...');
        debug('Script init');
        currentUrl = location.href;
        isStudioComments = window.location.href.startsWith('https://studio.youtube.com/');
        debug(`Initial URL: ${currentUrl}, isStudio: ${isStudioComments}`);
        addSettingsButton();
        if (urlCheckInterval) clearInterval(urlCheckInterval);
        urlCheckInterval = setInterval(checkUrlChange, 500);
        if (isEnabled) {
            startAutoHeartProcess();
            startAutoScroll(); // Start auto-scroll on initialization if enabled
            setTimeout(heartComments, 1500);
        } else {
            debug("Script initialized but is disabled by user setting.");
        }
        debug("Initialization complete.");
    }

    // Wait for page to load before initializing
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initScript, 2000);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(initScript, 2000));
    }
})();