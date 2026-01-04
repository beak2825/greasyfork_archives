// ==UserScript==
// @name         Bangumi排行榜隐藏已收藏条目
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  排行榜隐藏已收藏条目
// @author       KunimiSaya
// @match        https://bgm.tv/*/browser*
// @match        https://bangumi.tv/*/browser*
// @match        https://chii.in/*/browser*
// @match        https://bgm.tv/index/*
// @match        https://chii.in/index/*
// @match        https://bangumi.tv/index/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505224/Bangumi%E6%8E%92%E8%A1%8C%E6%A6%9C%E9%9A%90%E8%97%8F%E5%B7%B2%E6%94%B6%E8%97%8F%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/505224/Bangumi%E6%8E%92%E8%A1%8C%E6%A6%9C%E9%9A%90%E8%97%8F%E5%B7%B2%E6%94%B6%E8%97%8F%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = true; // Flag to track whether hiding is enabled or disabled

    // Function to hide collected items
    function hideCollectedItems() {
        if (!isEnabled) return; // Do nothing if the script is disabled

        let items = document.querySelectorAll('.item');

        items.forEach(function(item) {
            if (item.querySelector('.collectModify')) {
                item.style.display = 'none';
            }
        });
    }

    // Function to show collected items (when the feature is disabled)
    function showCollectedItems() {
        let items = document.querySelectorAll('.item');

        items.forEach(function(item) {
            if (item.querySelector('.collectModify')) {
                item.style.display = ''; // Reset display style
            }
        });
    }

    // Function to toggle hiding
    function toggleHiding() {
        isEnabled = !isEnabled;

        if (isEnabled) {
            hideCollectedItems();
        } else {
            showCollectedItems();
        }
    }

    // Initial hiding of collected items
    hideCollectedItems();

    // Observe the page for any new nodes being added
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                hideCollectedItems();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add the toggle button
    const browserTools = document.querySelector('#browserTools');
    if (browserTools) {
        const toggleButton = document.createElement('a');
        toggleButton.className = 'chiiBtn';
        toggleButton.href = 'javascript:void(0);';
        toggleButton.innerText = '显示/隐藏已收藏作品';
        toggleButton.onclick = toggleHiding;

        // Insert the toggle button before the sorting options
        browserTools.insertBefore(toggleButton, browserTools.firstChild);
    }
})();