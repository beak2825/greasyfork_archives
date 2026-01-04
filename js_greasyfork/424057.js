// ==UserScript==
// @name        Gradient Tool
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.0
// @author      Bell
// @license     MIT
// @copyright   2020, Faux (https://greasyfork.org/users/281093)
// @description Ctrl + Click and drag to draw a gradient, click a color to set it as the first and right click a color to set it as the second.
// @downloadURL https://update.greasyfork.org/scripts/424057/Gradient%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/424057/Gradient%20Tool.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const canvas = document.querySelector('#canvas');
const colorsDiv = document.querySelector('#gameToolsColors');
const lineCanvas = document.createElement('canvas');
const lineCtx = lineCanvas.getContext('2d');
const sizeInput = document.querySelector("#gameToolsColorPreview");
lineCanvas.style.position = 'absolute';
lineCanvas.style.cursor = 'crosshair';
lineCanvas.style.width = '100%';
lineCanvas.style.display = 'none';
lineCanvas.style.userSelect = 'none';
lineCanvas.style.zIndex = '2';
lineCanvas.style.filter = 'opacity(0.7)';
lineCanvas.oncontextmenu = () => { return false; };
[lineCanvas.width, lineCanvas.height] = [canvas.width, canvas.height];
canvas.parentElement.insertBefore(lineCanvas, canvas);

lineCanvas.clear = () => {
  lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
};

canvas.save = () => {
  canvas.dispatchEvent(createMouseEvent('pointerup', { x: 0, y: 0 }, true));
};

let origin = {};
let realOrigin = {};
let previewPos = {};
let realPos = {};
let canvasHidden = true;
let drawingLine = false;
let activeColor = [0, 0, 0];
let color1 = [0, 200, 0];
let color2 = [250, 0, 0];
let drawingGradient = false;
let queueKeyUp = false;

document.addEventListener('keydown', (e) => {
  if (!isDrawing()) return;
  if (e.code === 'ControlLeft' && canvasHidden) {
    lineCanvas.style.display = '';
    disableScroll();
    canvasHidden = false;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Digit1' && e.shiftKey) color1 = activeColor;
  else if (e.code === 'Digit2' && e.shiftKey) color2 = activeColor;
  if (e.code === 'ControlLeft' && !canvasHidden) {
    if (drawingGradient) {
      queueKeyUp = true;
      return;
    }
    onKeyUp();
  }
});

function onKeyUp() {
  lineCanvas.style.display = 'none';
  canvasHidden = true;
  enableScroll();
  resetLineCanvas();
  document.removeEventListener('pointermove', savePos);
  document.removeEventListener('pointerup', pointerUpDraw);
}

function savePos(e) {
  previewPos = getPos(e);
  realPos = getRealPos(e);

  if (canvasHidden || !drawingLine) return;
  lineCanvas.clear();
  drawPreviewLine(previewPos);
  e.preventDefault();
}

colorsDiv.addEventListener('pointerdown', (e) => {
  if (!e.target.classList.contains('gameToolsColor') || e.button === 2) return;

  const colorStr = e.target.style.background;
  const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
  activeColor = match.slice(1, 4).map(str => parseInt(str));
  color1 = activeColor;
});

colorsDiv.addEventListener('contextmenu', (e) => {
  if (!e.target.classList.contains('gameToolsColor')) return;
  e.preventDefault();
  const colorStr = e.target.style.background;
  const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
  color2 = match.slice(1, 4).map(str => parseInt(str));
});

lineCanvas.addEventListener('pointerdown', (e) => {
  if (drawingGradient) return;
  origin = getPos(e);
  realOrigin = getRealPos(e);
  drawingLine = true;
  document.addEventListener('pointerup', pointerUpDraw);
  document.addEventListener('pointermove', savePos);
});

function pointerUpDraw(e) {
  document.removeEventListener('pointermove', savePos);
  document.removeEventListener('pointerup', pointerUpDraw);
  drawGradient(realOrigin.x, realOrigin.y, realPos.x, realPos.y);
  previewPos = getPos(e);
  realPos = getRealPos(e);
  resetLineCanvas();
}

async function drawGradient(x1, y1, x2, y2) {
  drawingGradient = true;
  const lab1 = rgb2lab(color1);
  const lab2 = rgb2lab(color2);
  const scale = canvas.getBoundingClientRect().width / lineCanvas.width;
  const offset = (parseInt(sizeInput.value) / 2) * scale;
  
  const max = Math.round((y2 - y1) / offset) * 1.6;
  
  for (let s = 0; s <= max; s += 1) {
    const t = mapRange(s, 0, max, 0, 1);
    const y = lerp(y1 + offset, y2 - offset, t);
    const color = lerpColors(lab1, lab2, t);
    
    changeColor(lab2rgb(color));
    drawLine(x1 + offset, y, x2 - offset, y);
    await delay(10);
  }
  
  canvas.save();
  drawingGradient = false;
  if (queueKeyUp) {
    onKeyUp();
    queueKeyUp = false;
  }
}

function mapRange(value, istart, istop, ostart, ostop) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(time), time);
  });
}

function changeColor(rgbArray) {
  const colorElement = document.querySelector('.gameToolsColor');
  const prevColor = colorElement.style.background;
  
  colorElement.style.background = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
  colorElement.dispatchEvent(new Event('pointerdown'));
  colorElement.style.background = prevColor;
}

function resetLineCanvas() {
  drawingLine = false;
  lineCanvas.clear();
}

function getPos(event) {
  const canvasRect = canvas.getBoundingClientRect();
  const canvasScale = canvas.width / canvasRect.width;
  return {
    x: (event.clientX - canvasRect.left) * canvasScale,
    y: (event.clientY - canvasRect.top) * canvasScale
  };
}

function getRealPos(event) {
  return {
    x: event.clientX,
    y: event.clientY
  };
}

function drawPreviewLine(pos) {
  const offset = parseInt(sizeInput.value) / 2;
  roundRect(
    lineCtx,
    origin.x,
    origin.y,
    pos.x - origin.x,
    pos.y - origin.y,
    offset,
    true,
    false,
    [
      color1,
      color2
    ]
  );
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke, gradientColors) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();

  if (gradientColors) {
    const gradient = ctx.createLinearGradient(0, y, 0, height + y);
    const _color1 = `rgb(${gradientColors[0][0]}, ${gradientColors[0][1]}, ${gradientColors[0][2]}`;
    const _color2 = `rgb(${gradientColors[1][0]}, ${gradientColors[1][1]}, ${gradientColors[1][2]}`;
    gradient.addColorStop('0', _color1);
    gradient.addColorStop('1', _color2);
    ctx.strokeStyle = gradient;
    ctx.fillStyle = gradient;
  }

  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = 5;
    ctx.stroke();
  }
}

function drawLine(x1, y1, x2, y2) {
  const coords = { x: x1, y: y1 };
  const newCoords = { x: x2, y: y2 };

  canvas.dispatchEvent(createMouseEvent('pointerdown', coords));
  canvas.dispatchEvent(createMouseEvent('pointermove', newCoords));
}

function createMouseEvent(name, pos, bubbles = false) {
  return new MouseEvent(name, {
    bubbles: bubbles,
    clientX: pos.x,
    clientY: pos.y,
    button: 0
  });
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColors(lab1, lab2, t) {
  return [
    lab1[0] + (lab2[0] - lab1[0]) * t,
    lab1[1] + (lab2[1] - lab1[1]) * t,
    lab1[2] + (lab2[2] - lab1[2]) * t,
  ];
}

function rgb2lab(rgb) {
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x, y, z;

  r = (r > 0.04045) ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
  g = (g > 0.04045) ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
  b = (b > 0.04045) ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = (x > 0.008856) ? x ** (1 / 3) : (7.787 * x) + 16 / 116;
  y = (y > 0.008856) ? y ** (1 / 3) : (7.787 * y) + 16 / 116;
  z = (z > 0.008856) ? z ** (1 / 3) : (7.787 * z) + 16 / 116;

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
}

function lab2rgb(lab){
  let y = (lab[0] + 16) / 116,
    x = lab[1] / 500 + y,
    z = y - lab[2] / 200,
    r, g, b;

  x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
  y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
  z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);

  r = x *  3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y *  1.8758 + z *  0.0415;
  b = x *  0.0557 + y * -0.2040 + z *  1.0570;

  r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
  g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
  b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;

  return [
    Math.max(0, Math.min(1, r)) * 255, 
    Math.max(0, Math.min(1, g)) * 255, 
    Math.max(0, Math.min(1, b)) * 255
  ];
}

const keys = { 32: 1, 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

function isDrawing() {
  return document.querySelector('#gameTools').style.display !== 'none' &&
           document.querySelector('body > div.game').style.display !== 'none' &&
           document.activeElement.tagName !== 'INPUT';
}

let supportsPassive = false;
try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
      return true;
    }
  }));
}
catch(e) {
  console.log(e);
}

const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.addEventListener(wheelEvent, preventDefault, wheelOpt);
  window.addEventListener('touchmove', preventDefault, wheelOpt);
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}