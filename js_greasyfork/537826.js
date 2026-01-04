// ==UserScript==
// @name        Zoom Hack[Evades.io]
// @namespace   Violentmonkey Scripts
// @match       *://evades.io/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      Drik
// @description zoom
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537826/Zoom%20Hack%5BEvadesio%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/537826/Zoom%20Hack%5BEvadesio%5D.meta.js
// ==/UserScript==


GM_addStyle(`
  .zoomMenu {
    position: fixed;
    top: 12px;
    left: 12px;
    background: linear-gradient(135deg, #1a202c, #2b6cb0);
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    z-index: 9999;
    width: 220px;
    font-family: -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .zoomMenu.hidden {
    display: none;
  }
  .zoomMenu h2 {
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(to right, #63b3ed, #9f7aea);
    -webkit-background-clip: text;
    color: transparent;
    margin: 0 0 12px;
  }
  .zoomControls {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  .zoomMenu button {
    width: 32px;
    height: 32px;
    background: #3182ce;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  .zoomMenu button:hover {
    background: #2b6cb0;
  }
  .zoomMenu input[type="range"] {
    flex: 1;
    height: 6px;
    background: #4a5568;
    border-radius: 999px;
    cursor: pointer;
    accent-color: #63b3ed;
  }
  .zoomMenu p {
    font-size: 12px;
    color: #e2e8f0;
    margin: 8px 0 0;
  }
  .zoomMenu span {
    font-weight: 600;
    color: #63b3ed;
  }
`);

let zoomMenu;

function getCamera() {
  const launcher = document.querySelector('div.quests-launcher');
  if (!launcher) return null;
  const reactKey = Object.keys(launcher).find(k => k.startsWith('__reactFiber$'));
  if (!reactKey) return null;
  return launcher[reactKey]?.memoizedProps?.children?._owner?.stateNode?.renderer?.camera;
}

function setZoom(value) {
  const camera = getCamera();
  if (camera) camera.scale = value;
}

setInterval(() => {
  if (!document.querySelector('canvas') || zoomMenu) return;
  const camera = getCamera();
  if (!camera) return;

  let currentZoom = GM_getValue('zoom', camera.scale);
  currentZoom = Math.max(0.1, Math.min(2, currentZoom));
  setZoom(currentZoom);

  zoomMenu = document.createElement('div');
  zoomMenu.className = 'zoomMenu';
  zoomMenu.innerHTML = `
    <h2>Zoom</h2>
    <div class="zoomControls">
      <button class="decrease">–</button>
      <input type="range" min="0.1" max="2" step="0.01" value="${currentZoom}">
      <button class="increase">+</button>
    </div>
    <p>Zoom: <span>${currentZoom.toFixed(2)}</span></p>
    <p>F10 – open/close</p>
  `;
  document.body.appendChild(zoomMenu);

  const rangeInput = zoomMenu.querySelector('input[type="range"]');
  const decrease = zoomMenu.querySelector('.decrease');
  const increase = zoomMenu.querySelector('.increase');
  const zoomText = zoomMenu.querySelector('span');

  const update = (v) => {
    v = Math.max(0.1, Math.min(2, v));
    setZoom(v);
    rangeInput.value = v.toFixed(2);
    zoomText.textContent = v.toFixed(2);
    GM_setValue('zoom', v);
  };

  rangeInput.addEventListener('input', () => update(parseFloat(rangeInput.value)));
  decrease.addEventListener('click', () => update(parseFloat(rangeInput.value) - 0.01));
  increase.addEventListener('click', () => update(parseFloat(rangeInput.value) + 0.01));
}, 500);

document.addEventListener('keydown', e => {
  if (e.key === 'F10' && zoomMenu) {
    zoomMenu.classList.toggle('hidden');
  }
});
