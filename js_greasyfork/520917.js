// ==UserScript==
// @name:ko           유튜브 쇼츠 차단
// @name              YouTube Shorts Blocker

// @description:ko    쇼츠를 차단 및 Shorts URL을 YouTube.com으로 리다이렉트 합니다.
// @description       Hide YouTube Shorts from search results and redirect Shorts URLs

// @namespace         https://ndaesik.tistory.com/
// @version           1.5
// @author            ndaesik
// @match             https://m.youtube.com/*
// @match             https://www.youtube.com/*
// @icon              https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Youtube_shorts_icon.svg/193px-Youtube_shorts_icon.svg.png
// @downloadURL https://update.greasyfork.org/scripts/520917/YouTube%20Shorts%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/520917/YouTube%20Shorts%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide Shorts in search results and mobile results
    function hideShortsInSearch() {
        // Desktop search results
        const items = document.querySelectorAll('ytd-video-renderer');
        items.forEach(item => {
            const link = item.querySelector('ytd-thumbnail > a');
            if (link && link.href.includes('/shorts/')) {
                item.style.display = 'none';
            }
        });

        // Mobile search results
        const mobileItems = document.querySelectorAll('[href*="/shorts/"]');
        mobileItems.forEach(item => {
            const contextRenderer = item.closest('ytm-video-with-context-renderer');
            if (contextRenderer) {
                contextRenderer.style.display = 'none';
            }
        });
    }

    // Hide existing Shorts sections
    function hideShortsSection() {
        const selectors = [
            '[tab-title="Shorts"]', // desktop nav
            'ytd-rich-section-renderer', // desktop main page feed
            'grid-shelf-view-model', // search results feed
            'ytd-reel-shelf-renderer', // desktop suggest
            '#items ytd-guide-entry-renderer:nth-child(2)', // desktop channel tab
            'ytm-pivot-bar-item-renderer:nth-child(2)', // mobile nav bar
            'ytm-rich-section-renderer', // mobile main page feed
        ];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        });
    }

    // Redirect Shorts URLs to main video player
    function redirectShorts() {
        if (window.location.href.includes('youtube.com/shorts/')) {
            window.location.href = window.location.href.replace('/shorts/', '/watch?v=');
        }
    }

    // Create and run MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                hideShortsInSearch();
                hideShortsSection();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    hideShortsInSearch();
    hideShortsSection();
    redirectShorts();
})();