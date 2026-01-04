// ==UserScript==
// @name        Xoul AI Chat Unified Styler
// @namespace   CXoul AI Chat Unified Styler
// @match       https://xoul.ai/*
// @grant       none
// @license     MIT
// @version     1.1
// @description Unified script for chat element color, transparency, blur effects, text styling.
// @icon        https://i.imgur.com/REqi6Iw.png
// @downloadURL https://update.greasyfork.org/scripts/521040/Xoul%20AI%20Chat%20Unified%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/521040/Xoul%20AI%20Chat%20Unified%20Styler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default customization values
    let savedColor = JSON.parse(localStorage.getItem('chatBubbleColor')) || { r: 0, g: 0, b: 255, a: 0.5 };
    let savedBlur = parseFloat(localStorage.getItem('chatBubbleBlur')) || 5; // Default blur intensity
    let savedFont = localStorage.getItem('chatBubbleFont') || 'Comic Sans MS, Comic Sans, cursive'; // Default font
    let savedTextSize = localStorage.getItem('chatBubbleTextSize') || '16px'; // Default text size
    let savedItalicColor = localStorage.getItem('italicTextColor') || 'green'; // Italic text color
    let savedQuoteColor = localStorage.getItem('quoteTextColor') || 'pink'; // Quoted text color
    let savedPlainTextColor = localStorage.getItem('plainTextColor') || 'black'; // Plain text color

    // Add custom styles for chat bubbles and text
    function addCustomStyles() {
        const existingStyle = document.getElementById('tampermonkey-style-overrides');
        if (existingStyle) {
            existingStyle.remove(); // Remove old styles to apply new updates
        }

        const customStyle = document.createElement('style');
        customStyle.id = 'tampermonkey-style-overrides';
        customStyle.textContent = `
            /* Override for left chat bubbles background color */
            body[data-theme="dark"] .ChatBubble_left__ZhCrR .ChatBubble_bubble__Zsfxg {
                background-color: rgba(${savedColor.r}, ${savedColor.g}, ${savedColor.b}, ${savedColor.a}) !important;
                backdrop-filter: blur(${savedBlur}px) !important;
            }

            /* Override for right chat bubbles background color */
            body[data-theme="dark"] .ChatBubble_right__58fYr .ChatBubble_bubble__Zsfxg {
                background-color: rgba(${savedColor.r}, ${savedColor.g}, ${savedColor.b}, ${savedColor.a}) !important;
                backdrop-filter: blur(${savedBlur}px) !important;
            }

            /* Override text styles */
            body[data-theme="dark"] .ChatBubble_messagecontainer__2PUrv {
                font-family: ${savedFont} !important;
                font-size: ${savedTextSize} !important;
                color: ${savedPlainTextColor} !important;
            }

            /* Override text styles in editing bubbles*/
            body[data-theme="dark"] .ChatBubble_bubble--editing___Go70 {
                font-family: ${savedFont} !important;
                font-size: ${savedTextSize} !important;
                color: ${savedPlainTextColor} !important;
            }

            /* Italic text color */
            body[data-theme="dark"] .ChatBubble_messagecontainer__2PUrv i {
                color: ${savedItalicColor} !important;
            }

            /* Quoted text color */
            body[data-theme="dark"] .ChatBubble_messagecontainer__2PUrv span {
                color: ${savedQuoteColor} !important;
            }

            /* Override for left chat bubbles (message border) */
            .ChatBubble_left__ZhCrR body[data-theme="dark"] .ChatBubble_bubble__Zsfxg::before,
            body[data-theme="dark"] .ChatBubble_focused_message_bot__PHyy1::before,
            body[data-theme="dark"] .ChatBubble_left__ZhCrR .ChatBubble_bubble__Zsfxg::before {
                border-right: none !important;
            }

            /* Override for right chat bubbles (message border) */
            .ChatBubble_right__58fYr body[data-theme="dark"] .ChatBubble_bubble__Zsfxg::before,
            body[data-theme="dark"] .ChatBubble_focused_message_user__Hd6Zk::before,
            body[data-theme="dark"] .ChatBubble_right__58fYr .ChatBubble_bubble__Zsfxg::before {
                border-left: none !important;
            }
        `;
        document.head.appendChild(customStyle);
    }

    // Create the control panel with customization options
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.padding = '20px';
        panel.style.backgroundColor = 'rgb(10, 10, 10)';
        panel.style.color = 'white';
        panel.style.borderRadius = '8px';
        panel.style.zIndex = '9999';
        panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        panel.style.display = 'none'; // Initially hidden
        // Add this section after creating the panel
document.addEventListener('click', function(e) {
    // Check if the click is outside the control panel and the toggle button
    if (!panel.contains(e.target) && !sidebarButton.contains(e.target)) {
        panel.style.display = 'none'; // Hide the panel
    }
});


        // Add button to the sidebar
        const sidebarButton = document.createElement('button');
        sidebarButton.textContent = 'Tt';
        sidebarButton.style.margin = '10px';
        sidebarButton.style.backgroundColor = 'transparent'; // Transparent background
        sidebarButton.style.border = 'none'; // No border
        sidebarButton.style.color = 'white'; // Text color
        sidebarButton.style.cursor = 'pointer'; // Pointer cursor for better UX
        sidebarButton.style.fontSize = '16px'; // Adjust font size as needed
        sidebarButton.style.fontWeight = 'bold'; // Optional for emphasis
        sidebarButton.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; // Toggle the panel visibility
        });

        // Locate the Sidebar container and append the button
        const sidebarNav = document.querySelector('.Sidebar_nav__a5780');
        if (sidebarNav) {
            const sidebarLink = sidebarNav.querySelector('a.Sidebar_link__0EvG_:nth-child(6)');
            if (sidebarLink) {
                sidebarLink.after(sidebarButton); // Add button underneath the target link
            }
        }

        // RGB input field
        const rgbInput = document.createElement('input');
        rgbInput.type = 'color';
        rgbInput.value = rgbToHex(savedColor.r, savedColor.g, savedColor.b);
        rgbInput.addEventListener('input', function() {
            const rgb = hexToRgb(rgbInput.value);
            savedColor.r = rgb.r;
            savedColor.g = rgb.g;
            savedColor.b = rgb.b;
            localStorage.setItem('chatBubbleColor', JSON.stringify(savedColor));
            addCustomStyles();
        });

        // Alpha slider
        const alphaSlider = document.createElement('input');
        alphaSlider.type = 'range';
        alphaSlider.min = 0;
        alphaSlider.max = 1;
        alphaSlider.step = 0.05;
        alphaSlider.value = savedColor.a;
        alphaSlider.addEventListener('input', function() {
            savedColor.a = alphaSlider.value;
            localStorage.setItem('chatBubbleColor', JSON.stringify(savedColor));
            addCustomStyles();
        });

        // Blur slider
        const blurSlider = document.createElement('input');
        blurSlider.type = 'range';
        blurSlider.min = 0;
        blurSlider.max = 20;
        blurSlider.step = 1;
        blurSlider.value = savedBlur;
        blurSlider.addEventListener('input', function() {
            savedBlur = blurSlider.value;
            localStorage.setItem('chatBubbleBlur', savedBlur.toString());
            addCustomStyles();
        });

        // Font dropdown
        const fontDropdown = document.createElement('select');
        const fonts = [
            'Comic Sans MS, Comic Sans, cursive',
            'Arial, sans-serif',
            'Georgia, serif',
            'Courier New, Courier, monospace',
            'Verdana, sans-serif',
            'Times New Roman, Times, serif',
                        'Papyrus, fantasy',
            'Comic Neue, cursive',
            'Open Sans, sans-serif',
            'Roboto, sans-serif',
            'Lato, sans-serif',
            'Ubuntu, sans-serif',
            'Poppins, sans-serif',
            'Montserrat, sans-serif',
            'Fira Code, monospace',
            'Anonymous Pro, monospace',
            'Ubuntu Mono, monospace',
            'OpenDyslexic, sans-serif',
            'Caveat, cursive',
            'Patrick Hand, cursive',
            'Shadows Into Light, cursive',
            'Amatic SC, cursive',
            'Permanent Marker, cursive',
            'Indie Flower, cursive',
            'Raleway Dots, sans-serif'

        ];
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font.split(',')[0];
            if (font === savedFont) option.selected = true;
            fontDropdown.appendChild(option);
        });
        fontDropdown.addEventListener('change', function() {
            savedFont = fontDropdown.value;
            localStorage.setItem('chatBubbleFont', savedFont);
            addCustomStyles();
        });

        // Text size dropdown
        const textSizeDropdown = document.createElement('select');
        const textSizes = ['12px', '14px', '16px', '18px', '20px', '24px'];
        textSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            if (size === savedTextSize) option.selected = true;
            textSizeDropdown.appendChild(option);
        });
        textSizeDropdown.addEventListener('change', function() {
            savedTextSize = textSizeDropdown.value;
            localStorage.setItem('chatBubbleTextSize', savedTextSize);
            addCustomStyles();
        });

        // Color pickers for text types
        const createColorPicker = (labelText, colorKey, defaultColor, callback) => {
            const label = document.createElement('label');
            label.textContent = labelText;
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = defaultColor;
            colorPicker.addEventListener('input', function() {
                callback(colorPicker.value);
                localStorage.setItem(colorKey, colorPicker.value);
                addCustomStyles();
            });
            panel.appendChild(label);
            panel.appendChild(colorPicker);
            panel.appendChild(document.createElement('br'));
        };

        createColorPicker('Italic Text Color: ', 'italicTextColor', savedItalicColor, value => {
            savedItalicColor = value;
        });

        createColorPicker('Quote Text Color: ', 'quoteTextColor', savedQuoteColor, value => {
            savedQuoteColor = value;
        });

        createColorPicker('Plain Text Color: ', 'plainTextColor', savedPlainTextColor, value => {
            savedPlainTextColor = value;
        });

        // Add controls to the panel
        const rgbLabel = document.createElement('label');
        rgbLabel.textContent = 'Bubble Color: ';
        panel.appendChild(rgbLabel);
        panel.appendChild(rgbInput);
        panel.appendChild(document.createElement('br'));

        const alphaLabel = document.createElement('label');
        alphaLabel.textContent = 'Alpha (Transparency): ';
        panel.appendChild(alphaLabel);
        panel.appendChild(alphaSlider);
        panel.appendChild(document.createElement('br'));

        const blurLabel = document.createElement('label');
        blurLabel.textContent = 'Blur Effect: ';
        panel.appendChild(blurLabel);
        panel.appendChild(blurSlider);
        panel.appendChild(document.createElement('br'));

        const fontLabel = document.createElement('label');
        fontLabel.textContent = 'Font Style: ';
        panel.appendChild(fontLabel);
        panel.appendChild(fontDropdown);
        panel.appendChild(document.createElement('br'));

        const textSizeLabel = document.createElement('label');
        textSizeLabel.textContent = 'Text Size: ';
        panel.appendChild(textSizeLabel);
        panel.appendChild(textSizeDropdown);

        document.body.appendChild(panel);
    }

    // Helper functions
    function rgbToHex(r, g, b) {
        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    // Initialize styles and control panel
    window.addEventListener('load', function() {
        addCustomStyles();
        createControlPanel();
    });

    // Observe changes for dynamically added elements
    const observer = new MutationObserver(() => {
        addCustomStyles();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
