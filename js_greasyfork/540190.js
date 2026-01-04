// ==UserScript==
// @name         YouTube Shorts Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides all Shorts sections from YouTube (homepage, sidebar, etc.)
// @author       Syntax-Surfer-1
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540190/YouTube%20Shorts%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/540190/YouTube%20Shorts%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeShorts = () => {
        // Remove "Shorts" shelf from homepage
        document.querySelectorAll('ytd-rich-shelf-renderer').forEach(el => {
            if (el.innerText.includes('Shorts')) el.remove();
        });

        // Remove "Shorts" link from sidebar
        document.querySelectorAll('ytd-guide-entry-renderer').forEach(el => {
            if (el.innerText.includes('Shorts')) el.style.display = 'none';
        });
    };

    // Initial cleanup
    removeShorts();

    // Watch for dynamic changes
    const observer = new MutationObserver(removeShorts);
    observer.observe(document.body, { childList: true, subtree: true });
})();
