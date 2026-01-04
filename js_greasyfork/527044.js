// ==UserScript==
// @name         YouTube always select Highest Quality
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Automatically select the best available quality for YouTube videos
// @author       none
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527044/YouTube%20always%20select%20Highest%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/527044/YouTube%20always%20select%20Highest%20Quality.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const log = (...args) => console.log('[TM-YT-Premium-Quality]', ...args);

    log('loaded');

function selectQuality(qualityButton) {
    const maxAllowedResolution = 2160; // <-- Change this to 1080, 2160, etc. if needed

    qualityButton.click();

    const menuItems = document.querySelectorAll('.ytp-settings-menu .ytp-panel .ytp-menuitem');

    menuItems.forEach(item => {
        if (!item.innerText.includes('Quality')) {
            return;
        }

        log('found quality menu item, clicking...');
        item.click();

        const qualities = [...document.querySelectorAll('.ytp-settings-menu .ytp-panel.ytp-quality-menu .ytp-menuitem')];

        // Remove premium-only options
        const nonPremiumQualities = qualities.filter(q => !q.innerText.includes('Premium'));

        if (nonPremiumQualities.length === 0) {
            log('No non-premium qualities found, falling back to whatever is available.');
            if (qualities.length > 0) {
                qualities[0].click();
                log('Selected fallback quality:', qualities[0].innerText);
            } else {
                log('No quality options found at all.');
            }
            return;
        }

        // Extract resolution number from text (e.g., "1080p HD" -> 1080)
        const parsedQualities = nonPremiumQualities.map(q => {
            const match = q.innerText.match(/(\d{3,4})p/);
            const resolution = match ? parseInt(match[1], 10) : 0;
            return { element: q, resolution };
        });

        // Filter by max allowed resolution and sort from highest to lowest
        const allowedQualities = parsedQualities
            .filter(q => q.resolution <= maxAllowedResolution)
            .sort((a, b) => b.resolution - a.resolution);

        if (allowedQualities.length > 0) {
            allowedQualities[0].element.click();
            log('Selected best allowed quality:', allowedQualities[0].element.innerText);
        } else {
            log('No allowed resolutions under max cap. Picking best fallback.');
            nonPremiumQualities[0].click();
        }
    });
}


    function init() {
        log('init');

        const qualityButton = document.querySelector('.ytp-settings-button');

        if ((qualityButton !== null) && (qualityButton !== undefined)) {
            log('found quality button without watching for mutations, excellent news.');
            selectQuality(qualityButton);

            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (const { addedNodes } of mutations) {
                for (const node of addedNodes) {
                    if (!node.tagName) {
                        continue; // not an element
                    }

                    if (node.classList.contains('ytp-settings-button')) {
                        selectQuality(node);
                        log('found quality button in node, disconnecting observer')
                        observer.disconnect();

                        continue;
                    }

                    const qualityButtons = node.getElementsByClassName('ytp-settings-button');
                    if (qualityButtons[0] === undefined) {
                        continue;
                    }

                    selectQuality(qualityButtons[0]);
                    log('found quality button in children, disconnecting observer');
                    observer.disconnect();
                }
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    }


    init();

    document.body.addEventListener("yt-navigate-finish", function(event) {
        init();
    });
})();