// ==UserScript==
// @name          YouTube Mobile Auto Like Enhanced
// @namespace     http://tampermonkey.net/
// @version       4.0
// @description   Enhanced auto-like script with better reliability, multiple selectors, and smart detection
// @author        Seth@Wiiplaza
// @match         https://m.youtube.com/watch*
// @match         https://www.youtube.com/watch*
// @run-at        document-start
// @grant         none
// @icon          https://www.youtube.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/533546/YouTube%20Mobile%20Auto%20Like%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/533546/YouTube%20Mobile%20Auto%20Like%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const CONFIG = {
        maxAttempts: 20,
        checkInterval: 800,
        initialDelay: 1500,
        debounceTime: 2000,
        enableLogging: true
    };
    
    let isProcessing = false;
    let currentVideoId = null;
    let likedVideos = new Set();
    let lastAttemptTime = 0;
    
    function log(message, type = 'info') {
        if (!CONFIG.enableLogging) return;
        const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warn' ? '⚠️' : 'ℹ️';
        console.log(`[AutoLike] ${emoji} ${message}`);
    }
    
    function getCurrentVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }
    
    function findLikeButton() {
        const selectors = [
            'like-button-view-model button[aria-pressed="false"][aria-label*="like"]',
            'like-button-view-model button[aria-pressed="false"]',
            'ytm-like-button-renderer button[aria-pressed="false"]',
            'button[aria-label*="like this video"][aria-pressed="false"]',
            '#segmented-like-button button[aria-pressed="false"]',
            'ytd-toggle-button-renderer button[aria-pressed="false"][aria-label*="like"]',
            'button[title*="like"][aria-pressed="false"]',
            'button[data-title-no-tooltip*="like"][aria-pressed="false"]'
        ];
        
        for (const selector of selectors) {
            const buttons = document.querySelectorAll(selector);
            for (const button of buttons) {
                const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
                const title = button.getAttribute('title')?.toLowerCase() || '';
                
                if ((ariaLabel.includes('like') || title.includes('like')) && 
                    !ariaLabel.includes('dislike') && !title.includes('dislike')) {
                    return button;
                }
            }
        }
        return null;
    }
    
    function isVideoAlreadyLiked() {
        const likedSelectors = [
            'like-button-view-model button[aria-pressed="true"]',
            'ytm-like-button-renderer button[aria-pressed="true"]',
            'button[aria-pressed="true"][aria-label*="like"]',
            '#segmented-like-button button[aria-pressed="true"]'
        ];
        
        return likedSelectors.some(selector => document.querySelector(selector));
    }
    
    function tryClickLikeButton() {
        if (isProcessing) return;
        
        const videoId = getCurrentVideoId();
        if (!videoId) {
            log('No video ID found', 'warn');
            return;
        }
        
        if (likedVideos.has(videoId)) {
            log(`Video ${videoId} already processed`, 'info');
            return;
        }
        
        const now = Date.now();
        if (now - lastAttemptTime < CONFIG.debounceTime) {
            log('Debouncing rapid calls', 'info');
            return;
        }
        lastAttemptTime = now;
        
        isProcessing = true;
        currentVideoId = videoId;
        
        log(`Starting auto-like process for video: ${videoId}`);
        
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            
            if (isVideoAlreadyLiked()) {
                log('Video is already liked!', 'success');
                likedVideos.add(videoId);
                clearInterval(interval);
                isProcessing = false;
                return;
            }
            
            const likeButton = findLikeButton();
            if (likeButton) {
                try {
                    likeButton.click();
                    log(`Successfully clicked like button (attempt ${attempts})`, 'success');
                    likedVideos.add(videoId);
                    clearInterval(interval);
                    isProcessing = false;
                    return;
                } catch (error) {
                    log(`Error clicking like button: ${error.message}`, 'error');
                }
            }
            
            if (attempts >= CONFIG.maxAttempts) {
                log(`Gave up after ${attempts} attempts`, 'warn');
                clearInterval(interval);
                isProcessing = false;
                return;
            }
            
            log(`Attempt ${attempts}/${CONFIG.maxAttempts} - Like button not found yet`);
        }, CONFIG.checkInterval);
    }
    
    function onPageReady() {
        log('Page ready event triggered');
        setTimeout(() => {
            tryClickLikeButton();
        }, CONFIG.initialDelay);
    }
    
    let lastUrl = location.href;
    function checkForUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            log('URL changed, resetting state');
            isProcessing = false;
            onPageReady();
        }
    }
    
    const events = [
        'yt-page-data-updated',
        'yt-navigate-finish',
        'DOMContentLoaded',
        'load'
    ];
    
    events.forEach(eventName => {
        document.addEventListener(eventName, onPageReady);
    });
    
    setInterval(checkForUrlChange, 1000);
    
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        onPageReady();
    }
    
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                if (addedNodes.some(node => 
                    node.nodeType === 1 && 
                    (node.matches?.('like-button-view-model') || 
                     node.querySelector?.('like-button-view-model'))
                )) {
                    log('Like button component detected via mutation observer');
                    setTimeout(tryClickLikeButton, 500);
                    break;
                }
            }
        }
    });
    
    setTimeout(() => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 2000);
    
    log('Enhanced YouTube Auto Like script initialized');
})();