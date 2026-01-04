// ==UserScript==
// @name         VS Code Shortcuts
// @namespace    http://tampermonkey.com
// @version      1
// @description  Helper functions for coding on VS Code in the browser (vscode.dev)
// @match        https://*.vscode.dev/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463372/VS%20Code%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/463372/VS%20Code%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a shortcut to open the command palette
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'P') {
            document.querySelector('.command-palette').click();
        }
    });

    // Add a shortcut to toggle the sidebar
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'B') {
            document.querySelector('.activitybar .toggle-more').click();
        }
    });

    // Add a shortcut to toggle the terminal
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === '`') {
            document.querySelector('.panel-switcher .terminal').click();
        }
    });

    // Add a shortcut to toggle the output panel
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === 'O') {
            document.querySelector('.panel-switcher .output').click();
        }
    });

    // Add a shortcut to toggle the problems panel
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === 'P') {
            document.querySelector('.panel-switcher .problems').click();
        }
    });

    // Add a shortcut to toggle the search panel
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'F') {
            document.querySelector('.panel-switcher .search').click();
        }
    });

})();
