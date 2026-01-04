// ==UserScript==
// @name         在新标签页打开帖子链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically open post links in new tabs on Linux.do forums
// @author       You
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493584/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/493584/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to open links in new tabs
    function openInNewTab(e) {
        // Check if the target is a link and has the specific class
        if (e.target.tagName === 'A' && e.target.classList.contains('raw-topic-link')) {
            e.preventDefault(); // Stop the link from opening in the same tab
            window.open(e.target.href, '_blank'); // Open the link in a new tab
        }
    }

    // Add event listener to the document
    document.addEventListener('click', openInNewTab, true);
})();