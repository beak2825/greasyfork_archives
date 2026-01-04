// ==UserScript==
// @name        Ellipse/Circle Tool
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.1.0
// @license     MIT
// @author      Bell
// @description Hold G and click/drag to draw an ellipse. Hold G and Space for a circle. 
// @downloadURL https://update.greasyfork.org/scripts/424034/EllipseCircle%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/424034/EllipseCircle%20Tool.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const canvas = document.querySelector('#canvas');
const lineCanvas = document.createElement('canvas');
const lineCtx = lineCanvas.getContext('2d');
lineCanvas.style.position = 'absolute';
lineCanvas.style.cursor = 'crosshair';
lineCanvas.style.width = '100%';
lineCanvas.style.display = 'none';
lineCanvas.style.userSelect = 'none';
lineCanvas.style.zIndex = '2';
lineCanvas.oncontextmenu = () => { return false; };
[lineCanvas.width, lineCanvas.height] = [canvas.width, canvas.height];
canvas.parentElement.insertBefore(lineCanvas, canvas);
lineCanvas.clear = () => {
  lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
};

let circleDrawing = false;
let origin = {};
let realOrigin = {};
let previewPos = {};
let realPos = {};
let canvasHidden = true;
let drawingLine = false;
let snap = false;
let queueKeyUp = false;
let currentColor = 'black';

document.addEventListener('keydown', (e) => {
  if (!isDrawing() || circleDrawing) return;
  if (e.code === 'KeyG' && canvasHidden) {
    lineCanvas.style.display = '';
    disableScroll();
    canvasHidden = false;
  }
  else if (e.code === 'Space' && !snap && !canvasHidden) {
    snap = true;
    document.dispatchEvent(createMouseEvent('pointermove', realPos));
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && snap) {
    snap = false;
    document.dispatchEvent(createMouseEvent('pointermove', realPos));
  }
	
  if (e.code === 'KeyG' && !canvasHidden) {
    if (circleDrawing) {
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
  drawPreviewCircle(lineCtx, previewPos);
  e.preventDefault();
}

lineCanvas.addEventListener('pointerdown', (e) => {
  if (circleDrawing) return;
  origin = getPos(e);
  realOrigin = getRealPos(e);
  drawingLine = true;
  currentColor = getCurrentColor();
  document.addEventListener('pointerup', pointerUpDraw);
  document.addEventListener('pointermove', savePos);
});

function pointerUpDraw(e) {
  document.removeEventListener('pointermove', savePos);
  document.removeEventListener('pointerup', pointerUpDraw);
  drawCircle(realOrigin.x, realOrigin.y, realPos.x, realPos.y);
  previewPos = getPos(e);
  realPos = getRealPos(e);
  resetLineCanvas();
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

function getCurrentColor() {
  const regex = /(?:(rgb\(\d+,\s+\d+,\s+\d+\))|#(?:[0-9A-Fa-f]{3}){1,2})/;
  return document.querySelector('#extraCSS').textContent.match(regex)[0];
}

function drawPreviewCircle(ctx, pos) {
  const radiusX = (pos.x - origin.x) / 2;
  const radiusY = snap ? radiusX : (pos.y - origin.y) / 2;

  const brushWidth = parseInt(document.querySelector("#gameToolsColorPreview").value);
  
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = currentColor;
  ctx.ellipse(origin.x + radiusX, origin.y + radiusY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, 2 * Math.PI);
  ctx.stroke();
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(time), time);
  });
}

async function drawCircle(x1, y1, x2, y2) {
  circleDrawing = true;

  const radiusX = (x2 - x1) / 2;
  const radiusY = snap ? radiusX : (y2 - y1) / 2;
  
  const startX = radiusX * Math.cos(0) + radiusX + x1;
  const startY = radiusY * Math.sin(0) + radiusY + y1;
  
  let x = startX;
  let y = startY;
  
  for (let i = 0; i <= Math.PI * 2; i += 0.2) {
    const newX = radiusX * Math.cos(i) + radiusX + x1;
    const newY = radiusY * Math.sin(i) + radiusY + y1;
    drawLine(x, y, newX, newY);
    await delay(10);
    x = newX;
    y = newY;
  }
  
  drawLine(x, y, startX, startY);
  canvas.dispatchEvent(createMouseEvent('pointerup', { x: 0, y: 0 }, true));
  circleDrawing = false;

  if (queueKeyUp) { 
    onKeyUp();
    queueKeyUp = false;
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