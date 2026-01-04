// ==UserScript==
// @name         Sploop Crosshair Mod
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Custom crosshairs for Sploop.io
// @author       hooder
// @match        https://sploop.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533257/Sploop%20Crosshair%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/533257/Sploop%20Crosshair%20Mod.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    * {
      font-family: 'Segoe UI', sans-serif;
    }
    #hookx-ui {
      position: fixed;
      top: 50px;
      left: 50px;
      width: 250px;
      background: linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(40, 40, 40, 0.95));
      border: 1px solid #ff00ff;
      border-radius: 8px;
      color: #ffffff;
      z-index: 100000;
      box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
      padding: 10px;
      user-select: none;
      transition: opacity 0.3s;
    }
    #hookx-ui.hidden {
      display: none;
    }
    .hookx-header {
      font-size: 16px;
      font-weight: bold;
      color: #00ffff;
      margin-bottom: 10px;
      text-align: center;
    }
    .hookx-toggle {
      margin: 5px 0;
      display: flex;
      align-items: center;
    }
    .hookx-toggle label {
      margin-left: 5px;
      font-size: 12px;
    }
    .hookx-button {
      margin: 5px 0;
      width: 100%;
      padding: 5px;
      background: #1a1a1a;
      color: #ffffff;
      border: 1px solid #00ffff;
      border-radius: 4px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
    }
    .hookx-button.active {
      background: #ff00ff;
    }
    .hookx-select, .hookx-color, .hookx-range {
      margin: 5px 0;
      width: 100%;
      padding: 5px;
      background: #1a1a1a;
      color: #ffffff;
      border: 1px solid #00ffff;
      border-radius: 4px;
      font-size: 12px;
    }
    .hookx-label {
      font-size: 12px;
      color: #00ffff;
      margin: 5px 0 2px;
    }
    .hookx-range {
      -webkit-appearance: none;
      appearance: none;
      height: 5px;
      background: #333;
      outline: none;
    }
    .hookx-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 15px;
      height: 15px;
      background: #ff00ff;
      cursor: pointer;
      border-radius: 50%;
    }
    .crosshair {
      position: fixed;
      z-index: 100001;
      pointer-events: none;
      display: none;
      transform: translate(-50%, -50%);
      will-change: transform;
    }
    .crosshair.dot {
      border-radius: 50%;
    }
    .crosshair.cross {
      width: 20px;
      height: 20px;
    }
    .crosshair.cross::before, .crosshair.cross::after {
      content: '';
      position: absolute;
      background-color: currentColor;
    }
    .crosshair.cross::before {
      top: 50%;
      left: 0;
      width: 100%;
      height: 2px;
      transform: translateY(-50%);
    }
    .crosshair.cross::after {
      top: 0;
      left: 50%;
      width: 2px;
      height: 100%;
      transform: translateX(-50%);
    }
    .crosshair.spike {
      background-image: url("https://sploop.io/img/entity/hard_spike.png");
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
    .crosshair.square {
      border: 2px solid;
    }
    .crosshair.triangle {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 18px solid currentColor;
    }
    .crosshair.xcross {
      width: 20px;
      height: 20px;
    }
    .crosshair.xcross::before, .crosshair.xcross::after {
      content: '';
      position: absolute;
      width: 2px;
      height: 100%;
      background-color: currentColor;
      left: 50%;
      top: 0;
      transform-origin: center;
    }
    .crosshair.xcross::before {
      transform: rotate(45deg);
    }
    .crosshair.xcross::after {
      transform: rotate(-45deg);
    }
    body.hide-cursor * {
      cursor: none !important;
    }
    #watermark {
      position: fixed;
      bottom: 100px;
      right: 10px;
      color: rgba(255, 255, 255, 0.2);
      font-size: 14px;
      font-family: 'Segoe UI', sans-serif;
      pointer-events: none;
      z-index: 100001;
      user-select: none;
    }
  `;
  document.head.appendChild(style);
  const ui = document.createElement('div');
  ui.id = 'hookx-ui';
  ui.innerHTML = `
    <div class="hookx-header">Crosshair Gui</div>
    <div class="hookx-toggle">
      <input type="checkbox" id="toggleCrosshair">
      <label for="toggleCrosshair">Enable Crosshair</label>
    </div>
    <div class="hookx-button" id="moveGUI">Move GUI</div>
    <select id="crosshairStyle" class="hookx-select">
      <option value="dot">Dot</option>
      <option value="cross">Cross</option>
      <option value="spike">Spike</option>
      <option value="square">Square</option>
      <option value="triangle">Triangle</option>
      <option value="xcross">X Cross</option>
    </select>
    <input type="color" id="crosshairColor" class="hookx-color" value="#ff0000">
    <div class="hookx-label">Crosshair Size (5-50px)</div>
    <input type="range" id="crosshairSize" class="hookx-range" min="5" max="50" value="12">
    <div class="hookx-label">Crosshair Opacity (0.1-1)</div>
    <input type="range" id="crosshairOpacity" class="hookx-range" min="0.1" max="1" step="0.1" value="1">
    <div class="hookx-label">Crosshair Offset (0-20px)</div>
    <input type="range" id="crosshairOffset" class="hookx-range" min="0" max="20" value="0">
  `;
  document.body.appendChild(ui);
  const watermark = document.createElement('div');
  watermark.id = 'watermark';
  watermark.textContent = 'hooder';
  document.body.appendChild(watermark);
  let crosshair = document.createElement('div');
  crosshair.className = 'crosshair dot';
  document.body.appendChild(crosshair);
  const toggleCrosshair = document.getElementById('toggleCrosshair');
  const moveGUIButton = document.getElementById('moveGUI');
  const styleSelect = document.getElementById('crosshairStyle');
  const colorPicker = document.getElementById('crosshairColor');
  const sizeSlider = document.getElementById('crosshairSize');
  const opacitySlider = document.getElementById('crosshairOpacity');
  const offsetSlider = document.getElementById('crosshairOffset');
  let isDragging = false;
  let dragEnabled = false;
  let currentX = 50;
  let currentY = 50;
  let initialX;
  let initialY;
  function setCrosshairStyle(styleName) {
    const newCrosshair = document.createElement('div');
    newCrosshair.className = `crosshair ${styleName}`;
    const size = parseInt(sizeSlider.value);
    if (styleName === 'triangle') {
      newCrosshair.style.borderLeftWidth = `${size / 2}px`;
      newCrosshair.style.borderRightWidth = `${size / 2}px`;
      newCrosshair.style.borderBottomWidth = `${size * 0.9}px`;
      newCrosshair.style.borderLeftColor = 'transparent';
      newCrosshair.style.borderRightColor = 'transparent';
      newCrosshair.style.borderBottomColor = colorPicker.value;
    } else {
      newCrosshair.style.width = `${size}px`;
      newCrosshair.style.height = `${size}px`;
    }
    document.body.replaceChild(newCrosshair, crosshair);
    crosshair = newCrosshair;
    updateColor();
    if (toggleCrosshair.checked) {
      crosshair.style.display = 'block';
    }
  }
  function updateColor() {
    const color = colorPicker.value;
    crosshair.style.backgroundColor = '';
    crosshair.style.borderColor = '';
    crosshair.style.color = color;
    crosshair.style.opacity = parseFloat(opacitySlider.value);
    if (crosshair.classList.contains('dot')) {
      crosshair.style.backgroundColor = color;
    } else if (crosshair.classList.contains('cross') || crosshair.classList.contains('xcross')) {
      crosshair.style.background = 'transparent';
    } else if (crosshair.classList.contains('square')) {
      crosshair.style.borderColor = color;
      crosshair.style.background = 'transparent';
    } else if (crosshair.classList.contains('triangle')) {
      crosshair.style.borderBottomColor = color;
    }
  }
  function moveCrosshair(e) {
    const offset = parseInt(offsetSlider.value);
    crosshair.style.left = `${e.clientX + offset}px`;
    crosshair.style.top = `${e.clientY + offset}px`;
  }
  toggleCrosshair.addEventListener('change', () => {
    if (toggleCrosshair.checked) {
      crosshair.style.display = 'block';
      document.body.classList.add('hide-cursor');
      document.addEventListener('mousemove', moveCrosshair);
    } else {
      crosshair.style.display = 'none';
      document.body.classList.remove('hide-cursor');
      document.removeEventListener('mousemove', moveCrosshair);
    }
  });
  styleSelect.addEventListener('change', () => {
    setCrosshairStyle(styleSelect.value);
  });
  colorPicker.addEventListener('input', updateColor);
  sizeSlider.addEventListener('input', () => {
    setCrosshairStyle(styleSelect.value);
  });
  opacitySlider.addEventListener('input', updateColor);
  offsetSlider.addEventListener('input', () => {
    if (toggleCrosshair.checked) {
      moveCrosshair({ clientX: crosshair.offsetLeft, clientY: crosshair.offsetTop });
    }
  });
  moveGUIButton.addEventListener('click', () => {
    dragEnabled = !dragEnabled;
    moveGUIButton.classList.toggle('active', dragEnabled);
  });
  ui.addEventListener('mousedown', (e) => {
    if (dragEnabled) {
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      isDragging = true;
    }
  });
  document.addEventListener('mousemove', (e) => {
    if (isDragging && dragEnabled) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      ui.style.left = `${currentX}px`;
      ui.style.top = `${currentY}px`;
    }
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift' && e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
      ui.classList.toggle('hidden');
    }
  });
  updateColor();
})();