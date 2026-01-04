// ==UserScript==
// @name         drawthefish
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  You take full responsibility for your drawings
// @author       Brapson Von Brapovich
// @license CC-BY-4.0
// @match        https://drawafish.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544485/drawthefish.user.js
// @updateURL https://update.greasyfork.org/scripts/544485/drawthefish.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const palette = {
    black: [0, 0, 0],
    red: [255, 0, 0],
    green: [0, 204, 0],
    blue: [0, 0, 255],
    yellow: [255, 255, 0],
    orange: [255, 136, 0],
    white: [255, 255, 255]
  };

  const hexMap = {
    black: "#000000",
    red: "#ff0000",
    green: "#00cc00",
    blue: "#0000ff",
    yellow: "#ffff00",
    orange: "#ff8800",
    white: "#ffffff"
  };

  let forceBW = false;
  let invert = false;
  let pixelSize = 3;
  let imageScale = 1.0;
  let scaleX = 1.0;
  let scaleY = 1.0;
  let offsetXMod = 0;
  let offsetYMod = 0;
  let allowCustomColors = true; // Enabled by default
  let latestImage = null;

  function closestColor(rgb) {
    if (forceBW) {
      const brightness = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      return brightness > 128 ? 'white' : 'black';
    }

    let minDist = Infinity;
    let closest = 'black';
    for (const [name, [r2, g2, b2]] of Object.entries(palette)) {
      const dist = (rgb[0] - r2) ** 2 + (rgb[1] - g2) ** 2 + (rgb[2] - b2) ** 2;
      if (dist < minDist) {
        minDist = dist;
        closest = name;
      }
    }
    return closest;
  }

  function drawPixel(x, y, color, pixelSize, offsetX, offsetY) {
    const canvas = document.getElementById('draw-canvas');
    const ctx = canvas.getContext('2d');

    if (!allowCustomColors) {
      const button = [...document.querySelectorAll("button[title]")].find(b => b.title.toLowerCase() === hexMap[color]);
      if (button) button.click();
      ctx.fillStyle = hexMap[color];
    } else {
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }

    ctx.fillRect(offsetX + x * pixelSize, offsetY + y * pixelSize, pixelSize, pixelSize);
  }

  function drawImage(img) {
    const canvasElement = document.getElementById('draw-canvas');
    const canvasWidth = canvasElement.width;
    const canvasHeight = canvasElement.height;

    const gridWidth = Math.floor((canvasWidth / pixelSize) * scaleX);
    const gridHeight = Math.floor((canvasHeight / pixelSize) * scaleY);
    const pxSize = pixelSize;
    const drawWidth = gridWidth * pxSize;
    const drawHeight = gridHeight * pxSize;
    const offsetX = ((canvasWidth - drawWidth) / 2) + offsetXMod;
    const offsetY = ((canvasHeight - drawHeight) / 2) + offsetYMod;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = gridWidth;
    tempCanvas.height = gridHeight;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0, gridWidth, gridHeight);
    const imgData = ctx.getImageData(0, 0, gridWidth, gridHeight);

    let delay = 0;
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const index = (y * gridWidth + x) * 4;
        let r = imgData.data[index];
        let g = imgData.data[index + 1];
        let b = imgData.data[index + 2];
        let a = imgData.data[index + 3];

        if (a === 0) continue; // skip fully transparent pixels

        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }

        let color = closestColor([r, g, b]);
        if (allowCustomColors) color = [r, g, b];

        if (color !== 'white' && (!Array.isArray(color) || (color[0] + color[1] + color[2]) < 765)) {
          setTimeout(() => drawPixel(x, y, color, pxSize, offsetX, offsetY), delay);
          delay += 2;
        }
      }
    }
  }

  function processImage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        latestImage = img;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function createUI() {
    const ui = document.createElement('div');
    ui.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      color: black;
      padding: 12px;
      z-index: 999999;
      font-size: 14px;
      border: 2px solid #000;
      border-radius: 8px;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.2);
    `;
    ui.innerHTML = `
      <strong>Upload Image to Draw</strong><br>
      <input type="file" id="fish-upload"><br>
      <label><input type="checkbox" id="bw-toggle"> Black & White only</label><br>
      <label><input type="checkbox" id="invert-toggle"> Invert Colors</label><br>
      <label><input type="checkbox" id="custom-toggle"> Allow Custom Colors (Experimental)</label><br>
      <label>Pixel Size: <input type="range" id="pixel-slider" min="1" max="10" value="3"></label><br>
      <label>Image Scale: <input type="range" id="scale-slider" min="0.1" max="3.0" step="0.05" value="1.0"> <span id="scale-label">100%</span></label><br>
      <label>Scale X: <input type="range" id="scale-x" min="0.1" max="3.0" step="0.05" value="1.0"> <span id="label-x">100%</span></label><br>
      <label>Scale Y: <input type="range" id="scale-y" min="0.1" max="3.0" step="0.05" value="1.0"> <span id="label-y">100%</span></label><br>
      <label>Offset X: <input type="range" id="xoffset-slider" min="-200" max="200" value="0"></label><br>
      <label>Offset Y: <input type="range" id="yoffset-slider" min="-120" max="120" value="0"></label><br>
      <button id="redraw-btn">Draw / Redraw</button>
    `;

    document.body.appendChild(ui);

    document.getElementById('fish-upload').addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) processImage(file);
    });

    document.getElementById('bw-toggle').addEventListener('change', e => {
      forceBW = e.target.checked;
    });

    document.getElementById('invert-toggle').addEventListener('change', e => {
      invert = e.target.checked;
    });

    document.getElementById('custom-toggle').addEventListener('change', e => {
      allowCustomColors = e.target.checked;
    });

    document.getElementById('custom-toggle').checked = true;

    document.getElementById('pixel-slider').addEventListener('input', e => {
      pixelSize = parseInt(e.target.value);
    });

    document.getElementById('scale-slider').addEventListener('input', e => {
      imageScale = parseFloat(e.target.value);
      document.getElementById('scale-label').textContent = Math.round(imageScale * 100) + '%';
      scaleX = scaleY = imageScale;
      document.getElementById('scale-x').value = imageScale;
      document.getElementById('scale-y').value = imageScale;
      document.getElementById('label-x').textContent = document.getElementById('label-y').textContent = Math.round(imageScale * 100) + '%';
    });

    document.getElementById('scale-x').addEventListener('input', e => {
      scaleX = parseFloat(e.target.value);
      document.getElementById('label-x').textContent = Math.round(scaleX * 100) + '%';
    });

    document.getElementById('scale-y').addEventListener('input', e => {
      scaleY = parseFloat(e.target.value);
      document.getElementById('label-y').textContent = Math.round(scaleY * 100) + '%';
    });

    document.getElementById('xoffset-slider').addEventListener('input', e => {
      offsetXMod = parseInt(e.target.value);
    });

    document.getElementById('yoffset-slider').addEventListener('input', e => {
      offsetYMod = parseInt(e.target.value);
    });

    document.getElementById('redraw-btn').addEventListener('click', () => {
      if (latestImage) drawImage(latestImage);
    });
  }

  window.addEventListener('load', () => {
    setTimeout(createUI, 2000);
  });
})();
