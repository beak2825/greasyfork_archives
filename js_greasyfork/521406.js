// ==UserScript==
// @name         Hugging Face Chat Download
// @namespace    Violentmonkey Script
// @version      1.3
// @description  Adds buttons to download JSON and Markdown
// @author       GrootBlouNaai
// @match        https://huggingface.co/chat/conversation/*
// @license      GPL v2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521406/Hugging%20Face%20Chat%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/521406/Hugging%20Face%20Chat%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Creates and appends download buttons to the document body
     */
    function createDownloadButtons() {
        const jsonButton = createButton('Download JSON', '#4CAF50', '15px');
        const markdownButton = createButton('Download Markdown', '#008CBA', '60px');

        jsonButton.addEventListener('click', () => downloadData('json'));
        markdownButton.addEventListener('click', () => downloadData('markdown'));

        document.body.appendChild(jsonButton);
        document.body.appendChild(markdownButton);
    }

    /**
     * Creates a styled button element
     * @param {string} text - Button text
     * @param {string} backgroundColor - Button background color
     * @param {string} bottom - Bottom position
     * @returns {HTMLButtonElement} Styled button element
     */
    function createButton(text, backgroundColor, bottom) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.position = 'fixed';
        button.style.bottom = bottom;
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = backgroundColor;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        return button;
    }

    /**
     * Downloads data in specified format
     * @param {string} type - Download type ('json' or 'markdown')
     */
    function downloadData(type) {
        const chatId = window.location.pathname.split('/').pop();
        const jsonUrl = `https://huggingface.co/chat/conversation/${chatId}/` +
            `__data.json?x-sveltekit-invalidated=01`;

        fetch(jsonUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched JSON data:', data);
                const title = extractTitle(data);
                // const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
                const sanitizedTitle = title; // Filename sanitization commented out
                console.log('Extracted title:', sanitizedTitle);

                if (type === 'json') {
                    const fileName = `${sanitizedTitle}.json`;
                    downloadJSON(data, fileName);
                } else if (type === 'markdown') {
                    const fileName = `${sanitizedTitle}.md`;
                    const conversation = extractConversation(data);
                    downloadMarkdown(conversation.join(''), fileName);
                }
            })
            .catch(error => console.error('Error downloading data:', error));
    }

    /**
     * Extracts title from data structure
     * @param {Object} data - JSON data object
     * @returns {string} Extracted title or 'Untitled'
     */
    function extractTitle(data) {
        if (data?.nodes && Array.isArray(data.nodes)) {
            for (const node of data.nodes) {
                if (node?.type === 'data' && Array.isArray(node.data)) {
                    for (const item of node.data) {
                        if (item && typeof item === 'object' &&
                            item.title !== undefined) {
                            const titleValue = getTitleValue(node.data, item.title);
                            if (typeof titleValue === 'string' &&
                                titleValue.trim() !== '') {
                                return titleValue;
                            }
                        }
                    }
                }
            }
        }
        return 'Untitled';
    }

    /**
     * Gets title value from data array
     * @param {Array} data - Data array
     * @param {number} titleIndex - Index of title
     * @returns {string|null} Title value or null
     */
    function getTitleValue(data, titleIndex) {
        if (typeof titleIndex === 'number' && titleIndex < data.length) {
            return data[titleIndex];
        }
        return null;
    }

    /**
     * Downloads data as JSON file
     * @param {Object} data - JSON data to download
     * @param {string} fileName - Name of download file
     */
    function downloadJSON(data, fileName) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        downloadFile(blob, fileName);
    }

    /**
     * Downloads data as Markdown file
     * @param {string} conversation - Markdown content
     * @param {string} fileName - Name of download file
     */
    function downloadMarkdown(conversation, fileName) {
        const blob = new Blob([conversation], { type: 'text/markdown' });
        downloadFile(blob, fileName);
    }

    /**
     * Generic file download helper
     * @param {Blob} blob - File content as Blob
     * @param {string} fileName - Name of download file
     */
    function downloadFile(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Formats text content with blockquote
     * @param {string} content - Content to format
     * @returns {string} Formatted content with blockquotes
     */
    function formatWithBlockquote(content) {
        // Split content by newlines and add blockquote to each line
        const lines = content.split('\n');
        const quotedLines = lines.map(line => line ? `> ${line}` : '>');
        return quotedLines.join('\n');
    }

    /**
     * Extracts conversation from data structure
     * @param {Object} data - JSON data object
     * @returns {Array} Array of conversation strings
     */
    function extractConversation(data) {
        let conversation = [];
        let allData = [];

        if (data?.nodes && Array.isArray(data.nodes)) {
            for (const node of data.nodes) {
                if (node?.type === 'data' && Array.isArray(node.data)) {
                    allData = node.data;
                }
            }
        }

        function traverse(obj) {
            if (Array.isArray(obj)) {
                obj.forEach(item => traverse(item));
            } else if (typeof obj === 'object' && obj !== null) {
                if ('from' in obj && 'content' in obj) {
                    const fromIndex = obj.from;
                    const contentIndex = obj.content;

                    if (typeof fromIndex === 'number' &&
                        typeof contentIndex === 'number' &&
                        fromIndex < allData.length &&
                        contentIndex < allData.length) {

                        const role = allData[fromIndex];
                        const content = allData[contentIndex];

                        if (role && content &&
                            ['user', 'assistant'].includes(role) &&
                            typeof content === 'string') {
                            const formattedContent = formatWithBlockquote(content);
                            conversation.push(
                                `### **${role.charAt(0).toUpperCase() +
                                role.slice(1)}**: \n${formattedContent}\n\n`
                            );
                        }
                    }
                }

                Object.keys(obj).forEach(key => traverse(obj[key]));
            }
        }

        if (data?.nodes && Array.isArray(data.nodes)) {
            data.nodes.forEach(node => {
                if (node?.type === 'data' && Array.isArray(node.data)) {
                    traverse(node);
                }
            });
        }

        return conversation;
    }

    // Create the download buttons when the page loads or when a new chat is loaded
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                createDownloadButtons();
                observer.disconnect(); // Stop observing once buttons are created
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();