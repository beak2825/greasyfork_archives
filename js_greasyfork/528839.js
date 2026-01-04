// ==UserScript==
// @name        c.ai Enhanced Color Customizer
// @namespace   cai-color-customizer
// @match       https://character.ai/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @version     1.0
// @description Enhanced color and UI customization for Character.AI
// @icon        https://i.imgur.com/ynjBqKW.png
// @downloadURL https://update.greasyfork.org/scripts/528839/cai%20Enhanced%20Color%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/528839/cai%20Enhanced%20Color%20Customizer.meta.js
// ==/UserScript==

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
        // Font selection, size, weight etc.
        const fonts = [
            { name: 'Inter', value: '__Inter_918210' },
            { name: 'Onest', value: '__Onest_b2ce1d' },
            { name: 'Noto Sans', value: 'Noto Sans' },
            { name: 'Arial', value: 'Arial' }
        ];

        const fontSelect = document.createElement('select');
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font.value;
            option.text = font.name;
            fontSelect.appendChild(option);
        });

        fontSelect.value = GM_getValue('selected_font', '__Inter_918210');
        fontSelect.addEventListener('change', () => {
            GM_setValue('selected_font', fontSelect.value);
            applyTypographySettings();
        });

        container.appendChild(fontSelect);
    }

    // Render layout tab
    function renderLayoutTab(container) {
        // Image size, margins, etc.
        const sizeInput = document.createElement('input');
        sizeInput.type = 'number';
        sizeInput.value = GM_getValue('image_size', '24');
        sizeInput.addEventListener('change', () => {
            GM_setValue('image_size', sizeInput.value);
            applyLayoutSettings();
        });

        container.appendChild(sizeInput);
    }

    // Apply color customizations dynamically
    function applyCustomColors() {
        const theme = getCurrentTheme();
        const defaultColors = getDefaultColors(theme);
        const categories = ['italic', 'quotationmarks', 'plaintext', 'custom', 'charbubble', 'userbubble', 'guide', 'input', 'body', 'accent'];

        const styleElement = document.createElement('style');
        let css = '';

        categories.forEach(category => {
            const color = GM_getValue(`${category}_color`, defaultColors[category]);

            switch(category) {
                case 'italic':
                    css += `em { color: ${color} !important; } `;
                    break;
                case 'plaintext':
                    css += `p[node='[object Object]'] { color: ${color} !important; } `;
                    break;
                case 'charbubble':
                    css += `.mt-1.bg-surface-elevation-2 { background-color: ${color}; } `;
                    break;
                case 'userbubble':
                    css += `.mt-1.bg-surface-elevation-3 { background-color: ${color}; } `;
                    break;
                // Add more specific color mappings as needed
            }
        });

        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    // Apply typography settings
    function applyTypographySettings() {
        const font = GM_getValue('selected_font', '__Inter_918210');
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            p, textarea, button, div.text-sm {
                font-family: '${font}', 'Noto Sans', sans-serif !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Apply layout settings
    function applyLayoutSettings() {
        const imageSize = GM_getValue('image_size', '24') + 'px';
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .mt-0.hidden.md\\:flex.flex-col.gap-3.items-center img {
                width: ${imageSize} !important;
                height: ${imageSize} !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Global customization button
    function createCustomizationButton() {
        const button = document.createElement('button');
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 22px;
            height: 22px;
            background-image: url('https://i.imgur.com/yBgJ3za.png');
            background-size: cover;
            z-index: 9998;
            border: none;
        `;

        const menu = createCustomizationMenu();
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

    // Initialize customizations on page load
    function initialize() {
        createCustomizationButton();
        applyCustomColors();
        applyTypographySettings();
        applyLayoutSettings();

        // Add keyboard shortcut listener
        document.addEventListener('keydown', handleKeyboardShortcut);
    }

    // Run initialization
    initialize();
})();