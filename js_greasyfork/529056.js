// ==UserScript==
// @name         Advanced Adblocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A comprehensive adblocker script for Tampermonkey
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529056/Advanced%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/529056/Advanced%20Adblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userPreferences = JSON.parse(localStorage.getItem("adblockerPreferences")) || {
        blockPopups: true,
        blockNativeAds: true,
        blockIframeAds: true,
        blockScriptAds: true,
        blockSponsoredContent: true,
        blockAntiAdBlock: true
    };

    function hideAndRemove(element) {
        if (element) {
            element.style.display = "none";
            element.remove();
        }
    }

    function blockAds() {
        const adSelectors = [
            '.adsbygoogle',
            '.ad-container',
            '.banner-ad',
            '#ad',
            '[id^="ad_"]',
            '[class*="ad"]',
            '[src*="ads"]',
            '.sponsored',
            '.google-auto-placed',
            '.advertisement',
            '#advertisement',
            'div[data-ad]',
            '.popup-ad',
            '.native-ad',
            'iframe[src*="doubleclick"]',
            '.social-widget',
            '.ad-overlay',
            '[src*="ads"]',
            '[src*="doubleclick"]',
            '.google-ads',
            '#ad-banner'
        ];

        adSelectors.forEach(function(selector) {
            document.querySelectorAll(selector).forEach(hideAndRemove);
        });

        if (userPreferences.blockScriptAds) {
            document.querySelectorAll('script').forEach(function(script) {
                if (script.src && script.src.includes('ads')) {
                    hideAndRemove(script);
                } else if (script.innerHTML && script.innerHTML.includes('ads')) {
                    hideAndRemove(script);
                }
            });
        }

        if (userPreferences.blockPopups) {
            document.querySelectorAll('.popup-ad, .ad-overlay').forEach(hideAndRemove);
        }

        if (userPreferences.blockNativeAds) {
            document.querySelectorAll('.native-ad, .sponsored-post').forEach(hideAndRemove);
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                blockAds();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function checkForAntiAdblock() {
        if (userPreferences.blockAntiAdBlock) {
            const antiAdblockBanner = document.querySelector('.anti-adblock-banner');
            if (antiAdblockBanner) {
                console.log("Anti-Adblock detected. Disabling adblock for this site.");
                blockAds();
            }
        }
    }

    setInterval(function() {
        blockAds();
        checkForAntiAdblock();
    }, 2000);

    blockAds();
    checkForAntiAdblock();

})();
