// ==UserScript==
// @name         Zendesk Shortcut Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.93
// @description  Change color of shortcuts in Zendesk based on keywords
// @author       Swiftlyx
// @match        https://askcrew.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505612/Zendesk%20Shortcut%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/505612/Zendesk%20Shortcut%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateShortcutColors() {
        // Find shortcut elements using multiple class options
        let shortcuts = document.querySelectorAll('.sc-1nc17b4-0.gTfRJ, .other-class-if-any');

        // Check if there are elements to process
        if (shortcuts.length === 0) return;

        shortcuts.forEach(function(shortcut) {
            let text = shortcut.textContent.toLowerCase();

            // Change background color of shortcuts based on keywords
            if (text.includes('howly')) {
                shortcut.style.backgroundColor = '#0f72ff';
                shortcut.style.color = 'white';
            } else if (text.includes('expert squad') || text.includes('expertsquad')) {
                shortcut.style.backgroundColor = '#0a6375';
                shortcut.style.color = 'white';
            } else if (text.includes('ask-crew') || text.includes('askcrew')) {
                shortcut.style.backgroundColor = '#3cad5c';
                shortcut.style.color = 'white';
            } else if (text.includes('any experts')) {
                shortcut.style.backgroundColor = '#9eb8a0';
                shortcut.style.color = 'black';
            } else if (text.includes('experts online')) {
                shortcut.style.backgroundColor = '#6a89a7';
                shortcut.style.color = 'white';
            } else {
                // Reset color for shortcuts without matching keywords
                shortcut.style.backgroundColor = '';
                shortcut.style.color = '';
            }
        });
    }

    // Delayed execution and observing DOM changes
    const observer = new MutationObserver(updateShortcutColors);
    observer.observe(document.body, { childList: true, subtree: true });

    // Repeat update for reliability
    setTimeout(updateShortcutColors, 1000);
})();
