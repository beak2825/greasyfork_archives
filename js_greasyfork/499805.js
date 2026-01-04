// ==UserScript==
// @name         Steam Link Language Checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Check if Steam game supports Chinese and mark the link with 🀄 if it does
// @author       冰雪聪明琪露诺
// @match        https://store.steampowered.com/wishlist*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499805/Steam%20Link%20Language%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/499805/Steam%20Link%20Language%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get appid from Steam URL
    function getAppId(url) {
        const match = url.match(/\/app\/(\d+)/);
        return match ? match[1] : null;
    }

    // Function to check if the game supports Chinese
    async function checkChineseSupport(appId) {
        const apiUrl = `https://store.steampowered.com/api/appdetails/?appids=${appId}&l=schinese`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const appData = data[appId].data;
            if (appData && appData.supported_languages) {
                const supportedLanguages = appData.supported_languages;
                if (supportedLanguages.includes('简体中文') || supportedLanguages.includes('繁体中文')) {
                    return true;
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        return false;
    }

    // Function to process all Steam links on the page
    async function processLinks() {
        const links = document.querySelectorAll('a[href*="store.steampowered.com/app/"]');
        const processedAppIds = new Set();

        for (const link of links) {
            const appId = getAppId(link.href);
            if (appId && !processedAppIds.has(appId)) {
                processedAppIds.add(appId);
                const supportsChinese = await checkChineseSupport(appId);
                if (supportsChinese) {
                    link.insertAdjacentHTML('beforebegin', '🀄 ');
                }
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between API requests
            }
        }
    }

    // Store processed links to avoid duplicate checks
    const processedLinks = new WeakSet();

    // Function to process newly added links
    async function processNewLinks() {
        const links = document.querySelectorAll('a[href*="store.steampowered.com/app/"]');
        for (const link of links) {
            if (!processedLinks.has(link)) {
                processedLinks.add(link);
                const appId = getAppId(link.href);
                if (appId) {
                    const supportsChinese = await checkChineseSupport(appId);
                    if (supportsChinese) {
                        link.insertAdjacentHTML('beforebegin', '🀄 ');
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between API requests
                }
            }
        }
    }

    // Process links when the page is loaded
    window.addEventListener('load', processNewLinks);

    // Observer to watch for new links added to the page
    const observer = new MutationObserver(processNewLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
