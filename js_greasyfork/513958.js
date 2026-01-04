// ==UserScript==
// @name         YouTube Pink Progress Bar Remover (25.10.2024)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace gradient pink color in YouTube player progress bar with solid red
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/513958/YouTube%20Pink%20Progress%20Bar%20Remover%20%2825102024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513958/YouTube%20Pink%20Progress%20Bar%20Remover%20%2825102024%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set DEBUG to true to enable logging, or false to disable
    const DEBUG = false;

    // Logging function that only logs messages if DEBUG is true
    const log = (...args) => {
        if (DEBUG) {
            console.log('[YouTubeProgressBarRemover]', ...args);
        }
    };

    const STYLE_ID = 'custom-youtube-progress-bar-style';
    const DESIRED_BACKGROUND = 'rgb(255, 0, 0)'; // Desired background color in RGB

    let isApplyingStyles = false; // Flag to prevent infinite loops

    /**
     * Function to add CSS styles
     */
    const applyCSS = () => {
        log('Attempting to apply custom progress bar CSS...');

        if (document.getElementById(STYLE_ID)) {
            log('Custom CSS already applied.');
            return;
        }

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            /* Override the progress bar color */
            .ytp-play-progress,
            .ytp-swatch-background-color {
                background-color: #f00 !important;
                background-image: none !important;
                background: #f00 !important;
                border: none !important;
                box-shadow: none !important;
            }

            /* More specific selectors */
            .ytp-chrome-bottom .ytp-progress-bar-container .ytp-play-progress,
            .ytp-chrome-bottom .ytp-progress-bar-container .ytp-swatch-background-color {
                background-color: #f00 !important;
                background-image: none !important;
                background: #f00 !important;
                border: none !important;
                box-shadow: none !important;
            }

            /* Pseudo-elements for additional overriding */
            .ytp-play-progress::before,
            .ytp-play-progress::after {
                background: #f00 !important;
                background-image: none !important;
            }
        `;
        document.documentElement.appendChild(style);
        log('Custom CSS applied.');
    };

    /**
     * Function to directly modify the styles of the progress bar element
     */
    const applyInlineStyles = () => {
        const progressBar = document.querySelector('.ytp-play-progress');
        if (progressBar) {
            log('Applying inline styles to progress bar.');

            // Set flag to true to indicate styles are being applied
            isApplyingStyles = true;

            progressBar.style.backgroundColor = '#f00';
            progressBar.style.backgroundImage = 'none';
            progressBar.style.background = '#f00';
            progressBar.style.border = 'none';
            progressBar.style.boxShadow = 'none';

            log('Inline styles applied to progress bar.');

            // Reset the flag after a short delay
            setTimeout(() => {
                isApplyingStyles = false;
            }, 100);
        } else {
            log('Progress bar element not found for inline style application.');
        }
    };

    /**
     * Function to observe DOM changes specifically for the progress bar
     */
    const observeProgressBar = (progressBar) => {
        if (!progressBar) return;

        log('Setting up MutationObserver on progress bar...');

        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (isApplyingStyles) {
                        // Ignore mutations caused by this script
                        return;
                    }

                    const computedStyle = window.getComputedStyle(progressBar);
                    if (computedStyle.backgroundColor !== DESIRED_BACKGROUND || computedStyle.backgroundImage !== 'none') {
                        log('Progress bar styles changed, reapplying styles...');
                        applyInlineStyles();
                    }
                }
            }
        });

        observer.observe(progressBar, { attributes: true, attributeFilter: ['style'] });
        log('MutationObserver is now observing the progress bar.');
    };

    /**
     * Function to check the current styles of the progress bar and set up observer
     */
    const checkProgressBar = () => {
        const progressBar = document.querySelector('.ytp-play-progress');
        if (progressBar) {
            log('Progress bar element found:', progressBar);
            const computedStyle = window.getComputedStyle(progressBar);
            log('Current progress bar styles:', {
                background: computedStyle.background,
                'background-color': computedStyle['background-color'],
                'background-image': computedStyle['background-image']
            });

            // Apply inline styles if needed
            if (computedStyle.backgroundColor !== DESIRED_BACKGROUND || computedStyle.backgroundImage !== 'none') {
                applyInlineStyles();
            }

            // Set up observer to watch for style changes
            observeProgressBar(progressBar);
        } else {
            log('Progress bar element not found.');
        }
    };

    /**
     * Initialize the script as early as possible
     */
    const init = () => {
        log('Initializing YouTubeProgressBarRemover...');
        applyCSS();

        // Delay the initial check to allow the progress bar to be rendered
        setTimeout(() => {
            checkProgressBar();
        }, 500); // 0.5 seconds
    };

    // Inject the init function to run as soon as the DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 0);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
