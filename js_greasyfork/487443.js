// ==UserScript==
// @name         javDB Selection Tools
// @namespace    -
// @icon         https://avatars.githubusercontent.com/u/81081327?v=4
// @version      2.0
// @description  Double-click + right-click hyphenated word select on javDB.com/*
// @author       colemeg
// @match        https://javdb.com/*
// @grant        none
// @license      Do What The Fuck You Want To Public License (WTFPL)
// @downloadURL https://update.greasyfork.org/scripts/487443/javDB%20Selection%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/487443/javDB%20Selection%20Tools.meta.js
// ==/UserScript==
//
//
//            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
//                    Version 2, December 2004
//
// Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
//
// Everyone is permitted to copy and distribute verbatim or modified
// copies of this license document, and changing it is allowed as long
// as the name is changed.
//
//            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
//   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
//
//  0. You just DO WHAT THE FUCK YOU WANT TO.
//
//
(function () {
    // Reusable caret range from point
    function getTextNodeRangeFromPoint(x, y) {
        if (document.caretRangeFromPoint) return document.caretRangeFromPoint(x, y);
        if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(x, y);
            const r = document.createRange();
            r.setStart(pos.offsetNode, pos.offset);
            return r;
        }
        return null;
    }

    // 1. Double-click hyphenated word selector
    document.addEventListener('dblclick', function (e) {
        const range = getTextNodeRangeFromPoint(e.clientX, e.clientY);
        if (!range) return;

        const node = range.startContainer;
        if (node.nodeType !== Node.TEXT_NODE) return;

        const text = node.textContent;
        const offset = range.startOffset;
        const regex = /\b[\w]+-[\w]+\b/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (offset >= match.index && offset <= match.index + match[0].length) {
                const sel = window.getSelection();
                const wordRange = document.createRange();
                wordRange.setStart(node, match.index);
                wordRange.setEnd(node, match.index + match[0].length);
                sel.removeAllRanges();
                sel.addRange(wordRange);
                break;
            }
        }
    });

    // 2. Right-click to select hyphenated word (if it's the only one in text)
    document.addEventListener('contextmenu', function (e) {
        const range = getTextNodeRangeFromPoint(e.clientX, e.clientY);
        if (!range) return;

        const node = range.startContainer;
        if (node.nodeType !== Node.TEXT_NODE) return;

        const text = node.textContent;
        const offset = range.startOffset;
        const matches = [...text.matchAll(/\b[\w]+-[\w]+\b/g)];

        // Only act if there's exactly one hyphenated word
        if (matches.length !== 1) return;

        const match = matches[0];
        if (offset < match.index || offset > match.index + match[0].length) return;

        // Select and prevent native menu
        e.preventDefault();

        const sel = window.getSelection();
        const wordRange = document.createRange();
        wordRange.setStart(node, match.index);
        wordRange.setEnd(node, match.index + match[0].length);
        sel.removeAllRanges();
        sel.addRange(wordRange);
    });
})();
