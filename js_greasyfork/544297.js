// ==UserScript==
// @name         NotebookLM Codeblock Wrap & Section Breaks
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Force line wrap + add section breaks for codeblocks in NotebookLM Studio/Notes panel.
// @match        https://notebooklm.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544297/NotebookLM%20Codeblock%20Wrap%20%20Section%20Breaks.user.js
// @updateURL https://update.greasyfork.org/scripts/544297/NotebookLM%20Codeblock%20Wrap%20%20Section%20Breaks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. CSS: Maximum specificity for all code/pre permutations in Studio and Chat (covers all <pre.ng-star-inserted> > code)
    GM_addStyle(`
      pre.ng-star-inserted,
      pre.ng-star-inserted > code {
        white-space: pre-wrap !important;
        word-break: break-word !important;
        overflow-wrap: anywhere !important;
      }
    `);

    // 2. JS backup: forcibly set the style for both <pre> and <code> elements if needed.
    function forceWrapStudioCodeBlocks() {
        document.querySelectorAll('pre.ng-star-inserted, pre.ng-star-inserted > code').forEach(block => {
            block.style.whiteSpace = 'pre-wrap';
            block.style.wordBreak = 'break-word';
            block.style.overflowWrap = 'anywhere';
        });
    }

    // 3. Section breaks for code: extend as before, matches chat and studio panels
    function addSectionBreaksToStudioCodeBlocks() {
        document.querySelectorAll('pre.ng-star-inserted > code').forEach(codeBlock => {
            if (codeBlock.dataset.sectionsFormatted) return;
            const lines = codeBlock.textContent.split('\n');
            const sectionRegex = /^\[[^\]]+:/;
            let newHTML = lines.map(line => {
                if (sectionRegex.test(line.trim())) {
                    return `${line}<br><br>`;
                }
                return line;
            }).join('\n');
            codeBlock.innerHTML = newHTML.replace(/\n/g, '<br>');
            codeBlock.dataset.sectionsFormatted = "true";
        });
    }

    // 4. Initialize and set up observer for dynamic content (Studio/Note or Chat, works everywhere)
    forceWrapStudioCodeBlocks();
    addSectionBreaksToStudioCodeBlocks();
    const observer = new MutationObserver(() => {
        forceWrapStudioCodeBlocks();
        addSectionBreaksToStudioCodeBlocks();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
