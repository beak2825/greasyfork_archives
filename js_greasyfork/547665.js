// ==UserScript==
// @name         HN Markdown Formatter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add support for quotes, bold, underline, code blocks, and bullet points on Hacker News
// @author       sacrosaunt
// @match        http://news.ycombinator.com/*
// @match        https://news.ycombinator.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547665/HN%20Markdown%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/547665/HN%20Markdown%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    const css = `
        /* HN Text Formatter Styles */

        /* Bold text */
        .commtext strong,
        .toptext strong {
          font-weight: bold;
        }

        /* Italic text */
        .commtext em,
        .toptext em {
          font-style: italic;
        }

        /* Underlined text */
        .commtext u,
        .toptext u {
          text-decoration: underline;
        }

        /* Code blocks */
        .commtext pre,
        .toptext pre {
          background-color: #f6f6f6;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 8px 12px;
          margin: 8px 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
          line-height: 1.4;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        /* Inline code */
        .commtext code,
        .toptext code {
          background-color: #f6f6f6;
          border: 1px solid #ddd;
          border-radius: 2px;
          padding: 1px 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
        }

        /* Don't double-style code inside pre blocks */
        .commtext pre code,
        .toptext pre code {
          background: none;
          border: none;
          padding: 0;
        }

        /* Blockquotes */
        .commtext blockquote,
        .toptext blockquote {
          border-left: 4px solid #ccc;
          margin: 8px 0;
          padding: 4px 0 4px 12px;
          color: #666;
          font-style: italic;
        }

        /* Bullet points */
        .commtext ul,
        .toptext ul {
          margin: 8px 0;
          padding-left: 20px;
        }

        .commtext ul li,
        .toptext ul li {
          list-style-type: disc;
          margin: 2px 0;
        }

        /* Nested lists */
        .commtext ul ul,
        .toptext ul ul {
          margin: 2px 0;
          padding-left: 16px;
        }

        .commtext ul ul li,
        .toptext ul ul li {
          list-style-type: circle;
        }

        /* Ordered lists */
        .commtext ol,
        .toptext ol {
          margin: 8px 0;
          padding-left: 20px;
        }

        .commtext ol li,
        .toptext ol li {
          list-style-type: decimal;
          margin: 2px 0;
        }

        /* Ensure proper spacing for formatted elements */
        .commtext p,
        .toptext p {
          margin: 8px 0;
        }

        .commtext p:first-child,
        .toptext p:first-child {
          margin-top: 0;
        }

        .commtext p:last-child,
        .toptext p:last-child {
          margin-bottom: 0;
        }
    `;

    // Create and inject style element
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Function to parse and format text with markdown-like syntax
    function formatText(text) {
        // Process blockquotes BEFORE escaping HTML (since we need to match >)
        text = text.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');
        
        // Escape HTML to prevent XSS (but preserve our blockquote tags)
        text = text.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  // Restore blockquote tags
                  .replace(/&lt;blockquote&gt;/g, '<blockquote>')
                  .replace(/&lt;\/blockquote&gt;/g, '</blockquote>');

        // Code blocks (triple backticks)
        text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Inline code (single backticks)
        text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        
        // Bold text (**text** or __text__)
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        // Italic text (*text* or _text_)
        text = text.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
        text = text.replace(/_([^_\n]+)_/g, '<em>$1</em>');
        
        // Underlined text (~text~)
        text = text.replace(/~([^~\n]+)~/g, '<u>$1</u>');
        
        // Bullet points (- item or * item)
        const lines = text.split('\n');
        let inList = false;
        let formattedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
            
            if (bulletMatch) {
                const indent = bulletMatch[1].length;
                const content = bulletMatch[2];
                
                if (!inList) {
                    formattedLines.push('<ul>');
                    inList = true;
                }
                
                formattedLines.push(`<li>${content}</li>`);
            } else {
                if (inList && line.trim() === '') {
                    // Empty line in list - continue list
                    formattedLines.push('');
                } else if (inList) {
                    // Non-bullet line - end list
                    formattedLines.push('</ul>');
                    inList = false;
                    formattedLines.push(line);
                } else {
                    formattedLines.push(line);
                }
            }
        }
        
        // Close any open list
        if (inList) {
            formattedLines.push('</ul>');
        }
        
        text = formattedLines.join('\n');
        
        // Convert line breaks to paragraphs
        text = text.replace(/\n\n+/g, '</p><p>');
        text = '<p>' + text + '</p>';
        
        // Clean up empty paragraphs
        text = text.replace(/<p><\/p>/g, '');
        text = text.replace(/<p>\s*<\/p>/g, '');
        
        return text;
    }

    // Function to decode HTML entities
    function decodeHtmlEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    // Function to process entire comment element
    function processElement(element) {
        // Skip if already processed
        if (element.hasAttribute('data-hn-processed')) {
            return;
        }
        
        // Get the raw HTML content
        let htmlContent = element.innerHTML;
        
        // Store links temporarily to preserve them
        const links = [];
        let linkIndex = 0;
        htmlContent = htmlContent.replace(/<a[^>]*>.*?<\/a>/g, function(match) {
            const placeholder = `HNFORMATTERLINK${linkIndex}HNFORMATTERLINK`;
            links[linkIndex] = match;
            linkIndex++;
            return placeholder;
        });
        
        // Decode HTML entities to get back the original text
        let textContent = decodeHtmlEntities(htmlContent);
        
        // Remove any existing HN formatting tags
        textContent = textContent.replace(/<\/?i>/g, '');
        textContent = textContent.replace(/<\/?b>/g, '');
        textContent = textContent.replace(/<\/?em>/g, '');
        textContent = textContent.replace(/<\/?strong>/g, '');
        
        // Preserve paragraph breaks
        textContent = textContent.replace(/<p>/g, '\n\n');
        textContent = textContent.replace(/<\/p>/g, '');
        textContent = textContent.replace(/<br\s*\/?>/g, '\n');
        
        // Clean up extra whitespace
        textContent = textContent.replace(/^\s+|\s+$/g, '');
        textContent = textContent.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        // Check if text contains formatting syntax
        const hasFormatting = /(\*\*.*?\*\*|__.*?__|`.*?`|```[\s\S]*?```|\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~|^>\s*.+$|^\s*[-*]\s+.+$)/m.test(textContent);
        
        if (hasFormatting) {
            let formattedHTML = formatText(textContent);
            
            // Restore links
            for (let i = 0; i < links.length; i++) {
                formattedHTML = formattedHTML.replace(`HNFORMATTERLINK${i}HNFORMATTERLINK`, links[i]);
            }
            
            element.innerHTML = formattedHTML;
            element.setAttribute('data-hn-formatted', 'true');
        } else {
            // Even if no formatting, restore links
            for (let i = 0; i < links.length; i++) {
                textContent = textContent.replace(`HNFORMATTERLINK${i}HNFORMATTERLINK`, links[i]);
            }
            if (links.length > 0) {
                element.innerHTML = textContent;
            }
        }
    }

    // Function to process comments and posts
    function processHNContent() {
        // Process comment text
        const commentElements = document.querySelectorAll('.commtext:not([data-hn-processed])');
        commentElements.forEach(element => {
            processElement(element);
            element.setAttribute('data-hn-processed', 'true');
        });

        // Process post text (story text)
        const postElements = document.querySelectorAll('.toptext:not([data-hn-processed])');
        postElements.forEach(element => {
            processElement(element);
            element.setAttribute('data-hn-processed', 'true');
        });
    }

    // Initial processing
    processHNContent();

    // Watch for dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if new comments or posts were added
                        if (node.querySelector && 
                            (node.querySelector('.commtext') || node.querySelector('.toptext') ||
                             node.classList.contains('commtext') || node.classList.contains('toptext'))) {
                            shouldProcess = true;
                        }
                    }
                });
            }
        });
        
        if (shouldProcess) {
            setTimeout(processHNContent, 100);
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also process when page becomes visible (for back/forward navigation)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(processHNContent, 100);
        }
    });

})();
