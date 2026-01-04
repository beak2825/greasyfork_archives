// ==UserScript==
// @name         Perplexity Code Blocks Archiver
// @namespace    http://tampermonkey.net/
// @version      1.4.88
// @description  Download code as zip
// @author       Karasiq
// @match        https://www.perplexity.ai/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/545738/Perplexity%20Code%20Blocks%20Archiver.user.js
// @updateURL https://update.greasyfork.org/scripts/545738/Perplexity%20Code%20Blocks%20Archiver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selectors for current markup
    const RESPONSE_SELECTOR = 'div[class*="pb-md"][class*="mx-auto"][class*="pt-5"][class*="border-b"]';
    const CONTENT_SELECTOR = 'div[id^="markdown-content-"]';
    const CODE_BLOCK_SELECTOR = 'pre.not-prose code';
    const LANGUAGE_INDICATOR_SELECTOR = '[data-testid="code-language-indicator"]';

    // Collapse settings
    const COLLAPSE_THRESHOLD = 10;

    // Maximum compression settings for JSZip
    const MAX_COMPRESSION_OPTIONS = {
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9,
            chunkSize: 1024,
            windowBits: 15,
            memLevel: 9,
            strategy: 0
        },
        streamFiles: false,
        platform: 'UNIX'
    };

    // Extended language mapping to extensions
    const langExtensions = {
        python: 'py', javascript: 'js', typescript: 'ts', java: 'java',
        scala: 'scala', kotlin: 'kt', cpp: 'cpp', c: 'c', 'c++': 'cpp',
        csharp: 'cs', 'c#': 'cs', go: 'go', rust: 'rs', php: 'php',
        ruby: 'rb', swift: 'swift', bash: 'sh', shell: 'sh', zsh: 'sh',
        fish: 'fish', powershell: 'ps1', pwsh: 'ps1', 'power-shell': 'ps1',
        batch: 'bat', cmd: 'bat', html: 'html', css: 'css', scss: 'scss',
        sass: 'sass', less: 'less', json: 'json', yaml: 'yml', yml: 'yml',
        toml: 'toml', ini: 'ini', xml: 'xml', sql: 'sql', mysql: 'sql',
        postgresql: 'sql', sqlite: 'sql', markdown: 'md', tex: 'tex',
        latex: 'tex', haskell: 'hs', erlang: 'erl', elixir: 'ex',
        clojure: 'clj', lisp: 'lisp', scheme: 'scm', dockerfile: 'dockerfile',
        makefile: 'mk', cmake: 'cmake', text: 'txt', plain: 'txt', txt: 'txt'
    };

    // Add CSS styles
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .code-collapse-wrapper {
                position: relative;
            }
            
            .code-collapse-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                z-index: 100;
                transition: all 0.2s ease;
                font-family: monospace;
            }
            
            .code-collapse-btn:hover {
                background: rgba(0, 0, 0, 0.9);
            }
            
            .code-collapsed {
                max-height: 200px;
                overflow: hidden;
                position: relative;
            }
            
            .code-collapsed::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 50px;
                background: linear-gradient(transparent, rgba(255, 255, 255, 0.9));
                pointer-events: none;
            }
            
            .code-collapsed.dark::after {
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
            }
            
            .compression-info {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10000;
                transition: opacity 0.3s ease;
                font-family: monospace;
            }
        `;
        document.head.appendChild(style);
    }

    // Show compression ratio indicator
    function showCompressionInfo(originalSize, compressedSize) {
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        const info = document.createElement('div');
        info.className = 'compression-info';
        info.textContent = `Compression: ${formatSize(originalSize)} → ${formatSize(compressedSize)} (${ratio}%)`;
        
        document.body.appendChild(info);
        
        setTimeout(() => {
            info.style.opacity = '0';
            setTimeout(() => info.remove(), 300);
        }, 3000);
    }

    // Format file size
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // Sanitize path/filename
    function sanitizePath(path) {
        return path
            .replace(/[<>:"|?*]/g, '_')
            .replace(/\\/g, '/')
            .replace(/\/+/g, '/')
            .replace(/^\/+|\/+$/g, '');
    }

    // Convert HTML to Markdown
    function htmlToMarkdown(element) {
        let markdown = '';
        
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                markdown += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                const text = node.textContent.trim();
                
                switch (tag) {
                    case 'h1':
                        markdown += `# ${text}\n\n`;
                        break;
                    case 'h2':
                        markdown += `## ${text}\n\n`;
                        break;
                    case 'h3':
                        markdown += `### ${text}\n\n`;
                        break;
                    case 'h4':
                        markdown += `#### ${text}\n\n`;
                        break;
                    case 'h5':
                        markdown += `##### ${text}\n\n`;
                        break;
                    case 'h6':
                        markdown += `###### ${text}\n\n`;
                        break;
                    case 'p':
                        markdown += `${htmlToMarkdown(node)}\n\n`;
                        break;
                    case 'strong':
                    case 'b':
                        markdown += `**${text}**`;
                        break;
                    case 'em':
                    case 'i':
                        markdown += `*${text}*`;
                        break;
                    case 'code':
                        if (node.closest('pre')) {
                            const language = getCodeLanguage(node) || '';
                            markdown += `\`\`\`${language}\n${text}\n\`\`\`\n\n`;
                        } else {
                            markdown += `\`${text}\``;
                        }
                        break;
                    case 'pre':
                        break;
                    case 'ul':
                        for (const li of node.querySelectorAll('li')) {
                            markdown += `- ${htmlToMarkdown(li)}\n`;
                        }
                        markdown += '\n';
                        break;
                    case 'ol':
                        const items = node.querySelectorAll('li');
                        items.forEach((li, index) => {
                            markdown += `${index + 1}. ${htmlToMarkdown(li)}\n`;
                        });
                        markdown += '\n';
                        break;
                    case 'li':
                        markdown += htmlToMarkdown(node);
                        break;
                    case 'blockquote':
                        const lines = htmlToMarkdown(node).split('\n');
                        markdown += lines.map(line => line.trim() ? `> ${line}` : '>').join('\n') + '\n\n';
                        break;
                    case 'hr':
                        markdown += '---\n\n';
                        break;
                    case 'a':
                        const href = node.href;
                        if (href && href !== text) {
                            markdown += `[${text}](${href})`;
                        } else {
                            markdown += text;
                        }
                        break;
                    case 'br':
                        markdown += '\n';
                        break;
                    default:
                        markdown += htmlToMarkdown(node);
                        break;
                }
            }
        }
        
        return markdown;
    }

    // Extract full response in markdown
    function extractFullResponse(responseElement) {
        const contentArea = responseElement.querySelector(CONTENT_SELECTOR);
        if (!contentArea) return '';

        const clone = contentArea.cloneNode(true);
        clone.querySelectorAll('.archive-code-btn, .code-collapse-btn').forEach(btn => btn.remove());
        
        return htmlToMarkdown(clone).trim();
    }

    // Format date for filename
    function formatDateForFilename(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}_${hours}-${minutes}`;
    }

    // Normalize language name
    function normalizeLanguage(lang) {
        if (!lang) return 'txt';
        
        const normalized = lang.toLowerCase()
            .replace(/[-_\s]/g, '')
            .replace(/script$/, '');
            
        const aliases = {
            'py': 'python', 'js': 'javascript', 'ts': 'typescript',
            'ps1': 'powershell', 'powershell': 'powershell', 'pwsh': 'powershell',
            'cs': 'csharp', 'rb': 'ruby', 'kt': 'kotlin',
            'sh': 'bash', 'zsh': 'bash', 'fish': 'fish'
        };
        
        return aliases[normalized] || normalized;
    }

    // Get language for code block
    function getCodeLanguage(codeElement) {
        const codeWrapper = codeElement.closest('.codeWrapper') || codeElement.closest('pre');
        if (codeWrapper) {
            const langIndicator = codeWrapper.querySelector(LANGUAGE_INDICATOR_SELECTOR);
            if (langIndicator) {
                return normalizeLanguage(langIndicator.textContent.trim());
            }
        }

        if (codeElement.dataset.language) {
            return normalizeLanguage(codeElement.dataset.language);
        }

        const classMatch = codeElement.className.match(/(?:language-|lang-)([^\s]+)/);
        if (classMatch) {
            return normalizeLanguage(classMatch[1]);
        }

        const content = codeElement.innerText.trim();
        if (content.includes('#!/bin/bash') || content.includes('#!/bin/sh')) return 'bash';
        if (content.includes('#!') && content.includes('python')) return 'python';
        if (content.includes('<?php')) return 'php';

        return 'txt';
    }

    // Extract file path from comments
    function extractFilePathFromCode(content) {
        const lines = content.split('\n');
        
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            const line = lines[i].trim();
            
            const pathPatterns = [
                /^#\s*([a-zA-Z0-9_.\/-]+\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)/,
                /^\/\/\s*([a-zA-Z0-9_.\/-]+\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)/,
                /^\/\*\s*([a-zA-Z0-9_.\/-]+\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)/,
                /^--\s*([a-zA-Z0-9_.\/-]+\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)/,
                /^<!\-\-\s*([a-zA-Z0-9_.\/-]+\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)/,
                /^(?:файл|file):\s*([a-zA-Z0-9_.\/-]+\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)/i,
                /^([a-zA-Z0-9_.\/-]+\/[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)\s*$/
            ];
            
            for (const pattern of pathPatterns) {
                const match = line.match(pattern);
                if (match && match[1]) {
                    const path = match[1];
                    if (path.includes('/') && path.includes('.')) {
                        return sanitizePath(path);
                    }
                }
            }
        }
        
        return null;
    }

    // Generate file path considering folder structure
    function generateCodeFilepath(codeElement, index, language) {
        if (codeElement.dataset.filename) {
            return sanitizePath(codeElement.dataset.filename);
        }

        const content = codeElement.innerText.trim();
        
        const extractedPath = extractFilePathFromCode(content);
        if (extractedPath) {
            return extractedPath;
        }

        if (language.includes('/')) {
            return sanitizePath(language);
        }

        const firstLine = content.split('\n')[0].trim();
        const simpleFilenamePatterns = [
            /^#\s*([a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)$/,
            /^\/\/\s*([a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)$/,
            /^\/\*\s*([a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)/,
            /^--\s*([a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)$/,
            /^<!\-\-\s*([a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+)/
        ];
        
        for (const pattern of simpleFilenamePatterns) {
            const match = firstLine.match(pattern);
            if (match && match[1] && match[1].includes('.')) {
                return sanitizePath(match[1]);
            }
        }

        const extension = langExtensions[language] || 'txt';
        
        if (language === 'dockerfile' || content.toLowerCase().includes('from ')) {
            return 'Dockerfile';
        }
        if (language === 'makefile' || content.includes('all:') || content.includes('.PHONY:')) {
            return 'Makefile';
        }

        return `code_${index + 1}.${extension}`;
    }

    // Collapse long code blocks
    function addCollapseToCodeBlocks() {
        const codeBlocks = document.querySelectorAll(CODE_BLOCK_SELECTOR);
        
        codeBlocks.forEach(codeElement => {
            if (codeElement.querySelector('.code-collapse-btn')) return;
            
            const lines = codeElement.innerText.trim().split('\n');
            if (lines.length <= COLLAPSE_THRESHOLD) return;

            const preElement = codeElement.closest('pre');
            if (!preElement) return;

            if (!preElement.classList.contains('code-collapse-wrapper')) {
                preElement.classList.add('code-collapse-wrapper');
                preElement.style.position = 'relative';
            }

            const collapseBtn = document.createElement('button');
            collapseBtn.className = 'code-collapse-btn';
            collapseBtn.textContent = 'Collapse';
            
            let isCollapsed = lines.length > 20;
            
            if (isCollapsed) {
                preElement.classList.add('code-collapsed');
                collapseBtn.textContent = `Expand (${lines.length} lines)`;
            }

            collapseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                isCollapsed = !isCollapsed;
                
                if (isCollapsed) {
                    preElement.classList.add('code-collapsed');
                    collapseBtn.textContent = `Expand (${lines.length} lines)`;
                } else {
                    preElement.classList.remove('code-collapsed');
                    collapseBtn.textContent = 'Collapse';
                }
            });

            preElement.appendChild(collapseBtn);
        });
    }

    // Add archive buttons
    function addArchiveButtons() {
        const responses = document.querySelectorAll(RESPONSE_SELECTOR);
        
        responses.forEach((response, index) => {
            if (response.querySelector('.archive-code-btn')) return;

            const contentArea = response.querySelector(CONTENT_SELECTOR);
            if (!contentArea) return;

            const codeBlocks = contentArea.querySelectorAll(CODE_BLOCK_SELECTOR);
            if (codeBlocks.length === 0) return;

            const button = document.createElement('button');
            button.textContent = `📦 ${codeBlocks.length} block${codeBlocks.length > 1 ? 's' : ''}`;
            button.className = 'archive-code-btn';
            
            Object.assign(button.style, {
                position: 'absolute',
                top: '15px',
                right: '15px',
                zIndex: '1000',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            });

            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#1d4ed8';
                button.style.transform = 'translateY(-1px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#2563eb';
                button.style.transform = 'translateY(0)';
            });

            button.addEventListener('click', () => archiveCodeBlocks(response, index + 1, button));

            const relativeContainer = response.querySelector('.relative') || response;
            if (getComputedStyle(relativeContainer).position === 'static') {
                relativeContainer.style.position = 'relative';
            }
            relativeContainer.appendChild(button);
        });
    }

    // Archive code blocks with maximum compression
    async function archiveCodeBlocks(responseElement, responseNumber, button) {
        const originalText = button.textContent;
        button.disabled = true;
        button.style.opacity = '0.7';
        button.textContent = '⏳ Processing...';

        try {
            const zip = new JSZip();
            const contentArea = responseElement.querySelector(CONTENT_SELECTOR);
            const codeBlocks = contentArea.querySelectorAll(CODE_BLOCK_SELECTOR);

            let processedCount = 0;
            let totalOriginalSize = 0;
            const usedFilepaths = new Set();

            // Process each code block
            codeBlocks.forEach((codeElement, index) => {
                const codeText = codeElement.innerText.trim();
                
                if (codeText.length < 10) return;

                const language = getCodeLanguage(codeElement);
                let filepath = generateCodeFilepath(codeElement, index, language);

                // Check filepath uniqueness
                let counter = 1;
                let originalFilepath = filepath;
                while (usedFilepaths.has(filepath)) {
                    const pathParts = originalFilepath.split('/');
                    const filename = pathParts.pop();
                    const dir = pathParts.join('/');
                    
                    const parts = filename.split('.');
                    if (parts.length > 1) {
                        const ext = parts.pop();
                        const newFilename = `${parts.join('.')}_${counter}.${ext}`;
                        filepath = dir ? `${dir}/${newFilename}` : newFilename;
                    } else {
                        const newFilename = `${filename}_${counter}`;
                        filepath = dir ? `${dir}/${newFilename}` : newFilename;
                    }
                    counter++;
                }
                usedFilepaths.add(filepath);

                zip.file(filepath, codeText, {
                    compression: 'DEFLATE',
                    compressionOptions: { level: 9 }
                });
                
                totalOriginalSize += new Blob([codeText]).size;
                processedCount++;

                button.textContent = `⏳ ${index + 1}/${codeBlocks.length}`;
            });

            if (processedCount === 0) {
                button.textContent = '❌ No code';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.opacity = '1';
                }, 2000);
                return;
            }

            // Create .ai_history folder and save full response
            const now = new Date();
            const dateStr = formatDateForFilename(now);
            const fullResponse = extractFullResponse(responseElement);
            
            // Minimal README content - only URL
            const aiHistoryContent = `${window.location.href}

---

${fullResponse}`;

            totalOriginalSize += new Blob([aiHistoryContent]).size;
            
            zip.file(`.ai_history/${dateStr}_response_${responseNumber}.md`, aiHistoryContent, {
                compression: 'DEFLATE',
                compressionOptions: { level: 9 }
            });

            button.textContent = '⏳ Compressing...';
            
            const zipBlob = await zip.generateAsync(MAX_COMPRESSION_OPTIONS);

            showCompressionInfo(totalOriginalSize, zipBlob.size);

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(zipBlob);
            downloadLink.download = `perplexity_code_${responseNumber}_${dateStr}_max.zip`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadLink.href);

            button.textContent = '✅ Done';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.opacity = '1';
            }, 3000);

        } catch (error) {
            console.error('Archiving error:', error);
            button.textContent = '❌ Error';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.opacity = '1';
            }, 3000);
        }
    }

    // Initialize
    function init() {
        addStyles();
        addArchiveButtons();
        addCollapseToCodeBlocks();

        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.matches && (
                                node.matches(RESPONSE_SELECTOR) || 
                                node.matches(CODE_BLOCK_SELECTOR) ||
                                node.querySelector && (
                                    node.querySelector(RESPONSE_SELECTOR) || 
                                    node.querySelector(CODE_BLOCK_SELECTOR)
                                )
                            )) {
                                needsUpdate = true;
                            }
                        }
                    });
                }
            });

            if (needsUpdate) {
                setTimeout(() => {
                    addArchiveButtons();
                    addCollapseToCodeBlocks();
                }, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(() => {
            addArchiveButtons();
            addCollapseToCodeBlocks();
        }, 5000);
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();
