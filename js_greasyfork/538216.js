// ==UserScript==
// @name         Reliable Fast Simulated Typing on Paste
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Intercept and replace paste behavior with fast simulated typing (works across most sites)
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538216/Reliable%20Fast%20Simulated%20Typing%20on%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/538216/Reliable%20Fast%20Simulated%20Typing%20on%20Paste.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CHUNK_SIZE = 100;

    window.addEventListener('paste', function (e) {
        const target = e.target;

        // Check for editable targets
        const isTextInput = (
            target instanceof HTMLTextAreaElement ||
            (target instanceof HTMLInputElement && target.type === 'text') ||
            target.isContentEditable
        );

        if (!isTextInput) return;

        e.stopImmediatePropagation(); // prevent site handlers
        e.preventDefault(); // cancel native paste

        const text = e.clipboardData.getData('text');
        let index = 0;

        function insertChunk() {
            const chunk = text.slice(index, index + CHUNK_SIZE);

            if (target.isContentEditable) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(chunk));
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const before = target.value.slice(0, start);
                const after = target.value.slice(end);
                target.value = before + chunk + after;
                const cursorPos = start + chunk.length;
                target.setSelectionRange(cursorPos, cursorPos);
            }

            target.dispatchEvent(new Event('input', { bubbles: true }));
            index += CHUNK_SIZE;

            if (index < text.length) {
                requestAnimationFrame(insertChunk);
            }
        }

        target.focus();
        insertChunk();
    }, true); // <-- useCapture = true is critical
})();
