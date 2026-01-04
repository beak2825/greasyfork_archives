// ==UserScript==
// @name         打码文字
// @version      0.1.2
// @description  按住Alt，选中文字，然后模糊
// @author       People11
// @match        *://*/*
// @namespace https://greasyfork.org/users/1143233
// @downloadURL https://update.greasyfork.org/scripts/478875/%E6%89%93%E7%A0%81%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/478875/%E6%89%93%E7%A0%81%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = {
        filter: 'blur(9px)',
        userSelect: 'none'
    };

    function wrapTextWithSpan(textNode, start, end, style) {
        const span = document.createElement('span');
        Object.assign(span.style, style);

        const range = document.createRange();
        range.setStart(textNode, start);
        range.setEnd(textNode, end);
        range.surroundContents(span);
    }

    function processNode(node, style) {
        if (node.nodeType === Node.TEXT_NODE && window.getSelection().containsNode(node, true)) {
            wrapTextWithSpan(node, 0, node.nodeValue.length, style);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(childNode => {
                if (window.getSelection().containsNode(childNode, true)) {
                    processNode(childNode, style);
                }
            });
        }
    }

    document.onmouseup = (event) => {
        if (event.altKey) {
            const selection = window.getSelection();
            if (!selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const commonAncestorContainer = range.commonAncestorContainer;

                if (commonAncestorContainer.nodeType === Node.TEXT_NODE) {
                    wrapTextWithSpan(commonAncestorContainer, range.startOffset, range.endOffset, style);
                } else if (commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
                    Array.from(commonAncestorContainer.childNodes).forEach(childNode => {
                        processNode(childNode, style);
                    });
                }

                selection.removeAllRanges();
            }
        }
    };
})();
