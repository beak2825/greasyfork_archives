// ==UserScript==
// @name        Wplace Overlay Pro Symbol Viewer
// @namespace   Violentmonkey Scripts
// @match       https://wplace.live/*
// @grant       none
// @license MIT
// @version     1.55
// @author      Dylan Dang, Zex2
// @description Adds an ability to see the mapped symbol for colors for Overlay Pro for wplace within the paint menu
// @downloadURL https://update.greasyfork.org/scripts/545806/Wplace%20Overlay%20Pro%20Symbol%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/545806/Wplace%20Overlay%20Pro%20Symbol%20Viewer.meta.js
// ==/UserScript==
  
(function () {
  const SYMBOL_TILES = {
    Black: 4897444,
    'Dark Gray': 4756004,
    Gray: 15241774,
    'Light Gray': 11065002,
    White: 15269550,
    'Deep Red': 33209205,
    Red: 15728622,
    Orange: 15658734,
    Gold: 33226431,
    Yellow: 33391295,
    'Light Yellow': 32641727,
    'Dark Green': 15589098,
    Green: 11516906,
    'Light Green': 9760338,
    'Dark Teal': 15399560,
    Teal: 4685802,
    'Light Teal': 15587182,
    Cyan: 29206876,
    'Dark Blue': 3570904,
    Blue: 15259182,
    Indigo: 29224831,
    'Light Indigo': 21427311,
    'Dark Purple': 22511061,
    Purple: 15161013,
    'Light Purple': 4667844,
    'Dark Pink': 11392452,
    Pink: 11375466,
    'Light Pink': 6812424,
    'Dark Brown': 5225454,
    Brown: 29197179,
    Beige: 18285009,
    'Medium Gray': 31850982,
    'Dark Red': 19267878,
    'Light Red': 16236308,
    'Dark Orange': 33481548,
    'Dark Goldenrod': 22708917,
    Goldenrod: 14352822,
    'Light Goldenrod': 7847326,
    'Dark Olive': 7652956,
    Olive: 22501038,
    'Light Olive': 28457653,
    'Dark Cyan': 9179234,
    'Light Cyan': 30349539,
    'Light Blue': 4685269,
    'Dark Indigo': 18295249,
    'Dark Slate Blue': 26843769,
    'Slate Blue': 24483191,
    'Light Slate Blue': 5211003,
    'Dark Peach': 14829567,
    Peach: 17971345,
    'Light Peach': 28873275,
    'Light Brown': 4681156,
    'Dark Tan': 21392581,
    Tan: 7460636,
    'Light Tan': 23013877,
    'Dark Beige': 29010254,
    'Light Beige': 18846257,
    'Dark Stone': 21825364,
    Stone: 29017787,
    'Light Stone': 4357252,
    'Dark Slate': 23057550,
    Slate: 26880179,
    'Light Slate': 5242308,
    idk: 15237450,
  };
  const SYMBOL_W = 5;
  const SYMBOL_H = 5;
  
  // [persist]
  const STORAGE_KEY = 'wplace.symbolViewer.symbolMode';
  // [persist]
  const loadSymbolMode = () => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  };
  // [persist]
  const saveSymbolMode = (v) => {
    try { localStorage.setItem(STORAGE_KEY, v ? '1' : '0'); } catch {}
  };
  
  function createSymbolCanvas(symbol, color) {
    const canvas = document.createElement('canvas');
    canvas.width = SYMBOL_W;
    canvas.height = SYMBOL_H;
    canvas.style.imageRendering = 'pixelated';
    const ctx = canvas.getContext('2d');
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    for (let y = 0; y < SYMBOL_H; y++) {
      for (let x = 0; x < SYMBOL_W; x++) {
        const bit_idx = y * SYMBOL_W + x;
        const bit = (symbol >>> bit_idx) & 1;
        if (bit) ctx.fillRect(x, y, 1, 1);
      }
    }
    canvas.style.filter = 'drop-shadow(0px 0px 1px black)';
    canvas.style.height = '100%';
    canvas.style.padding = '5px';
    return canvas;
  }
  
  function patchButton(btn) {
    if (btn.querySelector('canvas')) return;
    const colorName = btn.ariaLabel;
    if (!(colorName in SYMBOL_TILES)) return;
  
    const symbol = SYMBOL_TILES[colorName];
    const color = btn.style.backgroundColor;
    const canvas = createSymbolCanvas(symbol, color);
    canvas.dataset.color = color;
    btn.style.backgroundColor = 'transparent';
    btn.appendChild(canvas);
  }
  
  // [persist] initialize from storage
  let symbolMode = loadSymbolMode();
  
  mutationObserver = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches('.absolute.bottom-0.left-0.z-50.w-full')) {
          const menubar = node.querySelector('.flex.grow.items-center');
          const btn = document.createElement('button');
          btn.classList.add(
            'btn',
            'btn-sm',
            'btn-circle',
            'btn-ghost',
            'text-base-content/80'
          );
          // [persist] set initial visual state without adding "undefined" class
          if (symbolMode) btn.classList.add('text-primary');
  
          btn.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentcolor"><path d="M120-800v-80h320v80H120Zm120 280v-160H120v-80h320v80H320v160h-80ZM548-96l-56-56 312-312 56 56L548-96Zm32-224q-26 0-43-17t-17-43q0-26 17-43t43-17q26 0 43 17t17 43q0 26-17 43t-43 17Zm200 200q-26 0-43-17t-17-43q0-26 17-43t43-17q26 0 43 17t17 43q0 26-17 43t-43 17ZM620-520q-41 0-70.5-29.5T520-620q0-41 29.5-71.5T620-722q12 0 21.5 1.5T660-716v-124q0-17 11.5-28.5T700-880h140v80H720v180q0 41-29.5 70.5T620-520ZM220-80q-41 0-70.5-30.5T120-182q0-18 7.5-36.5T150-252l42-42-14-14q-15-15-22.5-32.5T148-378q0-41 29.5-70.5T248-478q41 0 70.5 29.5T348-378q0 20-6.5 37.5T320-308l-14 14 28 28 56-56 56 58-56 56 56 56-56 56-56-56-42 42q-15 15-33.5 22.5T220-80Zm28-270 14-14q3-3 4.5-6t1.5-8q0-9-6-14.5t-14-5.5q-8 0-14 5.5t-6 14.5q0 3 1.5 7t4.5 7l14 14Zm-30 190q3 0 8-1.5t8-4.5l44-42-28-28-44 42q-3 3-4.5 7t-1.5 9q0 8 5 13t13 5Z"/></svg>';
          menubar.appendChild(btn);
  
          const grid = node.querySelector('.grid');
          function updateGrid() {
            if (symbolMode) {
              for (const button of grid.querySelectorAll('.btn')) {
                patchButton(button);
              }
            } else {
              for (const canvas of grid.querySelectorAll('canvas')) {
                const cell = canvas.parentElement;
                cell.style.backgroundColor = canvas.dataset.color;
                canvas.remove();
              }
            }
          }
  
          btn.addEventListener('click', () => {
            if (symbolMode) {
              btn.classList.remove('text-primary');
            } else {
              btn.classList.add('text-primary');
            }
            symbolMode = !symbolMode;
            saveSymbolMode(symbolMode); // [persist]
            updateGrid();
          });
  
          updateGrid();
        }
  
        if (
          symbolMode &&
          node.matches('.tooltip') &&
          node.dataset.tip in SYMBOL_TILES
        ) {
          patchButton(node.querySelector('button'));
        }
      }
    }
  });
  
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();