// ==UserScript==
// @name         Super Rank Unlock Bypass for Bloxd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unlock Super Rank and hide ads on Bloxd.io
// @author       SkyYT
// @license      All Rights Reserved
// @match        *://bloxd.io/*
// @match        *://staging.bloxd.io/*
// @match        https://www.crazygames.com/game/bloxdhop-io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531105/Super%20Rank%20Unlock%20Bypass%20for%20Bloxd.user.js
// @updateURL https://update.greasyfork.org/scripts/531105/Super%20Rank%20Unlock%20Bypass%20for%20Bloxd.meta.js
// ==/UserScript==

/* 
All Rights Reserved

Copyright (c) 2025 SkyYT

This script is proprietary. No modifications, distributions, or reproductions of this script are allowed without explicit permission from the author.

*/

(function() {
    'use strict';

    // Function to change classes of certain elements
    function updateClasses() {
        const disabledElements = document.querySelectorAll('.CharCustomPartWrapper.DisabledCharCustomPartWrapper');
        const iconElements = document.querySelectorAll('.fa-solid.fa-x.SmallTextBold');

        disabledElements.forEach((el) => {
            el.classList.remove('DisabledCharCustomPartWrapper');
            el.classList.add('EnabledCharCustomPartWrapper');
        });

        iconElements.forEach((el) => {
            el.classList.remove('fa-x');
            el.classList.add('fa-check');
        });
    }

    // Function to change text content of specific elements
    function updateTextContent() {
        const allElements = document.querySelectorAll('*');

        allElements.forEach((el) => {
            if (el.children.length === 0 && el.textContent) {
                if (el.textContent.includes("Get Super Rank")) {
                    el.textContent = el.textContent.replace(/Get Super Rank/g, "Super Rank");
                }
                if (el.textContent.includes("Get it Now")) {
                    el.textContent = el.textContent.replace(/Get it Now/g, "Do Login");
                }
            }
        });
    }

    // Function to hide advertisements
    function hideAdvertisements() {
        const adSelectors = [
            '.ad-banner',
            '.advertisement',
            '.ad-container',
            '.popup-ad',
            '.adsbygoogle',
            'iframe[src*="ads"]'
        ];

        adSelectors.forEach(selector => {
            const adElements = document.querySelectorAll(selector);
            adElements.forEach((el) => {
                el.style.visibility = 'hidden';
                el.style.position = 'absolute';
                el.style.width = '0';
                el.style.height = '0';
            });
        });
    }

    // Execute functions on page load
    window.addEventListener('DOMContentLoaded', () => {
        updateClasses();
        updateTextContent();
        hideAdvertisements();
    });

    // Observe changes to the document body and rerun functions if necessary
    const mutationObserver = new MutationObserver(() => {
        updateClasses();
        updateTextContent();
        hideAdvertisements();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
})();
