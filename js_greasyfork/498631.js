// ==UserScript==
// @name         Wowhead Tooltips on Reddit
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  Show Wowhead tooltips on valid Reddit Wowhead links
// @author       Nighthawk42
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498631/Wowhead%20Tooltips%20on%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/498631/Wowhead%20Tooltips%20on%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add Wowhead script
    function addWowheadScript() {
        let script = document.createElement('script');
        script.src = 'https://wow.zamimg.com/widgets/power.js';
        script.async = true;
        document.head.appendChild(script);
    }

    // Add Wowhead script to the page
    addWowheadScript();

    // Function to process links and add wowhead-tooltip class
    function processWowheadLinks() {
        let links = document.querySelectorAll('a[href*="wowhead.com"]');
        links.forEach(link => {
            let href = link.href;
            link.setAttribute('data-wowhead', href);
            link.setAttribute('rel', 'external');

            // Determine the version from the URL and add corresponding attributes or classes
            if (href.includes('/beta/')) {
                link.classList.add('wowhead-beta');
            } else if (href.includes('/ptr-2/')) {
                link.classList.add('wowhead-ptr-2');
            } else if (href.includes('/ptr/')) {
                link.classList.add('wowhead-ptr');
            } else if (href.includes('/classic/')) {
                link.classList.add('wowhead-classic');
            } else if (href.includes('/cata/')) {
                link.classList.add('wowhead-cata');
            } else {
                link.classList.add('wowhead-live');
            }
        });
    }

    // Process links on page load
    processWowheadLinks();

    // Listen for new links being added to the page (e.g., infinite scrolling)
    new MutationObserver(processWowheadLinks).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
