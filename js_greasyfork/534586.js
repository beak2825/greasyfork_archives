// ==UserScript==
// @name         Wikipedia Tweak
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide all "Edit Source", "History" buttons, and toggle buttons on Wikipedia
// @author       Raffe Yang
// @icon         https://cdn1.iconfinder.com/data/icons/metro-ui-dock-icon-set--icons-by-dakirby/512/Wikipedia_alt.png

// @match        https://zh.wikipedia.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534586/Wikipedia%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/534586/Wikipedia%20Tweak.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load completely
    window.addEventListener('load', function() {
        // Hide all "Edit Source" buttons (including <span class="mw-editsection-bracket"> and elements with display: none)
        const editSourceElements = document.querySelectorAll('.mw-editsection a, .mw-editsection .mw-editsection-bracket');
        editSourceElements.forEach(element => {
            element.style.display = 'none';
        });

        // Hide all "Hide" buttons
        const hideButtons = document.querySelectorAll('button.vector-pinnable-header-toggle-button');
        hideButtons.forEach(button => {
            button.style.display = 'none';
        });

        // Hide the "Edit Source" link in the menu
        const editSourceMenuItem = document.querySelector('#ca-edit');
        if (editSourceMenuItem) {
            editSourceMenuItem.style.display = 'none';
        }

        // Hide the entire page toolbar container
        const pageToolbar = document.querySelector('.vector-page-toolbar');
        if (pageToolbar) {
            pageToolbar.style.display = 'none';
        }
    });
})();

