// ==UserScript==
// @name         Kick.com Enhanced Video Seekbar
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Makes seekbar clickable anywhere like Twitter/Twitch, including on thumb
// @author       zxvc23
// @match        htts://kick.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527706/Kickcom%20Enhanced%20Video%20Seekbar.user.js
// @updateURL https://update.greasyfork.org/scripts/527706/Kickcom%20Enhanced%20Video%20Seekbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initSeekbarEnhancement() {
        const seekbarContainer = document.querySelector('span[data-orientation="horizontal"].bg-subtle\\/50');
        if (!seekbarContainer) {
            console.log('Seekbar container not found');
            return;
        }

        const progressBar = seekbarContainer.querySelector('span.bg-green-500');
        const thumb = document.querySelector('span[role="slider"][aria-label="Current video time"]');

        if (!progressBar || !thumb) {
            console.log('Progress bar or thumb not found');
            return;
        }

        const maxValue = parseInt(thumb.getAttribute('aria-valuemax'));
        console.log('Max value:', maxValue);

        seekbarContainer.style.cursor = 'pointer';
        thumb.style.pointerEvents = 'none'; // Disable native thumb interactions

        function handleSeekClick(e) {
            e.preventDefault();
            e.stopPropagation();

            const rect = seekbarContainer.getBoundingClientRect();
            const clickPosition = e.clientX - rect.left;
            const totalWidth = rect.width;
            const percentage = Math.max(0, Math.min(1, clickPosition / totalWidth)); // Clamp between 0 and 1

            const newTime = Math.floor(maxValue * percentage);
            console.log('Click at:', percentage * 100, '%, New time:', newTime);

            // Update slider attributes
            thumb.setAttribute('aria-valuenow', newTime);
            thumb.parentElement.style.left = `calc(${percentage * 100}% + 0px)`;
            progressBar.style.right = `${100 - (percentage * 100)}%`;

            // Dispatch multiple events to ensure player updates
            ['input', 'change'].forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                thumb.dispatchEvent(event);
            });

            // Force focus to potentially trigger player update
            thumb.focus();
        }

        // Remove any existing listeners to avoid duplicates
        seekbarContainer.removeEventListener('click', handleSeekClick);
        thumb.removeEventListener('mousedown', preventDefault);

        // Add click handler
        seekbarContainer.addEventListener('click', handleSeekClick, true);

        // Prevent default thumb behavior
        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        thumb.addEventListener('mousedown', preventDefault, true);
        thumb.addEventListener('click', preventDefault, true);
    }

    // Initialize and reinitialize on DOM changes
    function setupObserver() {
        initSeekbarEnhancement();

        const observer = new MutationObserver(() => {
            if (document.querySelector('span[data-orientation="horizontal"].bg-subtle\\/50')) {
                initSeekbarEnhancement();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener('load', setupObserver);
})();