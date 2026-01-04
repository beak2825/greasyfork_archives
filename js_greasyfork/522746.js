// ==UserScript==
// @name         YouTube Culture Link Detector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds Kagi search link when *Culture channel links are found
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license      CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/522746/YouTube%20Culture%20Link%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/522746/YouTube%20Culture%20Link%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkForCultureLink = () => {
        const links = document.getElementsByTagName('a');
        const culturePattern = /https:\/\/www\.youtube\.com\/@[^\/]+culture/i;
        let foundCulture = false;

        for (let link of links) {
            if (culturePattern.test(link.href)) {
                foundCulture = true;
                break;
            }
        }

        if (foundCulture) {
            const titleElement = document.querySelector('h1.style-scope.ytd-watch-metadata');
            const title = titleElement?.textContent.trim() || '';
            if (title && !document.getElementById('kagi-search-link')) {
                const encodedTitle = encodeURIComponent(`inurl:"culture.com" intitle:"${title}"`);
                const kagiUrl = `https://kagi.com/search?q=${encodedTitle}`;

                const kagiLink = document.createElement('a');
                kagiLink.href = kagiUrl;
                kagiLink.id = 'kagi-search-link';
                kagiLink.textContent = 'Search Culture on Kagi';
                kagiLink.target = '_blank';

                const titleStyle = window.getComputedStyle(titleElement);
                const titleFontSize = parseInt(titleStyle.fontSize);
                const linkFontSize = titleFontSize - 4;
                kagiLink.style.cssText = `background: #f0f0f0; padding: 8px; border-radius: 4px; margin-left: 12px; display: inline-block; text-decoration: none; color: black; font-size: ${linkFontSize}px;`;

                if (titleElement) {
                    titleElement.appendChild(kagiLink);
                }
            }
        }
    };

    const observer = new MutationObserver((mutations) => {
        checkForCultureLink();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    checkForCultureLink();
})();