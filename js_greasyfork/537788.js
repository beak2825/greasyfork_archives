// ==UserScript==
// @name         Drawaria - Custom Palettes Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gestiona y guarda paletas de colores personalizadas en Drawaria.online con una interfaz siempre visible.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/537788/Drawaria%20-%20Custom%20Palettes%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/537788/Drawaria%20-%20Custom%20Palettes%20Mod.meta.js
// ==/UserScript==

// EN ESTA LÍNEA SE HACE EL CAMBIO
(function($) { // <--- Aquí se define $ como un parámetro de la función
    'use strict';

    // --- Helper Functions from Drawaria's main.js (enhanced for better integration) ---
    // This function attempts to use Drawaria's internal localization function (fa)
    // and falls back to a default value if it's not available.
    function getLocalizedText(key, defaultVal) {
        if (window.fa && typeof window.fa === 'function') {
            const localized = window.fa(key);
            // Drawaria's fa returns the key if no translation is found, so we check.
            if (localized !== key) {
                return localized;
            }
        }
        return defaultVal;
    }

    // This function attempts to use Drawaria's internal system message function (ea)
    // and falls back to a simple chat message if it's not available.
    function showDrawariaMessage(msg, type = 'info') {
        if (window.ea && typeof window.ea === 'function') {
            // Use Drawaria's internal function for system messages
            window.ea(msg);
        } else {
            // Fallback: append directly to chatbox for basic visibility
            const systemChatMessageDiv = `<div class="chatmessage systemchatmessage">${msg}</div>`;
            $('#chatbox_messages').append(systemChatMessageDiv);
            const chatbox = $('#chatbox_messages')[0];
            if (chatbox) { // Ensure chatbox exists before trying to scroll
                chatbox.scrollTop = chatbox.scrollHeight; // Scroll to bottom
            }
            console.log(`Drawaria Palette Assistant: ${msg}`); // Also log to console
        }
    }

    // Function to convert RGB to Hex (standard utility)
    function rgbToHex(rgb) {
        if (rgb.startsWith('rgb')) {
            const parts = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
            if (!parts) return rgb;
            delete parts[0];
            for (let i = 1; i <= 3; ++i) {
                parts[i] = parseInt(parts[i]).toString(16);
                if (parts[i].length === 1) parts[i] = '0' + parts[i];
            }
            return '#' + parts.slice(1, 4).join('');
        }
        return rgb; // Assume it's already hex or rgba, return as is (Drawaria might give rgba)
    }

    // --- Core Script Logic ---
    let customPalettes = [];
    const STORAGE_KEY = 'drawaria_custom_color_palettes';

    // Load palettes from localStorage
    function loadPalettes() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            customPalettes = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading custom palettes:', e);
            customPalettes = [];
            showDrawariaMessage(getLocalizedText('Error loading palettes. Please check console.', 'Error loading palettes. Please check console.'));
        }
    }

    // Save palettes to localStorage
    function savePalettes() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customPalettes));
        } catch (e) {
            console.error('Error saving custom palettes:', e);
            showDrawariaMessage(getLocalizedText('Error saving palettes. Browser storage might be full.', 'Error saving palettes. Browser storage might be full.'), 'error');
        }
    }

    // Get current colors from Drawaria's palette buttons
    function getCurrentPaletteColors() {
        const colors = [];
        // Select all color buttons, but exclude the "color picker" button which is the last one
        // and doesn't represent a direct color.
        $('.drawcontrols-button.drawcontrols-color[data-ctrlgroup="color"]').each(function(index) {
            // Drawaria has 12 basic color buttons (0-11) + 1 color picker button (12th in array, but 13th button overall)
            // The 13th button is the color picker, which doesn't have a fixed color to capture.
            if (index < 12) {
                colors.push(rgbToHex($(this).css('background-color')));
            }
        });
        return colors;
    }

    // Render / update the list of custom palettes in the panel
    function renderPaletteList() {
        const $paletteList = $('#paletteAssistantList');
        $paletteList.empty();

        if (customPalettes.length === 0) {
            $paletteList.append($('<p>').text(getLocalizedText('No palettes saved yet.', 'No palettes saved yet.')));
            return;
        }

        customPalettes.forEach((palette, index) => {
            const $item = $('<div>').addClass('palette-item');
            const $paletteColors = $('<div>').addClass('palette-item-colors');
            palette.colors.forEach(color => {
                $('<span>').css('background-color', color).appendTo($paletteColors);
            });

            const $name = $('<span>').text(palette.name).addClass('palette-item-name');
            const $loadBtn = $('<button>').text(getLocalizedText('Load', 'Load')).addClass('palette-item-btn load-btn');
            const $deleteBtn = $('<button>').text(getLocalizedText('Delete', 'Delete')).addClass('palette-item-btn delete-btn');

            $loadBtn.on('click', () => applyPalette(palette.colors));
            $deleteBtn.on('click', (e) => {
                e.stopPropagation(); // Prevent item click if we implement it later
                deletePalette(index);
            });

            $item.append($name, $paletteColors, $loadBtn, $deleteBtn);
            $paletteList.append($item);
        });
    }

    // Apply a saved palette to Drawaria's color buttons
    function applyPalette(colors) {
        const $colorButtons = $('.drawcontrols-button.drawcontrols-color[data-ctrlgroup="color"]');
        colors.forEach((color, i) => {
            if (i < 12) { // Apply only to the basic 12 color buttons
                $colorButtons.eq(i).css('background-color', color);
            }
        });
        showDrawariaMessage(getLocalizedText('Palette applied!', 'Palette applied!'), 'info');
    }

    // Save current palette
    function saveCurrentPalette() {
        const paletteName = prompt(getLocalizedText('Enter a name for this palette:', 'Enter a name for this palette:'));
        if (paletteName) {
            const currentColors = getCurrentPaletteColors();
            if (currentColors.length === 0) {
                showDrawariaMessage(getLocalizedText('Could not capture current palette colors. Are you in a drawing round?', 'Could not capture current palette colors. Are you in a drawing round?'), 'warning');
                return;
            }
            customPalettes.push({ name: paletteName, colors: currentColors });
            savePalettes();
            renderPaletteList();
            showDrawariaMessage(getLocalizedText('Palette saved successfully!', 'Palette saved successfully!'), 'info');
        } else if (paletteName === '') {
            showDrawariaMessage(getLocalizedText('Palette name cannot be empty.', 'Palette name cannot be empty.'), 'warning');
        }
    }

    // Delete a palette
    function deletePalette(index) {
        if (confirm(getLocalizedText('Are you sure you want to delete this palette?', 'Are you sure you want to delete this palette?'))) {
            customPalettes.splice(index, 1);
            savePalettes();
            renderPaletteList();
            showDrawariaMessage(getLocalizedText('Palette deleted.', 'Palette deleted.'), 'info');
        }
    }

    // Initialize UI and load data
    function initPaletteAssistant() {
        loadPalettes();

        // Create the main toggle button
        const $toggleButton = $('<button>')
            .attr('id', 'paletteAssistantToggleButton')
            .text(getLocalizedText('🎨 Palettes', '🎨 Palettes')) // Use localized text
            .addClass('btn btn-outline-secondary btn-sm'); // Reuse Drawaria's button classes for styling

        // Create the palette panel
        const $palettePanel = $('<div>')
            .attr('id', 'paletteAssistantPanel')
            .addClass('palette-assistant-panel')
            .hide();

        const $panelHeader = $('<div>').addClass('panel-header');
        $('<span>').text(getLocalizedText('Custom Palettes', 'Custom Palettes')).appendTo($panelHeader);
        $('<button>').text('X').addClass('close-btn').on('click', () => $palettePanel.hide()).appendTo($panelHeader);

        const $paletteList = $('<div>').attr('id', 'paletteAssistantList').addClass('palette-list');
        const $saveButton = $('<button>').text(getLocalizedText('Save Current Palette', 'Save Current Palette')).addClass('save-btn');

        $saveButton.on('click', saveCurrentPalette);

        $palettePanel.append($panelHeader, $paletteList, $saveButton);

        // Append to a consistent location, e.g., body with fixed positioning
        // This ensures it's always visible regardless of Drawaria's dynamic UI.
        $('body').append($toggleButton, $palettePanel);

        // Toggle panel visibility
        $toggleButton.on('click', () => $palettePanel.toggle());

        // Initial render of palettes
        renderPaletteList();

        // --- Inject CSS for the panel ---
        // Using `position: fixed` for robustness and always-on-top visibility
        $('head').append(`
            <style>
                #paletteAssistantToggleButton {
                    position: fixed;
                    top: 10px; /* Adjust vertical position */
                    right: 180px; /* Adjust horizontal position, leaving space from right edge */
                    z-index: 10000; /* Ensure it's on top of almost everything */
                    width: auto;
                    padding: 0.5em 1em;
                    height: auto;
                    line-height: 1;
                    font-size: 1em;
                    background-color: #f1f9f5; /* Light background to match Drawaria UI */
                    color: #333;
                    border: 1px solid #b0b5b9;
                    border-radius: .5em;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                    white-space: nowrap; /* Prevent text wrapping */
                }
                #paletteAssistantToggleButton:hover {
                    background-color: #e0e0e0;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                }
                .palette-assistant-panel {
                    position: fixed;
                    top: 50px; /* Position slightly below the button */
                    right: 180px; /* Align with the button */
                    width: 280px; /* Slightly wider panel for content */
                    background-color: #f1f9f5;
                    border: 1px solid #b0b5b9;
                    border-radius: .5em;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    z-index: 9999; /* Slightly lower than button, but still high */
                    display: flex;
                    flex-direction: column;
                    padding: 0.8em;
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: bold;
                    margin-bottom: 0.8em;
                    color: #333;
                    font-size: 1.1em;
                }
                .panel-header .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.2em;
                    cursor: pointer;
                    color: #555;
                }
                .panel-header .close-btn:hover {
                    color: #000;
                }
                .palette-list {
                    max-height: 200px;
                    overflow-y: auto;
                    margin-bottom: 1em;
                    border-top: 1px solid #eee;
                    padding-top: 0.5em;
                }
                .palette-list p {
                    text-align: center;
                    color: #777;
                    font-style: italic;
                }
                .palette-item {
                    display: flex;
                    align-items: center;
                    padding: 0.5em;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin-bottom: 0.5em;
                    background-color: #fff;
                    font-size: 0.9em;
                }
                .palette-item:hover {
                    background-color: #f8f8f8;
                }
                .palette-item-name {
                    flex-grow: 1;
                    margin-right: 0.5em;
                    font-weight: bold;
                    color: #333;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .palette-item-colors {
                    display: flex;
                    margin-right: 0.5em;
                }
                .palette-item-colors span {
                    width: 15px;
                    height: 15px;
                    border: 1px solid #ccc;
                    display: inline-block;
                    margin-right: -1px; /* Overlap borders */
                }
                .palette-item-btn {
                    padding: 0.3em 0.6em;
                    font-size: 0.8em;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 0.3em;
                    white-space: nowrap;
                    min-width: 50px; /* Ensure buttons have consistent width */
                    text-align: center;
                }
                .load-btn {
                    background-color: #5cb85c;
                    color: white;
                    border: 1px solid #4cae4c;
                }
                .load-btn:hover {
                    background-color: #4cae4c;
                }
                .delete-btn {
                    background-color: #d9534f;
                    color: white;
                    border: 1px solid #d43f3a;
                }
                .delete-btn:hover {
                    background-color: #d43f3a;
                }
                .save-btn {
                    width: 100%;
                    padding: 0.6em;
                    background-color: #007bff;
                    color: white;
                    border: 1px solid #007bff;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                }
                .save-btn:hover {
                    background-color: #0056b3;
                }
            </style>
        `);
    }

    // Wait for jQuery and Drawaria's core elements to be available
    function waitForDrawariaElements() {
        // Check for jQuery and at least the color buttons in the draw controls
        // This ensures the game UI is loaded and ready before injecting our script.
        if (typeof window.jQuery !== 'undefined' && window.jQuery('.drawcontrols-button.drawcontrols-color').length >= 12) {
            // Check for the Drawaria's main drawing area too, to be sure
            if (window.jQuery('#canvas').length && window.jQuery('#drawcontrols').length) {
                initPaletteAssistant();
            } else {
                // If not in a drawing round yet, but Drawaria is loaded, retry after a delay
                setTimeout(waitForDrawariaElements, 500);
            }
        } else {
            // If jQuery or core elements aren't loaded yet, keep waiting
            setTimeout(waitForDrawariaElements, 100);
        }
    }

    waitForDrawariaElements();

// Y AQUÍ SE PASA window.jQuery a la función principal
})(window.jQuery); // <--- Aquí se pasa window.jQuery para que sea el $ dentro del script