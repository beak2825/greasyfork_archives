// ==UserScript==
// @name         YouTube Date & View Count at Top
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.9
// @description  Shows the YouTube upload date & view count at the top of the page to save scrolling every time.
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542500/YouTube%20Date%20%20View%20Count%20at%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/542500/YouTube%20Date%20%20View%20Count%20at%20Top.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastVideoId = '';
    let lastInfoText = '';

    function getVideoId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('v');
    }

    function waitForUpdatedInfo(videoId) {
        console.log('[DBG] Waiting for updated info for videoId:', videoId);

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                clearInterval(checkInterval);
                console.warn('[WARN] Timeout: #info element not found after 10 seconds for videoId:', videoId);
                reject(new Error('Timeout waiting for #info'));
            }, 10000); // 10 seconds timeout

            const checkInterval = setInterval(() => {
                const infoEl = document.querySelector('#info-container #info');
                if (!infoEl) return;

                const text = infoEl.textContent.trim();
                if (text && text !== lastInfoText) {
                    console.log('[DBG] Fresh info text:', text);
                    clearInterval(checkInterval);
                    clearTimeout(timeout);
                    resolve(infoEl);
                }
            }, 500); // poll every 500ms until info appears
        });
    }

    async function insertInfoBox() {
        const videoId = getVideoId();
        if (!videoId || videoId === lastVideoId) return;

        console.log('[DBG] Detected new videoId:', videoId);
        lastVideoId = videoId;

        try {
            const infoEl = await waitForUpdatedInfo(videoId);
            lastInfoText = infoEl.textContent.trim();

            // Extract only the first two spans (views + date)
            const spans = infoEl.querySelectorAll('span');
            let viewText = spans[0]?.textContent.trim() || '';
            let dateText = spans[2]?.textContent.trim() || '';
            console.log('[DBG] Extracted short form:', { viewText, dateText });

            // Get long-form tooltip data (exact count & upload date)
            let tooltipText = '';
            const tooltipEl = document.querySelector(
                'tp-yt-paper-tooltip.style-scope.ytd-watch-info-text #tooltip'
            );
            if (tooltipEl && tooltipEl.textContent.trim()) {
                const fullTooltip = tooltipEl.textContent.trim();
                console.log('[DBG] Full tooltip text:', fullTooltip);

                // Split by • and take only first two parts (views + date)
                const parts = fullTooltip.split('•').map(part => part.trim());
                if (parts.length >= 2) {
                    tooltipText = `${parts[0]} • ${parts[1]}`;
                } else {
                    tooltipText = fullTooltip; // fallback
                }
                console.log('[DBG] Trimmed tooltip text:', tooltipText);
            } else {
                console.warn('[DBG] Tooltip element not found, falling back.');
                tooltipText = `${viewText} • ${dateText}`;
            }

            const logoContainer = document.querySelector('ytd-masthead #start');
            const mastheadContainer = document.querySelector('ytd-masthead #container');
            if (!logoContainer || !mastheadContainer) {
                console.warn('[DBG] Could not find masthead or logo container');
                return;
            }

            // Measure logo width for placement
            const logoRect = logoContainer.getBoundingClientRect();
            const shiftRight = 20; // adjust this value to move further right

            // Remove old box
            const oldBox = document.getElementById('yt-date-view-overlay');
            if (oldBox) oldBox.remove();

            // Create wrapper with tooltip
            const wrapper = document.createElement('div');
            wrapper.id = 'yt-date-view-overlay';
            wrapper.style = `
                position: absolute;
                left: ${logoRect.right + shiftRight}px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
                font-weight: 500;
                color: var(--yt-spec-text-primary);
                cursor: pointer;
                z-index: 1000;
                pointer-events: auto;
            `;

            const infoBox = document.createElement('div');
            infoBox.textContent = `${viewText} • ${dateText}`;
            wrapper.appendChild(infoBox);

            const tooltip = document.createElement('div');
            tooltip.textContent = tooltipText || 'No detailed data found';
            tooltip.style = `
                visibility: hidden;
                background-color: #333;
                color: #fff;
                text-align: center;
                border-radius: 4px;
                padding: 6px;
                position: absolute;
                top: 120%;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: opacity 0.3s;
                white-space: nowrap;
            `;
            wrapper.appendChild(tooltip);

            wrapper.addEventListener('mouseenter', () => {
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            });
            wrapper.addEventListener('mouseleave', () => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            });

            // Append wrapper
            mastheadContainer.appendChild(wrapper);
            console.log('[DBG] Added info box with adjusted right shift:', infoBox.textContent);

        } catch (err) {
            console.error('[ERR] insertInfoBox failed:', err.message);
        }
    }

    function listenForNavigation() {
        window.addEventListener('yt-navigate-finish', () => {
            console.log('[DBG] Detected YouTube navigation (yt-navigate-finish)');
            insertInfoBox();
        });
    }

    listenForNavigation();
    insertInfoBox(); // Run once on initial load
})();
