// ==UserScript==
// @name         Quicker Markdown Renderer
// @name:zh-CN   Quicker Markdown 渲染器
// @namespace    https://greasyfork.org/users/833671-cea
// @version      1.0.1
// @description  Render markdown content in Quicker action versions table automatically
// @description:zh-CN  在 Quicker 动作版本表格中自动渲染 Markdown 内容，提升阅读体验
// @author       Cea
// @match        https://getquicker.net/Share/Actions/Versions?code=*
// @match        https://getquicker.net/Sharedaction?code=*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js
// @license      CC BY-NC 4.0
// @supportURL   https://greasyfork.org/zh-CN/scripts/546744-quicker-markdown-renderer/feedback
// @downloadURL https://update.greasyfork.org/scripts/546744/Quicker%20Markdown%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/546744/Quicker%20Markdown%20Renderer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global constants
    const CONFIG = {
        // Script information
        SCRIPT_NAME: 'Quicker Markdown Renderer',
        VERSION: '1.0.1',
        
        // Timeout settings
        ELEMENT_WAIT_TIMEOUT: 5000,
        RENDER_DELAY: 100,
        
        // Markdown patterns for detection
        MARKDOWN_PATTERNS: [
            /\*\*.*?\*\*/, // bold
            /\*.*?\*/, // italic
            /`.*?`/, // inline code
            /\[.*?\]\(.*?\)/, // links
            /^[-*+]\s/, // unordered lists
            /^\d+\.\s/, // ordered lists
            /^#{1,6}\s/, // headers
            /```[\s\S]*?```/, // code blocks
            /^\|.*\|$/, // table rows
            /^\>\s/, // blockquotes
        ],
        
        // Table selectors for different page layouts
        TABLE_SELECTORS: [
            'body > div.body-wrapper > div.mt-3.container.bg-white.rounded-top > div.pb-5 > table',
            'body > div.body-wrapper > div.mt-3.container.bg-white.rounded-top > div.container.pb-3.mt-3 > div > div.col-12.col-md-9.order-md-first.pl-0.pr-0.pr-md-3.mt-3.mt-md-0 > div > section:nth-child(4) > table'
        ],
        
        // Container selectors for mutation observer
        CONTAINER_SELECTORS: [
            'body > div.body-wrapper > div.mt-3.container.bg-white.rounded-top > div.pb-5',
            'body > div.body-wrapper > div.mt-3.container.bg-white.rounded-top > div.container.pb-3.mt-3'
        ],
        
        // CSS styles for rendered content
        RENDERED_STYLES: `
            max-width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
        `,
        
        // Data attributes
        DATA_ATTRIBUTES: {
            PROCESSED: 'data-markdown-processed'
        },
        
        // Log messages
        MESSAGES: {
            STARTING: 'Quicker Markdown Renderer: Starting...',
            INITIALIZED: 'Quicker Markdown Renderer: Initialized successfully',
            TABLE_FOUND: 'Found table with selector:',
            TABLE_NOT_FOUND: 'Table not found with selector:',
            NO_TABLE_FOUND: 'No table found with any selector',
            NO_TABLE_CONTINUING: 'No table found with any selector, but continuing...',
            PROCESSED_CELL: 'Processed cell',
            ERROR_INIT: 'Quicker Markdown Renderer: Error during initialization:',
            ERROR_RENDER: 'Error rendering markdown:'
        }
    };

    // Wait for page to load
    function waitForElement(selector, timeout = CONFIG.ELEMENT_WAIT_TIMEOUT) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }
                
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                    return;
                }
                
                setTimeout(checkElement, 100);
            };
            
            checkElement();
        });
    }

    // Render markdown content
    function renderMarkdown(text) {
        if (!text || typeof text !== 'string') {
            return text;
        }
        
        try {
            // Configure marked options
            marked.setOptions({
                breaks: true,
                gfm: true,
                sanitize: false
            });
            
            return marked.parse(text);
        } catch (error) {
            console.error(CONFIG.MESSAGES.ERROR_RENDER, error);
            return text;
        }
    }

    // Process table cells
    function processTableCells() {
        let table = null;
        for (const selector of CONFIG.TABLE_SELECTORS) {
            table = document.querySelector(selector);
            if (table) {
                console.log(CONFIG.MESSAGES.TABLE_FOUND, selector);
                break;
            }
        }
        
        if (!table) {
            console.log(CONFIG.MESSAGES.NO_TABLE_FOUND);
            return;
        }

        const cells = table.querySelectorAll('td');
        cells.forEach((cell, index) => {
            const originalText = cell.textContent.trim();
            
            // Skip if cell is empty or already processed
            if (!originalText || cell.hasAttribute(CONFIG.DATA_ATTRIBUTES.PROCESSED)) {
                return;
            }
            
            // Check if content looks like markdown (contains common markdown patterns)
            const hasMarkdown = CONFIG.MARKDOWN_PATTERNS.some(pattern => pattern.test(originalText));
            
            if (hasMarkdown) {
                const renderedHtml = renderMarkdown(originalText);
                
                // Create a wrapper div to preserve original text
                const wrapper = document.createElement('div');
                wrapper.innerHTML = renderedHtml;
                wrapper.style.cssText = CONFIG.RENDERED_STYLES;
                
                // Clear cell and add rendered content
                cell.innerHTML = '';
                cell.appendChild(wrapper);
                
                // Mark as processed
                cell.setAttribute(CONFIG.DATA_ATTRIBUTES.PROCESSED, 'true');
                
                console.log(`${CONFIG.MESSAGES.PROCESSED_CELL} ${index + 1}:`, originalText.substring(0, 50) + '...');
            }
        });
    }

    // Main function
    async function init() {
        try {
            console.log(CONFIG.MESSAGES.STARTING);
            
            // Try to find table immediately without waiting
            let table = null;
            for (const selector of CONFIG.TABLE_SELECTORS) {
                table = document.querySelector(selector);
                if (table) {
                    console.log(CONFIG.MESSAGES.TABLE_FOUND, selector);
                    break;
                } else {
                    console.log(`${CONFIG.MESSAGES.TABLE_NOT_FOUND} ${selector}`);
                }
            }
            
            if (!table) {
                console.log(CONFIG.MESSAGES.NO_TABLE_CONTINUING);
            }
            
            // Process table cells
            processTableCells();
            
            // Set up observer for dynamic content
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if new table content was added
                        const hasNewTableContent = Array.from(mutation.addedNodes).some(node => {
                            return node.nodeType === Node.ELEMENT_NODE && 
                                   (node.matches('table') || node.querySelector('table'));
                        });
                        
                        if (hasNewTableContent) {
                            setTimeout(processTableCells, CONFIG.RENDER_DELAY);
                        }
                    }
                });
            });
            
            // Observe multiple containers for changes
            const containers = CONFIG.CONTAINER_SELECTORS.map(selector => 
                document.querySelector(selector)
            ).filter(container => container);
            
            containers.forEach(container => {
                observer.observe(container, {
                    childList: true,
                    subtree: true
                });
            });
            
            console.log(CONFIG.MESSAGES.INITIALIZED);
            
        } catch (error) {
            console.error(CONFIG.MESSAGES.ERROR_INIT, error);
        }
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();