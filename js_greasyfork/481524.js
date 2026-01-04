// ==UserScript==
// @name         Text Highlighter and Saver
// @namespace    http://tampermonkey.net/
// @author       Zabkas
// @version      1.0
// @description  Highlight selected text and save highlights to local storage
// @include      *://*/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/481524/Text%20Highlighter%20and%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/481524/Text%20Highlighter%20and%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the current URL's unique key for local storage
    function getStorageKey() {
        return 'highlighted-text-' + window.location.href;
    }

    // Function to load highlights from local storage
    function loadHighlights() {
        const storedHighlights = localStorage.getItem(getStorageKey());
        if (storedHighlights) {
            const highlights = JSON.parse(storedHighlights);
            highlights.forEach(highlight => {
                const range = new Range();
                const startNode = document.querySelector(highlight.startSelector);
                const endNode = document.querySelector(highlight.endSelector);
                if (startNode && endNode) {
                    range.setStart(startNode, highlight.startOffset);
                    range.setEnd(endNode, highlight.endOffset);
                    applyHighlight(range);
                }
            });
        }
    }

    // Function to apply highlight
    function applyHighlight(range) {
        const newNode = document.createElement('span');
        newNode.style.backgroundColor = 'yellow';
        range.surroundContents(newNode);
    }

    // Function to save highlights to local storage
    function saveHighlight(range) {
        const highlights = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        highlights.push({
            startSelector: getUniqueSelector(range.startContainer),
            startOffset: range.startOffset,
            endSelector: getUniqueSelector(range.endContainer),
            endOffset: range.endOffset
        });
        localStorage.setItem(getStorageKey(), JSON.stringify(highlights));
    }

    // Function to get a unique CSS selector for an element
    function getUniqueSelector(element) {
        if (element.id) {
            return '#' + element.id;
        } else {
            return element.nodeName.toLowerCase();
        }
    }

    // Event listener for mouseup to detect text selection
    document.addEventListener('mouseup', function(event) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            applyHighlight(range);
            saveHighlight(range);
        }
    });

    // Load stored highlights on page load
    loadHighlights();
})();
