// ==UserScript==
// @license MIT
// @name         Medium to Freedium Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects Medium membership articles to freedium.cfd
// @author       You
// @match        *://*.medium.com/*
// @match        *://*.towardsdatascience.com/*
// @match        *://*.betterprogramming.pub/*
// @match        *://*.blog.blockmagnates.com/*
// @match        *://*.levelup.gitconnected.com/*
// @match        *://*.uxdesign.cc/*
// @match        *://*.betterhumans.pub/*
// @match        *://*.baos.pub/*
// @match        *://*.blog.devgenius.io/*
// @match        *://*.bootcamp.uxdesign.cc/*
// @match        *://*.entrepreneurshandbook.co/*
// @match        *://*.blog.usejournal.com/*
// @match        *://*.writingcooperative.com/*
// @match        *://*.blog.prototypr.io/*
// @match        *://*.blog.bitsrc.io/*
// @match        *://*.thebolditalic.com/*
// @match        *://*.aninjusticemag.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529326/Medium%20to%20Freedium%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/529326/Medium%20to%20Freedium%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the page is showing a membership wall
    function isMembershipRequired() {
        // Check for membership wall element or if article is truncated
        if (document.querySelector('.meteredContent')) return true;
        if (document.querySelector('.overlay-message')) return true;
        if (document.querySelector('#paywall-upsell-button-upgrade')) return true;

        // Wait for content to load and check if article is truncated
        setTimeout(function() {
            if (document.querySelector('.meteredContent')) {
                redirectToFreedium();
            }
            if (document.querySelector('.overlay-message')) {
                redirectToFreedium();
            }
        }, 1500);

        return false;
    }

    // Function to redirect to freedium
    function redirectToFreedium() {
        const currentUrl = window.location.href;
        // Check if the URL is already a freedium URL
        if (!currentUrl.includes('freedium.cfd')) {
            const freediumUrl = 'https://freedium.cfd/' + currentUrl;
            window.location.href = freediumUrl;
        }
    }

    // Initial check on page load
    window.addEventListener('load', function() {
        if (isMembershipRequired()) {
            redirectToFreedium();
        }
    });

    // Track DOM changes to detect when a paywall might appear
    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                if (isMembershipRequired()) {
                    redirectToFreedium();
                    break;
                }
            }
        }
    });

    // Start observing the document after it's fully loaded
    window.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();