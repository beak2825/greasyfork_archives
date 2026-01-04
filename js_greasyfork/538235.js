// ==UserScript==
// @name        ZUZU QR Code Cacher
// @namespace   Violentmonkey Scripts
// @match       https://zuzu.prat.idf.il/*
// @grant       none
// @version     1.0
// @author      M.R
// @license MIT
// @description QR code caching for ZUZU
// @downloadURL https://update.greasyfork.org/scripts/538235/ZUZU%20QR%20Code%20Cacher.user.js
// @updateURL https://update.greasyfork.org/scripts/538235/ZUZU%20QR%20Code%20Cacher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'zuzu-barcode-cache',
        MAX_CACHE_SIZE: 50,
        CANVAS_STREAM_FPS: 15,
        MAX_DESCRIPTION_LENGTH: 100,
        AUTO_SAVE_DELAY: 1000
    };

    // State management
    const state = {
        selectedImage: null,
        isUsingRealCamera: true,
        lastCapturedImage: null,
        isModalOpen: false,
        originalMethods: {},
        errorCount: 0,
        lastErrorTime: 0
    };

    // Utility functions
    const utils = {
        log: (message, ...args) => {
            const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
            console.log(`[${timestamp}] [ZUZU Cacher] ${message}`, ...args);
        },

        error: (message, error) => {
            const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
            state.errorCount++;
            state.lastErrorTime = Date.now();

            console.error(`[${timestamp}] [ZUZU Cacher ERROR #${state.errorCount}] ${message}`, {
                error: error?.message || error,
                stack: error?.stack,
                context,
                state: {
                    isUsingRealCamera: state.isUsingRealCamera,
                    hasSelectedImage: !!state.selectedImage,
                    hasLastCaptured: !!state.lastCapturedImage,
                    isModalOpen: state.isModalOpen
                }
            });

            // Show user-friendly error notification on mobile
            if (state.errorCount <= 3) { // Don't spam on repeated errors
                ui.showNotification(`⚠️ Error: ${message}`, 5000, 'warning');
            }
        },

        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    try {
                        func(...args);
                    } catch (error) {
                        utils.error('Debounced function failed', error, { funcName: func.name });
                    }
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        sanitizeText: (text) => {
            return text.trim().substring(0, CONFIG.MAX_DESCRIPTION_LENGTH);
        },

        formatDate: (dateString) => {
            return new Date(dateString).toLocaleString('he-IL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        generateId: () => Date.now() + Math.random().toString(36).substr(2, 9),

        validateImageData: (imageData) => {
            return imageData &&
                typeof imageData.data === 'string' &&
                imageData.data.startsWith('data:image/') &&
                typeof imageData.width === 'number' &&
                typeof imageData.height === 'number';
        }
    };

    // Storage management
    const storage = {
        getLibrary: () => {
            try {
                const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
                const library = stored ? JSON.parse(stored) : [];
                return Array.isArray(library) ? library : [];
            } catch (error) {
                utils.error('Failed to load library from storage', error);
                return [];
            }
        },

        saveLibrary: (library) => {
            try {
                // Limit cache size
                const limitedLibrary = library.slice(0, CONFIG.MAX_CACHE_SIZE);
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(limitedLibrary));
                return true;
            } catch (error) {
                utils.error('Failed to save library to storage', error);
                return false;
            }
        },

        addItem: (text, imageData, qrData = null) => {
            if (!utils.validateImageData(imageData)) {
                utils.error('Invalid image data provided');
                return null;
            }

            const library = storage.getLibrary();
            const sanitizedText = utils.sanitizeText(text);

            // Remove existing item with same text
            const filteredLibrary = library.filter(item => item.text !== sanitizedText);

            const newItem = {
                id: utils.generateId(),
                text: sanitizedText,
                image: imageData,
                qrData: qrData,
                dateScanned: new Date().toISOString(),
                lastUsed: new Date().toISOString(),
                usageCount: 1
            };

            filteredLibrary.unshift(newItem);

            if (storage.saveLibrary(filteredLibrary)) {
                utils.log(`Saved item: ${sanitizedText}`);
                return newItem;
            }
            return null;
        },

        updateLastUsed: (id) => {
            const library = storage.getLibrary();
            const itemIndex = library.findIndex(item => item.id === id);

            if (itemIndex !== -1) {
                const item = library[itemIndex];
                item.lastUsed = new Date().toISOString();
                item.usageCount = (item.usageCount || 0) + 1;

                // Move to front
                library.splice(itemIndex, 1);
                library.unshift(item);

                storage.saveLibrary(library);
                return item;
            }
            return null;
        },

        deleteItem: (id) => {
            const library = storage.getLibrary();
            const filteredLibrary = library.filter(item => item.id !== id);
            return storage.saveLibrary(filteredLibrary);
        },

        exportData: () => {
            const library = storage.getLibrary();
            const exportData = {
                version: '3.0',
                exportDate: new Date().toISOString(),
                data: library
            };
            return JSON.stringify(exportData, null, 2);
        },

        importData: (jsonString) => {
            try {
                const importData = JSON.parse(jsonString);
                if (importData.data && Array.isArray(importData.data)) {
                    return storage.saveLibrary(importData.data);
                }
                return false;
            } catch (error) {
                utils.error('Failed to import data', error);
                return false;
            }
        }
    };

    // Camera and QR scanning hooks
    const hooks = {
        setupQrScanningHook: () => {
            if (state.originalMethods.setInterval) return;

            state.originalMethods.setInterval = window.setInterval;
            window.setInterval = function (callback, delay) {
                if (!callback.toString().includes('setDecodeQr')) {
                    return state.originalMethods.setInterval.apply(this, arguments);
                }

                utils.log('QR scanning interval detected');
                const wrappedCallback = function () {
                    try {
                        const video = document.getElementById('video-qr');
                        if (!video || !video.videoWidth || !video.videoHeight) {
                            utils.error('Video element was not found')
                            return callback.apply(this, arguments);
                        }

                        // Capture current frame
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

                        const callbackResult = callback.apply(this, arguments);

                        // Store captured image (debounced to avoid excessive captures)
                        if (state.isUsingRealCamera) {
                            state.lastCapturedImage = {
                                data: canvas.toDataURL('image/png', 0.8),
                                width: video.videoWidth,
                                height: video.videoHeight,
                                timestamp: Date.now()
                            };
                        }

                        return callbackResult;
                    } catch (error) {
                        utils.error('Error in QR scanning callback', error);
                        return callback.apply(this, arguments);
                    }
                };

                return state.originalMethods.setInterval.call(this, wrappedCallback, delay);
            };
        },

        setupNavigationHook: () => {
            if (state.originalMethods.pushState) return;

            state.originalMethods.pushState = window.history.pushState;
            window.history.pushState = function (stateObj, unused, url) {
                if (url === "/search" && state.isUsingRealCamera && state.lastCapturedImage) {
                    utils.log("Navigation to search detected, prompting to save scan");
                    setTimeout(() => {
                        ui.promptForSave();
                    }, CONFIG.AUTO_SAVE_DELAY);
                }
                return state.originalMethods.pushState.apply(this, [stateObj, unused, url]);
            };
        },

        setupCameraHook: () => {
            if (state.originalMethods.getUserMedia) return;

            state.originalMethods.getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            navigator.mediaDevices.getUserMedia = async function (constraints) {
                if (state.isUsingRealCamera) {
                    utils.log('Using real camera');
                    return state.originalMethods.getUserMedia(constraints);
                }

                if (state.selectedImage) {
                    utils.log('Using cached image stream');
                    return camera.createStreamFromImage(state.selectedImage);
                }

                return state.originalMethods.getUserMedia(constraints);
            };
        }
    };

    // Camera utilities
    const camera = {
        createStreamFromImage: (imageData) => {
            return new Promise((resolve, reject) => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = imageData.width;
                    canvas.height = imageData.height;

                    const ctx = canvas.getContext('2d');
                    const img = new Image();

                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, imageData.width, imageData.height);
                        const stream = canvas.captureStream(CONFIG.CANVAS_STREAM_FPS);
                        resolve(stream);
                    };

                    img.onerror = () => reject(new Error('Failed to load image'));
                    img.src = imageData.data;
                } catch (error) {
                    reject(error);
                }
            });
        }
    };

    // UI Management
    const ui = {
        showModal: () => {
            if (state.isModalOpen) return;

            ui.removeExistingModal();
            const modal = ui.createModal();
            document.body.appendChild(modal);
            state.isModalOpen = true;
            ui.updateImageList();
        },

        removeExistingModal: () => {
            const existingModal = document.getElementById('image-library-modal');
            if (existingModal) {
                existingModal.remove();
                state.isModalOpen = false;
            }
        },

        createModal: () => {
            const modal = document.createElement('div');
            modal.id = 'image-library-modal';
            modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.85); z-index: 10000; display: flex;
                    justify-content: center; align-items: center; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    touch-action: manipulation; -webkit-overflow-scrolling: touch;
            `;

            const content = document.createElement('div');
            content.style.cssText = `
                    background: white; border-radius: 16px; padding: 20px; 
                    max-width: 95vw; max-height: 90vh; overflow-y: auto; 
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: modalFadeIn 0.3s ease-out; width: 95%;
                    -webkit-overflow-scrolling: touch;
                `;

            content.innerHTML = `
                <style>
                    @keyframes modalFadeIn {
                        from { opacity: 0; transform: translateY(-20px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .btn {
                        padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer;
                        font-weight: 500; transition: all 0.2s; font-size: 16px;
                        touch-action: manipulation; min-height: 44px;
                    }
                    .btn-secondary { 
                        background: #f8f9fa; color: #333; border: 1px solid #dee2e6; 
                    }
                    .btn-secondary:active { background: #e9ecef; transform: scale(0.98); }
                    .btn-primary { background: #007bff; color: white; }
                    .btn-primary:hover { background: #0056b3; }
                    .btn-secondary:hover { background: #e9ecef; }
                    .btn-danger { background: #dc3545; color: white; }
                    .btn-danger:hover { background: #c82333; }
                </style>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 16px;">
                    <h2 style="margin: 0; color: #333; font-size: 22px;">🚌 Saved QR Codes</h2>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button id="export-btn" class="btn btn-secondary" title="Export data">📤</button>
                        <button id="import-btn" class="btn btn-secondary" title="Import data">📥</button>
                        <button id="close-modal" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #999;">&times;</button>
                    </div>
                </div>
                <div id="image-list"></div>
                <input type="file" id="import-file" accept=".json" style="display: none;">
            `;

            modal.appendChild(content);
            ui.attachModalEventListeners(modal);
            return modal;
        },

        attachModalEventListeners: (modal) => {
            // Close modal
            modal.querySelector('#close-modal').addEventListener('click', ui.removeExistingModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) ui.removeExistingModal();
            });

            // Export functionality
            modal.querySelector('#export-btn').addEventListener('click', () => {
                const data = storage.exportData();
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `zuzu-qr-cache-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            });

            // Import functionality
            const fileInput = modal.querySelector('#import-file');
            modal.querySelector('#import-btn').addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (storage.importData(e.target.result)) {
                            ui.updateImageList();
                            alert('Data imported successfully!');
                        } else {
                            alert('Failed to import data. Please check the file format.');
                        }
                    };
                    reader.readAsText(file);
                }
            });
        },

        updateImageList: () => {
            const library = storage.getLibrary();
            const listContainer = document.getElementById('image-list');

            if (!listContainer) return;

            if (library.length === 0) {
                listContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <div style="font-size: 48px; margin-bottom: 16px;">📱</div>
                        <p>No saved QR codes yet</p>
                        <p style="font-size: 14px;">Scan a QR code and it will be saved here</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = library.map(item => `
                <div style="
                    border: 1px solid #e1e5e9; border-radius: 12px; padding: 16px; margin-bottom: 12px;
                    display: flex; justify-content: space-between; align-items: center;
                    transition: all 0.2s; cursor: pointer; background: white;
                    ${item.qrData ? 'border-left: 4px solid #28a745;' : ''}
                " onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" 
                   onmouseout="this.style.boxShadow='none'"
                   onclick="selectImage('${item.id}')">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 6px; color: #333; font-size: 16px;">
                            ${item.qrData ? '✅ ' : '📷 '}${item.text}
                        </div>
                        ${item.qrData ? `
                            <div style="font-size: 12px; color: #28a745; margin-bottom: 6px; font-family: 'Monaco', 'Menlo', monospace; background: #f8f9fa; padding: 4px 8px; border-radius: 4px;">
                                ${item.qrData.length > 80 ? item.qrData.substring(0, 80) + '...' : item.qrData}
                            </div>
                        ` : ''}
                        <div style="font-size: 13px; color: #6c757d;">
                            <span>📅 ${utils.formatDate(item.dateScanned)}</span>
                            ${item.usageCount > 1 ? `<span style="margin-left: 12px;">🔄 Used ${item.usageCount} times</span>` : ''}
                            ${item.lastUsed !== item.dateScanned ?
                    `<span style="margin-left: 12px;">⏱️ ${utils.formatDate(item.lastUsed)}</span>` : ''}
                        </div>
                    </div>
                    <button onclick="event.stopPropagation(); deleteImage('${item.id}')" 
                            class="btn" style="margin-left: 12px; padding: 8px 12px;"
                            title="Delete this saved QR code">
                        🗑️
                    </button>
                </div>
            `).join('');
        },

        promptForSave: () => {
            if (!state.lastCapturedImage) return;

            const description = prompt('💾 Save this QR scan?\n\nEnter a description:', '');
            if (description && description.trim()) {
                const saved = storage.addItem(description.trim(), state.lastCapturedImage);
                if (saved) {
                    utils.log(`Successfully saved: ${description}`);
                    // Show brief success notification
                    ui.showNotification('✅ QR code saved successfully!');
                }
            }
        },

        showNotification: (message, duration = 3000) => {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed; top: 20px; right: 20px; background: #28a745; color: white;
                padding: 12px 20px; border-radius: 8px; z-index: 10001; font-weight: 500;
                font-size: initial;
                box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3); animation: slideInRight 0.3s ease-out;
            `;
            notification.textContent = message;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
                style.remove();
            }, duration);
        }
    };

    // Global functions for onclick handlers
    window.selectImage = (id) => {
        const library = storage.getLibrary();
        const item = library.find(item => item.id === id);
        if (item) {
            const updatedItem = storage.updateLastUsed(id);
            if (updatedItem) {
                state.selectedImage = item.image;
                state.isUsingRealCamera = false;
                ui.removeExistingModal();
                ui.showNotification(`🎯 Using cached QR: ${item.text}`);
                utils.log(`Selected cached image: ${item.text}`);
            }
        }
    };

    window.deleteImage = (id) => {
        if (confirm('🗑️ Are you sure you want to delete this saved QR code?')) {
            if (storage.deleteItem(id)) {
                ui.updateImageList();
                ui.showNotification('❌ QR code deleted');
            }
        }
    };

    // Main initialization
    const init = {
        setup: async () => {
            try {
                utils.log('🚀 Initializing ZUZU QR Cacher...');

                // Setup all hooks
                hooks.setupQrScanningHook();
                hooks.setupNavigationHook();
                hooks.setupCameraHook();

                // Show initial modal
                ui.showModal();

                utils.log('✅ ZUZU QR Cacher loaded successfully');
                ui.showNotification('🚌 ZUZU QR Cacher ready', 4000);

            } catch (error) {
                utils.error('Failed to initialize', error);
            }
        }
    };

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init.setup);
    } else {
        init.setup();
    }

})();