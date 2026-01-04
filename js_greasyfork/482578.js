// ==UserScript==
// @name         F+ Shortcuts
// @namespace    http://tampermonkey.net/
// @version      2023-12-15
// @description  Text edit shortcuts for Forsta+
// @author       You
// @match        https://horizons.confirmit.eu/surveydesigner/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=confirmit.eu
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482578/F%2B%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/482578/F%2B%20Shortcuts.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function insertAtCursor(valueBefore, valueAfter = '') {
        const focusedArea = document.querySelector('textarea:focus');
        if (focusedArea) {
            if (document.selection) {
                document.selection.createRange().text = valueBefore + document.selection.createRange().text + valueAfter;
            } else if (focusedArea.selectionStart || focusedArea.selectionStart == '0') {
                const startPos = focusedArea.selectionStart;
                const endPos = focusedArea.selectionEnd;
                focusedArea.value = focusedArea.value.substring(0, startPos) + valueBefore + focusedArea.value.substring(startPos, endPos) + valueAfter + focusedArea.value.substring(endPos, focusedArea.value.length);
                focusedArea.selectionStart = startPos + valueBefore.length;
                focusedArea.selectionEnd = endPos + valueBefore.length;
            }
        }
    }

    function doc_keyUp(e) {
        (e.ctrlKey && e.altKey && e.key === "b")? insertAtCursor('<b>', '</b>') : null; // Ctrl + Alt + b - bold
        (e.ctrlKey && e.altKey && e.key === "i")? insertAtCursor('<i>', '</i>') : null; // Ctrl + Alt + i - italic
        (e.ctrlKey && e.altKey && e.key === "u")? insertAtCursor('<u>', '</u>') : null; // Ctrl + Alt + u - underline
        (e.ctrlKey && e.altKey && e.key === "e")? insertAtCursor('<br/>') : null; // Ctrl + Alt + e - new line
    }
    document.addEventListener('keyup', doc_keyUp, false);
})();