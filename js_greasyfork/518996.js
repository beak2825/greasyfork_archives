// ==UserScript==
// @name         EXIF Info
// @namespace    https://x.com/anpho
// @version      1.0
// @description  Displays EXIF information for images
// @author       MerrickZ
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/exif-js@2.3.0
// @downloadURL https://update.greasyfork.org/scripts/518996/EXIF%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/518996/EXIF%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject styles using GM_addStyle for better performance
    GM_addStyle(`
        .exif-icon {
            position: absolute;
            width: 16px;
            height: 16px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            cursor: pointer;
            z-index: 10000;
            top: 5px;
            right: 5px;
        }
        .exif-tooltip {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            max-width: 300px;
            z-index: 10001;
            display: none;
            pointer-events: none;
            white-space: nowrap;
            top: 25px;
            right: 0;
        }
        .exif-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            z-index: 10002;
            max-width: 80vw;
            max-height: 80vh;
            overflow: auto;
            display: none;
        }
        .exif-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: none;
        }
        .exif-modal table {
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;
            border: 1px solid #ddd;
        }
        .exif-modal table tr:before,
        .exif-modal table tr:after,
        .exif-modal table td:before,
        .exif-modal table td:after,
        .exif-modal table th:before,
        .exif-modal table th:after {
            display: none !important;
            content: none !important;
        }
        .exif-modal table td:first-child {
            width: 40%;
        }
        .exif-modal table td:last-child {
            width: 60%;
        }
        .exif-modal th, .exif-modal td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            word-break: break-word;
        }
        .exif-modal th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .exif-modal-close {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            font-size: 20px;
        }
        .copy-button {
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .copy-button:hover {
            background-color: #45a049;
        }
    `);

    // Create modal once
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'exif-modal-overlay';
    document.body.appendChild(modalOverlay);

    const modal = document.createElement('div');
    modal.className = 'exif-modal';
    modal.innerHTML = '<span class="exif-modal-close">&times;</span><div class="exif-modal-content"></div>';
    document.body.appendChild(modal);

    // Close modal handlers
    function closeModal() {
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    modalOverlay.addEventListener('click', closeModal);
    modal.querySelector('.exif-modal-close').addEventListener('click', closeModal);

    // Stop propagation of clicks inside modal
    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    function getExifData(img) {
        return new Promise((resolve) => {
            // Skip small thumbnails and icons
            if (img.width < 50 || img.height < 50) {
                resolve({});
                return;
            }

            // For Flickr: try to get the original image URL
            let imgUrl = img.src;
            if (imgUrl.includes('staticflickr.com')) {
                // Convert to larger size by replacing _t, _m, _n, etc with _b or _o
                imgUrl = imgUrl.replace(/_(t|m|n|s|q|sq)\./i, '_b.');
            }

            // Load image data
            const tempImg = new Image();
            tempImg.crossOrigin = 'Anonymous';
            tempImg.onload = function() {
                EXIF.getData(this, function() {
                    const exifData = EXIF.getAllTags(this) || {};
                    resolve(exifData);
                });
            };
            tempImg.onerror = function() {
                console.log('Failed to load image:', imgUrl);
                resolve({});
            };
            tempImg.src = imgUrl;
        });
    }

    function formatExifValue(key, value) {
        // Skip null, undefined, or empty values
        if (value === null || value === undefined || value === '') return null;
        
        // Skip thumbnail data
        if (key.toLowerCase().includes('thumbnail')) return null;
        
        // Handle arrays
        if (Array.isArray(value)) {
            // If array contains objects or is empty, skip it
            if (value.length === 0 || value.some(item => typeof item === 'object')) return null;
            return value.join(', ');
        }
        
        // Skip if value is an object
        if (typeof value === 'object') return null;
        
        // Convert to string and handle special cases
        if (key === 'ExposureTime') {
            // Format exposure time as fraction (e.g., 1/250)
            return `1/${Math.round(1/value)}`;
        }
        if (key === 'FNumber') {
            return `f/${value}`;
        }
        if (key === 'ISOSpeedRatings') {
            return `ISO ${value}`;
        }
        if (key === 'Flash') {
            return value === 1 ? 'Yes' : 'No';
        }
        
        // Skip if value is just zeros or seems like binary data
        if (/^[0\s]+$/.test(String(value))) return null;
        
        return String(value);
    }

    function createTooltipContent(exifData) {
        // Filter out unwanted keys
        const skipKeys = ['componentsconfiguration', 'filesource', 'scenetype', 'thumbnail'];
        
        return Object.entries(exifData)
            .filter(([key]) => !skipKeys.some(skip => key.toLowerCase().includes(skip)))
            .map(([key, value]) => {
                const formatted = formatExifValue(key, value);
                return formatted ? `${key}: ${formatted}` : null;
            })
            .filter(item => item !== null)
            .join('<br>');
    }

    function createTableContent(exifData) {
        // Filter out unwanted keys
        const skipKeys = ['componentsconfiguration', 'filesource', 'scenetype', 'thumbnail'];
        
        const rows = Object.entries(exifData)
            .filter(([key]) => !skipKeys.some(skip => key.toLowerCase().includes(skip)))
            .map(([key, value]) => {
                const formatted = formatExifValue(key, value);
                if (!formatted) return null;
                return `<tr><td>${key}</td><td>${formatted}</td></tr>`;
            })
            .filter(row => row !== null)
            .join('');
            
        return `<table cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>`;
    }

    async function processImage(img) {
        // Skip if already processed
        if (img.dataset.exifProcessed) return;
        img.dataset.exifProcessed = 'true';

        try {
            const exifData = await getExifData(img);
            if (!exifData || Object.keys(exifData).length === 0) return;

            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.display = 'inline-block';
            container.style.width = img.width + 'px';
            container.style.height = img.height + 'px';
            img.parentNode.insertBefore(container, img);
            container.appendChild(img);

            const icon = document.createElement('div');
            icon.className = 'exif-icon';
            icon.innerHTML = 'i';
            container.appendChild(icon);

            const tooltip = document.createElement('div');
            tooltip.className = 'exif-tooltip';
            const tooltipContent = createTooltipContent(exifData);
            if (tooltipContent) {
                tooltip.innerHTML = tooltipContent;
                icon.appendChild(tooltip);

                icon.onmouseenter = () => tooltip.style.display = 'block';
                icon.onmouseleave = () => tooltip.style.display = 'none';

                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const modalContent = modal.querySelector('.exif-modal-content');
                    modalContent.innerHTML = createTableContent(exifData);

                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-button';
                    copyButton.textContent = 'Copy to Clipboard';
                    copyButton.onclick = () => {
                        const tableText = Object.entries(exifData)
                            .filter(([key]) => !skipKeys.some(skip => key.toLowerCase().includes(skip)))
                            .map(([key, value]) => {
                                const formatted = formatExifValue(key, value);
                                return formatted ? `${key}: ${formatted}` : null;
                            })
                            .filter(item => item !== null)
                            .join('\n');
                        navigator.clipboard.writeText(tableText)
                            .then(() => {
                                copyButton.textContent = 'Copied!';
                                setTimeout(() => copyButton.textContent = 'Copy to Clipboard', 2000);
                            });
                    };
                    modalContent.appendChild(copyButton);
                    
                    modal.style.display = 'block';
                    modalOverlay.style.display = 'block';
                });
            }
        } catch (error) {
            // Silently fail for individual images
        }
    }

    // Process images in batches to avoid blocking
    function processBatch(images, index = 0, batchSize = 5) {
        const end = Math.min(index + batchSize, images.length);
        for (let i = index; i < end; i++) {
            const img = images[i];
            // Skip very small images and already processed ones
            if (img.width < 100 || img.height < 100 || img.dataset.exifProcessed) {
                continue;
            }
            processImage(img);
        }
        if (end < images.length) {
            setTimeout(() => processBatch(images, end, batchSize), 100);
        }
    }

    // Initial processing with delay to ensure images are loaded
    setTimeout(() => {
        const images = Array.from(document.getElementsByTagName('img'));
        processBatch(images);
    }, 1000);

    // Watch for new images
    const observer = new MutationObserver((mutations) => {
        const newImages = [];
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'IMG' && node.width >= 100 && node.height >= 100) {
                    newImages.push(node);
                }
                if (node.getElementsByTagName) {
                    const imgs = Array.from(node.getElementsByTagName('img'))
                        .filter(img => img.width >= 100 && img.height >= 100);
                    newImages.push(...imgs);
                }
            });
        });
        if (newImages.length) {
            setTimeout(() => processBatch(newImages), 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
