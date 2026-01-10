// ==UserScript==
// @name        No Overdues!
// @namespace   Violentmonkey Scripts
// @match       https://www.myedio.com/*
// @license     CC BY-NC
// @grant       none
// @version     1.2
// @author      Unknown Hacker
// @description Being Submitted...
// @downloadURL https://update.greasyfork.org/scripts/521168/No%20Overdues%21.user.js
// @updateURL https://update.greasyfork.org/scripts/521168/No%20Overdues%21.meta.js
// ==/UserScript==

/*
  _   _          ___                    _                   _
 | \ | | ___    / _ \__   _____ _ __ __| |_   _  ___  ___  | |
 |  \| |/ _ \  | | | \ \ / / _ \ '__/ _` | | | |/ _ \/ __| | |
 | |\  | (_) | | |_| |\ V /  __/ | | (_| | |_| |  __/\__ \ |_|
 |_| \_|\___/   \___/  \_/ \___|_|  \__,_|\__,_|\___||___/ (_)
*/

(function() {
    'use strict';

    const CONFIG = {
        enableLogging: true,
        brandColor: '#0267f0',
        targetSelectors: [
            '.c-calendar-list-accordion',
            '.-mediumsmall.-neutral-darkest',
            '.-overdue',
            '.c-tag.-warning.-status-warning'
        ],
        tagSelector: '.c-tag.-neutral-lightest',
        newTagText: '0 OVERDUE'
    };

    function printBrandHeader() {
        if (!CONFIG.enableLogging) return;
        const mainStyle = `background: #1a1a1a; color: ${CONFIG.brandColor}; padding: 4px 10px; border-radius: 4px 0 0 4px; font-weight: bold; border: 1px solid ${CONFIG.brandColor}; border-right: none;`;
        const subStyle = `background: ${CONFIG.brandColor}; color: #fff; padding: 4px 10px; border-radius: 0 4px 4px 0; font-weight: bold; border: 1px solid ${CONFIG.brandColor};`;
        console.log('%cEDIO%cCLEANER ACTIVE', mainStyle, subStyle);
    }

    function cleanDashboardUI() {
        const elementsToRemove = document.querySelectorAll(CONFIG.targetSelectors.join(','));
        elementsToRemove.forEach(el => el.remove());

        const tags = document.querySelectorAll(CONFIG.tagSelector);
        tags.forEach(tag => {
            if (tag.textContent !== CONFIG.newTagText) {
                tag.textContent = CONFIG.newTagText;
            }
        });
    }

    function startUIMonitor() {
        let timeout;
        const observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length > 0)) {
                clearTimeout(timeout);
                timeout = setTimeout(cleanDashboardUI, 20);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    printBrandHeader();
    cleanDashboardUI();
    startUIMonitor();

})();