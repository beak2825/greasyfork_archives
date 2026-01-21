// ==UserScript==
// @name         Claude Project Files Extractor
// @namespace    http://tampermonkey.net/
// @version      4.0.0
// @description  Download/extract all files from a Claude project as a single ZIP - Fixed filenames, PDF support, CSV handling
// @author       sharmanhall
// @match        https://claude.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541467/Claude%20Project%20Files%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/541467/Claude%20Project%20Files%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // CHANGELOG v4.0.0
    // ============================================================
    // - Complete rewrite of filename extraction logic
    // - Fixed duplicate extension bug (.md.md.md -> .md)
    // - Added PDF export via modal download link
    // - Added CSV handling with fallback to unexportable status
    // - Clean collision handling with __2, __3 suffixes
    // - Comprehensive metadata with export method tracking
    // - Verbose logging throughout
    // ============================================================

    // ============================================================
    // SELECTOR MAP (matched to provided DOM snippets)
    // ============================================================
    // FILE_GRID_CONTAINER: ul.grid - contains all file cards
    // TEXT_FILE_CARD: [data-testid="file-thumbnail"] button - clickable text file card
    // PDF_FILE_CARD: div[data-testid$=".pdf"] button, .group\/thumbnail div[data-testid] button - PDF thumbnails
    // FILENAME_H3: h3.text-\[12px\] - filename text in text cards
    // TYPE_BADGE: p.uppercase.truncate - file type indicator (md, txt, pdf, csv)
    // LINE_COUNT: p.text-\[10px\] - shows "X lines"
    // PDF_IMG_ALT: img[alt$=".pdf"] - PDF thumbnail image with filename in alt
    // MODAL_DIALOG: [role="dialog"] - opened modal
    // PDF_DOWNLOAD_LINK: a[href*="/document_pdf"] - PDF download link in modal
    // MODAL_CONTENT: pre code, pre, .whitespace-pre-wrap - text content in modal
    // MODAL_CLOSE: button with X icon, first button in modal header
    // ============================================================

    const CONFIG = {
        SCROLL_WAIT_MS: 1500,
        MODAL_WAIT_MS: 2000,
        MODAL_CONTENT_WAIT_MS: 1000,
        BETWEEN_FILES_MS: 800,
        MAX_SCROLL_ATTEMPTS: 20,
        MIN_CONTENT_LENGTH: 10
    };

    const LOG_PREFIX = '[Claude Exporter]';

    // Logging utilities
    const log = {
        info: (msg, ...args) => console.log(`${LOG_PREFIX} ℹ️ ${msg}`, ...args),
        success: (msg, ...args) => console.log(`${LOG_PREFIX} ✅ ${msg}`, ...args),
        warn: (msg, ...args) => console.warn(`${LOG_PREFIX} ⚠️ ${msg}`, ...args),
        error: (msg, ...args) => console.error(`${LOG_PREFIX} ❌ ${msg}`, ...args),
        debug: (msg, ...args) => console.log(`${LOG_PREFIX} 🔍 ${msg}`, ...args),
        file: (domName, normalizedName, type, strategy, status) => {
            const emoji = status === 'success' ? '✅' : status === 'failed' ? '❌' : '⚠️';
            console.log(`${LOG_PREFIX} ${emoji} FILE: "${domName}" → "${normalizedName}" [${type}] via ${strategy} = ${status}`);
        }
    };

    // ============================================================
    // FILENAME NORMALIZATION
    // ============================================================

    /**
     * Normalize a filename for cross-platform compatibility
     * - Removes illegal characters for Windows/macOS
     * - Collapses duplicate extensions
     * - Handles collision suffixes properly
     */
    function normalizeFilename(rawName) {
        if (!rawName || typeof rawName !== 'string') {
            return 'unnamed_file';
        }

        let name = rawName.trim();

        // Step 1: Remove illegal characters (Windows/macOS)
        // Illegal: \ / : * ? " < > | and control chars (0x00-0x1F)
        name = name.replace(/[\\/:*?"<>|]/g, '_');
        name = name.replace(/[\x00-\x1F]/g, '');

        // Step 2: Collapse multiple spaces/underscores
        name = name.replace(/\s+/g, ' ');
        name = name.replace(/_+/g, '_');
        name = name.replace(/[ _]+/g, '_');

        // Step 3: Trim trailing dots and spaces (Windows issue)
        name = name.replace(/[. ]+$/, '');
        name = name.replace(/^[. ]+/, '');

        // Step 4: Fix duplicate extensions
        name = collapseDuplicateExtensions(name);

        // Step 5: Ensure we have something
        if (!name || name === '_') {
            name = 'unnamed_file';
        }

        return name;
    }

    /**
     * Collapse duplicate extensions like .md.md.md -> .md
     * Also handles cases like .csvcsv -> .csv
     */
    function collapseDuplicateExtensions(filename) {
        // Known extensions to check for duplicates
        const extensions = ['md', 'txt', 'csv', 'json', 'xml', 'pdf', 'docx', 'doc', 'xlsx', 'xls', 'srt', 'html', 'htm'];

        let result = filename;

        for (const ext of extensions) {
            // Pattern: .ext.ext.ext... at end of filename -> .ext
            const repeatedExtPattern = new RegExp(`(\\.${ext})+$`, 'gi');
            result = result.replace(repeatedExtPattern, `.${ext}`);

            // Pattern: extextSelect_file or similar garbage
            const garbagePattern = new RegExp(`\\.${ext}${ext}[A-Za-z_]*`, 'gi');
            result = result.replace(garbagePattern, `.${ext}`);
        }

        // Handle weird patterns like "txt9_.csv" -> remove the garbage
        result = result.replace(/\d+_\.(csv|txt|md)$/i, '.$1');

        return result;
    }

    /**
     * Get the extension from a filename (lowercase, without dot)
     */
    function getExtension(filename) {
        const match = filename.match(/\.([a-zA-Z0-9]+)$/);
        return match ? match[1].toLowerCase() : null;
    }

    /**
     * Check if filename already has a valid extension
     */
    function hasValidExtension(filename) {
        const validExts = ['md', 'txt', 'csv', 'json', 'xml', 'pdf', 'docx', 'doc', 'xlsx', 'xls', 'srt', 'html', 'htm', 'js', 'py', 'ts', 'jsx', 'tsx', 'css', 'scss'];
        const ext = getExtension(filename);
        return ext && validExts.includes(ext);
    }

    /**
     * Add extension only if needed
     */
    function ensureExtension(filename, detectedType) {
        if (hasValidExtension(filename)) {
            return filename;
        }

        // Map type badge to extension
        const typeToExt = {
            'md': 'md',
            'txt': 'txt',
            'text': 'txt',
            'csv': 'csv',
            'pdf': 'pdf',
            'docx': 'docx',
            'doc': 'doc',
            'xlsx': 'xlsx',
            'xls': 'xls',
            'json': 'json',
            'xml': 'xml',
            'html': 'html'
        };

        const ext = typeToExt[detectedType?.toLowerCase()] || 'txt';
        return `${filename}.${ext}`;
    }

    // ============================================================
    // COLLISION HANDLING
    // ============================================================

    /**
     * Handle filename collisions by adding __2, __3, etc. BEFORE extension
     */
    function handleCollision(filename, usedNames) {
        if (!usedNames.has(filename.toLowerCase())) {
            usedNames.add(filename.toLowerCase());
            return filename;
        }

        const ext = getExtension(filename);
        const base = ext ? filename.slice(0, -(ext.length + 1)) : filename;

        let counter = 2;
        let newName;
        do {
            newName = ext ? `${base}__${counter}.${ext}` : `${base}__${counter}`;
            counter++;
        } while (usedNames.has(newName.toLowerCase()));

        usedNames.add(newName.toLowerCase());
        return newName;
    }

    // ============================================================
    // JSZip LOADER
    // ============================================================

    function loadJSZip() {
        return new Promise((resolve, reject) => {
            if (typeof JSZip !== 'undefined') {
                log.debug('JSZip already loaded');
                resolve();
                return;
            }

            log.info('Loading JSZip from CDN...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => {
                setTimeout(() => {
                    if (typeof JSZip !== 'undefined') {
                        log.success('JSZip loaded');
                        resolve();
                    } else {
                        reject(new Error('JSZip loaded but not available'));
                    }
                }, 300);
            };
            script.onerror = () => reject(new Error('Failed to load JSZip'));
            document.head.appendChild(script);
        });
    }

    // ============================================================
    // DOM UTILITIES
    // ============================================================

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForElement(selector, parent = document, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const el = parent.querySelector(selector);
            if (el) return el;
            await sleep(100);
        }
        return null;
    }

    async function waitForModal(timeout = CONFIG.MODAL_WAIT_MS) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const modal = document.querySelector('[role="dialog"]');
            if (modal && modal.offsetHeight > 0) {
                await sleep(CONFIG.MODAL_CONTENT_WAIT_MS);
                return modal;
            }
            await sleep(100);
        }
        return null;
    }

    async function closeModal() {
        log.debug('Closing modal...');

        // Method 1: Find close button (X button in header)
        const closeSelectors = [
            '[role="dialog"] button[type="button"]:first-of-type',
            '[role="dialog"] button svg[viewBox="0 0 20 20"]',
            'button[aria-label*="close" i]',
            'button[aria-label*="Close" i]'
        ];

        for (const selector of closeSelectors) {
            try {
                const btn = document.querySelector(selector);
                if (btn) {
                    const clickTarget = btn.closest('button') || btn;
                    clickTarget.click();
                    await sleep(300);
                    if (!document.querySelector('[role="dialog"]')) {
                        log.debug('Modal closed via button');
                        return true;
                    }
                }
            } catch (e) { /* continue */ }
        }

        // Method 2: Escape key
        for (let i = 0; i < 3; i++) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            await sleep(200);
            if (!document.querySelector('[role="dialog"]')) {
                log.debug('Modal closed via Escape');
                return true;
            }
        }

        // Method 3: Click overlay
        const overlay = document.querySelector('.fixed.z-modal.inset-0');
        if (overlay) {
            const rect = overlay.getBoundingClientRect();
            overlay.click();
            await sleep(300);
        }

        const closed = !document.querySelector('[role="dialog"]');
        log.debug(closed ? 'Modal closed' : 'Failed to close modal');
        return closed;
    }

    // ============================================================
    // FILE DISCOVERY
    // ============================================================

    /**
     * Find all file cards in the project, handling lazy loading
     */
    async function discoverAllFiles(statusCallback) {
        log.info('Discovering files...');
        statusCallback?.('Scanning for files...');

        const fileGrid = document.querySelector('ul.grid');
        if (!fileGrid) {
            log.error('File grid not found');
            return [];
        }

        let lastCount = 0;
        let stableCount = 0;

        // Scroll to load all files
        for (let attempt = 0; attempt < CONFIG.MAX_SCROLL_ATTEMPTS; attempt++) {
            fileGrid.scrollTop = fileGrid.scrollHeight;
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(CONFIG.SCROLL_WAIT_MS);

            const currentCount = fileGrid.querySelectorAll(':scope > div').length;
            log.debug(`Scroll attempt ${attempt + 1}: found ${currentCount} file cards`);

            if (currentCount === lastCount) {
                stableCount++;
                if (stableCount >= 3) {
                    log.info(`File count stable at ${currentCount}`);
                    break;
                }
            } else {
                stableCount = 0;
            }
            lastCount = currentCount;
        }

        // Now collect all file cards
        const fileCards = [];
        const cardContainers = fileGrid.querySelectorAll(':scope > div');

        for (const container of cardContainers) {
            const fileInfo = extractFileInfo(container);
            if (fileInfo) {
                fileCards.push({ element: container, ...fileInfo });
            }
        }

        log.success(`Discovered ${fileCards.length} files`);
        return fileCards;
    }

    /**
     * Extract file information from a card element
     */
    function extractFileInfo(cardContainer) {
        // Check for PDF first (has data-testid on inner div or img with .pdf alt)
        const pdfTestId = cardContainer.querySelector('div[data-testid$=".pdf"]');
        const pdfImg = cardContainer.querySelector('img[alt$=".pdf"]');

        if (pdfTestId || pdfImg) {
            // It's a PDF
            let filename;
            if (pdfTestId) {
                filename = pdfTestId.getAttribute('data-testid');
            } else if (pdfImg) {
                filename = pdfImg.getAttribute('alt');
            }

            if (filename) {
                return {
                    domFilename: filename,
                    type: 'pdf',
                    isPdf: true,
                    lineCount: null
                };
            }
        }

        // Check for text-based file (has [data-testid="file-thumbnail"])
        const fileThumbnail = cardContainer.querySelector('[data-testid="file-thumbnail"]');
        if (fileThumbnail) {
            const h3 = fileThumbnail.querySelector('h3');
            const typeBadge = fileThumbnail.querySelector('p.uppercase');
            const lineCountEl = fileThumbnail.querySelector('p.text-\\[10px\\]');

            if (h3) {
                const filename = h3.textContent.trim();
                const type = typeBadge?.textContent?.trim()?.toLowerCase() || 'txt';
                const lineCount = lineCountEl?.textContent?.trim() || null;

                return {
                    domFilename: filename,
                    type: type,
                    isPdf: false,
                    lineCount: lineCount
                };
            }
        }

        // Fallback: try to find any filename
        const anyH3 = cardContainer.querySelector('h3');
        const anyTypeBadge = cardContainer.querySelector('p.uppercase');
        if (anyH3) {
            return {
                domFilename: anyH3.textContent.trim(),
                type: anyTypeBadge?.textContent?.trim()?.toLowerCase() || 'txt',
                isPdf: false,
                lineCount: null
            };
        }

        return null;
    }

    // ============================================================
    // CONTENT EXTRACTION
    // ============================================================

    /**
     * Extract text content from an open modal
     */
    function extractTextContent(modal) {
        const contentSelectors = [
            'pre code',
            'pre',
            '.whitespace-pre-wrap',
            '.font-mono',
            '.overflow-auto pre',
            '[class*="content"]'
        ];

        for (const selector of contentSelectors) {
            const el = modal.querySelector(selector);
            if (el && el.textContent.trim().length > CONFIG.MIN_CONTENT_LENGTH) {
                return el.textContent;
            }
        }

        // Fallback: get modal body text, filtering UI elements
        const allText = modal.textContent || '';
        const lines = allText.split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 3)
            .filter(l => !l.match(/^(Close|Download|Export|PDF|Select|Cancel|OK|\d+\s*lines?|View|Edit|pages?)$/i))
            .filter(l => !l.includes('claude.ai'))
            .filter(l => l.length < 500);

        return lines.join('\n');
    }

    /**
     * Extract PDF download URL from modal
     */
    function extractPdfUrl(modal) {
        // Look for the download link
        const downloadLink = modal.querySelector('a[href*="/document_pdf"]');
        if (downloadLink) {
            return downloadLink.href;
        }

        // Try to find any API file link
        const anyApiLink = modal.querySelector('a[href*="/api/"][href*="/files/"]');
        if (anyApiLink) {
            return anyApiLink.href;
        }

        return null;
    }

    /**
     * Extract CSV content - try download URL first, then table reconstruction
     */
    async function extractCsvContent(modal, fileInfo) {
        // Check if there's a download link (similar to PDF)
        const downloadLink = modal.querySelector('a[href*="/files/"]');
        if (downloadLink && downloadLink.href) {
            return { method: 'download_url', url: downloadLink.href };
        }

        // Try to find table content
        const table = modal.querySelector('table');
        if (table) {
            const rows = [];
            table.querySelectorAll('tr').forEach(tr => {
                const cells = [];
                tr.querySelectorAll('td, th').forEach(cell => {
                    cells.push(cell.textContent.trim().replace(/,/g, ';'));
                });
                if (cells.length > 0) {
                    rows.push(cells.join(','));
                }
            });
            if (rows.length > 0) {
                return { method: 'table_reconstruction', content: rows.join('\n') };
            }
        }

        // Try text content that looks like CSV
        const textContent = extractTextContent(modal);
        if (textContent && textContent.includes(',')) {
            return { method: 'text_scrape', content: textContent };
        }

        return { method: 'unexportable', reason: 'No download URL, table, or CSV-like content found' };
    }

    // ============================================================
    // FILE EXPORT
    // ============================================================

    /**
     * Export a single file and return metadata
     */
    async function exportFile(fileCard, usedNames, statusCallback) {
        const { element, domFilename, type, isPdf, lineCount } = fileCard;

        log.debug(`Processing: "${domFilename}" (type: ${type}, isPdf: ${isPdf})`);

        // Normalize the filename
        let normalizedName = normalizeFilename(domFilename);
        normalizedName = ensureExtension(normalizedName, type);
        normalizedName = handleCollision(normalizedName, usedNames);

        const metadata = {
            originalDomFilename: domFilename,
            normalizedFilename: normalizedName,
            detectedType: type,
            sourceUrl: null,
            exportMethod: null,
            status: 'pending',
            error: null,
            lineCount: lineCount
        };

        statusCallback?.(`Exporting: ${domFilename}`);

        try {
            // Click to open the file
            const clickTarget = element.querySelector('button') || element;
            clickTarget.scrollIntoView({ behavior: 'instant', block: 'center' });
            await sleep(200);
            clickTarget.click();

            const modal = await waitForModal();
            if (!modal) {
                throw new Error('Modal did not open');
            }

            let content = null;

            if (isPdf || type === 'pdf') {
                // Handle PDF
                const pdfUrl = extractPdfUrl(modal);
                if (pdfUrl) {
                    metadata.sourceUrl = pdfUrl;
                    metadata.exportMethod = 'pdf_download_url';

                    // Fetch the PDF
                    const response = await fetch(pdfUrl, { credentials: 'include' });
                    if (!response.ok) {
                        throw new Error(`PDF fetch failed: ${response.status}`);
                    }
                    const blob = await response.blob();
                    content = blob;
                    metadata.status = 'success';
                    log.file(domFilename, normalizedName, 'pdf', 'download_url', 'success');
                } else {
                    throw new Error('Could not find PDF download URL');
                }

            } else if (type === 'csv') {
                // Handle CSV
                const csvResult = await extractCsvContent(modal, fileCard);
                metadata.exportMethod = csvResult.method;

                if (csvResult.method === 'download_url') {
                    metadata.sourceUrl = csvResult.url;
                    const response = await fetch(csvResult.url, { credentials: 'include' });
                    if (!response.ok) {
                        throw new Error(`CSV fetch failed: ${response.status}`);
                    }
                    content = await response.text();
                    metadata.status = 'success';
                    log.file(domFilename, normalizedName, 'csv', 'download_url', 'success');

                } else if (csvResult.method === 'table_reconstruction' || csvResult.method === 'text_scrape') {
                    content = csvResult.content;
                    metadata.status = 'success';
                    log.file(domFilename, normalizedName, 'csv', csvResult.method, 'success');

                } else {
                    metadata.status = 'unexportable';
                    metadata.error = csvResult.reason;
                    metadata.exportMethod = 'unexportable';
                    log.file(domFilename, normalizedName, 'csv', 'unexportable', 'failed');
                }

            } else {
                // Handle text-based files (md, txt, docx, etc.)
                content = extractTextContent(modal);

                if (content && content.length > CONFIG.MIN_CONTENT_LENGTH) {
                    metadata.exportMethod = 'text_scrape';
                    metadata.status = 'success';
                    log.file(domFilename, normalizedName, type, 'text_scrape', 'success');
                } else {
                    throw new Error(`Content too short (${content?.length || 0} chars)`);
                }
            }

            await closeModal();
            await sleep(CONFIG.BETWEEN_FILES_MS);

            return { metadata, content, filename: normalizedName };

        } catch (error) {
            metadata.status = 'failed';
            metadata.error = error.message;
            metadata.exportMethod = metadata.exportMethod || 'failed';
            log.file(domFilename, normalizedName, type, 'error', 'failed');
            log.error(`Failed to export "${domFilename}": ${error.message}`);

            await closeModal();
            await sleep(CONFIG.BETWEEN_FILES_MS);

            return { metadata, content: null, filename: normalizedName };
        }
    }

    // ============================================================
    // ZIP CREATION
    // ============================================================

    async function createAndDownloadZip(exportedFiles, projectName, statusCallback) {
        log.info('Creating ZIP archive...');
        statusCallback?.('Creating ZIP...');

        const zip = new JSZip();
        const allMetadata = [];

        let successCount = 0;
        let failedCount = 0;
        let pdfCount = 0;
        let csvCount = 0;
        let unexportableCount = 0;

        for (const { metadata, content, filename } of exportedFiles) {
            allMetadata.push(metadata);

            if (content !== null) {
                if (content instanceof Blob) {
                    zip.file(filename, content);
                    pdfCount++;
                } else {
                    zip.file(filename, content);
                    if (metadata.detectedType === 'csv') csvCount++;
                }
                successCount++;
            } else {
                if (metadata.status === 'unexportable') {
                    unexportableCount++;
                } else {
                    failedCount++;
                }
            }
        }

        // Add metadata JSON
        const metadataJson = {
            exportDate: new Date().toISOString(),
            projectTitle: projectName,
            url: window.location.href,
            exporterVersion: '4.0.0',
            summary: {
                total: exportedFiles.length,
                exported: successCount,
                failed: failedCount,
                unexportable: unexportableCount,
                pdfExported: pdfCount,
                csvExported: csvCount
            },
            files: allMetadata
        };

        zip.file('_export_metadata.json', JSON.stringify(metadataJson, null, 2));

        // Generate and download
        log.info('Generating ZIP blob...');
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
        const safeName = projectName.replace(/[^a-zA-Z0-9]/g, '_');
        const zipFilename = `${safeName}_export_${timestamp}.zip`;

        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = zipFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Final summary
        log.success('='.repeat(50));
        log.success('EXPORT COMPLETE');
        log.success('='.repeat(50));
        log.info(`Total files:       ${exportedFiles.length}`);
        log.info(`Exported:          ${successCount}`);
        log.info(`Failed:            ${failedCount}`);
        log.info(`Unexportable:      ${unexportableCount}`);
        log.info(`PDFs exported:     ${pdfCount}`);
        log.info(`CSVs exported:     ${csvCount}`);
        log.success('='.repeat(50));

        return { zipFilename, ...metadataJson.summary };
    }

    // ============================================================
    // MAIN EXPORT FUNCTION
    // ============================================================

    async function exportProject() {
        const button = document.querySelector('#claude-export-btn');
        const updateStatus = (msg) => {
            if (button) button.textContent = `🔄 ${msg}`;
            log.info(msg);
        };

        try {
            updateStatus('Loading JSZip...');
            await loadJSZip();

            updateStatus('Discovering files...');
            const fileCards = await discoverAllFiles(updateStatus);

            if (fileCards.length === 0) {
                updateStatus('No files found!');
                log.error('No files found in project');
                setTimeout(() => {
                    if (button) button.textContent = '📁 Export Project Files';
                }, 3000);
                return;
            }

            updateStatus(`Found ${fileCards.length} files, exporting...`);

            const usedNames = new Set();
            const exportedFiles = [];

            for (let i = 0; i < fileCards.length; i++) {
                updateStatus(`Exporting ${i + 1}/${fileCards.length}: ${fileCards[i].domFilename}`);
                const result = await exportFile(fileCards[i], usedNames, updateStatus);
                exportedFiles.push(result);
            }

            // Get project name
            const projectName = getProjectTitle();

            updateStatus('Creating ZIP...');
            const summary = await createAndDownloadZip(exportedFiles, projectName, updateStatus);

            updateStatus(`✅ Exported ${summary.exported}/${summary.total} files`);
            setTimeout(() => {
                if (button) button.textContent = '📁 Export Project Files';
            }, 5000);

        } catch (error) {
            log.error('Export failed:', error);
            updateStatus('❌ Export failed');
            setTimeout(() => {
                if (button) button.textContent = '📁 Export Project Files';
            }, 3000);
        }
    }

    function getProjectTitle() {
        // Try various title selectors
        const selectors = ['h1', '[data-testid*="title"]', '.text-xl', '.text-2xl'];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.textContent.trim() && el.textContent.trim() !== 'Claude') {
                return el.textContent.trim();
            }
        }

        // Fallback to URL
        const urlMatch = window.location.pathname.match(/\/project\/([^\/]+)/);
        if (urlMatch) return urlMatch[1];

        return 'Claude_Project';
    }

    // ============================================================
    // UI BUTTON
    // ============================================================

    function addExportButton() {
        const existing = document.querySelector('#claude-export-btn');
        if (existing) existing.remove();

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
        log.success('Export button added');
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================

    function init() {
        log.info('Claude Project Files Exporter v4.0.0 initialized');

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