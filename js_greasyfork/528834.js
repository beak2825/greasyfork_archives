// ==UserScript==
// @name         character.ai Font Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Easy font changing for c.ai website (USE "\" To open the menu."
// @match        https://character.ai/*
// @author       Gamer, Claude.ai, The universe.
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/528834/characterai%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/528834/characterai%20Font%20Changer.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Universal Font Changer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Easy font changing for any website
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Comprehensive font list
    const fonts = [
        // Default/Standard Fonts
        { name: 'Arial', value: 'Arial, sans-serif' },
        { name: 'Helvetica', value: 'Helvetica, sans-serif' },
        { name: 'Times New Roman', value: 'Times New Roman, serif' },
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Courier New', value: 'Courier New, monospace' },
        { name: 'Verdana', value: 'Verdana, sans-serif' },

        // Dyslexia-Friendly Fonts
        { name: 'OpenDyslexic', value: 'OpenDyslexic, sans-serif' },
        { name: 'Dyslexie', value: 'Dyslexie, sans-serif' },
        { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
        { name: 'Lexend', value: 'Lexend, sans-serif' },
        { name: 'Atkinson Hyperlegible', value: 'Atkinson Hyperlegible, sans-serif' },

        // Readable Fonts
        { name: 'Roboto', value: 'Roboto, sans-serif' },
        { name: 'Open Sans', value: 'Open Sans, sans-serif' },
        { name: 'Lato', value: 'Lato, sans-serif' },
        { name: 'Montserrat', value: 'Montserrat, sans-serif' },
        { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },

        // Serif Fonts
        { name: 'Merriweather', value: 'Merriweather, serif' },
        { name: 'Noto Serif', value: 'Noto Serif, serif' },
        { name: 'Libre Baskerville', value: 'Libre Baskerville, serif' },

        // Monospace Fonts
        { name: 'Courier Prime', value: 'Courier Prime, monospace' },
        { name: 'Source Code Pro', value: 'Source Code Pro, monospace' },
        { name: 'Fira Mono', value: 'Fira Mono, monospace' }
    ];

    // Create font changer menu
    function createFontChangerMenu() {
        // Create menu container
        const menu = document.createElement('div');
        menu.id = 'font-changer-menu';
        menu.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: black;
            border: 2px solid white;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 0 10px rgba(255,255,255,0.5);
            max-height: 80vh;
            overflow-y: auto;
            display: none;
            color: white;
        `;

        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Font Changer';
        title.style.cssText = `
            text-align: center;
            color: white;
            margin-bottom: 15px;
        `;
        menu.appendChild(title);

        // Create font selector
        const fontSelect = document.createElement('select');
        fontSelect.id = 'font-selector';
        fontSelect.style.cssText = `
            width: 100%;
            margin-bottom: 10px;
            background: white;
            color: black;
            padding: 5px;
        `;

        // Populate font selector
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font.value;
            option.textContent = font.name;
            fontSelect.appendChild(option);
        });
        menu.appendChild(fontSelect);

        // Create preview area
        const previewArea = document.createElement('div');
        previewArea.id = 'font-preview';
        previewArea.textContent = 'The quick brown fox jumps over the lazy dog';
        previewArea.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            border: 1px solid white;
            text-align: center;
            color: white;
        `;
        menu.appendChild(previewArea);

        // Create apply button
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Font';
        applyButton.style.cssText = `
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            background: white;
            color: black;
            border: none;
            cursor: pointer;
        `;
        menu.appendChild(applyButton);

        // Append menu to body
        document.body.appendChild(menu);

        // Event listeners
        fontSelect.addEventListener('change', (e) => {
            previewArea.style.fontFamily = e.target.value;
        });

        applyButton.addEventListener('click', () => {
            const selectedFont = fontSelect.value;
            applyFont(selectedFont);
        });

        // Keyboard shortcut to toggle menu
        document.addEventListener('keydown', (e) => {
            // Explicitly check for backslash key
            if (e.key === '\\' || e.keyCode === 220) {
                e.preventDefault(); // Prevent default backslash behavior
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            }
        });

        return menu;
    }

    // Apply font to entire page
    function applyFont(fontFamily) {
        const styleElement = document.createElement('style');
        styleElement.id = 'font-changer-style';
        styleElement.textContent = `
            body, html, * {
                font-family: ${fontFamily} !important;
            }
        `;

        // Remove previous font style if exists
        const existingStyle = document.getElementById('font-changer-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        document.head.appendChild(styleElement);
    }

    // Initialize script
    function init() {
        const menu = createFontChangerMenu();
    }

    // Run script after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();