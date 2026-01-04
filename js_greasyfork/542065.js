// ==UserScript==
// @name         ChatGPT Deep Research Markdown Exporter
// @namespace    https://github.com/ckep1/chatgpt-research-export
// @version      1.0.0
// @description  Export ChatGPT deep research content with proper markdown formatting and numbered citations
// @author       Chris Kephart
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542065/ChatGPT%20Deep%20Research%20Markdown%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/542065/ChatGPT%20Deep%20Research%20Markdown%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the base URL without fragments or query parameters
    function getBaseUrl(url) {
        try {
            const urlObj = new URL(url);
            return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
        } catch (e) {
            return url;
        }
    }

    // Function to convert HTML content to markdown
    function convertToMarkdown(element) {
        let markdown = '';
        let sourceCounter = 1;
        const sourceMap = new Map(); // Track unique sources

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return '';
            }

            const tagName = node.tagName.toLowerCase();
            let content = '';

            // Process child nodes
            for (const child of node.childNodes) {
                content += processNode(child);
            }

            switch (tagName) {
                case 'h1':
                    return `# ${content.trim()}\n\n`;
                case 'h2':
                    return `## ${content.trim()}\n\n`;
                case 'h3':
                    return `### ${content.trim()}\n\n`;
                case 'h4':
                    return `#### ${content.trim()}\n\n`;
                case 'h5':
                    return `##### ${content.trim()}\n\n`;
                case 'h6':
                    return `###### ${content.trim()}\n\n`;
                case 'p':
                    return `${content.trim()}\n\n`;
                case 'strong':
                case 'b':
                    return `**${content}**`;
                case 'em':
                case 'i':
                    return `*${content}*`;
                case 'ul':
                    return `${content}\n`;
                case 'ol':
                    return `${content}\n`;
                case 'li':
                    return `- ${content.trim()}\n`;
                case 'blockquote':
                    return `> ${content.trim()}\n\n`;
                case 'code':
                    return `\`${content}\``;
                case 'pre':
                    return `\`\`\`\n${content}\n\`\`\`\n\n`;
                case 'a': {
                    const href = node.getAttribute('href');
                    if (href) {
                        // Skip if this link is inside a citation span (already handled)
                        if (node.closest('span[data-state="closed"]')) {
                            return '';
                        }

                        const baseUrl = getBaseUrl(href);

                        // Check if we've seen this base URL before
                        if (!sourceMap.has(baseUrl)) {
                            sourceMap.set(baseUrl, sourceCounter);
                            sourceCounter++;
                        }

                        const sourceNumber = sourceMap.get(baseUrl);
                        return `([${sourceNumber}](${href}))`;
                    }
                    return content;
                }
                case 'br':
                    return '\n';
                case 'span': {
                    // Handle citation spans with data-state="closed"
                    if (node.getAttribute('data-state') === 'closed') {
                        // Find the nested link
                        const link = node.querySelector('a[href]');
                        if (link) {
                            const href = link.getAttribute('href');
                            const baseUrl = getBaseUrl(href);

                            // Check if we've seen this base URL before
                            if (!sourceMap.has(baseUrl)) {
                                sourceMap.set(baseUrl, sourceCounter);
                                sourceCounter++;
                            }

                            const sourceNumber = sourceMap.get(baseUrl);
                            return `([${sourceNumber}](${href}))`;
                        }
                        return '';
                    }
                    return content;
                }
                default:
                    return content;
            }
        }

        return processNode(element);
    }

    // Function to get today's date in YYYY-MM-DD format
    function getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // Function to extract title from h1
    function extractTitle(researchContainer) {
        const h1 = researchContainer.querySelector('h1');
        return h1 ? h1.textContent.trim() : 'ChatGPT Research';
    }

    // Function to sanitize title for YAML frontmatter
    function sanitizeTitle(title) {
        return title
            .replace(/:/g, '-') // Replace colons with dashes
            .replace(/"/g, '\\"') // Escape double quotes
            .replace(/\\/g, '\\\\') // Escape backslashes
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .replace(/\r/g, ' ') // Replace carriage returns with spaces
            .replace(/\t/g, ' ') // Replace tabs with spaces
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim(); // Remove leading/trailing whitespace
    }

    // Function to generate frontmatter
    function generateFrontmatter(title, url) {
        const sanitizedTitle = sanitizeTitle(title);
        return `---
title: "${sanitizedTitle}"
url: ${url}
date: ${getTodayDate()}
---

`;
    }

    // Toggle frontmatter setting
    let includeFrontmatter = GM_getValue('includeFrontmatter', false);

    function toggleFrontmatter() {
        includeFrontmatter = !includeFrontmatter;
        GM_setValue('includeFrontmatter', includeFrontmatter);
        alert(`Frontmatter ${includeFrontmatter ? 'enabled' : 'disabled'}`);
        updateMenuCommand();
    }

    function updateMenuCommand() {
        // Remove existing menu command if it exists
        if (window.menuCommandId) {
            GM_unregisterMenuCommand(window.menuCommandId);
        }

        // Register new menu command
        window.menuCommandId = GM_registerMenuCommand(
            `${includeFrontmatter ? '✓' : '✗'} Include Frontmatter`,
            toggleFrontmatter
        );
    }

    // Function to export deep research content
    function exportDeepResearch() {
        // Find the deep research result container
        const researchContainer = document.querySelector('.deep-research-result');

        if (!researchContainer) {
            alert('No deep research content found on this page.');
            return;
        }

        // Convert to markdown
        let markdown = convertToMarkdown(researchContainer);

        // Clean up extra whitespace
        markdown = markdown
            .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove extra blank lines
            .replace(/^\s+|\s+$/g, '') // Trim start and end
            .replace(/\n{3,}/g, '\n\n'); // Limit to maximum 2 consecutive newlines

        // Add frontmatter if enabled
        if (includeFrontmatter) {
            const title = extractTitle(researchContainer);
            const currentUrl = window.location.href;
            const frontmatter = generateFrontmatter(title, currentUrl);
            markdown = frontmatter + markdown;
        }

        // Create and download the file
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'chatgpt-research-export.md';

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('Deep research content exported successfully!');
    }

    // Function to copy to clipboard
    function copyDeepResearchToClipboard() {
        const researchContainer = document.querySelector('.deep-research-result');

        if (!researchContainer) {
            alert('No deep research content found on this page.');
            return;
        }

        let markdown = convertToMarkdown(researchContainer);

        // Clean up extra whitespace
        markdown = markdown
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .replace(/^\s+|\s+$/g, '')
            .replace(/\n{3,}/g, '\n\n');

        // Add frontmatter if enabled
        if (includeFrontmatter) {
            const title = extractTitle(researchContainer);
            const currentUrl = window.location.href;
            const frontmatter = generateFrontmatter(title, currentUrl);
            markdown = frontmatter + markdown;
        }

        navigator.clipboard.writeText(markdown).then(() => {
            alert('Deep research content copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = markdown;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Deep research content copied to clipboard!');
        });
    }

    // Add export buttons to the page
    function addExportButtons() {
        // Check if buttons already exist
        if (document.getElementById('deep-research-export-btn')) {
            return;
        }

        // Find a good place to add the buttons (near the research container)
        const researchContainer = document.querySelector('.deep-research-result');
        if (!researchContainer) {
            return;
        }

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            gap: 10px;
            flex-direction: column;
        `;

        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'deep-research-export-btn';
        downloadBtn.textContent = 'Export Research (MD)';
        downloadBtn.style.cssText = `
            background: #10a37f;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        `;
        downloadBtn.addEventListener('click', exportDeepResearch);

        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy Research (MD)';
        copyBtn.style.cssText = `
            background: #6366f1;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        `;
        copyBtn.addEventListener('click', copyDeepResearchToClipboard);

        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(copyBtn);
        document.body.appendChild(buttonContainer);
    }

    // Watch for deep research content to appear
    function watchForResearchContent() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const researchContainer = document.querySelector('.deep-research-result');
                    if (researchContainer && !document.getElementById('deep-research-export-btn')) {
                        addExportButtons();
                        break;
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    setTimeout(() => {
        // Register menu command
        updateMenuCommand();

        addExportButtons();
        watchForResearchContent();
    }, 2000);

})();