// ==UserScript==
// @name         Custom Theme Editor
// @namespace    https://my-online-database.com/
// @version      1.0
// @icon         https://i.imgur.com/41ykvVf.png
// @description  More theme control for my-online-database.com
// @author       New Jack 9999
// @match        https://my-online-database.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517421/Custom%20Theme%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/517421/Custom%20Theme%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to convert RGB to Hex
    function rgbToHex(rgb) {
        // Check if input is already in hex
        if (rgb.startsWith('#')) return rgb;

        const result = rgb.match(/\d+/g);
        if (!result) return '#000000';

        const r = parseInt(result[0]).toString(16).padStart(2, '0');
        const g = parseInt(result[1]).toString(16).padStart(2, '0');
        const b = parseInt(result[2]).toString(16).padStart(2, '0');

        return `#${r}${g}${b}`;
    }

    // Define the color picker elements
    const colorPickerElements = [
        { label: 'Primary Color', variable: '--primary-color' },
        { label: 'Secondary Color', variable: '--secondary-color' },
        { label: 'Border Color', variable: '--border-color' },
        { label: 'Header Background', variable: '--header-bg' },
        { label: 'Row Hover', variable: '--row-hover' },
        { label: 'Toolbar Background', variable: '--toolbar-bg' },
        { label: 'Selected Background', variable: '--selected-bg' },
        { label: 'Danger Color', variable: '--danger-color' },
        { label: 'Success Color', variable: '--success-color' },
        { label: 'Warning Color', variable: '--warning-color' },
        { label: 'App Header Background', variable: '--app-header-bg' },
        { label: 'Text Primary', variable: '--text-primary' },
        { label: 'Text Secondary', variable: '--text-secondary' },
        { label: 'Text Muted', variable: '--text-muted' },
        { label: 'Background Primary', variable: '--bg-primary' },
        { label: 'Background Secondary', variable: '--bg-secondary' },
        { label: 'Background Tertiary', variable: '--bg-tertiary' },
        { label: 'Input Background', variable: '--input-bg' },
        { label: 'Input Border', variable: '--input-border' },
        { label: 'Input Text', variable: '--input-text' },
        { label: 'Input Placeholder', variable: '--input-placeholder' },
        { label: 'Card Background', variable: '--card-bg' },
        { label: 'Modal Background', variable: '--modal-bg' },
        { label: 'Tooltip Background', variable: '--tooltip-bg' },
        { label: 'Tooltip Text', variable: '--tooltip-text' },
        { label: 'Button Text Color', variable: '--text-buttoncolor' }
    ];

    // Define predefined themes with default colors
    const predefinedThemes = {
        'Hello Kitty 1': {
            '--primary-color': '#FFC0CB', // Pink
            '--secondary-color': '#FF69B4', // HotPink
            '--border-color': '#FFD700', // Gold
            '--header-bg': '#FFB6C1', // LightPink
            '--row-hover': '#FFF0F5', // LavenderBlush
            '--toolbar-bg': '#FF1493', // DeepPink
            '--selected-bg': '#DB7093', // PaleVioletRed
            '--danger-color': '#FF4500', // OrangeRed
            '--success-color': '#32CD32', // LimeGreen
            '--warning-color': '#FFA500', // Orange
            '--app-header-bg': '#FF69B4', // HotPink
            '--text-primary': '#800080', // Purple
            '--text-secondary': '#FF1493', // DeepPink
            '--text-muted': '#DA70D6', // Orchid
            '--bg-primary': '#FFF0F5', // LavenderBlush
            '--bg-secondary': '#FFB6C1', // LightPink
            '--bg-tertiary': '#FFC0CB', // Pink
            '--input-bg': '#FFFAFA', // Snow
            '--input-border': '#FF69B4', // HotPink
            '--input-text': '#800080', // Purple
            '--input-placeholder': '#DA70D6', // Orchid
            '--card-bg': '#FFE4E1', // MistyRose
            '--modal-bg': '#FFDAB9', // PeachPuff
            '--tooltip-bg': '#FF69B4', // HotPink
            '--tooltip-text': '#FFFFFF', // White
            '--text-buttoncolor': '#FFFFFF' // White
        },
        'DOS 1': {
            '--primary-color': '#000080', // Navy
            '--secondary-color': '#0000FF', // Blue
            '--border-color': '#808080', // Gray
            '--header-bg': '#00008B', // DarkBlue
            '--row-hover': '#C0C0C0', // Silver
            '--toolbar-bg': '#1E90FF', // DodgerBlue
            '--selected-bg': '#4682B4', // SteelBlue
            '--danger-color': '#FF0000', // Red
            '--success-color': '#00FF00', // Lime
            '--warning-color': '#FFD700', // Gold
            '--app-header-bg': '#0000CD', // MediumBlue
            '--text-primary': '#FFFFFF', // White
            '--text-secondary': '#D3D3D3', // LightGray
            '--text-muted': '#A9A9A9', // DarkGray
            '--bg-primary': '#000000', // Black
            '--bg-secondary': '#2F4F4F', // DarkSlateGray
            '--bg-tertiary': '#696969', // DimGray
            '--input-bg': '#1C1C1C', // Very Dark Gray
            '--input-border': '#FFFFFF', // White
            '--input-text': '#FFFFFF', // White
            '--input-placeholder': '#808080', // Gray
            '--card-bg': '#333333', // Dark Gray
            '--modal-bg': '#2F4F4F', // DarkSlateGray
            '--tooltip-bg': '#000080', // Navy
            '--tooltip-text': '#FFFFFF', // White
            '--text-buttoncolor': '#FFFFFF' // White
        },
        'Ethereum': {
            '--primary-color': '#3C3C3D', // Ethereum Dark Gray
            '--secondary-color': '#8C8C8C', // Ethereum Light Gray
            '--border-color': '#CCCCCC', // Light Gray
            '--header-bg': '#24292E', // Dark Header
            '--row-hover': '#2C2F33', // Darker Hover
            '--toolbar-bg': '#7289DA', // Blurple
            '--selected-bg': '#99AAB5', // Light Gray
            '--danger-color': '#F04747', // Red
            '--success-color': '#43B581', // Green
            '--warning-color': '#FAA61A', // Orange
            '--app-header-bg': '#2C2F33', // Darker Header
            '--text-primary': '#FFFFFF', // White
            '--text-secondary': '#99AAB5', // Light Gray
            '--text-muted': '#72767D', // Gray
            '--bg-primary': '#23272A', // Dark Background
            '--bg-secondary': '#2C2F33', // Darker Background
            '--bg-tertiary': '#99AAB5', // Light Gray
            '--input-bg': '#2C2F33', // Dark Input
            '--input-border': '#99AAB5', // Light Gray
            '--input-text': '#FFFFFF', // White
            '--input-placeholder': '#72767D', // Gray
            '--card-bg': '#2C2F33', // Dark Card
            '--modal-bg': '#23272A', // Dark Modal
            '--tooltip-bg': '#99AAB5', // Light Gray
            '--tooltip-text': '#23272A', // Dark Text
            '--text-buttoncolor': '#FFFFFF' // White
        },
        'Reddit': {
            '--primary-color': '#FF4500', // OrangeRed
            '--secondary-color': '#FFFFFF', // White
            '--border-color': '#FF4500', // OrangeRed
            '--header-bg': '#FF4500', // OrangeRed
            '--row-hover': '#FFD9B3', // Light Orange
            '--toolbar-bg': '#FF4500', // OrangeRed
            '--selected-bg': '#FFB347', // Light Orange
            '--danger-color': '#FF0000', // Red
            '--success-color': '#00FF00', // Lime
            '--warning-color': '#FFA500', // Orange
            '--app-header-bg': '#FF4500', // OrangeRed
            '--text-primary': '#FFFFFF', // White
            '--text-secondary': '#FF4500', // OrangeRed
            '--text-muted': '#B3B3B3', // Gray
            '--bg-primary': '#FFFFFF', // White
            '--bg-secondary': '#F5F5F5', // Light Gray
            '--bg-tertiary': '#FFDDCC', // Light Orange
            '--input-bg': '#FFFFFF', // White
            '--input-border': '#FF4500', // OrangeRed
            '--input-text': '#000000', // Black
            '--input-placeholder': '#B3B3B3', // Gray
            '--card-bg': '#FFFFFF', // White
            '--modal-bg': '#FFFFFF', // White
            '--tooltip-bg': '#FF4500', // OrangeRed
            '--tooltip-text': '#FFFFFF', // White
            '--text-buttoncolor': '#FFFFFF' // White
        },
        'Google Chrome': {
            '--primary-color': '#4285F4', // Blue
            '--secondary-color': '#34A853', // Green
            '--border-color': '#EA4335', // Red
            '--header-bg': '#4285F4', // Blue
            '--row-hover': '#F4B400', // Yellow
            '--toolbar-bg': '#DB4437', // Red
            '--selected-bg': '#0F9D58', // Green
            '--danger-color': '#DB4437', // Red
            '--success-color': '#0F9D58', // Green
            '--warning-color': '#F4B400', // Yellow
            '--app-header-bg': '#4285F4', // Blue
            '--text-primary': '#FFFFFF', // White
            '--text-secondary': '#34A853', // Green
            '--text-muted': '#EA4335', // Red
            '--bg-primary': '#FFFFFF', // White
            '--bg-secondary': '#F1F3F4', // Light Gray
            '--bg-tertiary': '#D3D3D3', // Light Gray
            '--input-bg': '#FFFFFF', // White
            '--input-border': '#EA4335', // Red
            '--input-text': '#202124', // Dark Gray
            '--input-placeholder': '#5F6368', // Gray
            '--card-bg': '#FFFFFF', // White
            '--modal-bg': '#FFFFFF', // White
            '--tooltip-bg': '#EA4335', // Red
            '--tooltip-text': '#FFFFFF', // White
            '--text-buttoncolor': '#FFFFFF' // White
        },
        'Firefox': {
            '--primary-color': '#FF7139', // Firefox Orange
            '--secondary-color': '#1C1C1C', // Dark Gray
            '--border-color': '#FF7139', // Firefox Orange
            '--header-bg': '#FF7139', // Firefox Orange
            '--row-hover': '#FFDAB9', // PeachPuff
            '--toolbar-bg': '#FF7139', // Firefox Orange
            '--selected-bg': '#FF8C00', // Dark Orange
            '--danger-color': '#FF0000', // Red
            '--success-color': '#00FF00', // Lime
            '--warning-color': '#FFA500', // Orange
            '--app-header-bg': '#FF7139', // Firefox Orange
            '--text-primary': '#FFFFFF', // White
            '--text-secondary': '#1C1C1C', // Dark Gray
            '--text-muted': '#A9A9A9', // DarkGray
            '--bg-primary': '#FFFFFF', // White
            '--bg-secondary': '#F5F5F5', // Light Gray
            '--bg-tertiary': '#D3D3D3', // Light Gray
            '--input-bg': '#FFFFFF', // White
            '--input-border': '#FF7139', // Firefox Orange
            '--input-text': '#1C1C1C', // Dark Gray
            '--input-placeholder': '#A9A9A9', // DarkGray
            '--card-bg': '#FFFFFF', // White
            '--modal-bg': '#FFFFFF', // White
            '--tooltip-bg': '#FF7139', // Firefox Orange
            '--tooltip-text': '#FFFFFF', // White
            '--text-buttoncolor': '#FFFFFF' // White
        },
        'Internet Explorer': {
            '--primary-color': '#1C62CD', // IE Blue
            '--secondary-color': '#0078D7', // IE Light Blue
            '--border-color': '#FFFFFF', // White
            '--header-bg': '#1C62CD', // IE Blue
            '--row-hover': '#D0D0D0', // Light Gray
            '--toolbar-bg': '#0078D7', // IE Light Blue
            '--selected-bg': '#005A9E', // Darker Blue
            '--danger-color': '#FF0000', // Red
            '--success-color': '#00FF00', // Lime
            '--warning-color': '#FFA500', // Orange
            '--app-header-bg': '#1C62CD', // IE Blue
            '--text-primary': '#FFFFFF', // White
            '--text-secondary': '#0078D7', // IE Light Blue
            '--text-muted': '#A9A9A9', // DarkGray
            '--bg-primary': '#FFFFFF', // White
            '--bg-secondary': '#F5F5F5', // Light Gray
            '--bg-tertiary': '#D3D3D3', // Light Gray
            '--input-bg': '#0078D7', // IE Light Blue
            '--input-border': '#0078D7', // IE Light Blue
            '--input-text': '#1C62CD', // IE Blue
            '--input-placeholder': '#A9A9A9', // DarkGray
            '--card-bg': '#2F2F2F', // Darker Gray
            '--modal-bg': '#1C62CD', // Very Dark Gray
            '--tooltip-bg': '#0078D7', // IE Light Blue
            '--tooltip-text': '#FFFFFF', // White
            '--text-buttoncolor': '#FFFFFF' // White
        },
        'Pirate Bay': {
            '--primary-color': '#000000', // Black
            '--secondary-color': '#FFD700', // Gold
            '--border-color': '#FFFFFF', // White
            '--header-bg': '#000000', // Black
            '--row-hover': '#333333', // Dark Gray
            '--toolbar-bg': '#FFD700', // Gold
            '--selected-bg': '#555555', // Medium Gray
            '--danger-color': '#FF0000', // Red
            '--success-color': '#00FF00', // Lime
            '--warning-color': '#FFA500', // Orange
            '--app-header-bg': '#000000', // Black
            '--text-primary': '#FFFFFF', // White
            '--text-secondary': '#FFD700', // Gold
            '--text-muted': '#A9A9A9', // DarkGray
            '--bg-primary': '#1C1C1C', // Very Dark Gray
            '--bg-secondary': '#333333', // Dark Gray
            '--bg-tertiary': '#555555', // Medium Gray
            '--input-bg': '#333333', // Dark Gray
            '--input-border': '#FFD700', // Gold
            '--input-text': '#FFFFFF', // White
            '--input-placeholder': '#A9A9A9', // DarkGray
            '--card-bg': '#2F2F2F', // Darker Gray
            '--modal-bg': '#1C1C1C', // Very Dark Gray
            '--tooltip-bg': '#FFD700', // Gold
            '--tooltip-text': '#000000', // Black
            '--text-buttoncolor': '#FFFFFF' // White
        },
        'Black on White': { // New Theme Added
            '--primary-color': '#000000', // Black
            '--secondary-color': '#000000', // Black
            '--border-color': '#000000', // Black
            '--header-bg': '#FFFFFF', // White
            '--row-hover': '#FFFFFF', // White
            '--toolbar-bg': '#FFFFFF', // White
            '--selected-bg': '#FFFFFF', // White
            '--danger-color': '#FF0000', // Red
            '--success-color': '#00FF00', // Lime
            '--warning-color': '#FFA500', // Orange
            '--app-header-bg': '#FFFFFF', // White
            '--text-primary': '#000000', // Black
            '--text-secondary': '#000000', // Black
            '--text-muted': '#000000', // Black
            '--bg-primary': '#FFFFFF', // White
            '--bg-secondary': '#FFFFFF', // White
            '--bg-tertiary': '#FFFFFF', // White
            '--input-bg': '#FFFFFF', // White
            '--input-border': '#000000', // Black
            '--input-text': '#000000', // Black
            '--input-placeholder': '#000000', // Black
            '--card-bg': '#FFFFFF', // White
            '--modal-bg': '#FFFFFF', // White
            '--tooltip-bg': '#FFFFFF', // White
            '--tooltip-text': '#000000', // Black
            '--text-buttoncolor': '#000000' // Black
        }
    };

    // Function to get theme from localStorage or use predefined default
    function getTheme(themeName) {
        const savedTheme = localStorage.getItem(`custom_css1_theme_${themeName}`);
        if (savedTheme) {
            return JSON.parse(savedTheme);
        } else {
            return predefinedThemes[themeName] || predefinedThemes['Default'];
        }
    }

    // Function to save theme to localStorage
    function saveTheme(themeName, themeStyles) {
        localStorage.setItem(`custom_css1_theme_${themeName}`, JSON.stringify(themeStyles));
        console.log(`Theme "${themeName}" saved to localStorage.`);
    }

    // Function to apply theme to the document
    function applyTheme(themeStyles) {
        Object.keys(themeStyles).forEach(variable => {
            document.documentElement.style.setProperty(variable, themeStyles[variable]);
        });
    }

    // Function to reset a theme to its default
    function resetTheme(themeName) {
        const defaultTheme = predefinedThemes[themeName];
        if (defaultTheme) {
            applyTheme(defaultTheme);
            saveTheme(themeName, defaultTheme);
            updateColorPickerValues(defaultTheme);
            console.log(`Theme "${themeName}" has been reset to its default colors.`);
        } else {
            console.warn(`No default theme found for "${themeName}".`);
        }
    }

    // Function to create the theme editor container
    function createThemeEditor() {
        // Create the theme editor container
        const themeEditorContainer = document.createElement('div');
        themeEditorContainer.classList.add('theme-editor-container');
        themeEditorContainer.style.position = 'fixed';
        themeEditorContainer.style.top = '20px';
        themeEditorContainer.style.right = '20px';
        themeEditorContainer.style.backgroundColor = '#FFFFFF'; // White background for the editor
        themeEditorContainer.style.padding = '20px';
        themeEditorContainer.style.borderRadius = '5px';
        themeEditorContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        themeEditorContainer.style.zIndex = '9999';
        themeEditorContainer.style.display = 'none'; // Initially hidden
        themeEditorContainer.style.maxHeight = '80vh';
        themeEditorContainer.style.overflowY = 'auto';
        themeEditorContainer.style.width = '400px';
        themeEditorContainer.style.fontFamily = 'Arial, sans-serif';
        themeEditorContainer.style.color = '#000000'; // Set all text inside the editor to black

        // Create the theme editor header
        const themeEditorHeader = document.createElement('div');
        themeEditorHeader.style.display = 'flex';
        themeEditorHeader.style.justifyContent = 'space-between';
        themeEditorHeader.style.alignItems = 'center';
        themeEditorHeader.style.marginBottom = '10px';

        const headerTitle = document.createElement('span');
        headerTitle.textContent = 'Custom Theme Editor';
        headerTitle.style.fontWeight = 'bold';
        headerTitle.style.fontSize = '16px';
        headerTitle.style.color = '#000000'; // Ensure title is black

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.background = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.title = 'Close';
        closeButton.style.lineHeight = '1';
        closeButton.style.padding = '0';
        closeButton.style.color = '#000000'; // Ensure close button is black

        // Attach event listener for the close button
        closeButton.addEventListener('click', () => {
            themeEditorContainer.style.display = 'none';
        });

        themeEditorHeader.appendChild(headerTitle);
        themeEditorHeader.appendChild(closeButton);

        // Create the theme editor content
        const themeEditorContent = document.createElement('div');
        themeEditorContent.classList.add('theme-editor-content');

        // Create theme selection dropdown
        const themeSelectionContainer = document.createElement('div');
        themeSelectionContainer.style.display = 'flex';
        themeSelectionContainer.style.alignItems = 'center';
        themeSelectionContainer.style.marginBottom = '15px';


        const themeSelectionLabel = document.createElement('label');
        themeSelectionLabel.textContent = 'Select Theme:';
        themeSelectionLabel.style.marginRight = '10px';
        themeSelectionLabel.style.flex = '0 0 100px';
        themeSelectionLabel.style.color = '#000000'; // Ensure label is black

        const themeSelectionDropdown = document.createElement('select');
        themeSelectionDropdown.style.flex = '1';
        themeSelectionDropdown.style.padding = '5px';
        themeSelectionDropdown.style.color = '#000000'; // Ensure dropdown text is black
        themeSelectionDropdown.style.backgroundColor = '#dddddd'; // White background
        themeSelectionDropdown.style.border = '1px solid #000000'; // Black border
        themeSelectionDropdown.style.borderRadius = '3px';

        // Populate dropdown with theme options
        Object.keys(predefinedThemes).forEach(themeName => {
            const option = document.createElement('option');
            option.value = themeName;
            option.textContent = themeName;
            themeSelectionDropdown.appendChild(option);
        });

        themeSelectionContainer.appendChild(themeSelectionLabel);
        themeSelectionContainer.appendChild(themeSelectionDropdown);
        themeEditorContent.appendChild(themeSelectionContainer);

        // Create color pickers container
        const colorPickersContainer = document.createElement('div');
        colorPickersContainer.classList.add('color-pickers-container');

        // Create color pickers
        colorPickerElements.forEach(element => {
            const colorPickerContainer = document.createElement('div');
            colorPickerContainer.style.display = 'flex';
            colorPickerContainer.style.alignItems = 'center';
            colorPickerContainer.style.marginBottom = '10px';

            const colorPickerLabel = document.createElement('label');
            colorPickerLabel.textContent = element.label;
            colorPickerLabel.style.marginRight = '10px';
            colorPickerLabel.style.flex = '1';
            colorPickerLabel.style.color = '#000000'; // Ensure label is black

            const colorPickerInput = document.createElement('input');
            colorPickerInput.type = 'color';
            colorPickerInput.value = '#000000'; // Placeholder, will be updated later
            colorPickerInput.style.flex = '1';
            colorPickerInput.style.cursor = 'pointer';
            colorPickerInput.style.border = '1px solid #000000'; // Black border
            colorPickerInput.style.borderRadius = '3px';
            colorPickerInput.style.padding = '0';
            colorPickerInput.style.height = '30px';

            // Attach event listener for color change
            colorPickerInput.addEventListener('input', () => {
                const selectedTheme = themeSelectionDropdown.value;
                const themeStyles = getTheme(selectedTheme);
                themeStyles[element.variable] = colorPickerInput.value;
                applyTheme(themeStyles);
                saveTheme(selectedTheme, themeStyles);
            });

            colorPickerContainer.appendChild(colorPickerLabel);
            colorPickerContainer.appendChild(colorPickerInput);
            colorPickersContainer.appendChild(colorPickerContainer);
        });

        themeEditorContent.appendChild(colorPickersContainer);

        // Create Reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset to Default';
        resetButton.style.marginTop = '15px';
        resetButton.style.padding = '5px 10px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.border = '1px solid #ccc';
        resetButton.style.borderRadius = '3px';
        resetButton.style.backgroundColor = '#f0f0f0';
        resetButton.title = 'Reset current theme to default colors';
        resetButton.style.fontSize = '14px';
        resetButton.style.color = '#000000'; // Ensure button text is black

        resetButton.addEventListener('click', () => {
            const selectedTheme = themeSelectionDropdown.value;
            resetTheme(selectedTheme);
        });

        themeEditorContent.appendChild(resetButton);

        // Append header and content to the container
        themeEditorContainer.appendChild(themeEditorHeader);
        themeEditorContainer.appendChild(themeEditorContent);
        document.body.appendChild(themeEditorContainer);

        // Function to update color pickers based on selected theme
        function updateColorPickers(themeStyles) {
            const colorPickerInputs = colorPickersContainer.querySelectorAll('input[type="color"]');
            colorPickerInputs.forEach((input, index) => {
                const variable = colorPickerElements[index].variable;
                input.value = rgbToHex(themeStyles[variable].trim()) || '#000000';
            });
        }

        // Initialize with the first theme
        const initialTheme = themeSelectionDropdown.value;
        const initialThemeStyles = getTheme(initialTheme);
        applyTheme(initialThemeStyles);
        updateColorPickers(initialThemeStyles);

        // Handle theme selection change
        themeSelectionDropdown.addEventListener('change', () => {
            const selectedTheme = themeSelectionDropdown.value;
            const themeStyles = getTheme(selectedTheme);
            applyTheme(themeStyles);
            updateColorPickers(themeStyles);
        });

        return themeEditorContainer;
    }

    // Function to create the toggle button in the toolbar
    function createToggleButton(themeEditorContainer) {
        const toolbar = document.querySelector('.toolbar');
        if (!toolbar) {
            console.warn('Toolbar not found. Theme Editor button not added.');
            return;
        }

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Theme Editor';
        toggleButton.style.marginLeft = '10px';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.border = '1px solid #ccc';
        toggleButton.style.borderRadius = '3px';
        toggleButton.style.backgroundColor = '#f0f0f0';
        toggleButton.title = 'Open Theme Editor';
        toggleButton.style.fontSize = '14px';
        toggleButton.style.color = '#000000'; // Ensure button text is black

        toggleButton.addEventListener('click', () => {
            if (themeEditorContainer.style.display === 'none' || themeEditorContainer.style.display === '') {
                themeEditorContainer.style.display = 'block';
            } else {
                themeEditorContainer.style.display = 'none';
            }
        });

        toolbar.appendChild(toggleButton);
    }

    // Function to initialize the theme editor
    function initializeThemeEditor() {
        if (!window.themeEditorInitialized) {
            window.themeEditorInitialized = true;
            const themeEditorContainer = createThemeEditor();
            createToggleButton(themeEditorContainer);
            console.log('Advanced Custom Theme Editor initialized.');
        }
    }

    // Observe DOM changes to detect when the toolbar is added
    function waitForToolbar() {
        const toolbar = document.querySelector('.toolbar');
        if (toolbar) {
            initializeThemeEditor();
        } else {
            // If toolbar is not found, set up a MutationObserver to watch for it
            const observer = new MutationObserver((mutations, obs) => {
                const toolbar = document.querySelector('.toolbar');
                if (toolbar) {
                    initializeThemeEditor();
                    obs.disconnect(); // Stop observing once toolbar is found
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Run the waitForToolbar function after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForToolbar);
    } else {
        waitForToolbar();
    }

})();
