// ==UserScript==
// @name         Google & YouTube - Universal Exact Search Hotkey
// @namespace    GYESH
// @version      6.0
// @description  Surround selected text with quotation marks using NumpadAdd key
// @match        *://*/*
// @exclude      https://www.google.ca/maps/*
// @run-at       document-start
// @grant        none
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL https://update.greasyfork.org/scripts/12253/Google%20%20YouTube%20-%20Universal%20Exact%20Search%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/12253/Google%20%20YouTube%20-%20Universal%20Exact%20Search%20Hotkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function surroundWithQuotes(element) {
        if (element.isContentEditable) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            if (selectedText) {
                const quotedText = `"${selectedText}"`;
                range.deleteContents();
                range.insertNode(document.createTextNode(quotedText));
                range.setStart(range.startContainer, range.startOffset + 1);
                range.setEnd(range.endContainer, range.endOffset - 1);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } else {
            const start = element.selectionStart;
            const end = element.selectionEnd;
            const selectedText = element.value.substring(start, end);
            if (selectedText) {
                const quotedText = `"${selectedText}"`;
                element.value = element.value.substring(0, start) + quotedText + element.value.substring(end);
                element.selectionStart = start + 1;
                element.selectionEnd = start + quotedText.length - 1;
            }
        }
    }

    function handleKeyPress(event) {
        if ((event.key === '+' && event.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) || 
            (event.key === 'Add' && event.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD)) {
            let activeElement = document.activeElement;
            
            // Special handling for Google search
            if (window.location.hostname.includes('google.com')) {
                activeElement = document.querySelector('input[name="q"]') || activeElement;
            }

            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable) {
                surroundWithQuotes(activeElement);
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    function initScript() {
        document.addEventListener('keydown', handleKeyPress, true);
        
        // Mutation observer to handle dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.isContentEditable) {
                                node.addEventListener('keydown', handleKeyPress, true);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();