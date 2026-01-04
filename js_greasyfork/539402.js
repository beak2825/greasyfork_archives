// ==UserScript==
// @name         Shell Shockers Crosshair Mod + Toggle Menu (H key)
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Custom crosshair with GUI and press H to hide/show menu in Shell Shockers
// @author       Ade
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539402/Shell%20Shockers%20Crosshair%20Mod%20%2B%20Toggle%20Menu%20%28H%20key%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539402/Shell%20Shockers%20Crosshair%20Mod%20%2B%20Toggle%20Menu%20%28H%20key%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // === CONFIG ===
  const config = {
    color: '#00ffff',
    thickness: 3,
    size: 20,
    gap: 10,
    dot: true,
    dotSize: 6,
    outline: true,
    outlineColor: '#000000'
  };

  // === CREATE CROSSHAIR CANVAS ===
  const crosshair = document.createElement('canvas');
  crosshair.style.position = 'fixed';
  crosshair.style.top = '50%';
  crosshair.style.left = '50%';
  crosshair.style.transform = 'translate(-50%, -50%)';
  crosshair.style.pointerEvents = 'none';
  crosshair.style.zIndex = '9999999';
  crosshair.width = 100;
  crosshair.height = 100;
  document.body.appendChild(crosshair);

  const ctx = crosshair.getContext('2d');

  // === DRAW CROSSHAIR FUNCTION ===
  function drawCrosshair() {
    ctx.clearRect(0, 0, crosshair.width, crosshair.height);

    ctx.lineWidth = config.thickness;
    ctx.strokeStyle = config.color;
    ctx.fillStyle = config.color;

    if(config.outline) {
      ctx.shadowColor = config.outlineColor;
      ctx.shadowBlur = 2;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    const cx = crosshair.width / 2;
    const cy = crosshair.height / 2;

    // Lines
    ctx.beginPath();
    ctx.moveTo(cx, cy - config.gap - config.size);
    ctx.lineTo(cx, cy - config.gap);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy + config.gap);
    ctx.lineTo(cx, cy + config.gap + config.size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - config.gap - config.size, cy);
    ctx.lineTo(cx - config.gap, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + config.gap, cy);
    ctx.lineTo(cx + config.gap + config.size, cy);
    ctx.stroke();

    // Dot
    if (config.dot) {
      ctx.beginPath();
      ctx.arc(cx, cy, config.dotSize, 0, Math.PI * 2);
      if(config.outline) {
        ctx.shadowColor = config.outlineColor;
        ctx.shadowBlur = 4;
      }
      ctx.fill();
    }
  }

  drawCrosshair();

  // === CREATE GUI ===
  const gui = document.createElement('div');
  gui.id = 'crosshair-gui';
  gui.style = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background: #111;
    padding: 10px;
    border: 2px solid #0ff;
    border-radius: 10px;
    color: #fff;
    font-family: sans-serif;
    max-width: 220px;
  `;
  gui.innerHTML = `
    <div><b>[H] to hide/show menu</b></div>
    <div><label>Color: <input type="color" id="x-color" value="${config.color}"></label></div>
    <div><label>Thickness: <input type="range" id="x-thickness" min="1" max="10" value="${config.thickness}"></label></div>
    <div><label>Size: <input type="range" id="x-size" min="2" max="50" value="${config.size}"></label></div>
    <div><label>Gap: <input type="range" id="x-gap" min="1" max="30" value="${config.gap}"></label></div>
    <div><label>Dot: <input type="checkbox" id="x-dot" ${config.dot ? 'checked' : ''}></label></div>
    <div><label>Dot Size: <input type="range" id="x-dotsize" min="1" max="10" value="${config.dotSize}"></label></div>
    <div><label>Outline: <input type="checkbox" id="x-outline" ${config.outline ? 'checked' : ''}></label></div>
    <div><label>Outline Color: <input type="color" id="x-outlinecolor" value="${config.outlineColor}"></label></div>
  `;
  document.body.appendChild(gui);

  // === UPDATE CONFIG AND REDRAW ON GUI INPUTS CHANGE ===
  function updateConfig() {
    config.color = document.getElementById('x-color').value;
    config.thickness = parseInt(document.getElementById('x-thickness').value);
    config.size = parseInt(document.getElementById('x-size').value);
    config.gap = parseInt(document.getElementById('x-gap').value);
    config.dot = document.getElementById('x-dot').checked;
    config.dotSize = parseInt(document.getElementById('x-dotsize').value);
    config.outline = document.getElementById('x-outline').checked;
    config.outlineColor = document.getElementById('x-outlinecolor').value;
    drawCrosshair();
  }

  gui.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateConfig);
  });

  // === TOGGLE GUI WITH H KEY ===
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'h') {
      gui.style.display = (gui.style.display === 'none') ? 'block' : 'none';
    }
  });

})();
