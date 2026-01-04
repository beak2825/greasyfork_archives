// ==UserScript==
// @name         Advanced Responsive Ethical Data Gathering Tool v3.2
// @namespace    http://tampermonkey.net/
// @version      2025-02-11
// @description  Massive integrated tool for ethical data research: forces media load; unblurs content (via CSS, canvas, OpenCV.js); reveals hidden text; recovers hidden data; fixes problematic overlays and unselectable text; extracts rich data (including high-detail image info), meta, and more; plus OCR, state-preserving UI, clearable logs, and live logging.
// @author       LittleLooney
// @license Copyright (C) Littlelooney All rights reserved.
// @match        *://*/*
// @icon         https://www.google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526597/Advanced%20Responsive%20Ethical%20Data%20Gathering%20Tool%20v32.user.js
// @updateURL https://update.greasyfork.org/scripts/526597/Advanced%20Responsive%20Ethical%20Data%20Gathering%20Tool%20v32.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**********************************
     * Utility Functions & Logging  *
     **********************************/

    const DEBUG = true;

    // Debounce: Ensures that a function isn't called too frequently.
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Logging function: Logs messages with timestamps to console and to the sidebar log area.
    function logMessage(level, message) {
        const timestamp = new Date().toISOString();
        const fullMessage = `[${timestamp}] [${level}] ${message}`;
        if (DEBUG) {
            console[level](fullMessage);
        }
        const logArea = document.getElementById('logArea');
        if (logArea) {
            const logEntry = document.createElement('div');
            logEntry.textContent = fullMessage;
            logEntry.style.borderBottom = "1px solid #444";
            logEntry.style.padding = "2px 0";
            logArea.appendChild(logEntry);
            // Auto-scroll to the bottom.
            logArea.scrollTop = logArea.scrollHeight;
        }
    }

    /**********************************
     * Force Media Loading Function   *
     **********************************/

    function forceLoadMedia() {
        try {
            // Process images.
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.hasAttribute('loading')) img.removeAttribute('loading');
                // If there's a high-res version in a data attribute, use it.
                if (img.dataset && img.dataset.fullsrc) {
                    img.src = img.dataset.fullsrc;
                }
                if (img.dataset && img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.remove('lazy', 'lazyload');
                // Force reload if not complete.
                if (!img.complete || img.naturalWidth === 0) {
                    img.src = img.src;
                }
            });
            logMessage('info', `Force loaded ${images.length} image(s).`);

            // Process videos.
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.setAttribute('preload', 'auto');
                video.load();
            });
            logMessage('info', `Force loaded ${videos.length} video(s).`);

            // Process iframes.
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                let src = iframe.getAttribute('src');
                if (src) iframe.src = src;
            });
            logMessage('info', `Force loaded ${iframes.length} iframe(s).`);
        } catch (error) {
            logMessage('error', `Error in forceLoadMedia: ${error}`);
        }
    }

    /**********************************
     * Unblurring Methods             *
     **********************************/

    // Remove CSS blur filters.
    function unblurElements() {
        try {
            const blurredElements = document.querySelectorAll('[style*="filter: blur"], .blurred');
            blurredElements.forEach(el => {
                el.style.filter = 'none';
                el.classList.remove('blurred');
            });
            logMessage('info', `Removed CSS blur filters from ${blurredElements.length} element(s).`);
        } catch (error) {
            logMessage('error', `Error in unblurElements: ${error}`);
        }
    }

    /**********************************
     * Canvas-Based Image Unblurring  *
     **********************************/

    function applyConvolution(imageData, kernel, kernelSize) {
        const width = imageData.width;
        const height = imageData.height;
        const inputData = imageData.data;
        const outputData = new Uint8ClampedArray(inputData.length);
        const half = Math.floor(kernelSize / 2);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;
                for (let ky = -half; ky <= half; ky++) {
                    for (let kx = -half; kx <= half; kx++) {
                        const ix = x + kx;
                        const iy = y + ky;
                        if (ix >= 0 && ix < width && iy >= 0 && iy < height) {
                            const idx = (iy * width + ix) * 4;
                            const weight = kernel[(ky + half) * kernelSize + (kx + half)];
                            r += inputData[idx] * weight;
                            g += inputData[idx + 1] * weight;
                            b += inputData[idx + 2] * weight;
                            a += inputData[idx + 3] * weight;
                        }
                    }
                }
                const outIdx = (y * width + x) * 4;
                outputData[outIdx] = Math.min(255, Math.max(0, r));
                outputData[outIdx + 1] = Math.min(255, Math.max(0, g));
                outputData[outIdx + 2] = Math.min(255, Math.max(0, b));
                outputData[outIdx + 3] = Math.min(255, Math.max(0, a));
            }
        }
        return new ImageData(outputData, width, height);
    }

    function sharpenImageData(imageData) {
        // Use a basic 3x3 sharpening kernel.
        const kernel = [
            -1, -1, -1,
            -1,  9, -1,
            -1, -1, -1
        ];
        return applyConvolution(imageData, kernel, 3);
    }

    // Canvas-based unblur for images.
    function advancedUnblurImages_Canvas() {
        try {
            const imgs = document.querySelectorAll('img');
            imgs.forEach(img => {
                try {
                    img.style.filter = 'none'; // Remove any CSS blur.
                    if (!img.complete || img.naturalWidth === 0) {
                        logMessage('warn', 'Skipping an image because it is not fully loaded.');
                        return;
                    }
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    context.drawImage(img, 0, 0);
                    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    let sharpenedData = sharpenImageData(imageData);
                    context.putImageData(sharpenedData, 0, 0);
                    img.src = canvas.toDataURL();
                    logMessage('info', 'Canvas-based advanced unblurring applied to an image.');
                } catch (innerError) {
                    logMessage('error', 'Error in canvas-based unblur: ' + innerError);
                }
            });
        } catch (error) {
            logMessage('error', 'Error in advancedUnblurImages_Canvas: ' + error);
        }
    }

    /**********************************
     * OpenCV.js-Based Image Unblurring *
     **********************************/

    function loadOpenCVJS(callback) {
        if (window.cv) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = "https://docs.opencv.org/4.x/opencv.js";
        script.async = true;
        script.onload = function () {
            cv['onRuntimeInitialized'] = function() {
                logMessage('info', 'OpenCV.js runtime initialized.');
                callback();
            };
        };
        script.onerror = function() {
            logMessage('error', 'Failed to load OpenCV.js.');
        };
        document.body.appendChild(script);
    }

    function advancedUnblurImages_OpenCV() {
        loadOpenCVJS(() => {
            const imgs = document.querySelectorAll('img');
            imgs.forEach(img => {
                try {
                    img.style.filter = 'none';
                    if (!img.complete || img.naturalWidth === 0) {
                        logMessage('warn', 'Skipping an image (OpenCV) because it is not fully loaded.');
                        return;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    let src = cv.imread(canvas);
                    let dst = new cv.Mat();
                    let kernel = cv.matFromArray(3, 3, cv.CV_32F,
                        [-1, -1, -1,
                         -1,  9, -1,
                         -1, -1, -1]);
                    cv.filter2D(src, dst, cv.CV_8U, kernel);
                    cv.imshow(canvas, dst);
                    src.delete(); dst.delete(); kernel.delete();
                    img.src = canvas.toDataURL();
                    logMessage('info', 'OpenCV-based advanced unblurring applied to an image.');
                } catch (e) {
                    logMessage('error', 'Error in advancedUnblurImages_OpenCV: ' + e);
                }
            });
        });
    }

    // Combined unblur function.
    function advancedUnblurContent() {
        try {
            unblurElements();
            forceLoadMedia();
            advancedUnblurImages_Canvas(); // Optionally, also run advancedUnblurImages_OpenCV();
            logMessage('info', 'Advanced unblur content executed.');
        } catch (error) {
            logMessage('error', 'Error in advancedUnblurContent: ' + error);
        }
    }

    /**********************************
     * Reveal Hidden Text Function    *
     **********************************/

    /**
     * Scans elements (e.g., within .text_layer) and if the computed text color is transparent
     * or a heavy text-shadow is applied, sets the text color to black, removes/reduces the shadow,
     * and ensures full opacity.
     */
    function revealHiddenText() {
        const textElements = document.querySelectorAll('.text_layer *');
        textElements.forEach(el => {
            try {
                const cs = window.getComputedStyle(el);
                if (cs.color === "rgba(0, 0, 0, 0)" || cs.color === "transparent") {
                    el.style.color = "black";
                }
                if (cs.textShadow && cs.textShadow !== "none") {
                    // Option: reduce the shadow blur (e.g., to 5px) instead of removing entirely.
                    el.style.textShadow = "none";
                }
                if (cs.opacity < 1) {
                    el.style.opacity = "1";
                }
            } catch (e) {
                logMessage('error', 'Error in revealHiddenText on an element: ' + e);
            }
        });
        logMessage('info', 'Completed revealHiddenText() processing.');
    }

    /**********************************
     * Advanced Hidden Data Recovery  *
     **********************************/

    function advancedRecoverHiddenContent() {
        let recoveredCount = 0;

        // Process media elements.
        const mediaSelectors = ['img', 'video', 'iframe', 'embed', 'object'];
        const mediaElements = document.querySelectorAll(mediaSelectors.join(','));
        mediaElements.forEach(el => {
            try {
                const cs = window.getComputedStyle(el);
                const zIndex = parseInt(cs.zIndex) || 0;
                if (zIndex > 1000) return;

                let isHidden = (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0');
                const rect = el.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) isHidden = true;
                if (isHidden) {
                    el.style.display = 'block';
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                    if (el.tagName.toLowerCase() === 'img' && (!el.complete || el.naturalWidth === 0)) {
                        el.src = el.src;
                    }
                    recoveredCount++;
                }
            } catch (e) {
                logMessage('error', 'Error processing media element in advancedRecoverHiddenContent: ' + e);
            }
        });

        // Process text elements.
        const textSelectors = ['p', 'span', 'div'];
        const textElements = document.querySelectorAll(textSelectors.join(','));
        textElements.forEach(el => {
            try {
                const cs = window.getComputedStyle(el);
                const zIndex = parseInt(cs.zIndex) || 0;
                if (zIndex > 1000) return;

                let isHidden = (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0');
                const rect = el.getBoundingClientRect();
                if (rect.width < 5 || rect.height < 5) isHidden = true;
                const text = el.innerText.trim();
                if (text.length > 5 && isHidden) {
                    el.style.display = 'block';
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                    recoveredCount++;
                }
            } catch (e) {
                logMessage('error', 'Error processing text element in advancedRecoverHiddenContent: ' + e);
            }
        });

        logMessage('info', `Advanced recovered ${recoveredCount} content element(s).`);
    }

    /**********************************
     * Fix Elements for Accessibility *
     **********************************/

    /**
     * 1. Removes any unselectable="on" attributes so that text can be selected.
     * 2. Hides known overlay elements (for example, with class "promo_div")
     *    so that the blank/blurred box does not obscure the page.
     */
    function fixElementsForAccessibility() {
        try {
            // Remove unselectable attributes.
            const unselectableElements = document.querySelectorAll('[unselectable="on"]');
            unselectableElements.forEach(el => {
                el.removeAttribute('unselectable');
            });
            logMessage('info', `Removed unselectable attribute from ${unselectableElements.length} element(s).`);

            // Hide problematic overlays.
            const promoElements = document.querySelectorAll('.promo_div');
            promoElements.forEach(el => {
                el.style.display = 'none';
            });
            logMessage('info', `Hid ${promoElements.length} promo element(s).`);
        } catch (error) {
            logMessage('error', 'Error in fixElementsForAccessibility: ' + error);
        }
    }

    /**********************************
     * Data Extraction Functions      *
     **********************************/

    function extractData() {
        let data = { texts: [], images: [], videos: [], docs: [] };
        try {
            document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(el => {
                const txt = el.innerText.trim();
                if (txt) data.texts.push(txt);
            });
            // For images, return an object with more details.
            data.images = Array.from(document.querySelectorAll('img')).map(img => ({
                src: (img.dataset && img.dataset.fullsrc) ? img.dataset.fullsrc : img.src,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                displayedWidth: img.width,
                displayedHeight: img.height,
                alt: img.alt || ""
            })).filter(obj => obj.src);
            data.videos = Array.from(document.querySelectorAll('video, iframe'))
                .map(el => (el.tagName.toLowerCase() === 'video' ? (el.currentSrc || el.src) : el.src))
                .filter(src => src);
            data.docs = Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => /\.(pdf|docx?|xlsx?|pptx?)($|\?)/i.test(href));
            logMessage('info', 'Basic data extraction complete.');
        } catch (error) {
            logMessage('error', `Error in extractData: ${error}`);
        }
        return data;
    }

    function extractMetaTags() {
        const metaData = {};
        try {
            const metaTags = document.querySelectorAll(
                'meta[property^="og:"], meta[name="description"], meta[name="keywords"], meta[name^="twitter:"]'
            );
            metaTags.forEach(meta => {
                const key = meta.getAttribute('property') || meta.getAttribute('name');
                const content = meta.getAttribute('content');
                if (key && content) metaData[key] = content;
            });
            logMessage('info', `Extracted ${Object.keys(metaData).length} meta tag(s).`);
        } catch (error) {
            logMessage('error', `Error in extractMetaTags: ${error}`);
        }
        return metaData;
    }

    function extractBackgroundImages() {
        const backgroundImages = [];
        try {
            const elements = document.querySelectorAll('[style*="background-image"]');
            elements.forEach(el => {
                const style = el.getAttribute('style');
                const regex = /background-image:\s*url\((['"]?)(.*?)\1\)/i;
                const match = regex.exec(style);
                if (match && match[2]) backgroundImages.push(match[2]);
            });
            logMessage('info', `Extracted ${backgroundImages.length} background image(s).`);
        } catch (error) {
            logMessage('error', `Error in extractBackgroundImages: ${error}`);
        }
        return backgroundImages;
    }

    function extractHiddenForms() {
        const formsData = [];
        try {
            const hiddenInputs = document.querySelectorAll('form input[type="hidden"]');
            hiddenInputs.forEach(input => {
                formsData.push({
                    name: input.name,
                    value: input.value,
                    form: input.form ? (input.form.action || 'N/A') : 'N/A'
                });
            });
            logMessage('info', `Extracted ${formsData.length} hidden form field(s).`);
        } catch (error) {
            logMessage('error', `Error in extractHiddenForms: ${error}`);
        }
        return formsData;
    }

    function extractShadowDOMData() {
        const shadowData = [];
        try {
            function traverseShadow(root) {
                let collectedText = '';
                root.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        collectedText += node.textContent.trim() + ' ';
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        collectedText += node.innerText.trim() + ' ';
                        if (node.shadowRoot) {
                            collectedText += traverseShadow(node.shadowRoot);
                        }
                    }
                });
                return collectedText;
            }
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                if (el.shadowRoot) {
                    const text = traverseShadow(el.shadowRoot);
                    shadowData.push({ host: el.tagName, text: text.trim() });
                }
            });
            logMessage('info', `Extracted shadow DOM data from ${shadowData.length} element(s).`);
        } catch (error) {
            logMessage('error', `Error in extractShadowDOMData: ${error}`);
        }
        return shadowData;
    }

    function advancedExtractData() {
        const basicData = extractData();
        const meta = extractMetaTags();
        const backgrounds = extractBackgroundImages();
        const hiddenForms = extractHiddenForms();
        const shadow = extractShadowDOMData();
        return { ...basicData, meta, backgrounds, hiddenForms, shadow };
    }

    /**********************************
     * OCR Functionality (Tesseract)  *
     **********************************/

    function loadTesseractJS(callback) {
        if (window.Tesseract) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@v2.1.5/dist/tesseract.min.js";
        script.onload = () => {
            logMessage('info', 'Tesseract.js loaded.');
            callback();
        };
        script.onerror = () => {
            logMessage('error', 'Failed to load Tesseract.js.');
        };
        document.body.appendChild(script);
    }

    function performOCR() {
        try {
            const outputDiv = document.getElementById('dataOutput');
            outputDiv.innerHTML += `<p>Starting OCR processing...</p>`;
            loadTesseractJS(() => {
                const imgs = Array.from(document.querySelectorAll('img')).filter(img => img.src);
                if (imgs.length === 0) {
                    outputDiv.innerHTML += `<p>No images found for OCR.</p>`;
                    logMessage('warn', 'No images available for OCR.');
                    return;
                }
                let ocrResults = [];
                let current = 0;
                function processNext() {
                    if (current >= imgs.length) {
                        outputDiv.innerHTML += `<p><strong>OCR Completed.</strong></p>`;
                        outputDiv.innerHTML += `<details open>
                            <summary>OCR Results (first 3)</summary>
                            <pre style="white-space: pre-wrap;">${ocrResults.slice(0, 3).join('\n\n')}</pre>
                        </details>`;
                        logMessage('info', 'OCR processing completed.');
                        return;
                    }
                    const img = imgs[current];
                    outputDiv.innerHTML += `<p>Processing image ${current + 1} of ${imgs.length}...</p>`;
                    window.Tesseract.recognize(img.src, 'eng', { logger: m => console.log(m) })
                        .then(result => {
                            ocrResults.push(result.data.text.trim());
                        })
                        .catch(err => {
                            ocrResults.push(`Error processing image: ${err}`);
                            logMessage('error', `OCR error on image ${current + 1}: ${err}`);
                        })
                        .finally(() => {
                            current++;
                            processNext();
                        });
                }
                processNext();
            });
        } catch (error) {
            logMessage('error', `Error in performOCR: ${error}`);
        }
    }

    /**********************************
     * Sidebar Interface & Controls   *
     **********************************/

    function createSidebar() {
        let sidebar = document.getElementById('ethicalDataSidebar');
        if (sidebar) return sidebar;

        sidebar = document.createElement('div');
        sidebar.id = 'ethicalDataSidebar';
        Object.assign(sidebar.style, {
            position: 'fixed',
            top: '0',
            right: '0',
            width: '400px',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: '#fff',
            overflowY: 'auto',
            zIndex: '9999',
            padding: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            lineHeight: '1.4'
        });

        sidebar.innerHTML = `
            <h2 style="margin-top:0;">Data Extraction</h2>
            <button id="refreshDataBtn" style="margin:5px 0;">Refresh Data</button>
            <button id="forceLoadMediaBtn" style="margin:5px 0;">Force Load Media</button>
            <button id="unblurContentBtn" style="margin:5px 0;">Advanced Unblur (Canvas)</button>
            <button id="unblurContentOpenCVBtn" style="margin:5px 0;">Advanced Unblur (OpenCV)</button>
            <button id="revealTextBtn" style="margin:5px 0;">Reveal Hidden Text</button>
            <button id="recoverHiddenBtn" style="margin:5px 0;">Recover Hidden Data</button>
            <button id="fixElementsBtn" style="margin:5px 0;">Enable Text Selection & Remove Overlays</button>
            <button id="ocrImagesBtn" style="margin:5px 0;">Perform OCR on Images</button>
            <button id="exportDataBtn" style="margin:5px 0;">Export JSON</button>
            <button id="clearLogsBtn" style="margin:5px 0;">Clear Logs</button>
            <div id="dataOutput" style="margin-top:10px;"></div>
            <hr>
            <h3>Logs</h3>
            <div id="logArea" style="max-height:150px; overflow-y:auto; background:#222; padding:5px; font-size:12px;"></div>
        `;
        document.body.appendChild(sidebar);

        document.getElementById('refreshDataBtn').addEventListener('click', updateSidebarData);
        document.getElementById('forceLoadMediaBtn').addEventListener('click', () => { forceLoadMedia(); updateSidebarData(); });
        document.getElementById('unblurContentBtn').addEventListener('click', advancedUnblurContent);
        document.getElementById('unblurContentOpenCVBtn').addEventListener('click', advancedUnblurImages_OpenCV);
        document.getElementById('revealTextBtn').addEventListener('click', () => { revealHiddenText(); updateSidebarData(); });
        document.getElementById('recoverHiddenBtn').addEventListener('click', () => { advancedRecoverHiddenContent(); updateSidebarData(); });
        document.getElementById('fixElementsBtn').addEventListener('click', () => { fixElementsForAccessibility(); updateSidebarData(); });
        document.getElementById('ocrImagesBtn').addEventListener('click', performOCR);
        document.getElementById('exportDataBtn').addEventListener('click', exportData);
        document.getElementById('clearLogsBtn').addEventListener('click', () => {
            const logArea = document.getElementById('logArea');
            if (logArea) { logArea.innerHTML = ""; }
        });

        logMessage('info', 'Sidebar created and event listeners attached.');
        return sidebar;
    }

    // Update the sidebar with extracted data while preserving open <details> states.
    function updateSidebarData() {
        try {
            // Preserve current open state of details elements.
            const detailsStates = {};
            document.querySelectorAll('#dataOutput details').forEach(d => {
                const summaryText = d.querySelector('summary')?.innerText || "";
                detailsStates[summaryText] = d.hasAttribute("open");
            });

            const data = advancedExtractData();
            const outputDiv = document.getElementById('dataOutput');
            if (!outputDiv) return;

            // Update innerHTML with advanced image data.
            outputDiv.innerHTML = `
                <p><strong>Text Blocks:</strong> ${data.texts.length}</p>
                <p><strong>Images:</strong> ${data.images.length}</p>
                <p><strong>Videos:</strong> ${data.videos.length}</p>
                <p><strong>Document Links:</strong> ${data.docs.length}</p>
                <hr>
                <details>
                  <summary>View Text (first 5)</summary>
                  <pre style="white-space: pre-wrap;">${data.texts.slice(0, 5).join('\n\n')}</pre>
                </details>
                <details>
                  <summary>View Image Data (first 5)</summary>
                  <pre style="white-space: pre-wrap;">${data.images.slice(0, 5).map(img =>
                    `src: ${img.src}\nnatural: ${img.naturalWidth}x${img.naturalHeight}\ndisplayed: ${img.displayedWidth}x${img.displayedHeight}\nalt: ${img.alt}`
                  ).join('\n\n')}</pre>
                </details>
                <details>
                  <summary>View Video URLs (first 5)</summary>
                  <pre style="white-space: pre-wrap;">${data.videos.slice(0, 5).join('\n')}</pre>
                </details>
                <details>
                  <summary>View Document Links (first 5)</summary>
                  <pre style="white-space: pre-wrap;">${data.docs.slice(0, 5).join('\n')}</pre>
                </details>
                <hr>
                <details>
                  <summary>Meta Tags (${Object.keys(data.meta).length})</summary>
                  <pre style="white-space: pre-wrap;">${JSON.stringify(data.meta, null, 2)}</pre>
                </details>
                <details>
                  <summary>Background Images (${data.backgrounds.length})</summary>
                  <pre style="white-space: pre-wrap;">${data.backgrounds.slice(0, 5).join('\n')}</pre>
                </details>
                <details>
                  <summary>Hidden Form Fields (${data.hiddenForms.length})</summary>
                  <pre style="white-space: pre-wrap;">${JSON.stringify(data.hiddenForms.slice(0, 5), null, 2)}</pre>
                </details>
                <details>
                  <summary>Shadow DOM Data (${data.shadow.length})</summary>
                  <pre style="white-space: pre-wrap;">${data.shadow.slice(0, 3).map(item => item.host + ': ' + item.text).join('\n\n')}</pre>
                </details>
            `;

            // Reapply previous details open states.
            document.querySelectorAll('#dataOutput details').forEach(d => {
                const summaryText = d.querySelector('summary')?.innerText || "";
                if (detailsStates[summaryText]) {
                    d.setAttribute("open", "");
                }
            });

            logMessage('info', 'Sidebar data updated.');
        } catch (error) {
            logMessage('error', `Error in updateSidebarData: ${error}`);
        }
    }

    function exportData() {
        try {
            const data = advancedExtractData();
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "extractedData.json";
            a.click();
            URL.revokeObjectURL(url);
            logMessage('info', 'Data exported as JSON.');
        } catch (error) {
            logMessage('error', `Error in exportData: ${error}`);
        }
    }

    /**********************************
     * Other Core Functionalities     *
     **********************************/

    // Re-enable right-click and copy/paste.
    function enableRightClickAndCopyPaste() {
        try {
            const events = ['contextmenu', 'copy', 'cut', 'paste'];
            events.forEach(eventName => {
                document.addEventListener(eventName, function(e) {
                    try { e.stopPropagation(); } catch (err) { logMessage('error', `Error in ${eventName} event: ${err}`); }
                }, true);
            });
            logMessage('info', 'Right-click and copy-paste events re-enabled.');
        } catch (error) {
            logMessage('error', `Error in enableRightClickAndCopyPaste: ${error}`);
        }
    }

    // Auto-expand "show more" / "read more" sections.
    function expandHiddenSections() {
        try {
            const buttons = document.querySelectorAll('button, a');
            let clickCount = 0;
            buttons.forEach(btn => {
                try {
                    const txt = btn.textContent.toLowerCase();
                    if (txt.includes('show more') || txt.includes('read more')) {
                        btn.click();
                        clickCount++;
                    }
                } catch (err) {
                    logMessage('error', `Error processing button: ${err}`);
                }
            });
            logMessage('info', `Clicked ${clickCount} "show more/read more" button(s).`);
        } catch (error) {
            logMessage('error', `Error in expandHiddenSections: ${error}`);
        }
    }

    /**********************************
     * Mutation Observer (Debounced)  *
     **********************************/

    const debouncedUpdate = debounce(() => {
        try {
            unblurElements();
            expandHiddenSections();
            updateSidebarData();
        } catch (error) {
            logMessage('error', `Error in debounced DOM update: ${error}`);
        }
    }, 500);

    function observeDomChanges() {
        try {
            const observer = new MutationObserver(debouncedUpdate);
            observer.observe(document.body, { childList: true, subtree: true });
            logMessage('info', 'DOM observer initialized.');
        } catch (error) {
            logMessage('error', `Error in observeDomChanges: ${error}`);
        }
    }

    /**********************************
     * Initialization                 *
     **********************************/

    function init() {
        try {
            enableRightClickAndCopyPaste();
            unblurElements();
            expandHiddenSections();
            createSidebar();
            updateSidebarData();
            observeDomChanges();
            logMessage('info', 'Advanced Responsive Ethical Data Gathering Tool initialized.');
        } catch (error) {
            logMessage('error', `Error during init: ${error}`);
        }
    }

    window.addEventListener('load', init);

})();
