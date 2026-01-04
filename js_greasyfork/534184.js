// ==UserScript==
// @name         Hotkey Auto Typer (Ctrl + V version)
// @namespace    http://yourname.greasyfork.net/
// @version      1.3
// @description  Press Ctrl + V to type out a custom sentence at the cursor! 🔥
// @author       YourName
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534184/Hotkey%20Auto%20Typer%20%28Ctrl%20%2B%20V%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534184/Hotkey%20Auto%20Typer%20%28Ctrl%20%2B%20V%20version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Settings ===
    const HOTKEY = { ctrl: true, alt: false, shift: false, key: 'L' };  // Ctrl + L
    const MESSAGE = "Hello, this is my custom sentence!"; // Text to type out

    // === Helper Function ===
    function insertTextAtCursor(text) {
        const active = document.activeElement;
        if (!active) return;

        // Handle textarea, input, or contenteditable
        if (active.isContentEditable) {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(text));

            // Move cursor after inserted text
            range.setStart(range.endContainer, range.endOffset);
            range.setEnd(range.endContainer, range.endOffset);
            selection.removeAllRanges();
            selection.addRange(range);

        } else if (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT') {
            const start = active.selectionStart;
            const end = active.selectionEnd;
            const value = active.value;

            active.value = value.slice(0, start) + text + value.slice(end);
            active.selectionStart = active.selectionEnd = start + text.length;
            active.dispatchEvent(new Event('input', { bubbles: true })); // Important for React/Vue/etc
        }
    }

    // === Listen for Hotkey ===
    window.addEventListener('keydown', (e) => {
        if (
            e.ctrlKey === HOTKEY.ctrl &&
            e.altKey === HOTKEY.alt &&
            e.shiftKey === HOTKEY.shift &&
            e.key.toUpperCase() === HOTKEY.key.toUpperCase()
        ) {
            e.preventDefault(); // stop normal paste if needed
            insertTextAtCursor(MESSAGE);
        }
    });

})();
