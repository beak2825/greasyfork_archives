// ==UserScript==
// @namespace         https://greasyfork.org/zh-CN/users/106222-qxin-i
// @name              HyperWriteAI Right-Click Fix
// @author            kweenash
// @description       Enables right-click functionality to open links in a new tab on HyperWriteAI Personal Assistant.
// @version           1.2
// @license           MIT
// @match              https://app.hyperwriteai.com/personalassistant
// @grant              GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/514394/HyperWriteAI%20Right-Click%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/514394/HyperWriteAI%20Right-Click%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to override right-click restrictions
    GM_addStyle(`
        body {
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
            user-select: auto !important;
        }
        a {
            cursor: pointer !important;
        }
    `);

    // Override right-click restrictions
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        // Get the link element
        const linkElement = e.target.closest('a');
        if (!linkElement) return;
        // Get the link URL
        const linkUrl = linkElement.href;
        // Open the link in a new tab
        chrome.tabs.create({ url: linkUrl, active: true });
    });
})();