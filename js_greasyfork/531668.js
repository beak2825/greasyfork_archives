// ==UserScript==
// @name         Character.ai Changer
// @namespace    http://tampermonkey
// @version      1.00.1V3
// @description  Combined Background Changer and Color Customizer for Character.AI
// @author       NotYou
// @match        https://character.ai/*
// @match        https://*.character.ai/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531668/Characterai%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/531668/Characterai%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // SCRIPT 1: Character.AI Background Changer
    // ==========================================

    (function() {
    'use strict';

    // Initialize logging
    console.log('Character.AI Background Changer initialized');

    function log(message) {
        console.log(`[BG Changer]: ${message}`);
    }

    // Create UI elements
    const controlPanel = document.createElement('div');
    const btnToggle = document.createElement('button');
    const statusIndicator = document.createElement('div');

    // Set up control panel
    function setupControlPanel() {
        controlPanel.id = 'cai-bg-control-panel';
        controlPanel.style.position = 'fixed';
        controlPanel.style.bottom = '60px';
        controlPanel.style.right = '20px';
        controlPanel.style.width = '250px';
        controlPanel.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
        controlPanel.style.color = 'white';
        controlPanel.style.padding = '15px';
        controlPanel.style.borderRadius = '8px';
        controlPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        controlPanel.style.zIndex = '9999999';
        controlPanel.style.fontFamily = 'Arial, sans-serif';
        controlPanel.style.fontSize = '14px';
        controlPanel.style.display = 'none';

        controlPanel.innerHTML = `
            <div id="panel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 16px;">Background Changer</h3>
                <button id="close-panel" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">×</button>
            </div>

            <div id="panel-content">
                <div style="margin-bottom: 15px;">
                    <label for="bg-url" style="display: block; margin-bottom: 5px;">Image URL:</label>
                    <input type="text" id="bg-url" placeholder="https://example.com/image.jpg" style="width: 100%; padding: 5px; box-sizing: border-box; margin-bottom: 5px;">
                    <button id="apply-url" style="padding: 5px 10px; background: #4a4a4a; border: none; color: white; cursor: pointer; border-radius: 3px;">Apply URL</button>
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="bg-upload" style="display: block; margin-bottom: 5px;">Upload Image:</label>
                    <input type="file" id="bg-upload" accept="image/*" style="width: 100%; margin-bottom: 5px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label for="bg-color" style="display: block; margin-bottom: 5px;">Background Color:</label>
                    <div style="display: flex; align-items: center;">
                        <input type="color" id="bg-color" value="#1a1a1a" style="margin-right: 10px;">
                        <button id="apply-color" style="padding: 5px 10px; background: #4a4a4a; border: none; color: white; cursor: pointer; border-radius: 3px;">Apply Color</button>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <button id="reset-bg" style="padding: 8px 15px; background: #cc3333; border: none; color: white; cursor: pointer; border-radius: 3px;">Reset Background</button>
                </div>
            </div>
        `;
    }

    // Set up toggle button
    function setupToggleButton() {
        btnToggle.id = 'cai-bg-toggle';
        btnToggle.textContent = 'Change BG';
        btnToggle.style.position = 'fixed';
        btnToggle.style.bottom = '20px';
        btnToggle.style.right = '20px';
        btnToggle.style.padding = '8px 12px';
        btnToggle.style.backgroundColor = '#3a3';
        btnToggle.style.color = 'white';
        btnToggle.style.border = 'none';
        btnToggle.style.borderRadius = '5px';
        btnToggle.style.fontSize = '14px';
        btnToggle.style.fontWeight = 'bold';
        btnToggle.style.cursor = 'pointer';
        btnToggle.style.zIndex = '9999997';
        btnToggle.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    }

    // Set up status indicator
    function setupStatusIndicator() {
        statusIndicator.id = 'cai-bg-status';
        statusIndicator.style.position = 'fixed';
        statusIndicator.style.bottom = '20px';
        statusIndicator.style.left = '20px';
        statusIndicator.style.padding = '8px 12px';
        statusIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        statusIndicator.style.color = 'white';
        statusIndicator.style.borderRadius = '4px';
        statusIndicator.style.fontSize = '14px';
        statusIndicator.style.zIndex = '9999998';
        statusIndicator.style.opacity = '0';
        statusIndicator.style.transition = 'opacity 0.5s';
        statusIndicator.textContent = 'Background changer ready';
    }

    // Toggle panel visibility
    function togglePanel() {
        const isVisible = controlPanel.style.display === 'block';

        if (isVisible) {
            controlPanel.style.display = 'none';
            btnToggle.style.backgroundColor = '#3a3';
        } else {
            controlPanel.style.display = 'block';
            btnToggle.style.backgroundColor = '#555';
        }
    }

    // Show status message
    function showStatus(message, duration = 2000) {
        statusIndicator.textContent = message;
        statusIndicator.style.opacity = '1';

        setTimeout(() => {
            statusIndicator.style.opacity = '0';
        }, duration);
    }

    // Apply background from URL
    function applyUrlBackground() {
        const url = document.getElementById('bg-url').value.trim();

        if (!url) {
            showStatus('Please enter a valid URL');
            return;
        }

        applyBackground(`url(${url}) no-repeat center center fixed`, 'cover');
        showStatus('Background applied from URL');
    }

    // Apply background from color picker
    function applyColorBackground() {
        const color = document.getElementById('bg-color').value;
        applyBackground(color);
        showStatus('Background color applied');
    }

    // Apply background image from file upload
    function handleImageUpload(event) {
        const file = event.target.files[0];

        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            showStatus('Please select an image file');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            const imageUrl = e.target.result;
            applyBackground(`url(${imageUrl}) no-repeat center center fixed`, 'cover');
            showStatus('Background image applied');

            // Save the image data to GM storage
            GM_setValue('bgImageData', imageUrl);
        };

        reader.readAsDataURL(file);
    }

    // Apply background
    function applyBackground(style, size = null) {
        document.body.style.background = style;

        if (size) {
            document.body.style.backgroundSize = size;
        }

        // Save settings
        GM_setValue('bgStyle', style);
        GM_setValue('bgSize', size || '');
    }

    // Reset background
    function resetBackground() {
        document.body.style.background = '';
        document.body.style.backgroundSize = '';

        // Clear saved values
        GM_setValue('bgStyle', '');
        GM_setValue('bgSize', '');
        GM_setValue('bgImageData', '');

        // Reset form inputs
        const urlInput = document.getElementById('bg-url');
        const uploadInput = document.getElementById('bg-upload');

        if (urlInput) urlInput.value = '';
        if (uploadInput) uploadInput.value = '';

        showStatus('Background reset to default');
    }

    // Restore saved background
    function restoreBackground() {
        const bgStyle = GM_getValue('bgStyle', '');
        const bgSize = GM_getValue('bgSize', '');

        if (bgStyle) {
            document.body.style.background = bgStyle;

            if (bgSize) {
                document.body.style.backgroundSize = bgSize;
            }

            log('Restored saved background');
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Toggle button
        btnToggle.addEventListener('click', togglePanel);

        // Close panel button
        document.getElementById('close-panel')?.addEventListener('click', () => {
            togglePanel();
        });

        // Apply URL background
        document.getElementById('apply-url')?.addEventListener('click', applyUrlBackground);

        // Apply color background
        document.getElementById('apply-color')?.addEventListener('click', applyColorBackground);

        // Handle file upload
        document.getElementById('bg-upload')?.addEventListener('change', handleImageUpload);

        // Reset background
        document.getElementById('reset-bg')?.addEventListener('click', resetBackground);

        log('Event listeners set up');
    }

    // DOM Ready helper function
    function domReady(callback) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            setTimeout(callback, 1);
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    // Initialize everything when DOM is ready
    function init() {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        try {
            // Setup UI elements
            setupControlPanel();
            setupToggleButton();
            setupStatusIndicator();

            // Add elements to the page
            document.body.appendChild(controlPanel);
            document.body.appendChild(btnToggle);
            document.body.appendChild(statusIndicator);

            // Setup event listeners
            setupEventListeners();

            // Restore saved background
            restoreBackground();

            // Show initial status
            showStatus('Background changer ready');

            log('Initialization complete');
        } catch (error) {
            console.error('[BG Changer Error]:', error);
        }
    }

    // Run initialization when DOM is ready
    domReady(() => {
        init();

        // Additional safety check
        setTimeout(() => {
            if (!document.getElementById('cai-bg-control-panel')) {
                log('Panel not found, retrying initialization');
                init();
            }
        }, 3000);
    });

    // Backup initialization on window load
    window.addEventListener('load', () => {
        if (!document.getElementById('cai-bg-control-panel')) {
            log('Panel not found on window load, reinitializing');
            init();
        }
    });
})();

    // ==========================================
    // SCRIPT 2: Enhanced Color Customizer
    // ==========================================

    (function() {
    'use strict';

    // Helper function to get the current theme
    function getCurrentTheme() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }

    // Default colors based on theme
    function getDefaultColors(theme) {
        const darkColors = {
            'italic': '#E0DF7F',
            'quotationmarks': '#FFFFFF',
            'plaintext': '#A2A2AC',
            'custom': '#E0DF7F',
            'charbubble': '#26272B',
            'userbubble': '#303136',
            'guide': '#131316',
            'input': '#202024',
            'body': '#18181B',
            'accent': '#26272B'
        };

        const lightColors = {
            'italic': '#4F7AA6',
            'quotationmarks': '#000000',
            'plaintext': '#374151',
            'custom': '#4F7AA6',
            'charbubble': '#E4E4E7',
            'userbubble': '#D9D9DF',
            'guide': '#FAFAFA',
            'input': '#F4F4F5',
            'body': '#ECECEE',
            'accent': '#26272B'
        };

        return theme === 'dark' ? darkColors : lightColors;
    }

    // Load Comic Sans MS and other web fonts
    function loadWebFonts() {
        // Add Comic Sans MS
        GM_addStyle(`
            @import url('https://fonts.cdnfonts.com/css/comic-sans');

            @font-face {
                font-family: 'Comic Sans MS';
                src: local('Comic Sans MS'),
                     url('https://fonts.cdnfonts.com/s/11177/comici.woff') format('woff'),
                     url('https://fonts.cdnfonts.com/s/11177/comicbd.woff') format('woff');
                font-display: swap;
            }
        `);

        // Add Google Fonts
        const googleFontsLink = document.createElement('link');
        googleFontsLink.rel = 'stylesheet';
        googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&display=swap';
        document.head.appendChild(googleFontsLink);
    }

    // Create main customization menu
    function createCustomizationMenu() {
        const theme = getCurrentTheme();
        const menuContainer = document.createElement('div');
        menuContainer.id = 'cai-color-customizer';
        menuContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 900px;
            background-color: ${theme === 'dark' ? 'rgba(19, 19, 22, 0.95)' : 'rgba(214, 214, 221, 0.95)'};
            border-radius: 10px;
            padding: 20px;
            z-index: 9999;
            display: none;
        `;

        // Tabs container
        const tabContainer = document.createElement('div');
        tabContainer.style.cssText = `
            display: flex;
            margin-bottom: 15px;
        `;

        // Content container
        const contentContainer = document.createElement('div');

        // Create tabs
        const tabs = [
            { name: 'Colors', id: 'colors' },
            { name: 'Typography', id: 'typography' },
            { name: 'Layout', id: 'layout' }
        ];

        tabs.forEach(tab => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tab.name;
            tabButton.style.cssText = `
                flex-grow: 1;
                padding: 10px;
                background-color: ${theme === 'dark' ? '#26272B' : '#E4E4E7'};
                border: none;
                margin-right: 5px;
                cursor: pointer;
            `;

            tabButton.addEventListener('click', () => {
                // Hide all content
                contentContainer.innerHTML = '';

                // Show specific tab content
                switch(tab.id) {
                    case 'colors':
                        renderColorTab(contentContainer);
                        break;
                    case 'typography':
                        renderTypographyTab(contentContainer);
                        break;
                    case 'layout':
                        renderLayoutTab(contentContainer);
                        break;
                }
            });

            tabContainer.appendChild(tabButton);
        });

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        `;
        closeButton.addEventListener('click', () => {
            menuContainer.style.display = 'none';
        });

        menuContainer.appendChild(closeButton);
        menuContainer.appendChild(tabContainer);
        menuContainer.appendChild(contentContainer);

        document.body.appendChild(menuContainer);

        // Auto-select the first tab on creation
        tabContainer.firstChild.click();

        return menuContainer;
    }

    // Render color customization tab
    function renderColorTab(container) {
        const theme = getCurrentTheme();
        const categories = ['italic', 'quotationmarks', 'plaintext', 'custom', 'charbubble', 'userbubble', 'guide', 'input', 'body', 'accent'];

        categories.forEach(category => {
            const colorWrapper = document.createElement('div');
            colorWrapper.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            `;

            const label = document.createElement('label');
            label.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            label.style.marginRight = '10px';

            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = GM_getValue(`${category}_color`, getDefaultColors(theme)[category]);

            colorPicker.addEventListener('input', () => {
                GM_setValue(`${category}_color`, colorPicker.value);
                applyCustomColors();
            });

            colorWrapper.appendChild(label);
            colorWrapper.appendChild(colorPicker);
            container.appendChild(colorWrapper);
        });
    }

    // Render typography tab
    function renderTypographyTab(container) {
        // Typography container
        const typographyContainer = document.createElement('div');
        typographyContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        // Font selector
        const fontSelectContainer = document.createElement('div');
        fontSelectContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const fontSelectLabel = document.createElement('label');
        fontSelectLabel.textContent = 'Font Family:';

        const fontSelect = document.createElement('select');
        fontSelect.style.width = '100%';

        // Common fonts including Comic Sans MS
        const fonts = [
            'Comic Sans MS', 'Inter', 'Arial', 'Helvetica', 'Verdana', 'Tahoma',
            'Times New Roman', 'Georgia', 'Garamond',
            'Courier New', 'Consolas', 'Monaco',
            'Roboto', 'Open Sans', 'Lato', 'Montserrat'
        ];

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Default';
        fontSelect.appendChild(defaultOption);

        // Add font options
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            option.style.fontFamily = font;
            fontSelect.appendChild(option);
        });

        // Set selected value from saved preference
        fontSelect.value = GM_getValue('selected_font', '');

        fontSelect.addEventListener('change', () => {
            GM_setValue('selected_font', fontSelect.value);
            applyTypographySettings();
        });

        fontSelectContainer.appendChild(fontSelectLabel);
        fontSelectContainer.appendChild(fontSelect);
        typographyContainer.appendChild(fontSelectContainer);

        // Font Style
        const fontStyleContainer = document.createElement('div');
        fontStyleContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-top: 10px;
        `;

        const fontStyleLabel = document.createElement('label');
        fontStyleLabel.textContent = 'Font Style:';

        const fontStyleOptions = document.createElement('div');
        fontStyleOptions.style.cssText = `
            display: flex;
            gap: 10px;
        `;

        // Bold checkbox
        const boldContainer = document.createElement('div');
        const boldCheckbox = document.createElement('input');
        boldCheckbox.type = 'checkbox';
        boldCheckbox.id = 'font-bold';
        boldCheckbox.checked = GM_getValue('fontBold', false);

        const boldLabel = document.createElement('label');
        boldLabel.textContent = 'Bold';
        boldLabel.htmlFor = 'font-bold';

        boldCheckbox.addEventListener('change', () => {
            GM_setValue('fontBold', boldCheckbox.checked);
            applyTypographySettings();
        });

        boldContainer.appendChild(boldCheckbox);
        boldContainer.appendChild(boldLabel);

        // Italic checkbox
        const italicContainer = document.createElement('div');
        const italicCheckbox = document.createElement('input');
        italicCheckbox.type = 'checkbox';
        italicCheckbox.id = 'font-italic';
        italicCheckbox.checked = GM_getValue('fontItalic', false);

        const italicLabel = document.createElement('label');
        italicLabel.textContent = 'Italic';
        italicLabel.htmlFor = 'font-italic';

        italicCheckbox.addEventListener('change', () => {
            GM_setValue('fontItalic', italicCheckbox.checked);
            applyTypographySettings();
        });

        italicContainer.appendChild(italicCheckbox);
        italicContainer.appendChild(italicLabel);

        fontStyleOptions.appendChild(boldContainer);
        fontStyleOptions.appendChild(italicContainer);
        fontStyleContainer.appendChild(fontStyleLabel);
        fontStyleContainer.appendChild(fontStyleOptions);
        typographyContainer.appendChild(fontStyleContainer);

        // Font Size Slider
        const fontSizeContainer = document.createElement('div');
        fontSizeContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const fontSizeLabel = document.createElement('label');
        fontSizeLabel.textContent = 'Font Size: ' + GM_getValue('fontSize', 16) + 'px';

        const fontSizeSlider = document.createElement('input');
        fontSizeSlider.type = 'range';
        fontSizeSlider.min = 10;
        fontSizeSlider.max = 30;
        fontSizeSlider.value = GM_getValue('fontSize', 16);
        fontSizeSlider.style.width = '100%';

        fontSizeSlider.addEventListener('input', () => {
            const newSize = fontSizeSlider.value;
            fontSizeLabel.textContent = 'Font Size: ' + newSize + 'px';
            GM_setValue('fontSize', newSize);
            applyTypographySettings();
        });

        fontSizeContainer.appendChild(fontSizeLabel);
        fontSizeContainer.appendChild(fontSizeSlider);
        typographyContainer.appendChild(fontSizeContainer);

        container.appendChild(typographyContainer);
    }

    // Render layout tab
    function renderLayoutTab(container) {
        const layoutContainer = document.createElement('div');
        layoutContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        // Avatar size control
        const avatarSizeContainer = document.createElement('div');
        avatarSizeContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Avatar Image Size (px):';

        const sizeInput = document.createElement('input');
        sizeInput.type = 'number';
        sizeInput.value = GM_getValue('image_size', '24');
        sizeInput.min = '16';
        sizeInput.max = '64';
        sizeInput.style.width = '60px';

        sizeInput.addEventListener('change', () => {
            GM_setValue('image_size', sizeInput.value);
            applyLayoutSettings();
        });

        avatarSizeContainer.appendChild(sizeLabel);
        avatarSizeContainer.appendChild(sizeInput);
        layoutContainer.appendChild(avatarSizeContainer);

        // Chat bubble spacing control
        const spacingContainer = document.createElement('div');
        spacingContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const spacingLabel = document.createElement('label');
        spacingLabel.textContent = 'Message Spacing (px):';

        const spacingInput = document.createElement('input');
        spacingInput.type = 'number';
        spacingInput.value = GM_getValue('message_spacing', '10');
        spacingInput.min = '0';
        spacingInput.max = '30';
        spacingInput.style.width = '60px';

        spacingInput.addEventListener('change', () => {
            GM_setValue('message_spacing', spacingInput.value);
            applyLayoutSettings();
        });

        spacingContainer.appendChild(spacingLabel);
        spacingContainer.appendChild(spacingInput);
        layoutContainer.appendChild(spacingContainer);

        container.appendChild(layoutContainer);
    }

    // Apply color customizations dynamically
    function applyCustomColors() {
        const theme = getCurrentTheme();
        const defaultColors = getDefaultColors(theme);
        const categories = ['italic', 'quotationmarks', 'plaintext', 'custom', 'charbubble', 'userbubble', 'guide', 'input', 'body', 'accent'];

        // Remove any existing style element
        const existingStyle = document.getElementById('cai-custom-colors');
        if (existingStyle) {
            existingStyle.remove();
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'cai-custom-colors';
        let css = '';

        categories.forEach(category => {
            const color = GM_getValue(`${category}_color`, defaultColors[category]);

            switch(category) {
                case 'italic':
                    css += `em { color: ${color} !important; } `;
                    break;
                case 'quotationmarks':
                    css += `blockquote { color: ${color} !important; } `;
                    break;
                case 'plaintext':
                    css += `p[node='[object Object]'] { color: ${color} !important; } `;
                    break;
                case 'charbubble':
                    css += `.mt-1.bg-surface-elevation-2 { background-color: ${color} !important; } `;
                    break;
                case 'userbubble':
                    css += `.mt-1.bg-surface-elevation-3 { background-color: ${color} !important; } `;
                    break;
                case 'guide':
                    css += `.overflow-y-auto { background-color: ${color} !important; } `;
                    break;
                case 'input':
                    css += `.w-full.border-none.bg-surface-elevation-1 { background-color: ${color} !important; } `;
                    break;
                case 'body':
                    css += `body { background-color: ${color} !important; } `;
                    break;
                case 'accent':
                    css += `.text-primary-600 { color: ${color} !important; } `;
                    break;
                case 'custom':
                    css += `code, pre { color: ${color} !important; } `;
                    break;
            }
        });

        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    // Apply typography settings
    function applyTypographySettings() {
        // Remove any existing style element
        const existingStyle = document.getElementById('cai-custom-typography');
        if (existingStyle) {
            existingStyle.remove();
        }

        const font = GM_getValue('selected_font', '');
        const fontSize = GM_getValue('fontSize', 16) + 'px';
        const isBold = GM_getValue('fontBold', false);
        const isItalic = GM_getValue('fontItalic', false);

        const fontWeight = isBold ? 'bold' : 'normal';
        const fontStyle = isItalic ? 'italic' : 'normal';

        const styleElement = document.createElement('style');
        styleElement.id = 'cai-custom-typography';

        // Make sure we properly handle Comic Sans MS and other fonts with spaces
        const fontFamily = font ? `'${font}', ` : '';

        styleElement.textContent = `
            p, textarea, button, div.text-sm, .markdown-content, .message-content,
            div[class*="text-base"], div[class*="text-md"], div[class*="text-lg"],
            span[class*="text-base"], span[class*="text-md"], span[class*="text-lg"] {
                font-family: ${fontFamily}'Noto Sans', sans-serif !important;
                font-size: ${fontSize} !important;
                font-weight: ${fontWeight} !important;
                font-style: ${fontStyle} !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Apply layout settings
    function applyLayoutSettings() {
        // Remove any existing style element
        const existingStyle = document.getElementById('cai-custom-layout');
        if (existingStyle) {
            existingStyle.remove();
        }

        const imageSize = GM_getValue('image_size', '24') + 'px';
        const messageSpacing = GM_getValue('message_spacing', '10') + 'px';

        const styleElement = document.createElement('style');
        styleElement.id = 'cai-custom-layout';

        styleElement.textContent = `
            .mt-0.hidden.md\\:flex.flex-col.gap-3.items-center img {
                width: ${imageSize} !important;
                height: ${imageSize} !important;
            }
            .mt-1.flex.w-full {
                margin-bottom: ${messageSpacing} !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Apply all settings at once
    function applySettings() {
        applyCustomColors();
        applyTypographySettings();
        applyLayoutSettings();
    }

    // Create global customization button
    function createCustomizationButton() {
        // Check if button already exists
        if (document.getElementById('cai-customizer-button')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'cai-customizer-button';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 24px;
            height: 24px;
            background-image: url('https://i.imgur.com/yBgJ3za.png');
            background-size: cover;
            z-index: 9998;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        `;

        // Create menu only if it doesn't exist
        let menu = document.getElementById('cai-color-customizer');
        if (!menu) {
            menu = createCustomizationMenu();
        }

        button.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });

        document.body.appendChild(button);
    }

    // Global keyboard shortcut handler
    function handleKeyboardShortcut(event) {
        if (event.key === '`' && event.ctrlKey) {
            event.preventDefault();
            const menu = document.getElementById('cai-color-customizer');
            if (menu) {
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            }
        }
    }

    // Wait for page to load before initialization
    function waitForPageLoad() {
        // Load web fonts first
        loadWebFonts();

        // Check if we're on Character.AI or Discord
        if (window.location.hostname.includes('character.ai')) {
            // For Character.AI
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                initializeForCAI();
            } else {
                window.addEventListener('DOMContentLoaded', initializeForCAI);
            }
        } else if (window.location.hostname.includes('discord.com')) {
            // For Discord
            const checkInterval = setInterval(() => {
                if (document.querySelector('#app-mount')) {
                    clearInterval(checkInterval);
                    initializeForDiscord();
                }
            }, 500);
        }
    }

    // Initialize for Character.AI
    function initializeForCAI() {
        // Ensure the button is created
        createCustomizationButton();

        // Apply settings
        applySettings();

        // Add keyboard shortcut listener
        document.addEventListener('keydown', handleKeyboardShortcut);

        // Re-apply settings when theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' &&
                    mutation.target === document.documentElement) {
                    applySettings();
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        // Make sure button stays visible with periodic check
        setInterval(() => {
            if (!document.getElementById('cai-customizer-button')) {
                createCustomizationButton();
            }
        }, 5000);
    }

    // Initialize for Discord
    function initializeForDiscord() {
        // Apply font settings if exists
        const savedFont = GM_getValue('discordFont', GM_getValue('selected_font', ''));
        const fontSize = GM_getValue('discordFontSize', GM_getValue('fontSize', 16));
        const fontWeight = GM_getValue('discordFontWeight', GM_getValue('fontBold', false) ? 'bold' : 'normal');
        const fontStyle = GM_getValue('fontItalic', false) ? 'italic' : 'normal';
        const fontColor = GM_getValue('discordFontColor', '#ffffff');

        // Create style for Discord font customization
        const styleElement = document.createElement('style');
        styleElement.id = 'discord-font-customizer';
        styleElement.textContent = `
            .markup-eYLPri, .contents-2MsGLg, [class*="messageContent-"], [class*="channelName-"] {
                font-family: ${savedFont ? `'${savedFont}',` : ''} 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
                font-size: ${fontSize}px !important;
                font-weight: ${fontWeight} !important;
                font-style: ${fontStyle} !important;
                color: ${fontColor} !important;
            }
        `;
        document.head.appendChild(styleElement);

        // Create customization button for Discord
        createCustomizationButton();

        // Add keyboard shortcut listener for Discord
        document.addEventListener('keydown', handleKeyboardShortcut);

        // Make sure button stays visible with periodic check
        setInterval(() => {
            if (!document.getElementById('cai-customizer-button')) {
                createCustomizationButton();
            }
        }, 5000);
    }

    // Start initialization
    waitForPageLoad();

    // Fallback initialization to ensure script runs
    setTimeout(() => {
        if (!document.getElementById('cai-customizer-button')) {
            loadWebFonts();
            createCustomizationButton();
            applySettings();
            document.addEventListener('keydown', handleKeyboardShortcut);
        }
    }, 3000);
})();


    // ==========================================
    // SHARED INITIALIZATION
    // ==========================================

    function initializeAll() {
        // Call the initialization functions from both scripts if they exist
        // For example:
        // if (typeof initBackgroundChanger === 'function') {
        //     initBackgroundChanger();
        // }
        //
        // if (typeof initColorCustomizer === 'function') {
        //     initColorCustomizer();
        // }
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        initializeAll();
    }
})();