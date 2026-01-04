// ==UserScript==
// @name         Expert Portal Shortcut Highlighter
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Change color of shortcuts in Expert Portal based on keywords
// @author       Swiftlyx
// @match        https://expert-portal.com/workspace*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540044/Expert%20Portal%20Shortcut%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/540044/Expert%20Portal%20Shortcut%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateShortcutColors() {
        let shortcuts = document.querySelectorAll('li[id^="shortcut-list-item-"]');
        if (shortcuts.length === 0) return;

        shortcuts.forEach(function(shortcut) {
            const titleElement = shortcut.querySelector('h6');
            let text = shortcut.textContent.toLowerCase();

            if (text.includes('howly')) {
                shortcut.style.backgroundColor = '#0f72ff';
                shortcut.style.color = 'white';
                if (titleElement) {
                    titleElement.style.color = 'white';
                }
            } else if (text.includes('expert squad') || text.includes('expertsquad')) {
                shortcut.style.backgroundColor = '#0a6375';
                shortcut.style.color = 'white';
                if (titleElement) {
                    titleElement.style.color = 'white';
                }
            } else if (text.includes('ask-crew') || text.includes('askcrew')) {
                shortcut.style.backgroundColor = '#3cad5c';
                shortcut.style.color = 'white';
                if (titleElement) {
                    titleElement.style.color = 'white';
                }
            } else if (text.includes('any experts')) {
                shortcut.style.backgroundColor = '#9eb8a0';
                shortcut.style.color = 'black';
                if (titleElement) {
                    titleElement.style.color = 'black';
                }
            } else if (text.includes('experts online')) {
                shortcut.style.backgroundColor = '#6a89a7';
                shortcut.style.color = 'white';
                if (titleElement) {
                    titleElement.style.color = 'white';
                }
            } else {
                shortcut.style.backgroundColor = '';
                shortcut.style.color = '';
                if (titleElement) {
                    titleElement.style.color = '';
                }
            }
        });
    }

    const observer = new MutationObserver(updateShortcutColors);
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(updateShortcutColors, 1000);
})();
