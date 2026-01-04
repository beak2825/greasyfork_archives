// ==UserScript==
// @name         Hugging Face Batch Downloader
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Enhance Hugging Face model downloads with batch selection and custom naming
// @author       Xunjian Yin
// @match        https://huggingface.co/*/tree/*
// @match        https://huggingface.co/*/blob/*
// @match        https://hf-mirror.com/*/tree/*
// @match        https://hf-mirror.com/*/blob/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543283/Hugging%20Face%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/543283/Hugging%20Face%20Batch%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    // Extract model path from URL (organization/model-name)
    function getModelPath() {
        const urlParts = window.location.pathname.split('/');
        if (urlParts.length >= 3) {
            // Return the organization/model-name format for folder structure
            return `${urlParts[1]}/${urlParts[2]}`;
        }
        return 'huggingface-model';
    }

    // Get just the model name for logging purposes
    function getModelName() {
        const urlParts = window.location.pathname.split('/');
        if (urlParts.length >= 3) {
            return `${urlParts[1]}/${urlParts[2]}`;
        }
        return 'huggingface-model';
    }

    // Create download link with organized filename (browser-compatible)
    function createDownloadLink(originalUrl, filename, modelPath) {
        // Ensure we're using the resolve URL for downloads, not blob URL
        let downloadUrl = originalUrl;
        if (downloadUrl.includes('/blob/')) {
            downloadUrl = downloadUrl.replace('/blob/', '/resolve/');
        }
        
        // Force download by adding download parameter if it's not already there
        if (!downloadUrl.includes('download=true')) {
            const separator = downloadUrl.includes('?') ? '&' : '?';
            downloadUrl += `${separator}download=true`;
        }
        
        // Create organized filename since browsers don't create folders via download attribute
        // Format: [Org-Model] filename.ext
        const modelNameForFile = modelPath.replace('/', '-');
        const downloadFilename = `[${modelNameForFile}] ${filename}`;
        
        console.log(`HF Batch Downloader: Downloading ${downloadFilename} from ${downloadUrl}`);
        
        // Create download link with proper attributes
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = downloadFilename;
        link.target = '_blank'; // Fallback in case download fails
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        
        try {
            link.click();
        } catch (error) {
            console.error(`HF Batch Downloader: Failed to trigger download for ${filename}:`, error);
            // Fallback: open in new tab
            window.open(downloadUrl, '_blank');
        }
        
        // Clean up after a short delay
        setTimeout(() => {
            if (link.parentNode) {
                document.body.removeChild(link);
            }
        }, 100);
    }

    // Add batch download functionality
    async function addBatchDownloadUI() {
        console.log('HF Batch Downloader: Looking for file list...');
        
        // Try multiple selectors to find the file list
        let fileContainer = null;
        const selectors = [
            '[data-target="TreeView"]',
            '.file-list',
            '[class*="file"]',
            'main',
            'article',
            '.container'
        ];
        
        for (const selector of selectors) {
            fileContainer = await waitForElement(selector, 3000);
            if (fileContainer) {
                console.log(`HF Batch Downloader: Found container with selector: ${selector}`);
                break;
            }
        }

        if (!fileContainer) {
            console.log('HF Batch Downloader: No suitable container found, trying body');
            fileContainer = document.body;
        }

        const modelName = getModelName();
        const modelPath = getModelPath();
        console.log(`HF Batch Downloader: Model path extracted: ${modelPath}`);
        
        // Find all download links
        const allLinks = document.querySelectorAll('a[href*="/resolve/"]');
        console.log(`HF Batch Downloader: Found ${allLinks.length} potential download links`);

        if (allLinks.length === 0) {
            console.log('HF Batch Downloader: No download links found');
            return;
        }

        // Create control panel with HF-like styling
        const controlPanel = document.createElement('div');
        controlPanel.id = 'hf-batch-downloader-panel';
        controlPanel.style.cssText = `
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px 16px;
            margin: 16px 0 8px 0;
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        `;

        controlPanel.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; color: #475569; font-weight: 500;">
                <span style="font-size: 16px;">📦</span>
                <span>Batch Download</span>
            </div>
            <button id="hf-selectAll" style="
                padding: 6px 12px; 
                background: #3b82f6; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: background-color 0.2s;
            ">Select All</button>
            <button id="hf-selectNone" style="
                padding: 6px 12px; 
                background: #6b7280; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: background-color 0.2s;
            ">Select None</button>
            <button id="hf-downloadSelected" style="
                padding: 6px 12px; 
                background: #10b981; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: background-color 0.2s;
            ">Download Selected</button>
            <span id="hf-selectedCount" style="color: #6b7280; margin-left: 4px; font-size: 13px;">0 files selected</span>
        `;

        // Find the best insertion point - look for file list container
        let insertionPoint = null;
        
        // Try to find the files section specifically
        const filesSection = document.querySelector('[data-testid="files-section"]') || 
                            document.querySelector('.files') || 
                            document.querySelector('[class*="file"]') ||
                            document.querySelector('main section');

        if (filesSection) {
            insertionPoint = filesSection;
        } else {
            // Fallback to main content area
            const mainContent = document.querySelector('main') || document.querySelector('.container');
            if (mainContent) {
                insertionPoint = mainContent;
            }
        }

        if (insertionPoint) {
            // Insert at the beginning of the files section, not the very top of main
            const firstChild = insertionPoint.firstChild;
            if (firstChild) {
                insertionPoint.insertBefore(controlPanel, firstChild);
            } else {
                insertionPoint.appendChild(controlPanel);
            }
        } else {
            // Last resort - insert after the header
            const header = document.querySelector('header') || document.querySelector('nav');
            if (header && header.nextSibling) {
                header.parentNode.insertBefore(controlPanel, header.nextSibling);
            } else {
                document.body.insertBefore(controlPanel, document.body.firstChild);
            }
        }

        // Process each download link
        const fileList = [];
        allLinks.forEach((link, index) => {
            const href = link.href;
            
            // Accept both /resolve/ and /blob/ links, we'll convert blob to resolve later
            const isDownloadLink = href.includes('/resolve/') || href.includes('/blob/');
            const isNotFolderLink = !href.includes('/tree/');
            
            if (!isDownloadLink || !isNotFolderLink) {
                return;
            }

            // Get the filename from the link text or URL
            let fileName = link.textContent.trim();
            if (!fileName || fileName === '') {
                const urlParts = href.split('/');
                fileName = urlParts[urlParts.length - 1] || `file-${index}`;
            }

            // Skip if filename is empty or looks like a folder
            if (!fileName || fileName === '..') {
                return;
            }

            console.log(`HF Batch Downloader: Processing file: ${fileName}`);

            // Create a subtle, clean checkbox that integrates naturally
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `hf-file-checkbox-${index}`;
            checkbox.style.cssText = `
                width: 14px;
                height: 14px;
                margin: 0 6px 0 0;
                cursor: pointer;
                accent-color: #656d76;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                vertical-align: middle;
                position: relative;
                top: -1px;
            `;

            // Add hover effect to make it more visible on interaction
            checkbox.addEventListener('mouseenter', () => {
                checkbox.style.opacity = '1';
                checkbox.style.accentColor = '#0969da';
            });
            
            checkbox.addEventListener('mouseleave', () => {
                if (!checkbox.checked) {
                    checkbox.style.opacity = '0.7';
                    checkbox.style.accentColor = '#656d76';
                }
            });

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    checkbox.style.opacity = '1';
                    checkbox.style.accentColor = '#0969da';
                } else {
                    checkbox.style.opacity = '0.7';
                    checkbox.style.accentColor = '#656d76';
                }
            });

            // Find the file icon (first element in the row that's likely the icon)
            const fileIcon = link.parentElement.querySelector('svg') || 
                           link.parentElement.querySelector('[class*="icon"]') ||
                           link.parentElement.querySelector('img');

            if (fileIcon) {
                // Insert checkbox right before the file icon for clean alignment
                fileIcon.parentElement.insertBefore(checkbox, fileIcon);
            } else {
                // Fallback: find the first element that looks like a file row start
                let insertionPoint = link;
                
                // Walk up to find a container, but not too far
                let currentElement = link.parentElement;
                let attempts = 0;
                while (currentElement && attempts < 3) {
                    if (currentElement.children.length > 1) {
                        insertionPoint = currentElement.firstChild;
                        break;
                    }
                    currentElement = currentElement.parentElement;
                    attempts++;
                }
                
                insertionPoint.parentElement.insertBefore(checkbox, insertionPoint);
            }

            fileList.push({
                checkbox,
                fileName,
                downloadUrl: href,
                element: link.parentElement
            });

            checkbox.addEventListener('change', updateSelectedCount);
        });

        console.log(`HF Batch Downloader: Processed ${fileList.length} downloadable files`);

        // Control panel event handlers
        function updateSelectedCount() {
            const selectedCheckboxes = fileList.filter(file => file.checkbox.checked);
            const countElement = document.getElementById('hf-selectedCount');
            if (countElement) {
                countElement.textContent = `${selectedCheckboxes.length} files selected`;
            }
        }

        document.getElementById('hf-selectAll').addEventListener('click', () => {
            fileList.forEach(file => file.checkbox.checked = true);
            updateSelectedCount();
        });

        document.getElementById('hf-selectNone').addEventListener('click', () => {
            fileList.forEach(file => file.checkbox.checked = false);
            updateSelectedCount();
        });

        document.getElementById('hf-downloadSelected').addEventListener('click', async () => {
            const selectedFiles = fileList.filter(file => file.checkbox.checked);
            
            if (selectedFiles.length === 0) {
                alert('Please select at least one file to download.');
                return;
            }

            const downloadBtn = document.getElementById('hf-downloadSelected');
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = `Downloading ${selectedFiles.length} files...`;
            downloadBtn.disabled = true;

            console.log(`HF Batch Downloader: Starting download of ${selectedFiles.length} files`);

            let successCount = 0;
            let errorCount = 0;

            // Download files with delay to avoid overwhelming the browser
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                console.log(`HF Batch Downloader: Downloading ${i + 1}/${selectedFiles.length}: ${file.fileName}`);
                
                try {
                    createDownloadLink(file.downloadUrl, file.fileName, modelPath);
                    successCount++;
                    
                    // Update button text with progress
                    downloadBtn.textContent = `Downloading ${i + 1}/${selectedFiles.length}...`;
                } catch (error) {
                    console.error(`HF Batch Downloader: Error downloading ${file.fileName}:`, error);
                    errorCount++;
                }
                
                // Add delay between downloads (longer delay for more reliability)
                if (i < selectedFiles.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1200));
                }
            }

            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
            
            console.log(`HF Batch Downloader: Completed. Success: ${successCount}, Errors: ${errorCount}`);
            
            // Show appropriate completion message
            if (errorCount === 0) {
                alert(`✅ Successfully started downloading all ${selectedFiles.length} files! Check your downloads folder.`);
            } else if (successCount > 0) {
                alert(`⚠️ Started downloading ${successCount} files successfully, ${errorCount} failed. Check browser console for details and your downloads folder.`);
            } else {
                alert(`❌ Failed to download any files. Please check the browser console for error details and try again.`);
            }
        });

        // Add hover effects for buttons
        const buttons = controlPanel.querySelectorAll('button');
        buttons.forEach(button => {
            const originalBackground = button.style.background;
            
            button.addEventListener('mouseenter', () => {
                if (button.id === 'hf-selectAll') {
                    button.style.background = '#2563eb';
                } else if (button.id === 'hf-selectNone') {
                    button.style.background = '#4b5563';
                } else if (button.id === 'hf-downloadSelected') {
                    button.style.background = '#059669';
                }
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.background = originalBackground;
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
            
            button.addEventListener('active', () => {
                button.style.transform = 'translateY(0)';
            });
        });

        console.log(`HF Batch Downloader: Enhanced ${fileList.length} files for model: ${modelName}`);
    }

    // Enhanced individual download links
    function enhanceIndividualDownloads() {
        const modelPath = getModelPath();
        
        // Find and enhance existing download links
        const downloadLinks = document.querySelectorAll('a[href*="/resolve/"]');
        downloadLinks.forEach(link => {
            if (link.dataset.enhanced) return; // Skip already enhanced links
            
            const fileName = link.textContent.trim() || link.href.split('/').pop();
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                createDownloadLink(link.href, fileName, modelPath);
            });
            
            link.dataset.enhanced = 'true';
            const modelNameForFile = modelPath.replace('/', '-');
            link.title = `Download as: [${modelNameForFile}] ${fileName}`;
        });
    }

    // Show a temporary notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            color: white;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: opacity 0.3s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize the script
    async function init() {
        console.log('HF Batch Downloader: Initializing v1.6.1...');
        
        // Check if we're on the right page
        if (!window.location.pathname.includes('/tree/') && !window.location.pathname.includes('/blob/')) {
            console.log('HF Batch Downloader: Not on a file page, skipping');
            return;
        }

        // Show loading notification
        showNotification('🚀 HF Batch Downloader loading...', 'info');
        
        try {
            // Add batch download UI
            await addBatchDownloadUI();
            
            // Enhance individual downloads
            enhanceIndividualDownloads();
            
            showNotification('✅ HF Batch Downloader ready!', 'success');
            
            // Watch for dynamically loaded content
            const observer = new MutationObserver((mutations) => {
                // Only enhance if new links are added
                let hasNewLinks = false;
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.querySelector && node.querySelector('a[href*="/resolve/"]')) {
                                    hasNewLinks = true;
                                }
                            }
                        });
                    }
                });
                
                if (hasNewLinks) {
                    console.log('HF Batch Downloader: New content detected, re-enhancing...');
                    enhanceIndividualDownloads();
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (error) {
            console.error('HF Batch Downloader: Error during initialization:', error);
            showNotification('❌ HF Batch Downloader failed to load', 'error');
        }
    }

    // Start the script when the page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 
