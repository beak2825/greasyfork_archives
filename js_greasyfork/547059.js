// ==UserScript==
// @name         Drawaria – Menú de Colores (Arcoíris)
// @namespace    https://example.com/userscripts
// @version      1.0.0
// @description  Agrega un botón flotante 🎮 que abre un menú con una sección "Colores" (incluye modo Arcoíris) para dibujar en drawaria.online. El color se fuerza a nivel de canvas para que funcione aunque la página cambie su UI.
// @match        https://drawaria.online/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547059/Drawaria%20%E2%80%93%20Men%C3%BA%20de%20Colores%20%28Arco%C3%ADris%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547059/Drawaria%20%E2%80%93%20Men%C3%BA%20de%20Colores%20%28Arco%C3%ADris%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** ---------------------------------------------
   *  ColorManager — Fuente de la verdad del color
   *  ---------------------------------------------
   */
  const ColorManager = {
    enabled: true,
    mode: localStorage.getItem('rainbow_menu_mode') || 'solid', // 'solid' | 'rainbow'
    color: localStorage.getItem('rainbow_menu_color') || '#ff007a',
    hue: parseInt(localStorage.getItem('rainbow_menu_hue') || '0', 10),
    getCurrentColor() {
      if (!this.enabled) return null;
      if (this.mode === 'rainbow') {
        const h = this.hue % 360;
        this.hue = (this.hue + 4) % 360; // velocidad del arcoíris
        localStorage.setItem('rainbow_menu_hue', String(this.hue));
        return `hsl(${h} 100% 50%)`;
      }
      return this.color;
    },
    setSolid(hex) {
      this.mode = 'solid';
      this.color = hex;
      localStorage.setItem('rainbow_menu_mode', 'solid');
      localStorage.setItem('rainbow_menu_color', hex);
    },
    setRainbow() {
      this.mode = 'rainbow';
      localStorage.setItem('rainbow_menu_mode', 'rainbow');
    }
  };

  /*** ---------------------------------------------
   *  Parcheo de CanvasRenderingContext2D
   *  ---------------------------------------------
   *  En vez de tocar la UI del juego, forzamos el color
   *  a nivel de canvas. Esto hace el script resistente
   *  a cambios en el DOM de drawaria.
   */
  function patchCtx(ctx) {
    if (!ctx || ctx.__rainbowPatched) return;

    const applyColor = () => {
      const c = ColorManager.getCurrentColor();
      if (c) {
        // Forzamos tanto trazo como relleno
        try { ctx.strokeStyle = c; } catch (e) {}
        try { ctx.fillStyle = c; } catch (e) {}
      }
    };

    const wrap = (obj, key, before) => {
      const orig = obj[key];
      if (typeof orig !== 'function') return;
      obj[key] = function (...args) {
        try { before && before(this, args); } catch (e) { /* noop */ }
        return orig.apply(this, args);
      };
    };

    // Cambiamos color en trazos y también mientras se dibujan segmentos
    wrap(ctx, 'stroke', () => applyColor());
    wrap(ctx, 'fill', () => applyColor());
    wrap(ctx, 'lineTo', () => applyColor());
    wrap(ctx, 'bezierCurveTo', () => applyColor());
    wrap(ctx, 'quadraticCurveTo', () => applyColor());
    wrap(ctx, 'arc', () => applyColor());

    ctx.__rainbowPatched = true;
  }

  // Parchear todos los contextos 2D existentes y futuros
  (function patchAllCanvases() {
    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
      const ctx = origGetContext.call(this, type, ...rest);
      if (type === '2d' && ctx) patchCtx(ctx);
      return ctx;
    };
    // Canvases ya presentes
    for (const cv of document.querySelectorAll('canvas')) {
      try { const c = cv.getContext('2d'); if (c) patchCtx(c); } catch (e) {}
    }
  })();

  /*** ---------------------------------------------
   *  UI — Botón 🎮 y Panel con "Colores"
   *  ---------------------------------------------
   */
  const style = document.createElement('style');
  style.textContent = `
    .rbw-floating-btn { position: fixed; right: 16px; bottom: 16px; z-index: 999999; width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer; font-size: 24px; box-shadow: 0 8px 24px rgba(0,0,0,.25); background: linear-gradient(135deg, #ff007a, #7a00ff); color: white; display:flex; align-items:center; justify-content:center; }
    .rbw-floating-btn:hover { transform: translateY(-1px); }

    .rbw-panel { position: fixed; right: 16px; bottom: 84px; width: 300px; max-width: calc(100vw - 32px); background: #0d0d10; color: white; border-radius: 16px; box-shadow: 0 16px 48px rgba(0,0,0,.35); overflow: hidden; z-index: 999998; display: none; }
    .rbw-panel.open { display: block; animation: rbw-pop .16s ease-out; }
    @keyframes rbw-pop { from { transform: translateY(6px); opacity: .6; } to { transform: translateY(0); opacity: 1; } }

    .rbw-header { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; background: linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet); color: #111; font-weight: 800; }
    .rbw-close { background: transparent; border: none; font-size: 18px; line-height: 1; cursor: pointer; padding: 6px; color: #111; }

    .rbw-body { padding: 10px 12px 14px; }
    .rbw-section { margin-top: 8px; border: 1px solid #2a2a33; border-radius: 12px; overflow: hidden; }

    .rbw-section-head { display:flex; align-items:center; justify-content:space-between; background:#15151b; padding: 8px 10px; cursor:pointer; }
    .rbw-section-title { font-weight: 700; }
    .rbw-toggle { border: none; background: #242432; color: #d9d9e3; border-radius: 10px; padding: 6px 10px; cursor:pointer; }

    .rbw-section-body { padding: 10px; display:none; }
    .rbw-section.open .rbw-section-body { display:block; }

    .rbw-swatches { display:grid; grid-template-columns: repeat(8, 1fr); gap: 6px; }
    .rbw-swatch { width: 28px; height: 28px; border-radius: 6px; border: 2px solid rgba(255,255,255,.25); cursor:pointer; }
    .rbw-swatch[aria-selected="true"] { outline: 2px solid white; outline-offset: 2px; }

    .rbw-chip { display:inline-flex; align-items:center; gap:8px; background:#15151b; border:1px solid #2a2a33; border-radius:999px; padding:6px 10px; font-size:12px; }
    .rbw-chip .dot { width:14px; height:14px; border-radius:50%; border:1px solid rgba(255,255,255,.35); }
  `;
  document.head.appendChild(style);

  // Botón flotante 🎮
  const fab = document.createElement('button');
  fab.className = 'rbw-floating-btn';
  fab.title = 'Abrir menú de dibujo';
  fab.textContent = '🎮';

  // Panel
  const panel = document.createElement('div');
  panel.className = 'rbw-panel';
  panel.innerHTML = `
    <div class="rbw-header">
      <div>Menú de Dibujo</div>
      <button class="rbw-close" title="Cerrar">✕</button>
    </div>
    <div class="rbw-body">
      <div class="rbw-chip" id="rbw-status">
        <span class="dot"></span>
        <span>Color activo</span>
      </div>

      <div class="rbw-section" id="rbw-colores">
        <div class="rbw-section-head">
          <div class="rbw-section-title">Colores</div>
          <button class="rbw-toggle" type="button">Mostrar</button>
        </div>
        <div class="rbw-section-body">
          <div class="rbw-swatches" id="rbw-swatches"></div>
          <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
            <button id="rbw-solid" class="rbw-toggle" type="button">Modo sólido</button>
            <button id="rbw-rainbow" class="rbw-toggle" type="button">Arcoíris</button>
            <input id="rbw-picker" type="color" style="margin-left:auto; background:#15151b; border:1px solid #2a2a33; border-radius:10px; width:44px; height:32px; padding:0;" title="Elegir color" />
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  // Interacciones del panel
  const closeBtn = panel.querySelector('.rbw-close');
  const coloresSection = panel.querySelector('#rbw-colores');
  const coloresToggle = coloresSection.querySelector('.rbw-toggle');
  const swatchesBox = panel.querySelector('#rbw-swatches');
  const picker = panel.querySelector('#rbw-picker');
  const btnSolid = panel.querySelector('#rbw-solid');
  const btnRainbow = panel.querySelector('#rbw-rainbow');
  const statusDot = panel.querySelector('#rbw-status .dot');

  const preset = [
    '#000000', '#444444', '#7f7f7f', '#bfbfbf', '#ffffff',
    '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#7f00ff', '#ff00ff',
    '#ff4d6d', '#ff8fa3', '#ffd166', '#06d6a0', '#118ab2', '#073b4c',
    '#f72585', '#b5179e', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0',
  ];

  function updateStatus() {
    const c = ColorManager.mode === 'rainbow' ? `conic-gradient(from 0deg, red, orange, yellow, green, cyan, blue, violet, red)` : ColorManager.color;
    statusDot.style.background = c;
  }

  function makeSwatches() {
    swatchesBox.innerHTML = '';
    // Swatch especial: Arcoíris
    const rainbow = document.createElement('button');
    rainbow.className = 'rbw-swatch';
    rainbow.title = 'Arcoíris';
    rainbow.style.background = 'conic-gradient(from 0deg, red, orange, yellow, green, cyan, blue, violet, red)';
    rainbow.addEventListener('click', () => {
      ColorManager.setRainbow();
      updateStatus();
      markSelected(null);
    });
    swatchesBox.appendChild(rainbow);

    // Swatches de colores sólidos
    for (const hex of preset) {
      const b = document.createElement('button');
      b.className = 'rbw-swatch';
      b.style.background = hex;
      b.setAttribute('data-hex', hex);
      b.addEventListener('click', () => {
        ColorManager.setSolid(hex);
        picker.value = hex;
        updateStatus();
        markSelected(hex);
      });
      swatchesBox.appendChild(b);
    }
  }

  function markSelected(hex) {
    for (const el of swatchesBox.querySelectorAll('.rbw-swatch')) {
      const isSel = el.getAttribute('data-hex') === hex && ColorManager.mode === 'solid';
      el.setAttribute('aria-selected', isSel ? 'true' : 'false');
    }
  }

  // Eventos UI
  fab.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  coloresToggle.addEventListener('click', () => {
    coloresSection.classList.toggle('open');
    coloresToggle.textContent = coloresSection.classList.contains('open') ? 'Ocultar' : 'Mostrar';
  });

  btnSolid.addEventListener('click', () => {
    if (ColorManager.mode !== 'solid') ColorManager.setSolid(ColorManager.color);
    updateStatus();
  });

  btnRainbow.addEventListener('click', () => {
    ColorManager.setRainbow();
    updateStatus();
    markSelected(null);
  });

  picker.addEventListener('input', (e) => {
    ColorManager.setSolid(e.target.value);
    updateStatus();
    markSelected(e.target.value.toLowerCase());
  });

  // Inicialización
  makeSwatches();
  updateStatus();
  markSelected(ColorManager.mode === 'solid' ? ColorManager.color.toLowerCase() : null);

  // Auto-abrir la sección de Colores la primera vez
  if (!localStorage.getItem('rainbow_menu_seen')) {
    panel.classList.add('open');
    coloresSection.classList.add('open');
    coloresToggle.textContent = 'Ocultar';
    localStorage.setItem('rainbow_menu_seen', '1');
  }
})();
