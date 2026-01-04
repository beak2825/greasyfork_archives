// ==UserScript==
// @name         Telegram Web Colors
// @namespace    http://tampermonkey.net/
// @version      3.28
// @description  Adds an aesthetic color palette to Telegram Web.
// @author       Emithby
// @match        https://web.telegram.org/*
// @match        https://web.telegram.org/a/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/504058/Telegram%20Web%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/504058/Telegram%20Web%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve the saved state from localStorage
    let isOpen = localStorage.getItem('paletteOpen') === 'true';

    function addColorPalette() {
        const paletteContainer = document.createElement('div');
        paletteContainer.id = 'colorPaletteContainer';
        paletteContainer.style.position = 'fixed';
        paletteContainer.style.bottom = '20px';
        paletteContainer.style.right = '20px';
        paletteContainer.style.padding = '15px';
        paletteContainer.style.backgroundColor = '#ffffff';
        paletteContainer.style.borderRadius = '10px';
        paletteContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        paletteContainer.style.zIndex = '9999';
        paletteContainer.style.width = '250px';
        paletteContainer.style.display = 'flex';
        paletteContainer.style.flexDirection = 'column';
        paletteContainer.style.alignItems = 'center';
        paletteContainer.style.border = '4px solid #000';
        paletteContainer.style.fontFamily = 'Arial, sans-serif';
        paletteContainer.style.fontSize = '14px';
        paletteContainer.style.transition = 'transform 0.4s ease-in-out';
        paletteContainer.style.overflow = 'hidden';
        paletteContainer.style.transform = isOpen ? 'translateY(0)' : 'translateY(100%)';

        const title = document.createElement('h4');
        title.textContent = 'Select Theme Color';
        title.style.margin = '0 0 10px 0';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '22px'; // Increased font size
        title.style.color = '#FF5733'; // Bright color for the title
        title.style.textShadow = '1px 1px 2px rgba(0,0,0,0.4)'; // Text shadow for better visibility
        title.style.transition = 'color 0.3s, text-shadow 0.3s'; // Smooth transitions
        paletteContainer.appendChild(title);

        const colors = [
            '#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A8',
            '#33FFF5', '#FF6F33', '#9B59B6', '#FFC300', '#C70039',
            '#581845', '#FF9F00', '#2ECC71'
        ];

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.marginBottom = '10px';
        buttonContainer.style.justifyContent = 'center';

        colors.forEach(color => {
            const colorButton = document.createElement('button');
            colorButton.style.backgroundColor = color;
            colorButton.style.width = '40px';
            colorButton.style.height = '40px';
            colorButton.style.border = '2px solid #000';
            colorButton.style.margin = '4px';
            colorButton.style.cursor = 'pointer';
            colorButton.style.borderRadius = '50%';
            colorButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            colorButton.title = color;
            colorButton.addEventListener('click', () => applyThemeColor(color));
            buttonContainer.appendChild(colorButton);
        });

        paletteContainer.appendChild(buttonContainer);

        const customColorContainer = document.createElement('div');
        customColorContainer.style.display = 'flex';
        customColorContainer.style.flexDirection = 'column';
        customColorContainer.style.alignItems = 'center';

        const customColorTitle = document.createElement('span');
        customColorTitle.textContent = 'Custom Color';
        customColorTitle.style.marginBottom = '5px';
        customColorTitle.style.fontSize = '16px'; // Increased font size
        customColorTitle.style.fontWeight = 'bold';
        customColorTitle.style.color = '#FF5733'; // Bright color for custom color title
        customColorTitle.style.textShadow = '1px 1px 2px rgba(0,0,0,0.4)'; // Text shadow for better visibility

        const customColorInputContainer = document.createElement('div');
        customColorInputContainer.style.position = 'relative';
        customColorInputContainer.style.display = 'flex';
        customColorInputContainer.style.alignItems = 'center';

        const customColorInput = document.createElement('input');
        customColorInput.type = 'color';
        customColorInput.style.position = 'absolute';
        customColorInput.style.top = '0';
        customColorInput.style.left = '0';
        customColorInput.style.opacity = '0';
        customColorInput.style.cursor = 'pointer';
        customColorInput.addEventListener('input', (e) => {
            applyThemeColor(e.target.value);
        });

        const customColorCircle = document.createElement('div');
        customColorCircle.style.width = '40px';
        customColorCircle.style.height = '40px';
        customColorCircle.style.borderRadius = '50%';
        customColorCircle.style.background = 'linear-gradient(135deg, red, orange, yellow, green, blue, indigo, violet)';
        customColorCircle.style.margin = '4px';
        customColorCircle.style.cursor = 'pointer';
        customColorCircle.style.border = '2px solid #000';
        customColorCircle.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        customColorCircle.style.display = 'flex';
        customColorCircle.style.alignItems = 'center';
        customColorCircle.style.justifyContent = 'center';
        customColorCircle.style.fontSize = '20px';
        customColorCircle.style.color = '#fff';
        customColorCircle.style.backgroundColor = '#FFCC00'; // Custom color for visibility
        customColorCircle.title = 'Click to choose a color';
        customColorCircle.addEventListener('click', () => {
            customColorInput.click();
        });
        customColorCircle.textContent = '🎨'; // Emoji in the center

        customColorInputContainer.appendChild(customColorCircle);
        customColorInputContainer.appendChild(customColorInput);
        customColorContainer.appendChild(customColorTitle);
        customColorContainer.appendChild(customColorInputContainer);

        paletteContainer.appendChild(customColorContainer);

        const controlsContainer = document.createElement('div');
        controlsContainer.style.position = 'absolute';
        controlsContainer.style.top = '5px';
        controlsContainer.style.right = '5px';
        controlsContainer.style.display = 'flex';
        controlsContainer.style.flexDirection = 'column';

        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = isOpen ? '▼' : '▲'; // Down arrow when open, up arrow when closed
        toggleButton.style.border = 'none';
        toggleButton.style.backgroundColor = '#007BFF';
        toggleButton.style.color = '#fff';
        toggleButton.style.borderRadius = '50%';
        toggleButton.style.width = '24px';
        toggleButton.style.height = '24px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '16px';
        toggleButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        toggleButton.style.transition = 'transform 0.4s ease-in-out';
        toggleButton.addEventListener('click', () => {
            isOpen = !isOpen;
            localStorage.setItem('paletteOpen', isOpen);
            paletteContainer.style.transform = isOpen ? 'translateY(0)' : 'translateY(100%)';
            toggleButton.innerHTML = isOpen ? '▼' : '▲';
        });

        controlsContainer.appendChild(toggleButton);

        paletteContainer.appendChild(controlsContainer);

        document.body.appendChild(paletteContainer);

        function adjustColors() {
            const isDarkMode = window.getComputedStyle(document.body).getPropertyValue('--theme-background-color').includes('rgb(0, 0, 0)');
            title.style.color = isDarkMode ? '#ddd' : '#333';
            paletteContainer.style.borderColor = isDarkMode ? '#444' : '#000';
        }

        const savedColor = localStorage.getItem('themeColor');
        if (savedColor) {
            applyThemeColor(savedColor);
        }

        const observer = new MutationObserver(adjustColors);
        observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

        adjustColors();
    }

    function applyThemeColor(color) {
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --primary-color: ${color};
                --secondary-color: ${color};
                --accent-color: ${color};
            }
        `;
        document.head.appendChild(style);

        localStorage.setItem('themeColor', color);
    }

    window.addEventListener('load', addColorPalette);
})();
