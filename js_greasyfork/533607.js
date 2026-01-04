// ==UserScript==
// @name         MLTSHP Image Saver
// @namespace    https://mltshp.com/
// @version      0.2
// @description  Adds download buttons to save MLTSHP images with their post titles as filenames
// @author       You
// @match        https://mltshp.com/*
// @match        https://mltshp-cdn.com/*
// @exclude      https://mltshp-cdn.com/r/*
// @icon         https://mltshp.com/static/images/apple-touch-icon.png
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533607/MLTSHP%20Image%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/533607/MLTSHP%20Image%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DEBUG MODE - set to true for verbose console logging
    const DEBUG = false;

    // Store image-to-title mappings
    const IMAGE_MAP = new Map();
    
    // Store processed images to prevent duplicates
    const PROCESSED_IMAGES = new Set();

    // Control visibility of description button
    const SHOW_DESCRIPTION_BUTTON = false;

    // Image Caption Generator API configuration
    const IMAGE_CAPTION_API_URL = 'https://imagecaptiongenerator.com/api/generate';

    // Log function that only outputs when debug is enabled
    function log(...args) {
        if (DEBUG) {
            console.log('[MLTSHP Saver]', ...args);
        }
    }

    // Add CSS for the download button - using standard DOM methods instead of GM_addStyle
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .mltshp-download-btn {
                background-color: green;
                color: white;
                padding: 6px 10px;
                border: 0px solid #000;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: normal;
                margin-left: 8px;
                display: none; /* Hide by default */
                text-decoration: none;
                transition: all 0.3s;
                vertical-align: middle;
                position: absolute;
                bottom: 5px;
                right: 5px;
                z-index: 9999;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            }
            
            .mltshp-describe-btn {
                background-color: #2196F3;
                color: white;
                padding: 6px 10px;
                border: 0px solid #000;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: normal;
                margin-right: 5px;
                display: none; /* Hide by default */
                text-decoration: none;
                transition: all 0.3s;
                vertical-align: middle;
                position: absolute;
                bottom: 5px;
                right: 80px;
                z-index: 9999;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            }
            
            .mltshp-description-container {
                display: none;
                position: absolute;
                bottom: -100px;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.8);
                padding: 10px;
                border-radius: 4px;
                z-index: 10000;
                transition: opacity 0.3s ease-in-out;
                opacity: 0;
            }
            
            ${SHOW_DESCRIPTION_BUTTON ? `
            .mltshp-image-container:hover .mltshp-description-container {
                display: block;
                opacity: 1;
            }
            ` : ''}
            
            .mltshp-description-text {
                color: white;
                font-size: 12px;
                margin-bottom: 5px;
                max-height: 80px;
                overflow-y: auto;
            }
            
            .mltshp-copy-btn {
                background-color: #4CAF50;
                color: white;
                padding: 4px 8px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                float: right;
            }
            
            /* Show buttons on image hover */
            .mltshp-image-container:hover .mltshp-download-btn,
            .mltshp-image-container:hover .mltshp-describe-btn {
                display: inline-block;
            }
            
            .mltshp-image-container {
                position: relative;
                display: inline-block;
            }
            
            @keyframes pulse-attention {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .mltshp-download-btn:hover {
                background-color: #ff7043;
                transform: scale(1.05);
            }
            
            .mltshp-download-btn:active {
                background-color: #e64a19;
                transform: scale(0.95);
            }
            
            /* For debugging: Highlight images that have been processed */
            .mltshp-processed-image {
                outline: ${DEBUG ? '1px solid #ff5722' : 'none'};
            }
            
            /* For debugging: Highlight title elements */
            .mltshp-title-element {
                outline: ${DEBUG ? '1px dashed #2196F3' : 'none'};
            }
            
            /* For debugging: Highlight describe button */
            .mltshp-describe-btn {
                outline: ${DEBUG ? '1px dashed #4CAF50' : 'none'};
            }
            
            /* For debugging: Highlight description container */
            .mltshp-description-container {
                outline: ${DEBUG ? '1px dashed #FFC107' : 'none'};
            }
            
            /* Floating button as a fallback */
            .mltshp-floating-btn {
                position: fixed;
                top: -80px; /* Moved 50px higher */
                right: 20px;
                z-index: 10000;
                padding: 8px 15px;
                background-color: #ff5722;
                color: white;
                font-weight: bold;
                border: none;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.4);
                cursor: pointer;
            }
            
            /* Floating debug info panel */
            .mltshp-debug-panel {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 10001;
                max-width: 300px;
                max-height: 200px;
                overflow: auto;
                display: ${DEBUG ? 'block' : 'none'};
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Add styles immediately
    addStyles();

    // Create a floating debug button
    function addFloatingButton() {
        const button = document.createElement('button');
        button.className = 'mltshp-floating-btn';
        button.textContent = 'Force Add Buttons';
        button.addEventListener('click', function() {
            scanPageAndAddButtons(true);
        });
        document.body.appendChild(button);
        
        if (DEBUG) {
            // Add debug panel
            const debugPanel = document.createElement('div');
            debugPanel.className = 'mltshp-debug-panel';
            debugPanel.innerHTML = '<h4>MLTSHP Image Saver Debug</h4><div id="mltshp-debug-content"></div>';
            document.body.appendChild(debugPanel);
        }
    }
    
    // Helper to update debug panel
    function updateDebugPanel(message) {
        if (!DEBUG) return;
        
        const panel = document.getElementById('mltshp-debug-content');
        if (panel) {
            panel.innerHTML = message + panel.innerHTML;
            if (panel.children.length > 10) {
                panel.removeChild(panel.lastChild);
            }
        }
    }
    
    // Function to check if an image should be skipped
    function shouldSkipImage(img) {
        // Skip logo-compact.svg and any header logos
        if (img.src.includes('logo-compact.svg') || 
            img.src.includes('logo') || 
            img.classList.contains('logo') || 
            (img.id && img.id.includes('logo')) ||
            (img.parentElement && 
             (img.parentElement.classList.contains('header') || 
              (img.parentElement.id && img.parentElement.id.includes('header'))))) {
            log('Skipping header/logo image:', img.src);
            return true;
        }
        
        // Skip very small images (likely icons)
        if (img.width < 50 || img.height < 50) {
            log('Skipping small image:', img.src);
            return true;
        }
        
        // Skip if image is not from MLTSHP domains
        if (!img.src.includes('mltshp.com') && !img.src.includes('mltshp-cdn.com')) {
            log('Skipping non-MLTSHP image:', img.src);
            return true;
        }
        
        return false;
    }
    
    // Function to get the full-size image URL (remove width and other parameters)
    function getFullSizeImageUrl(url) {
        // In case the URL has HTML entities, decode them. e.g. &amp; -> &
        const decodedUrl = url.replace(/&amp;/g, '&');

        // If the URL contains query parameters, remove them to get the original image
        if (decodedUrl.includes('?')) {
            return decodedUrl.split('?')[0];
        }
        return decodedUrl;
    }

    // Function to sanitize filenames by removing special characters
    function sanitizeFilename(filename) {
        // Replace special characters with dashes, keep spaces
        return filename
            .replace(/[\\/:*?"<>|]/g, '-') // Replace Windows illegal characters
            .replace(/\s{2,}/g, ' ')       // Replace multiple spaces with single space
            .replace(/^\s+|\s+$/g, '')     // Trim leading/trailing spaces
            .replace(/[^\w\-\. ]/g, '-')   // Replace other non-word chars (keep hyphens, periods and spaces)
            .substring(0, 100);            // Limit filename length
    }

    // NEW: Function to detect all posts and create image -> title mappings
    function buildImageTitleMap() {
        log('Building comprehensive image-title mapping...');
        
        // Clear any existing mappings
        IMAGE_MAP.clear();
        
        // 1. First identify all post containers on the page
        const postSelectors = [
            '.post', '.shakeshingle', 'article', 'li', '.content div', '.item', 
            '.span-6', '.span-8', '.image-content', '.the-image'
        ];
        
        const allPotentialContainers = [];
        postSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(container => {
                allPotentialContainers.push(container);
            });
        });
        
        log(`Found ${allPotentialContainers.length} potential post containers`);
        
        // 2. Process each container to find image and title pairs
        allPotentialContainers.forEach((container, index) => {
            // Find images in this container
            const images = container.querySelectorAll('img');
            if (images.length === 0) return;
            
            // Find title elements in this container
            const h3Elements = container.querySelectorAll('h3');
            const titleElements = [...h3Elements];
            
            // Also look for other potential title elements
            const otherTitleElements = container.querySelectorAll('.description, .caption, p, h1, h2, h4');
            titleElements.push(...otherTitleElements);
            
            if (titleElements.length === 0) return;
            
            log(`Container ${index} has ${images.length} images and ${titleElements.length} potential title elements`);
            
            // Map each image to its most likely title
            images.forEach(img => {
                // Skip unwanted images
                if (shouldSkipImage(img)) return;
                
                const imageUrl = getFullSizeImageUrl(img.src);
                
                // If we already have this image mapped, skip
                if (IMAGE_MAP.has(imageUrl)) return;
                
                // Find the best title match for this image
                let bestTitleElement = null;
                let shortestDistance = Infinity;
                
                // Get image position
                const imgRect = img.getBoundingClientRect();
                
                // Calculate distance to each title element
                titleElements.forEach(titleEl => {
                    // Skip empty title elements
                    if (!titleEl.textContent || titleEl.textContent.trim().length < 3) return;
                    
                    const titleRect = titleEl.getBoundingClientRect();
                    
                    // Prefer title elements above the image
                    let distance;
                    if (titleRect.bottom <= imgRect.top) {
                        // Title is above image (preferred)
                        distance = imgRect.top - titleRect.bottom;
                    } else if (titleRect.top >= imgRect.bottom) {
                        // Title is below image (less preferred)
                        distance = titleRect.top - imgRect.bottom + 1000; // Add penalty
                    } else {
                        // Title overlaps image (least preferred)
                        distance = Math.abs(titleRect.top - imgRect.top) + 2000; // Add larger penalty
                    }
                    
                    // If this title is closer than our current best, update
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        bestTitleElement = titleEl;
                    }
                });
                
                // If we found a title, map this image to it
                if (bestTitleElement) {
                    const title = bestTitleElement.textContent.trim();
                    log(`Mapping image ${imageUrl} to title "${title}"`);
                    
                    // Store the mapping
                    IMAGE_MAP.set(imageUrl, {
                        title: title,
                        titleElement: bestTitleElement,
                        distance: shortestDistance
                    });
                    
                    // Mark the title element for debugging
                    if (DEBUG) {
                        bestTitleElement.classList.add('mltshp-title-element');
                        bestTitleElement.title = `Mapped to image: ${imageUrl}`;
                    }
                } else {
                    // Try fallback methods for finding a title
                    
                    // Check alt text
                    if (img.alt && img.alt.trim() && img.alt !== 'alt text') {
                        IMAGE_MAP.set(imageUrl, {
                            title: img.alt.trim(),
                            titleElement: img,
                            source: 'alt-text'
                        });
                        log(`Using alt text for ${imageUrl}: "${img.alt.trim()}"`);
                        return;
                    }
                    
                    // Check for post URL ID
                    const postIdMatch = imageUrl.match(/\/([A-Za-z0-9]+)$/);
                    if (postIdMatch && postIdMatch[1]) {
                        const postId = postIdMatch[1];
                        const title = `MLTSHP Post ${postId}`;
                        IMAGE_MAP.set(imageUrl, {
                            title: title,
                            titleElement: img.parentElement,
                            source: 'post-id'
                        });
                        log(`Using post ID for ${imageUrl}: "${title}"`);
                        return;
                    }
                    
                    // Final fallback: create unique name
                    const uniqueId = Math.floor(Math.random() * 10000);
                    const fallbackTitle = `MLTSHP Image ${uniqueId} ${new Date().toISOString().slice(0, 10)}`;
                    IMAGE_MAP.set(imageUrl, {
                        title: fallbackTitle,
                        titleElement: img.parentElement,
                        source: 'fallback'
                    });
                    log(`Using fallback title for ${imageUrl}: "${fallbackTitle}"`);
                }
            });
        });
        
        // 3. Special case for single post pages
        if (window.location.pathname.includes('/p/')) {
            const mainImage = document.querySelector('.image-content img, .the-image img');
            const mainHeading = document.querySelector('h1, h2, h3');
            
            if (mainImage && mainHeading && mainHeading.textContent.trim()) {
                const imageUrl = getFullSizeImageUrl(mainImage.src);
                const title = mainHeading.textContent.trim();
                
                IMAGE_MAP.set(imageUrl, {
                    title: title,
                    titleElement: mainHeading,
                    source: 'single-post'
                });
                
                log(`Single post page: Mapped main image to title "${title}"`);
                
                if (DEBUG) {
                    mainHeading.classList.add('mltshp-title-element');
                }
            }
        }
        
        // Log summary
        log(`Completed mapping with ${IMAGE_MAP.size} image-title pairs`);
        
        // Debug output of all mappings
        if (DEBUG) {
            let debugMessage = '<strong>Image-Title Mappings:</strong><br>';
            IMAGE_MAP.forEach((value, key) => {
                debugMessage += `• ${key.substring(key.lastIndexOf('/') + 1)}: "${value.title.substring(0, 20)}${value.title.length > 20 ? '...' : ''}"<br>`;
            });
            updateDebugPanel(debugMessage);
        }
        
        return IMAGE_MAP.size;
    }
    
    // Function to get the title for a specific image
    function getTitleForImage(img) {
        const imageUrl = getFullSizeImageUrl(img.src);
        
        // Check if we have this image mapped
        if (IMAGE_MAP.has(imageUrl)) {
            return IMAGE_MAP.get(imageUrl);
        }
        
        // If not mapped, create a fallback title
        const uniqueId = Math.floor(Math.random() * 10000);
        const fallbackTitle = `MLTSHP Image ${uniqueId} ${new Date().toISOString().slice(0, 10)}`;
        return {
            title: fallbackTitle,
            titleElement: img.parentElement,
            source: 'dynamic-fallback'
        };
    }
    
    // Function to resize image
    async function resizeImage(imageUrl, maxWidth = 800, maxHeight = 800) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
                
                // Create canvas and resize image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with reduced quality
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(base64);
            };
            
            img.onerror = (error) => {
                reject(new Error('Failed to load image: ' + error));
            };
            
            img.src = imageUrl;
        });
    }

    // Function to get image as base64
    async function getImageAsBase64(imageUrl) {
        try {
            log('Resizing image before conversion...');
            const resizedImage = await resizeImage(imageUrl);
            log('Image resized, base64 length:', resizedImage.length);
            return resizedImage;
        } catch (error) {
            console.error('Error converting image to base64:', error);
            throw error;
        }
    }

    // Function to call Image Caption Generator
    async function describeImage(imageUrl, button, retryCount = 0) {
        const originalText = button.textContent;
        button.textContent = 'Analyzing...';
        button.disabled = true;
        
        log('Calling Image Caption Generator for image:', imageUrl);
        
        try {
            // Convert image to base64
            const imageBase64 = await getImageAsBase64(imageUrl);
            log('Image converted to base64, length:', imageBase64.length);
            
            // Create a temporary form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://imagecaptiongenerator.com/';
            form.target = '_blank';
            form.style.display = 'none';
            
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.name = 'image';
            
            // Convert base64 to blob and create file
            const byteCharacters = atob(imageBase64.split(',')[1]);
            const byteArrays = [];
            
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            
            const blob = new Blob(byteArrays, { type: 'image/jpeg' });
            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
            
            // Create a DataTransfer object to set the file
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            form.appendChild(fileInput);
            document.body.appendChild(form);
            
            // Open the form in a new window
            const newWindow = window.open('', '_blank');
            form.submit();
            
            // Wait for the caption
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 30; // 30 seconds
                
                const checkCaption = () => {
                    try {
                        if (!newWindow || newWindow.closed) {
                            throw new Error('Window was closed');
                        }
                        
                        // Try different selectors for the caption
                        const selectors = [
                            '.caption-result',
                            '.result-text',
                            '.generated-text',
                            '.result',
                            '.caption',
                            '#result',
                            '#caption',
                            'p.result',
                            'div.result',
                            'div.caption'
                        ];
                        
                        for (const selector of selectors) {
                            const element = newWindow.document.querySelector(selector);
                            if (element && element.textContent.trim()) {
                                const caption = element.textContent.trim();
                                log('Found caption:', caption);
                                newWindow.close();
                                document.body.removeChild(form);
                                resolve(caption);
                                return;
                            }
                        }
                        
                        attempts++;
                        if (attempts >= maxAttempts) {
                            throw new Error('Timeout waiting for caption');
                        }
                        
                        setTimeout(checkCaption, 1000);
                    } catch (error) {
                        log('Error checking caption:', error);
                        newWindow?.close();
                        document.body.removeChild(form);
                        reject(error);
                    }
                };
                
                // Start checking after a short delay to allow the page to load
                setTimeout(checkCaption, 2000);
            });
            
        } catch (error) {
            console.error('Error describing image:', error);
            log('Image Caption Generator error:', error);
            
            // Update debug panel with error
            if (DEBUG) {
                updateDebugPanel(`<strong>Image Caption Generator Error:</strong><br>
                    • Image: ${imageUrl.substring(imageUrl.lastIndexOf('/') + 1)}<br>
                    • Error: ${error.message}<br>
                    • Stack: ${error.stack}<br>`);
            }
            
            // If we haven't retried too many times
            if (retryCount < 3) {
                const delay = 5000; // 5 seconds
                log(`Retrying in ${delay/1000} seconds... (attempt ${retryCount + 1}/3)`);
                
                // Show countdown on button
                let remaining = delay/1000;
                const countdown = setInterval(() => {
                    remaining--;
                    button.textContent = `Retrying in ${remaining}...`;
                }, 1000);
                
                // Wait and retry
                await new Promise(resolve => setTimeout(resolve, delay));
                clearInterval(countdown);
                return describeImage(imageUrl, button, retryCount + 1);
            }
            
            return `Error analyzing image: ${error.message}`;
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Function to add a download button to an image
    function addButtonToImage(img) {
        // Skip if already processed
        if (PROCESSED_IMAGES.has(img.src)) {
            log('Skipping already processed image:', img.src);
            return false;
        }
        
        // Mark as processed
        PROCESSED_IMAGES.add(img.src);
        
        // Get the image info
        const imageUrl = getFullSizeImageUrl(img.src);
        const imageInfo = getTitleForImage(img);
        
        log('Processing image:', {
            url: imageUrl,
            title: imageInfo.title,
            source: imageInfo.source
        });
        
        // For debugging
        img.classList.add('mltshp-processed-image');
        
        // Add image URL as data attribute
        img.setAttribute('data-mltshp-url', imageUrl);
        
        // Create container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mltshp-image-container';
        buttonContainer.style.position = 'relative';
        buttonContainer.style.display = 'inline-block';
        
        if (DEBUG) {
            buttonContainer.setAttribute('data-debug', 'button-container');
            log('Created button container for image:', imageUrl);
        }
        
        // Create description container
        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'mltshp-description-container';
        if (DEBUG) {
            descriptionContainer.setAttribute('data-debug', 'description-container');
            log('Created description container for image:', imageUrl);
        }
        
        const descriptionText = document.createElement('div');
        descriptionText.className = 'mltshp-description-text';
        if (DEBUG) {
            descriptionText.setAttribute('data-debug', 'description-text');
        }
        
        descriptionContainer.appendChild(descriptionText);
        
        // Create describe button
        const describeButton = document.createElement('button');
        describeButton.textContent = 'Describe';
        describeButton.className = 'mltshp-describe-btn';
        describeButton.style.display = SHOW_DESCRIPTION_BUTTON ? 'none' : 'none'; // Always hidden
        if (DEBUG) {
            describeButton.setAttribute('data-debug', 'describe-button');
            describeButton.setAttribute('data-image-url', imageUrl);
            log('Created describe button for image:', imageUrl);
        }
        
        describeButton.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const description = await describeImage(imageUrl, describeButton);
            descriptionText.textContent = description;
            
            // Automatically copy to clipboard
            copyToClipboard(description);
            
            // Show success message
            const originalText = descriptionText.textContent;
            descriptionText.textContent = 'Description copied to clipboard!';
            setTimeout(() => {
                descriptionText.textContent = originalText;
            }, 2000);
        });
        
        // Create download button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.className = 'mltshp-download-btn';
        
        // Add data attributes for debugging
        downloadButton.setAttribute('data-title', imageInfo.title);
        downloadButton.setAttribute('data-source', imageInfo.source || 'mapped');
        
        // Add click event listener
        downloadButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            downloadImage(imageUrl, imageInfo.title, downloadButton);
        });
        
        // Insert everything
        const parent = img.parentElement;
        if (parent) {
            parent.insertBefore(buttonContainer, img);
            buttonContainer.appendChild(img);
            buttonContainer.appendChild(describeButton);
            buttonContainer.appendChild(downloadButton);
            buttonContainer.appendChild(descriptionContainer);
            
            if (DEBUG) {
                log('Successfully added all elements for image:', {
                    url: imageUrl,
                    title: imageInfo.title,
                    elements: {
                        container: buttonContainer,
                        describeButton: describeButton,
                        downloadButton: downloadButton,
                        descriptionContainer: descriptionContainer
                    }
                });
                
                // Update debug panel with button creation info
                updateDebugPanel(`<strong>Added Buttons:</strong><br>
                    • Image: ${imageUrl.substring(imageUrl.lastIndexOf('/') + 1)}<br>
                    • Title: ${imageInfo.title}<br>
                    • Describe Button: ${describeButton.outerHTML}<br>
                    • Download Button: ${downloadButton.outerHTML}<br>`);
            }
            
            return true;
        }
        
        if (DEBUG) {
            log('Failed to add buttons - no parent element found for image:', imageUrl);
        }
        
        return false;
    }
    
    // Main function to scan the page and add buttons
    function scanPageAndAddButtons(forceRebuild = false) {
        log('Scanning page for images...');
        
        // Build the image-title map if needed or forced
        if (IMAGE_MAP.size === 0 || forceRebuild) {
            const mappedCount = buildImageTitleMap();
            log(`Built image map with ${mappedCount} entries`);
        }
        
        // Get all images on the page
        const allImages = document.querySelectorAll('img');
        log(`Found ${allImages.length} total images on page`);
        
        let addedButtonCount = 0;
        
        // Process each image
        allImages.forEach((img) => {
            // Skip unwanted images
            if (shouldSkipImage(img)) {
                return;
            }
            
            // Add button directly on the image
            if (addButtonToImage(img)) {
                addedButtonCount++;
            }
        });
        
        log(`Added ${addedButtonCount} image buttons`);
        
        // Update debug panel
        updateDebugPanel(`<strong>Added Buttons:</strong><br>• ${addedButtonCount} image buttons<br>`);
        
        return addedButtonCount;
    }

    // Function to get file extension from image URL
    function getFileExtension(url) {
        // Extract the base URL without query parameters
        const baseUrl = url.split('?')[0];
        
        const regex = /\.([a-zA-Z0-9]+)$/;
        const match = baseUrl.match(regex);
        
        // If no extension found in the URL, attempt to determine by checking last path segment
        if (!match) {
            // Extract ID from URL pattern like https://mltshp-cdn.com/r/1QZ0Z
            const idMatch = baseUrl.match(/\/([A-Za-z0-9]+)$/);
            if (idMatch) {
                log('No extension found, using jpg as default');
                return 'jpg';
            }
        }
        
        return match ? match[1].toLowerCase() : 'jpg';
    }

    // Function to download image with title as filename
    function downloadImage(imageUrl, title, button) {
        // Get file extension
        const extension = getFileExtension(imageUrl);
        
        // Create a sanitized filename
        const filename = sanitizeFilename(title) + '.' + extension;
        
        log('Downloading image with filename:', filename);
        
        // Save original button text
        const originalText = button.textContent;
        
        // Update button to show loading
        button.textContent = 'Downloading...';
        button.disabled = true;
        
        // Force binary download using the Fetch API
        fetchAndSaveImage(imageUrl, filename, button, originalText);
    }
    
    // Function to fetch and save image using fetch API
    function fetchAndSaveImage(imageUrl, filename, button, originalText) {
        log(`Fetching image from ${imageUrl} as ${filename}`);
        
        try {
            // Use GM_xmlhttpRequest if available for cross-origin support
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imageUrl,
                    responseType: 'blob',
                    onload: function(response) {
                        saveBlob(response.response, filename, button, originalText);
                    },
                    onerror: function(error) {
                        console.error('Error fetching image:', error);
                        handleDownloadError(button, originalText);
                    }
                });
            } else {
                // Fallback to fetch API
                fetch(imageUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        saveBlob(blob, filename, button, originalText);
                    })
                    .catch(error => {
                        console.error('Error fetching image:', error);
                        handleDownloadError(button, originalText);
                    });
            }
        } catch (error) {
            console.error('Error in fetchAndSaveImage:', error);
            handleDownloadError(button, originalText);
        }
    }
    
    // Function to save a blob to disk
    function saveBlob(blob, filename, button, originalText) {
        try {
            // Create a Blob URL
            const url = URL.createObjectURL(blob);
            
            // Create an anchor element to trigger the download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            // Add to document, click to trigger download, then remove
            document.body.appendChild(a);
            a.click();
            
            // Clean up by removing the element and revoking the object URL
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Show success message
                button.textContent = 'Downloaded!';
                button.style.backgroundColor = '#2196F3';
                
                // Reset button after a delay
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                    button.disabled = false;
                }, 2000);
            }, 100);
            
        } catch (error) {
            console.error('Error saving blob:', error);
            handleDownloadError(button, originalText);
        }
    }
    
    // Function to handle download errors
    function handleDownloadError(button, originalText) {
        button.textContent = 'Error!';
        button.style.backgroundColor = '#f44336';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.disabled = false;
        }, 2000);
    }
    
    // Wait for document to be ready
    function onReady(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    // Run initialization once the document is ready
    onReady(function() {
        log('MLTSHP Image Saver: Document ready, initializing...');
        
        // Build the initial image-title map
        setTimeout(() => {
            buildImageTitleMap();
            // Add buttons after mapping is complete
            setTimeout(() => scanPageAndAddButtons(), 500);
        }, 500);
        
        // Add floating button
        setTimeout(addFloatingButton, 1000);
        
        // Set up MutationObserver for dynamic content
        const observer = new MutationObserver(function(mutations) {
            // Only run if we detect new images
            let hasNewImages = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'IMG' || node.querySelector('img')) {
                                hasNewImages = true;
                            }
                        }
                    });
                }
            });
            
            if (hasNewImages) {
                setTimeout(() => scanPageAndAddButtons(), 500);
            }
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
        
        // Also run periodically for any missed content
        setInterval(() => scanPageAndAddButtons(), 10000);
        
        // Show notification
        showNotification();
    });
    
    // Add a menu command to enable/disable script
    let isEnabled = true;
    
    function toggleScript() {
        isEnabled = !isEnabled;
        
        const buttons = document.querySelectorAll('.mltshp-download-btn');
        
        if (isEnabled) {
            buttons.forEach(btn => btn.style.display = 'inline-block');
            // Re-scan when enabling
            scanPageAndAddButtons();
            alert('MLTSHP Image Saver is now enabled');
        } else {
            buttons.forEach(btn => btn.style.display = 'none');
            alert('MLTSHP Image Saver is now disabled');
        }
    }
    
    // Register menu command if available
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('Toggle MLTSHP Image Saver', toggleScript);
    }
    
    // Show notification that script is running
    function showNotification() {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '0px'; 
        notification.style.left = '10px';
        notification.style.padding = '8px 15px';
        notification.style.background = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = 'white';
        notification.style.borderRadius = '4px';
        notification.style.fontSize = '14px';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        notification.innerHTML = `
            <div>✅ MLTSHP Image Saver Active</div>
            <div style="font-size:12px;margin-top:3px;">Mapped ${IMAGE_MAP.size} images to unique titles</div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
        }, 1000);
    }
    
    log('MLTSHP Image Saver: Script initialized');
})(); 