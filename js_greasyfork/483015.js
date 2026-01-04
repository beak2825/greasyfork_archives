// ==UserScript==
// @name         Jira: Toggle right sidebar in tickets via keyboard shortcut
// @namespace    https://greasyfork.org/users/1238704
// @version      0.1.4
// @description  Hide/show the right sidebar with ticket details to maximize the content width. Toggle via keyboard "]".
// @author       Matthias Hagmann
// @match        *://jira.*/browse/*
// @match        https://*.atlassian.net/browse/*
// @match        https://*.atlassian.net/jira/*
// @match        https://*.atlassian.com/browse/*
// @match        https://*.atlassian.com/jira/*
// @grant        none
// @license      MIT
// @homepage     https://greasyfork.org/scripts/483015
// @downloadURL https://update.greasyfork.org/scripts/483015/Jira%3A%20Toggle%20right%20sidebar%20in%20tickets%20via%20keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/483015/Jira%3A%20Toggle%20right%20sidebar%20in%20tickets%20via%20keyboard%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function toggleSidebar() {
        // new
        const sidebarTestId = 'issue.views.issue-details.issue-layout.container-right';
        const sidebarElement = document.querySelector(`[data-testid="${sidebarTestId}"]`);
        if (sidebarElement) {
            sidebarElement.style.display = (sidebarElement.style.display === 'none') ? '' : 'none';
        }

        // old
        const sidebar = document.querySelector('#viewissuesidebar');
        if (sidebar) {
            sidebar.style.display = (sidebar.style.display === 'none') ? '' : 'none';
        }
    }

    // Add a keyboard shortcut "]" to toggle the sidebar
    document.addEventListener('keydown', function(event) {
        if (event.key === ']') {
            toggleSidebar();
        }
    });

})();