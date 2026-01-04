// ==UserScript==
// @name         DuckDuckGo Images for Brave search
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Inserts DuckDuckGo images tab into Brave search
// @author       Nobody
// @match        https://search.brave.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brave.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468424/DuckDuckGo%20Images%20for%20Brave%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/468424/DuckDuckGo%20Images%20for%20Brave%20search.meta.js
// ==/UserScript==

(function() {
    function insertDuckImagesMenu() {
        const primaryTabs = document.getElementById('primary-tabs');
        if (!primaryTabs) return;

        // Ensure the tab is not already added
        if (primaryTabs.querySelector('.duckduckgo-images-tab')) return;

        const tabImages = primaryTabs.querySelector('li:nth-child(2)');
        if (!tabImages) return;

        const duckDuckGoImagesTab = tabImages.cloneNode(true);
        const duckDuckGoImagesLink = duckDuckGoImagesTab.querySelector('a');
        if (!duckDuckGoImagesLink) return;

        const href = duckDuckGoImagesLink.getAttribute('href');
        const queryStart = href.indexOf('q=') + 2;
        const searchQuery = href.substring(queryStart);

        const newURL = `https://duckduckgo.com/?q=${searchQuery}&iax=images&ia=images`;
        duckDuckGoImagesLink.setAttribute('href', newURL);
        duckDuckGoImagesLink.setAttribute('target', '_blank');

        const textSpan = duckDuckGoImagesLink.querySelector('span');
        if (textSpan) textSpan.textContent = 'Duck Img';

        duckDuckGoImagesTab.classList.remove('active');
        duckDuckGoImagesTab.classList.add('duckduckgo-images-tab'); // Add a custom class

        primaryTabs.insertBefore(duckDuckGoImagesTab, tabImages.nextSibling);
    }

    function observePrimaryTabs() {
        const primaryTabs = document.getElementById('primary-tabs');
        if (!primaryTabs) return;

        const observer = new MutationObserver(() => {
            insertDuckImagesMenu(); // Re-insert menu on changes
        });

        observer.observe(primaryTabs, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        insertDuckImagesMenu(); // Initial insertion
        observePrimaryTabs();  // Observe changes to re-insert if necessary
    });
})();

