// ==UserScript==
// @name     r/"What is My Cookie Cutter" Drawing Software!
// @namespace https://greasyfork.org/en/scripts/486930-r-what-is-my-cookie-cutter-drawing-software/code
// @version   1.0
// @description Yes! Allows for quick drawing on r/whatismycookiecuutter ! There isn't even a need to exit Reddit! So much easier than having to load an entire drawing program, or trying to download it to your computer!
// @author    Heptatron
// @license MIT
// @match     https://www.reddit.com/*
// @match     https://i.redd.it/*
// @grant    GM_setValue
// @grant    GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/486930/r%22What%20is%20My%20Cookie%20Cutter%22%20Drawing%20Software%21.user.js
// @updateURL https://update.greasyfork.org/scripts/486930/r%22What%20is%20My%20Cookie%20Cutter%22%20Drawing%20Software%21.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  let canvas, ctx;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let history = [];
  let historyIndex = -1;
  let showControls = false;
  let colorHistory = [];
 
  // Default settings
  let settings = {
    color: 'black',
    lineWidth: 2,
    eraser: false,
    circleDistance: 2,
    opacity: 1,
    softness: 5,
    shadow: false,
    touchscreenMode: false
  };
 
  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none'; // To allow clicking through canvas
    canvas.style.zIndex = '9999'; // Canvas is on top
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
  }
 
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    overlay.style.zIndex = '9998';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
  }
 
  function showOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
  }
 
  function hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
  }
 
  function startDrawing(e) {
    if ((settings.touchscreenMode || e.ctrlKey) && (e.button === 0 || e.button === 2)) {
      isDrawing = true;
      [lastX, lastY] = [e.clientX, e.clientY];
      if (!settings.eraser) {
        addToHistory();
      }
    }
  }
 
  function draw(e) {
    if (!isDrawing) return;
    if (settings.eraser) {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
    }
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
 
    for (let i = 0; i < distance; i += settings.circleDistance) {
        const x = lastX + Math.cos(angle) * i;
        const y = lastY + Math.sin(angle) * i;
        ctx.beginPath();
        ctx.arc(x, y, settings.lineWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = settings.color;
        ctx.globalAlpha = settings.opacity;
 
        if (settings.shadow) {
            ctx.shadowColor = settings.color;
            ctx.shadowBlur = settings.lineWidth / 2;
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }
 
        ctx.fill();
    }
 
    [lastX, lastY] = [e.clientX, e.clientY];
  }
 
  function stopDrawing() {
    isDrawing = false;
  }
 
  function init() {
    createCanvas();
    createOverlay();
    document.addEventListener('mousedown', startDrawing);
    document.addEventListener('mousemove', draw);
    document.addEventListener('mouseup', stopDrawing);
    createSettingsMenu();
    createButtons();
    createDraggableCircle(); // Add draggable circle
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', toggleControls);
    document.addEventListener('keyup', toggleControls);
    loadSettings();
    loadColorHistory();
  }
 
  function createSettingsMenu() {
    const settingsMenu = document.createElement('div');
    settingsMenu.id = 'settingsMenu';
    settingsMenu.style.display = 'none';
    settingsMenu.style.position = 'fixed';
    settingsMenu.style.top = '10px';
    settingsMenu.style.left = '10px';
    settingsMenu.style.backgroundColor = 'rgba(77, 77, 77, 0.7)';
    settingsMenu.style.padding = '10px';
    settingsMenu.style.borderRadius = '5px';
    settingsMenu.style.zIndex = '10000';
    settingsMenu.innerHTML = `
      <h3>Settings</h3>
      <label for="color">Color:</label>
      <input type="color" id="color" value="${settings.color}">
      <button id="saveColor">Save Color</button>
      <br>
      <div id="colorHistoryContainer"></div>
      <button id="clearColorHistory">Clear Color History</button>
      <br>
      <label for="lineWidth">Line Width:</label>
      <input type="range" id="lineWidth" min="0.5" max="100" step="0.5" value="${settings.lineWidth}">
      <br>
      <label for="circleDistance">Circle Distance:</label>
      <input type="number" id="circleDistance" min="1" value="${settings.circleDistance}">
      <br>
      <label for="eraser">Eraser:</label>
      <input type="checkbox" id="eraser">
      <br>
      <label for="opacity">Opacity:</label>
      <input type="range" id="opacity" min="0" max=".5" step="0.01" value="${settings.opacity}">
      <br>
      <label for="softness">Softness:</label>
      <input type="number" id="softness" min="1" value="${settings.softness}">
      <br>
      <label for="shadow">Shadow:</label>
      <input type="checkbox" id="shadow">
      <br>
      <label for="touchscreenMode">Touchscreen Mode:</label> <!-- Updated setting name -->
      <input type="checkbox" id="touchscreenMode"> <!-- Updated setting name -->
    `;
    document.body.appendChild(settingsMenu);
 
    const colorInput = document.getElementById('color');
    colorInput.addEventListener('input', function() {
      settings.color = colorInput.value;
      GM_setValue('color', settings.color);
    });
 
    const lineWidthInput = document.getElementById('lineWidth');
    lineWidthInput.addEventListener('input', function() {
      settings.lineWidth = parseFloat(lineWidthInput.value);
      GM_setValue('lineWidth', settings.lineWidth);
    });
 
    const circleDistanceInput = document.getElementById('circleDistance');
    circleDistanceInput.addEventListener('input', function() {
      settings.circleDistance = parseInt(circleDistanceInput.value);
      GM_setValue('circleDistance', settings.circleDistance);
    });
 
    const eraserCheckbox = document.getElementById('eraser');
    eraserCheckbox.checked = settings.eraser;
    eraserCheckbox.addEventListener('change', function() {
      settings.eraser = eraserCheckbox.checked;
      GM_setValue('eraser', settings.eraser);
    });
 
    const opacityInput = document.getElementById('opacity');
    opacityInput.addEventListener('input', function() {
      settings.opacity = parseFloat(opacityInput.value);
      GM_setValue('opacity', settings.opacity);
      ctx.globalAlpha = settings.opacity;
    });
 
    const softnessInput = document.getElementById('softness');
    softnessInput.addEventListener('input', function() {
      settings.softness = parseInt(softnessInput.value);
      GM_setValue('softness', settings.softness);
    });
 
    const shadowCheckbox = document.getElementById('shadow');
    shadowCheckbox.checked = settings.shadow;
    shadowCheckbox.addEventListener('change', function() {
      settings.shadow = shadowCheckbox.checked;
      GM_setValue('shadow', settings.shadow);
    });
 
    const touchscreenModeCheckbox = document.getElementById('touchscreenMode');
    touchscreenModeCheckbox.checked = settings.touchscreenMode;
    touchscreenModeCheckbox.addEventListener('change', function() {
      settings.touchscreenMode = touchscreenModeCheckbox.checked;
      GM_setValue('touchscreenMode', settings.touchscreenMode);
    });
 
    const saveColorButton = document.getElementById('saveColor');
    saveColorButton.addEventListener('click', saveColor);
 
    const clearColorHistoryButton = document.getElementById('clearColorHistory');
    clearColorHistoryButton.addEventListener('click', clearColorHistory);
  }
 
  function createButtons() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'buttonsContainer';
    buttonsContainer.style.display = 'none';
    buttonsContainer.style.position = 'fixed';
    buttonsContainer.style.top = '10px';
    buttonsContainer.style.right = '10px';
    buttonsContainer.style.zIndex = '10000';
 
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo (Ctrl + Z)';
    undoButton.addEventListener('click', undo);
    buttonsContainer.appendChild(undoButton);
 
    const redoButton = document.createElement('button');
    redoButton.textContent = 'Redo (Ctrl + Shift + Z)';
    redoButton.addEventListener('click', redo);
    buttonsContainer.appendChild(redoButton);
 
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear All';
    clearButton.addEventListener('click', clearCanvas);
    buttonsContainer.appendChild(clearButton);
 
    document.body.appendChild(buttonsContainer);
  }
 
  function createDraggableCircle() {
    const circle = document.createElement('div');
    circle.id = 'draggableCircle';
    circle.style.position = 'fixed';
    circle.style.width = '20px';
    circle.style.height = '20px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = '#888';
    circle.style.cursor = 'move';
    circle.style.zIndex = '10000';
    circle.style.left = '10px';
    circle.style.top = '10px';
    document.body.appendChild(circle);
 
    let isDragging = false;
    let offsetX, offsetY;
 
    circle.addEventListener('mousedown', function(event) {
      if (settings.touchscreenMode) {
        isDrawing = false;
      }
      isDragging = true;
      offsetX = event.clientX - circle.getBoundingClientRect().left;
      offsetY = event.clientY - circle.getBoundingClientRect().top;
    });
 
    document.addEventListener('mousemove', function(event) {
      if (isDragging) {
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;
        circle.style.left = newX + 'px';
        circle.style.top = newY + 'px';
      }
    });
 
    document.addEventListener('mouseup', function() {
      isDragging = false;
      if (settings.touchscreenMode) {
        isDrawing = false;
      }
    });
 
    circle.addEventListener('click', function() {
      toggleControlsWithTouchscreenMode();
    });
  }
 
  function toggleControlsWithTouchscreenMode() {
    const settingsMenu = document.getElementById('settingsMenu');
    const buttonsContainer = document.getElementById('buttonsContainer');
    if (!showControls) {
      settingsMenu.style.display = 'block';
      buttonsContainer.style.display = 'block';
      showControls = true;
      showOverlay();
      createColorHistoryButtons();
    } else {
      settingsMenu.style.display = 'none';
      buttonsContainer.style.display = 'none';
      showControls = false;
      hideOverlay();
      clearColorHistoryButtons();
    }
  }
 
  function handleKeyPress(e) {
    if (e.ctrlKey && e.key === 'z') {
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  }
 
  function addToHistory() {
    if (historyIndex !== history.length - 1) {
      history = history.slice(0, historyIndex + 1);
    }
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    history.push(imageData);
    historyIndex++;
  }
 
  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      ctx.putImageData(history[historyIndex], 0, 0);
    }
  }
 
  function redo() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      ctx.putImageData(history[historyIndex], 0, 0);
    }
  }
 
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history = [];
    historyIndex = -1;
  }
 
  function loadSettings() {
    const savedColor = GM_getValue('color', settings.color);
    settings.color = savedColor;
    document.getElementById('color').value = savedColor;
 
    const savedLineWidth = parseFloat(GM_getValue('lineWidth', settings.lineWidth));
    settings.lineWidth = savedLineWidth;
    document.getElementById('lineWidth').value = savedLineWidth;
 
    const savedCircleDistance = parseInt(GM_getValue('circleDistance', settings.circleDistance));
    settings.circleDistance = savedCircleDistance;
    document.getElementById('circleDistance').value = savedCircleDistance;
 
    const savedEraser = GM_getValue('eraser', settings.eraser);
    settings.eraser = savedEraser;
    document.getElementById('eraser').checked = savedEraser;
 
    const savedOpacity = parseFloat(GM_getValue('opacity', settings.opacity));
    settings.opacity = savedOpacity;
    document.getElementById('opacity').value = savedOpacity;
 
    const savedSoftness = parseInt(GM_getValue('softness', settings.softness));
    settings.softness = savedSoftness;
    document.getElementById('softness').value = savedSoftness;
 
    const savedShadow = GM_getValue('shadow', settings.shadow);
    settings.shadow = savedShadow;
    document.getElementById('shadow').checked = savedShadow;
 
    const savedTouchscreenMode = GM_getValue('touchscreenMode', settings.touchscreenMode);
    settings.touchscreenMode = savedTouchscreenMode;
    document.getElementById('touchscreenMode').checked = savedTouchscreenMode;
  }
 
  function toggleControls(e) {
    if (e.ctrlKey && e.altKey) {
      toggleControlsWithTouchscreenMode();
    }
  }
 
  function createColorHistoryButtons() {
    const colorHistoryContainer = document.getElementById('colorHistoryContainer');
    colorHistoryContainer.innerHTML = '';
    let row;
    colorHistory.forEach((color, index) => {
      if (index % 10 === 0) {
        row = document.createElement('div');
        row.style.display = 'flex';
        row.style.flexWrap = 'wrap';
        colorHistoryContainer.appendChild(row);
      }
      const colorButton = document.createElement('button');
      colorButton.textContent = '';
      colorButton.style.width = '20px';
      colorButton.style.height = '20px';
      colorButton.style.backgroundColor = color;
      colorButton.style.marginRight = '5px';
      colorButton.style.marginBottom = '5px';
      colorButton.addEventListener('click', () => {
        settings.color = color;
        document.getElementById('color').value = color;
        GM_setValue('color', settings.color);
      });
      row.appendChild(colorButton);
    });
  }
 
  function clearColorHistoryButtons() {
    const colorHistoryContainer = document.getElementById('colorHistoryContainer');
    colorHistoryContainer.innerHTML = '';
  }
 
  function saveColor() {
    const colorInput = document.getElementById('color');
    const color = colorInput.value;
    if (!colorHistory.includes(color)) {
      colorHistory.push(color);
      GM_setValue('colorHistory', JSON.stringify(colorHistory));
      createColorHistoryButtons();
    }
  }
 
  function clearColorHistory() {
    colorHistory = [];
    GM_setValue('colorHistory', JSON.stringify(colorHistory));
    clearColorHistoryButtons();
  }
 
  function loadColorHistory() {
    const savedColorHistory = JSON.parse(GM_getValue('colorHistory', '[]'));
    colorHistory = savedColorHistory;
    createColorHistoryButtons();
  }
 
  init();
 
})();