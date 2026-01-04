// ==UserScript==
// @name         ChatGPT Enhanced Markdown Copy with Code Blocks ,Tables and Formula (For Typora and Chrome)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Copy ChatGPT responses as Markdown with proper tables, code blocks, and formula support for Typora Markdown editors. Trigger with Alt + Shift + C.
// @author       Showna
// @match       *://chatgpt.com/c
// @match       *://chatgpt.com/c/*
// @grant        none
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/turndown/7.1.2/turndown.min.js
// @downloadURL https://update.greasyfork.org/scripts/524609/ChatGPT%20Enhanced%20Markdown%20Copy%20with%20Code%20Blocks%20%2CTables%20and%20Formula%20%28For%20Typora%20and%20Chrome%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524609/ChatGPT%20Enhanced%20Markdown%20Copy%20with%20Code%20Blocks%20%2CTables%20and%20Formula%20%28For%20Typora%20and%20Chrome%29.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Function to handle enhanced copy
    function enhancedCopy() {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            console.warn("No content selected for copying.");
            return;
        }

        // Initialize Turndown
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
        });

        // Add rule for handling formulas in KaTeX
        turndownService.addRule('katex', {
            filter: (node) => node.classList && node.classList.contains('katex'),
            replacement: (content, node) => {
                const annotation = node.querySelector('annotation');
                if (annotation) {
                    const latex = annotation.textContent.trim();
                    return `$$${latex}$$`;
                }
                return '';
            },
        });

        // Add rule for handling code blocks
        turndownService.addRule('codeBlock', {
            filter: (node) => node.tagName === 'PRE',
            replacement: (content, node) => {
                let codeLang = node.getAttribute('data-language') || '';
                const codeContent = node.textContent.trim();

                // Check for "CopyEdit" in the first line and process it
                const lines = codeContent.split('\n');
                if (lines[0].includes('CopyEdit')) {
                    const parts = lines[0].split('CopyEdit');
                    const extractedLang = parts[0].trim();
                    codeLang = extractedLang || codeLang;
                    lines[0] = parts[1].trim();

                    return `\n\`\`\`${codeLang}\n${lines.join('\n')}\n\`\`\``;
                }

                return `\n\`\`\`${codeLang}\n${codeContent}\n\`\`\``;
            },
        });

        // Add rule for converting tables to Markdown
        turndownService.addRule('table', {
            filter: 'table',
            replacement: (content, node) => {
                const rows = Array.from(node.querySelectorAll('tr')).map((row) => {
                    const cells = Array.from(row.querySelectorAll('th, td')).map((cell) => {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = cell.innerHTML;
                        return turndownService.turndown(tempDiv.innerHTML).trim();
                    });

                    return `| ${cells.join(' | ')} |`;
                });

                const maxColumns = rows[0].split('|').length - 2;
                const correctSeparator = `| ${'--- | '.repeat(maxColumns).trim()} |`;

                if (rows.length > 1) {
                    rows.splice(1, 0, correctSeparator);
                }

                const fixRowColumns = (row) => {
                    const cells = row.split('|');
                    while (cells.length - 2 < maxColumns) {
                        cells.splice(cells.length - 1, 0, ' ');
                    }
                    return cells.slice(0, maxColumns + 2).join('|');
                };

                const fixedRows = rows.map(fixRowColumns);

                return fixedRows.join('\n');
            },
        });

        // Process selected content
        const tempDiv = document.createElement('div');
        const range = selection.getRangeAt(0);
        tempDiv.appendChild(range.cloneContents());

        // Convert HTML to Markdown
        let markdownText = turndownService.turndown(tempDiv.innerHTML);

        // Ensure consistent line breaks
        markdownText = markdownText
            .replace(/\n{2,}/g, '\n\n')
            .trim();

        // Copy the Markdown to clipboard
        navigator.clipboard.writeText(markdownText)
            .then(() => {
                console.log("Enhanced Markdown copied to clipboard:", markdownText);
                //alert("Enhanced Markdown copied!v5");
            })
            .catch((err) => {
                console.error("Failed to copy enhanced content:", err);
            });
    }

    // Listen for Alt + Shift + C to trigger enhanced copy
    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.shiftKey && e.code === 'KeyC') {
            e.preventDefault();
            enhancedCopy();
        }
    });

    console.log("Shortcut Alt + Shift + C is ready for enhanced copying.");
})();
