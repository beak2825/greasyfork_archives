// ==UserScript==
// @license MIT
// @name         Nuked Ware V2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Best Level Medium Free Cheat for 1v1.lol with advanced features
// @author       Nuked Rust
// @match        *://1v1.lol/*
// @icon         data:image/png;base64,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
// @grant        none
// @run-at       document-start
// @antifeature  ads
// @supportURL   https://nkeac.zya.me/nukedcheats/
// @downloadURL https://update.greasyfork.org/scripts/518321/Nuked%20Ware%20V20.user.js
// @updateURL https://update.greasyfork.org/scripts/518321/Nuked%20Ware%20V20.meta.js
// ==/UserScript==

// Aimbot configuration
const searchSize = 75;
const threshold = 3.8;
const aimbotSpeed = 0.25;

// Feature toggles
let aimbotEnabled = false;
let espEnabled = false;
let wireframeEnabled = false;

const WebGL = WebGL2RenderingContext.prototype;

// Enable drawing buffer preservation (required for pixel reading in aimbot)
HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
  apply(target, thisArgs, args) {
    if (args[1]) {
      args[1].preserveDrawingBuffer = true;
    }
    return Reflect.apply(...arguments);
  }
});

// ESP and Aimbot: Modify shaders to implement wall hacks
WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
  apply(target, thisArgs, args) {
    if (args[1].indexOf('gl_Position') > -1) {
      args[1] = args[1].replace('void main', `
        out float vDepth;
        uniform bool enabled;
        uniform float threshold;
        void main
      `).replace(/return;/, `
        vDepth = gl_Position.z;
        if (enabled && vDepth > threshold) {
          gl_Position.z = 1.0;
        }
      `);
    } else if (args[1].indexOf('SV_Target0') > -1) {
      args[1] = args[1].replace('void main', `
        in float vDepth;
        uniform bool enabled;
        uniform float threshold;
        void main
      `).replace(/return;/, `
        if (enabled && vDepth > threshold) {
          SV_Target0 = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `);
    }
    return Reflect.apply(...arguments);
  }
});

// Helper function for shader uniforms
WebGL.getUniformLocation = new Proxy(WebGL.getUniformLocation, {
  apply(target, thisArgs, [program, name]) {
    const result = Reflect.apply(...arguments);
    if (result) {
      result.name = name;
      result.program = program;
    }
    return result;
  }
});

// Identify UI elements to prevent wireframe from affecting them
WebGL.uniform4fv = new Proxy(WebGL.uniform4fv, {
  apply(target, thisArgs, args) {
    if (args[0].name === 'hlslcc_mtx4x4unity_ObjectToWorld') {
      args[0].program.isUIProgram = true;
    }
    return Reflect.apply(...arguments);
  }
});

// Aimbot variables
let movementX = 0, movementY = 0;
let count = 0;

// Main game rendering proxy: implements ESP, Aimbot, and Wireframe
WebGL.drawElements = new Proxy(WebGL.drawElements, {
  apply(target, thisArgs, args) {
    const program = thisArgs.getParameter(thisArgs.CURRENT_PROGRAM);
    if (!program.uniforms) {
      program.uniforms = {
        enabled: thisArgs.getUniformLocation(program, 'enabled'),
        threshold: thisArgs.getUniformLocation(program, 'threshold')
      };
    }
    const couldBePlayer = args[1] > 4000;

    // ESP and Aimbot: Enable shader modifications
    thisArgs.uniform1i(program.uniforms.enabled, (espEnabled || aimbotEnabled) && couldBePlayer);
    thisArgs.uniform1f(program.uniforms.threshold, threshold);

    // Wireframe: Change rendering mode to lines
    args[0] = wireframeEnabled && !program.isUIProgram && args[1] > 6 ? thisArgs.LINES : args[0];
    Reflect.apply(...arguments);

    // Aimbot: Detect and calculate aim adjustments
    if (aimbotEnabled && couldBePlayer) {
      const width = Math.min(searchSize, thisArgs.canvas.width);
      const height = Math.min(searchSize, thisArgs.canvas.height);
      const pixels = new Uint8Array(width * height * 4);
      const centerX = thisArgs.canvas.width / 2;
      const centerY = thisArgs.canvas.height / 2;
      const x = Math.floor(centerX - width / 2);
      const y = Math.floor(centerY - height / 2);
      thisArgs.readPixels(x, y, width, height, thisArgs.RGBA, thisArgs.UNSIGNED_BYTE, pixels);
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] === 255 && pixels[i + 1] === 0 && pixels[i + 2] === 0 && pixels[i + 3] === 255) {
          const idx = i / 4;
          const dx = idx % width;
          const dy = (idx - dx) / width;
          movementX += (x + dx - centerX);
          movementY += -(y + dy - centerY);
          count++;
        }
      }
    }
  }
});

// Aimbot: Apply calculated aim adjustments
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
  apply(target, thisArgs, args) {
    args[0] = new Proxy(args[0], {
      apply() {
        const isPlaying = document.querySelector('canvas').style.cursor === 'none';
        rangeEl.style.display = isPlaying && aimbotEnabled ? '' : 'none';
        if (count > 0 && isPlaying) {
          const f = aimbotSpeed / count;
          movementX *= f;
          movementY *= f;
          window.dispatchEvent(new MouseEvent('mousemove', { movementX, movementY }));
          rangeEl.classList.add('range-active');
        } else {
          rangeEl.classList.remove('range-active');
        }
        movementX = 0;
        movementY = 0;
        count = 0;
        return Reflect.apply(...arguments);
      }
    });
    return Reflect.apply(...arguments);
  }
});

const styles = `
:root { --radius: 0; }
@font-face {
  font-family: 'Russo One';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/russoone/v14/Z9XUDmZRWg6M1LvRYsHOz8mJ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
.dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 20px;
  background: rgba(131, 100, 226, 0.9);
  color: #fff;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 999999;
  font-family: 'Russo One', sans-serif;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}
.dialog-header {
  padding: 10px;
  cursor: move;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px 10px 0 0;
}
.close {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 20px;
  height: 20px;
  opacity: 0.5;
  cursor: pointer;
}
.close:before, .close:after {
  content: ' ';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 20%;
  transform: translate(-50%, -50%) rotate(-45deg);
  background: #fff;
}
.close:after {
  transform: translate(-50%, -50%) rotate(45deg);
}
.close:hover {
  opacity: 1;
}
.btn {
  cursor: pointer;
  padding: 0.7em;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  margin: 10px;
  text-align: center;
  border-radius: 5px;
  transition: all 0.3s ease;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}
.btn:active {
  transform: scale(0.95);
}
.msg {
  position: absolute;
  left: 10px;
  bottom: 10px;
  background: rgba(30, 41, 74, 0.8);
  color: #fff;
  font-family: 'Russo One', sans-serif;
  font-weight: bolder;
  padding: 15px;
  animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
  z-index: 999999;
  pointer-events: none;
  border-radius: 5px;
}
@keyframes msg {
  from { transform: translate(-120%, 0); }
  to { transform: none; }
}
.range {
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${searchSize}px;
  height: ${searchSize}px;
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
  border: 1px solid white;
  transform: translate(-50%, -50%);
}
.range-active {
  border: 2px solid #45ff99;
  box-shadow: 0 0 50px 15px rgba(69, 255, 153, 0.5);
}
.toggle-btn {
  display: inline-block;
  margin: 5px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  cursor: pointer;
}
.toggle-btn.active {
  background: rgba(0, 255, 0, 0.3);
}
`;

const menuHTML = `
<div class="dialog" id="cheatMenu">
  <div class="dialog-header">Nuked Ware 1v1.lol</div>
  <div class="close" onclick="this.parentNode.style.display='none';"></div>
  <div class="celemenu">
    <div class="toggle-btn" id="aimbotToggle">Aimbot: OFF</div>
    <div class="toggle-btn" id="espToggle">ESP: OFF</div>
    <div class="toggle-btn" id="wireframeToggle">Wireframe: ON</div>
    <br><br>
    <small>[H] to show/hide menu</small>
    <br><br>
    <div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 5px;">
      <div class="btn" onclick="window.open('', '_blank')">Discord</div>
      <div class="btn" onclick="window.open('', '_blank')">Latest video</div>
    </div>
  </div>
</div>
<div class="msg" style="display: none;"></div>
<div class="range" style="display: none;"></div>
`;

let isDragging = false;
let dragOffsetX, dragOffsetY;

function nukedDraggable(element) {
  const header = element.querySelector('.dialog-header');

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - element.offsetLeft;
    dragOffsetY = e.clientY - element.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      element.style.left = (e.clientX - dragOffsetX) + 'px';
      element.style.top = (e.clientY - dragOffsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

window.addEventListener('DOMContentLoaded', function () {
  document.body.insertAdjacentHTML('beforeend', menuHTML);
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  const cheatMenu = document.getElementById('cheatMenu');
  nukedDraggable(cheatMenu);

  const msgEl = document.querySelector('.msg');
  const rangeEl = document.querySelector('.range');
  const aimbotToggle = document.getElementById('aimbotToggle');
  const espToggle = document.getElementById('espToggle');
  const wireframeToggle = document.getElementById('wireframeToggle');

  aimbotToggle.addEventListener('click', () => nukedFeature('Aimbot', aimbotToggle));
  espToggle.addEventListener('click', () => nukedFeature('ESP', espToggle));
  wireframeToggle.addEventListener('click', () => nukedFeature('Wireframe', wireframeToggle));

  // Initialize toggle states
  updateToggleState(wireframeToggle, wireframeEnabled);
});

function nukedFeature(feature, element) {
  switch (feature) {
    case 'Aimbot':
      aimbotEnabled = !aimbotEnabled;
      break;
    case 'ESP':
      espEnabled = !espEnabled;
      break;
    case 'Wireframe':
      wireframeEnabled = !wireframeEnabled;
      break;
  }
  updateToggleState(element, feature === 'Aimbot' ? aimbotEnabled : (feature === 'ESP' ? espEnabled : wireframeEnabled));
  nukedsMsg(feature, feature === 'Aimbot' ? aimbotEnabled : (feature === 'ESP' ? espEnabled : wireframeEnabled));
}

function updateToggleState(element, state) {
  element.textContent = `${element.textContent.split(':')[0]}: ${state ? 'ON' : 'OFF'}`;
  element.classList.toggle('active', state);
}

function nukedsMsg(name, bool) {
  const msgEl = document.querySelector('.msg');
  msgEl.innerText = name + ': ' + (bool ? 'ON' : 'OFF');
  msgEl.style.display = 'none';
  void msgEl.offsetWidth;
  msgEl.style.display = '';
}

window.addEventListener('keyup', function (event) {
  const key = event.key.toUpperCase();
  switch (key) {
    case 'M':
      nukedFeature('ESP', document.getElementById('espToggle'));
      break;
    case 'N':
      nukedFeature('Wireframe', document.getElementById('wireframeToggle'));
      break;
    case 'T':
      nukedFeature('Aimbot', document.getElementById('aimbotToggle'));
      break;
    case 'H':
      const cheatMenu = document.getElementById('cheatMenu');
      cheatMenu.style.display = cheatMenu.style.display === 'none' ? 'block' : 'none';
      break;
  }
});