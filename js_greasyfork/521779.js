// ==UserScript==
// @name         Facebook Stories Background Playback
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Allow Facebook Stories to play in the background while leaving regular videos untouched
// @author       HaiDang
// @match        https://www.facebook.com/*
// @icon         https://cdn3.iconfinder.com/data/icons/transparent-on-dark-grey/500/icon-02-512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521779/Facebook%20Stories%20Background%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/521779/Facebook%20Stories%20Background%20Playback.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    const CHECK_INTERVAL = 1000; 
    const STORY_CONTAINER_SELECTORS = [
        'div[role="dialog"]',
        'div[aria-label="Tin"]',
        '.x78zum5.xdt5ytf.xg6iff7'
    ];

    function findStoryContainer() {
        for (const selector of STORY_CONTAINER_SELECTORS) {
            const container = document.querySelector(selector);
            if (container) return container;
        }
        return null;
    }

    function simulateFocus(element) {
        if (!element) return;

        // Create and dispatch focus event
        const focusEvent = new FocusEvent('focus', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        // Create and dispatch mouseenter event
        const mouseEvent = new MouseEvent('mouseenter', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        element.dispatchEvent(focusEvent);
        element.dispatchEvent(mouseEvent);
    }

    function initAutoplay() {
        setInterval(() => {
            const storyContainer = findStoryContainer();
            if (storyContainer) {
                simulateFocus(storyContainer);

                
                const videoElements = storyContainer.querySelectorAll('video');
                videoElements.forEach(video => {
                    if (video.paused) {
                        video.play().catch(() => {
                            
                        });
                    }
                });
            }
        }, CHECK_INTERVAL);
    }

    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoplay);
    } else {
        initAutoplay();
    }
})();