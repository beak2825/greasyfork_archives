// ==UserScript==
// @name         Open link in new tab in GitHub
// @name:zh-CN   在新标签页中打开链接[Github]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Ensures all <a> tags on GitHub Pages open in a new tab
// @description:zh-CN  确保 GitHub Pages 上的所有 <a> 标签在新标签页中打开
// @author       wxupjack
// @match        *://*.githubpages.com/*
// @match        *://*.github.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/542322/Open%20link%20in%20new%20tab%20in%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/542322/Open%20link%20in%20new%20tab%20in%20GitHub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function updateLinks() {
        // Select all <a> tags
        const links = document.querySelectorAll('a');
        //console.log('all modified <a> tags:', links);

        links.forEach(link => {
            link.setAttribute('target', '_blank');
        });
    }

    // Run after the page is loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        updateLinks();
    } else {
        window.addEventListener('DOMContentLoaded', updateLinks);
    }

    // Optional: Also update links if DOM is dynamically changed (for SPAs or AJAX navigation)
    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, { childList: true, subtree: true });

})();

// LLM prompt
// Create a Tampermonkey script for me:
// Domain: All GitHub Pages
// Goal: Add `target="_blank"` to all `<a>` tags on the page
// 1. Get the source code after the page loads
// 2. Find all <a> tags
// 3. Add/modify the target to _blank