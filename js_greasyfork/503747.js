// ==UserScript==
// @name         Move Lines in Textarea with Alt + Arrow Up/Down
// @author       NWP
// @description  Move lines up and down in textarea with Alt + Arrow Up/Down hotkeys, same as in VSCode
// @namespace    https://greasyfork.org/users/877912
// @version      0.2
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503747/Move%20Lines%20in%20Textarea%20with%20Alt%20%2B%20Arrow%20UpDown.user.js
// @updateURL https://update.greasyfork.org/scripts/503747/Move%20Lines%20in%20Textarea%20with%20Alt%20%2B%20Arrow%20UpDown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveLine(element, direction) {
        const start = element.selectionStart;
        const value = element.value;
        const lines = value.split('\n');
        const lineIndex = value.substr(0, start).split('\n').length - 1;
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const cursorOffsetInLine = start - lineStart;

        if ((direction === 'up' && lineIndex === 0) || (direction === 'down' && lineIndex === lines.length - 1)) {
            return;
        }

        const targetLineIndex = direction === 'up' ? lineIndex - 1 : lineIndex + 1;
        [lines[lineIndex], lines[targetLineIndex]] = [lines[targetLineIndex], lines[lineIndex]];

        const newValue = lines.join('\n');
        const newLineStart = newValue.split('\n').slice(0, targetLineIndex).join('\n').length + (targetLineIndex > 0 ? 1 : 0);
        const newCursorPosition = newLineStart + cursorOffsetInLine;

        element.value = newValue;
        element.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    function handleKeyDown(e) {
        if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.tagName === 'TEXTAREA') {
                e.preventDefault();
                const direction = e.key === 'ArrowUp' ? 'up' : 'down';
                moveLine(activeElement, direction);
            }
        }
    }

    function observeTextAreas() {
        document.addEventListener('keydown', handleKeyDown);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'TEXTAREA' || (node.nodeType === Node.ELEMENT_NODE && node.querySelector('textarea'))) {
                        document.addEventListener('keydown', handleKeyDown);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeTextAreas();
})();