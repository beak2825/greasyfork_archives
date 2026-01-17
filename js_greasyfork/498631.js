// ==UserScript==
// @name         Wowhead Tooltips on Reddit (Optimized)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Show Wowhead tooltips on Reddit with support for icons and dynamic loading.
// @author       Nighthawk42 & Gemini
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498631/Wowhead%20Tooltips%20on%20Reddit%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498631/Wowhead%20Tooltips%20on%20Reddit%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Configure Wowhead Tooltips
    // Customize these: iconizeLinks (shows item icons), colorLinks (rarity colors)
    window.whTooltips = {
        colorLinks: true,
        iconizeLinks: true,
        renameLinks: false,
        iconSize: 'small'
    };

    // 2. Inject Wowhead Power Script
    function initWowhead() {
        if (document.getElementById('wowhead-power-script')) return;
        const script = document.createElement('script');
        script.id = 'wowhead-power-script';
        script.src = 'https://wow.zamimg.com/widgets/power.js';
        script.async = true;
        document.head.appendChild(script);
    }

    // 3. Process Links
    function processWowheadLinks() {
        const links = document.querySelectorAll('a[href*="wowhead.com"]:not([data-wh-processed])');

        if (links.length === 0) return;

        links.forEach(link => {
            const href = link.href;
            link.setAttribute('data-wh-processed', 'true');

            // Map subdomains/paths to Wowhead versions
            if (href.includes('/beta/')) link.classList.add('wowhead-beta');
            else if (href.includes('/ptr/')) link.classList.add('wowhead-ptr');
            else if (href.includes('/classic/')) link.classList.add('wowhead-classic');
            else if (href.includes('/cata/')) link.classList.add('wowhead-cata');
            else if (href.includes('/tbc/')) link.classList.add('wowhead-tbc');
            else if (href.includes('/wotlk/')) link.classList.add('wowhead-wotlk');
            else link.classList.add('wowhead-live');

            // Force data-wowhead attribute to ensure the tooltip engine sees it
            link.setAttribute('data-wowhead', href);
        });

        // Tell Wowhead to scan the page for the new links we just labeled
        if (window.$WowheadPower) {
            window.$WowheadPower.refreshLinks();
        }
    }

    // 4. Execution Logic
    initWowhead();
    processWowheadLinks();

    // 5. Optimized Observer (Debounced)
    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processWowheadLinks, 500); // Wait for scrolling/loading to pause
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();