// ==UserScript==
// @name         Claude Project Files Extractor
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Download/extract all files from a Claude project as a single ZIP
// @author       sharmanhall
// @match        https://claude.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541467/Claude%20Project%20Files%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/541467/Claude%20Project%20Files%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load JSZip from CDN first
    function loadJSZip() {
        return new Promise((resolve, reject) => {
            if (typeof JSZip !== 'undefined') {
                console.log('JSZip already available');
                resolve();
                return;
            }

            console.log('Loading JSZip from CDN...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => {
                console.log('JSZip script loaded');
                setTimeout(() => {
                    if (typeof JSZip !== 'undefined') {
                        console.log('JSZip is now available');
                        resolve();
                    } else {
                        reject(new Error('JSZip loaded but not available'));
                    }
                }, 500);
            };
            script.onerror = () => {
                console.error('Failed to load JSZip');
                reject(new Error('Failed to load JSZip'));
            };
            document.head.appendChild(script);
        });
    }

    // Helper function to wait for modal to appear
    async function waitForModal(timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const modal = document.querySelector('[role="dialog"]');
            if (modal && modal.offsetHeight > 0) {
                // Wait a bit more for content to load
                await new Promise(resolve => setTimeout(resolve, 1000));
                return modal;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

    // Helper function to wait for modal to close
    async function waitForModalClose(timeout = 3000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const modal = document.querySelector('[role="dialog"]');
            if (!modal || modal.offsetHeight === 0) return true;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return false;
    }

    // Function to close modal
    async function closeModal() {
        console.log('🔄 Attempting to close modal...');

        // Try multiple close methods
        const closeSelectors = [
            'button[aria-label*="close"]',
            'button[aria-label*="Close"]',
            '[data-testid*="close"]',
            'button[title*="close"]',
            'button[title*="Close"]',
            '.modal button:last-child',
            '[role="dialog"] button:first-child',
            '[role="dialog"] button[type="button"]'
        ];

        for (const selector of closeSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (const btn of buttons) {
                try {
                    console.log(`Trying close button: ${selector}`);
                    btn.click();
                    await new Promise(resolve => setTimeout(resolve, 300));
                    if (await waitForModalClose(1000)) {
                        console.log('✅ Modal closed successfully');
                        return true;
                    }
                } catch (e) {
                    console.log('Close button failed:', e);
                }
            }
        }

        // Press Escape multiple times
        for (let i = 0; i < 3; i++) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Click outside modal
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
            const rect = modal.getBoundingClientRect();
            document.elementFromPoint(rect.left - 10, rect.top)?.click();
        }

        const closed = await waitForModalClose();
        console.log(closed ? '✅ Modal closed' : '❌ Failed to close modal');
        return closed;
    }

    // Better file name extraction
    function extractFileName(element) {
        const text = element.textContent.trim();
        console.log('🔍 Analyzing element text:', text);

        // Look for common file patterns
        const patterns = [
            // Pattern: filename.ext followed by size info
            /^(.+\.(?:pdf|txt|md|json|xml|csv|doc|docx|xlsx?))\s*\d+\s*lines?/i,
            // Pattern: filename followed by extension indicator
            /^(.+?)\s*\d+\s*lines?\s*(pdf|txt|text|md|json|xml|csv)/i,
            // Pattern: clear filename at start
            /^([^0-9]+?)(?:\s*\d+\s*lines?|$)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                let filename = match[1].trim();
                console.log('📝 Extracted filename:', filename);
                return filename;
            }
        }

        // Fallback: take first meaningful part
        const words = text.split(/\s+/).filter(word =>
            word.length > 2 &&
            !word.match(/^\d+$/) &&
            !word.match(/^(lines?|pdf|txt|text|md|json|xml|csv)$/i)
        );

        if (words.length > 0) {
            const filename = words.slice(0, 3).join(' ');
            console.log('📝 Fallback filename:', filename);
            return filename;
        }

        return 'Unknown_File';
    }

    // Better file type detection
    function detectFileType(filename, content) {
        const lower = filename.toLowerCase();

        // Check filename extension first
        if (lower.includes('.pdf')) return 'pdf.txt';
        if (lower.includes('.json')) return 'json';
        if (lower.includes('.xml')) return 'xml';
        if (lower.includes('.md')) return 'md';
        if (lower.includes('.csv')) return 'csv';
        if (lower.includes('.xlsx') || lower.includes('.xls')) return 'xlsx.txt';
        if (lower.includes('.doc')) return 'doc.txt';
        if (lower.includes('.eml')) return 'eml.txt';

        // Check content patterns
        if (content.includes('{') && content.includes('}') && content.includes('"')) return 'json';
        if (content.includes('<') && content.includes('>')) return 'xml';
        if (content.includes('##') || content.includes('**')) return 'md';
        if (content.includes(',') && content.split('\n').length > 1) return 'csv';

        return 'txt';
    }

    // Better content extraction from modal
    function extractContentFromModal(modal) {
        console.log('📖 Extracting content from modal...');

        // Try different content containers
        const contentSelectors = [
            'pre code',
            'pre',
            '.whitespace-pre-wrap',
            '.font-mono',
            '.overflow-auto pre',
            '.text-sm.whitespace-pre-wrap',
            '[class*="content"]',
            '.modal-body',
            '.dialog-content'
        ];

        for (const selector of contentSelectors) {
            const element = modal.querySelector(selector);
            if (element && element.textContent.trim().length > 50) {
                console.log(`✅ Found content in: ${selector}`);
                return element.textContent.trim();
            }
        }

        // Fallback: get all text but filter out UI elements
        const allText = modal.textContent;
        const lines = allText.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 3)
            .filter(line => !line.match(/^(Close|Download|Export|PDF|TEXT|Select|Cancel|OK|\d+\s*lines?|View|Edit)$/i))
            .filter(line => !line.includes('claude.ai'))
            .filter(line => line.length < 200); // Remove very long UI text

        const content = lines.join('\n').trim();
        console.log(`📄 Extracted ${content.length} characters using fallback method`);
        return content;
    }

    // Find file elements in the project knowledge panel
    function findFileElements() {
        console.log('🔍 Searching for file elements...');

        // Look for elements in the project knowledge area
        const knowledgePanel = document.querySelector('[class*="project"], [class*="knowledge"]') || document;

        // Find clickable elements that look like files
        const selectors = [
            'button[class*="cursor-pointer"]',
            'div[class*="cursor-pointer"]',
            '[role="button"]',
            '.clickable',
            'button[type="button"]'
        ];

        const fileElements = [];

        for (const selector of selectors) {
            const elements = knowledgePanel.querySelectorAll(selector);

            for (const element of elements) {
                const text = element.textContent.trim();

                // Check if this looks like a file
                if (text.includes('lines') ||
                    text.match(/\.(pdf|txt|md|json|xml|csv|doc|docx|xlsx|eml)/i) ||
                    (text.length > 10 && text.length < 200 &&
                     !text.includes('claude.ai') &&
                     !text.match(/^(Export|Download|Close|Cancel|OK|Edit|View|Settings)$/i))) {

                    console.log(`📄 Found potential file: ${text.substring(0, 50)}...`);
                    fileElements.push(element);
                }
            }
        }

        console.log(`✅ Found ${fileElements.length} file elements`);
        return fileElements;
    }

    // Extract project knowledge files
    async function extractProjectFiles() {
        const files = [];

        console.log('🔍 Looking for project knowledge files...');

        const fileElements = findFileElements();

        for (let i = 0; i < fileElements.length; i++) {
            const element = fileElements[i];

            try {
                const rawFilename = extractFileName(element);
                console.log(`\n📄 Processing file ${i + 1}/${fileElements.length}: ${rawFilename}`);

                // Click the element
                console.log('⚡ Clicking element...');
                element.scrollIntoView();
                await new Promise(resolve => setTimeout(resolve, 500));
                element.click();

                // Wait for modal to appear
                console.log('⏳ Waiting for modal...');
                const modal = await waitForModal();

                if (!modal) {
                    console.log('❌ No modal appeared, skipping...');
                    continue;
                }

                // Extract content
                const content = extractContentFromModal(modal);

                if (content.length < 50) {
                    console.log('❌ Content too short, skipping...');
                    await closeModal();
                    continue;
                }

                // Determine file type and create filename
                const fileType = detectFileType(rawFilename, content);
                const cleanFilename = rawFilename
                    .replace(/[^a-zA-Z0-9\s\-_\.]/g, '_')
                    .replace(/\s+/g, '_')
                    .replace(/_+/g, '_')
                    .trim();

                const finalFilename = `${cleanFilename}.${fileType}`;

                console.log(`✅ Extracted ${content.length} characters`);
                console.log(`📁 Final filename: ${finalFilename}`);

                files.push({
                    filename: finalFilename,
                    content: content,
                    originalName: rawFilename
                });

                // Close modal and wait
                await closeModal();
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`❌ Error processing file: ${error}`);
                await closeModal();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`\n🎉 Successfully extracted ${files.length} files`);
        return files;
    }

    // Create and download ZIP
    async function createZIP(files, projectName) {
        try {
            console.log('📦 Creating ZIP with JSZip...');

            if (typeof JSZip === 'undefined') {
                throw new Error('JSZip not available');
            }

            const zip = new JSZip();

            // Add each file to ZIP
            files.forEach((file, index) => {
                console.log(`📁 Adding to ZIP [${index + 1}]: ${file.filename}`);
                zip.file(file.filename, file.content);
            });

            // Add metadata
            const metadata = {
                exportDate: new Date().toISOString(),
                projectTitle: projectName,
                url: window.location.href,
                fileCount: files.length,
                files: files.map(f => ({
                    filename: f.filename,
                    originalName: f.originalName,
                    size: f.content.length
                }))
            };

            zip.file('_export_metadata.json', JSON.stringify(metadata, null, 2));

            console.log('🔄 Generating ZIP blob...');

            // Generate ZIP
            const zipBlob = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 6 }
            });

            console.log(`✅ ZIP created! Size: ${zipBlob.size} bytes`);

            // Download ZIP
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 16);
            const filename = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_export_${timestamp}.zip`;

            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return true;

        } catch (error) {
            console.error('❌ ZIP creation failed:', error);
            return false;
        }
    }

    // Download individual files as fallback
    function downloadIndividualFiles(files, projectName) {
        console.log('📥 Falling back to individual downloads...');

        files.forEach((file, index) => {
            setTimeout(() => {
                const blob = new Blob([file.content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = file.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                console.log(`📥 Downloaded: ${file.filename}`);
            }, index * 500); // Stagger downloads
        });
    }

    // Get project title
    function getProjectTitle() {
        const titleSelectors = [
            'h1',
            '[data-testid*="title"]',
            '.text-xl',
            '.text-2xl',
            '.font-bold',
            'title'
        ];

        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                const title = element.textContent.trim();
                if (title !== 'Claude' && title.length > 2) {
                    return title;
                }
            }
        }

        // Fallback: extract from URL
        const urlMatch = window.location.pathname.match(/\/([^\/]+)$/);
        if (urlMatch) {
            return urlMatch[1].replace(/[-_]/g, ' ');
        }

        return 'Claude_Project';
    }

    // Main export function
    async function exportProject() {
        const button = document.querySelector('#claude-export-btn');

        try {
            // Update button status
            const updateStatus = (msg) => {
                if (button) button.textContent = `🔄 ${msg}`;
                console.log(`\n🚀 ${msg}`);
            };

            updateStatus('Loading ZIP library...');
            await loadJSZip();

            updateStatus('Scanning for files...');
            const files = await extractProjectFiles();

            if (files.length === 0) {
                updateStatus('❌ No files found');
                setTimeout(() => {
                    if (button) button.textContent = '📁 Export Project Files';
                }, 3000);
                return;
            }

            const projectName = getProjectTitle();
            updateStatus(`Creating ZIP (${files.length} files)...`);

            const zipSuccess = await createZIP(files, projectName);

            if (zipSuccess) {
                updateStatus(`✅ ZIP exported! (${files.length} files)`);
                setTimeout(() => {
                    if (button) button.textContent = '📁 Export Project Files';
                }, 3000);
            } else {
                updateStatus('ZIP failed - downloading individual files...');
                downloadIndividualFiles(files, projectName);
                setTimeout(() => {
                    if (button) button.textContent = '📁 Export Project Files';
                }, 3000);
            }

        } catch (error) {
            console.error('💥 Export failed:', error);
            if (button) button.textContent = '❌ Export Failed';
            setTimeout(() => {
                if (button) button.textContent = '📁 Export Project Files';
            }, 3000);
        }
    }

    // Add export button with better styling
    function addExportButton() {
        const existingButton = document.querySelector('#claude-export-btn');
        if (existingButton) existingButton.remove();

        const button = document.createElement('button');
        button.id = 'claude-export-btn';
        button.textContent = '📁 Export Project Files';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10000;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            min-width: 200px;
            text-align: center;
        `;

        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        button.addEventListener('click', exportProject);
        document.body.appendChild(button);

        console.log('✅ Export button added');
    }

    // Initialize
    function init() {
        console.log('🚀 Claude Project Files Extractor - Fixed v3.0');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addExportButton);
        } else {
            addExportButton();
        }

        // Re-add button on navigation
        let currentUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(addExportButton, 1000);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();

})();