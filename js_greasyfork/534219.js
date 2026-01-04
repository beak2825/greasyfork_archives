// ==UserScript==
// @name         Enhanced Claude Chat & Code Exporter 4.1
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Export Claude chat conversations with code artifacts into individual files with timestamp prefixes
// @author       Claude
// @match        https://claude.ai/chat/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/534219/Enhanced%20Claude%20Chat%20%20Code%20Exporter%2041.user.js
// @updateURL https://update.greasyfork.org/scripts/534219/Enhanced%20Claude%20Chat%20%20Code%20Exporter%2041.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add export buttons to the UI
    function addExportButtons() {
        // Check if export buttons already exist
        if (document.querySelector('.claude-export-button')) {
            return;
        }

        // Find a good location for the buttons (next to other input controls)
        const inputControls = document.querySelector('.flex-row.items-center.gap-2');

        if (inputControls) {
            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'claude-export-button';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.alignItems = 'center';
            buttonContainer.style.gap = '6px';

            // Create the export all button
            const exportAllButton = document.createElement('button');
            exportAllButton.type = 'button';
            exportAllButton.className = 'inline-flex items-center justify-center relative rounded-lg px-3 h-8 text-white';
            exportAllButton.style.backgroundColor = '#4a6ee0';
            exportAllButton.style.marginLeft = '8px';
            exportAllButton.style.display = 'flex';
            exportAllButton.style.alignItems = 'center';
            exportAllButton.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            exportAllButton.style.fontSize = '14px';
            exportAllButton.style.fontWeight = '500';
            exportAllButton.setAttribute('aria-label', 'Export All');

            // Button content with icon and text
            exportAllButton.innerHTML = `
                <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" style="margin-right: 4px;">
                        <path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112a8,8,0,0,1,16,0v96H200V112a8,8,0,0,1,16,0ZM80,80a8,8,0,0,1,8-8h32V36a4,4,0,0,1,4-4h8a4,4,0,0,1,4,4V72h32a8,8,0,0,1,5.66,13.66l-40,40a8,8,0,0,1-11.32,0l-40-40A8,8,0,0,1,80,80Z"></path>
                    </svg>
                    <span>Export All</span>
                </div>
            `;

            // Add click event listener
            exportAllButton.addEventListener('click', exportConversation);

            // Create the markdown-only export button
            const exportMdButton = document.createElement('button');
            exportMdButton.type = 'button';
            exportMdButton.className = 'inline-flex items-center justify-center relative rounded-lg px-3 h-8 text-white';
            exportMdButton.style.backgroundColor = '#9e6ee0'; // Different color to distinguish from Export All
            exportMdButton.style.display = 'flex';
            exportMdButton.style.alignItems = 'center';
            exportMdButton.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            exportMdButton.style.fontSize = '14px';
            exportMdButton.style.fontWeight = '500';
            exportMdButton.setAttribute('aria-label', 'Export Markdown Only');

            // Button content with icon and text
            exportMdButton.innerHTML = `
                <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" style="margin-right: 4px;">
                        <path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112a8,8,0,0,1,16,0v96H200V112a8,8,0,0,1,16,0ZM80,80a8,8,0,0,1,8-8h32V36a4,4,0,0,1,4-4h8a4,4,0,0,1,4,4V72h32a8,8,0,0,1,5.66,13.66l-40,40a8,8,0,0,1-11.32,0l-40-40A8,8,0,0,1,80,80Z"></path>
                    </svg>
                    <span>Md Only</span>
                </div>
            `;

            // Add click event listener
            exportMdButton.addEventListener('click', exportMarkdownOnly);

            // Add the buttons to the DOM
            buttonContainer.appendChild(exportAllButton);
            buttonContainer.appendChild(exportMdButton);
            inputControls.appendChild(buttonContainer);
        }
    }

    // Helper function to download a file
    function downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    // Generate a timestamp in the format yyyyMMddHHmmss
    function generateTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    // Function to export only the markdown content
    async function exportMarkdownOnly() {
        try {
            logDebug("Starting markdown-only export process...");

            // Show loading indicator
            showLoadingIndicator("Extracting conversation...");

            // Generate timestamp prefix for this export
            const timestampPrefix = generateTimestamp();
            logDebug(`Generated timestamp prefix: ${timestampPrefix}`);

            // Get the chat title
            const chatTitle = getChatTitle();
            const safeChatTitle = sanitizeFileName(chatTitle || 'Claude Conversation');
            logDebug(`Chat title: ${chatTitle} (sanitized: ${safeChatTitle})`);

            // Extract the conversation as markdown
            logDebug("Extracting conversation as markdown");
            const markdown = extractConversationMarkdown();

            // Download the markdown file with timestamp prefix
            const markdownFilename = `${timestampPrefix}_${safeChatTitle}.md`;
            const markdownBlob = new Blob([markdown], { type: 'text/markdown' });
            downloadFile(markdownBlob, markdownFilename);
            logDebug(`Downloaded markdown file: ${markdownFilename}`);

            // Show success message
            hideLoadingIndicator();
            showNotification(`Exported Claude conversation as markdown successfully!`, "success");

        } catch (error) {
            logDebug(`Error in exportMarkdownOnly: ${error.message}`);
            console.error('Error exporting markdown:', error);
            hideLoadingIndicator();
            showNotification('Error exporting markdown. Check console for details.', "error");
        }
    }

    // Main function to export the conversation with artifacts
    async function exportConversation() {
        try {
            logDebug("Starting export process...");

            // Initialize a variable to store clipboard content for artifact extraction
            let savedClipboardContent = "";

            // Try to save current clipboard content so we can restore it later
            try {
                savedClipboardContent = await navigator.clipboard.readText();
                logDebug("Saved original clipboard content");
            } catch (error) {
                logDebug("Could not read original clipboard content: " + error.message);
            }

            // Show loading indicator
            showLoadingIndicator("Processing chat and artifacts...");

            // Generate timestamp prefix for this export session
            const timestampPrefix = generateTimestamp();
            logDebug(`Generated timestamp prefix: ${timestampPrefix}`);

            // Get the chat title
            const chatTitle = getChatTitle();
            const safeChatTitle = sanitizeFileName(chatTitle || 'Claude Conversation');
            logDebug(`Chat title: ${chatTitle} (sanitized: ${safeChatTitle})`);

            // Extract the conversation as markdown
            logDebug("Extracting conversation as markdown");
            const markdown = extractConversationMarkdown();

            // Download the markdown file with timestamp prefix
            const markdownFilename = `${timestampPrefix}_00_${safeChatTitle}.md`;
            const markdownBlob = new Blob([markdown], { type: 'text/markdown' });
            downloadFile(markdownBlob, markdownFilename);
            logDebug(`Downloaded markdown file: ${markdownFilename}`);

            // Small delay before processing artifacts
            await new Promise(resolve => setTimeout(resolve, 300));

            // Find all artifact containers in the DOM
            const artifactButtons = document.querySelectorAll('button[aria-label="Preview contents"]');
            logDebug(`Found ${artifactButtons.length} artifact buttons`);

            // Process all artifacts sequentially
            showLoadingIndicator(`Found ${artifactButtons.length} artifacts, processing...`);

            for (let i = 0; i < artifactButtons.length; i++) {
                const artifactButton = artifactButtons[i];

                try {
                    // Update loading indicator with progress
                    showLoadingIndicator(`Processing artifact ${i+1} of ${artifactButtons.length}...`);

                    // First, extract metadata without opening the artifact
                    const initialArtifact = extractArtifactMetadataFromPreview(artifactButton, i);

                    if (!initialArtifact) {
                        logDebug(`Failed to extract metadata for artifact ${i+1}`);
                        continue;
                    }

                    // Click the artifact button to open the code panel
                    logDebug(`Clicking artifact button ${i+1} to open code panel`);
                    artifactButton.click();

                    // Wait for the code panel to load
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Now extract the full content using keyboard shortcut method
                    const fullArtifact = await extractArtifactUsingKeyboardCopy(initialArtifact);

                    if (fullArtifact && fullArtifact.content) {
                        const artifactNumber = String(i + 1).padStart(2, '0');
                        const fileName = `${timestampPrefix}_${artifactNumber}_${sanitizeFileName(fullArtifact.title)}${getFileExtension(fullArtifact.language)}`;

                        // Download the artifact
                        const blob = new Blob([fullArtifact.content], { type: 'text/plain' });
                        downloadFile(blob, fileName);

                        logDebug(`Downloaded artifact ${i+1}: ${fileName} (${fullArtifact.content.length} chars)`);

                        // Close the code panel by clicking outside or on close button
                        const closeButton = document.querySelector('button svg[width="18"][height="18"] path[d*="205.66,194.34"]');
                        if (closeButton && closeButton.parentElement && closeButton.parentElement.parentElement) {
                            closeButton.parentElement.parentElement.click();
                        } else {
                            // If can't find the close button, try clicking elsewhere
                            const header = document.querySelector('header');
                            if (header) header.click();
                        }

                        // Small delay between artifacts to prevent browser throttling
                        await new Promise(resolve => setTimeout(resolve, 800));
                    } else {
                        logDebug(`Failed to extract content for artifact ${i+1}`);
                    }
                } catch (error) {
                    logDebug(`Error processing artifact ${i+1}: ${error.message}`);
                    console.error(`Error processing artifact ${i+1}:`, error);

                    // Try to close any open panels before continuing
                    const closeButton = document.querySelector('button svg[width="18"][height="18"] path[d*="205.66,194.34"]');
                    if (closeButton && closeButton.parentElement && closeButton.parentElement.parentElement) {
                        closeButton.parentElement.parentElement.click();
                    }
                }
            }

            // Try to restore original clipboard content
            if (savedClipboardContent) {
                try {
                    await navigator.clipboard.writeText(savedClipboardContent);
                    logDebug("Restored original clipboard content");
                } catch (error) {
                    logDebug("Could not restore clipboard: " + error.message);
                }
            }

            // Show success message
            hideLoadingIndicator();
            showNotification(`Exported Claude conversation and ${artifactButtons.length} artifacts successfully!`, "success");

        } catch (error) {
            logDebug(`Error in exportConversation: ${error.message}`);
            console.error('Error exporting conversation:', error);
            hideLoadingIndicator();
            showNotification('Error exporting conversation. Check console for details.', "error");
        }
    }

    // Extract only metadata from an artifact preview without opening it
    function extractArtifactMetadataFromPreview(button, index) {
        try {
            // Extract metadata from the preview
            const titleElement = button.querySelector('.leading-tight.text-sm');
            const typeElement = button.querySelector('.text-sm.text-text-300');

            let title = `artifact_${index + 1}`;
            let type = 'Code';

            if (titleElement) {
                title = titleElement.textContent.trim();
            }

            if (typeElement) {
                type = typeElement.textContent.trim();
            }

            // Return metadata without content
            return {
                title: title,
                type: type,
                language: determineLanguage(type, title, ""),
                content: null // We'll get the content later
            };
        } catch (err) {
            logDebug(`Error in extractArtifactMetadataFromPreview: ${err.message}`);
            console.error('Error extracting artifact metadata from preview:', err);
            return null;
        }
    }

    // Extract artifact content using keyboard shortcut Ctrl+A, Ctrl+C
    async function extractArtifactUsingKeyboardCopy(artifactMetadata) {
        try {
            // Look for the code block in the panel
            const codeBlock = document.querySelector('.code-block__code');
            if (!codeBlock) {
                logDebug("No code block found in panel");
                return null;
            }

            // Try to determine language from the code element
            let language = artifactMetadata.language;
            const codeElement = codeBlock.querySelector('code');
            if (codeElement && codeElement.className) {
                const match = codeElement.className.match(/language-(\w+)/);
                if (match && match[1]) {
                    language = match[1];
                    logDebug(`Detected language: ${language}`);
                }
            }

            // Focus on the code element or code block to prepare for keyboard commands
            if (codeElement) {
                codeElement.focus();
                logDebug("Focused on code element");
            } else {
                codeBlock.focus();
                logDebug("Focused on code block");
            }

            // Wait a bit for the focus to take effect
            await new Promise(resolve => setTimeout(resolve, 200));

            // Approach 1: Direct copy via document.execCommand
            // (works in many browsers even with clipboard restrictions)
            try {
                // Select all text in the code block
                const selection = window.getSelection();
                const range = document.createRange();

                // Clear any existing selection
                selection.removeAllRanges();

                // Create range for the entire code element or block
                range.selectNodeContents(codeElement || codeBlock);

                // Add the range to selection
                selection.addRange(range);

                // Execute copy command
                const copySuccessful = document.execCommand('copy');

                if (copySuccessful) {
                    logDebug("Successfully copied via document.execCommand");
                } else {
                    logDebug("document.execCommand('copy') returned false");
                }

                // Clear selection
                selection.removeAllRanges();

                // Wait for clipboard to be updated
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (err) {
                logDebug(`Error using execCommand copy: ${err.message}`);
            }

            // Approach 2: Try to find and use the existing copy button
            try {
                // Look for the copy button within the toolbar
                const copyButton = document.querySelector('.flex.border.font-medium .py-1.px-2, button[class*="py-1 px-2 border-r border-border-300"]');

                if (copyButton) {
                    logDebug("Found copy button, clicking it");
                    copyButton.click();

                    // Wait for clipboard to be updated
                    await new Promise(resolve => setTimeout(resolve, 300));
                } else {
                    logDebug("Copy button not found");
                }
            } catch (err) {
                logDebug(`Error clicking copy button: ${err.message}`);
            }

            // Now try to get clipboard content
            let clipboardData = null;
            try {
                clipboardData = await navigator.clipboard.readText();
                logDebug(`Successfully read from clipboard: ${clipboardData.length} characters`);
            } catch (error) {
                logDebug(`Error reading from clipboard: ${error.message}`);

                // Fall back to text extraction method as last resort
                const extractedText = extractAllTextFromElement(codeElement || codeBlock);
                logDebug(`Using fallback extraction method: ${extractedText.length} chars`);
                return {
                    title: artifactMetadata.title,
                    type: artifactMetadata.type,
                    language: language,
                    content: extractedText
                };
            }

            // If we got data, use it
            if (clipboardData && clipboardData.length > 0) {
                return {
                    title: artifactMetadata.title,
                    type: artifactMetadata.type,
                    language: language,
                    content: clipboardData
                };
            } else {
                logDebug("No clipboard data obtained");

                // Fall back to text extraction method as last resort
                const extractedText = extractAllTextFromElement(codeElement || codeBlock);
                logDebug(`Using fallback extraction method: ${extractedText ? extractedText.length : 0} chars`);
                return {
                    title: artifactMetadata.title,
                    type: artifactMetadata.type,
                    language: language,
                    content: extractedText || "// Error extracting content"
                };
            }

        } catch (err) {
            logDebug(`Error in extractArtifactUsingKeyboardCopy: ${err.message}`);
            console.error('Error extracting artifact using keyboard copy:', err);

            // Try to find code element again for fallback
            const codeBlock = document.querySelector('.code-block__code');
            const codeElement = codeBlock ? codeBlock.querySelector('code') : null;

            // Determine language again in case it wasn't set earlier
            let language = artifactMetadata.language;
            if (codeElement && codeElement.className) {
                const match = codeElement.className.match(/language-(\w+)/);
                if (match && match[1]) {
                    language = match[1];
                }
            }

            // Fall back to text extraction method
            const extractedText = extractAllTextFromElement(codeElement || codeBlock);
            logDebug(`Using fallback extraction method after error: ${extractedText ? extractedText.length : 0} chars`);

            return {
                title: artifactMetadata.title,
                type: artifactMetadata.type,
                language: language,
                content: extractedText || "// Error extracting content"
            };
        }
    }

    // Extract all text from an element including all child nodes, maintaining line breaks
    function extractAllTextFromElement(element) {
        if (!element) return "";

        let text = '';
        const childNodes = element.childNodes;

        for (let i = 0; i < childNodes.length; i++) {
            const node = childNodes[i];

            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Process element nodes
                if (node.tagName === 'BR' || node.tagName === 'DIV' || node.tagName === 'P') {
                    text += '\n'; // Add newline for line break elements
                }

                // Recursively process child elements
                text += extractAllTextFromElement(node);

                // Add newline after certain block elements
                if (node.tagName === 'DIV' || node.tagName === 'P' ||
                    node.tagName === 'LI' || node.tagName === 'TR') {
                    text += '\n';
                }
            }
        }

        return text;
    }

    // Extract the conversation as markdown
    function extractConversationMarkdown() {
        let markdown = '';

        // Get chat title
        const chatTitle = getChatTitle();
        if (chatTitle) {
            markdown += `# ${chatTitle}\n\n`;
        }

        // Add export timestamp
        const now = new Date();
        markdown += `*Exported on: ${now.toLocaleString()}*\n\n`;

        // Get all message containers
        const messageContainers = document.querySelectorAll('[data-test-render-count="1"]');

        messageContainers.forEach(container => {
            // Check if this is a user message
            const userMessage = container.querySelector('[data-testid="user-message"]');
            if (userMessage) {
                markdown += `## User\n\n${userMessage.textContent.trim()}\n\n`;
                return;
            }

            // Check if this is a Claude message
            const claudeMessage = container.querySelector('.font-claude-message');
            if (claudeMessage) {
                markdown += `## Claude\n\n`;

                // Get all paragraphs and headings in the message
                const elements = claudeMessage.querySelectorAll('p, h1, h2, h3, h4, ul, ol, li, blockquote, pre, code');

                elements.forEach(element => {
                    if (element.tagName === 'H1') {
                        markdown += `### ${element.textContent.trim()}\n\n`;
                    } else if (element.tagName === 'H2') {
                        markdown += `#### ${element.textContent.trim()}\n\n`;
                    } else if (element.tagName === 'H3') {
                        markdown += `##### ${element.textContent.trim()}\n\n`;
                    } else if (element.tagName === 'P') {
                        markdown += `${element.textContent.trim()}\n\n`;
                    } else if (element.tagName === 'UL') {
                        // We'll handle list items individually
                    } else if (element.tagName === 'OL') {
                        // We'll handle list items individually
                    } else if (element.tagName === 'LI') {
                        const depth = parseInt(element.getAttribute('depth') || '0');
                        const indent = '  '.repeat(depth);
                        markdown += `${indent}- ${element.textContent.trim()}\n`;
                    } else if (element.tagName === 'BLOCKQUOTE') {
                        markdown += `> ${element.textContent.trim()}\n\n`;
                    } else if (element.tagName === 'PRE' || element.tagName === 'CODE') {
                        // Skip code blocks as they'll be exported separately
                        // However, inline code should still be included
                        if (element.classList.contains('bg-text-200/5')) {
                            markdown += `\`${element.textContent.trim()}\``;
                        }
                    }
                });

                // Add a reference to each code artifact
                const artifactButtons = claudeMessage.querySelectorAll('button[aria-label="Preview contents"]');
                artifactButtons.forEach((button, index) => {
                    const titleElement = button.querySelector('.leading-tight.text-sm');
                    const typeElement = button.querySelector('.text-sm.text-text-300');

                    if (titleElement && typeElement) {
                        const title = titleElement.textContent.trim();
                        const type = typeElement.textContent.trim();
                        const artifactNumber = String(index + 1).padStart(2, '0');

                        markdown += `\n**Code Artifact:** \`${artifactNumber}_${title}\` (${type})\n`;
                        markdown += `*See separate file with corresponding timestamp prefix*\n\n`;
                    }
                });

                markdown += '\n\n';
            }
        });

        return markdown;
    }

    // Determine the language of a code artifact based on context clues
    function determineLanguage(type, title, content) {
        // If it's not code, return as document
        if (type.toLowerCase() !== 'code') {
            return 'markdown';
        }

        // Check title for language hints
        const titleLower = title.toLowerCase();
        if (titleLower.includes('java')) return 'java';
        if (titleLower.includes('python') || titleLower.includes('.py')) return 'python';
        if (titleLower.includes('javascript') || titleLower.includes('js')) return 'javascript';
        if (titleLower.includes('html')) return 'html';
        if (titleLower.includes('css')) return 'css';
        if (titleLower.includes('bash') || titleLower.includes('shell') || titleLower.includes('.sh')) return 'bash';
        if (titleLower.includes('powershell') || titleLower.includes('.ps1')) return 'powershell';
        if (titleLower.includes('sql')) return 'sql';
        if (titleLower.includes('c#')) return 'csharp';
        if (titleLower.includes('c++')) return 'cpp';
        if (titleLower.includes('go')) return 'go';
        if (titleLower.includes('rust')) return 'rust';

        // Check content for language clues if content is provided
        if (content) {
            if (content.includes('public class') || content.includes('import java.')) return 'java';
            if (content.includes('def ') && content.includes(':')) return 'python';
            if (content.includes('function') && content.includes('{')) return 'javascript';
            if (content.includes('<html') || content.includes('<!DOCTYPE html')) return 'html';
            if (content.includes('#!/bin/bash')) return 'bash';
            if (content.includes('#!/bin/sh')) return 'bash';
            if (content.includes('#!powershell')) return 'powershell';
        }

        // Default to plaintext if we can't determine
        return 'plaintext';
    }

    // Get the appropriate file extension for a language
    function getFileExtension(language) {
        const extensions = {
            'java': '.java',
            'python': '.py',
            'javascript': '.js',
            'html': '.html',
            'css': '.css',
            'bash': '.sh',
            'powershell': '.ps1',
            'sql': '.sql',
            'csharp': '.cs',
            'cpp': '.cpp',
            'go': '.go',
            'rust': '.rs',
            'markdown': '.md',
            'plaintext': '.txt'
        };

        return extensions[language.toLowerCase()] || '.txt';
    }

    // Get the chat title
    function getChatTitle() {
        const titleElement = document.querySelector('.truncate.tracking-tight.font-normal.font-styrene');
        return titleElement ? titleElement.textContent.trim() : null;
    }

    // Sanitize a string to be used as a filename
    function sanitizeFileName(name) {
        return name
            .replace(/[\\/:*?"<>|]/g, '_') // Replace invalid filename chars
            .replace(/\s+/g, '_')          // Replace spaces with underscores
            .replace(/__+/g, '_')          // Replace multiple underscores with a single one
            .replace(/^_+|_+$/g, '')       // Remove leading/trailing underscores
            .slice(0, 100);                // Limit length to 100 chars
    }

    // Log debug information to console with prefix
    function logDebug(message) {
        console.log(`[Claude Exporter] ${message}`);
    }

    // Show loading indicator with message
    function showLoadingIndicator(message) {
        // Remove existing indicator if any
        hideLoadingIndicator();

        const indicator = document.createElement('div');
        indicator.id = 'claude-export-loading';
        indicator.style.position = 'fixed';
        indicator.style.top = '50%';
        indicator.style.left = '50%';
        indicator.style.transform = 'translate(-50%, -50%)';
        indicator.style.padding = '20px';
        indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        indicator.style.color = 'white';
        indicator.style.borderRadius = '8px';
        indicator.style.zIndex = '10000';
        indicator.style.fontSize = '16px';
        indicator.style.fontFamily = 'system-ui, -apple-system, sans-serif';

        // Add a spinner and message for better visual feedback
        indicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="spinner" style="border: 3px solid rgba(255,255,255,.3); border-radius: 50%; border-top: 3px solid white; width: 20px; height: 20px; animation: spin 1s linear infinite;"></div>
                <div>${message || 'Processing...'}</div>
            </div>
        `;

        // Add animation style
        const style = document.createElement('style');
        style.id = 'claude-export-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        if (!document.getElementById('claude-export-style')) {
            document.head.appendChild(style);
        }

        document.body.appendChild(indicator);
    }

    // Hide loading indicator
    function hideLoadingIndicator() {
        const indicator = document.getElementById('claude-export-loading');
        if (indicator) {
            document.body.removeChild(indicator);
        }
    }

    // Show a notification
    function showNotification(message, type = "info") {
        // Remove any existing notification
        const existingNotification = document.getElementById('claude-export-notification');
        if (existingNotification) {
            document.body.removeChild(existingNotification);
        }

        const notification = document.createElement('div');
        notification.id = 'claude-export-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '10000';
        notification.style.fontSize = '14px';
        notification.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        notification.style.textAlign = 'center';
        notification.style.maxWidth = '80%';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';

        if (type === "error") {
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
        } else if (type === "success") {
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
        } else {
            notification.style.backgroundColor = '#2196F3';
            notification.style.color = 'white';
        }

        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            if (document.getElementById('claude-export-notification')) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }

    // Initialize the script
    function init() {
        logDebug("Initializing Enhanced Claude Exporter 4.1");

        // Add export buttons when the page loads
        addExportButtons();

        // Create a MutationObserver to watch for DOM changes
        const observer = new MutationObserver(() => {
            // Check if we need to add the export buttons after DOM changes
            addExportButtons();
        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also register menu commands
        GM_registerMenuCommand('Export Claude Conversation with Artifacts', exportConversation);
        GM_registerMenuCommand('Export Claude Conversation as Markdown Only', exportMarkdownOnly);

        logDebug("Initialization complete");
    }

    // Run the initialization
    init();
})();