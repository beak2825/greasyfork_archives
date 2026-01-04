// ==UserScript==
// @name         Drawaria Letters in the Canvas Safe Version
// @namespace
// @version      2025-01-21
// @description  Write text on the Drawaria canvas with sliders for position, improved UI, dark mode, and font size control
// @author       You
// @match        *://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1088100
// @downloadURL https://update.greasyfork.org/scripts/524461/Drawaria%20Letters%20in%20the%20Canvas%20Safe%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/524461/Drawaria%20Letters%20in%20the%20Canvas%20Safe%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of predefined words
    const words = [
        "HELLO", "WORLD", "DRAW", "ARIA", "TEXT",
        "SCRIPT", "CANVAS", "COLOR", "SLIDER", "TOOL"
    ];

    // Adding Text Input and Controls with Sliders (Dark Mode)
    function addTextInput() {
        let container = document.createElement('div');
        container.id = 'drawaria-text-tool';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 1000;
            background: #222;
            padding: 15px;
            border: 1px solid #333;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            color: #fff;
            width: 250px;
        `;

        // Title and Toggle Button
        let titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 5px;
            background: #333;
            border-radius: 8px 8px 0 0;
        `;

        let title = document.createElement('span');
        title.textContent = 'Letters In The Canvas';
        title.style.fontSize = '12px';

        let toggleButton = document.createElement('span');
        toggleButton.textContent = '▼';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.marginLeft = '10px';

        titleBar.appendChild(title);
        titleBar.appendChild(toggleButton);
        container.appendChild(titleBar);

        // Content
        let content = document.createElement('div');
        content.id = 'drawaria-text-tool-content';
        content.style.display = 'none';

        // Word List with Scroll
        let wordListContainer = document.createElement('div');
        wordListContainer.style.cssText = `
            max-height: 150px;
            overflow-y: auto;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 5px;
            background: #333;
        `;

        words.forEach(word => {
            let wordItem = document.createElement('div');
            wordItem.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            `;

            let checkbox = document.createElement('input');
            checkbox.type = 'radio';
            checkbox.name = 'word-select';
            checkbox.value = word;
            checkbox.style.marginRight = '10px';

            let wordLabel = document.createElement('label');
            wordLabel.textContent = word;
            wordLabel.style.color = '#fff';

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    // Deselect other checkboxes
                    document.querySelectorAll('input[name="word-select"]').forEach(otherCheckbox => {
                        if (otherCheckbox !== checkbox) {
                            otherCheckbox.checked = false;
                        }
                    });
                }
            });

            wordItem.appendChild(checkbox);
            wordItem.appendChild(wordLabel);
            wordListContainer.appendChild(wordItem);
        });

        // Color Input
        let colorLabel = createLabel('Color:', '#fff');
        let colorInput = createInput('color', '', '#000000', '#fff');
        colorInput.id = 'drawaria-color-input';
        colorInput.style.width = '40px';
        colorInput.style.height = '30px';

        // X Position Slider
        let xLabel = createLabel('X Position:', '#fff');
        let xSlider = createSlider(0.01, 0.95, 0.01, 0.10);
        xSlider.id = 'drawaria-x-slider';
        let xValueDisplay = createValueDisplay(xSlider);

        // Y Position Slider
        let yLabel = createLabel('Y Position:', '#fff');
        let ySlider = createSlider(0.01, 0.95, 0.01, 0.10);
        ySlider.id = 'drawaria-y-slider';
        let yValueDisplay = createValueDisplay(ySlider);

        // Thickness Slider (Font Size)
        let thicknessLabel = createLabel('Font Size:', '#fff');
        let thicknessSlider = createSlider(1, 10, 1, 1);
        thicknessSlider.id = 'drawaria-thickness-slider';
        let thicknessValueDisplay = createValueDisplay(thicknessSlider);

        // Direction Dropdown
        let directionLabel = createLabel('Direction:', '#fff');
        let directionInput = createSelect(['Left to Right', 'Right to Left', 'Top to Bottom', 'Bottom to Top']);
        directionInput.id = 'drawaria-direction-input';

        // Send Button
        let sendButton = createButton('Send Text', '#4CAF50', '#45a049');
        sendButton.addEventListener('click', sendText);

        // Erase Button
        let eraseButton = createButton('Erase Text', '#f44336', '#e53935');
        eraseButton.addEventListener('click', eraseText);

        content.appendChild(wordListContainer);
        content.appendChild(colorLabel);
        content.appendChild(colorInput);
        content.appendChild(xLabel);
        content.appendChild(xSlider);
        content.appendChild(xValueDisplay);
        content.appendChild(yLabel);
        content.appendChild(ySlider);
        content.appendChild(yValueDisplay);
        content.appendChild(thicknessLabel);
        content.appendChild(thicknessSlider);
        content.appendChild(thicknessValueDisplay);
        content.appendChild(directionLabel);
        content.appendChild(directionInput);
        content.appendChild(sendButton);
        content.appendChild(eraseButton);
        container.appendChild(content);
        document.body.appendChild(container);

        // Make the menu draggable
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Toggle menu visibility
        titleBar.addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggleButton.textContent = '▲';
            } else {
                content.style.display = 'none';
                toggleButton.textContent = '▼';
            }
        });
    }

    // Helper functions for UI creation
    function createLabel(text, color) {
        let label = document.createElement('label');
        label.textContent = text;
        label.style.color = color;
        return label;
    }

    function createInput(type, placeholder, bgColor, textColor) {
        let input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.style.cssText = `
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #444;
            background: ${bgColor};
            color: ${textColor};
        `;
        return input;
    }

    function createSlider(min, max, step, value) {
        let slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = value;
        slider.style.width = '100%';
        return slider;
    }

    function createValueDisplay(slider) {
        let display = document.createElement('span');
        display.textContent = parseFloat(slider.value).toFixed(2);
        slider.addEventListener('input', () => {
            display.textContent = parseFloat(slider.value).toFixed(2);
        });
        return display;
    }

    function createSelect(options) {
        let select = document.createElement('select');
        select.style.cssText = `
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #444;
            background: #333;
            color: #fff;
        `;
        options.forEach(option => {
            let opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
        return select;
    }

    function createButton(text, bgColor, hoverColor) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            padding: 10px 15px;
            border-radius: 4px;
            background: ${bgColor};
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = hoverColor;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = bgColor;
        });
        return button;
    }

    // Sending Text Function
    function sendText() {
        let selectedWord = document.querySelector('input[name="word-select"]:checked');
        if (!selectedWord) return;

        let text = selectedWord.value;
        let color = document.getElementById('drawaria-color-input').value;
        let x = parseFloat(document.getElementById('drawaria-x-slider').value);
        let y = parseFloat(document.getElementById('drawaria-y-slider').value);
        let thickness = parseInt(document.getElementById('drawaria-thickness-slider').value);
        let direction = document.getElementById('drawaria-direction-input').value;

        if (text) {
            drawTextOnCanvas(text, x, y, color, direction, thickness);
        }
    }

    // Erasing Text Function
    function eraseText() {
        let selectedWord = document.querySelector('input[name="word-select"]:checked');
        if (!selectedWord) return;

        let text = selectedWord.value;
        let x = parseFloat(document.getElementById('drawaria-x-slider').value);
        let y = parseFloat(document.getElementById('drawaria-y-slider').value);
        let thickness = parseInt(document.getElementById('drawaria-thickness-slider').value);
        let direction = document.getElementById('drawaria-direction-input').value;

        if (text) {
            drawTextOnCanvas(text, x, y, '#FFFFFF', direction, thickness);
        }
    }

    // Drawing Text on Canvas
    function drawTextOnCanvas(text, x, y, color, direction, thickness) {
        const spacing = 0.05 * thickness; // Adjust spacing based on thickness
        for (let char of text) {
            drawCharacter(char, x, y, color, thickness);
            switch (direction) {
                case 'Left to Right':
                    x += spacing;
                    break;
                case 'Right to Left':
                    x -= spacing;
                    break;
                case 'Top to Bottom':
                    y += spacing;
                    break;
                case 'Bottom to Top':
                    y -= spacing;
                    break;
            }
        }
    }

    // Drawing Each Character
    function drawCharacter(char, x, y, color, thickness) {
        let commands = getCharacterCommands(char, x, y, thickness);
        commands.forEach(cmd => {
            sendDrawCommand(cmd[0], cmd[1], cmd[2], cmd[3], color);
        });
    }

    // Get Character Commands
    function getCharacterCommands(char, x, y, thickness) {
        const sizeFactor = thickness * 0.01; // Scale commands based on thickness
        switch (char) {
            case 'A':
                return [
                    [x, y + sizeFactor * 4, x + sizeFactor * 2, y], // Diagonal izquierda
                    [x + sizeFactor * 2, y, x + sizeFactor * 4, y + sizeFactor * 4], // Diagonal derecha
                    [x + sizeFactor * 1, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2] // Barra horizontal
                ];
            case 'B':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Parte media
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4], // Parte inferior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 2], // Línea vertical derecha superior
                    [x + sizeFactor * 3, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 4] // Línea vertical derecha inferior
                ];
            case 'C':
                return [
                    [x + sizeFactor * 3, y, x, y], // Parte superior
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case 'D':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4], // Parte inferior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4] // Línea vertical derecha
                ];
            case 'E':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x, y, x, y + sizeFactor * 4], // Línea vertical
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Parte media
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case 'F':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x, y, x, y + sizeFactor * 4], // Línea vertical
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2] // Parte media
                ];
            case 'G':
                return [
                    [x + sizeFactor * 3, y, x, y], // Parte superior
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4], // Parte inferior
                    [x + sizeFactor * 3, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 2], // Línea vertical derecha
                    [x + sizeFactor * 3, y + sizeFactor * 2, x + sizeFactor * 2, y + sizeFactor * 2] // Barra horizontal
                ];
            case 'H':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical derecha
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2] // Barra horizontal
                ];
            case 'I':
                return [
                    [x + sizeFactor * 1.5, y, x + sizeFactor * 1.5, y + sizeFactor * 4], // Línea vertical
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case 'J':
                return [
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4], // Parte inferior
                    [x, y + sizeFactor * 4, x, y + sizeFactor * 3] // Línea horizontal izquierda
                ];
            case 'K':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y], // Diagonal superior
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 4] // Diagonal inferior
                ];
            case 'L':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case 'M':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x, y, x + sizeFactor * 1.5, y + sizeFactor * 2], // Diagonal superior
                    [x + sizeFactor * 1.5, y + sizeFactor * 2, x + sizeFactor * 3, y], // Diagonal superior derecha
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4] // Línea vertical derecha
                ];
            case 'N':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x, y, x + sizeFactor * 3, y + sizeFactor * 4], // Diagonal
                    [x + sizeFactor * 3, y + sizeFactor * 4, x + sizeFactor * 3, y] // Línea vertical derecha
                ];
            case 'O':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical derecha
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case 'P':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 2], // Línea vertical derecha superior
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2] // Parte media
                ];
            case 'Q':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical derecha
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4], // Parte inferior
                    [x + sizeFactor * 2, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 4] // Cola de la Q
                ];
            case 'R':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 2], // Línea vertical derecha superior
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Parte media
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 4] // Diagonal inferior
                ];
            case 'S':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x, y, x, y + sizeFactor * 2], // Línea vertical izquierda superior
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Parte media
                    [x + sizeFactor * 3, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical derecha inferior
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case 'T':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 1.5, y, x + sizeFactor * 1.5, y + sizeFactor * 4] // Línea vertical
                ];
            case 'U':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4], // Parte inferior
                    [x + sizeFactor * 3, y + sizeFactor * 4, x + sizeFactor * 3, y] // Línea vertical derecha
                ];
            case 'V':
                return [
                    [x, y, x + sizeFactor * 1.5, y + sizeFactor * 4], // Diagonal izquierda
                    [x + sizeFactor * 1.5, y + sizeFactor * 4, x + sizeFactor * 3, y] // Diagonal derecha
                ];
            case 'W':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x, y + sizeFactor * 4, x + sizeFactor * 1.5, y + sizeFactor * 2], // Diagonal inferior izquierda
                    [x + sizeFactor * 1.5, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 4], // Diagonal inferior derecha
                    [x + sizeFactor * 3, y + sizeFactor * 4, x + sizeFactor * 3, y] // Línea vertical derecha
                ];
            case 'X':
                return [
                    [x, y, x + sizeFactor * 3, y + sizeFactor * 4], // Diagonal principal
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y] // Diagonal secundaria
                ];
            case 'Y':
                return [
                    [x, y, x + sizeFactor * 1.5, y + sizeFactor * 2], // Diagonal superior izquierda
                    [x + sizeFactor * 1.5, y + sizeFactor * 2, x + sizeFactor * 3, y], // Diagonal superior derecha
                    [x + sizeFactor * 1.5, y + sizeFactor * 2, x + sizeFactor * 1.5, y + sizeFactor * 4] // Línea vertical
                ];
            case 'Z':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x, y + sizeFactor * 4], // Diagonal
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case '0':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical derecha
                    [x + sizeFactor * 3, y + sizeFactor * 4, x, y + sizeFactor * 4], // Parte inferior
                    [x, y + sizeFactor * 4, x, y] // Línea vertical izquierda
                ];
            case '1':
                return [
                    [x + sizeFactor * 1, y, x + sizeFactor * 2, y], // Línea diagonal superior (--|)
                    [x + sizeFactor * 2, y, x + sizeFactor * 2, y + sizeFactor * 4], // Línea vertical principal (|)
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Base horizontal (-----)
                ];
            case '2':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 2], // Línea vertical derecha superior
                    [x + sizeFactor * 3, y + sizeFactor * 2, x, y + sizeFactor * 2], // Parte media
                    [x, y + sizeFactor * 2, x, y + sizeFactor * 4], // Línea vertical izquierda inferior
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case '3':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical derecha
                    [x + sizeFactor * 3, y + sizeFactor * 4, x, y + sizeFactor * 4], // Parte inferior
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2] // Parte media
                ];
            case '4':
                return [
                    [x, y, x, y + sizeFactor * 2], // Línea vertical izquierda
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Parte media
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4] // Línea vertical derecha
                ];
            case '5':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x, y, x, y + sizeFactor * 2], // Línea vertical izquierda superior
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Parte media
                    [x + sizeFactor * 3, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical derecha inferior
                    [x + sizeFactor * 3, y + sizeFactor * 4, x, y + sizeFactor * 4] // Parte inferior
                ];
            case '6':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x, y, x, y + sizeFactor * 4], // Línea vertical izquierda
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4], // Parte inferior
                    [x + sizeFactor * 3, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 2], // Línea vertical derecha inferior
                    [x + sizeFactor * 3, y + sizeFactor * 2, x, y + sizeFactor * 2] // Parte media
                ];
            case '7':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4] // Línea vertical derecha
                ];
            case '8':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical derecha
                    [x + sizeFactor * 3, y + sizeFactor * 4, x, y + sizeFactor * 4], // Parte inferior
                    [x, y + sizeFactor * 4, x, y], // Línea vertical izquierda
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2] // Parte media
                ];
            case '9':
                return [
                    [x, y, x + sizeFactor * 3, y], // Parte superior (---)
                    [x, y, x, y + sizeFactor * 2], // Línea vertical izquierda superior (|)
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 2], // Línea vertical derecha superior (|)
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Línea horizontal media (---)
                    [x + sizeFactor * 3, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 4], // Línea vertical derecha inferior (|)
                    [x + sizeFactor * 1, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior (--)
                ];
            case '!':
                return [
                    [x + sizeFactor * 1.5, y, x + sizeFactor * 1.5, y + sizeFactor * 3], // Línea vertical
                    [x + sizeFactor * 1.5, y + sizeFactor * 3.5, x + sizeFactor * 1.5, y + sizeFactor * 4] // Punto
                ];
            case '?':
                return [
                    [x + sizeFactor * 1.5, y, x + sizeFactor * 3, y], // Parte superior horizontal
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 1], // Línea vertical derecha
                    [x + sizeFactor * 3, y + sizeFactor * 1, x + sizeFactor * 1.5, y + sizeFactor * 2], // Diagonal hacia la izquierda
                    [x + sizeFactor * 1.5, y + sizeFactor * 2, x + sizeFactor * 1.5, y + sizeFactor * 3], // Línea vertical central
                    [x + sizeFactor * 1.5, y + sizeFactor * 3.5, x + sizeFactor * 1.5, y + sizeFactor * 3.5] // Punto inferior
                ];
            case '@':
                return [
                    [x + sizeFactor * 2, y, x, y + sizeFactor * 1], // Parte superior
                    [x, y + sizeFactor * 1, x + sizeFactor * 2, y + sizeFactor * 4], // Diagonal
                    [x + sizeFactor * 2, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 3], // Curva
                    [x + sizeFactor * 3, y + sizeFactor * 3, x + sizeFactor * 2, y + sizeFactor * 2], // Curva
                    [x + sizeFactor * 2, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 1], // Curva
                    [x + sizeFactor * 3, y + sizeFactor * 1, x + sizeFactor * 2, y] // Curva
                ];
            case '#':
                return [
                    [x + sizeFactor * 1, y, x + sizeFactor * 2, y], // Parte superior
                    [x + sizeFactor * 2, y, x + sizeFactor * 3, y], // Parte superior
                    [x, y + sizeFactor * 1, x + sizeFactor * 3, y + sizeFactor * 1], // Línea horizontal
                    [x + sizeFactor * 1, y + sizeFactor * 2, x + sizeFactor * 2, y + sizeFactor * 2], // Línea horizontal
                    [x + sizeFactor * 2, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Línea horizontal
                    [x, y + sizeFactor * 3, x + sizeFactor * 3, y + sizeFactor * 3], // Línea horizontal
                    [x + sizeFactor * 1, y + sizeFactor * 4, x + sizeFactor * 2, y + sizeFactor * 4], // Parte inferior
                    [x + sizeFactor * 2, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case '$':
                return [
                    [x + sizeFactor * 2, y, x, y + sizeFactor * 1], // Parte superior
                    [x, y + sizeFactor * 1, x + sizeFactor * 3, y + sizeFactor * 1], // Línea horizontal
                    [x + sizeFactor * 3, y + sizeFactor * 1, x + sizeFactor * 1, y + sizeFactor * 2], // Diagonal
                    [x + sizeFactor * 1, y + sizeFactor * 2, x + sizeFactor * 2, y + sizeFactor * 2], // Línea horizontal
                    [x + sizeFactor * 2, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Línea horizontal
                    [x + sizeFactor * 3, y + sizeFactor * 2, x, y + sizeFactor * 3], // Diagonal
                    [x, y + sizeFactor * 3, x + sizeFactor * 3, y + sizeFactor * 3], // Línea horizontal
                    [x + sizeFactor * 3, y + sizeFactor * 3, x + sizeFactor * 2, y + sizeFactor * 4], // Diagonal
                    [x + sizeFactor * 2, y + sizeFactor * 4, x + sizeFactor * 1, y + sizeFactor * 4] // Parte inferior
                ];
            case '%':
                return [
                    [x, y, x + sizeFactor * 1, y + sizeFactor * 1], // Diagonal superior
                    [x + sizeFactor * 1, y + sizeFactor * 1, x + sizeFactor * 2, y], // Diagonal superior
                    [x + sizeFactor * 2, y, x + sizeFactor * 3, y + sizeFactor * 1], // Diagonal superior
                    [x + sizeFactor * 3, y + sizeFactor * 1, x + sizeFactor * 3, y + sizeFactor * 2], // Línea vertical
                    [x + sizeFactor * 3, y + sizeFactor * 2, x + sizeFactor * 2, y + sizeFactor * 3], // Diagonal inferior
                    [x + sizeFactor * 2, y + sizeFactor * 3, x + sizeFactor * 1, y + sizeFactor * 2], // Diagonal inferior
                    [x + sizeFactor * 1, y + sizeFactor * 2, x, y + sizeFactor * 3], // Diagonal inferior
                    [x, y + sizeFactor * 3, x + sizeFactor * 1, y + sizeFactor * 4], // Diagonal inferior
                    [x + sizeFactor * 1, y + sizeFactor * 4, x + sizeFactor * 2, y + sizeFactor * 3], // Diagonal inferior
                    [x + sizeFactor * 2, y + sizeFactor * 3, x + sizeFactor * 3, y + sizeFactor * 4] // Diagonal inferior
                ];
            case '^':
                return [
                    [x + sizeFactor * 1, y + sizeFactor * 3, x, y + sizeFactor * 4], // Diagonal izquierda
                    [x, y + sizeFactor * 4, x + sizeFactor * 2, y + sizeFactor * 3], // Diagonal derecha
                    [x + sizeFactor * 2, y + sizeFactor * 3, x + sizeFactor * 3, y + sizeFactor * 4] // Diagonal derecha
                ];
            case '&':
                return [
                    [x + sizeFactor * 1, y, x + sizeFactor * 2, y + sizeFactor * 1], // Diagonal superior
                    [x + sizeFactor * 2, y + sizeFactor * 1, x + sizeFactor * 3, y], // Diagonal superior
                    [x + sizeFactor * 3, y, x + sizeFactor * 3, y + sizeFactor * 1], // Línea vertical
                    [x + sizeFactor * 3, y + sizeFactor * 1, x + sizeFactor * 2, y + sizeFactor * 2], // Diagonal
                    [x + sizeFactor * 2, y + sizeFactor * 2, x + sizeFactor * 1, y + sizeFactor * 1], // Diagonal
                    [x + sizeFactor * 1, y + sizeFactor * 1, x, y], // Diagonal
                    [x, y, x, y + sizeFactor * 1], // Línea vertical
                    [x, y + sizeFactor * 1, x + sizeFactor * 1, y + sizeFactor * 2], // Diagonal
                    [x + sizeFactor * 1, y + sizeFactor * 2, x + sizeFactor * 2, y + sizeFactor * 3], // Diagonal
                    [x + sizeFactor * 2, y + sizeFactor * 3, x + sizeFactor * 3, y + sizeFactor * 2], // Diagonal
                    [x + sizeFactor * 3, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 3], // Línea vertical
                    [x + sizeFactor * 3, y + sizeFactor * 3, x + sizeFactor * 2, y + sizeFactor * 4], // Diagonal
                    [x + sizeFactor * 2, y + sizeFactor * 4, x + sizeFactor * 1, y + sizeFactor * 3], // Diagonal
                    [x + sizeFactor * 1, y + sizeFactor * 3, x, y + sizeFactor * 4] // Diagonal
                ];
            case '*':
                return [
                    [x + sizeFactor * 1.5, y, x + sizeFactor * 1.5, y + sizeFactor * 4], // Línea vertical
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2], // Línea horizontal
                    [x, y + sizeFactor * 4, x + sizeFactor * 3, y] // Diagonal
                ];
            case '(':
                return [
                    [x + sizeFactor * 1, y, x, y + sizeFactor * 1], // Diagonal superior
                    [x, y + sizeFactor * 1, x, y + sizeFactor * 3], // Línea vertical
                    [x, y + sizeFactor * 3, x + sizeFactor * 1, y + sizeFactor * 4] // Diagonal inferior
                ];
            case ')':
                return [
                    [x + sizeFactor * 2, y, x + sizeFactor * 3, y + sizeFactor * 1], // Diagonal superior
                    [x + sizeFactor * 3, y + sizeFactor * 1, x + sizeFactor * 3, y + sizeFactor * 3], // Línea vertical
                    [x + sizeFactor * 3, y + sizeFactor * 3, x + sizeFactor * 2, y + sizeFactor * 4] // Diagonal inferior
                ];
            case '-':
                return [
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2] // Línea horizontal
                ];
            case '+':
                return [
                    [x + sizeFactor * 1.5, y, x + sizeFactor * 1.5, y + sizeFactor * 4], // Línea vertical
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 2] // Línea horizontal
                ];
            case '=':
                return [
                    [x, y + sizeFactor * 1.5, x + sizeFactor * 3, y + sizeFactor * 1.5], // Línea horizontal superior
                    [x, y + sizeFactor * 2.5, x + sizeFactor * 3, y + sizeFactor * 2.5] // Línea horizontal inferior
                ];
            case '[':
                return [
                    [x, y, x, y + sizeFactor * 4], // Línea vertical
                    [x, y, x + sizeFactor * 1, y], // Parte superior
                    [x, y + sizeFactor * 4, x + sizeFactor * 1, y + sizeFactor * 4] // Parte inferior
                ];
            case ']':
                return [
                    [x + sizeFactor * 2, y, x + sizeFactor * 2, y + sizeFactor * 4], // Línea vertical
                    [x + sizeFactor * 2, y, x + sizeFactor * 3, y], // Parte superior
                    [x + sizeFactor * 2, y + sizeFactor * 4, x + sizeFactor * 3, y + sizeFactor * 4] // Parte inferior
                ];
            case '{':
                return [
                    [x + sizeFactor * 1, y, x, y + sizeFactor * 1], // Diagonal superior
                    [x, y + sizeFactor * 1, x, y + sizeFactor * 3], // Línea vertical
                    [x, y + sizeFactor * 3, x + sizeFactor * 1, y + sizeFactor * 4], // Diagonal inferior
                    [x + sizeFactor * 1, y, x + sizeFactor * 2, y], // Parte superior
                    [x + sizeFactor * 2, y + sizeFactor * 4, x + sizeFactor * 1, y + sizeFactor * 4] // Parte inferior
                ];
            case '}':
                return [
                    [x + sizeFactor * 2, y, x + sizeFactor * 3, y + sizeFactor * 1], // Diagonal superior
                    [x + sizeFactor * 3, y + sizeFactor * 1, x + sizeFactor * 3, y + sizeFactor * 3], // Línea vertical
                    [x + sizeFactor * 3, y + sizeFactor * 3, x + sizeFactor * 2, y + sizeFactor * 4], // Diagonal inferior
                    [x + sizeFactor * 2, y, x + sizeFactor * 1, y], // Parte superior
                    [x + sizeFactor * 1, y + sizeFactor * 4, x + sizeFactor * 2, y + sizeFactor * 4] // Parte inferior
                ];
            case '|':
                return [
                    [x + sizeFactor * 1.5, y, x + sizeFactor * 1.5, y + sizeFactor * 4] // Línea vertical
                ];
            case '\\':
                return [
                    [x, y, x + sizeFactor * 3, y + sizeFactor * 4] // Diagonal
                ];
            case ':':
                return [
                    [x + sizeFactor * 1.5, y + sizeFactor * 1, x + sizeFactor * 1.5, y + sizeFactor * 1.5], // Punto superior
                    [x + sizeFactor * 1.5, y + sizeFactor * 2.5, x + sizeFactor * 1.5, y + sizeFactor * 3] // Punto inferior
                ];
            case ';':
                return [
                    [x + sizeFactor * 1.5, y + sizeFactor * 1, x + sizeFactor * 1.5, y + sizeFactor * 1.5], // Punto superior
                    [x + sizeFactor * 1.5, y + sizeFactor * 2.5, x + sizeFactor * 1.5, y + sizeFactor * 3], // Punto inferior
                    [x + sizeFactor * 1.5, y + sizeFactor * 3, x, y + sizeFactor * 4] // Cola
                ];
            case '"':
                return [
                    [x + sizeFactor * 1, y + sizeFactor * 3, x, y + sizeFactor * 4], // Comilla izquierda
                    [x + sizeFactor * 2, y + sizeFactor * 3, x + sizeFactor * 3, y + sizeFactor * 4] // Comilla derecha
                ];
            case '\'':
                return [
                    [x + sizeFactor * 1.5, y + sizeFactor * 3, x + sizeFactor * 1.5, y + sizeFactor * 4] // Comilla simple
                ];
            case '<':
                return [
                    [x + sizeFactor * 3, y, x, y + sizeFactor * 2], // Diagonal superior
                    [x, y + sizeFactor * 2, x + sizeFactor * 3, y + sizeFactor * 4] // Diagonal inferior
                ];
            case '>':
                return [
                    [x, y, x + sizeFactor * 3, y + sizeFactor * 2], // Diagonal superior
                    [x + sizeFactor * 3, y + sizeFactor * 2, x, y + sizeFactor * 4] // Diagonal inferior
                ];
            case ',':
                return [
                    [x + sizeFactor * 1.5, y + sizeFactor * 3, x + sizeFactor * 1.5, y + sizeFactor * 4], // Línea vertical
                    [x + sizeFactor * 1.5, y + sizeFactor * 4, x, y + sizeFactor * 4.5] // Cola
                ];
            case '.':
                return [
                    [x + sizeFactor * 1.5, y + sizeFactor * 3, x + sizeFactor * 1.5, y + sizeFactor * 3.5] // Punto
                ];
            case '/':
                return [
                    [x + sizeFactor * 3, y, x, y + sizeFactor * 4] // Diagonal
                ];
            default:
                return []; // Default line for unknown characters
        }
    }

    // Sending Draw Command via WebSocket
    function sendDrawCommand(x1, y1, x2, y2, color) {
        let message = `42["drawcmd",0,[${x1},${y1},${x2},${y2},false,0,"${color}",0,0,{}]]`;
        window.sockets.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            }
        });
    }

    // Overriding WebSocket send method to capture sockets
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (window.sockets.indexOf(this) === -1) {
            window.sockets.push(this);
        }
        return originalSend.call(this, ...args);
    };

    // Initializing
    window.sockets = [];
    addTextInput();
})();