// ==UserScript==
// @name         SubsPlease Enhanced Image Previews
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show image previews next to the anime titles with advanced Tampermonkey settings
// @author       dr.bobo0
// @license      MIT
// @match        https://subsplease.org/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/534228/SubsPlease%20Enhanced%20Image%20Previews.user.js
// @updateURL https://update.greasyfork.org/scripts/534228/SubsPlease%20Enhanced%20Image%20Previews.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration object with Tampermonkey-backed settings
    const CONFIG = {
        imageWidth: GM_getValue('imageWidth', 100),
        makeSquare: GM_getValue('makeSquare', false),
        enableHoverEffects: GM_getValue('enableHoverEffects', true),
        transparentUI: GM_getValue('transparentUI', false),

        saveSettings(key, value) {
            GM_setValue(key, value);
            this[key] = value;
        }
    };

    // Optimized update function with better transitions
    function updateImagesOnPage() {
        const images = document.querySelectorAll('.has-image img');
        if (!images.length) return;

        requestAnimationFrame(() => {
            images.forEach(img => {
                // Reset any previously set dimensions
                img.removeAttribute('style');

                // Apply new styles with smoother transitions
                img.style.cssText = `
                    width: ${CONFIG.imageWidth}px;
                    height: ${CONFIG.makeSquare ? `${CONFIG.imageWidth}px` : 'auto'};
                    cursor: pointer;
                    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 4px;
                    object-fit: ${CONFIG.makeSquare ? 'cover' : 'contain'};
                    max-width: none;
                    will-change: transform, width, height;
                    backface-visibility: hidden;
                    transform: translateZ(0);
                `;

                if (CONFIG.enableHoverEffects) {
                    const applyHoverEffect = () => {
                        img.style.transform = 'scale(1.1) translateZ(0)';
                        img.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    };

                    const removeHoverEffect = () => {
                        img.style.transform = 'scale(1) translateZ(0)';
                        img.style.boxShadow = 'none';
                    };

                    img.addEventListener('mouseenter', applyHoverEffect);
                    img.addEventListener('mouseleave', removeHoverEffect);

                    // Store event listeners for cleanup
                    img._hoverListeners = {
                        enter: applyHoverEffect,
                        leave: removeHoverEffect
                    };
                } else if (img._hoverListeners) {
                    // Clean up old listeners
                    img.removeEventListener('mouseenter', img._hoverListeners.enter);
                    img.removeEventListener('mouseleave', img._hoverListeners.leave);
                    delete img._hoverListeners;
                }

                // Update the containing cell width with transition
                const cell = img.parentElement;
                if (cell && cell.tagName === 'TD') {
                    cell.style.cssText = `
                        padding-right: 10px;
                        vertical-align: middle;
                        width: ${CONFIG.imageWidth + 10}px;
                        transition: width 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                }
            });
        });
    }

    function getLightness(rgbStr) {
        const matches = rgbStr.match(/\d+/g);
        if (!matches) return 0;
        const [r, g, b] = matches.map(Number);
        return (r + g + b) / 3 / 255;
    }

    function getThemeColors() {
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        const isLightMode = getLightness(bodyBg) > 0.5;

        const baseColors = isLightMode ? {
            bg: '#f0f0f0',
            text: '#333333',
            border: '#cccccc',
            hBorder: '#dddddd',
            buttonBg: '#dddddd',
            buttonText: '#333333',
            buttonHover: '#cccccc',
            shadow: 'rgba(0,0,0,0.1)'
        } : {
            bg: '#141414',
            text: '#e0e0e0',
            border: '#333333',
            hBorder: '#444444',
            buttonBg: '#444444',
            buttonText: '#ffffff',
            buttonHover: '#555555',
            shadow: 'rgba(0,0,0,0.4)'
        };

        // Apply transparency if enabled
        if (CONFIG.transparentUI) {
            baseColors.bg = isLightMode ? 'rgba(240, 240, 240, 0.8)' : 'rgba(20, 20, 20, 0.8)';
            baseColors.buttonBg = isLightMode ? 'rgba(221, 221, 221, 0.8)' : 'rgba(68, 68, 68, 0.8)';
            baseColors.buttonHover = isLightMode ? 'rgba(204, 204, 204, 0.8)' : 'rgba(85, 85, 85, 0.8)';
        }

        return baseColors;
    }

    function injectSettingsStyle(colors) {
        const styleId = 'subsplease-settings-style';
        let style = document.getElementById(styleId);
        if (style) style.remove();

        style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #subsplease-settings-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${colors.bg};
                color: ${colors.text};
                border: 2px solid ${colors.border};
                border-radius: 10px;
                padding: 20px;
                width: 400px;
                max-width: 90%;
                box-shadow: 0 4px 6px ${colors.shadow};
                z-index: 10000;
            }
            #subsplease-settings-container h2 {
                margin-top: 0;
                border-bottom: 1px solid ${colors.hBorder};
                padding-bottom: 10px;
                color: ${colors.text};
            }
            .setting-row {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                gap: 10px;
            }
            .setting-row label {
                flex-grow: 1;
                color: ${colors.text};
            }
            #preview-image {
                max-width: 100%;
                border-radius: 4px;
                margin-top: 10px;
            }
            .button-row {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
            }
            .button-row button {
                background: ${colors.buttonBg};
                color: ${colors.buttonText};
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                cursor: pointer;
                transition: background 0.3s;
            }
            .button-row button:hover {
                background: ${colors.buttonHover};
            }
            #image-width-slider {
                width: 200px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    // Global theme monitoring
    let globalThemeObserver = null;

    function startGlobalThemeMonitoring() {
        if (globalThemeObserver) return;

        let currentBg = getComputedStyle(document.body).backgroundColor;

        globalThemeObserver = new MutationObserver(() => {
            const newBg = getComputedStyle(document.body).backgroundColor;
            if (newBg !== currentBg) {
                const settingsContainer = document.getElementById('subsplease-settings-container');
                if (settingsContainer) {
                    const newColors = getThemeColors();
                    injectSettingsStyle(newColors);
                }
                currentBg = newBg;
            }
        });

        // Observe changes to body attributes (like class changes for theme switching)
        globalThemeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'style'],
            subtree: false
        });

        // Also observe changes to html element
        globalThemeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style', 'data-theme'],
            subtree: false
        });
    }

    function createSettingsUI() {
        // Store original values when opening settings
        const originalValues = {
            imageWidth: CONFIG.imageWidth,
            makeSquare: CONFIG.makeSquare,
            enableHoverEffects: CONFIG.enableHoverEffects,
            transparentUI: CONFIG.transparentUI
        };

        const settingsContainer = document.createElement('div');
        settingsContainer.id = 'subsplease-settings-container';
        settingsContainer.innerHTML = `
            <h2>SubsPlease Image Preview Settings</h2>

            <div class="setting-row">
                <label for="image-width-slider">Image Width: <span id="width-value">${CONFIG.imageWidth}px</span></label>
                <input type="range" id="image-width-slider" min="50" max="300" step="10" value="${CONFIG.imageWidth}">
            </div>

            <div class="setting-row">
                <label for="square-images-toggle">Square Images</label>
                <input type="checkbox" id="square-images-toggle" ${CONFIG.makeSquare ? 'checked' : ''}>
            </div>

            <div class="setting-row">
                <label for="hover-effects-toggle">Hover Effects</label>
                <input type="checkbox" id="hover-effects-toggle" ${CONFIG.enableHoverEffects ? 'checked' : ''}>
            </div>

            <div class="setting-row">
                <label for="transparent-ui-toggle">Transparent Settings UI</label>
                <input type="checkbox" id="transparent-ui-toggle" ${CONFIG.transparentUI ? 'checked' : ''}>
            </div>

            <div class="button-row">
                <button id="save-settings">Save</button>
                <button id="close-settings">Cancel</button>
            </div>
        `;

        document.body.appendChild(settingsContainer);

        // Apply initial theme
        const colors = getThemeColors();
        injectSettingsStyle(colors);

        const widthSlider = document.getElementById('image-width-slider');
        const widthValue = document.getElementById('width-value');
        const squareToggle = document.getElementById('square-images-toggle');
        const hoverToggle = document.getElementById('hover-effects-toggle');
        const transparentToggle = document.getElementById('transparent-ui-toggle');
        const saveButton = document.getElementById('save-settings');
        const closeButton = document.getElementById('close-settings');

        // Optimized slider update with debounce
        const smoothUpdate = debounce((value) => {
            CONFIG.imageWidth = parseInt(value);
            updateImagesOnPage();
        }, 10);

        // Show live changes on slider and toggles
        widthSlider.addEventListener('input', (e) => {
            widthValue.textContent = `${e.target.value}px`;
            smoothUpdate(e.target.value);
        });

        squareToggle.addEventListener('change', () => {
            CONFIG.makeSquare = squareToggle.checked;
            updateImagesOnPage();
        });

        hoverToggle.addEventListener('change', () => {
            CONFIG.enableHoverEffects = hoverToggle.checked;
            updateImagesOnPage();
        });

        transparentToggle.addEventListener('change', () => {
            CONFIG.transparentUI = transparentToggle.checked;
            const newColors = getThemeColors();
            injectSettingsStyle(newColors);
        });

        saveButton.addEventListener('click', () => {
            CONFIG.saveSettings('imageWidth', parseInt(widthSlider.value));
            CONFIG.saveSettings('makeSquare', squareToggle.checked);
            CONFIG.saveSettings('enableHoverEffects', hoverToggle.checked);
            CONFIG.saveSettings('transparentUI', transparentToggle.checked);
            settingsContainer.remove();
        });

        closeButton.addEventListener('click', () => {
            // Restore original values when canceling
            CONFIG.imageWidth = originalValues.imageWidth;
            CONFIG.makeSquare = originalValues.makeSquare;
            CONFIG.enableHoverEffects = originalValues.enableHoverEffects;
            CONFIG.transparentUI = originalValues.transparentUI;

            // Update the page with restored values
            updateImagesOnPage();

            settingsContainer.remove();
        });
    }

    // Start global theme monitoring when script loads
    startGlobalThemeMonitoring();

    GM_registerMenuCommand('Configure Image Previews', createSettingsUI);

    const injectImages = debounce(() => {
        const rows = document.querySelectorAll(".frontpage-releases-container tr:not(.has-image)");

        rows.forEach(row => {
            try {
                const name = row.querySelector(".release-item a");
                const { previewImage } = name.dataset;

                if (!previewImage) return;

                const img = document.createElement("img");
                img.src = previewImage;
                img.alt = name.textContent + " preview";

                img.style.cssText = `
                    width: ${CONFIG.imageWidth}px;
                    height: ${CONFIG.makeSquare ? `${CONFIG.imageWidth}px` : 'auto'};
                    cursor: pointer;
                    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 4px;
                    object-fit: ${CONFIG.makeSquare ? 'cover' : 'contain'};
                    max-width: none;
                    will-change: transform, width, height;
                    backface-visibility: hidden;
                    transform: translateZ(0);
                `;

                if (CONFIG.enableHoverEffects) {
                    img.addEventListener('mouseenter', () => {
                        img.style.transform = 'scale(1.1) translateZ(0)';
                        img.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    });
                    img.addEventListener('mouseleave', () => {
                        img.style.transform = 'scale(1) translateZ(0)';
                        img.style.boxShadow = 'none';
                    });
                }

                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = name.href;
                });

                const td = document.createElement("td");
                td.style.cssText = `
                    padding-right: 10px;
                    vertical-align: middle;
                    width: ${CONFIG.imageWidth + 10}px;
                    transition: width 0.15s cubic-bezier(0.4, 0, 0.2, 1);
                `;
                td.appendChild(img);

                row.insertBefore(td, row.querySelector("td:first-child"));
                row.classList.add('has-image');

                const info = row.querySelector(".release-item-time");
                if (info) {
                    info.style.verticalAlign = "top";
                }
            } catch (error) {
                console.warn('Error processing row:', error);
            }
        });
    }, 300);

    injectImages();

    const loadMoreButton = document.querySelector("#latest-load-more span");
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', injectImages);
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                injectImages();
                break;
            }
        }
    });

    const container = document.querySelector(".frontpage-releases-container");
    if (container) {
        observer.observe(container, {
            childList: true,
            subtree: true
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
})();