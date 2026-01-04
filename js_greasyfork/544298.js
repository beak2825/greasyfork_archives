// ==UserScript==
// @name         Gemini Codeblock: Wrap & Section Breaks
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Force line wrap + add section line breaks in codeblocks on Gemini web app.
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544298/Gemini%20Codeblock%3A%20Wrap%20%20Section%20Breaks.user.js
// @updateURL https://update.greasyfork.org/scripts/544298/Gemini%20Codeblock%3A%20Wrap%20%20Section%20Breaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for line wrapping in pre/code blocks (affects Gemini and any code
    GM_addStyle(`
        pre, code {
            white-space: pre-wrap !important;
            word-break: break-word !important;
        }
    `);

    // Function to apply section breaks
    function addSectionBreaksToCodeblocks() {
        document.querySelectorAll('pre > code').forEach(codeBlock => {
            // Only apply once per block
            if (codeBlock.dataset.sectionsFormatted) return;

            const lines = codeBlock.textContent.split('\n');
            const sectionRegex = /^\[[^\]]+:/;

            // Insert extra spacing after section header lines
            let newHTML = lines.map(line => {
                // If the line matches a section header (e.g. [Label: ...)
                if (sectionRegex.test(line.trim())) {
                    // Add two <br> after the section line for more vertical space
                    return `${line}<br style="line-height:1.3;"><br style="line-height:0.7;">`;
                }
                return line;
            }).join('\n');

            // Replace \n with <br> for inline HTML; preserve formatting
            codeBlock.innerHTML = newHTML.replace(/\n/g, '<br>');
            codeBlock.dataset.sectionsFormatted = "true";
        });
    }

    // Run at first load and on DOM updates
    addSectionBreaksToCodeblocks();
    const observer = new MutationObserver(addSectionBreaksToCodeblocks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
