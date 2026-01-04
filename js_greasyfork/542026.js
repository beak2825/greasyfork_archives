// ==UserScript==
// @name         Glowfic diff viewer
// @version      0.1.3
// @description  Show diffs between versions on a tag's history page
// @namespace    https://greasyfork.org/en/users/1492764-differential
// @license      MIT
// @match        https://*.glowfic.com/*/history
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js#sha256=3a29bd9374b219bd6964550085cddf6b62fc4073893d3f251c1d61ef1ea56b7f
// @downloadURL https://update.greasyfork.org/scripts/542026/Glowfic%20diff%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/542026/Glowfic%20diff%20viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDiffs);
    } else {
        addDiffs();
    }

    function addDiffs() {
        const postContents = document.querySelectorAll('div.post-content');

        if (postContents.length < 2) {
            // console.log('Not enough post versions to compare');
            return;
        }

        for (let i = 1; i < postContents.length; i++) {
            const currentDiv = postContents[i];
            const previousDiv = postContents[i - 1];

            const currentText = extractTextContent(currentDiv);
            const previousText = extractTextContent(previousDiv);

            // calculate word-level diff
            const diff = Diff.diffWords(previousText, currentText);

            if (!diff.some(x => x.added || x.removed)) {
                continue; // diff is empty
            }

            trimUnchangedContent(diff);

            const diffContainer = createDiffContainer(diff);
            currentDiv.parentNode.insertBefore(diffContainer, currentDiv.nextSibling);
        }
    }
    /**
    @param {Diff.Change[]} diffParts
    **/
    function trimUnchangedContent(diffParts) {
        const first = diffParts[0];
        if (first && !first.added && !first.removed) {
            const parts = first.value.split(/(\n{2,})/); // even indices are elements
            // only retain the last paragraph, so the last even-indexed element
            const part = parts[parts.length - 2 + parts.length % 2];
            first.value = part;
        }
        const last = diffParts[diffParts.length - 1];
        if (diffParts.length > 1 && last && !last.added && !last.removed) {
            const parts = last.value.split(/(\n{2,})/);
            // only retain the first paragraph
            const part = parts[0];
            last.value = part;
        }
    }

    function extractTextContent(div) {
        const clone = div.cloneNode(true);

        // convert paragraphs to text with double newlines
        const paragraphs = clone.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.insertAdjacentText('afterend', '\n\n');
        });

        // convert line breaks to newlines
        const breaks = clone.querySelectorAll('br');
        breaks.forEach(br => {
            br.insertAdjacentText('afterend', '\n');
        });

        return clone.textContent.trim();
    }

    function createDiffContainer(diffParts) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #1B1E1F;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 8px 12px;
            background-color: #232627;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            font-size: 14px;
            color: #dedbd7;
        `;
        header.textContent = 'Content Changes';

        const diffBlock = document.createElement('div');
        diffBlock.style.cssText = `
            padding: 12px !important;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
            color: #dedbd7;
            font-size: 12px !important;
            line-height: 1.4 !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
        `;

        diffParts.forEach(part => {
            const span = document.createElement('span');
            // replace newlines with visible indicators, to show their diffs too
            let displayValue = part.value.replace(/\n/g, '↵\n');
            span.textContent = displayValue;

            if (part.added) {
                span.style.cssText = 'background-color: #1A3E29; color: #99E49B;';
            } else if (part.removed) {
                span.style.cssText = 'background-color: #430C11; color: #D58086; text-decoration: line-through;';
            }

            diffBlock.appendChild(span);
        });

        container.appendChild(header);
        container.appendChild(diffBlock);
        return container;
    }
})();