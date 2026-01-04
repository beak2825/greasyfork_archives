// ==UserScript==
// @name         Multi-Column Layout for printing (Print Only)
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2.5
// @description  Convert single column layout to multi-column layout only when printing. Press Ctrl+S to open settings.
// @author       KQ yang
// @match        *://*/*
// @match        file:///*
// @match        http://127.0.0.1:*/*
// @match        http://localhost:*/*
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/515840/Multi-Column%20Layout%20for%20printing%20%28Print%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515840/Multi-Column%20Layout%20for%20printing%20%28Print%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add colorful title and usage instructions right after initialization
    console.log('%c Multi-Column Layout for Printing v2.3 ',
        'background: #4A90E2; color: white; font-size: 14px; font-weight: bold; padding: 8px; border-radius: 4px; text-shadow: 1px 1px 1px rgba(0,0,0,0.2);');
    console.log('%c 📖 Usage: Press Ctrl+S to open settings, customize your layout, then Ctrl+P to print! ',
        'background: #2ECC71; color: white; font-size: 12px; padding: 6px; border-radius: 4px;');


    // Default configuration
    const DEFAULT_CONFIG = {
        columns: 1,
        columnGap: '30px',
        fontSize: '16px',
        paragraphSpacing: '1em',
        enablePageBreak: true,
        lineHeight: '1.5',
    };

    // Load config from localStorage or use defaults
    let CONFIG = loadConfig();

    function loadConfig() {
        const savedConfig = localStorage.getItem('printLayoutConfig');
        return savedConfig ? {...DEFAULT_CONFIG, ...JSON.parse(savedConfig)} : DEFAULT_CONFIG;
    }

    function saveConfig(config) {
        localStorage.setItem('printLayoutConfig', JSON.stringify(config));
        CONFIG = config;
        updateStyles();
    }

    let configModal = null; // 将configModal提升为全局变量

    // Create and inject the configuration UI
    function createConfigUI() {

        // 如果已经存在modal，先移除
        if (configModal) {
            configModal.remove();
        }

        configModal = document.createElement('div');
        configModal.id = 'print-layout-config-modal';
        configModal.setAttribute('style', `
            all: initial;
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: white !important;
            padding: 30px !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
            z-index: 2147483647 !important;
            display: none !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
            min-width: 320px !important;
            max-width: 90vw !important;
            animation: modalFadeIn 0.3s ease-out !important;
            color: black !important;
        `);

        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -48%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            .settings-row {
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .settings-row label {
                color: #333;
                font-size: 14px;
                margin-right: 15px;
            }
            .settings-row input[type="number"],
            .settings-row input[type="text"] {
                width: 100px;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            }
            .settings-row input:focus {
                outline: none;
                border-color: #4A90E2;
                box-shadow: 0 0 0 2px rgba(74,144,226,0.2);
            }
            .settings-row input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }
            .modal-title {
                color: #333;
                margin: 0 0 25px 0;
                font-size: 18px;
                font-weight: 600;
                border-bottom: 2px solid #eee;
                padding-bottom: 15px;
            }
            .modal-footer {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 2px solid #eee;
                text-align: right;
            }
            .save-button {
                background: #4A90E2;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .save-button:hover {
                background: #357ABD;
            }
            .close-button {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
                padding: 5px;
                line-height: 1;
            }
            .close-button:hover {
                color: #333;
            }
            #print-layout-config-modal {
                visibility: visible !important;
                display: block !important;
            }
        `;
        document.head.appendChild(styleElement);

        configModal.innerHTML = ''; // 清空现有内容
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            all: initial;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            color: black !important;
        `;
        modalContent.innerHTML = `
            <h3 class="modal-title">Print Layout Settings</h3>
            <button class="close-button" title="Close">×</button>
            <div class="settings-row">
                <label>Columns (1-4):</label>
                <input type="number" id="columns" min="1" max="4" value="${CONFIG.columns}">
            </div>
            <div class="settings-row">
                <label>Column Gap:</label>
                <input type="text" id="columnGap" value="${CONFIG.columnGap}">
            </div>
            <div class="settings-row">
                <label>Font Size:</label>
                <input type="text" id="fontSize" value="${CONFIG.fontSize}">
            </div>
            <div class="settings-row">
                <label>Paragraph Spacing:</label>
                <input type="text" id="paragraphSpacing" value="${CONFIG.paragraphSpacing}">
            </div>
            <div class="settings-row">
                <label>Line Height:</label>
                <input type="text" id="lineHeight" value="${CONFIG.lineHeight}">
            </div>
            <div class="settings-row">
                <label>Enable Page Break:</label>
                <input type="checkbox" id="enablePageBreak" ${CONFIG.enablePageBreak ? 'checked' : ''}>
            </div>
            <div class="modal-footer">
                <button class="save-button">Save Changes</button>
            </div>
        `;

        configModal.appendChild(modalContent);
        document.documentElement.appendChild(configModal);

        // Save button handler
        const saveButton = configModal.querySelector('.save-button');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const newConfig = {
                    columns: parseInt(configModal.querySelector('#columns').value, 10),
                    columnGap: configModal.querySelector('#columnGap').value,
                    fontSize: configModal.querySelector('#fontSize').value,
                    paragraphSpacing: configModal.querySelector('#paragraphSpacing').value,
                    lineHeight: configModal.querySelector('#lineHeight').value,
                    enablePageBreak: configModal.querySelector('#enablePageBreak').checked
                };
                saveConfig(newConfig);
                configModal.style.setProperty('display', 'none', 'important');
            });
        }

        // Close button handler
        const closeButton = configModal.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                configModal.style.setProperty('display', 'none', 'important');
            });
        }

        // Click outside to close
        configModal.addEventListener('click', (e) => {
            if (e.target === configModal) {
                configModal.style.setProperty('display', 'none', 'important');
            }
        });

        return configModal;
    }

    function showConfigModal() {
        console.log('Showing config modal'); // 调试日志
        if (!configModal) {
            configModal = createConfigUI();
        }
        configModal.style.setProperty('display', 'block', 'important');
        configModal.style.setProperty('visibility', 'visible', 'important');
    }

    function hideConfigModal() {
        if (configModal) {
            configModal.style.setProperty('display', 'none', 'important');
        }
    }

    function toggleConfigModal() {
        if (!configModal || configModal.style.display === 'none') {
            showConfigModal();
        } else {
            hideConfigModal();
        }
    }

    // Create and update styles based on current config
    function updateStyles() {
        const styleSheet = `
            @media print {
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    min-height: 0 !important;
                    height: auto !important;
                }
                .print-column-container {
                    column-count: ${CONFIG.columns} !important;
                    column-gap: ${CONFIG.columnGap} !important;
                    column-rule: 1px solid #ddd !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    min-height: 0 !important;
                    height: auto !important;
                    overflow: visible !important;
                    box-sizing: border-box !important;
                    font-size: ${CONFIG.fontSize} !important;
                    line-height: ${CONFIG.lineHeight} !important;
                    ${CONFIG.enablePageBreak ? '' : 'page-break-inside: avoid !important;'}
                }
                .print-column-container > * {
                    break-inside: avoid !important;
                    margin-bottom: ${CONFIG.paragraphSpacing} !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    page-break-inside: avoid !important;
                }
                .print-column-container img {
                    max-width: 100% !important;
                    height: auto !important;
                    page-break-inside: avoid !important;
                }
            }
        `;

        const existingStyle = document.getElementById('print-layout-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'print-layout-style';
        style.textContent = styleSheet;
        document.head.appendChild(style);
    }

    // Apply columns to main content
    function applyPrintColumns() {
        const mainContent = document.querySelector('.target-content') || document.body;
        mainContent.classList.add('print-column-container');

        const printStyle = document.createElement('style');
        printStyle.media = 'print';
        printStyle.textContent = `
            @page {
                margin: 1cm !important;
                padding: 0 !important;
                size: auto !important;
            }
        `;
        document.head.appendChild(printStyle);
    }

    // Initialize modal globally
    configModal = createConfigUI();

    // Handle Ctrl+S shortcut with improved event handling
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) {
            console.log('Ctrl+S detected'); // 调试日志
            e.stopPropagation();
            e.preventDefault();
            toggleConfigModal();
            return false;
        }
    }, true);

    // Initial style application
    updateStyles();

    // Handle DOMContentLoaded
    function onDOMContentLoaded() {
        applyPrintColumns();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
    } else {
        onDOMContentLoaded();
    }

    // Add a global function for testing
    window.togglePrintLayoutConfig = toggleConfigModal;


})();