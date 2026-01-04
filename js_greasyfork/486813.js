// ==UserScript==
// @name         Enhanced YouTube
// @namespace    https://discord.gg/rPbnXvFf
// @version      1.2
// @description  Enhance YouTube by improving layout, adding shortcuts, customizing controls, and toggling dark mode
// @author       Pixel.pilot
// @match        https://www.youtube.com/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/502125/Enhanced%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/502125/Enhanced%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Function to remove ads from the YouTube page.
     */
    function removeAds() {
        const adSelectors = ['#player-ads', '.video-ads', '.ytp-ad-module'];
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => ad.remove());
        });
    }

    /**
     * Function to enhance the layout for both PC and mobile.
     * - Sets the video player width to 100% on PC.
     * - Ensures proper viewport settings on mobile.
     */
    function enhanceLayout() {
        // Wide video player on PC
        const player = document.getElementById('player-container');
        if (player) {
            player.style.width = '100%';
        }

        // Mobile optimizations
        const metaViewport = document.querySelector('meta[name="viewport"]') || document.createElement('meta');
        metaViewport.name = "viewport";
        metaViewport.content = "width=device-width, initial-scale=1";
        document.head.appendChild(metaViewport);
    }

    /**
     * Function to customize the video player controls.
     * - Changes the background color and border radius of the controls.
     */
    function customizeControls() {
        const controls = document.querySelector('.ytp-chrome-bottom');
        if (controls) {
            controls.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            controls.style.borderRadius = '10px';
        }
    }

    /**
     * Function to toggle dark mode on the page.
     * - Applies dark mode styling to the page and changes link colors.
     */
    function toggleDarkMode() {
        const body = document.body;
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            body.style.backgroundColor = '#181818';
            document.querySelectorAll('a').forEach(a => a.style.color = '#1e90ff');
        } else {
            body.style.backgroundColor = '';
            document.querySelectorAll('a').forEach(a => a.style.color = '');
        }
    }

    /**
     * Function to add keyboard shortcuts for various actions.
     * - 'f': Toggle fullscreen mode
     * - 'm': Mute/unmute video
     * - 'd': Toggle dark mode
     */
    function addShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'f':
                    document.querySelector('.ytp-fullscreen-button')?.click();
                    break;
                case 'm':
                    document.querySelector('.ytp-mute-button')?.click();
                    break;
                case 'd':
                    toggleDarkMode();
                    break;
            }
        });
    }

    /**
     * Run all enhancements.
     * Includes ad removal, layout enhancement, control customization, and shortcut addition.
     */
    function runEnhancements() {
        try {
            removeAds();
            enhanceLayout();
            customizeControls();
            addShortcuts();
        } catch (error) {
            console.error('Error running enhancements:', error);
        }
    }

    // Wait for the YouTube page to fully load
    window.addEventListener('load', runEnhancements);

    // Handle dynamic content load with MutationObserver
    const observer = new MutationObserver(runEnhancements);
    observer.observe(document.body, { childList: true, subtree: true });

    console.log('Enhanced YouTube script loaded');
})();
