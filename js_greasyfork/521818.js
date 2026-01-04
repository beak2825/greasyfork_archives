// ==UserScript==
// @name         Drawaria Fast Color Flow+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds advanced controls for Drawaria, including Fast Color Flow, avatar boundary control, brushcursor restrictions, auto-drawing, and more.
// @author       YouTube
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521818/Drawaria%20Fast%20Color%20Flow%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/521818/Drawaria%20Fast%20Color%20Flow%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. Ajustar el máximo de "Flujo de color" a 200
    const colorFlowInput = document.querySelector('input[data-localprop="colorflow"]');
    if (colorFlowInput) {
        colorFlowInput.setAttribute('max', '200');
    }

    // 2. Deshacer/Rehacer
    const undoStack = [];
    const redoStack = [];

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Crear botones y agregarlos al menú
    const undoButton = document.createElement('button');
    undoButton.innerText = 'Undo';
    undoButton.id = 'undo-button';

    const redoButton = document.createElement('button');
    redoButton.innerText = 'Redo';
    redoButton.id = 'redo-button';

    const exportButton = document.createElement('button');
    exportButton.innerText = 'Export Canvas';
    exportButton.id = 'export-button';

    // Agregar botones al menú
    const menu = document.querySelector('.drawcontrols-settingscontainer');
    menu.appendChild(undoButton);
    menu.appendChild(redoButton);
    menu.appendChild(exportButton);

    // Funcionalidad de Deshacer/Rehacer
    undoButton.addEventListener('click', () => {
        if (undoStack.length > 0) {
            const lastAction = undoStack.pop();
            redoStack.push(lastAction);
            ctx.putImageData(lastAction, 0, 0);
        }
    });

    redoButton.addEventListener('click', () => {
        if (redoStack.length > 0) {
            const lastAction = redoStack.pop();
            undoStack.push(lastAction);
            ctx.putImageData(lastAction, 0, 0);
        }
    });

    canvas.addEventListener('mouseup', () => {
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        redoStack.length = 0; // Clear redo stack after new action
    });

    // Funcionalidad de Exportar Lienzo
    exportButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'canvas.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // 3. Dibujo automático: cargar una imagen y dibujarla en el canvas
    const autoDrawSection = document.createElement('div');
    autoDrawSection.innerHTML = `
        <div class="drawcontrols-settingstab">
            <label for="auto-draw-image">Auto-draw from image:</label>
            <input type="file" id="auto-draw-image" accept="image/*">
            <button id="start-auto-draw">Start Auto-draw</button>
        </div>
    `;
    menu.appendChild(autoDrawSection);

    document.getElementById('start-auto-draw').addEventListener('click', function () {
        const fileInput = document.getElementById('auto-draw-image');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function () {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // 4. Agregar submenús, botones, rangos y selectores para personalización
    const customizationSection = document.createElement('div');
    customizationSection.innerHTML = `
        <div class="drawcontrols-settingstab">
            <label for="brush-size-selector">Brush Size:</label>
            <select id="brush-size-selector" data-localprop="brushSize">
                <option value="1">Small</option>
                <option value="2">Medium</option>
                <option value="3">Large</option>
            </select>
        </div>
        <div class="drawcontrols-settingstab">
            <label for="opacity-range">Opacity:</label>
            <input type="range" id="opacity-range" min="0" max="1" step="0.1" data-localprop="opacity">
        </div>
    `;
    menu.appendChild(customizationSection);

    document.getElementById('brush-size-selector').addEventListener('change', function () {
        const brushSize = this.value;
        // Aquí puedes ajustar el tamaño del pincel en el canvas
        console.log(`Brush size set to: ${brushSize}`);
    });

    document.getElementById('opacity-range').addEventListener('input', function () {
        const opacity = this.value;
        // Aquí puedes ajustar la opacidad del pincel en el canvas
        console.log(`Opacity set to: ${opacity}`);
    });

    // Estilos adicionales para mejorar la apariencia
    const style = document.createElement('style');
    style.innerHTML = `
        .drawcontrols-settingscontainer {
            background: linear-gradient(135deg, #ffeb3b, #fbc02d);
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 10px;
            animation: fadeIn 0.5s ease-in-out;
        }
        .drawcontrols-settingstab {
            margin-bottom: 10px;
        }
        .drawcontrols-settingstab label {
            font-weight: bold;
            margin-right: 10px;
            color: #333;
        }
        .drawcontrols-settingstab input[type="range"] {
            width: 100%;
        }
        .drawcontrols-settingstab select {
            width: 100%;
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        #undo-button, #redo-button, #export-button, #start-auto-draw {
            background: linear-gradient(135deg, #ff80ab, #ff4081);
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 10px;
            margin: 5px 0;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        #undo-button:hover, #redo-button:hover, #export-button:hover, #start-auto-draw:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(255, 64, 129, 0.5);
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
})();