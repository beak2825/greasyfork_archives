// ==UserScript==
// @name         Notes on websites in the form of text and drawing
// @namespace    https://github.com/sergshap/Web-Page-Scribbler/blob/68252de90964c3d40a4d16e4429510cd058f4170/Notes%20on%20websites%20in%20the%20form%20of%20text%20and%20drawing-1.3.user.js
// @version      1.4
// @description  Leave text notes and notes in the form of a picture on any pages. Everything is saved automatically, when you re-enter everything is saved.
// @author       Immortal
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      Immortal
// @downloadURL https://update.greasyfork.org/scripts/503899/Notes%20on%20websites%20in%20the%20form%20of%20text%20and%20drawing.user.js
// @updateURL https://update.greasyfork.org/scripts/503899/Notes%20on%20websites%20in%20the%20form%20of%20text%20and%20drawing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define language texts
    const languages = {
        en: {
            placeholder: 'Write your notes here...',
            clearNotes: 'Clear Notes',
            brushSize: 'Brush Size:',
            toggleDrawing: 'Toggle Drawing',
            toggleEraser: 'Toggle Eraser',
            clearDrawing: 'Clear Drawing',
            notesCleared: 'Notes cleared!',
            drawingEnabled: 'Drawing mode enabled. Click and drag to draw.',
            drawingDisabled: 'Drawing mode disabled.',
            eraserEnabled: 'Eraser mode enabled. Click and drag to erase.',
            eraserDisabled: 'Eraser mode disabled.',
            drawingCleared: 'Drawing cleared!',
            language: 'Language',
            author: 'Author',
            minimize: 'Minimize',
            maximize: 'Maximize'
        },
        ru: {
            placeholder: 'Напишите свои заметки здесь...',
            clearNotes: 'Очистить заметки',
            brushSize: 'Размер кисти:',
            toggleDrawing: 'Переключить рисование',
            toggleEraser: 'Переключить ластик',
            clearDrawing: 'Очистить рисунок',
            notesCleared: 'Заметки очищены!',
            drawingEnabled: 'Режим рисования включен. Кликайте и тяните для рисования.',
            drawingDisabled: 'Режим рисования отключен.',
            eraserEnabled: 'Режим ластика включен. Кликайте и тяните для стирания.',
            eraserDisabled: 'Режим ластика отключен.',
            drawingCleared: 'Рисунок очищен!',
            language: 'Язык',
            author: 'Автор',
            minimize: 'Свернуть',
            maximize: 'Развернуть'
        }
    };

    // Retrieve and set the current language
    const currentLanguage = localStorage.getItem('scribbler-language') || 'en';

    // Create and style the scribbling tool
    const style = document.createElement('style');
    style.textContent = `
        #scribbler-tool {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            transition: transform 0.3s ease;
        }
        #scribbler-tool.minimized {
            transform: translateY(calc(100% + 10px));
        }
        #scribbler-tool textarea {
            width: 200px;
            height: 100px;
            margin-bottom: 10px;
        }
        #scribbler-tool button,
        #scribbler-tool input[type="color"],
        #scribbler-tool input[type="range"],
        #scribbler-tool select {
            padding: 5px 10px;
            margin: 2px;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        #scribbler-tool button.active,
        #scribbler-tool input[type="color"]:active,
        #scribbler-tool input[type="range"]:active,
        #scribbler-tool select:active {
            background: #0056b3;
        }
        #brush-size-container {
            display: flex;
            align-items: center;
        }
        #brush-size-container input[type="range"] {
            width: 100px;
            margin-left: 10px;
        }
        #drawing-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        }
        #author-signature {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 5px 10px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            cursor: pointer;
            font-size: 14px;
        }
        #author-signature:hover {
            background: #f0f0f0;
        }
        #language-switcher {
            margin-top: 10px;
        }
        #minimize-toggle {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            z-index: 10001;
        }
        #minimize-toggle:hover {
            background: #0056b3;
        }
    `;
    document.head.appendChild(style);

    // Create the scribbling tool interface
    const toolDiv = document.createElement('div');
    toolDiv.id = 'scribbler-tool';
    toolDiv.classList.add('minimized'); // Изначально окно свёрнуто
    toolDiv.innerHTML = `
        <textarea placeholder="${languages[currentLanguage].placeholder}"></textarea>
        <button id="clear-scribbles">${languages[currentLanguage].clearNotes}</button>
        <input type="color" id="color-picker" value="#000000">
        <div id="brush-size-container">
            <label for="brush-size">${languages[currentLanguage].brushSize}</label>
            <input type="range" id="brush-size" min="1" max="50" value="5">
            <span id="brush-size-value">5</span>
        </div>
        <button id="draw-toggle">${languages[currentLanguage].toggleDrawing}</button>
        <button id="erase-toggle">${languages[currentLanguage].toggleEraser}</button>
        <button id="clear-drawing">${languages[currentLanguage].clearDrawing}</button>
        <div id="language-switcher">
            <label for="language-select">${languages[currentLanguage].language}:</label>
            <select id="language-select">
                <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>English</option>
                <option value="ru" ${currentLanguage === 'ru' ? 'selected' : ''}>Русский</option>
            </select>
        </div>
        <div id="author-signature">${languages[currentLanguage].author}</div>
    `;
    document.body.appendChild(toolDiv);

    // Add minimize/expand button
    const minimizeToggle = document.createElement('button');
    minimizeToggle.id = 'minimize-toggle';
    minimizeToggle.textContent = '←';  // Arrow indicating expand
    document.body.appendChild(minimizeToggle);

    const textarea = document.querySelector('#scribbler-tool textarea');
    const clearNotesButton = document.querySelector('#clear-scribbles');
    const colorPicker = document.querySelector('#color-picker');
    const brushSizeInput = document.querySelector('#brush-size');
    const brushSizeValue = document.querySelector('#brush-size-value');
    const drawToggleButton = document.querySelector('#draw-toggle');
    const eraseToggleButton = document.querySelector('#erase-toggle');
    const clearDrawingButton = document.querySelector('#clear-drawing');
    const languageSelect = document.querySelector('#language-select');
    const authorSignature = document.querySelector('#author-signature');
    const scribblerTool = document.querySelector('#scribbler-tool');

    // Create and style the drawing canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'drawing-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let drawing = false;
    let currentColor = '#000000';
    let brushSize = parseInt(brushSizeInput.value);
    let eraserMode = false;
    let drawingMode = false;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load saved scribbles
    const loadScribbles = () => {
        const savedScribbles = localStorage.getItem('scribbles-' + location.href);
        if (savedScribbles) {
            textarea.value = savedScribbles;
        }
    };

    // Load saved drawing
    const loadDrawing = () => {
        const savedDrawing = localStorage.getItem('drawing-' + location.href);
        if (savedDrawing) {
            const img = new Image();
            img.src = savedDrawing;
            img.onload = () => ctx.drawImage(img, 0, 0);
        }
    };

    loadScribbles();
    loadDrawing();

    // Auto-save function
    const autosave = () => {
        localStorage.setItem('scribbles-' + location.href, textarea.value);
        const dataURL = canvas.toDataURL();
        localStorage.setItem('drawing-' + location.href, dataURL);
    };

    setInterval(autosave, 10000); // Autosave every 10 seconds

    // Clear notes
    clearNotesButton.addEventListener('click', () => {
        textarea.value = '';
        localStorage.removeItem('scribbles-' + location.href);
        alert(languages[currentLanguage].notesCleared);
    });

    // Drawing functionality
    canvas.addEventListener('mousedown', (e) => {
        if (!drawingMode && !eraserMode) return;
        drawing = true;
        ctx.strokeStyle = eraserMode ? '#FFFFFF' : currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (drawing) {
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
        ctx.closePath();
        autosave();  // Save the drawing after each stroke
    });

    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
    });

    brushSizeInput.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
        brushSizeValue.textContent = brushSize;
    });

    drawToggleButton.addEventListener('click', () => {
        drawingMode = !drawingMode;
        eraserMode = false;
        canvas.style.pointerEvents = drawingMode ? 'auto' : 'none';
        alert(drawingMode ? languages[currentLanguage].drawingEnabled : languages[currentLanguage].drawingDisabled);
    });

    eraseToggleButton.addEventListener('click', () => {
        eraserMode = !eraserMode;
        drawingMode = false;
        canvas.style.pointerEvents = eraserMode ? 'auto' : 'none';
        alert(eraserMode ? languages[currentLanguage].eraserEnabled : languages[currentLanguage].eraserDisabled);
    });

    clearDrawingButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        localStorage.removeItem('drawing-' + location.href);
        alert(languages[currentLanguage].drawingCleared);
    });

    // Language switcher
    languageSelect.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        localStorage.setItem('scribbler-language', selectedLanguage);
        location.reload(); // Reload the page to apply language change
    });

    // Author signature
    authorSignature.addEventListener('click', () => {
        window.open('https://www.instagram.com/serg_shap/', '_blank');
    });

    // Minimize and maximize the tool
    minimizeToggle.addEventListener('click', () => {
        scribblerTool.classList.toggle('minimized');
        minimizeToggle.textContent = scribblerTool.classList.contains('minimized') ? '→' : '←';
    });
})();
