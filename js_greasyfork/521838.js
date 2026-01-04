// ==UserScript==
// @name         Video Enhancement Control Panel
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Advanced video sharpening and enhancement with real-time controls
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521838/Video%20Enhancement%20Control%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/521838/Video%20Enhancement%20Control%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEFAULT_ENABLED = true;
    const DEFAULT_CONTRAST = 1.0;
    const DEFAULT_SATURATION = 1.0;

    // Shared panel variable
    let enhancementPanel = null;

    // Create enhancement control panel
    function createEnhancementPanel() {
        // If panel already exists, just show it
        if (enhancementPanel) {
            enhancementPanel.style.display = 'block';
            return enhancementPanel;
        }

        // Create panel container
        const panel = document.createElement('div');
        panel.id = 'video-enhancement-panel';
        panel.innerHTML = `
            <div class="panel-header">Video Enhancement Controls</div>
            <div class="panel-content">
                <div class="control-group">
                    <label>Sharpening:</label>
                    <input type="checkbox" id="sharpening-toggle">
                </div>
                <div class="control-group">
                    <label>Contrast:</label>
                    <input type="range" id="contrast-slider" min="0.5" max="2.0" step="0.1" value="${DEFAULT_CONTRAST}">
                    <span id="contrast-value">${DEFAULT_CONTRAST}</span>
                </div>
                <div class="control-group">
                    <label>Saturation:</label>
                    <input type="range" id="saturation-slider" min="0.0" max="2.0" step="0.1" value="${DEFAULT_SATURATION}">
                    <span id="saturation-value">${DEFAULT_SATURATION}</span>
                </div>
                <div class="panel-actions">
                    <button id="save-settings">Save</button>
                    <button id="close-panel">Close</button>
                </div>
            </div>
        `;

        // Add styles
        GM_addStyle(`
            #video-enhancement-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background: white;
                border: 2px solid #333;
                border-radius: 8px;
                z-index: 10000;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                font-family: Arial, sans-serif;
            }
            #video-enhancement-panel .panel-header {
                background: #f0f0f0;
                padding: 10px;
                font-weight: bold;
                text-align: center;
            }
            #video-enhancement-panel .panel-content {
                padding: 15px;
            }
            #video-enhancement-panel .control-group {
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }
            #video-enhancement-panel label {
                flex: 1;
                margin-right: 10px;
            }
            #video-enhancement-panel input[type="range"] {
                flex: 2;
                margin-right: 10px;
            }
            #video-enhancement-panel .panel-actions {
                display: flex;
                justify-content: space-between;
            }
            #video-enhancement-panel button {
                padding: 5px 10px;
                cursor: pointer;
            }
        `);

        // Append to body
        document.body.appendChild(panel);

        // Setup event listeners
        setupPanelEventListeners(panel);

        // Store reference
        enhancementPanel = panel;

        return panel;
    }

    // Setup event listeners for the panel
    function setupPanelEventListeners(panel) {
        // Get control elements
        const sharpeningToggle = panel.querySelector('#sharpening-toggle');
        const contrastSlider = panel.querySelector('#contrast-slider');
        const contrastValue = panel.querySelector('#contrast-value');
        const saturationSlider = panel.querySelector('#saturation-slider');
        const saturationValue = panel.querySelector('#saturation-value');
        const saveButton = panel.querySelector('#save-settings');
        const closeButton = panel.querySelector('#close-panel');

        // Initialize control states
        sharpeningToggle.checked = GM_getValue('videoEnhancementEnabled', DEFAULT_ENABLED);
        contrastSlider.value = GM_getValue('videoContrast', DEFAULT_CONTRAST);
        contrastValue.textContent = contrastSlider.value;
        saturationSlider.value = GM_getValue('videoSaturation', DEFAULT_SATURATION);
        saturationValue.textContent = saturationSlider.value;

        // Real-time preview for contrast
        contrastSlider.addEventListener('input', () => {
            contrastValue.textContent = contrastSlider.value;
            processVideos();
        });

        // Real-time preview for saturation
        saturationSlider.addEventListener('input', () => {
            saturationValue.textContent = saturationSlider.value;
            processVideos();
        });

        // Sharpening toggle
        sharpeningToggle.addEventListener('change', () => {
            processVideos();
        });

        // Save button
        saveButton.addEventListener('click', () => {
            GM_setValue('videoEnhancementEnabled', sharpeningToggle.checked);
            GM_setValue('videoContrast', parseFloat(contrastSlider.value));
            GM_setValue('videoSaturation', parseFloat(saturationSlider.value));
            processVideos();
        });

        // Close button
        closeButton.addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    // Create SVG filter
    function createSharpeningFilter() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('style', 'display:none');

        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'video-enhancement-filter');

        const feConvolveMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feConvolveMatrix');
        feConvolveMatrix.setAttribute('order', '3');
        feConvolveMatrix.setAttribute('kernelMatrix', '1 -1 1 -1 -1 -1 1 -1 1');

        filter.appendChild(feConvolveMatrix);
        svg.appendChild(filter);

        return svg;
    }

    // Apply filter to video
    function applyVideoFilter(video, contrast, saturation, isEnabled) {
        if (isEnabled) {
            video.style.filter = `url(#video-enhancement-filter) contrast(${contrast}) saturate(${saturation})`;
            video.videoEnhancementApplied = true;
        } else {
            video.style.filter = '';
            video.videoEnhancementApplied = false;
        }
    }

    // Main function to process videos
    function processVideos() {
        const isEnabled = GM_getValue('videoEnhancementEnabled', DEFAULT_ENABLED);
        const contrast = GM_getValue('videoContrast', DEFAULT_CONTRAST);
        const saturation = GM_getValue('videoSaturation', DEFAULT_SATURATION);

        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            applyVideoFilter(video, contrast, saturation, isEnabled);
        });
    }

    // Initialization
    function init() {
        // Append SVG filter to document
        document.body.appendChild(createSharpeningFilter());

        // Initial video processing
        processVideos();

        // MutationObserver to handle dynamically added videos
        const observer = new MutationObserver(processVideos);
        observer.observe(document.body, { childList: true, subtree: true });

        // Register Tampermonkey menu commands
        GM_registerMenuCommand('Open Video Enhancement Panel', () => {
            createEnhancementPanel();
        });

        GM_registerMenuCommand('Toggle Video Enhancement', () => {
            const currentState = GM_getValue('videoEnhancementEnabled', DEFAULT_ENABLED);
            GM_setValue('videoEnhancementEnabled', !currentState);
            processVideos();
        });

        GM_registerMenuCommand('Reset to Default Settings', () => {
            GM_setValue('videoEnhancementEnabled', DEFAULT_ENABLED);
            GM_setValue('videoContrast', DEFAULT_CONTRAST);
            GM_setValue('videoSaturation', DEFAULT_SATURATION);
            processVideos();
        });
    }

    // Run initialization
    init();
})();