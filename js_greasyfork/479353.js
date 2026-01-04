// ==UserScript==
// @name         Hide Reddit Sidebar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the Reddit sidebar.
// @author       Joe
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479353/Hide%20Reddit%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/479353/Hide%20Reddit%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the sidebar
    function hideSidebar() {
        const sidebar = document.querySelector('.side');
        if (sidebar) {
            sidebar.style.display = 'none';
        }
    }

    // Call the function when the page loads
    window.addEventListener('load', hideSidebar);
})();
